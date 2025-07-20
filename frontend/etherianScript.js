import { prepareContractCall, sendTransaction } from "thirdweb";
import { contract } from "./src/clients/thirdWebClient";
import { useActiveAccount } from "thirdweb/react";

const account = useActiveAccount();

export const proposeStory = async () => {
  const tx = prepareContractCall({
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

  await sendTransaction({
    transaction: tx,
    account,
    gasless: true,
  });
};
