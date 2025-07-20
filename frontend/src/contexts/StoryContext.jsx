import React, { createContext, useContext, useState, useEffect } from 'react';
import { mockStories, mockProposals, mockChapters } from '../mock-data/stories';

const StoryContext = createContext();

export const StoryProvider = ({ children }) => {
  const [stories, setStories] = useState([]);
  const [proposals, setProposals] = useState([]);
  const [chapters, setChapters] = useState({});
  const [currentStory, setCurrentStory] = useState(null);
  const [currentChapter, setCurrentChapter] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [userVotes, setUserVotes] = useState({});
  const [filters, setFilters] = useState({
    genre: 'all',
    status: 'all',
    sortBy: 'popularity',
  });

  useEffect(() => {
    // Load mock data
    setLoading(true);
    setTimeout(() => {
      setStories(mockStories);
      setProposals(mockProposals);
      setChapters(mockChapters);
      setLoading(false);
    }, 500);
  }, []);

  const voteOnProposal = (proposalId, vote) => {
    setProposals(prev => prev.map(proposal =>
      proposal.id === proposalId
        ? {
            ...proposal,
            votes: {
              ...proposal.votes,
              [vote]: proposal.votes[vote] + 1,
            },
          }
        : proposal
    ));
    
    setUserVotes(prev => ({
      ...prev,
      [`proposal-${proposalId}`]: vote,
    }));
  };

  const voteOnChapter = (storyId, chapterId, choiceId) => {
    setChapters(prev => ({
      ...prev,
      [storyId]: prev[storyId]?.map(chapter =>
        chapter.id === chapterId
          ? {
              ...chapter,
              choices: chapter.choices.map(choice =>
                choice.id === choiceId
                  ? { ...choice, votes: choice.votes + 1 }
                  : choice
              ),
            }
          : chapter
      ),
    }));
    
    setUserVotes(prev => ({
      ...prev,
      [`chapter-${chapterId}`]: choiceId,
    }));
  };

  const addStory = (story) => {
    const newStory = {
      ...story,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      status: 'active',
      stats: {
        totalReaders: 0,
        totalVotes: 0,
        completionRate: 0,
        averageRating: 0,
      },
    };
    setStories(prev => [...prev, newStory]);
  };

  const addProposal = (proposal) => {
    const newProposal = {
      ...proposal,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      status: 'pending',
      votes: { yes: 0, no: 0 },
    };
    setProposals(prev => [...prev, newProposal]);
  };

  const updateFilters = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const getFilteredStories = () => {
    let filtered = [...stories];

    if (filters.genre !== 'all') {
      filtered = filtered.filter(story => story.genre === filters.genre);
    }

    if (filters.status !== 'all') {
      filtered = filtered.filter(story => story.status === filters.status);
    }

    switch (filters.sortBy) {
      case 'popularity':
        filtered.sort((a, b) => b.stats.totalReaders - a.stats.totalReaders);
        break;
      case 'newest':
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case 'votes':
        filtered.sort((a, b) => b.stats.totalVotes - a.stats.totalVotes);
        break;
      default:
        break;
    }

    return filtered;
  };

  const value = {
    stories,
    proposals,
    chapters,
    currentStory,
    currentChapter,
    loading,
    error,
    userVotes,
    filters,
    voteOnProposal,
    voteOnChapter,
    addStory,
    addProposal,
    setCurrentStory,
    setCurrentChapter,
    updateFilters,
    getFilteredStories,
  };

  return (
    <StoryContext.Provider value={value}>
      {children}
    </StoryContext.Provider>
  );
};

export const useStory = () => {
  const context = useContext(StoryContext);
  if (!context) {
    throw new Error('useStory must be used within a StoryProvider');
  }
  return context;
};