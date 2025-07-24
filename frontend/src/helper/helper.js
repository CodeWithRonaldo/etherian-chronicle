import { prepareContractCall, sendTransaction } from "thirdweb";
import { contract } from "../clients/thirdWebClient";
export function covertToNamedObject(objectData, objectType = "story") {
  const {
    0: chapterId,
    1: ipfsHash,
    2: choices,
    3: voteEndTime,
    4: winningChoiceIndex,
    5: isResolved,
    6: voteCountSum,
  } = objectData;

  const {
    0: storyId,
    1: writer,
    2: title,
    3: summary,
    4: ipfsHashImage,
    5: collaborators,
    6: StoryStatus,
    7: proposalVoteEndTime,
    8: proposalYesVotes,
    9: proposalNoVotes,
    10: currentChapterIndex,
    11: totalChapters,
    12: chapters,
  } = objectData;

  if (objectType === "story") {
    return {
      storyId,
      writer,
      title,
      summary,
      ipfsHashImage,
      collaborators,
      StoryStatus,
      proposalVoteEndTime,
      proposalYesVotes,
      proposalNoVotes,
      currentChapterIndex,
      totalChapters,
      chapters,
    };
  } else {
    return {
      chapterId,
      ipfsHash,
      choices,
      voteEndTime,
      winningChoiceIndex,
      isResolved,
      voteCountSum,
    };
  }
}

export const executeAndSignTransaction = async (
  method,
  params,
  account,
  listener
) => {
  const transaction = prepareContractCall({
    contract,
    method: method,
    params: params,
  });

  const reciept = await sendTransaction({
    transaction,
    account,
  });

  console.log(reciept);
  listener();
};
