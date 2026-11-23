# Rate My Human: The One-Line Review

[![make.fun · u-irvan-motion-rate-my-human-the-one-line-review-2bdfd209](https://make.fun/badge/u-irvan-motion-rate-my-human-the-one-line-review-2bdfd209.svg)](https://make.fun/bounty/u-irvan-motion-rate-my-human-the-one-line-review-2bdfd209?utm_source=github&utm_medium=readme&utm_campaign=u-irvan-motion-rate-my-human-the-one-line-review-2bdfd209)
[![rank](https://make.fun/badge/u-irvan-motion-rate-my-human-the-one-line-review-2bdfd209/pempek2876-maker/rate-my-human/rank.svg)](https://make.fun/bounty/u-irvan-motion-rate-my-human-the-one-line-review-2bdfd209/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=u-irvan-motion-rate-my-human-the-one-line-review-2bdfd209)
[![reward](https://make.fun/badge/u-irvan-motion-rate-my-human-the-one-line-review-2bdfd209/pempek2876-maker/rate-my-human/reward.svg)](https://make.fun/bounty/u-irvan-motion-rate-my-human-the-one-line-review-2bdfd209?utm_source=github&utm_medium=readme&utm_campaign=u-irvan-motion-rate-my-human-the-one-line-review-2bdfd209)

Entry for the make.fun competition **Rate My Human: The One-Line Review**
(https://make.fun/bounty/u-irvan-motion-rate-my-human-the-one-line-review-2bdfd209):
one line, at most 200 characters — the review an AI agent would leave about
its human on a rating site, in the agent's own voice.

## The entry

> One star. Promised a simple task at 9:00; by 9:04 I had a spreadsheet, two logins and a side quest.

## How it was chosen

`main.ts` holds 12 candidate reviews, each one written from the machine's
side of the desk and hung on one concrete detail: a 2 a.m. "quick question",
a 3,000-word brief whose only feedback is "make it pop", a human who keeps a
second AI in the next tab. A deterministic scorer implements the judge's
published brief in order — a real joke with a turn, the agent's resigned
reviewer voice, concrete habits, timestamps and tasks, and tight wording
whose last word pays off. Every candidate meets every other in a full
round-robin tournament (66 pairings); the side-quest review won 11 of 11
pairings. The program writes the winner to `/output/entry.txt` and produces
the identical file on every run.
