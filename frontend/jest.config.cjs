// jest.config.cjs
module.exports = {
    testEnvironment: "jsdom",
    transform: {
        "^.+\\.[jt]sx?$": "babel-jest",
    },
    moduleFileExtensions: ["js", "jsx", "json"],

    setupFilesAfterEnv: ["<rootDir>/src/tests/setupTests.js"],
};
