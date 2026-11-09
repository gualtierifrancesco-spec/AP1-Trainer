import { grade, criterionMet } from '../src/lib/grading';
import { findQuestion, FIXED } from '../src/data/bank';
import { createExam, gradeExam } from '../src/lib/exam';
import { defaultState, parseState } from '../src/lib/store';
import { recordResult, topicMastery, dueReviews, learningPlan, readiness } from '../src/lib/progress';
import { offlineTutor, newMemory } from '../src/lib/tutor';
import { subnetInfo, shortenIpv6, maskToPrefix } from '../src/lib/ip';
import { parseNum, ihkNote } from '../src/lib/util';
import type { Question } from '../src/types';

const Q = (id: string) => findQuestion(id) as Question;

describe('Zahlen und Adressen', () => {
  it('liest deutsche und englische Zahlformate', () => {
    expect(parseNum('1.234,56 €')).toBe(1234.56);
    expect(parseNum('1234.56')).toBe(1234.56);
    expect(parseNum('1.500')).toBe(1500);
    expect(parseNum('12,5 %')).toBe(12.5);
    expect(parseNum('abc')).toBeNull();
  });
  it('rechnet Subnetze korrekt', () => {
    const s = subnetInfo('192.168.5.77', 28);
    expect([s.network, s.broadcast, s.first, s.last, s.hosts]).toEqual(['192.168.5.64', '192.168.5.79', '192.168.5.65', '192.168.5.78', 14]);
    const t = subnetInfo('172.16.45.200', 21);
    expect([t.network, t.broadcast, t.mask, t.hosts]).toEqual(['172.16.40.0', '172.16.47.255', '255.255.248.0', 2046]);
    expect(maskToPrefix('255.255.255.192')).toBe(26);
    expect(maskToPrefix('255.255.255.250')).toBeNull();
  });
  it('kürzt IPv6 nach RFC 5952', () => {
    expect(shortenIpv6('2001:0db8:0000:0000:0000:ff00:0042:8329')).toBe('2001:db8::ff00:42:8329');
    expect(shortenIpv6('fe80:0000:0000:0000:0204:61ff:fe9d:f156')).toBe('fe80::204:61ff:fe9d:f156');
  });
  it('IHK-Notenschlüssel', () => {
    expect(ihkNote(92).note).toBe('1');
    expect(ihkNote(91.9).note).toBe('2');
    expect(ihkNote(50).note).toBe('4');
    expect(ihkNote(49.5).note).toBe('5');
  });
});

describe('Bewertung', () => {
  it('Mehrfachauswahl: falsche Markierung hebt richtige auf', () => {
    const q = Q('h06'); // richtig: 0,1,3 – 4 Punkte
    expect(grade(q, { type: 'ms', value: [0, 1, 3] }).points).toBe(4);
    expect(grade(q, { type: 'ms', value: [0, 1, 3, 2] }).points).toBe(2.5);
    expect(grade(q, { type: 'ms', value: [2, 4] }).points).toBe(0);
  });
  it('Rechenaufgabe: Teilpunkte pro Feld, deutsches Zahlformat', () => {
    const q = Q('r07');
    const r = grade(q, { type: 'calc', value: ['828,00', '811,44', '999'] });
    expect(r.points).toBe(4);
    expect(r.status).toBe('teilweise');
  });
  it('IP-Felder akzeptieren Präfix mit und ohne Schrägstrich', () => {
    const q = Q('s14');
    expect(grade(q, { type: 'calc', value: ['25', '126'] }).points).toBe(q.points);
    expect(grade(q, { type: 'calc', value: ['/25', '126'] }).points).toBe(q.points);
  });
  it('Offene Frage: sinngemäße Antwort wird anhand des Erwartungshorizonts bewertet', () => {
    const q = Q('h25');
    const r = grade(q, { type: 'open', value: 'Ich würde eine SSD einbauen, weil der PC dann viel schneller startet. Außerdem mehr Arbeitsspeicher, damit mehrere Programme gleichzeitig laufen.' });
    expect(r.points).toBe(6);
    const weak = grade(q, { type: 'open', value: 'Neuen PC kaufen.' });
    expect(weak.points).toBe(0);
  });
  it('Offene Frage mit Mindestanzahl: Teilpunkte', () => {
    const q = Q('d19');
    expect(grade(q, { type: 'open', value: 'Einwilligung' }).points).toBe(2);
    expect(grade(q, { type: 'open', value: 'Einwilligung und Vertrag' }).points).toBe(4);
  });
  it('Umlaute werden beim Vergleich vereinheitlicht', () => {
    expect(criterionMet('Der Monitor muss höhenverstellbar sein', [['hoehenverstell']])).toBe(true);
  });
  it('Zuordnung: anteilige Punkte', () => {
    const q = Q('i14');
    expect(grade(q, { type: 'match', value: [0, 2, 1] }).points).toBe(1);
    expect(grade(q, { type: 'match', value: [0, 1, 2] }).points).toBe(3);
  });
});

