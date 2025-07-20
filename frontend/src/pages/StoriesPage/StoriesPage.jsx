import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PageContainer from '../../components/Layout/PageContainer/PageContainer';
import PageBanner from '../../components/Layout/PageBanner/PageBanner';
import StoryCard from '../../components/Features/Story/StoryCard/StoryCard';
import Button from '../../components/UI/Button/Button';
import Badge from '../../components/UI/Badge/Badge';
import Avatar from '../../components/UI/Avatar/Avatar';
import LoadingSpinner from '../../components/UI/LoadingSpinner/LoadingSpinner';
import { useStory } from '../../contexts/StoryContext';
import styles from './StoriesPage.module.css';

const StoriesPage = () => {
  const { stories, loading } = useStory();
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    genre: 'all',
    status: 'all',
    sortBy: 'popularity'
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  const genres = ['all', 'fantasy', 'sci-fi', 'mystery', 'romance', 'horror', 'drama', 'steampunk', 'adventure', 'others'];
  const statuses = ['all', 'active', 'completed', 'pending'];
  const sortOptions = [
    { value: 'popularity', label: 'Most Popular' },
    { value: 'newest', label: 'Newest First' },
    { value: 'votes', label: 'Most Votes' },
    { value: 'alphabetical', label: 'A-Z' }
  ];

  const filteredStories = useMemo(() => {
    let filtered = [...stories];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(story =>
        story.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        story.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
        story.creator.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        story.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Apply genre filter
    if (filters.genre !== 'all') {
      filtered = filtered.filter(story => story.genre === filters.genre);
    }

    // Apply status filter
    if (filters.status !== 'all') {
      filtered = filtered.filter(story => story.status === filters.status);
    }

    // Apply sorting
    switch (filters.sortBy) {
      case 'popularity':
        filtered.sort((a, b) => b.stats.totalReaders - a.stats.totalReaders);
        break;
      case 'newest':
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case 'votes':
        filtered.sort((a, b) => b.stats.totalVotes - a.stats.totalVotes);
        break;
      case 'alphabetical':
        filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;
      default:
        break;
    }

    return filtered;
  }, [stories, searchTerm, filters]);

  const totalPages = Math.ceil(filteredStories.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedStories = filteredStories.slice(startIndex, startIndex + itemsPerPage);

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({ ...prev, [filterType]: value }));
    setCurrentPage(1); // Reset to first page when filters change
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page when search changes
  };

  const handleStoryClick = (story) => {
    navigate(`/stories/${story.id}`);
  };

  const formatNumber = (num) => {
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}k`;
    }
    return num.toString();
  };

  if (loading) {
    return <PageContainer loading={true} />;
  }

  return (
    <PageContainer>
      <PageBanner
        title="Discover Stories"
        subtitle="Immerse yourself in collaborative narratives where every choice shapes the story's destiny"
        backgroundImage="https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg?auto=compress&cs=tinysrgb&w=1200&h=400&dpr=1"
        size="medium"
      />
      
      <div className={styles.container}>

        {/* Filters */}
        <div className={styles.filters}>
          <div className={styles.filterGroup}>
            <span className={styles.filterLabel}>Genre:</span>
            <select
              className={styles.select}
              value={filters.genre}
              onChange={(e) => handleFilterChange('genre', e.target.value)}
            >
              {genres.map(genre => (
                <option key={genre} value={genre}>
                  {genre === 'all' ? 'All Genres' : genre.charAt(0).toUpperCase() + genre.slice(1)}
                </option>
              ))}
            </select>

            <span className={styles.filterLabel}>Status:</span>
            <select
              className={styles.select}
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
            >
              {statuses.map(status => (
                <option key={status} value={status}>
                  {status === 'all' ? 'All Status' : status.charAt(0).toUpperCase() + status.slice(1)}
                </option>
              ))}
            </select>

            <span className={styles.filterLabel}>Sort by:</span>
            <select
              className={styles.select}
              value={filters.sortBy}
              onChange={(e) => handleFilterChange('sortBy', e.target.value)}
            >
              {sortOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.searchContainer}>
            <svg
              className={styles.searchIcon}
              width="16"
              height="16"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
            </svg>
            <input
              type="text"
              placeholder="Search stories, creators, or tags..."
              className={styles.searchInput}
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>
        </div>

        {/* Results */}
        <div className={styles.results}>
          <div className={styles.resultsHeader}>
            <div className={styles.resultsCount}>
              {filteredStories.length} {filteredStories.length === 1 ? 'story' : 'stories'} found
            </div>
            <div className={styles.viewToggle}>
              <button
                className={`${styles.viewButton} ${viewMode === 'grid' ? styles.active : ''}`}
                onClick={() => setViewMode('grid')}
                aria-label="Grid view"
              >
                <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </button>
              <button
                className={`${styles.viewButton} ${viewMode === 'list' ? styles.active : ''}`}
                onClick={() => setViewMode('list')}
                aria-label="List view"
              >
                <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>

          {paginatedStories.length === 0 ? (
            <div className={styles.emptyState}>
              <svg
                className={styles.emptyIcon}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              <h3 className={styles.emptyTitle}>No stories found</h3>
              <p className={styles.emptyMessage}>
                Try adjusting your filters or search terms to find more stories.
              </p>
              <Button as={Link} to="/create" variant="primary">
                Create the First Story
              </Button>
            </div>
          ) : (
            <>
              {viewMode === 'grid' ? (
                <div className={styles.storiesGrid}>
                  {paginatedStories.map((story) => (
                    <StoryCard
                      key={story.id}
                      story={story}
                      onClick={handleStoryClick}
                    />
                  ))}
                </div>
              ) : (
                <div className={styles.storiesList}>
                  {paginatedStories.map((story) => (
                    <div
                      key={story.id}
                      className={styles.listItem}
                      onClick={() => handleStoryClick(story)}
                    >
                      <img
                        src={story.coverImage}
                        alt={`Cover for ${story.title}`}
                        className={styles.listImage}
                      />
                      <div className={styles.listContent}>
                        <h3 className={styles.listTitle}>{story.title}</h3>
                        <div className={styles.listMeta}>
                          <Avatar
                            src={story.creator.avatar}
                            alt={story.creator.username}
                            size="small"
                          />
                          <span>by {story.creator.username}</span>
                          <Badge variant="secondary" size="small">
                            {story.genre}
                          </Badge>
                          <Badge
                            variant={story.status === 'active' ? 'success' : story.status === 'completed' ? 'primary' : 'warning'}
                            size="small"
                          >
                            {story.status}
                          </Badge>
                        </div>
                        <p className={styles.listSummary}>{story.summary}</p>
                        <div className={styles.listStats}>
                          <div className={styles.listStat}>
                            <svg width="14" height="14" viewBox="0 0 20 20" fill="currentColor">
                              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                              <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                            </svg>
                            {formatNumber(story.stats.totalReaders)} readers
                          </div>
                          <div className={styles.listStat}>
                            <svg width="14" height="14" viewBox="0 0 20 20" fill="currentColor">
                              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {formatNumber(story.stats.totalVotes)} votes
                          </div>
                          <div className={styles.listStat}>
                            <svg width="14" height="14" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" />
                            </svg>
                            Chapter {story.currentChapter}/{story.totalChapters}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className={styles.pagination}>
                  <button
                    className={styles.pageButton}
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                  >
                    <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
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
                        className={`${styles.pageButton} ${currentPage === pageNum ? styles.active : ''}`}
                        onClick={() => setCurrentPage(pageNum)}
                      >
                        {pageNum}
                      </button>
                    );
                  })}

                  <button
                    className={styles.pageButton}
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                  >
                    <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
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
      </div>
    </PageContainer>
  );
};

export default StoriesPage;