import React from "react";
import { Link } from "react-router-dom";
import Card from "../../../UI/Card/Card";
import Badge from "../../../UI/Badge/Badge";
import Avatar from "../../../UI/Avatar/Avatar";
import ProgressBar from "../../../UI/ProgressBar/ProgressBar";
import styles from "./StoryCard.module.css";
import Jazzicon from "react-jazzicon";

const StoryCard = ({
  story,
  variant = "default",
  showOverlay = false,
  loading = false,
  onClick,
}) => {
  if (loading) {
    return (
      <Card className={`${styles.card} ${styles.loading} ${styles[variant]}`}>
        <div className={styles.imageContainer}>
          <div className={styles.image} />
        </div>
        <Card.Body className={styles.content}>
          <div className={styles.header}>
            <div
              style={{
                height: "1.5rem",
                background: "var(--gray-200)",
                borderRadius: "var(--radius-md)",
                marginBottom: "var(--space-2)",
              }}
            />
            <div
              style={{
                height: "1rem",
                background: "var(--gray-200)",
                borderRadius: "var(--radius-md)",
                width: "60%",
              }}
            />
          </div>
        </Card.Body>
      </Card>
    );
  }

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

  const handleClick = (e) => {
    if (onClick) {
      e.preventDefault();
      onClick(story);
    }
  };

  const cardContent = (
    <>
      <div className={styles.imageContainer}>
        <img
          src={story.ipfsHashImage}
          alt={`Cover for ${story.title}`}
          className={styles.image}
        />

        <Badge
          variant={getStatusVariant("active")}
          className={styles.statusBadge}
        >
          {"Active"}
        </Badge>

        <Badge variant={getGenreColor("fantasy")} className={styles.genreBadge}>
          {"Fantasy"}
        </Badge>

        {showOverlay && (
          <div className={styles.overlay}>
            <h3 className={styles.overlayTitle}>{story.title}</h3>
            <div className={styles.overlayCreator}>
              {/* <Avatar
                src={story.creator.avatar}
                alt={story.creator.username}
                size="small"
              /> */}
              <Jazzicon diameter={30} seed={story?.writer} />
              <span>
                by {`${story?.writer.slice(0, 5)}...${story?.writer.slice(-4)}`}
              </span>
            </div>
          </div>
        )}
      </div>

      <Card.Body className={styles.content}>
        <header className={styles.header}>
          <h3 className={styles.title}>{story?.title}</h3>
          {!showOverlay && (
            <div className={styles.creator}>
              {/* <Avatar 
                src={story.creator.avatar}
                alt={story.creator.username}
                size="small"
              /> */}
              <Jazzicon diameter={30} seed={story?.writer} />
              <span>
                by {`${story?.writer.slice(0, 5)}...${story?.writer.slice(-4)}`}
              </span>
            </div>
          )}
        </header>

        <p className={styles.summary}>
          {story?.summary.slice(0, 85)}
          {"..."}
        </p>

        {story.tags && story.tags.length > 0 && (
          <div className={styles.tags}>
            {story.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="neutral" size="small">
                {tag}
              </Badge>
            ))}
            {story.tags.length > 3 && (
              <Badge variant="neutral" size="small">
                +{story.tags.length - 3}
              </Badge>
            )}
          </div>
        )}

        <div className={styles.metadata}>
          <div className={styles.stats}>
            <div className={styles.stat}>
              <span className={styles.statValue}>{14}</span>
              <span className={styles.statLabel}>Readers</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statValue}>{22}</span>
              <span className={styles.statLabel}>Votes</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statValue}>{3}</span>
              <span className={styles.statLabel}>Rating</span>
            </div>
          </div>
        </div>
      </Card.Body>
    </>
  );

  const cardClasses = [styles.card, styles[variant], loading && styles.loading]
    .filter(Boolean)
    .join(" ");

  if (onClick) {
    return (
      <Card
        className={cardClasses}
        interactive
        onClick={handleClick}
        role="button"
        tabIndex={0}
        aria-label={`View story: ${story.title}`}
      >
        {cardContent}
      </Card>
    );
  }

  return (
    <Link
      to={`/stories/${story.storyId}`}
      style={{ textDecoration: "none", color: "inherit" }}
      aria-label={`View story: ${story.title}`}
    >
      <Card className={cardClasses} interactive>
        {cardContent}
      </Card>
    </Link>
  );
};

export default StoryCard;
