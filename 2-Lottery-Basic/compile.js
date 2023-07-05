import path from "path";
import { fileURLToPath } from "url";
import { readFileSync } from "fs";
import solc from "solc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const lotteryPath = path.resolve(__dirname, "contracts", "Lottery.sol");
const source = readFileSync(lotteryPath, "utf-8");

const input = {
  language: "Solidity",
  sources: {
    "Lottery.sol": {
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

const output = JSON.parse(solc.compile(JSON.stringify(input))).contracts[
  "Lottery.sol"
].Lottery;

export const ABI = output.abi;
export const BYTECODE = output.evm.bytecode.object;
