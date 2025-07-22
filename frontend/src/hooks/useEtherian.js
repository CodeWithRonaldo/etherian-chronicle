import {
  prepareContractCall,
  sendTransaction,
  getContractEvents,
} from "thirdweb";
import { contract } from "../clients/thirdWebClient";
import { useActiveAccount } from "thirdweb/react";

export default function useEtherian() {
  const account = useActiveAccount();

  const createStoryProposal = async (storyDetails) => {
    if (!account) {
      console.log("you must connect wallet");
      return;
    }

    const tx = prepareContractCall({
      contract,
      method: "createStoryProposal",
      params: storyDetails,
    });

    const reciept = await sendTransaction({
      transaction: tx,
      account: account,
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
