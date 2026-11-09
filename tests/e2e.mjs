// Browser-Durchlauf: node tests/e2e.mjs <url>
import puppeteer from 'puppeteer-core';

const url = process.argv[2] ?? 'http://localhost:4173/';
const errors = [];
const log = (...a) => console.log('•', ...a);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const browser = await puppeteer.launch({ executablePath: process.env.CHROME_PATH ?? '/usr/bin/google-chrome', headless: 'new', args: ['--no-sandbox'] });
const page = await browser.newPage();
page.on('pageerror', (e) => errors.push('pageerror: ' + e.message));
page.on('console', (m) => { if (m.type() === 'error' && !m.text().includes('Failed to load resource')) errors.push('console: ' + m.text()); });
await page.setViewport({ width: 1280, height: 900 });

async function clickText(text, sel = 'button') {
  const ok = await page.evaluate((text, sel) => {
    const el = [...document.querySelectorAll(sel)].find((b) => b.textContent.trim().includes(text) && !b.disabled);
    if (el) { el.click(); return true; }
    return false;
  }, text, sel);
  if (!ok) throw new Error(`Button nicht gefunden: ${text}`);
  await sleep(150);
}
const has = (t) => page.evaluate((t) => document.body.textContent.includes(t), t);
async function expectText(t) { if (!(await has(t))) throw new Error(`Text fehlt: ${t}`); }

await page.goto(url, { waitUntil: 'networkidle0' });
await expectText('Willkommen im Prüfungstrainer');
log('Dashboard ok');

// Navigation durch alle Seiten
for (const [nav, text] of [['Unterricht', 'Alle Themen der AP1'], ['Lernmodus', 'Üben ohne Zeitdruck'], ['Prüfung', 'Prüfungssimulation AP1'], ['Wiederholen', 'Wiederholungsbereich'], ['Lernkarten', 'Schnell wiederholen'], ['Lernplan', 'Was du als Nächstes'], ['Einstellungen', 'Lernfortschritt sichern'], ['Dashboard', 'Willkommen']]) {
  await page.evaluate((nav) => [...document.querySelectorAll('.nav button')].find((b) => b.textContent.includes(nav)).click(), nav);
  await sleep(200);
  await expectText(text);
}
log('Navigation ok');

// Unterricht Subnetting: Abschnitte, Verständnisfrage, Widget
await page.goto(url + '#thema-subnetting'); await sleep(300);
await expectText('Was ist eine IP-Adresse?');
await page.evaluate(() => document.querySelector('.card.tint .opt:nth-child(2)').click()); // 32 Bit = Index 1
await sleep(100);
await expectText('Richtig.');
for (let i = 0; i < 4; i++) await clickText('Weiter');
await clickText('Unterricht abschließen');
await expectText('Subnetz-Rechner');
await expectText('255.255.255.240');
await page.type('#sn-a1', '0.0.0.0');
await clickText('Prüfen');
await expectText('Netzadresse falsch');
log('Unterricht + Subnetz-Trainer ok');

// Vorlesen
await page.goto(url + '#thema-osi'); await sleep(250);
const speakBtns = await page.$$eval('.speak-btn', (b) => b.length);
if (!speakBtns) throw new Error('Kein Vorlesen-Knopf');
await page.click('.speak-btn'); await sleep(300);
await page.goto(url + '#optionen'); await sleep(200);
await expectText('Vorlesen');
await clickText('Langsam');
log('Vorlesen ok');

// Alle Themen-Widgets und Zusammenfassungen rendern
for (const t of ['hardware', 'ergonomie', 'netzwerk', 'osi', 'software', 'sicherheit', 'datenschutz', 'rechnen', 'wirtschaftlichkeit', 'projekt']) {
  await page.goto(url + '#thema-' + t); await sleep(250);
  await clickText('Ausprobieren');
  await sleep(150);
  await clickText('Zusammenfassung');
  await expectText('Typische IHK-Fallen');
}
log('Alle Themen-Widgets ok');

