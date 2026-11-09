// Legt die Dateien für die KI-Stimme (Piper, läuft im Browser) nach public/tts/.
// Aufruf: npm run voice   – wird beim Veröffentlichen automatisch ausgeführt.
import { copyFile, mkdir, stat, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const out = path.join(root, 'public', 'tts');
const VOICE = 'de_DE-thorsten-medium';
// Feste Revision des Stimmen-Archivs, damit sich die Datei nicht unbemerkt ändert
// Wichtig: Diese Modellversion (Piper 1.0) passt zum Phonemizer aus @diffusionstudio/piper-wasm.
// Neuere Modelle aus rhasspy/piper-voices erwarten andere Lautzeichen und verschlucken dann z. B. das R.
const REV = '840e38a7e26d813bd6221b78cfbaefa3585b3f71';
const HF = `https://huggingface.co/diffusionstudio/piper-voices/resolve/${REV}/de/de_DE/thorsten/medium`;
const SHA256 = '7e64762d8e5118bb578f2eea6207e1a35a8e0c30595010b666f983fc87bb7819';

const exists = async (f) => stat(f).then((s) => s.size > 0, () => false);

await mkdir(out, { recursive: true });

const copies = [
  ['node_modules/onnxruntime-web/dist/ort.min.js', 'ort.min.js'],
  ['node_modules/onnxruntime-web/dist/ort-wasm-simd.wasm', 'ort-wasm-simd.wasm'],
  ['node_modules/onnxruntime-web/dist/ort-wasm.wasm', 'ort-wasm.wasm'],
  ['node_modules/@diffusionstudio/piper-wasm/build/piper_phonemize.js', 'piper_phonemize.js'],
  ['node_modules/@diffusionstudio/piper-wasm/build/piper_phonemize.wasm', 'piper_phonemize.wasm'],
  ['node_modules/@diffusionstudio/piper-wasm/build/piper_phonemize.data', 'piper_phonemize.data'],
];
for (const [from, to] of copies) await copyFile(path.join(root, from), path.join(out, to));

for (const name of [`${VOICE}.onnx.json`, `${VOICE}.onnx`]) {
  const target = path.join(out, name);
  if (await exists(target) && name.endsWith('.json')) continue;
  if (await exists(target) && createHash('sha256').update(await readFile(target)).digest('hex') === SHA256) continue;
  console.log('Lade', name, '…');
  const res = await fetch(`${HF}/${name}`);
  if (!res.ok) throw new Error(`Download fehlgeschlagen (${res.status}): ${name}`);
  await writeFile(target, Buffer.from(await res.arrayBuffer()));
}

const sum = createHash('sha256').update(await readFile(path.join(out, `${VOICE}.onnx`))).digest('hex');
if (sum !== SHA256) throw new Error('Die Stimm-Datei hat eine unerwartete Prüfsumme.');
console.log('KI-Stimme bereit in public/tts/');
