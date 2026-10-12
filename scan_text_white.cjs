const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'src', 'components');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.tsx'));

let total = 0;
const results = {};

files.forEach(f => {
  const content = fs.readFileSync(path.join(dir, f), 'utf-8');
  const lines = content.split('\n');
  const matches = [];
  lines.forEach((line, idx) => {
    if (line.includes('text-white')) {
      // Check if it's on a dark background element (button, dark pill, terminal, etc.)
      const isButtonOrDarkBg = /bg-(emerald|blue|indigo|purple|slate-[89]\d\d|gray-[89]\d\d|rose|red|amber|black|zinc-[89]\d\d)[^\"]*text-white/.test(line) ||
        /text-white[^\"]*bg-(emerald|blue|indigo|purple|slate-[89]\d\d|gray-[89]\d\d|rose|red|amber|black|zinc-[89]\d\d)/.test(line);
      const isTerminal = /terminal|bash|console|code|font-mono bg-gray-950/.test(line);
      if (!isButtonOrDarkBg && !isTerminal) {
        matches.push({ line: idx + 1, snippet: line.trim().slice(0, 120) });
      }
    }
  });
  if (matches.length > 0) {
    results[f] = matches;
    total += matches.length;
  }
});

console.log('Total suspect text-white:', total);
Object.keys(results).sort((a,b) => results[b].length - results[a].length).forEach(f => {
  console.log(`${f} (${results[f].length}):`);
  results[f].slice(0, 5).forEach(m => console.log(`   L${m.line}: ${m.snippet}`));
});
