import { createContext } from "react";

export const userData = createContext({
  allStories: [],
  createStoryProposal: () => {},
  getAllStories: () => {},
  isLoading: Boolean,
});
