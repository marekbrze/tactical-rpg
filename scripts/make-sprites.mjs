#!/usr/bin/env node
// scripts/make-sprites.mjs
// Run: node scripts/make-sprites.mjs
// Generates SVG pixel-art sprites -> public/assets/sprites/

import { writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, '..', 'public', 'assets', 'sprites');
mkdirSync(OUT, { recursive: true });

// ── Helpers ──────────────────────────────────────────────────────────────────

function buildSVG(grid, palette) {
  const rows = grid.length;
  const cols = grid[0].length;
  let rects = '';
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const ch = grid[r][c];
      if (ch === '.') continue;
      const color = palette[ch];
      if (!color) {
        throw new Error(
          `Unknown palette key '${ch}' (charCode=${ch.charCodeAt(0)}) at [${r},${c}]`
        );
      }
      rects += `<rect x="${c}" y="${r}" width="1" height="1" fill="${color}"/>`;
    }
  }
  return (
    `<svg xmlns="http://www.w3.org/2000/svg"` +
    ` width="${cols}" height="${rows}" viewBox="0 0 ${cols} ${rows}"` +
    ` shape-rendering="crispEdges">${rects}</svg>`
  );
}

function write(name, grid, palette) {
  const w = grid[0].length;
  grid.forEach((row, i) => {
    if (row.length !== w) {
      throw new Error(
        `${name} row ${i}: expected ${w} chars, got ${row.length}: "${row}"`
      );
    }
    for (const ch of row) {
      if (ch !== '.' && !palette[ch]) {
        throw new Error(
          `${name} row ${i}: unknown key '${ch}' (charCode=${ch.charCodeAt(0)})`
        );
      }
    }
  });
  writeFileSync(join(OUT, name), buildSVG(grid, palette), 'utf8');
  console.log(`OK  ${name}  (${cols(grid)}x${grid.length})`);
}

const cols = g => g[0].length;

// ── Palettes ─────────────────────────────────────────────────────────────────

const PAL_ASPHALT_A = {
  A: '#3c3c3c',
  B: '#424242',
  C: '#4a4a4a',
  D: '#2a2a2a',  // crack
};

const PAL_ASPHALT_B = {
  A: '#4a4a4a',
  B: '#525252',
  C: '#5c5c5c',
  D: '#363636',  // crack
};

const PAL_SKEJC = {
  O: '#111111',  // outline
  G: '#3a3a3a',  // grey hoodie
  c: '#1a1a20',  // dark cap crown
  s: '#f0c07a',  // skin
  J: '#1e3d60',  // denim jeans
  W: '#e0e0e0',  // white sneaker
};

const PAL_DRESIAR = {
  O: '#111111',  // outline
  B: '#1a44cc',  // Adidas blue tracksuit
  W: '#f0f0f0',  // white stripes
  s: '#f0c07a',  // skin
  K: '#1a1a2e',  // black sneaker
};

const PAL_KOSZ = {
  O: '#111111',  // outline
  M: '#666666',  // bin body mid grey
  L: '#888888',  // bin shine / lid
  G: '#555555',  // bin inner grey
  D: '#333333',  // bin inner dark
};

const PAL_LAWKA = {
  O: '#111111',  // outline
  B: '#5c3c18',  // dark wood (backrest)
  W: '#7a5228',  // wood mid (seat)
  L: '#9a6a38',  // wood light (highlight)
  M: '#606060',  // metal legs
};

const PAL_AUTO = {
  O: '#111111',  // outline
  R: '#cc2200',  // Maluch red
  D: '#881800',  // dark red (cabin sides)
  W: '#aaccdd',  // windshield glass
  K: '#1a1a1a',  // wheel rubber
  T: '#555555',  // wheel rim
  P: '#e8e8d0',  // license plate
};

const PAL_KIOSK = {
  O: '#111111',  // outline
  E: '#c8b090',  // beige wall
  V: '#5c3c18',  // dark wood (roof / door)
  Y: '#f0c040',  // yellow sign (RUCH)
  A: '#cc2020',  // red awning
  G: '#aaccee',  // glass window
};

// ── Sprite pixel grids ───────────────────────────────────────────────────────
// All rows must be exactly W chars (W = grid[0].length).
// '.' = transparent. Other chars must be in the palette.

