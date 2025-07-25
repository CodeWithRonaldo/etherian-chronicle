import React, { useState, useEffect, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import PageContainer from "../../components/Layout/PageContainer/PageContainer";
import VotingInterface from "../../components/Features/Story/VotingInterface/VotingInterface";
import Button from "../../components/UI/Button/Button";
import Badge from "../../components/UI/Badge/Badge";
import Avatar from "../../components/UI/Avatar/Avatar";
import LoadingSpinner from "../../components/UI/LoadingSpinner/LoadingSpinner";
import { useStory } from "../../contexts/StoryContext";
import { useNotification } from "../../contexts/NotificationContext";
import styles from "./ProposalDetailPage.module.css";
import { StoryData } from "../../contexts/storyData";
import { Blobbie } from "thirdweb/react";
import { formatAddress } from "../../helper/helper";

const ProposalDetailPage = () => {
  const { id } = useParams();
  const { userVotes, voteOnProposal } = useStory();
  const { showSuccess, showError } = useNotification();
  const [timeRemaining, setTimeRemaining] = useState("");
  const [story, setStory] = useState();

  const { getStory, _isLoading } = useContext(StoryData);

  useEffect(() => {
    const getStoryDetails = async () => {
      const storyDetails = await getStory(id);
      setStory(storyDetails);
    };

    getStoryDetails();
  }, [id, getStory]);

  useEffect(() => {
    if (story?.proposalVoteEndTime) {
      const updateTimeRemaining = () => {
        const now = new Date();
        const deadlineDate = new Date(Number(story.proposalVoteEndTime));
        const diff = deadlineDate.getTime() - now.getTime();

        if (diff <= 0) {
          setTimeRemaining("Voting has ended");
          return;
        }

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor(
          (diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

        if (days > 0) {
          setTimeRemaining(`${days} days, ${hours} hours remaining`);
        } else if (hours > 0) {
          setTimeRemaining(`${hours} hours, ${minutes} minutes remaining`);
        } else {
          setTimeRemaining(`${minutes} minutes remaining`);
        }
      };

      updateTimeRemaining();
      const interval = setInterval(updateTimeRemaining, 60000);

      return () => clearInterval(interval);
    }
  }, [story?.proposalVoteEndTime]);

  if (!story) {
    return (
      <PageContainer>
        <div className={styles.errorState}>
          <h1 className={styles.errorTitle}>Proposal Not Found</h1>
          <p className={styles.errorMessage}>
            The proposal you're looking for doesn't exist or has been removed.
          </p>
          <Button as={Link} to="/proposals">
            Browse All Proposals
          </Button>
        </div>
      </PageContainer>
    );
  }

  const handleVote = async (vote) => {
    try {
      await voteOnProposal(story.storyId, vote);
      showSuccess(`Your ${vote} vote has been recorded!`);
    } catch (error) {
      showError("Failed to record your vote. Please try again.");
      console.log(error);
    }
  };

  // const getStatusVariant = (status) => {
  //   switch (status) {
  //     case "pending":
  //       return "warning";
  //     case "approved":
  //       return "success";
  //     case "rejected":
  //       return "error";
  //     default:
  //       return "neutral";
  //   }
  // };

  const getGenreColor = (genre) => {
    const genreColors = {
      fantasy: "primary",
      "sci-fi": "secondary",
      mystery: "accent",
      romance: "error",
      horror: "neutral",
      drama: "warning",
      steampunk: "secondary",
    };
    return genreColors[genre] || "neutral";
  };

  const totalVotes = story.chapters.reduce(
    (sum, chapter) => sum + Number(chapter.voteCountSum),
    0
  );
  const yesPercentage =
    totalVotes > 0
      ? Math.round((Number(story.proposalYesVotes) / totalVotes) * 100)
      : 0;
  const noPercentage =
    totalVotes > 0
      ? Math.round((Number(story.proposalNoVotes) / totalVotes) * 100)
      : 0;
  const userVote = userVotes[`proposal-${story.storyId}`];
  const isVotingClosed =
    new Date() > new Date(Number(story.proposalVoteEndTime));
  const isUrgent =
    new Date(Number(story.proposalVoteEndTime)).getTime() -
      new Date().getTime() <
    24 * 60 * 60 * 1000;

  // Determine voting outcome
  let voteOutcome = null;
  if (isVotingClosed) {
    if (Number(story.proposalYesVotes) > Number(story.proposalNoVotes)) {
      voteOutcome = "approved";
    } else if (Number(story.proposalNoVotes) > Number(story.proposalYesVotes)) {
      voteOutcome = "rejected";
    } else {
      voteOutcome = "tied";
    }
  }

  return (
    <PageContainer>
      <div className={styles.container}>
        {/* Breadcrumb */}
        <nav className={styles.breadcrumb} aria-label="Breadcrumb">
          <Link to="/" className={styles.breadcrumbLink}>
            Home
          </Link>
          <span className={styles.breadcrumbSeparator}>/</span>
          <Link to="/proposals" className={styles.breadcrumbLink}>
            Proposals
          </Link>
          <span className={styles.breadcrumbSeparator}>/</span>
          <span>{story.title}</span>
        </nav>

        {/* Header */}
        <header className={styles.header}>
          <img
            src={story.ipfsHashImage}
            alt={`Cover for ${story.title}`}
            className={styles.coverImage}
          />

          <div className={styles.titleSection}>
            <div className={styles.titleContent}>
              <h1 className={styles.title}>{story.title}</h1>

              <div className={styles.creator}>
                <Blobbie
                  address={story.writer}
                  size={35}
                  style={{ borderRadius: "50%" }}
                />
                <div className={styles.creatorInfo}>
                  <Link
                    to={`/profile/${story.writer}`}
                    className={styles.creatorName}
                  >
                    {formatAddress(story.writer)}
                  </Link>
                  {/* <div className={styles.creatorMeta}>
                    Proposed {new Date(proposal.createdAt).toLocaleDateString()}
                  </div> */}
                </div>
              </div>

              <div className={styles.badges}>
                <Badge variant={"success"}>Active</Badge>
                <Badge
                  variant={getGenreColor(
                    story.chapters[0]?.chapertDetails?.genre
                  )}
                >
                  {story.chapters[0]?.chapertDetails?.genre}
                </Badge>
                {story.chapters[0]?.chapertDetails?.tags
                  ?.slice(0, 3)
                  .map((tag) => (
                    <Badge key={tag} variant="neutral" size="small">
                      {tag}
                    </Badge>
                  ))}
              </div>
            </div>

            <div className={styles.statusSection}>
              {userVote && (
                <Badge
                  variant={userVote === "yes" ? "success" : "error"}
                  size="large"
                >
                  You voted {userVote.toUpperCase()}
                </Badge>
              )}
            </div>
          </div>

          <p className={styles.summary}>{story.summary}</p>
        </header>

        {/* Content */}
        <div className={styles.content}>
          <main className={styles.main}>
            {/* First Chapter Preview */}
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"
                    clipRule="evenodd"
                  />
                </svg>
                First Chapter Preview
              </h2>

              <div className={styles.firstChapter}>
                <h3 className={styles.chapterTitle}>
                  {story.chapters[0]?.ipfsDetails?.contentTitle}
                </h3>
                <div className={styles.chapterContent}>
                  {story.chapters[0]?.ipfsDetails?.content}
                </div>

                <div className={styles.chapterChoices}>
                  <h4
                    style={{
                      fontSize: "var(--font-size-base)",
                      fontWeight: "var(--font-weight-semibold)",
                      color: "var(--text-primary)",
                      marginBottom: "var(--space-3)",
                    }}
                  >
                    Initial Choices:
                  </h4>
                  {story.chapters[0].choices?.map((choice, index) => (
                    <div key={index} className={styles.choice}>
                      <div className={styles.choiceLabel}>
                        Option {index + 1}:
                      </div>
                      {choice.text}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Voting Interface */}
            {!isVotingClosed && (
              <VotingInterface
                title="Vote on this status"
                subtitle="Should this story be approved for the community to develop?"
                choices={[
                  {
                    id: "yes",
                    text: "Yes, approve this story proposal",
                    votes: story.proposalYesVotes,
                  },
                  {
                    id: "no",
                    text: "No, this proposal needs improvement",
                    votes: story.proposalNoVotes,
                  },
                ]}
                deadline={story.proposalVoteEndTime}
                onVote={handleVote}
                userVote={userVote}
                showResults={!!userVote}
              />
            )}

            {/* Vote Results */}
            {isVotingClosed && (
              <div className={styles.voteResults}>
                <h3 className={styles.voteResultsTitle}>
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Voting Complete
                </h3>
                <p className={styles.voteResultsText}>
                  This proposal has been{" "}
                  <span className={styles.voteResultsOutcome}>
                    {voteOutcome === "approved" && "APPROVED"}
                    {voteOutcome === "rejected" && "REJECTED"}
                    {voteOutcome === "tied" && "TIED (requires review)"}
                  </span>{" "}
                  by the community with {story.proposalYesVotes} yes votes and{" "}
                  {story.proposalNoVotes} no votes.
                  {voteOutcome === "approved" &&
                    " The story will now be available for collaborative development."}
                  {voteOutcome === "rejected" &&
                    " The author can revise and resubmit the proposal."}
                </p>
              </div>
            )}
          </main>

          {/* Sidebar */}
          <aside className={styles.sidebar}>
            {/* Vote Statistics */}
            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Vote Statistics
              </h3>
              <div className={styles.voteStats}>
                <div className={styles.voteStatsGrid}>
                  <div className={styles.voteStat}>
                    <div
                      className={`${styles.voteStatValue} ${styles.voteStatValueYes}`}
                    >
                      {story.proposalYesVotes}
                    </div>
                    <div className={styles.voteStatLabel}>Yes Votes</div>
                    <div
                      style={{
                        fontSize: "var(--font-size-xs)",
                        color: "var(--text-tertiary)",
                        marginTop: "var(--space-1)",
                      }}
                    >
                      {yesPercentage}%
                    </div>
                  </div>
                  <div className={styles.voteStat}>
                    <div
                      className={`${styles.voteStatValue} ${styles.voteStatValueNo}`}
                    >
                      {story.proposalNoVotes}
                    </div>
                    <div className={styles.voteStatLabel}>No Votes</div>
                    <div
                      style={{
                        fontSize: "var(--font-size-xs)",
                        color: "var(--text-tertiary)",
                        marginTop: "var(--space-1)",
                      }}
                    >
                      {noPercentage}%
                    </div>
                  </div>
                  <div className={styles.voteStat}>
                    <div
                      className={`${styles.voteStatValue} ${styles.voteStatValueTotal}`}
                    >
                      {totalVotes}
                    </div>
                    <div className={styles.voteStatLabel}>Total Votes</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Voting Deadline */}
            {!isVotingClosed && (
              <div className={styles.section}>
                <h3 className={styles.sectionTitle}>
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Voting Deadline
                </h3>
                <div
                  className={`${styles.deadline} ${
                    isUrgent ? styles.deadlineUrgent : ""
                  }`}
                >
                  <div className={styles.deadlineTitle}>
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {isUrgent ? "Urgent: Voting Ends Soon!" : "Time Remaining"}
                  </div>
                  <div className={styles.deadlineText}>
                    {timeRemaining}
                    <br />
                    <small>
                      Deadline:{" "}
                      {new Date(story.proposalVoteEndTime).toLocaleDateString()}{" "}
                      at{" "}
                      {new Date(story.proposalVoteEndTime).toLocaleTimeString()}
                    </small>
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

export default ProposalDetailPage;
