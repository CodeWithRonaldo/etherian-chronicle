import { createThirdwebClient, defineChain, getContract } from "thirdweb";
import abi from "../../abi.json";
import { etherlinkTestnet } from "viem/chains";

//contract address
const address = "0xF3fe2368B7eC13FDb30715f113c71B960c94071F";

export const client = createThirdwebClient({
  clientId: import.meta.env.VITE_THIRD_WEB_CLIENT_ID,
});

export const contract = getContract({
  client,
  chain: defineChain(etherlinkTestnet),
  address,
  abi,
});