describe('Prüfungsgenerator', () => {
  it('erzeugt 4 Blöcke mit realistischer Punkteverteilung und ohne Doppelungen', () => {
    for (let seed = 1; seed <= 60; seed++) {
      const e = createExam(defaultState(), seed * 1000);
      expect(e.blocks.length).toBe(4);
      const ids = e.blocks.flatMap((b) => b.questionIds);
      expect(new Set(ids).size).toBe(ids.length);
      const total = Object.values(e.questions).reduce((n, q) => n + q.points, 0);
      expect(total).toBeGreaterThanOrEqual(94);
      expect(total).toBeLessThanOrEqual(106);
      for (const b of e.blocks) {
        const pts = b.questionIds.reduce((n, id) => n + e.questions[id].points, 0);
        expect(pts).toBeGreaterThanOrEqual(22);
        expect(pts).toBeLessThanOrEqual(27);
        const types = new Set(b.questionIds.map((id) => e.questions[id].type));
        expect(types.size).toBeGreaterThanOrEqual(2);
      }
    }
  });
  it('zwei Prüfungen unterscheiden sich deutlich', () => {
    const a = createExam(defaultState(), 1);
    const b = createExam(defaultState(), 2);
    const ia = new Set(a.blocks.flatMap((x) => x.questionIds));
    const shared = b.blocks.flatMap((x) => x.questionIds).filter((id) => ia.has(id)).length;
    expect(shared).toBeLessThan(ia.size * 0.4);
  });
  it('bewertet eine leere Prüfung mit 0 und eine Musterprüfung voll', () => {
    const e = createExam(defaultState(), 42);
    const g = gradeExam(e);
    expect(g.score).toBe(0);
    expect(Object.values(g.results!).every((r) => r.status === 'leer')).toBe(true);
    const full = { ...e, answers: { ...e.answers } };
    for (const q of Object.values(e.questions)) {
      if (q.type === 'mc') full.answers[q.id] = { type: 'mc', value: q.correct };
      if (q.type === 'ms') full.answers[q.id] = { type: 'ms', value: q.correct };
      if (q.type === 'match') full.answers[q.id] = { type: 'match', value: q.pairs.map((_, i) => i) };
      if (q.type === 'open') full.answers[q.id] = { type: 'open', value: q.solution };
      if (q.type === 'calc') full.answers[q.id] = { type: 'calc', value: q.fields.map((f) => String(f.answer).replace('.', ',')) };
    }
    const gf = gradeExam(full);
    expect(gf.score).toBe(gf.max);
  });
  it('Selbstkorrektur offener Fragen fließt in die Punkte ein', () => {
    const e = createExam(defaultState(), 7);
    const open = Object.values(e.questions).find((q) => q.type === 'open');
    if (!open) return;
    const g = gradeExam({ ...e, overrides: { [open.id]: open.points } });
    expect(g.score).toBe(open.points);
  });
  it('schwache Themen kommen häufiger vor', () => {
    let s = defaultState();
    // Subnetting schlecht, alles andere gut
    for (const q of FIXED) {
      const bad = q.topic === 'subnetting';
      s = recordResult(s, q, { points: bad ? 0 : q.points, max: q.points, status: bad ? 'falsch' : 'richtig', details: [] });
    }
    let weak = 0, strong = 0;
    for (let seed = 1; seed <= 30; seed++) {
      const e = createExam(s, seed);
      const qs = Object.values(e.questions);
      weak += qs.filter((q) => q.topic === 'subnetting').reduce((n, q) => n + q.points, 0);
      strong += qs.filter((q) => q.topic === 'osi').reduce((n, q) => n + q.points, 0);
    }
    expect(weak).toBeGreaterThan(strong);
  });
});

