import { createContext } from "react";

export const StoryData = createContext({
  allStories: [],
  createStoryProposal: () => {},
  getAllStories: () => {},
  getStory: () => {},
  isLoading: Boolean,
});
