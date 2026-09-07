module.exports = {
    preset: 'ts-jest/presets/default-esm',
    testEnvironment: 'node',
    roots: ['<rootDir>/src'],
    testMatch: ['**/*.test.ts'],
    moduleFileExtensions: ['ts', 'js', 'json'],
    extensionsToTreatAsEsm: ['.ts'],
    moduleNameMapper: {
        '^(\\.{1,2}/.*)\\.js$': '$1'
    },
    collectCoverageFrom: ['src/**/*.ts', '!src/**/*.test.ts'],
    coverageThreshold: {
        global: {
            lines: 80,
            statements: 80,
            functions: 90,
            branches: 75
        }
    },
    transform: {
        '^.+\\.tsx?$': [
            'ts-jest',
            { useESM: true }
        ]
    }
};