// FLOOR TILE A — darker asphalt with horizontal crack (16x16)
const ASPHALT_A = [
  'AABBAABBBBAABBAA',
  'BAABBBBAAABBBBAB',
  'ABBAABBBAABBBAAB',
  'BAABBAACBBBAAABB',
  'AABBDDDDDDDDAABB',
  'BADDDDDDDDDDDDAB',
  'BAABBAABBAABBAAB',
  'AABBAAACBBAAABBA',
  'BBAABBBBBBBBAAAB',
  'ABBAABBBAABBBAAB',
  'BAABBAABBAABBAAB',
  'AABBAABBBBAABBAA',
  'BAABBBBAAABBBBAB',
  'ABBAABBBAABBBAAB',
  'BAABBAABBAABBAAB',
  'AABBAAABBBAAABBA',
];

// FLOOR TILE B — lighter asphalt with diagonal crack (16x16)
const ASPHALT_B = [
  'BBCCBBCCAABBCCBB',
  'CCBBCCBBCCBBCCBB',
  'BBCCAABBCCAABBCC',
  'CCBBDDDDDDDDCCBB',
  'BBCCDDDDDDDABBCC',
  'CCBBBBDDDDBBCCBB',
  'BBCCBBBBCCBBBBCC',
  'CCBBCCBBCCBBCCBB',
  'BBCCAABBCCAABBCC',
  'CCBBCCBBCCBBCCBB',
  'BBCCBBCCAABBCCBB',
  'CCBBCCBBCCBBCCBB',
  'BBCCAABBCCAABBCC',
  'CCBBCCBBCCBBCCBB',
  'BBCCBBCCAABBCCBB',
  'CCBBCCBBCCBBCCBB',
];

// SKEJC — grey hoodie, dark cap, denim jeans, white sneakers (16x16 top-down)
const SKEJC = [
  '................',
  '.....OOOOO......',
  '....OGcccGO.....',
  '...OGGcccGGO....',
  '...OGcssscGO....',
  '...OGcssscGO....',
  '...OGGcccGGO....',
  '...OGGGGGGGO....',
  '..OGGGGGGGGGO...',
  '..OGJJJJJJJGO...',
  '..OJJJJJJJJJO...',
  '...OJJJJJJJO....',
  '...OWWOOOOWWO...',
  '...OWWOOOOWWO...',
  '................',
  '................',
];

// DRESIAR — Adidas blue tracksuit with white stripes (16x16 top-down)
const DRESIAR = [
  '................',
  '.....OOOOO......',
  '....OBBBBBO.....',
  '...OBBsssBO.....',
  '...OBsssssBO....',
  '...OBsssssBO....',
  '...OBBBBBBO.....',
  '...OBBBBBBO.....',
  '..OWBBBBBBBWO...',
  '..OWBBBBBBBWO...',
  '..OBBBBBBBBBO...',
  '...OBBBBBBBO....',
  '...OBBBOOBBBO...',
  '...OKKOOOKKO....',
  '...OKKOOOKKO....',
  '................',
];

// KOSZ — metal trash bin, top-down (16x16)
const KOSZ = [
  '................',
  '....OOOOOOOO....',
  '...OMMMMMMMMO...',
  '..OMMLLLLLLMMO..',
  '..OMLLGGGGLLMO..',
  '..OMLLGGGGLLMO..',
  '..OMGGGGGGGGMO..',
  '..OMGGDDDDGGMO..',
  '..OMGGDDDDGGMO..',
  '..OMGGGGGGGGMO..',
  '..OMLLGGGGLLMO..',
  '..OMMLLLLLLMMO..',
  '...OMMMMMMMMO...',
  '....OOOOOOOO....',
  '................',
  '................',
];

// LAWKA — park bench, two wood planks + metal legs (32x16 top-down)
// LAWKA rows built with string repetition to guarantee correct widths (32 chars)
const _LAWKA_EDGE  = '.' + 'O'.repeat(30) + '.';          // 32 ✓
const _LAWKA_BACK  = '.' + 'O' + 'B'.repeat(28) + 'O' + '.'; // 32 ✓
const _LAWKA_SEAT  = '.' + 'O' + 'W'.repeat(28) + 'O' + '.'; // 32 ✓
const _LAWKA_LITE  = '.' + 'O' + 'W' + 'L'.repeat(26) + 'W' + 'O' + '.'; // 32 ✓
const _LAWKA_LEGS  = '..OMM.......OMM.......OMM.......';   // 32 ✓
const _LAWKA_BLANK = '.'.repeat(32);                        // 32 ✓

