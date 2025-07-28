import { createThirdwebClient, defineChain, getContract } from "thirdweb";
import abi from "../../abi.json";
import { etherlinkTestnet } from "viem/chains";

//contract address
const address = "0x3D3AB388195c43aF63e0F9665f29ea1CCe121EF5";

export const client = createThirdwebClient({
  clientId: import.meta.env.VITE_THIRD_WEB_CLIENT_ID,
});

export const contract = getContract({
  client,
  chain: defineChain(etherlinkTestnet),
  address,
  abi,
});
