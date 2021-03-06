import "../src/App.css";
import React, { useEffect, useState, useCallback } from "react";
import Web3 from "web3";
import detectEthereumProvider from "@metamask/detect-provider";
import { loadContract } from "./utils/load-contract"; //to load smart contract

function App() {
  const [web3Api, setWeb3Api] = useState({
    provider: null,
    isProviderLoaded: false,
    web3: null,
    contract: null,
  });

  //States
  const [account, setAccount] = useState(null);
  const [balance, setBalance] = useState(null);
  const [shouldReload, reload] = useState(false);
  //True if connected to an account and has a contract
  const canConnectToContract = account && web3Api.contract;

  //Create a new instance, when shouldReloadValue changes -- which is tied to AddFunds
  const reloadEffect = useCallback(() => reload(!shouldReload), [shouldReload]);

  //Triggers when account changed - display the current account
  //ensures that account is not displayed when logged out of metamask
  const setAccountListener = (provider) => {
    provider.on("accountsChanged", (_) => window.location.reload()); //accountsChanged is from metamask - reload when account is changed
    provider.on("chainChanged", (_) => window.location.reload()); //chainChanged is from metamask - reload when network is changed

    // provider._jsonRpcConnection.events.on("notification", (payload) => {
    //   const { method } = payload;
    //   if (method == "metamask_unlockStateChanged") {
    //     setAccount(null);
    //   }
    // });
  };

  //will load once - runs code after React has updated the DOM
  useEffect(() => {
    const loadProvider = async () => {
      const provider = await detectEthereumProvider();

      if (provider) {
        const contract = await loadContract("Faucet", provider); //load smart contract - contract should not be loaded if there is no provider
        //provider.request({ method: "eth_requestAccounts" });
        setAccountListener(provider);
        setWeb3Api({
          web3: new Web3(provider), //we will use this globally
          provider,
          contract,
          isProviderLoaded: true,
        });
      } else {
        setWeb3Api((api) => ({
          ...api,
          isProviderLoaded: true,
        }));
        console.error("Please install metamask!");
      }
    };
    loadProvider();
  }, []);

  //Get contract balance
  useEffect(() => {
    const loadBalance = async () => {
      const { contract, web3 } = web3Api; //extract objects from web3Api
      const balance = await web3.eth.getBalance(contract.address);
      setBalance(web3.utils.fromWei(balance, "ether")); //convert from ether to wei
    };

    web3Api.contract && loadBalance();
  }, [web3Api, shouldReload]); //add shouldReload as dependency

  //Get Current account
  useEffect(() => {
    const getAccount = async () => {
      const accounts = await web3Api.web3.eth.getAccounts();
      setAccount(accounts[0]);
    };

    web3Api.web3 && getAccount();
  }, [web3Api.web3]); //watches if web3 api is initialized - watcher

  //Add funds function
  //a new instance will be generated once any of the dependencies change
  const addFunds = useCallback(async () => {
    const { contract, web3 } = web3Api;
    await contract.addFunds({
      from: account,
      value: web3.utils.toWei("1", "ether"),
    });

    //window.location.reload(); //reload the browser
    reloadEffect();
  }, [web3Api, account, reloadEffect]);

  //Function to withdraw funds
  const withdraw = async () => {
    const { contract, web3 } = web3Api;
    const withdrawAmount = web3.utils.toWei("0.1", "ether");
    await contract.withdraw(withdrawAmount, {
      from: account,
    });
    reloadEffect();
  };

  console.log(web3Api.web3);

  return (
    <div className="faucet-wrapper">
      <div className="faucet">
        {web3Api.isProviderLoaded ? (
          <div className="is-flex is-align-items-center">
            <span>
              <strong className="mr-2">Account: </strong>
            </span>
            {account ? (
              <div>{account}</div>
            ) : !web3Api.provider ? (
              <>
                <div className="notification is-warning is-small is-rounded">
                  {" "}
                  Wallet is not detected!{" "}
                  <a
                    rel="noreferrer"
                    target="_blank"
                    href="https://docs.metamask.io"
                  >
                    Install Metamask
                  </a>
                </div>
              </>
            ) : (
              <button
                className="button is-small"
                onClick={() => {
                  web3Api.provider.request({ method: "eth_requestAccounts" });
                }}
              >
                Connect Wallet
              </button>
            )}
          </div>
        ) : (
          <span>Looking for web3...</span>
        )}

        <div className="balance-view is-size-2 my-4">
          Current Balance: <strong>{balance}</strong> ETH
        </div>
        {!canConnectToContract && (
          <i className="is-block"> Connect to Ganache</i>
        )}
        <button
          disabled={!canConnectToContract}
          className="button is-link mr-2"
          onClick={addFunds}
        >
          Donate 1 eth
        </button>
        <button
          disabled={!canConnectToContract}
          className="button is-primary"
          onClick={withdraw}
        >
          Withdraw 0.1 eth
        </button>
      </div>
    </div>
  );
}

export default App;
