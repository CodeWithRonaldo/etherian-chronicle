import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { StoryProvider } from './contexts/StoryContext';
import { NotificationProvider } from './contexts/NotificationContext';
import HomePage from './pages/HomePage/HomePage';
import StoriesPage from './pages/StoriesPage/StoriesPage';
import StoryDetailPage from './pages/StoryDetailPage/StoryDetailPage';
import ProposalsPage from './pages/ProposalsPage/ProposalsPage';
import ProposalDetailPage from './pages/ProposalDetailPage/ProposalDetailPage';
import CreateStoryPage from './pages/CreateStoryPage/CreateStoryPage';
import ProfilePage from './pages/ProfilePage/ProfilePage';
import CommunityPage from './pages/CommunityPage/CommunityPage';
import NFTCollectionPage from './pages/NFTCollectionPage/NFTCollectionPage';
import './styles/globals.css';

const App = () => {
  return (
    <ThemeProvider>
      <NotificationProvider>
        <AuthProvider>
          <StoryProvider>
            <Router>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/stories" element={<StoriesPage />} />
                <Route path="/stories/:id" element={<StoryDetailPage />} />
                <Route path="/proposals" element={<ProposalsPage />} />
                <Route path="/proposals/:id" element={<ProposalDetailPage />} />
                <Route path="/create" element={<CreateStoryPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/profile/nfts" element={<NFTCollectionPage />} />
                <Route path="/community" element={<CommunityPage />} />
                <Route path="*" element={<div>404 - Page Not Found</div>} />
              </Routes>
            </Router>
          </StoryProvider>
        </AuthProvider>
      </NotificationProvider>
    </ThemeProvider>
  );
};

export default App;