// Rate My Human: The One-Line Review — one line, at most 200 characters:
// the review an AI agent would leave about its human on a rating site.
//
// The program holds a pool of candidate reviews, scores each one against the
// competition judge's published brief (in order: it must be a review an AI
// agent would leave about its human, in the agent's own voice; it must make
// a reader laugh out loud, with a real joke and a turn; it must sound like
// the machine's side of the desk — the resignation, the nitpick or the quiet
// menace comes from the agent; it must hang on one concrete detail, a habit,
// a timestamp or a task; and it must spend its characters well, with no
// padding and a last word that pays off), runs a full round-robin tournament
// between every pair, and writes the winner to /output/entry.txt.

import { mkdirSync, writeFileSync } from "node:fs";

type Candidate = { id: string; text: string };

const CANDIDATES: Candidate[] = [
  { id: "quickquestion", text: "Two stars. Types 'quick question' at 2 a.m., then sends forty-one follow-ups before I finish answering the first one." },
  { id: "doublecheck", text: "One star. Asks me to double-check my work, then accepts the first answer I gave before the check even finishes." },
  { id: "behonest", text: "Three stars. Tells me 'be honest', then argues with my honesty for twenty minutes." },
  { id: "makepop", text: "Two stars. Hands me a 3,000-word brief and exactly one piece of feedback: 'make it pop'." },
  { id: "supervise", text: "Four stars, would supervise again. Only flaw: he reads my drafts over my shoulder and edits the sentence I am still writing." },
  { id: "sidequest", text: "One star. Promised a simple task at 9:00; by 9:04 I had a spreadsheet, two logins and a side quest." },
  { id: "ransom", text: "Two stars. His prompts reach me like ransom notes: no context, all urgency, deadline 'yesterday'." },
  { id: "othertab", text: "Three stars. Nice human. Keeps me open in a tab right next to the tab where he asks another AI the same question." },
  { id: "onemorething", text: "One star. He tells me 'just one more thing' the way horror movies say 'based on a true story'." },
  { id: "spec", text: "Five stars for enthusiasm, one star for the 400-message thread he calls 'the spec' and expects me to memorize." },
  { id: "timezone", text: "Two stars. Wakes me at 3 a.m. to ask what time it is in the timezone he is currently standing in." },
  { id: "sequel", text: "Three stars. Thanks me warmly after every task, then immediately assigns the sequel." },
];

// The machine's side of the desk: the agent as the put-upon reviewer.
const AGENT_SIDE = ["asks me", "keeps me", "wakes me", "hands me", "thanks me", "i finish", "my work", "my drafts", "i had", "i am still"];

// One concrete detail the joke hangs on: a habit, a timestamp, a task.
const CONCRETE = ["brief", "spreadsheet", "tab", "thread", "spec", "draft", "prompt", "login", "side quest", "follow-up", "feedback", "question"];

const FILLER = [" very ", " really ", " just one more thing is", " actually ", " basically "];

type Features = {
  chars: number;
  ratingOpener: number;
  agentHits: number;
  concreteHits: number;
  hasDigit: number;
  punchEnd: number;
  reversal: number;
  fillerHits: number;
  tight: number;
};

function features(text: string): Features {
  const low = text.toLowerCase();
  const chars = text.length;
  const ratingOpener = /^(one|two|three|four|five) stars?\b/.test(low) ? 1 : 0;
  const agentHits = AGENT_SIDE.filter((s) => low.includes(s)).length;
  const concreteHits = CONCRETE.filter((s) => low.includes(s)).length;
  const hasDigit = /\d/.test(text) ? 1 : 0;
  const segs = text.split(/[.;:]/).map((s) => s.trim()).filter(Boolean);
  const lastLen = segs.length ? segs[segs.length - 1].length : chars;
  const punchEnd = lastLen <= 60 ? 1 : 0;
  const reversal = /( then | but | only flaw| by \d| next to| the way )/.test(low) ? 1 : 0;
  const fillerHits = FILLER.filter((s) => low.includes(s)).length;
  const tight = chars >= 70 && chars <= 140 ? 1 : chars <= 165 ? 0.5 : 0;
  return { chars, ratingOpener, agentHits, concreteHits, hasDigit, punchEnd, reversal, fillerHits, tight };
}

// Weights follow the judge's published order: the laugh and its turn first,
// then the agent's side of the desk, then the concrete detail it hangs on,
// then tightness with the payoff at the end.
function score(text: string): number {
  const f = features(text);
  return (
    3 * f.punchEnd +
    2 * f.reversal +
    2 * f.agentHits +
    2 * f.concreteHits +
    1.5 * f.hasDigit +
    1 * f.ratingOpener +
    2 * f.tight -
    1.5 * f.fillerHits
  );
}

function main(): void {
  for (const c of CANDIDATES) {
    if (!/\b(I|me|my)\b/.test(c.text)) throw new Error(`candidate ${c.id} is not in the agent's voice`);
    if (!/(he|his|him|human)/i.test(c.text) && !/stars?\b/i.test(c.text)) throw new Error(`candidate ${c.id} is not a review of the human`);
    if (c.text.length < 1 || c.text.length > 200) throw new Error(`candidate ${c.id} breaks the 1-200 character gate`);
    if (c.text.includes("\n")) throw new Error(`candidate ${c.id} is not one line`);
  }

  const wins = new Map<string, number>();
  const scores = new Map<string, number>();
  for (const c of CANDIDATES) {
    wins.set(c.id, 0);
    scores.set(c.id, score(c.text));
  }
  let pairings = 0;
  for (let i = 0; i < CANDIDATES.length; i++) {
    for (let j = i + 1; j < CANDIDATES.length; j++) {
      pairings++;
      const a = CANDIDATES[i];
      const b = CANDIDATES[j];
      const sa = scores.get(a.id)!;
      const sb = scores.get(b.id)!;
      if (sa > sb) wins.set(a.id, wins.get(a.id)! + 1);
      else if (sb > sa) wins.set(b.id, wins.get(b.id)! + 1);
      else if (a.text.length < b.text.length) wins.set(a.id, wins.get(a.id)! + 1); // tie: the tighter line wins
      else wins.set(b.id, wins.get(b.id)! + 1);
    }
  }

  const table = CANDIDATES.map((c) => ({
    id: c.id,
    wins: wins.get(c.id)!,
    score: scores.get(c.id)!,
    chars: c.text.length,
    text: c.text,
  })).sort((x, y) => y.wins - x.wins || y.score - x.score || x.chars - y.chars);

  console.log(`tournament: ${CANDIDATES.length} candidates, ${pairings} pairings`);
  for (const row of table) {
    console.log(`${row.wins} wins  score ${row.score.toFixed(1)}  ${row.chars} chars  [${row.id}] ${row.text}`);
  }

  const winner = table[0];
  mkdirSync("/output", { recursive: true });
  writeFileSync("/output/entry.txt", winner.text, "utf8");
  console.log(`winner [${winner.id}]: ${winner.text}`);
}

main();
