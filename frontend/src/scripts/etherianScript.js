import {
  prepareContractCall,
  sendTransaction,
  getContractEvents,
} from "thirdweb";
import { contract } from "./src/clients/thirdWebClient";
import { useActiveAccount } from "thirdweb/react";

const account = useActiveAccount();

export const createStoryProposal = async () => {
  const transaction = prepareContractCall({
    contract,
    method: "createStoryProposal",
    param: [
      "Title",
      "Summary",
      "QmImageIpfsHash...",
      "QmChapter1ContentIpfsHash...",
      ["Choice 1", "Choice 2"],
      ["0xCollaborator1", "0xCollaborator2"],
      86400,
    ],
  });

  const reciept = await sendTransaction({
    transaction,
    account,
  });

  console.log(reciept);
};

export const storyProposed = async () => {
  const storyProp = [];

  const events = await getContractEvents({
    contract,
    eventName: "StoryProposed",
  });

  events.forEach((event) => {
    storyProp.push(event);
  });

  return storyProp;
};