const LAWKA = [
  _LAWKA_BLANK,  //  0
  _LAWKA_EDGE,   //  1  outline
  _LAWKA_BACK,   //  2  backrest dark
  _LAWKA_BACK,   //  3  backrest dark
  _LAWKA_EDGE,   //  4  gap between backrest and seat
  _LAWKA_SEAT,   //  5  seat plank 1
  _LAWKA_LITE,   //  6  seat plank 1 highlight
  _LAWKA_SEAT,   //  7  seat plank 1
  _LAWKA_SEAT,   //  8  seat plank 2
  _LAWKA_LITE,   //  9  seat plank 2 highlight
  _LAWKA_SEAT,   // 10  seat plank 2
  _LAWKA_EDGE,   // 11  outline
  _LAWKA_LEGS,   // 12  legs
  _LAWKA_LEGS,   // 13
  _LAWKA_LEGS,   // 14
  _LAWKA_BLANK,  // 15
];

// AUTO — Fiat 126p (Maluch), top-down red car (32x48)
// Built with string repetition to guarantee 32-char rows.
const _A_BLANK  = '.'.repeat(32);
const _A_BUMP   = '.'.repeat(4) + 'O'.repeat(22) + '.'.repeat(6);   // front/rear outline
const _A_HOOD   = '..OO' + 'R'.repeat(22) + 'OO' + '....';          // hood front/rear
const _A_WHL_O  = 'OOK'  + 'R'.repeat(24) + 'KOO' + '..';           // wheel outer row
const _A_WHL_I  = 'OKT'  + 'R'.repeat(24) + 'TKO' + '..';           // wheel rim row
const _A_BODY   = '..O'  + 'R'.repeat(24) + 'OO' + '...';           // plain body row
const _A_WIND   = '..OR' + 'W'.repeat(24) + 'RO' + '..';            // windshield
const _A_CAB    = '..OR' + 'D' + 'R'.repeat(21) + 'D' + 'RO' + '...'; // cabin sides
const _A_REAR   = '..OOP' + 'R'.repeat(20) + 'POO' + '....';         // rear bumper+plates

// verify all 32 chars at definition time
[_A_BLANK,_A_BUMP,_A_HOOD,_A_WHL_O,_A_WHL_I,_A_BODY,_A_WIND,_A_CAB,_A_REAR].forEach((s,i) => {
  if (s.length !== 32) throw new Error(`AUTO template ${i} is ${s.length} chars, expected 32`);
});

const AUTO = [
  _A_BLANK,  //  0
  _A_BLANK,  //  1
  _A_BUMP,   //  2  front bumper outline
  _A_HOOD,   //  3  hood front
  _A_WHL_O,  //  4  front wheel outer
  _A_WHL_I,  //  5  front wheel rim
  _A_WHL_I,  //  6  front wheel rim
  _A_WHL_O,  //  7  front wheel outer
  _A_BODY,   //  8  hood lower
  _A_WIND,   //  9  front windshield
  _A_WIND,   // 10
  _A_WIND,   // 11
  _A_BODY,   // 12  A-pillar
  _A_CAB,    // 13  cabin
  _A_CAB,    // 14
  _A_CAB,    // 15
  _A_CAB,    // 16
  _A_CAB,    // 17
  _A_CAB,    // 18
  _A_CAB,    // 19
  _A_CAB,    // 20
  _A_CAB,    // 21
  _A_CAB,    // 22
  _A_CAB,    // 23
  _A_CAB,    // 24
  _A_BODY,   // 25  C-pillar
  _A_WIND,   // 26  rear windshield
  _A_WIND,   // 27
  _A_WIND,   // 28
  _A_BODY,   // 29  trunk line
  _A_WHL_O,  // 30  rear wheel outer
  _A_WHL_I,  // 31  rear wheel rim
  _A_WHL_I,  // 32  rear wheel rim
  _A_WHL_O,  // 33  rear wheel outer
  _A_REAR,   // 34  rear bumper + plates
  _A_BUMP,   // 35  rear bumper outline
  _A_BLANK, _A_BLANK, _A_BLANK, _A_BLANK, _A_BLANK, _A_BLANK,  // 36-41
  _A_BLANK, _A_BLANK, _A_BLANK, _A_BLANK, _A_BLANK, _A_BLANK,  // 42-47
];

