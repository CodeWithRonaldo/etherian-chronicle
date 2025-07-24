import { useCallback, useContext, useEffect, useState } from "react";
import { userData } from "./userData";
import { useActiveAccount, useReadContract } from "thirdweb/react";
import { contract } from "../clients/thirdWebClient";
import { prepareContractCall, readContract, sendTransaction } from "thirdweb";
import { covertToNamedObject } from "../helper/converter";

export const UserDataContext = ({ children }) => {
  const [allStories, setAllStories] = useState([]);
  const account = useActiveAccount();

  const { data, isLoading } = useReadContract({
    contract,
    method: "getTotalStories",
    params: [],
  });

  const getAllStories = useCallback(async () => {
    if (data) {
      const totalStories = data;
      const stories = [];
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
      setAllStories(stories);
    }
  }, [data]);

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
    getAllStories();
  };

  useEffect(() => {
    getAllStories();
  }, [getAllStories]);

  return (
    <userData.Provider
      value={{
        allStories,
        createStoryProposal,
        getAllStories,
      }}
    >
      {children}
    </userData.Provider>
  );
};
