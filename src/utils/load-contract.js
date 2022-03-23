//Create an abstraction to get contracts
import contract from "@truffle/contract";

//Receives contract name
export const loadContract = async (name) => {
  //access json file from public folder - makes request to our localhost
  const res = await fetch(`/contracts/${name}.json`);
  const Artifact = await res.json(); //extract json artifact file

  return contract(Artifact); //wrap artifact in contract abstraction
};
