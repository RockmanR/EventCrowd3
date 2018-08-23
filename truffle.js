var HDWalletProvider = require("truffle-hdwallet-provider");
var mnemonic = "fence vapor genius reopen polar consider visa spawn indicate figure normal swim";

module.exports = {
      networks: {

          /**
          * @dev use this if you want to deploy your contracts internally using Ganache
          *
          * make sure that Metamask is connected to 'localhost', and using your Ganache account.
          * otherwise the browser won't display results correctly.
          */
          ganache: {
              host: "localhost",
              port: 8545,
              network_id: "*" // Match any network id
          },

          /**
          * @dev use this if you want to deploy your contracts in Rinkeby with Geth client
          *
          * make sure that Metamask is connected to 'localhost', and using your Mist/Geth account.
          * otherwise the browser won't display results correctly.
          *
          * Copy the address of the main account and place it below in "from" field.
          */
          geth: {
            host: "localhost",
            port: 8545,
            from: "0x88d25dE3ceACa489aeb673cFf4AA744e838a8aAC",
            network_id: 4,
            gas: 4612388
          },

          /**
          * @dev use this if you want to deploy your contracts in Rinkeby with the beautiful Infura API
          *
          * make sure that you've installed HDWallet in truffle account
          * make sure that you have provided the mnemonic. In my case I'm using mnemonic from Metamask account, since its easy to get from its settings.
          * make sure that Metamask is connected to 'Rinkeby' network, with a Metamask account that shares the same mnemonic as above.
          * otherwise the browser won't display results correctly.
          */
          infura: {
            provider: function() {
              return new HDWalletProvider(mnemonic, "https://rinkeby.infura.io/tm3DORiJ8Gq7H4ebjIlk")
            },
            network_id: 4,
            gas: 4612388
          }
      }
};
