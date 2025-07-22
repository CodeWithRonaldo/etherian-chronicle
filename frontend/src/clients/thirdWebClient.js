import { createThirdwebClient, defineChain, getContract } from "thirdweb";
import abi from "../../abi.json";
import { etherlinkTestnet } from "viem/chains";

//contract address
const address = "0x38D852B2Af85646EF547c8C19103EB44B8150d8D";

export const client = createThirdwebClient({
  clientId: import.meta.env.VITE_THIRD_WEB_CLIENT_ID,
});

export const contract = getContract({
  client,
  chain: defineChain(etherlinkTestnet),
  address,
  abi,
});
