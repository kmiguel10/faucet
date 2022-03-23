//Create an abstraction to get contracts
import contract from "@truffle/contract";

//Receives contract name
export const loadContract = async (name, provider) => {
  //access json file from public folder - makes request to our localhost
  const res = await fetch(`/contracts/${name}.json`); //this is why we changed the structure of the artifcats/build to be in public folder
  const artifact = await res.json(); //extract json artifact file

  //Set provider
  const _contract = contract(artifact); //wrap artifact in contract abstraction
  _contract.setProvider(provider); //get provider from window object

  const deployedContract = null;
  try {
    //Ensure that contract is deployed then create an instance of that contract and return that instance
    deployedContract = await _contract.deployed();
  } catch {
    console.error("You are connected to the wrong network!");
  }

  return deployedContract;
};
