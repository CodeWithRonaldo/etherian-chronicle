import { createThirdwebClient, getContract } from "thirdweb";
import abi from "../../abi.json";
import { baseSepolia } from "thirdweb/chains";

//contract address
const address = "0x38D852B2Af85646EF547c8C19103EB44B8150d8D";

export const client = createThirdwebClient({
  clientId: import.meta.env.VITE_THIRD_WEB_CLIENT_ID,
});

export const contract = getContract({
  client,
  chain: baseSepolia,
  address,
  abi,
});
