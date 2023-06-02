export default () => {
  return {
    files: [
      { pattern: "fixtures/**/*", instrument: false },
      { pattern: "scripts/*", instrument: false },
      { pattern: "package.json", instrument: false },
      { pattern: "tsconfig.*", instrument: false },
      "ts/**/*.ts",
      "!ts/**/*.spec.ts",
    ],
    tests: ["ts/**/*.spec.ts"],
    env: {
      type: "node",
    },
    autoDetect: true
  };
};
