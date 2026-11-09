/* KI-Stimme im Browser: Piper (VITS) über onnxruntime-web. Läuft komplett auf dem Gerät. */
/* global ort, createPiperPhonemize */
importScripts('ort.min.js', 'piper_phonemize.js');

const VOICE = 'de_DE-thorsten-medium';
const BASE = self.location.href.replace(/[^/]*$/, '');
let cfg, session, phWasm, phData;
let initPromise = null;

async function fetchWithProgress(url, onProgress) {
  const res = await fetch(url);
  if (!res.ok) throw new Error('Download fehlgeschlagen: ' + url);
  const total = Number(res.headers.get('Content-Length')) || 63201294;
  if (!res.body || !res.body.getReader) return res.arrayBuffer();
  const reader = res.body.getReader();
  // Direkt in einen Puffer schreiben: spart auf dem Handy Arbeitsspeicher
  let out = new Uint8Array(total);
  let got = 0;
  let last = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    if (got + value.length > out.length) {
      const bigger = new Uint8Array(Math.max(out.length * 2, got + value.length));
      bigger.set(out.subarray(0, got));
      out = bigger;
    }
    out.set(value, got);
    got += value.length;
    const p = Math.min(1, got / total);
    if (p - last >= 0.01 || p === 1) { last = p; onProgress(p); }
  }
  return got === out.length ? out.buffer : out.slice(0, got).buffer;
}

function init() {
  if (initPromise) return initPromise;
  initPromise = (async () => {
    ort.env.wasm.numThreads = 1;
    ort.env.wasm.wasmPaths = BASE;
    postMessage({ type: 'progress', p: 0, stage: 'Sprachdaten' });
    const [c, w, d] = await Promise.all([
      fetch(BASE + VOICE + '.onnx.json').then((r) => { if (!r.ok) throw new Error('Stimme nicht gefunden'); return r.json(); }),
      fetch(BASE + 'piper_phonemize.wasm').then((r) => r.arrayBuffer()),
      fetch(BASE + 'piper_phonemize.data').then((r) => r.arrayBuffer()),
    ]);
    cfg = c; phWasm = w; phData = d;
    const model = await fetchWithProgress(BASE + VOICE + '.onnx', (p) => postMessage({ type: 'progress', p, stage: 'Stimme' }));
    postMessage({ type: 'progress', p: 1, stage: 'Starte' });
    session = await ort.InferenceSession.create(model, { executionProviders: ['wasm'], graphOptimizationLevel: 'all' });
  })();
  initPromise.catch(() => { initPromise = null; });
  return initPromise;
}

function phonemize(text) {
  return new Promise((resolve, reject) => {
    const ids = [];
    let failed = false;
    createPiperPhonemize({
      print: (line) => {
        try {
          const o = JSON.parse(line);
          if (o && o.phoneme_ids) ids.push(...o.phoneme_ids);
        } catch { /* andere Ausgaben ignorieren */ }
      },
      printErr: (line) => { if (/error/i.test(line)) { failed = true; reject(new Error(line)); } },
      wasmBinary: new Uint8Array(phWasm.slice(0)),
      getPreloadedPackage: () => phData.slice(0),
      locateFile: (f) => BASE + f,
    }).then((m) => {
      m.callMain(['-l', cfg.espeak.voice, '--input', JSON.stringify([{ text }]), '--espeak_data', '/espeak-ng-data']);
      if (!failed) resolve(ids);
    }).catch(reject);
  });
}

function toWav(f32, rate) {
  const buf = new ArrayBuffer(44 + f32.length * 2);
  const v = new DataView(buf);
  const str = (o, s) => { for (let i = 0; i < s.length; i++) v.setUint8(o + i, s.charCodeAt(i)); };
  str(0, 'RIFF'); v.setUint32(4, 36 + f32.length * 2, true); str(8, 'WAVE'); str(12, 'fmt ');
  v.setUint32(16, 16, true); v.setUint16(20, 1, true); v.setUint16(22, 1, true);
  v.setUint32(24, rate, true); v.setUint32(28, rate * 2, true); v.setUint16(32, 2, true); v.setUint16(34, 16, true);
  str(36, 'data'); v.setUint32(40, f32.length * 2, true);
  let o = 44;
  for (let i = 0; i < f32.length; i++, o += 2) {
    const s = Math.max(-1, Math.min(1, f32[i]));
    v.setInt16(o, s < 0 ? s * 0x8000 : s * 0x7fff, true);
  }
  return buf;
}

async function synth(text, rate) {
  await init();
  const ids = await phonemize(text);
  if (!ids.length) return { wav: toWav(new Float32Array(2205), cfg.audio.sample_rate), seconds: 0.1 };
  const inf = cfg.inference;
  const feeds = {
    input: new ort.Tensor('int64', BigInt64Array.from(ids.map((x) => BigInt(x))), [1, ids.length]),
    input_lengths: new ort.Tensor('int64', BigInt64Array.from([BigInt(ids.length)])),
    scales: new ort.Tensor('float32', Float32Array.from([inf.noise_scale, inf.length_scale / (rate || 1), inf.noise_w])),
  };
  if (cfg.speaker_id_map && Object.keys(cfg.speaker_id_map).length) feeds.sid = new ort.Tensor('int64', BigInt64Array.from([0n]));
  const out = await session.run(feeds);
  const data = out.output.data;
  // kurze Pause am Satzende, damit die Teile nicht aneinanderkleben
  const pad = Math.round(cfg.audio.sample_rate * 0.18);
  const withPad = new Float32Array(data.length + pad);
  withPad.set(data);
  return { wav: toWav(withPad, cfg.audio.sample_rate), seconds: withPad.length / cfg.audio.sample_rate };
}

// Aufträge nacheinander abarbeiten
let queue = Promise.resolve();
self.onmessage = (e) => {
  const m = e.data;
  if (m.type === 'init') {
    init().then(() => postMessage({ type: 'ready' }), (err) => postMessage({ type: 'error', error: String(err && err.message || err) }));
  } else if (m.type === 'synth') {
    queue = queue.then(async () => {
      try {
        const t0 = Date.now();
        const r = await synth(m.text, m.rate);
        postMessage({ type: 'audio', id: m.id, wav: r.wav, seconds: r.seconds, ms: Date.now() - t0 }, [r.wav]);
      } catch (err) {
        postMessage({ type: 'error', id: m.id, error: String(err && err.message || err) });
      }
    });
  }
};
