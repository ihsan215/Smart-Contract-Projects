import Web3 from "web3";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs-extra";
import ganache from "ganache";
import assert from "assert";

// Get web3 instance
const web3 = new Web3(ganache.provider());

// Get Json Paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const contractPath = path.resolve(
  __dirname,
  "../ethereum/build",
  "TodoContract.json"
);

// Read Json File
const TodoContractObj = JSON.parse(fs.readFileSync(contractPath, "utf-8"));

let accounts;
let TodoContract;

beforeEach(async () => {
  // Get wallet address
  accounts = await web3.eth.getAccounts();
});

describe("TodoContract Test", () => {
  // Test Deploy Contract
  it("Test the contract is deployed ? ", () => {
    assert.ok(TodoContract.options.address);
  });

  // Test Add Item into to Todo List
  it("Test Add Item", async () => {
    // Set dummy msg
    const listItemMSg = "Dummy Message";

    // Write msg to list
    await TodoContract.methods.addItemtoList(listItemMSg, 0).send({
      from: accounts[0],
    });

    // Read msg from list
    const TodoObj = await TodoContract.methods.getTodo(accounts[0], 0).call({
      from: accounts[0],
    });

    assert.equal(TodoObj.ListText, listItemMSg);
  });

  it("Check Item", async () => {
    // Set dummy msg
    const listItemMSg = "Dummy Message";

    // Write msg to list
    await TodoContract.methods.addItemtoList(listItemMSg, 0).send({
      from: accounts[0],
    });

    await TodoContract.methods.checkTodoListItem(accounts[0], 0).send({
      from: accounts[0],
    });

    // Read msg from list
    const TodoObj = await TodoContract.methods.getTodo(accounts[0], 0).call({
      from: accounts[0],
    });

    assert.equal(TodoObj.isComplete, 1n);
  });
});
