import React, { useContext } from "react";
import { Link } from "react-router-dom";
import PageContainer from "../../components/Layout/PageContainer/PageContainer";
import StorySlideshow from "../../components/Features/Story/StorySlideshow/StorySlideshow";
import ProposalCarousel from "../../components/Features/Proposal/ProposalCarousel/ProposalCarousel";
import StoryCard from "../../components/Features/Story/StoryCard/StoryCard";
import Button from "../../components/UI/Button/Button";
import Card from "../../components/UI/Card/Card";
import Badge from "../../components/UI/Badge/Badge";
import LoadingSpinner from "../../components/UI/LoadingSpinner/LoadingSpinner";
import { useStory } from "../../contexts/StoryContext";
import { mockLeaderboard } from "../../mock-data/stories";
import Avatar from "../../components/UI/Avatar/Avatar";
import { userData } from "../../contexts/storyData";

const HomePage = () => {
  const { stories, proposals, loading } = useStory();
  const { allStories, isLoading } = useContext(userData);

  const featuredStories = stories.slice(0, 5);
  const recentProposals = proposals.slice(0, 6);
  const topCommunityMembers = mockLeaderboard.slice(0, 5);

  if (loading) {
    return <PageContainer loading={true} />;
  }

  return (
    <PageContainer>
      {/* Featured Stories Slideshow */}
      <StorySlideshow stories={featuredStories} />

      {/* Featured Stories */}
      <PageContainer.Section
        title="Popular Stories"
        description="Discover the most captivating stories being crafted by our community"
      >
        <PageContainer.Grid columns={3}>
          {stories.slice(0, 3).map((story) => (
            <StoryCard key={story.id} story={story} />
          ))}
        </PageContainer.Grid>
        <div style={{ textAlign: "center", marginTop: "var(--space-8)" }}>
          <Button as={Link} to="/stories" variant="secondary">
            View All Stories
          </Button>
        </div>
      </PageContainer.Section>

      {/* Recent Proposals Carousel */}
      <ProposalCarousel
        proposals={recentProposals}
        title="Vote on Story Proposals"
      />

      {/* Community Leaderboard */}
      <PageContainer.Section
        title="Community Leaders"
        description="Top contributors to the EtherianChronicle community"
      >
        <PageContainer.Grid columns={1}>
          <Card>
            <Card.Header>
              <h3
                style={{
                  fontSize: "var(--font-size-xl)",
                  fontWeight: "var(--font-weight-semibold)",
                  textAlign: "center",
                }}
              >
                Top Storytellers
              </h3>
            </Card.Header>
            <Card.Body>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                  gap: "var(--space-6)",
                }}
              >
                {topCommunityMembers.map((member, index) => (
                  <div
                    key={member.user.id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "var(--space-3)",
                      padding: "var(--space-4)",
                      backgroundColor:
                        index === 0
                          ? "var(--primary-50)"
                          : index === 1
                          ? "var(--secondary-50)"
                          : index === 2
                          ? "var(--accent-50)"
                          : "var(--bg-tertiary)",
                      borderRadius: "var(--radius-lg)",
                      border:
                        index < 3
                          ? "2px solid var(--primary-200)"
                          : "1px solid var(--border-primary)",
                      position: "relative",
                    }}
                  >
                    {index < 3 && (
                      <div
                        style={{
                          position: "absolute",
                          top: "-8px",
                          left: "-8px",
                          width: "32px",
                          height: "32px",
                          backgroundColor:
                            index === 0
                              ? "var(--warning-500)"
                              : index === 1
                              ? "var(--gray-400)"
                              : "var(--accent-600)",
                          borderRadius: "50%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "white",
                          fontSize: "var(--font-size-sm)",
                          fontWeight: "var(--font-weight-bold)",
                        }}
                      >
                        {index === 0 ? "🥇" : index === 1 ? "🥈" : "🥉"}
                      </div>
                    )}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: "24px",
                        height: "24px",
                        backgroundColor: "var(--primary-500)",
                        color: "white",
                        borderRadius: "50%",
                        fontSize: "var(--font-size-sm)",
                        fontWeight: "var(--font-weight-semibold)",
                      }}
                    >
                      {index + 1}
                    </div>
                    <Avatar
                      src={member.user.avatar}
                      alt={member.user.username}
                      size="medium"
                    />
                    <div style={{ flex: 1 }}>
                      <div
                        style={{
                          fontWeight: "var(--font-weight-medium)",
                          color: "var(--text-primary)",
                        }}
                      >
                        {member.user.username}
                      </div>
                      <div
                        style={{
                          fontSize: "var(--font-size-sm)",
                          color: "var(--text-tertiary)",
                        }}
                      >
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
            <Card.Footer>
              <Button
                as={Link}
                to="/community"
                variant="ghost"
                size="small"
                fullWidth
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  style={{ marginRight: "var(--space-2)" }}
                >
                  <path
                    fillRule="evenodd"
                    d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                    clipRule="evenodd"
                  />
                </svg>
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  style={{ marginRight: "var(--space-2)" }}
                >
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                View Full Leaderboard
              </Button>
            </Card.Footer>
          </Card>
        </PageContainer.Grid>
      </PageContainer.Section>

      {/* Call to Action */}
      <PageContainer.Section>
        <Card variant="filled">
          <Card.Body>
            <div
              style={{
                textAlign: "center",
                padding: "var(--space-8) var(--space-4)",
              }}
            >
              <h2
                style={{
                  fontSize: "var(--font-size-2xl)",
                  fontWeight: "var(--font-weight-bold)",
                  marginBottom: "var(--space-4)",
                }}
              >
                Ready to Begin Your Storytelling Journey?
              </h2>
              <p
                style={{
                  fontSize: "var(--font-size-lg)",
                  color: "var(--text-secondary)",
                  marginBottom: "var(--space-6)",
                  maxWidth: "600px",
                  margin: "0 auto var(--space-6)",
                }}
              >
                Join thousands of storytellers creating the future of
                interactive fiction. Your choices matter, your voice counts, and
                your creativity earns rewards.
              </p>
              <div
                style={{
                  display: "flex",
                  gap: "var(--space-4)",
                  justifyContent: "center",
                  flexWrap: "wrap",
                }}
              >
                <Button as={Link} to="/create" size="large">
                  Create Your First Story
                </Button>
                <Button
                  as={Link}
                  to="/proposals"
                  variant="secondary"
                  size="large"
                >
                  Browse Proposals
                </Button>
              </div>
            </div>
          </Card.Body>
        </Card>
      </PageContainer.Section>
    </PageContainer>
  );
};

export default HomePage;
