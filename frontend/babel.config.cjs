module.exports = {
    presets: [
        [
            "@babel/preset-env",
            {
                targets: { node: "current" }, // Jest chạy trên Node hiện tại
            },
        ],
        [
            "@babel/preset-react",
            {
                runtime: "automatic", // JSX kiểu React 17+ (không cần import React)
            },
        ],
    ],
};