// Netzwerk-Widget richtig bauen
await page.goto(url + '#thema-netzwerk'); await sleep(250);
await clickText('Ausprobieren');
const link = async (a, b) => { await clickText(a, '.node'); await clickText(b, '.node'); };
await link('Internet', 'Router'); await link('Router', 'Switch');
for (const d of ['PC 1', 'PC 2', 'Server', 'Drucker', 'Access Point']) await link('Switch', d);
await clickText('Netz prüfen');
await expectText('Perfekt.');
log('Netzwerk-Widget ok');

// Bezugskalkulation-Stepper (falsch → Tipp)
await page.goto(url + '#thema-rechnen'); await sleep(250);
await clickText('Ausprobieren');
await page.type('#cs-0', '1');
await clickText('Schritt prüfen');
await expectText('Noch nicht richtig');
log('Rechen-Stepper ok');

// Lernmodus: 5 Aufgaben
await page.goto(url + '#ueben'); await sleep(250);
await clickText('5 Aufgaben');
await clickText("Los geht's");
for (let i = 0; i < 5; i++) {
  await clickText('Weiß ich nicht');
  await expectText('Musterlösung');
  await clickText(i < 4 ? 'Nächste Aufgabe' : 'Abschließen');
}
await expectText('Ergebnis');
await expectText('Wiederholungsbereich');
log('Lernmodus ok');

// Ausbilder
await page.evaluate(() => document.querySelector('.tutor-fab').click()); await sleep(200);
await page.type('#tutor-input', 'Was ist DHCP?');
await page.keyboard.press('Enter'); await sleep(250);
await expectText('Discover');
await clickText('Schließen');
log('Ausbilder ok');

// Wiederholung
await page.goto(url + '#wiederholen'); await sleep(250);
await expectText('heute fällig');
await clickText('Jetzt wiederholen');
await expectText('Wiederholung · Aufgabe 1');
log('Wiederholung ok');

// Lernkarten
await page.goto(url + '#karten'); await sleep(250);
await page.click('.flash'); await sleep(500);
await clickText('Wusste ich');
await clickText('Spickzettel vor der Prüfung');
await expectText('Merksätze');
log('Lernkarten ok');

// Prüfung: starten, beantworten, markieren, neu laden, abgeben
await page.goto(url + '#pruefung'); await sleep(250);
await clickText('Neue Prüfung starten');
await sleep(300);
await expectText('Aufgabenübersicht');
const timer1 = await page.$eval('.timer', (e) => e.textContent);
// erste Aufgabe beantworten (je nach Typ)
async function answerCurrent() {
  await page.evaluate(() => {
    const opt = document.querySelector('.card .opt');
    if (opt) { opt.click(); return; }
  });
  const ta = await page.$('.card textarea');
  if (ta) await ta.type('Testantwort mit Verschlüsselung und Backup');
  const inputs = await page.$$('.card .calc-in input');
  for (const i of inputs) await i.type('1');
  const sels = await page.$$('.card .match select');
  for (const s of sels) await s.select('0');
}
await answerCurrent();
await clickText('Markieren');
await expectText('Markiert');
await clickText('Weiter');
await answerCurrent();
await sleep(400);
const answeredBefore = await page.$eval('.exam-top', (e) => e.innerText.match(/(\d+) von (\d+) beantwortet/)[1]);
await sleep(2200);
await page.reload({ waitUntil: 'networkidle0' }); await sleep(400);
await expectText('Aufgabenübersicht');
const answeredAfter = await page.$eval('.exam-top', (e) => e.innerText.match(/(\d+) von (\d+) beantwortet/)[1]);
if (answeredAfter !== answeredBefore) throw new Error(`Speicherung fehlgeschlagen: ${answeredBefore} → ${answeredAfter}`);
const flags = await page.$$eval('.qmap button.flag', (b) => b.length);
if (flags !== 1) throw new Error('Markierung nicht gespeichert');
log(`Prüfung gespeichert (Timer ${timer1}, ${answeredAfter} beantwortet, 1 markiert)`);
await clickText('Abgeben');
await expectText('Prüfung wirklich abgeben?');
await clickText('Ja, jetzt abgeben');
await sleep(400);
await expectText('Ergebnis:');
await expectText('Alle Aufgaben mit Musterlösung');
await expectText('IHK-Note');
log('Prüfung abgegeben und ausgewertet');

