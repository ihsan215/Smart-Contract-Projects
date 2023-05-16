const HDWalletProvider = require('@truffle/hdwallet-provider');
const Web3 = require('web3');
const {abi,evm} = require('./compile');

const provider = new HDWalletProvider(
 'play warm trim range embark practice unique husband width pool cupboard chalk',
 'https://goerli.infura.io/v3/3b346ae8c9464b64bba64bcd4b83772a'
);

const web3 = new Web3(provider);

const deploy = async () =>{
      // Get a List of all accounts
     const accounts = await web3.eth.getAccounts();

      // Use one of those accounts to deploy the contract
      const lottery =   await new web3.eth.Contract(abi)
      .deploy({data:evm.bytecode.object,arguments:[]})
          .send({from: accounts[0] , gas: '1000000'});

    console.log(abi);
    console.log(lottery.options.address);

    provider.engine.stop();

};

deploy();