const fs = require('fs');
const path = require('path');

const outDir = path.join(__dirname, '..', 'dist-cjs');
fs.mkdirSync(outDir, { recursive: true });
const pkgPath = path.join(outDir, 'package.json');
fs.writeFileSync(pkgPath, JSON.stringify({ type: 'commonjs' }, null, 2) + '\n');
