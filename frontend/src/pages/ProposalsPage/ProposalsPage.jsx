import React, { useState, useMemo, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import PageContainer from "../../components/Layout/PageContainer/PageContainer";
import PageBanner from "../../components/Layout/PageBanner/PageBanner";
import Button from "../../components/UI/Button/Button";
import Badge from "../../components/UI/Badge/Badge";
import styles from "./ProposalsPage.module.css";
import { convertStoryStatus, formatAddress } from "../../helper/helper";
import { StoryData } from "../../contexts/storyData";
import { Blobbie } from "thirdweb/react";

const ProposalsPage = () => {
  const { allStories, isLoading } = useContext(StoryData);
  console.log(allStories);

  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    status: "all",
    genre: "all",
    sortBy: "alphabetical",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  const statuses = ["all", "pending", "active", "rejected", "paused"];
  const genres = [
    "all",
    "fantasy",
    "sci-fi",
    "mystery",
    "romance",
    "horror",
    "drama",
    "steampunk",
    "adventure",
    "others",
  ];
  const sortOptions = [
    { value: "newest", label: "Newest First" },
    { value: "oldest", label: "Oldest First" },
    { value: "votes", label: "Most Votes" },
    { value: "deadline", label: "Deadline Soon" },
  ];

  const storyProposal = allStories.filter((proposal) => {
    return proposal.storyStatus === 0;
  });

  const filteredProposals = useMemo(() => {
    let filtered = [...storyProposal];

    // Apply status filter
    if (filters.status !== "all") {
      filtered = filtered.filter(
        (proposal) =>
          convertStoryStatus(proposal.Storystatus) === filters.status
      );
    }

    // Apply genre filter
    if (filters.genre !== "all") {
      filtered = filtered.filter(
        (proposal) =>
          proposal.chapters[0]?.chapertDetails?.genre === filters.genre
      );
    }

    // Apply sorting
    switch (filters.sortBy) {
      // case "newest":
      //   filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      //   break;
      // case "oldest":
      //   filtered.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      //   break;
      case "votes":
        filtered.sort(
          (a, b) =>
            b.proposalYesVotes +
            b.proposalNoVotes -
            (a.proposalYesVotes + a.proposalNoVotes)
        );
        break;
      // case "deadline":
      //   filtered.sort(
      //     (a, b) => new Date(a.votingDeadline) - new Date(b.votingDeadline)
      //   );
      //   break;
      default:
        break;
    }

    return filtered;
  }, [allStories, filters]);

  const totalPages = Math.ceil(filteredProposals.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProposals = filteredProposals.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const handleFilterChange = (filterType, value) => {
    setFilters((prev) => ({ ...prev, [filterType]: value }));
    setCurrentPage(1);
  };

  const handleProposalClick = (proposal) => {
    navigate(`/proposals/${proposal.storyId}`);
  };

  const getStatusVariant = (status) => {
    switch (status) {
      case "pending":
        return "warning";
      case "approved":
        return "success";
      case "rejected":
        return "error";
      default:
        return "neutral";
    }
  };

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

  const getTimeRemaining = (deadline) => {
    const now = new Date();
    const deadlineDate = new Date(deadline);
    const diff = deadlineDate.getTime() - now.getTime();

    if (diff <= 0) {
      return { text: "Voting ended", urgent: false };
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

    if (days > 0) {
      return { text: `${days}d ${hours}h left`, urgent: days <= 1 };
    } else if (hours > 0) {
      return { text: `${hours}h left`, urgent: true };
    } else {
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      return { text: `${minutes}m left`, urgent: true };
    }
  };

  if (isLoading) {
    return (
      <PageContainer>
        <div className={styles.container}>
          <header className={styles.header}>
            <h1 className={styles.title}>Story Proposals</h1>
            <p className={styles.subtitle}>
              Vote on new story ideas from the community and help shape the
              future of interactive storytelling.
            </p>
          </header>

          <div className={styles.loadingGrid}>
            {Array.from({ length: 6 }, (_, i) => (
              <div key={i} className={styles.loadingCard}>
                <div className={styles.loadingImage} />
                <div className={styles.loadingContent}>
                  <div className={styles.loadingTitle} />
                  <div className={styles.loadingText} />
                  <div
                    className={`${styles.loadingText} ${styles.loadingTextShort}`}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <PageBanner
        title="Story Proposals"
        subtitle="Shape the future of storytelling by voting on innovative narrative concepts from our creative community"
        backgroundImage="https://images.pexels.com/photos/1181263/pexels-photo-1181263.jpeg?auto=compress&cs=tinysrgb&w=1200&h=400&dpr=1"
        size="medium"
      />

      <div className={styles.container}>
        {/* Actions and Filters */}
        <div className={styles.actions}>
          <div className={styles.filters}>
            <select
              className={styles.select}
              value={filters.status}
              onChange={(e) => handleFilterChange("status", e.target.value)}
            >
              {statuses.map((status) => (
                <option key={status} value={status}>
                  {status === "all"
                    ? "All Status"
                    : status.charAt(0).toUpperCase() + status.slice(1)}
                </option>
              ))}
            </select>

            <select
              className={styles.select}
              value={filters.genre}
              onChange={(e) => handleFilterChange("genre", e.target.value)}
            >
              {genres.map((genre) => (
                <option key={genre} value={genre}>
                  {genre === "all"
                    ? "All Genres"
                    : genre.charAt(0).toUpperCase() + genre.slice(1)}
                </option>
              ))}
            </select>

            <select
              className={styles.select}
              value={filters.sortBy}
              onChange={(e) => handleFilterChange("sortBy", e.target.value)}
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <Button onClick={() => navigate("/create")} variant="primary">
            <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                clipRule="evenodd"
              />
            </svg>
            Submit Proposal
          </Button>
        </div>

        {/* Proposals Grid */}
        {paginatedProposals.length === 0 ? (
          <div className={styles.emptyState}>
            <svg
              className={styles.emptyIcon}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <h3 className={styles.emptyTitle}>No proposals found</h3>
            <p className={styles.emptyMessage}>
              Be the first to submit a story proposal and start building the
              future of interactive storytelling.
            </p>
            <Button onClick={() => navigate("/create")} variant="primary">
              Submit First Proposal
            </Button>
          </div>
        ) : (
          <>
            <div className={styles.proposalsGrid}>
              {paginatedProposals.map((proposal) => {
                const timeRemaining = getTimeRemaining(
                  Number(proposal?.proposalVoteEndTime)
                );
                const totalVotes =
                  proposal.proposalYesVotes + proposal.proposalNoVotes;

                return (
                  <div
                    key={proposal.storyId}
                    className={styles.proposalCard}
                    onClick={() => handleProposalClick(proposal)}
                  >
                    <img
                      src={proposal.ipfsHashImage}
                      alt={`Cover for ${proposal.title}`}
                      className={styles.proposalImage}
                    />

                    <div className={styles.proposalContent}>
                      <div className={styles.proposalHeader}>
                        <div className={styles.proposalBadges}>
                          <Badge
                            variant={getStatusVariant(
                              convertStoryStatus(proposal.StoryStatus)
                            )}
                          >
                            {convertStoryStatus(proposal.storyStatus)}
                          </Badge>
                          <Badge
                            variant={getGenreColor(
                              proposal?.chapters[0]?.ipfsDetails?.genre
                            )}
                          >
                            {proposal?.chapters[0]?.ipfsDetails?.genre}
                          </Badge>
                        </div>

                        <h3 className={styles.proposalTitle}>
                          {proposal.title}
                        </h3>

                        <div className={styles.proposalCreator}>
                          <Blobbie
                            address={proposal.writer}
                            size={35}
                            style={{ borderRadius: "50%" }}
                          />
                          <span>by {formatAddress(proposal.writer)}</span>
                        </div>
                      </div>

                      <p className={styles.proposalSummary}>
                        {proposal.summary}
                      </p>

                      <div className={styles.proposalFooter}>
                        <div className={styles.voteStats}>
                          <div
                            className={`${styles.voteStat} ${styles.voteStatYes}`}
                          >
                            <svg
                              width="14"
                              height="14"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                clipRule="evenodd"
                              />
                            </svg>
                            {proposal.proposalYesVotes}
                          </div>
                          <div
                            className={`${styles.voteStat} ${styles.voteStatNo}`}
                          >
                            <svg
                              width="14"
                              height="14"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                clipRule="evenodd"
                              />
                            </svg>
                            {proposal.proposalNoVotes}
                          </div>
                          <div className={styles.voteStat}>
                            {totalVotes} total
                          </div>
                        </div>

                        <div
                          className={`${styles.deadline} ${
                            timeRemaining.urgent ? styles.deadlineUrgent : ""
                          }`}
                        >
                          <svg
                            width="12"
                            height="12"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                              clipRule="evenodd"
                            />
                          </svg>
                          {timeRemaining.text}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className={styles.pagination}>
                <button
                  className={styles.pageButton}
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>

                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }

                  return (
                    <button
                      key={pageNum}
                      className={`${styles.pageButton} ${
                        currentPage === pageNum ? styles.active : ""
                      }`}
                      onClick={() => setCurrentPage(pageNum)}
                    >
                      {pageNum}
                    </button>
                  );
                })}

                <button
                  className={styles.pageButton}
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>

                <div className={styles.pageInfo}>
                  Page {currentPage} of {totalPages}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </PageContainer>
  );
};

export default ProposalsPage;
