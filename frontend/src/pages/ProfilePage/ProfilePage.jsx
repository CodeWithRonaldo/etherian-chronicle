import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import PageContainer from '../../components/Layout/PageContainer/PageContainer';
import PageBanner from '../../components/Layout/PageBanner/PageBanner';
import Button from '../../components/UI/Button/Button';
import Badge from '../../components/UI/Badge/Badge';
import Avatar from '../../components/UI/Avatar/Avatar';
import Card from '../../components/UI/Card/Card';
import Modal from '../../components/UI/Modal/Modal';
import Input from '../../components/UI/Input/Input';
import TextArea from '../../components/UI/TextArea/TextArea';
import ProgressBar from '../../components/UI/ProgressBar/ProgressBar';
import { useAuth } from '../../contexts/AuthContext';
import { useStory } from '../../contexts/StoryContext';
import { useNotification } from '../../contexts/NotificationContext';
import { mockNFTs } from '../../mock-data/stories';
import styles from './ProfilePage.module.css';

const ProfilePage = () => {
  const { user, updateProfile } = useAuth();
  const { stories } = useStory();
  const { showSuccess } = useNotification();
  const [activeTab, setActiveTab] = useState('overview');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    username: user?.username || '',
    bio: user?.bio || '',
    avatar: user?.avatar || ''
  });

  if (!user) {
    return (
      <PageContainer>
        <div className={styles.errorState}>
          <h1>Please log in to view your profile</h1>
          <Button as={Link} to="/">Go Home</Button>
        </div>
      </PageContainer>
    );
  }

  const userStories = stories.filter(story => story.creator.id === user.id);
  const collaboratedStories = stories.filter(story => 
    story.collaborators?.some(collab => collab.id === user.id)
  );

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '👤' },
    { id: 'stories', label: 'My Stories', icon: '📚' },
    { id: 'collaborations', label: 'Collaborations', icon: '🤝' },
    { id: 'nfts', label: 'NFT Collection', icon: '🎨' },
    { id: 'achievements', label: 'Achievements', icon: '🏆' }
  ];

  const handleEditSubmit = (e) => {
    e.preventDefault();
    updateProfile(editForm);
    setIsEditModalOpen(false);
    showSuccess('Profile updated successfully!');
  };

  const achievements = [
    { id: 1, name: 'First Story', description: 'Created your first story', earned: true, icon: '📝' },
    { id: 2, name: 'Prolific Writer', description: 'Created 5 stories', earned: userStories.length >= 5, icon: 'pen' },
    { id: 3, name: 'Community Champion', description: 'Cast 100 votes', earned: user.totalVotes >= 100, icon: 'vote' },
    { id: 4, name: 'Collaborator', description: 'Collaborated on 3 stories', earned: collaboratedStories.length >= 3, icon: 'team' },
    { id: 5, name: 'NFT Collector', description: 'Earned 10 NFTs', earned: user.nftsEarned >= 10, icon: 'collection' }
  ];

  return (
    <PageContainer>
      <PageBanner
        title={`${user.username}'s Profile`}
        subtitle="Your storytelling journey and achievements"
        backgroundImage="https://images.pexels.com/photos/1624496/pexels-photo-1624496.jpeg?auto=compress&cs=tinysrgb&w=1200&h=400&dpr=1"
        size="medium"
      />
      
      <div className={styles.container}>
        {/* Profile Header */}
        <header className={styles.header}>
          <div className={styles.profileInfo}>
            <Avatar
              src={user.avatar}
              alt={user.username}
              size="xxlarge"
              className={styles.avatar}
            />
            <div className={styles.userDetails}>
              <h1 className={styles.username}>{user.username}</h1>
              <p className={styles.bio}>{user.bio}</p>
              <div className={styles.joinDate}>
                Member since {new Date(user.joinDate).toLocaleDateString()}
              </div>
              <div className={styles.badges}>
                {user.badges?.map((badge) => (
                  <Badge key={badge} variant="primary">
                    {badge}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
          <div className={styles.actions}>
            <Button onClick={() => setIsEditModalOpen(true)}>
              <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
              </svg>
              Edit Profile
            </Button>
          </div>
        </header>

        {/* Stats Overview */}
        <div className={styles.statsGrid}>
          <Card>
            <Card.Body className="text-center">
              <div className={styles.statValue}>{user.reputation}</div>
              <div className={styles.statLabel}>Reputation Points</div>
            </Card.Body>
          </Card>
          <Card>
            <Card.Body className="text-center">
              <div className={styles.statValue}>{userStories.length}</div>
              <div className={styles.statLabel}>Stories Created</div>
            </Card.Body>
          </Card>
          <Card>
            <Card.Body className="text-center">
              <div className={styles.statValue}>{user.totalVotes}</div>
              <div className={styles.statLabel}>Votes Cast</div>
            </Card.Body>
          </Card>
          <Card>
            <Card.Body className="text-center">
              <div className={styles.statValue}>{user.nftsEarned}</div>
              <div className={styles.statLabel}>NFTs Earned</div>
            </Card.Body>
          </Card>
        </div>

        {/* Navigation Tabs */}
        <nav className={styles.tabs}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`${styles.tab} ${activeTab === tab.id ? styles.active : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span className={styles.tabIcon}>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </nav>

        {/* Tab Content */}
        <div className={styles.tabContent}>
          {activeTab === 'overview' && (
            <div className={styles.overview}>
              <div className={styles.overviewGrid}>
                <Card>
                  <Card.Header>
                    <h3>Recent Activity</h3>
                  </Card.Header>
                  <Card.Body>
                    <div className={styles.activityList}>
                      <div className={styles.activityItem}>
                        <div className={styles.activityIcon}>📝</div>
                        <div>
                          <div>Created "The Crystal Nexus"</div>
                          <div className={styles.activityTime}>2 days ago</div>
                        </div>
                      </div>
                      <div className={styles.activityItem}>
                        <div className={styles.activityIcon}>🗳️</div>
                        <div>
                          <div>Voted on chapter choice</div>
                          <div className={styles.activityTime}>3 days ago</div>
                        </div>
                      </div>
                      <div className={styles.activityItem}>
                        <div className={styles.activityIcon}>🎨</div>
                        <div>
                          <div>Earned NFT "Crystal Fragment #001"</div>
                          <div className={styles.activityTime}>1 week ago</div>
                        </div>
                      </div>
                    </div>
                  </Card.Body>
                </Card>

                <Card>
                  <Card.Header>
                    <h3>Progress Overview</h3>
                  </Card.Header>
                  <Card.Body>
                    <div className={styles.progressSection}>
                      <div className={styles.progressItem}>
                        <span>Stories Created</span>
                        <ProgressBar
                          value={userStories.length}
                          max={10}
                          label={`${userStories.length}/10`}
                          showPercentage={false}
                        />
                      </div>
                      <div className={styles.progressItem}>
                        <span>Votes Cast</span>
                        <ProgressBar
                          value={user.totalVotes}
                          max={500}
                          label={`${user.totalVotes}/500`}
                          showPercentage={false}
                          variant="secondary"
                        />
                      </div>
                      <div className={styles.progressItem}>
                        <span>NFTs Collected</span>
                        <ProgressBar
                          value={user.nftsEarned}
                          max={50}
                          label={`${user.nftsEarned}/50`}
                          showPercentage={false}
                          variant="success"
                        />
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </div>
            </div>
          )}

          {activeTab === 'stories' && (
            <div className={styles.storiesTab}>
              {userStories.length > 0 ? (
                <div className={styles.storiesGrid}>
                  {userStories.map((story) => (
                    <Card key={story.id} interactive>
                      <Card.Image src={story.coverImage} alt={story.title} />
                      <Card.Body>
                        <h3 className={styles.storyTitle}>{story.title}</h3>
                        <p className={styles.storySummary}>{story.summary}</p>
                        <div className={styles.storyStats}>
                          <span>{story.stats.totalReaders} readers</span>
                          <span>{story.stats.totalVotes} votes</span>
                          <Badge variant="success">{story.status}</Badge>
                        </div>
                      </Card.Body>
                      <Card.Footer>
                        <Button as={Link} to={`/stories/${story.id}`} variant="ghost" size="small" fullWidth>
                          View Story
                        </Button>
                      </Card.Footer>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className={styles.emptyState}>
                  <h3>No stories created yet</h3>
                  <p>Start your storytelling journey by creating your first story.</p>
                  <Button as={Link} to="/create">Create Your First Story</Button>
                </div>
              )}
            </div>
          )}

          {activeTab === 'collaborations' && (
            <div className={styles.collaborationsTab}>
              {collaboratedStories.length > 0 ? (
                <div className={styles.storiesGrid}>
                  {collaboratedStories.map((story) => (
                    <Card key={story.id} interactive>
                      <Card.Image src={story.coverImage} alt={story.title} />
                      <Card.Body>
                        <h3 className={styles.storyTitle}>{story.title}</h3>
                        <div className={styles.storyCreator}>
                          by {story.creator.username}
                        </div>
                        <p className={styles.storySummary}>{story.summary}</p>
                        <div className={styles.storyStats}>
                          <span>{story.stats.totalReaders} readers</span>
                          <Badge variant="secondary">Collaborator</Badge>
                        </div>
                      </Card.Body>
                      <Card.Footer>
                        <Button as={Link} to={`/stories/${story.id}`} variant="ghost" size="small" fullWidth>
                          View Story
                        </Button>
                      </Card.Footer>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className={styles.emptyState}>
                  <h3>No collaborations yet</h3>
                  <p>Join other writers to collaborate on amazing stories.</p>
                  <Button as={Link} to="/stories">Browse Stories</Button>
                </div>
              )}
            </div>
          )}

          {activeTab === 'nfts' && (
            <div className={styles.nftsTab}>
              {mockNFTs.length > 0 ? (
                <div className={styles.nftsGrid}>
                  {mockNFTs.map((nft) => (
                    <Card key={nft.id} className={styles.nftCard}>
                      <Card.Image src={nft.image} alt={nft.name} />
                      <Card.Body>
                        <h3 className={styles.nftName}>{nft.name}</h3>
                        <p className={styles.nftDescription}>{nft.description}</p>
                        <Badge variant="primary">{nft.rarity}</Badge>
                        <div className={styles.nftDate}>
                          Earned {new Date(nft.dateEarned).toLocaleDateString()}
                        </div>
                      </Card.Body>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className={styles.emptyState}>
                  <h3>No NFTs collected yet</h3>
                  <p>Participate in stories to earn unique NFT rewards.</p>
                  <Button as={Link} to="/stories">Start Reading</Button>
                </div>
              )}
            </div>
          )}

          {activeTab === 'achievements' && (
            <div className={styles.achievementsTab}>
              <div className={styles.achievementsGrid}>
                {achievements.map((achievement) => (
                  <Card key={achievement.id} className={`${styles.achievementCard} ${achievement.earned ? styles.earned : styles.locked}`}>
                    <Card.Body>
                      <div className={styles.achievementIcon}>
                        {achievement.icon === 'pen' && (
                          <svg width="32" height="32" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                          </svg>
                        )}
                        {achievement.icon === 'vote' && (
                          <svg width="32" height="32" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        )}
                        {achievement.icon === 'team' && (
                          <svg width="32" height="32" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                          </svg>
                        )}
                        {achievement.icon === 'collection' && (
                          <svg width="32" height="32" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                          </svg>
                        )}
                        {achievement.icon === '📝' && (
                          <svg width="32" height="32" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                          </svg>
                        )}
                      </div>
                      <h3 className={styles.achievementName}>{achievement.name}</h3>
                      <p className={styles.achievementDescription}>{achievement.description}</p>
                      {achievement.earned ? (
                        <Badge variant="success">Earned</Badge>
                      ) : (
                        <Badge variant="neutral">Locked</Badge>
                      )}
                    </Card.Body>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Edit Profile Modal */}
        <Modal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          title="Edit Profile"
        >
          <form onSubmit={handleEditSubmit}>
            <Modal.Body>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                <Input
                  label="Username"
                  value={editForm.username}
                  onChange={(e) => setEditForm(prev => ({ ...prev, username: e.target.value }))}
                  required
                />
                <TextArea
                  label="Bio"
                  value={editForm.bio}
                  onChange={(e) => setEditForm(prev => ({ ...prev, bio: e.target.value }))}
                  rows={4}
                  placeholder="Tell us about yourself..."
                />
                <Input
                  label="Avatar URL"
                  value={editForm.avatar}
                  onChange={(e) => setEditForm(prev => ({ ...prev, avatar: e.target.value }))}
                  placeholder="https://example.com/avatar.jpg"
                />
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button type="button" variant="secondary" onClick={() => setIsEditModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary">
                Save Changes
              </Button>
            </Modal.Footer>
          </form>
        </Modal>
      </div>
    </PageContainer>
  );
};

export default ProfilePage;