import assert from "assert";
import ganache from "ganache-cli";
import Web3 from "web3";
import { ABI, BYTECODE } from "../compile.js";

const web3 = new Web3(ganache.provider());

let accounts;
let lottery;

beforeEach(async () => {
  accounts = await web3.eth.getAccounts();

  lottery = await new web3.eth.Contract(ABI)
    .deploy({
      data: BYTECODE,
    })
    .send({ from: accounts[0], gas: "1000000" });
});

describe("Lottery", () => {
  it("Check Deploy Contracts", () => {
    assert.ok(lottery.options.address);
  });

  it("Check Enter func", async () => {
    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei("0.02", "ether"),
    });

    const players = await lottery.methods.returnArrays().call({
      from: accounts[0],
    });

    assert.equal(accounts[0], players[0]);
    assert.equal(1, players.length);
  });

  it("check multiple entering", async () => {
    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei("0.02", "ether"),
    });

    await lottery.methods.enter().send({
      from: accounts[1],
      value: web3.utils.toWei("0.02", "ether"),
    });

    await lottery.methods.enter().send({
      from: accounts[2],
      value: web3.utils.toWei("0.02", "ether"),
    });

    const players = await lottery.methods.returnArrays().call({
      from: accounts[0],
    });

    assert.equal(3, players.length);
  });

  it("sends money to the winner & resets the players array", async () => {
    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei("1", "ether"),
    });

    const initialBalance = await web3.eth.getBalance(accounts[0]);

    await lottery.methods.pickWinner().send({
      from: accounts[0],
    });

    const finalBalance = await web3.eth.getBalance(accounts[0]);

    const difference = finalBalance - initialBalance;
    assert(difference > web3.utils.toWei("0.8", "ether"));
  });
});
