//Create an abstraction to get contracts
import contract from "@truffle/contract";

//Receives contract name
export const loadContract = async (name) => {
  //access json file from public folder - makes request to our localhost
  const res = await fetch(`/contracts/${name}.json`); //this is why we changed the structure of the artifcats/build to be in public folder
  const artifact = await res.json(); //extract json artifact file

  return contract(artifact); //wrap artifact in contract abstraction
};
