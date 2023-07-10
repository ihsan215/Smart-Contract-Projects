import HDWalletProvider from "@truffle/hdwallet-provider";
import Web3 from "web3";

import path from "path";
import { fileURLToPath } from "url";
import fs from "fs-extra";

// Get Json Paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const factoryPath = path.resolve(__dirname, "./build", "CampaignFactory.json");
const campaignPath = path.resolve(__dirname, "./build", "Campaign.json");

// Read Json Files
const compiledFactory = JSON.parse(fs.readFileSync(factoryPath, "utf-8"));
const compiledCampaign = JSON.parse(fs.readFileSync(campaignPath, "utf-8"));

const provider = new HDWalletProvider(
  "play warm trim range embark practice unique husband width pool cupboard chalk",
  "https://sepolia.infura.io/v3/a982c3980c384c479bdacd464b340085"
);

const web3 = new Web3(provider);

const deploy = async () => {
  const accounts = await web3.eth.getAccounts();

  const factory = await new web3.eth.Contract(compiledFactory.abi)
    .deploy({ data: compiledFactory.evm.bytecode.object })
    .send({ from: accounts[0], gas: "1400000" });

  await factory.methods.createCampaign("100").send({
    from: accounts[0],
    gas: "10000000",
  });

  const [campaignAddress] = await factory.methods.getDeployedCampaigns().call();
  const campaign = await new web3.eth.Contract(
    compiledCampaign.abi,
    campaignAddress
  );

  console.log(factory.options.address);
  console.log(campaign.options.address);

  provider.engine.stop();
};

deploy();
