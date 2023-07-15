import HDWalletProvider from "@truffle/hdwallet-provider";
import Web3 from "web3";

import path from "path";
import { fileURLToPath } from "url";
import fs from "fs-extra";

// Get Json Paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ContractPath = path.resolve(__dirname, "./build", "TodoContract.json");

// Read Json Files
const compiledContract = JSON.parse(fs.readFileSync(ContractPath, "utf-8"));

const provider = new HDWalletProvider(
  "play warm trim range embark practice unique husband width pool cupboard chalk",
  "https://sepolia.infura.io/v3/a982c3980c384c479bdacd464b340085"
);

const web3 = new Web3(provider);

const deploy = async () => {
  const accounts = await web3.eth.getAccounts();

  // deploy contract
  const TodoContract = await new web3.eth.Contract(compiledContract.abi)
    .deploy({
      data: compiledContract.evm.bytecode.object,
    })
    .send({ from: accounts[0], gas: "1500000" });

  console.log(TodoContract.options.address);
  provider.engine.stop();
};

deploy();
