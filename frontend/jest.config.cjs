// jest.config.cjs
module.exports = {
  testEnvironment: "jsdom", // để test React / DOM
  transform: {
    "^.+\\.[jt]sx?$": "babel-jest", // dùng babel-jest cho .js, .jsx
  },
  moduleNameMapper: {
    "\\.(css|less|sass|scss)$": "identity-obj-proxy", // tránh lỗi import CSS
  },
  setupFilesAfterEnv: ["<rootDir>/src/tests/setupTests.js"],
  moduleFileExtensions: ["js", "jsx", "json"],
  roots: ["<rootDir>/src"],
  testMatch: ["**/tests/**/*.test.(js|jsx)"], 

  collectCoverage: true,
  collectCoverageFrom: [
    "src/utils/productValidation.js",
    "src/components/ProductForm.jsx",
  ],
  coverageDirectory: "coverage",
};
