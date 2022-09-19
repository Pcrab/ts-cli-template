import type { Config } from "jest";

const config: Config = {
    preset: "ts-jest/presets/default-esm",
    moduleNameMapper: {
        "^(\\.{1,2}/.*)\\.js$": "$1",
    },
    testEnvironment: "jsdom",
    testMatch: ["**/__tests__/**/*.+(ts)", "**/?(*.)+(spec|test).+(ts)"],
    collectCoverage: true,
    transform: {
        "<regex_match_files": [
            "ts-jest",
            {
                useESM: true,
            },
        ],
    },
};

export default config;
