import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Button from "../../../UI/Button/Button";
import Badge from "../../../UI/Badge/Badge";
import Avatar from "../../../UI/Avatar/Avatar";
import styles from "./StorySlideshow.module.css";
import Jazzicon from "react-jazzicon";

const StorySlideshow = ({ stories, autoPlay = true, interval = 5000 }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    if (!autoPlay || stories.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % stories.length);
    }, interval);

    return () => clearInterval(timer);
  }, [autoPlay, interval, stories.length]);

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % stories.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + stories.length) % stories.length);
  };

  const getStatusVariant = (status) => {
    switch (status) {
      case "active":
        return "success";
      case "completed":
        return "primary";
      case "pending":
        return "warning";
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

  if (!stories || stories.length === 0) {
    return null;
  }

  const currentStory = stories[currentSlide];

  return (
    <div className={styles.slideshow}>
      <div className={styles.slideContainer}>
        <div
          className={styles.slide}
          style={{ backgroundImage: `url(${currentStory?.ipfsHashImage})` }}
        >
          <div className={styles.overlay} />
          <div className={styles.content}>
            {/* <div className={styles.badges}>
              <Badge variant={getGenreColor(currentStory.genre)}>
                {currentStory.genre}
              </Badge>
              <Badge variant={getStatusVariant(currentStory.status)}>
                {currentStory.status}
              </Badge>
            </div> */}

            <h2 className={styles.title}>{currentStory?.title}</h2>
            <p className={styles.summary}>
              {currentStory?.summary.slice(0, 115)}
              {"..."}
            </p>

            <div className={styles.creator}>
              {/* <Avatar
                src={currentStory.creator.avatar}
                alt={currentStory.creator.username}
                size="medium"
              /> */}
              <Jazzicon diameter={40} seed={currentStory?.writer} />
              <div className={styles.creatorInfo}>
                <span className={styles.creatorName}>
                  by{" "}
                  {`${currentStory?.writer.slice(
                    0,
                    5
                  )}...${currentStory?.writer.slice(-4)}`}
                </span>
                <div className={styles.stats}>
                  {12} readers • {44} votes
                </div>
              </div>
            </div>

            <div className={styles.actions}>
              <Button
                as={Link}
                to={`/stories/${currentStory.storId}`}
                size="large"
                style={{
                  fontSize: "var(--font-size-lg)",
                  padding: "var(--space-4) var(--space-6)",
                }}
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  style={{ marginRight: "var(--space-2)" }}
                >
                  <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                  <path
                    fillRule="evenodd"
                    d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                    clipRule="evenodd"
                  />
                </svg>
                Read Story
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Controls */}
      <button
        className={`${styles.navButton} ${styles.prevButton}`}
        onClick={prevSlide}
        aria-label="Previous story"
        style={{ width: "56px", height: "56px" }}
      >
        <svg width="28" height="28" viewBox="0 0 20 20" fill="currentColor">
          <path
            fillRule="evenodd"
            d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      <button
        className={`${styles.navButton} ${styles.nextButton}`}
        onClick={nextSlide}
        aria-label="Next story"
        style={{ width: "56px", height: "56px" }}
      >
        <svg width="28" height="28" viewBox="0 0 20 20" fill="currentColor">
          <path
            fillRule="evenodd"
            d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {/* Dots Indicator */}
      <div className={styles.indicators}>
        {stories.map((_, index) => (
          <button
            key={index}
            className={`${styles.indicator} ${
              index === currentSlide ? styles.active : ""
            }`}
            onClick={() => goToSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default StorySlideshow;
