import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import PageContainer from '../../components/Layout/PageContainer/PageContainer';
import PageBanner from '../../components/Layout/PageBanner/PageBanner';
import Card from '../../components/UI/Card/Card';
import Badge from '../../components/UI/Badge/Badge';
import Avatar from '../../components/UI/Avatar/Avatar';
import Button from '../../components/UI/Button/Button';
import { mockLeaderboard } from '../../mock-data/stories';
import styles from './CommunityPage.module.css';

const CommunityPage = () => {
  const [activeTab, setActiveTab] = useState('leaderboard');

  const tabs = [
    { id: 'leaderboard', label: 'Leaderboard', icon: '🏆' },
    { id: 'statistics', label: 'Statistics', icon: '📊' },
    { id: 'guidelines', label: 'Guidelines', icon: '📋' },
    { id: 'help', label: 'Help', icon: '❓' }
  ];

  const platformStats = {
    totalUsers: 15247,
    totalStories: 1834,
    totalChapters: 12456,
    totalVotes: 89234,
    activeStories: 234,
    completedStories: 47,
    nftsEarned: 3421,
    averageRating: 4.6
  };

  const recentActivity = [
    { id: 1, type: 'story_created', user: 'EtherScribe', action: 'created "The Crystal Nexus"', time: '2 hours ago' },
    { id: 2, type: 'vote_cast', user: 'MysticTales', action: 'voted on chapter choice', time: '3 hours ago' },
    { id: 3, type: 'nft_earned', user: 'ChronicleKeeper', action: 'earned NFT "Data Ghost #042"', time: '5 hours ago' },
    { id: 4, type: 'collaboration', user: 'CyberNarrativa', action: 'joined as collaborator', time: '1 day ago' },
    { id: 5, type: 'story_completed', user: 'DimensionalRomance', action: 'completed "Quantum Hearts"', time: '2 days ago' }
  ];

  const guidelines = [
    {
      title: 'Story Creation Guidelines',
      rules: [
        'Stories must be original content or properly attributed',
        'Content should be appropriate for all audiences',
        'Each chapter should be at least 200 words',
        'Provide meaningful choices that impact the story',
        'Respect intellectual property rights'
      ]
    },
    {
      title: 'Community Interaction',
      rules: [
        'Be respectful and constructive in all interactions',
        'Vote thoughtfully on story directions',
        'Provide helpful feedback to other creators',
        'Report inappropriate content or behavior',
        'Collaborate openly and share credit fairly'
      ]
    },
    {
      title: 'Voting Guidelines',
      rules: [
        'Read the full chapter before voting',
        'Consider story consistency and quality',
        'Vote for choices that enhance the narrative',
        'Avoid voting based on personal preferences alone',
        'Respect the democratic process of story development'
      ]
    }
  ];

  const faqItems = [
    {
      question: 'How do I create my first story?',
      answer: 'Click the "Create Story" button in the navigation menu. You\'ll be guided through a step-by-step process to set up your story, write the first chapter, and define initial choices for readers.'
    },
    {
      question: 'How does the voting system work?',
      answer: 'Readers vote on choices at the end of each chapter. The choice with the most votes determines the direction of the next chapter. Voting periods typically last 7 days.'
    },
    {
      question: 'What are NFT rewards and how do I earn them?',
      answer: 'NFTs are unique digital collectibles earned by participating in stories. You can earn them by creating stories, voting on chapters, collaborating with other writers, or achieving certain milestones.'
    },
    {
      question: 'Can I collaborate with other writers?',
      answer: 'Yes! When creating a story, you can invite other writers as collaborators. Collaborators can help write chapters and make decisions about the story\'s direction.'
    },
    {
      question: 'How is my reputation score calculated?',
      answer: 'Your reputation is based on various factors including stories created, votes received on your content, community participation, and the quality of your contributions as rated by other users.'
    }
  ];

  const getActivityIcon = (type) => {
    switch (type) {
      case 'story_created': return (
        <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
          <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
        </svg>
      );
      case 'vote_cast': return (
        <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
          <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      );
      case 'nft_earned': return (
        <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
          <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
        </svg>
      );
      case 'collaboration': return (
        <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
          <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
        </svg>
      );
      case 'story_completed': return (
        <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
      );
      default: return (
        <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
      );
    }
  };

  return (
    <PageContainer>
      <PageBanner
        title="Community Hub"
        subtitle="Join a vibrant ecosystem of storytellers, creators, and readers building the future of interactive fiction together"
        backgroundImage="https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=1200&h=400&dpr=1"
        size="medium"
      />
      
      <div className={styles.container}>

        {/* Platform Overview */}
        <div className={styles.platformOverview}>
          <div className={styles.statsGrid}>
            <Card>
              <Card.Body className="text-center">
                <div className={styles.statValue}>{platformStats.totalUsers.toLocaleString()}</div>
                <div className={styles.statLabel}>Community Members</div>
              </Card.Body>
            </Card>
            <Card>
              <Card.Body className="text-center">
                <div className={styles.statValue}>{platformStats.totalStories.toLocaleString()}</div>
                <div className={styles.statLabel}>Stories Created</div>
              </Card.Body>
            </Card>
            <Card>
              <Card.Body className="text-center">
                <div className={styles.statValue}>{platformStats.totalVotes.toLocaleString()}</div>
                <div className={styles.statLabel}>Votes Cast</div>
              </Card.Body>
            </Card>
            <Card>
              <Card.Body className="text-center">
                <div className={styles.statValue}>{platformStats.nftsEarned.toLocaleString()}</div>
                <div className={styles.statLabel}>NFTs Earned</div>
              </Card.Body>
            </Card>
          </div>
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
          {activeTab === 'leaderboard' && (
            <div className={styles.leaderboardTab}>
              <div className={styles.leaderboardGrid}>
                <Card>
                  <Card.Header>
                    <h3>Top Storytellers</h3>
                  </Card.Header>
                  <Card.Body>
                    <div className={styles.leaderboardList}>
                      {mockLeaderboard.slice(0, 10).map((member, index) => (
                        <div key={member.user.id} className={styles.leaderboardItem}>
                          <div className={styles.rank}>#{member.rank}</div>
                          <Avatar
                            src={member.user.avatar}
                            alt={member.user.username}
                            size="medium"
                          />
                          <div className={styles.memberInfo}>
                            <div className={styles.memberName}>{member.user.username}</div>
                            <div className={styles.memberStats}>
                              {member.points} points • {member.storiesCreated} stories
                            </div>
                          </div>
                          <Badge variant="primary" size="small">
                            {member.badge}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </Card.Body>
                </Card>

                <Card>
                  <Card.Header>
                    <h3>Recent Activity</h3>
                  </Card.Header>
                  <Card.Body>
                    <div className={styles.activityList}>
                      {recentActivity.map((activity) => (
                        <div key={activity.id} className={styles.activityItem}>
                          <div className={styles.activityIcon}>
                            {getActivityIcon(activity.type)}
                          </div>
                          <div className={styles.activityContent}>
                            <div className={styles.activityText}>
                              <strong>{activity.user}</strong> {activity.action}
                            </div>
                            <div className={styles.activityTime}>{activity.time}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card.Body>
                </Card>
              </div>
            </div>
          )}

          {activeTab === 'statistics' && (
            <div className={styles.statisticsTab}>
              <div className={styles.statisticsGrid}>
                <Card>
                  <Card.Header>
                    <h3>Platform Statistics</h3>
                  </Card.Header>
                  <Card.Body>
                    <div className={styles.statsList}>
                      <div className={styles.statsItem}>
                        <span className={styles.statsLabel}>Total Stories</span>
                        <span className={styles.statsValue}>{platformStats.totalStories}</span>
                      </div>
                      <div className={styles.statsItem}>
                        <span className={styles.statsLabel}>Active Stories</span>
                        <span className={styles.statsValue}>{platformStats.activeStories}</span>
                      </div>
                      <div className={styles.statsItem}>
                        <span className={styles.statsLabel}>Completed Stories</span>
                        <span className={styles.statsValue}>{platformStats.completedStories}</span>
                      </div>
                      <div className={styles.statsItem}>
                        <span className={styles.statsLabel}>Total Chapters</span>
                        <span className={styles.statsValue}>{platformStats.totalChapters.toLocaleString()}</span>
                      </div>
                      <div className={styles.statsItem}>
                        <span className={styles.statsLabel}>Average Rating</span>
                        <span className={styles.statsValue}>{platformStats.averageRating}/5.0</span>
                      </div>
                    </div>
                  </Card.Body>
                </Card>

                <Card>
                  <Card.Header>
                    <h3>Engagement Metrics</h3>
                  </Card.Header>
                  <Card.Body>
                    <div className={styles.metricsChart}>
                      <div className={styles.metric}>
                        <div className={styles.metricLabel}>Daily Active Users</div>
                        <div className={styles.metricValue}>2,847</div>
                        <div className={styles.metricChange}>+12% from last week</div>
                      </div>
                      <div className={styles.metric}>
                        <div className={styles.metricLabel}>Stories Created This Month</div>
                        <div className={styles.metricValue}>156</div>
                        <div className={styles.metricChange}>+8% from last month</div>
                      </div>
                      <div className={styles.metric}>
                        <div className={styles.metricLabel}>Votes Cast Today</div>
                        <div className={styles.metricValue}>1,234</div>
                        <div className={styles.metricChange}>+15% from yesterday</div>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </div>
            </div>
          )}

          {activeTab === 'guidelines' && (
            <div className={styles.guidelinesTab}>
              <div className={styles.guidelinesGrid}>
                {guidelines.map((section, index) => (
                  <Card key={index}>
                    <Card.Header>
                      <h3>{section.title}</h3>
                    </Card.Header>
                    <Card.Body>
                      <ul className={styles.rulesList}>
                        {section.rules.map((rule, ruleIndex) => (
                          <li key={ruleIndex} className={styles.rule}>
                            <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            {rule}
                          </li>
                        ))}
                      </ul>
                    </Card.Body>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'help' && (
            <div className={styles.helpTab}>
              <div className={styles.helpContent}>
                <Card>
                  <Card.Header>
                    <h3>Frequently Asked Questions</h3>
                  </Card.Header>
                  <Card.Body>
                    <div className={styles.faqList}>
                      {faqItems.map((item, index) => (
                        <details key={index} className={styles.faqItem}>
                          <summary className={styles.faqQuestion}>{item.question}</summary>
                          <div className={styles.faqAnswer}>{item.answer}</div>
                        </details>
                      ))}
                    </div>
                  </Card.Body>
                </Card>

                <Card>
                  <Card.Header>
                    <h3>Need More Help?</h3>
                  </Card.Header>
                  <Card.Body>
                    <div className={styles.helpActions}>
                      <p>Can't find what you're looking for? We're here to help!</p>
                      <div className={styles.helpButtons}>
                        <Button variant="primary">
                          <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                            <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                          </svg>
                          Contact Support
                        </Button>
                        <Button variant="secondary">
                          <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                          </svg>
                          Join Discord
                        </Button>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </div>
            </div>
          )}
        </div>
      </div>
    </PageContainer>
  );
};

export default CommunityPage;