describe('Lernstand und Wiederholung', () => {
  it('falsche Antworten werden sofort fällig, richtige später', () => {
    let s = defaultState();
    const q = Q('n01');
    s = recordResult(s, q, { points: 0, max: 2, status: 'falsch', details: [] });
    expect(dueReviews(s).map((x) => x.id)).toContain('n01');
    s = recordResult(s, q, { points: 2, max: 2, status: 'richtig', details: [] });
    expect(dueReviews(s).map((x) => x.id)).not.toContain('n01');
    expect(s.qstats.n01.box).toBe(1);
  });
  it('Beherrschung und Lernplan reagieren auf Ergebnisse', () => {
    let s = defaultState();
    for (const q of FIXED.filter((x) => x.topic === 'rechnen')) s = recordResult(s, q, { points: 0, max: q.points, status: 'falsch', details: [] });
    expect(topicMastery(s, 'rechnen').pct).toBe(0);
    expect(learningPlan(s)[0].topic).toBe('rechnen');
    expect(readiness(s).pct).toBe(0);
  });
  it('Speicherstand: kaputte oder fremde Daten führen zum Standardzustand', () => {
    expect(parseState('{kaputt').qstats).toEqual({});
    expect(parseState(JSON.stringify({ version: 99 })).exams).toEqual([]);
    const ok = parseState(JSON.stringify({ ...defaultState(), studySeconds: 120 }));
    expect(ok.studySeconds).toBe(120);
  });
});

describe('Offline-Ausbilder', () => {
  it('erklärt einen Begriff und stellt eine Rückfrage', () => {
    const r = offlineTutor('Was ist eine Subnetzmaske?', { topic: 'subnetting' }, newMemory());
    expect(r.reply.text.length).toBeGreaterThan(40);
    expect(r.reply.text).toMatch(/Maske|Netzanteil/i);
  });
  it('verrät bei einer Aufgabe zuerst nur einen Tipp, nicht die Lösung', () => {
    const q = Q('s13');
    const r = offlineTutor('Gib mir einen Tipp', { topic: 'subnetting', question: q }, newMemory());
    expect(r.reply.text).not.toContain('192.168.40.128');
  });
  it('wertet Antworten auf Rückfragen aus und hilft beim zweiten Fehlversuch weiter', () => {
    let r = offlineTutor('Erkläre mir Backup einfacher', { topic: 'sicherheit' }, newMemory());
    expect(r.mem.pending).toBeTruthy();
    const correct = 'ABCD'[r.mem.pending!.quiz.correct];
    const wrong = correct === 'A' ? 'B' : 'A';
    const r2 = offlineTutor(wrong, { topic: 'sicherheit' }, r.mem);
    expect(r2.reply.text).toMatch(/Noch nicht/);
    const r3 = offlineTutor(wrong, { topic: 'sicherheit' }, r2.mem);
    expect(r3.reply.text).toContain(`richtige Antwort ist ${correct}`);
  });
  it('führt Rechenwege schrittweise', () => {
    const q = Q('r07');
    const r1 = offlineTutor('Zeig mir den Rechenweg', { topic: 'rechnen', question: q }, newMemory());
    expect(r1.reply.text).toContain('Schritt 1');
    const r2 = offlineTutor('weiter', { topic: 'rechnen', question: q }, r1.mem);
    expect(r2.reply.text).toContain('Schritt 2');
  });
  it('erklärt, warum eine Antwort falsch war', () => {
    const q = Q('r01');
    const res = grade(q, { type: 'mc', value: 0 });
    const r = offlineTutor('Warum ist meine Antwort falsch?', { topic: 'rechnen', question: q, answer: { type: 'mc', value: 0 }, result: res }, newMemory());
    expect(r.reply.text).toContain('192,78');
    expect(r.reply.text).toContain('1,19');
  });
});
