import { prepareContractCall, readContract, sendTransaction } from "thirdweb";
import { contract } from "../clients/thirdWebClient";
import { useActiveAccount, useReadContract } from "thirdweb/react";
import { covertToNamedObject } from "../helper/converter";

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
      for (let i = 0; i < totalStories; i++) {
        let story = covertToNamedObject(
          await readContract({
            contract,
            method: "getStoryDetails",
            params: [i],
          })
        );
        const chapters = [];

        for (let j = 0; j < story.totalChapters; j++) {
          const chapter = covertToNamedObject(
            await readContract({
              contract,
              method: "getChapter",
              params: [i, j],
            }),
            "chapter"
          );
          chapters.push(chapter);
        }

        story.chapters = chapters;
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
