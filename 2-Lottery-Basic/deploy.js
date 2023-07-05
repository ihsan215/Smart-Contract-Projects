import HDWalletProvider from "@truffle/hdwallet-provider";
import Web3 from "web3";
import { ABI, BYTECODE } from "./compile.js";

const provider = new HDWalletProvider(
  "play warm trim range embark practice unique husband width pool cupboard chalk",
  "https://sepolia.infura.io/v3/a982c3980c384c479bdacd464b340085"
);

const web3 = new Web3(provider);

const deploy = async () => {
  const accounts = await web3.eth.getAccounts();

  console.log("Accounts[0] : ", accounts[0]);

  const lottery = await new web3.eth.Contract(ABI)
    .deploy({
      data: BYTECODE,
    })
    .send({ from: accounts[0], gas: "1000000" });

  console.log("Deployed Contract adress is", lottery.options.address);
  console.log("Deployed Contract ABI is", ABI);

  provider.engine.stop();
};

deploy();
