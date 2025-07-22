import { prepareContractCall, readContract, sendTransaction } from "thirdweb";
import { contract } from "../clients/thirdWebClient";
import { useActiveAccount, useReadContract } from "thirdweb/react";

export default function useEtherian() {
  const account = useActiveAccount();

  const { data, isLoading } = useReadContract({
    contract,
    method: "getTotalStories",
    params: [],
  });

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

  const getAllStories = async () => {
    const stories = [];
    if (!isLoading) {
      const totalStories = data;
      console.log("total stories:", totalStories);
      for (let i = 0; i < totalStories; i++) {
        const story = await readContract({
          contract,
          method: "stories",
          params: [i],
        });
        console.log("story:", story);
        stories.push(story);
      }
    }
    return stories;
  };

  return {
    createStoryProposal,
    getAllStories,
  };
}
