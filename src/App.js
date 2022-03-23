import "../src/App.css";
import React, { useEffect, useState, useCallback } from "react";
import Web3 from "web3";
import detectEthereumProvider from "@metamask/detect-provider";
import { loadContract } from "./utils/load-contract"; //to load smart contract

function App() {
  const [web3Api, setWeb3Api] = useState({
    provider: null,
    web3: null,
    contract: null,
  });

  //States
  const [account, setAccount] = useState(null);
  const [balance, setBalance] = useState(null);
  const [shouldReload, reload] = useState(false);

  const reloadEffect = () => reload(!shouldReload);

  //will load once - runs code after React has updated the DOM
  useEffect(() => {
    const loadProvider = async () => {
      const provider = await detectEthereumProvider();
      const contract = await loadContract("Faucet", provider); //load smart contract

      if (provider) {
        //provider.request({ method: "eth_requestAccounts" });
        setWeb3Api({
          web3: new Web3(provider), //we will use this globally
          provider,
          contract,
        });
      } else {
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
  }, [web3Api, account]);

  console.log(web3Api.web3);

  return (
    <div className="faucet-wrapper">
      <div className="faucet">
        <div className="is-flex is-align-items-center">
          <span>
            <strong className="mr-2">Account: </strong>
          </span>
          {account ? (
            <span>{account}</span>
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
        <div className="balance-view is-size-2 my-4">
          Current Balance: <strong>{balance}</strong> ETH
        </div>
        <button className="button is-link mr-2" onClick={addFunds}>
          Donate 1 eth
        </button>
        <button className="button is-primary">Withdraw</button>
      </div>
    </div>
  );
}

export default App;
