import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import PageContainer from '../../components/Layout/PageContainer/PageContainer';
import VotingInterface from '../../components/Features/Story/VotingInterface/VotingInterface';
import Button from '../../components/UI/Button/Button';
import Badge from '../../components/UI/Badge/Badge';
import Avatar from '../../components/UI/Avatar/Avatar';
import { useStory } from '../../contexts/StoryContext';
import { useNotification } from '../../contexts/NotificationContext';
import styles from './StoryDetailPage.module.css';

const StoryDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { stories, chapters, userVotes, voteOnChapter } = useStory();
  const { showSuccess, showError } = useNotification();
  const [currentChapterIndex, setCurrentChapterIndex] = useState(0);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const shareMenuRef = useRef(null);

  const story = stories.find(s => s.id === id);
  const storyChapters = chapters[id] || [];
  const currentChapter = storyChapters[currentChapterIndex];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (shareMenuRef.current && !shareMenuRef.current.contains(event.target)) {
        setShowShareMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [shareMenuRef]);

  if (!story) {
    return (
      <PageContainer>
        <div className={styles.errorState}>
          <h1 className={styles.errorTitle}>Story Not Found</h1>
          <p className={styles.errorMessage}>
            The story you're looking for doesn't exist or has been removed.
          </p>
          <Button onClick={() => navigate('/stories')}>
            Browse All Stories
          </Button>
        </div>
      </PageContainer>
    );
  }

  const handleVote = async (choiceId) => {
    try {
      await voteOnChapter(story.id, currentChapter.id, choiceId);
      showSuccess('Your vote has been recorded!');
    } catch (error) {
      showError('Failed to record your vote. Please try again.');
    }
  };

  const handleShare = (platform) => {
    const url = window.location.href;
    const text = `Check out "${story.title}" on EtherianChronicle!`;
    
    switch (platform) {
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`);
        break;
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`);
        break;
      case 'copy':
        navigator.clipboard.writeText(url);
        showSuccess('Link copied to clipboard!');
        break;
      default:
        break;
    }
    setShowShareMenu(false);
  };

  const getStatusVariant = (status) => {
    switch (status) {
      case 'active': return 'success';
      case 'completed': return 'primary';
      case 'pending': return 'warning';
      default: return 'neutral';
    }
  };

  const getGenreColor = (genre) => {
    const genreColors = {
      fantasy: 'primary',
      'sci-fi': 'secondary',
      mystery: 'accent',
      romance: 'error',
      horror: 'neutral',
      drama: 'warning',
      steampunk: 'secondary',
    };
    return genreColors[genre] || 'neutral';
  };

  const userVoteForChapter = userVotes[`chapter-${currentChapter?.id}`];

  return (
    <PageContainer>
      <div className={styles.container}>
        {/* Breadcrumb */}
        <nav className={styles.breadcrumb} aria-label="Breadcrumb">
          <Link to="/" className={styles.breadcrumbLink}>Home</Link>
          <span className={styles.breadcrumbSeparator}>/</span>
          <Link to="/stories" className={styles.breadcrumbLink}>Stories</Link>
          <span className={styles.breadcrumbSeparator}>/</span>
          <span>{story.title}</span>
        </nav>

        {/* Header */}
        <header className={styles.header}>
          <img
            src={story.coverImage}
            alt={`Cover for ${story.title}`}
            className={styles.coverImage}
          />

          <div className={styles.titleSection}>
            <div className={styles.titleContent}>
              <h1 className={styles.title}>{story.title}</h1>
              
              <div className={styles.creator}>
                <Avatar
                  src={story.creator.avatar}
                  alt={story.creator.username}
                  size="large"
                />
                <div className={styles.creatorInfo}>
                  <Link to={`/profile/${story.creator.id}`} className={styles.creatorName}>
                    {story.creator.username}
                  </Link>
                  <div className={styles.creatorMeta}>
                    Created {new Date(story.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>

              <div className={styles.badges}>
                <Badge variant={getGenreColor(story.genre)}>
                  {story.genre}
                </Badge>
                <Badge variant={getStatusVariant(story.status)}>
                  {story.status}
                </Badge>
                {story.tags?.slice(0, 3).map((tag) => (
                  <Badge key={tag} variant="neutral" size="small">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>

            <div className={styles.actions}>
              <Button variant="primary" size="large">
                <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                  <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                </svg>
                Start Reading
              </Button>
              
              <Button variant="secondary">
                <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                Favorite
              </Button>
              
              <div className={styles.shareButton} ref={shareMenuRef}>
                <Button
                  variant="ghost"
                  onClick={() => setShowShareMenu(!showShareMenu)}
                >
                  <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
                  </svg>
                  Share
                </Button>
                
                {showShareMenu && (
                  <div className={styles.shareMenu}>
                    <button
                      className={styles.shareOption}
                      onClick={() => handleShare('twitter')}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                      </svg>
                      Share on Twitter
                    </button>
                    <button
                      className={styles.shareOption}
                      onClick={() => handleShare('facebook')}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                      </svg>
                      Share on Facebook
                    </button>
                    <button
                      className={styles.shareOption}
                      onClick={() => handleShare('copy')}
                    >
                      <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                        <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
                      </svg>
                      Copy Link
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          <p className={styles.summary}>{story.summary}</p>
        </header>

        {/* Content */}
        <div className={styles.content}>
          <main className={styles.main}>
            {/* Chapter Navigation */}
            {storyChapters.length > 0 && (
              <div className={styles.chapterNavigation}>
                <div className={styles.chapterInfo}>
                  <h2 className={styles.chapterTitle}>
                    {currentChapter?.title || `Chapter ${currentChapterIndex + 1}`}
                  </h2>
                </div>
                <div className={styles.navButtons}>
                  <Button
                    variant="ghost"
                    size="small"
                    onClick={() => setCurrentChapterIndex(prev => Math.max(prev - 1, 0))}
                    disabled={currentChapterIndex === 0}
                  >
                    <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Previous
                  </Button>
                  <Button
                    variant="ghost"
                    size="small"
                    onClick={() => setCurrentChapterIndex(prev => Math.min(prev + 1, storyChapters.length - 1))}
                    disabled={currentChapterIndex === storyChapters.length - 1}
                  >
                    Next
                    <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  </Button>
                </div>
              </div>
            )}

            {/* Chapter Content */}
            <div className={styles.chapterContent}>
              <div className={styles.chapterText}>
                {currentChapter?.content || 'Chapter content will be available soon. Check back later for updates!'}
              </div>
            </div>

            {/* Voting Interface */}
            {currentChapter?.choices && currentChapter.choices.length > 0 && (
              <VotingInterface
                title="What happens next?"
                subtitle="Vote for the direction you want this story to take."
                choices={currentChapter.choices}
                deadline={currentChapter.votingDeadline}
                onVote={handleVote}
                userVote={userVoteForChapter}
                showResults={currentChapter.status === 'completed'}
                winningChoiceId={currentChapter.winningChoice}
              />
            )}
          </main>


          {/* Sidebar */}
          <aside className={styles.sidebar}>

            {/* Collaborators */}
            {story.collaborators && story.collaborators.length > 0 && (
              <div className={styles.section}>
                <h3 className={styles.sectionTitle}>
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                  </svg>
                  Collaborators
                </h3>
                <div className={styles.collaborators}>
                  <div className={styles.collaboratorsList}>
                    {story.collaborators.map((collaborator) => (
                      <div key={collaborator.id} className={styles.collaborator}>
                        <Avatar
                          src={collaborator.avatar}
                          alt={collaborator.username}
                          size="medium"
                        />
                        <div className={styles.collaboratorInfo}>
                          <div className={styles.collaboratorName}>
                            {collaborator.username}
                          </div>
                          <div className={styles.collaboratorRole}>
                            Co-author
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Tags */}
            {story.tags && story.tags.length > 0 && (
              <div className={styles.section}>
                <h3 className={styles.sectionTitle}>
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a3 3 0 013-3h5c.256 0 .512.098.707.293l7 7zM5 6a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                  </svg>
                  Tags
                </h3>
                <div className={styles.tags}>
                  <div className={styles.tagsList}>
                    {story.tags.map((tag) => (
                      <Badge key={tag} variant="neutral">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </aside>
        </div>
      </div>
    </PageContainer>
  );
};

export default StoryDetailPage;