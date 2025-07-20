import React, { useState, useEffect } from 'react';
import Button from '../../../UI/Button/Button';
import LoadingSpinner from '../../../UI/LoadingSpinner/LoadingSpinner';
import { useNotification } from '../../../../contexts/NotificationContext';
import styles from './VotingInterface.module.css';

const VotingInterface = ({
  title,
  subtitle,
  choices,
  deadline,
  onVote,
  userVote,
  showResults = false,
  winningChoiceId,
  loading = false,
  disabled = false,
}) => {
  const [selectedChoice, setSelectedChoice] = useState(userVote || null);
  const [isVoting, setIsVoting] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState('');
  const { showSuccess, showError } = useNotification();

  useEffect(() => {
    if (deadline) {
      const updateTimeRemaining = () => {
        const now = new Date();
        const deadlineDate = new Date(deadline);
        const diff = deadlineDate.getTime() - now.getTime();

        if (diff <= 0) {
          setTimeRemaining('Voting has ended');
          return;
        }

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

        if (days > 0) {
          setTimeRemaining(`${days}d ${hours}h remaining`);
        } else if (hours > 0) {
          setTimeRemaining(`${hours}h ${minutes}m remaining`);
        } else {
          setTimeRemaining(`${minutes}m remaining`);
        }
      };

      updateTimeRemaining();
      const interval = setInterval(updateTimeRemaining, 60000); // Update every minute

      return () => clearInterval(interval);
    }
  }, [deadline]);

  const totalVotes = choices.reduce((sum, choice) => sum + choice.votes, 0);

  const getVotePercentage = (votes) => {
    if (totalVotes === 0) return 0;
    return Math.round((votes / totalVotes) * 100);
  };

  const handleVote = async () => {
    if (!selectedChoice || isVoting) return;

    setIsVoting(true);
    try {
      await onVote(selectedChoice);
      showSuccess('Your vote has been recorded!');
    } catch (error) {
      showError('Failed to record your vote. Please try again.');
    } finally {
      setIsVoting(false);
    }
  };

  const handleChoiceClick = (choiceId) => {
    if (disabled || userVote || loading) return;
    setSelectedChoice(choiceId);
  };

  const isVotingClosed = deadline && new Date() > new Date(deadline);
  const canVote = !disabled && !userVote && !isVotingClosed && !loading;

  return (
    <div className={`${styles.container} ${loading ? styles.loading : ''}`}>
      <header className={styles.header}>
        <h2 className={styles.title}>{title}</h2>
        {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
      </header>

      {deadline && !showResults && (
        <div className={styles.deadline}>
          <svg
            className={styles.deadlineIcon}
            width="16"
            height="16"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
          </svg>
          <span>{timeRemaining}</span>
        </div>
      )}

      {totalVotes > 0 && (
        <div className={styles.totalVotes}>
          <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{totalVotes} total votes</span>
        </div>
      )}

      <div className={styles.choices} role="radiogroup" aria-label="Vote choices">
        {choices.map((choice) => {
          const isSelected = selectedChoice === choice.id;
          const isUserVote = userVote === choice.id;
          const isWinning = winningChoiceId === choice.id;
          const percentage = getVotePercentage(choice.votes);

          return (
            <div
              key={choice.id}
              className={`${styles.choice} ${
                isSelected ? styles.selected : ''
              } ${isUserVote ? styles.voted : ''} ${
                !canVote ? styles.disabled : ''
              }`}
              onClick={() => handleChoiceClick(choice.id)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleChoiceClick(choice.id);
                }
              }}
              tabIndex={canVote ? 0 : -1}
              role="radio"
              aria-checked={isSelected || isUserVote}
              aria-label={`Choice: ${choice.text}`}
            >
              <div className={styles.choiceContent}>
                <div className={styles.radioContainer}>
                  <div className={styles.radio} />
                </div>
                <div className={styles.choiceText}>
                  <div className={styles.choiceLabel}>
                    {choice.text}
                    {isWinning && showResults && (
                      <span style={{ marginLeft: 'var(--space-2)', color: 'var(--success-500)' }}>
                        ✓ Winner
                      </span>
                    )}
                  </div>
                  {(userVote || showResults) && (
                    <div className={styles.choiceVotes}>
                      <div className={styles.voteCount}>
                        <svg width="14" height="14" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {choice.votes} votes
                      </div>
                      <div className={styles.votePercentage}>
                        {percentage}%
                      </div>
                    </div>
                  )}
                </div>
              </div>
              {(userVote || showResults) && (
                <div
                  className={styles.progressBar}
                  style={{ width: `${percentage}%` }}
                />
              )}
            </div>
          );
        })}
      </div>

      {canVote && (
        <div className={styles.actions}>
          <Button
            variant="secondary"
            onClick={() => setSelectedChoice(null)}
            disabled={!selectedChoice || isVoting}
          >
            Clear Selection
          </Button>
          <Button
            variant="primary"
            onClick={handleVote}
            disabled={!selectedChoice || isVoting}
            loading={isVoting}
            className={styles.voteButton}
          >
            {isVoting ? (
              <>
                <LoadingSpinner size="small" className={styles.loadingSpinner} />
                Voting...
              </>
            ) : (
              'Cast Vote'
            )}
          </Button>
        </div>
      )}

      {showResults && winningChoiceId && (
        <div className={styles.results}>
          <h3 className={styles.resultsTitle}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Voting Complete
          </h3>
          <p className={styles.resultsText}>
            The winning choice is:{' '}
            <span className={styles.winningChoice}>
              "{choices.find(c => c.id === winningChoiceId)?.text}"
            </span>
          </p>
        </div>
      )}
    </div>
  );
};

export default VotingInterface;