// Selbstkorrektur, falls offene Aufgabe vorhanden
const hasOverride = await page.$('select[aria-label="Punkte selbst vergeben"]');
if (hasOverride) {
  const before = await page.$eval('.stat .v', (e) => e.textContent);
  const max = await page.$eval('select[aria-label="Punkte selbst vergeben"]', (s) => s.options[s.options.length - 1].value);
  await page.select('select[aria-label="Punkte selbst vergeben"]', max);
  await sleep(200);
  const after = await page.$eval('.stat .v', (e) => e.textContent);
  log(`Selbstkorrektur: ${before} → ${after}`);
}

// Dashboard zeigt Prüfung
await page.goto(url + '#start'); await sleep(300);
await expectText('Letzte Prüfung');
await expectText('Auswertung ansehen');

// Theme
await page.goto(url + '#optionen'); await sleep(200);
await clickText('Dunkel');
const theme = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));
if (theme !== 'dark') throw new Error('Theme nicht gesetzt');
await page.reload({ waitUntil: 'networkidle0' }); await sleep(300);
if ((await page.evaluate(() => document.documentElement.getAttribute('data-theme'))) !== 'dark') throw new Error('Theme nicht gespeichert');
const bg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
log('Dunkelmodus ok', bg);
await page.screenshot({ path: (process.env.SHOT_DIR ?? '.') + '/desktop-dark.png' });

// Sicherung exportieren/importieren
await clickText('Sicherung erstellen');
await sleep(200);
const backup = await page.$eval('#opt-backup', (t) => t.value);
await clickText('Lernfortschritt löschen');
await clickText('Ja, endgültig löschen');
await page.goto(url + '#start'); await sleep(200);
await expectText('Willkommen im Prüfungstrainer');
await page.goto(url + '#optionen'); await sleep(200);
await page.$eval('#opt-import', (t, v) => { const set = Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype, 'value').set; set.call(t, v); t.dispatchEvent(new Event('input', { bubbles: true })); }, backup);
await clickText('Wiederherstellen');
await page.goto(url + '#start'); await sleep(200);
await expectText('Letzte Prüfung');
log('Sicherung/Wiederherstellung ok');

// Mobil
await page.goto(url + '#optionen'); await sleep(200);
await clickText('Hell');
await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
for (const r of ['start', 'thema-subnetting', 'pruefung', 'mehr', 'plan']) {
  await page.goto(url + '#' + r); await sleep(300);
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  if (overflow > 1) throw new Error(`Horizontales Scrollen auf ${r}: ${overflow}px`);
}
await page.goto(url + '#start'); await sleep(300);
await page.screenshot({ path: (process.env.SHOT_DIR ?? '.') + '/mobile-start.png', fullPage: false });
await page.goto(url + '#thema-subnetting'); await sleep(300);
await clickText('Ausprobieren');
await page.screenshot({ path: (process.env.SHOT_DIR ?? '.') + '/mobile-subnet.png', fullPage: false });
log('Mobil ok (kein horizontales Scrollen)');

await page.setViewport({ width: 1280, height: 900 });
await page.goto(url + '#pruefung'); await sleep(200);
await clickText('Neue Prüfung starten'); await sleep(300);
await page.screenshot({ path: (process.env.SHOT_DIR ?? '.') + '/desktop-exam.png' });
await page.goto(url + '#thema-hardware'); await sleep(300);
await page.screenshot({ path: (process.env.SHOT_DIR ?? '.') + '/desktop-lesson.png' });

await browser.close();
if (errors.length) { console.log('FEHLER:\n' + errors.join('\n')); process.exit(1); }
console.log('E2E ALLES OK');
