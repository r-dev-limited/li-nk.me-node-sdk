const fs = require('node:fs');
const path = require('node:path');
const { defaultsESM } = require('ts-jest/presets');

const workspaceRoot = path.resolve(__dirname, '../../');
const isWorkspaceInstall = fs.existsSync(path.join(workspaceRoot, 'package.json'));
const rootDir = isWorkspaceInstall ? workspaceRoot : __dirname;
const rootRelative = (relativePath) => path.relative(rootDir, path.join(__dirname, relativePath));

module.exports = {
    ...defaultsESM,
    rootDir,
    transform: {
        '^.+\\.m?tsx?$': ['ts-jest', { useESM: true, tsconfig: path.join(__dirname, 'tsconfig.json') }]
    },
    testEnvironment: 'node',
    roots: [path.join(__dirname, 'src')],
    testMatch: ['**/*.test.ts'],
    moduleFileExtensions: ['ts', 'js', 'json'],
    moduleNameMapper: {
        '^(\\.{1,2}/.*)\\.js$': '$1'
    },
    collectCoverageFrom: [rootRelative('src/**/*.ts'), `!${rootRelative('src/**/*.test.ts')}`],
    coverageThreshold: {
        global: {
            lines: 80,
            statements: 80,
            functions: 90,
            branches: 75
        }
    },
};
