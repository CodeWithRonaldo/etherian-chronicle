import { createContext } from "react";

export const storyData = createContext({
  allStories: [],
  createStoryProposal: () => {},
  getAllStories: () => {},
  isLoading: Boolean,
});