// KIOSK — Ruch street kiosk, top-down (32x48)
// Built with string repetition to guarantee 32-char rows.
const _K_BLANK  = '.'.repeat(32);
const _K_FRAME  = '..' + 'O'.repeat(28) + '..';                   // outline row
const _K_ROOF   = '..O' + 'V'.repeat(26) + 'O..';                 // dark wood roof
const _K_SIGN   = '..OO' + 'Y'.repeat(21) + 'OOOO' + '...';       // yellow sign
const _K_AWNING = '..OO' + 'A'.repeat(21) + 'OOO' + '....';       // red awning
const _K_WALL   = '..OO' + 'E'.repeat(21) + 'OOO' + '....';       // beige wall / ledge / base
const _K_WIN    = '..OO' + 'EEEE' + 'O' + 'G'.repeat(12) + 'E' + 'OOO' + '.......'; // window
const _K_DOOR   = '..OO' + 'EEEE' + 'OO' + 'V'.repeat(10) + 'OO' + 'E' + 'OO' + '.......'; // door

[_K_BLANK,_K_FRAME,_K_ROOF,_K_SIGN,_K_AWNING,_K_WALL,_K_WIN,_K_DOOR].forEach((s,i) => {
  if (s.length !== 32) throw new Error(`KIOSK template ${i} is ${s.length} chars, expected 32`);
});

const KIOSK = [
  _K_BLANK,   //  0
  _K_FRAME,   //  1  outer wall outline
  _K_ROOF,    //  2  dark wood roof
  _K_ROOF,    //  3
  _K_SIGN,    //  4  yellow RUCH sign
  _K_SIGN,    //  5
  _K_SIGN,    //  6
  _K_AWNING,  //  7  red awning stripe
  _K_AWNING,  //  8
  _K_WALL,    //  9  beige wall
  _K_WIN,     // 10  glass window
  _K_WIN,     // 11
  _K_WIN,     // 12
  _K_WIN,     // 13
  _K_WIN,     // 14
  _K_WIN,     // 15
  _K_WIN,     // 16
  _K_WIN,     // 17
  _K_WIN,     // 18
  _K_WIN,     // 19
  _K_WIN,     // 20
  _K_WIN,     // 21
  _K_WALL,    // 22  counter ledge
  _K_WALL,    // 23
  _K_DOOR,    // 24  door
  _K_DOOR,    // 25
  _K_DOOR,    // 26
  _K_DOOR,    // 27
  _K_DOOR,    // 28
  _K_DOOR,    // 29
  _K_DOOR,    // 30
  _K_DOOR,    // 31
  _K_DOOR,    // 32
  _K_DOOR,    // 33
  _K_DOOR,    // 34
  _K_WALL,    // 35  base wall
  _K_FRAME,   // 36  outline bottom
  _K_BLANK, _K_BLANK, _K_BLANK, _K_BLANK, _K_BLANK,  // 37-41
  _K_BLANK, _K_BLANK, _K_BLANK, _K_BLANK, _K_BLANK,  // 42-46
  _K_BLANK,                                            // 47
];

// ── Generate all sprites ──────────────────────────────────────────────────────

write('asphalt-a.svg', ASPHALT_A, PAL_ASPHALT_A);
write('asphalt-b.svg', ASPHALT_B, PAL_ASPHALT_B);
write('skejc.svg',     SKEJC,     PAL_SKEJC);
write('dresiar.svg',   DRESIAR,   PAL_DRESIAR);
write('kosz.svg',      KOSZ,      PAL_KOSZ);
write('lawka.svg',     LAWKA,     PAL_LAWKA);
write('auto.svg',      AUTO,      PAL_AUTO);
write('kiosk.svg',     KIOSK,     PAL_KIOSK);

console.log(`\nDone! Sprites in: ${OUT}`);
