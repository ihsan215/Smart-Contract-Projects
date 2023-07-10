// Impelemantation libs
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs-extra";
import solc from "solc";

// Get Paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const buildPath = path.resolve(__dirname, "build");
const campaignPath = path.resolve(__dirname, "contracts", "Campaign.sol");

// Read Campaign.sol
const source = fs.readFileSync(campaignPath, "utf-8");

// Setting Solc Compiler
const input = {
  language: "Solidity",
  sources: {
    "Campaign.sol": {
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

// Compile Campaign.sol
const output = JSON.parse(solc.compile(JSON.stringify(input))).contracts[
  "Campaign.sol"
];

// Check build is exist if not create
fs.ensureDirSync(buildPath);

// Convert Json files
for (let contract in output) {
  fs.outputJsonSync(
    path.resolve(buildPath, contract.replace(":", "") + ".json"),
    output[contract]
  );
}
console.log("END");
