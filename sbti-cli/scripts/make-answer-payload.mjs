#!/usr/bin/env node

function printHelp() {
  console.log(`Usage:
  node ./scripts/make-answer-payload.mjs [--mode single|batch] [--fill 1|2|3] [--id case-1] [--drink-gate-q2 2]

Examples:
  node ./scripts/make-answer-payload.mjs --fill 1
  node ./scripts/make-answer-payload.mjs --mode batch --fill 3 --id sample
  node ./scripts/make-answer-payload.mjs --fill 3 --drink-gate-q2 2`);
}

function readOption(argv, name, fallback) {
  const index = argv.indexOf(name);

  if (index === -1 || index === argv.length - 1) {
    return fallback;
  }

  return argv[index + 1];
}

const argv = process.argv.slice(2);

if (argv.includes('--help') || argv.includes('-h')) {
  printHelp();
  process.exit(0);
}

const mode = readOption(argv, '--mode', 'single');
const fill = Number(readOption(argv, '--fill', '1'));
const id = readOption(argv, '--id', 'case-1');
const drinkGateQ2Raw = readOption(argv, '--drink-gate-q2', undefined);
const drinkGateQ2 = drinkGateQ2Raw === undefined ? undefined : Number(drinkGateQ2Raw);

if (!['single', 'batch'].includes(mode)) {
  console.error(`Unsupported mode: ${mode}`);
  process.exit(1);
}

if (![1, 2, 3].includes(fill)) {
  console.error(`Unsupported fill value: ${fill}`);
  process.exit(1);
}

if (drinkGateQ2 !== undefined && ![1, 2, 3].includes(drinkGateQ2)) {
  console.error(`Unsupported drink gate value: ${drinkGateQ2}`);
  process.exit(1);
}

const answers = Object.fromEntries(
  Array.from({ length: 30 }, (_, index) => [`q${index + 1}`, fill])
);

if (drinkGateQ2 !== undefined) {
  answers.drink_gate_q1 = 3;
  answers.drink_gate_q2 = drinkGateQ2;
}

const output =
  mode === 'single'
    ? answers
    : [
        {
          id,
          answers
        }
      ];

console.log(JSON.stringify(output, null, 2));
