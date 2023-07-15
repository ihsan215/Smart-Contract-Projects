// Impelemantation libs
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs-extra";
import solc from "solc";

console.log("START COMPILE");

// Get Paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const buildPath = path.resolve(__dirname, "build");
const contractPath = path.resolve(__dirname, "contracts", "Todo.sol");

// Read Todo.sol
const source = fs.readFileSync(contractPath, "utf-8");

// Setting Solc Compiler
const input = {
  language: "Solidity",
  sources: {
    "Todo.sol": {
      content: source,
    },
  },

  settings: {
    outputSelection: {
      "*": {
        "*": ["*"],
      },
    },
  },
};

// Compile Todo.sol
const output = JSON.parse(solc.compile(JSON.stringify(input))).contracts[
  "Todo.sol"
];

// Check build is exist if not create

fs.ensureDirSync(buildPath);

fs.outputJsonSync(
  path.resolve(buildPath, "TodoContract.json"),
  output["TodoContract"]
);

console.log("END COMPILE");
