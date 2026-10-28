/*
 * Nexteria – Student Relationship Monitoring · DEMO DATA
 * ------------------------------------------------------
 * Everything in this file is fictional: names, e-mails, points, meetings and notes are made up.
 *
 * In production the app runs as a Google Apps Script web app and loads Salesforce exports from Google Drive
 * through `google.script.run`. For the static demo this file replaces that backend with a small in-browser mock
 * that returns sample tables in exactly the same shape as the real exports, so the app code runs unchanged
 * (column detection, semester merging, PvP / volunteering parsing, …).
 *
 * The data is generated from the hardcoded lists below with a seeded random generator,
 * so it is the same on every load. Edit the lists to change the demo.
 */
(function () {
  "use strict";

  window.DEMO_MESSAGE = "Nedostupné v demo verzii · Not available in the demo version";

  // Fixed "today" for the generated data, so the demo always looks the same
  const TODAY = new Date(2026, 9, 28, 9, 0);

  const SEMS = ["Zimný 2024/25", "Letný 2024/25", "Zimný 2025/26", "Letný 2025/26", "Zimný 2026/27"];
  const SHORT = ["ZS 24/25", "LS 24/25", "ZS 25/26", "LS 25/26", "ZS 26/27"];
  const SEM_START = [[2024, 9, 16], [2025, 2, 17], [2025, 9, 15], [2026, 2, 16], [2026, 9, 14]];
  const CUR = SEMS.length - 1;

  const CITIES = ["Nexteria: Bratislava", "Nexteria: Košice"];

  // NLA team: [name, e-mail]. The demo "logged-in user" is the first person.
  const TEAM = [
    ["Katarína Horváthová", "katarina.horvathova@nexteria.example.sk"],
    ["Martin Kováč", "martin.kovac@nexteria.example.sk"],
    ["Zuzana Bieliková", "zuzana.bielikova@nexteria.example.sk"],
    ["Peter Novotný", "peter.novotny@nexteria.example.sk"],
  ];
  const USER = TEAM[0][1];

  // [first name, last name, city (0 = Bratislava, 1 = Košice), first semester index, study status, NLA team index or null]
  const STUDENTS = [
    ["Adam", "Baláž", 0, 0, "Študuje", 0],
    ["Barbora", "Kollárová", 0, 0, "Absolvent", 0],
    ["Dominik", "Šimko", 1, 0, "Študuje", 2],
    ["Ema", "Vargová", 0, 1, "Študuje", 1],
    ["Filip", "Hudák", 1, 1, "Prerušené štúdium", 2],
    ["Gabriela", "Mikušová", 0, 2, "Študuje", 0],
    ["Henrich", "Tóth", 0, 0, "Absolvent", 1],
    ["Ivana", "Krajčírová", 1, 2, "Študuje", 3],
    ["Jakub", "Polák", 0, 2, "Študuje", 1],
    ["Klára", "Benková", 0, 3, "Študuje", 0],
    ["Lukáš", "Ondrejka", 1, 3, "Študuje", 2],
    ["Michaela", "Sládková", 0, 1, "Erazmus", 1],
    ["Natália", "Ferenčíková", 1, 0, "Študuje", 3],
    ["Ondrej", "Lukáč", 0, 4, "Študuje", 0],
    ["Patrícia", "Hanková", 0, 4, "Študuje", 1],
    ["Richard", "Gajdoš", 1, 4, "Študuje", 2],
    ["Simona", "Jurčová", 0, 2, "Študuje", null],
    ["Tomáš", "Kmeť", 0, 1, "Predčasne ukončil/a", 1],
    ["Veronika", "Dudášová", 1, 1, "Študuje", 3],
    ["Viktor", "Mráz", 0, 3, "Študuje", 0],
    ["Zuzana", "Repková", 0, 0, "Študuje", 1],
    ["Alžbeta", "Krupová", 1, 3, "Študuje", 3],
    ["Matej", "Uhrin", 0, 2, "Študuje", 0],
    ["Nina", "Babiaková", 0, 3, "Študuje", 1],
    ["Samuel", "Čech", 1, 2, "Študuje", 2],
    ["Laura", "Fabianová", 0, 4, "Študuje", null],
    ["Marek", "Halás", 1, 0, "Absolvent", 3],
    ["Petra", "Vlčková", 0, 1, "Študuje", 0],
    ["Róbert", "Ivan", 0, 3, "Študuje", 1],
    ["Sára", "Zelenková", 1, 4, "Študuje", 3],
  ];
  // Last semester index for students who are no longer active
  const END = {"Absolvent": 3, "Prerušené štúdium": 2, "Predčasne ukončil/a": 2};

  // Events held every semester (points per event). "subs" = an event split into subevents.
  const EVENTS = [
    {n: "Úvodné stretnutie semestra", p: 4},
    {n: "Workshop: Efektívna komunikácia", p: 7},
    {n: "Diskusia s hosťom: Podnikanie v praxi", p: 6},
    {n: "Leadership víkend", subs: [["Leadership víkend – sobota", 7], ["Leadership víkend – nedeľa", 7]]},
    {n: "Tréning: Prezentačné zručnosti", p: 7},
    {n: "Kariérny deň s partnermi", p: 6},
    {n: "Workshop: Finančná gramotnosť", p: 7},
    {n: "Networking večer", p: 4},
    {n: "Záverečné stretnutie semestra", p: 4},
  ];
  const PROJECTS = ["Fiktívna firma Alfa", "Mobilná appka pre mesto", "Dátová analýza pre NGO",
    "Marketingová kampaň Beta", "Udržateľný kampus", "Startup simulácia"];
  const VOLUNTEER = ["Dobrovoľníctvo – Potravinová banka", "Dobrovoľníctvo – Doučovanie na ZŠ",
    "Dobrovoľníctvo – Upratovanie parku", "Dobrovoľníctvo – Pomoc na komunitnom festivale"];
  const MEET_TEXTS = [
    "Prešli sme plnenie bodov a plán eventov na zvyšok semestra.",
    "Rozprávali sme sa o výbere Projektu v praxi – zvažuje dátovú analýzu.",
    "Náročnejší semester v škole, dohodli sme sa aspoň na dvoch eventoch do konca mesiaca.",
    "Spätná väzba na Leadership víkend – veľmi pozitívna, chce sa zapojiť aj do organizácie.",
    "Hľadá stáž v marketingu, poslala som kontakty na dvoch partnerov.",
    "Pripomenuli sme si nevyplnené feedbacky a termíny.",
    "Krátke stretnutie po evente, všetko v poriadku.",
  ];
  const NOTE_TEXTS = [
    "Má záujem o mentoring od alumni z IT.",
    "V tomto semestri bude 3 týždne v zahraničí – počítať s nižšou účasťou.",
    "Výborná prezentácia na Kariérnom dni, odporučiť partnerom.",
    "Zvážiť dobrovoľníctvo v potravinovej banke – sám sa pýtal.",
    "Preferuje komunikáciu cez e-mail, nie telefonicky.",
    "Chce v budúcom semestri viesť tím na Projekte v praxi.",
  ];

  // ---------------- generator ----------------
  const DAY = 864e5;
  const rng = seed => () => {
    seed = seed + 0x6D2B79F5 | 0;
    let t = Math.imul(seed ^ seed >>> 15, 1 | seed);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
  const ascii = s => s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  const startOf = k => new Date(SEM_START[k][0], SEM_START[k][1] - 1, SEM_START[k][2]);
  const addDays = (d, n) => new Date(d.getTime() + n * DAY);
  const pad = n => String(n).padStart(2, "0");
  const sfDate = d => `${d.getDate()}. ${d.getMonth() + 1}. ${d.getFullYear()} 17:00`;
  const iso = d => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

  function build() {
    const R = rng(20261028);
    const pick = a => a[Math.floor(R() * a.length)];
    let uid = 0;
    const id = p => `demo-${p}-${++uid}`;

    const st = [["Meno", "Priezvisko", "E-mail", "Mesto", "Level", "Stav štúdia", "Semester", "Bodový základ", "Body"]];
    const ev = [["Študent", "E-mail", "Level", "Semester", "Event: Názov", "Typ", "Stretnutie k projektu", "Súvisiaci event",
      "Event: Začiatok eventu", "Status", "Body za event", "Získané body"]];
    const vol = [["Študent", "Level", "Semester", "Body podrobný prehľad: Názov", "Získané body"]];
    const resp = [["Študent", "E-mail", "Zodpovedná osoba (NLA tím)"]];
    const meetings = [], notes = [];

    STUDENTS.forEach(([first, last, city, start, status, team], si) => {
      const full = `${first} ${last}`;
      const email = `${ascii(first)}.${ascii(last)}@student.example.sk`;
      const eng = 0.4 + R() * 0.55;                 // how engaged the student is
      const end = END[status] ?? CUR;
      const tm = TEAM[team ?? si % TEAM.length];
      if (team != null) resp.push([full, email, TEAM[team][0]]);

      for (let k = start; k <= end; k++) {
        const levelN = Math.min(3, 1 + Math.floor((k - start) / 2));
        const level = `Level ${levelN}`;
        const sem = SEMS[k], tag = SHORT[k], s0 = startOf(k), current = k === CUR;
        const fbRate = current ? 0.72 : 0.92;
        let pts = 0;

        const row = (name, typ, parent, rel, date, statusTxt, possible, earned) =>
          ev.push([full, email, level, sem, name, typ, parent, rel, sfDate(date), statusTxt, String(possible), String(earned)]);
        const attend = (name, rel, date, p) => {
          if (date > TODAY) { row(name, "Event", "", rel, date, "Prihlásený", p, 0); return; }
          const fb = R() < fbRate;
          row(name, "Event", "", rel, date, fb ? "Feedback vyplnený" : "Feedback nevyplnený", p, fb ? p : 0);
          if (fb) pts += p;
        };

        // events
        EVENTS.forEach((e, i) => {
          const date = addDays(s0, 4 + i * 9);
          if (R() >= eng) {
            if (date <= TODAY && R() < 0.15) row(e.n, "Event", "", "", date, "Ospravedlnený", e.p || 0, 0);
            return;
          }
          if (e.subs) {
            const parent = `${e.n} ${tag}`;
            row(parent, "Event", "", "", date, date > TODAY ? "Prihlásený" : "Zúčastnený", 0, 0);
            e.subs.forEach(([n, p], j) => attend(n, parent, addDays(date, j), p));
          } else attend(e.n, "", date, e.p);
        });

        // Projekt v praxi: umbrella event → project → project meetings
        if (R() < 0.15 + eng * 0.35) {
          const proj = PROJECTS[(si + k * 3) % PROJECTS.length];
          const umbrella = `Projekty v praxi ${tag}`, pname = `PvP: ${proj}_${tag}`, d = addDays(s0, 10);
          row(umbrella, "Projekt v praxi", "", "", d, "Zúčastnený", 0, 0);
          row(pname, "Projekt v praxi", umbrella, "", d, current ? "Prihlásený" : "Zúčastnený", 10, current ? 0 : 10);
          [1, 2].forEach(m => {
            const md = addDays(d, m * 20);
            if (md <= TODAY) row(`Stretnutie: ${proj} #${m}`, "Projekt v praxi", pname, "", md, "Zúčastnený", 0, 0);
          });
          if (!current) pts += 10;
        }

        // volunteering
        if (R() < 0.12 + eng * 0.25) {
          const v = 2 + Math.floor(R() * 6);
          vol.push([full, level, sem, pick(VOLUNTEER), String(v)]);
          pts += v;
        }

        const base = status === "Erazmus" && current ? 0 : [40, 45, 50][levelN - 1];
        st.push([first, last, email, CITIES[city], level, status, sem, String(base), String(pts)]);

        // meetings with the NLA team
        if (R() < (current ? 0.5 : 0.8)) {
          const days = Math.min(120, Math.floor((TODAY - s0) / DAY) - 4);
          const n = R() < 0.25 ? 2 : 1;
          for (let j = 0; j < n; j++) {
            const d = addDays(s0, 3 + Math.floor(R() * days));
            const noDate = R() < 0.08;   // recorded in bulk as "just the semester"
            meetings.push({
              id: id("m"), email, name: full, semester: sem, date: noDate ? "" : iso(d), with: noDate ? "" : tm[0],
              text: !noDate && R() < 0.7 ? pick(MEET_TEXTS) : "", author: tm[1], created: addDays(d, 1).toISOString(),
            });
          }
        }
      }

      // notes
      if (R() < 0.35) {
        notes.push({id: id("n"), email, semester: "", text: pick(NOTE_TEXTS), author: tm[1],
          created: addDays(TODAY, -Math.floor(R() * 300)).toISOString()});
      }
    });

    const updated = new Date(2026, 9, 27, 8).getTime();
    const sf = (name, rows) => ({name, file: name, url: "", folder: "salesforce", updated, rows});
    return {
      tables: [
        sf("Master_StudentiBody-2026-10-27-08-00-00.csv", st),
        sf("Master_UcastEventBody-2026-10-27-08-00-00.csv", ev),
        sf("Master_dobrovolnictvo-2026-10-27-08-00-00.csv", vol),
        {name: "Rozdelenie_NLAtim.xlsx", file: "Rozdelenie_NLAtim.xlsx", url: "", folder: "manual", updated, rows: resp},
      ],
      meetings, notes,
    };
  }

  // Same shape as getData() / refreshData() in Code.gs (snapshot and live sent as plain objects instead of gzip)
  function respond() {
    const d = build();
    return {
      snapshot: {tables: d.tables, skipped: []},
      live: {tables: [], skipped: []},
      snapshotInfo: {created: TODAY.toISOString(), by: USER, changes: []},
      notes: d.notes,
      meetings: d.meetings,
      user: USER,
      canDeleteAll: false,
      folderName: "SRM (demo)",
      folderUrl: "#",
      folders: {
        salesforce: {name: "Salesforce", url: "#"},
        manual: {name: "Manuálne info", url: "#"},
        generated: {name: "Automaticky generované", url: "#"},
      },
      notesUrl: "#",
      meetingsUrl: "#",
    };
  }

  // ---------------- mock of google.script.run ----------------
  const BLOCKED = ["addNote", "deleteNote", "addMeeting", "addMeetings", "deleteMeeting", "exportToSheet"];
  function runner(ok, fail) {
    const api = {
      withSuccessHandler: f => runner(f, fail),
      withFailureHandler: f => runner(ok, f),
    };
    const load = () => setTimeout(() => {
      try { ok && ok(respond()); } catch (e) { fail && fail(e); }
    }, 400);
    api.getData = load;
    api.refreshData = load;
    BLOCKED.forEach(fn => { api[fn] = () => setTimeout(() => fail && fail(new Error(window.DEMO_MESSAGE)), 0); });
    return api;
  }
  window.google = {script: {run: runner(null, null)}};
})();
