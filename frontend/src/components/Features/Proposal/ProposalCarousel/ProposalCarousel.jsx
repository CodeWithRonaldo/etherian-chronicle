import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
import Badge from "../../../UI/Badge/Badge";
import Avatar from "../../../UI/Avatar/Avatar";
import Button from "../../../UI/Button/Button";
import styles from "./ProposalCarousel.module.css";
import { formatAddress } from "../../../../helper/helper";
import { Blobbie } from "thirdweb/react";

const ProposalCarousel = ({ proposals, title = "Recent Proposals" }) => {
  const scrollContainerRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScrollButtons = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } =
        scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
    }
  };

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = 320; // Width of one card plus gap
      const newScrollLeft =
        scrollContainerRef.current.scrollLeft +
        (direction === "left" ? -scrollAmount : scrollAmount);

      scrollContainerRef.current.scrollTo({
        left: newScrollLeft,
        behavior: "smooth",
      });
    }
  };

  // const getStatusVariant = (status) => {
  //   switch (status) {
  //     case "0":
  //       return "warning";
  //     case "1":
  //       return "success";
  //     case "2":
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
      others: "neutral",
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

  if (!proposals || proposals.length === 0) {
    return null;
  }

  return (
    <div className={styles.carousel}>
      <div className={styles.header}>
        <h2 className={styles.title}>{title}</h2>
        <div className={styles.controls}>
          <button
            className={`${styles.scrollButton} ${
              !canScrollLeft ? styles.disabled : ""
            }`}
            style={{ width: "48px", height: "48px" }}
            onClick={() => scroll("left")}
            disabled={!canScrollLeft}
            aria-label="Scroll left"
          >
            <svg width="24" height="24" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </button>
          <button
            className={`${styles.scrollButton} ${
              !canScrollRight ? styles.disabled : ""
            }`}
            style={{ width: "48px", height: "48px" }}
            onClick={() => scroll("right")}
            disabled={!canScrollRight}
            aria-label="Scroll right"
          >
            <svg width="24" height="24" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      </div>

      <div
        className={styles.scrollContainer}
        ref={scrollContainerRef}
        onScroll={checkScrollButtons}
      >
        <div className={styles.proposalsContainer}>
          {proposals.map((proposal) => {
            const timeRemaining = getTimeRemaining(
              Number(proposal.proposalVoteEndTime)
            );
            const totalVotes =
              Number(proposal.proposalYesVotes) +
              Number(proposal.proposalNoVotes);

            return (
              <Link
                key={proposal.storyId}
                to={`/proposals/${proposal.storyId}`}
                className={styles.proposalCard}
              >
                <div className={styles.imageContainer}>
                  <img
                    src={proposal.ipfsHashImage}
                    alt={`Cover for ${proposal.title}`}
                    className={styles.image}
                  />
                  <div className={styles.badges}>
                    <Badge variant={"success"}>Active</Badge>
                    {/* <Badge
                      variant={getGenreColor(
                        proposal.chapters[0].ipfsDetails.genre.toLowerCase() ||
                          "none"
                      )}
                    >
                      {proposal.chapters[0].ipfsDetails.genre || "none"}
                    </Badge> */}
                  </div>
                </div>

                <div className={styles.content}>
                  <h3 className={styles.proposalTitle}>{proposal.title}</h3>

                  <div className={styles.creator}>
                    <Blobbie
                      address={proposal.writer}
                      size={25}
                      style={{ borderRadius: "50%" }}
                    />
                    <span>by {formatAddress(proposal.writer)}</span>
                  </div>

                  <p className={styles.summary}>{proposal.summary}</p>

                  <div className={styles.footer}>
                    <div className={styles.voteStats}>
                      <div className={styles.voteStat}>
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
                        {Number(proposal.proposalYesVotes)}
                      </div>
                      <div className={styles.voteStat}>
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
                        {Number(proposal.proposalNoVotes)}
                      </div>
                      <span className={styles.totalVotes}>
                        {totalVotes} total
                      </span>
                    </div>

                    <div
                      className={`${styles.deadline} ${
                        timeRemaining.urgent ? styles.urgent : ""
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
              </Link>
            );
          })}
        </div>
      </div>

      <div className={styles.viewAllContainer}>
        <Button as={Link} to="/proposals" variant="secondary">
          View All Proposals
        </Button>
      </div>
    </div>
  );
};

export default ProposalCarousel;
