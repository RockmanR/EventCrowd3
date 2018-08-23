// The below code is inspired by the TokenTutorial in TruffleBoxes. It surves my purpose for the Event Crowd contract
// As I don't have background on webdesign, I'm trying to minimize the scope of it.

App = {
  web3Provider: null,
  contracts: {},

  init: function() {
    return App.initWeb3();
  },

  initWeb3: function() {
    // Initialize web3
    if (typeof web3 !== 'undefined') {
      App.web3Provider = web3.currentProvider;
      web3 = new Web3(web3.currentProvider);
    } else {
      // set the provider to a local channel
      App.web3Provider = new Web3.providers.HttpProvider('http://127.0.0.1:9545');
      web3 = new Web3(App.web3Provider);
    }
    return App.initContract();
  },

  initContract: function() {

    // Retrieve the json file of the contract to interact with EventCrowd contract.
    $.getJSON('EventCrowd_01.json', function(data) {

      // Get the necessary contract artifact file and instantiate it with truffle-contract.
      var eventCrowdArtifact = data;
      App.contracts.EventCrowd_01 = TruffleContract(eventCrowdArtifact);

      // Set the provider for our contract.
      App.contracts.EventCrowd_01.setProvider(App.web3Provider);

      // call refreshPage to update the status of the contracts
      App.refreshPage();
      // call bindEvents to update the status of the contracts
      App.bindEvents();
    })

    // Retrieve the contract's json file to interact with the TicketToken contract.
    $.getJSON('TicketToken_01.json', function(data) {
      // Get the necessary contract artifact file and instantiate it with truffle-contract.
      var ticketTokenArtifact = data;
      App.contracts.TicketToken_01 = TruffleContract(ticketTokenArtifact);

      // Set the provider for our contract.
      App.contracts.TicketToken_01.setProvider(App.web3Provider);

      // call refreshPage to update the status of the contracts
      App.refreshPage();
    })
    ;

  },

  // Set the functionality for the web buttons
  bindEvents: function() {
    $(document).on('click', '#reserveButton', App.buyTickets);
    $(document).on('click', '#idtransferOwnership', App.transferOwnership);
    $(document).on('click', '#idClaimRefund', App.claimRefund);
    $(document).on('click', '#idFinalize', App.finalize);
    $(document).on('click', '#idEmergencyStop', App.emergencyStop);
    $(document).on('click', '#idSetTime', App.setTime);
    $(document).on('click', '#idRefresh', App.refreshPage);
  },

  // Update the status of the contract by executing all the related functions
  refreshPage: function() {
    App.getOpeningTime();
    App.getClosingTime();
    App.getStartStatus();
    App.getCloseStatus();
    App.getEthBalance();
    App.getFundingGoal();
    App.getTicketTokenAddress();
    App.getTicketTokenOwner();
    App.getEventCrowdAddress();
    App.getEventCrowdOwner();
    App.getCurrentMetaMaskAccount();
    App.getGoalReached();
    App.getTicketBalance();
    App.getIsFinalized();
    App.getContractBalance();
    App.getTotalSupply();
  },

  // please refer to the comment on EventCrowd_01.sol

  getOpeningTime: function() {
    var eventCrowdInstance;
                App.contracts.EventCrowd_01.deployed().then(function(instance) {
                  eventCrowdInstance = instance;
                  return eventCrowdInstance.timeToStartContract();
                }).then(function(result) {
                  console.log('Time to open: '+result);
                  $('#idContractStart').text(result +' seconds');
                }).catch(function(err) {
                  console.log(err.message);
                });
  },


  // please refer to the comment on EventCrowd_01.sol
  getClosingTime: function() {
    var eventCrowdInstance;
                App.contracts.EventCrowd_01.deployed().then(function(instance) {
                  eventCrowdInstance = instance;
                  return eventCrowdInstance.timeToCloseContract();
                }).then(function(result) {
                  console.log('Time to close: '+result);
                  $('#idContractClose').text(result +' seconds');
                }).catch(function(err) {
                  console.log(err.message);
                });
  },



  // please refer to the comment on EventCrowd_01.sol
    getGoalReached: function() {
      var eventCrowdInstance;
                  App.contracts.EventCrowd_01.deployed().then(function(instance) {
                    eventCrowdInstance = instance;
                    return eventCrowdInstance.goalReached();
                  }).then(function(result) {
                    $('#idGoalReached').text(result);
                    console.log('Goal reached: ' + result);
                  }).catch(function(err) {
                    console.log(err.message);
                  });
    },



    // please refer to the comment on EventCrowd_01.sol
    getIsFinalized: function() {
      var eventCrowdInstance;
                  App.contracts.EventCrowd_01.deployed().then(function(instance) {
                    eventCrowdInstance = instance;
                    return eventCrowdInstance.isFinalized.call();
                  }).then(function(result) {
                    console.log('Finalize status: '+result);
                    $('#idIsFinalized').text(result);
                  }).catch(function(err) {
                    console.log(err.message);
                  });
    },

    // please refer to the comment on EventCrowd_01.sol
    getStartStatus: function() {
      var eventCrowdInstance;
                  App.contracts.EventCrowd_01.deployed().then(function(instance) {
                    eventCrowdInstance = instance;
                    return eventCrowdInstance.getStartStatus();
                  }).then(function(result) {
                    console.log('Contract start: '+result);
                    $('#idContractStarted').text(result);
                  }).catch(function(err) {
                    console.log(err.message);
                  });
    },

    // please refer to the comment on EventCrowd_01.sol
    getCloseStatus: function() {
      var eventCrowdInstance;
                  App.contracts.EventCrowd_01.deployed().then(function(instance) {
                    eventCrowdInstance = instance;
                    return eventCrowdInstance.getCloseStatus();
                  }).then(function(result) {
                    console.log('Contract closure: '+result);
                    $('#idContractClosed').text(result);
                  }).catch(function(err) {
                    console.log(err.message);
                  });
    },


    // please refer to the comment on EventCrowd_01.sol
    getContractBalance: function() {
      var eventCrowdInstance;
                  App.contracts.EventCrowd_01.deployed().then(function(instance) {
                    eventCrowdInstance = instance;
                    return eventCrowdInstance.getEscrowAddress();
                  }).then(function(resultAdr) {
                          web3.eth.getBalance(resultAdr, function(error, result){
                          if(!error) {
                            $('#idConractBalanceEth').text(result/1000000000000000000 +' ether');
                            console.log('Funding raised: ' + result/1000000000000000000 +' ether');
                          }else
                            console.error(error);
                          })
                  }).catch(function(err) {
                    console.log(err.message);
                  });
    },

    // please refer to the comment on EventCrowd_01.sol
    getFundingGoal: function() {
      var eventCrowdInstance;
                  App.contracts.EventCrowd_01.deployed().then(function(instance) {
                    eventCrowdInstance = instance;
                    return eventCrowdInstance.goal.call();
                  }).then(function(result) {
                    console.log('Contract funding Goal: '+result/1000000000000000000+' ether');
                    $('#idFundingGoal').text(result/1000000000000000000 +' ether');
                  }).catch(function(err) {
                    console.log(err.message);
                  });
    },


  /**
  * @dev this function is used to send ether to EventCrowd in order to buy tickets (mine tokens)
  */
  buyTickets: function() {
    event.preventDefault();
    var eventCrowdInstance;
    var amount = parseInt($('#buyingAmount').val());

                web3.eth.getAccounts(function(error, accounts) {
                  if (error) {
                    console.log(error);
                  }
                      App.contracts.EventCrowd_01.deployed().then(function(instance) {
                      eventCrowdInstance = instance;
                        return eventCrowdInstance.sendTransaction( {from: accounts[0], value: web3.toWei(amount/100, 'ether')}); //
                      }).then(function(result) {
                         alert('Transfer Successful!');
                      }).catch(function(err) {
                         console.log(err.message);
                      });
                });
  },


  /**
  * @dev the TicketToken_01 contract is owned by the deployer at the beginning.
  * However, the ownership must be transferred to EventCrowd contract to be trustless and autonomus.
  * This is the function to do so.
  */
  transferOwnership: function() {
    event.preventDefault();
    var eventCrowdInstance;
                App.contracts.EventCrowd_01.deployed().then(function(instance) {
                eventCrowdInstance = instance;
                            App.contracts.TicketToken_01.deployed().then(function(instance) {
                              ticketInstance = instance;
                              return ticketInstance.transferOwnership(eventCrowdInstance.address);
                            }).then(function(result) {
                               alert('Ownership have transferred');
                            }).catch(function(err) {
                               console.log(err.message);
                            });
                }).then(function(result) {
                   // (opetional)
                }).catch(function(err) {
                   console.log(err.message);
                });
  },

  /**
  * @dev claimRefund function is located in RefundableCrowdsale.
  *
  * It can only be executed when 1) contract deadline reached 2) funding goal didn't reach
  * 3) Owner executed finalize
  *
  * The function takes the ether from escrow contract and returns it back to the user.
  * It also takes the tokens (tickets) from the user (technically burns them) with
  * burnByCrowdsale function located in BurnableCrowdsale contract.
  */
  claimRefund: function() {
    event.preventDefault();
    var eventCrowdInstance;
                App.contracts.EventCrowd_01.deployed().then(function(instance) {
                eventCrowdInstance = instance;
                return eventCrowdInstance.claimRefund({gas:1000000});
                }).then(function(result) {
                   console.log('claim refund clicked');
                }).catch(function(err) {
                   console.log(err.message);
                });
  },


  /**
  * @dev finalize function is located in FinalizableCrowdsale.
  *
  * It can only be executed when the contract have ended (passed deadline)
  *
  * Once clicked it takes the money from the escrow account to the _wallet address
  * (which is the fund raiser) if the funding goal have reached.
  *
  * However, if the goal didn't reach this button will change the the escrow account State
  * from "Active" to "withdraw", allowing the users to get their money back through claimRefund function.
  */
  finalize: function() {
    event.preventDefault();
    var eventCrowdInstance;
                App.contracts.EventCrowd_01.deployed().then(function(instance) {
                eventCrowdInstance = instance;
                return eventCrowdInstance.finalize();
                }).then(function(result) {
                   console.log('finalization clicked');
                }).catch(function(err) {
                   console.log(err.message);
                });
  },


  // please refer to the comment on EventCrowd_01.sol
  emergencyStop: function() {
    event.preventDefault();
    var eventCrowdInstance;
                App.contracts.EventCrowd_01.deployed().then(function(instance) {
                eventCrowdInstance = instance;
                return eventCrowdInstance.circuitBreaker();
                }).then(function(result) {
                   console.log('Emergency Stop clicked');
                }).catch(function(err) {
                   console.log(err.message);
                });
  },

  /**
  * @dev Get the address of the TicketToken contract
  */
  getTicketTokenAddress: function() {
    var ticketInstance;
                App.contracts.TicketToken_01.deployed().then(function(instance) {
                  ticketInstance = instance;
                  $('#idTicketTokenAddress').text(ticketInstance.address);
                  console.log('Address of TicketToken contract: ' + ticketInstance.address);
                });
  },

  /**
  * @dev Get the address of the EventCrowd contract
  */
  getEventCrowdAddress: function() {
    var eventCrowdInstance;
                App.contracts.EventCrowd_01.deployed().then(function(instance) {
                  eventCrowdInstance = instance;
                  $('#idEventCrowdAddress').text(eventCrowdInstance.address);
                  console.log('Address of EventCrowd contract: ' + eventCrowdInstance.address);
                });
  },

  /**
  * @dev Get the address of the TicketToken contract owner.
  * In our case the first owner is the deployer account.
  * then we need to transfer the onwership from our personal account to EventCrowd contract.
  */
  getTicketTokenOwner: function() {
    var ticketInstance;
                App.contracts.TicketToken_01.deployed().then(function(instance) {
                  ticketInstance = instance;
                  return ticketInstance.owner.call();
                }).then(function(result) {
                  $('#idTicketTokenOwner').text(result);
                  console.log('Address of TicketToken Owner: ' + result);
                }).catch(function(err) {
                  console.log(err.message);
                });
  },

  /**
  * @dev Get the address of the EventCrowd contract owner. It should be the deployer account used by Truffle.
  * In my example it is:
  * - Ganache account when connected to Ganache
  * - Metamask account wehn connected to Infura
  * - Mist account when connected to Geth
  */
  getEventCrowdOwner: function() {
    var eventCrowdInstance;
                App.contracts.EventCrowd_01.deployed().then(function(instance) {
                  eventCrowdInstance = instance;
                  return eventCrowdInstance.owner_.call();
                }).then(function(result) {
                  $('#idEventCrowdOwner').text(result);
                  console.log('Address of EventCrowd Ownder: ' + result);
                }).catch(function(err) {
                  console.log(err.message);
                });
  },

  /**
  * @dev Get the address of the current MetaMask that you are using.
  */
  getCurrentMetaMaskAccount: function() {
    var eventCrowdInstance;
                web3.eth.getAccounts(function(error, accounts) {
                  if (error) {
                    console.log(error);
                  }
                    $('#idCurrentAcount').text(accounts[0]);
                });
  },

  /**
  * @dev Get the current total supply of tokens (in our example tickets).
  * It increases when people by tickets and decreases when they withrow their funding
  */
  getTotalSupply: function() {
    var ticketInstance;
                App.contracts.TicketToken_01.deployed().then(function(instance) {
                  ticketInstance = instance;
                  return ticketInstance.totalSupply();
                }).then(function(result) {
                  $('#idConractBalanceTic').text((result/1000000000000000000)+ ' tickets');
                  console.log('Total Ticket supply: ' + (result/1000000000000000000));
                }).catch(function(err) {
                  console.log(err.message);
                });
  },

  /**
  * @dev Get the balance of tickets owned by the user, by refering to Metamask account.
  * The balance changes as you change the accounts from Metamask and refresh the page.
  */
  getTicketBalance: function() {
    var ticketInstance;
                web3.eth.getAccounts(function(error, accounts) {
                  if (error) {
                    console.log(error);
                  }
                              var account = accounts[0];
                              App.contracts.TicketToken_01.deployed().then(function(instance) {
                                ticketInstance = instance;
                                return ticketInstance.balanceOf.call(account);
                              }).then(function(result) {
                                console.log('Ticket balance of current user: '+(result/1000000000000000000));
                                $('#idTicketBalance').text((result.toNumber()/1000000000000000000)+ ' tickets');
                              }).catch(function(err) {
                                console.log(err.message);
                              });
                  });
  },

  /**
  * @dev Get the balance of ether from the escrow contract, which is the total funding amount.
  * Again, it increases when people by tickets and decreases when they withrow their funding
  */
  getEthBalance: function() {
    var eventCrowdInstance;
    var account;

                web3.eth.getAccounts(function(error, accounts) {
                  if (error) {
                    console.log(error);
                  }
                              account = accounts[0];
                              web3.eth.getBalance(account, function(error, result){
                                  if(!error) {
                                    $('#idEthBalance').text((result/1000000000000000000) +' ether');
                                      console.log('Ether balance of current user: ' + result/1000000000000000000);
                                  }else
                                      console.error(error);
                              })
                });
  },

  // please refer to the comment on EventCrowd_01.sol
  setTime: function() {
    var eventCrowdInstance;
    var startTime = parseInt($('#idSetStartTxt').val());
    var closingTime = parseInt($('#idSetCloseTxt').val());
                App.contracts.EventCrowd_01.deployed().then(function(instance) {
                  eventCrowdInstance = instance;
                  return eventCrowdInstance.setTime(startTime,closingTime);
                }).then(function() {                                      //there might be a way to do it without 'then'
                  console.log('The start of the contract is ' +startTime+ ' seconds from now');
                  console.log('The close of the contract is ' +closingTime+ ' seconds from now');
                }).catch(function(err) {
                  console.log(err.message);
                });
  },

  // this does nothing. its just a template for future functions. ignore it.
  lastFunc: function() {}

};

$(function() {
  $(window).load(function() {
    App.init();
  });
});
