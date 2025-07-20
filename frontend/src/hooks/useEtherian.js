import {
  prepareContractCall,
  sendTransaction,
  getContractEvents,
} from "thirdweb";
import { contract } from "../clients/thirdWebClient";
import { useActiveAccount } from "thirdweb/react";

export function useEtherian() {
  const account = useActiveAccount();

  const createStoryProposal = async (storyDetails) => {
    const transaction = prepareContractCall({
      contract,
      method: "createStoryProposal",
      param: storyDetails,
    });

    const reciept = await sendTransaction({
      transaction,
      account,
    });

    console.log(reciept);
  };

  const storyProposed = async () => {
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

  return {
    createStoryProposal,
    storyProposed,
  };
}
