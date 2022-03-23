import "../src/App.css";
import React, { useEffect, useState } from "react";
import Web3 from "web3";

function App() {
  const [web3Api, setWeb3Api] = useState({
    provider: null,
    web3: null,
  });

  const [account, setAccount] = useState(null);

  //will load once - runs code after React has updated the DOM
  useEffect(() => {
    const loadProvider = async () => {
      let provider = null;
      //handle difference scenarios of which provider to use
      if (window.ethereum) {
        provider = window.ethereum;
        //ask to enable metamask
        try {
          await provider.request({ method: "eth_requestAccounts" }); //to enable metamask
        } catch {
          console.error("User denied accounts access!");
        }
      } else if (window.web3) {
        //for legacy metamask
        provider = window.web3.currentProvider;
      } else if (!process.env.production) {
        //for ganace
        provider = new Web3.providers.HttpProvider("http://localhost:7545");
      }

      setWeb3Api({
        web3: new Web3(provider), //we will use this globally
        provider,
      });
    };
    loadProvider();
  }, []);

  useEffect(() => {
    const getAccount = async () => {
      const accounts = await web3Api.web3.eth.getAccounts();
      setAccount(accounts[0]);
    };

    web3Api.web3 && getAccount();
  }, [web3Api.web3]); //watches if web3 api is initialized - watcher

  console.log(web3Api.web3);

  return (
    <div className="faucet-wrapper">
      <div className="faucet">
        <span>
          <strong>Account: </strong>
        </span>
        <h1>{account ? account : "not connected"}</h1>
        <div className="balance-view is-size-2">
          Current Balance: <strong>10</strong> ETH
        </div>
        <button className="btn mr-2">Donate</button>
        <button className="btn">Withdraw</button>
      </div>
    </div>
  );
}

export default App;
