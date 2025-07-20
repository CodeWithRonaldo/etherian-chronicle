import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import PageContainer from '../../components/Layout/PageContainer/PageContainer';
import Card from '../../components/UI/Card/Card';
import Badge from '../../components/UI/Badge/Badge';
import Button from '../../components/UI/Button/Button';
import { useAuth } from '../../contexts/AuthContext';
import { mockNFTs } from '../../mock-data/stories';
import styles from './NFTCollectionPage.module.css';

const NFTCollectionPage = () => {
  const { user } = useAuth();
  const [selectedNFT, setSelectedNFT] = useState(null);
  const [filterRarity, setFilterRarity] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  if (!user) {
    return (
      <PageContainer>
        <div className={styles.errorState}>
          <h1>Please log in to view your NFT collection</h1>
          <Button as={Link} to="/">Go Home</Button>
        </div>
      </PageContainer>
    );
  }

  const rarities = ['all', 'Common', 'Rare', 'Epic', 'Legendary'];
  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'rarity', label: 'By Rarity' },
    { value: 'alphabetical', label: 'A-Z' }
  ];

  const filteredNFTs = mockNFTs
    .filter(nft => filterRarity === 'all' || nft.rarity === filterRarity)
    .sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.dateEarned) - new Date(a.dateEarned);
        case 'oldest':
          return new Date(a.dateEarned) - new Date(b.dateEarned);
        case 'rarity':
          const rarityOrder = { 'Common': 1, 'Rare': 2, 'Epic': 3, 'Legendary': 4 };
          return rarityOrder[b.rarity] - rarityOrder[a.rarity];
        case 'alphabetical':
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

  const getRarityVariant = (rarity) => {
    switch (rarity) {
      case 'Common': return 'neutral';
      case 'Rare': return 'primary';
      case 'Epic': return 'secondary';
      case 'Legendary': return 'warning';
      default: return 'neutral';
    }
  };

  const collectionStats = {
    total: mockNFTs.length,
    common: mockNFTs.filter(nft => nft.rarity === 'Common').length,
    rare: mockNFTs.filter(nft => nft.rarity === 'Rare').length,
    epic: mockNFTs.filter(nft => nft.rarity === 'Epic').length,
    legendary: mockNFTs.filter(nft => nft.rarity === 'Legendary').length,
  };

  return (
    <PageContainer>
      <div className={styles.container}>
        <header className={styles.header}>
          <div className={styles.headerContent}>
            <h1 className={styles.title}>NFT Collection</h1>
            <p className={styles.subtitle}>
              Your unique digital collectibles earned through storytelling adventures.
            </p>
          </div>
          <div className={styles.headerStats}>
            <div className={styles.statItem}>
              <div className={styles.statValue}>{collectionStats.total}</div>
              <div className={styles.statLabel}>Total NFTs</div>
            </div>
          </div>
        </header>

        {/* Collection Stats */}
        <div className={styles.statsGrid}>
          <Card>
            <Card.Body className="text-center">
              <div className={styles.rarityCount}>{collectionStats.common}</div>
              <Badge variant="neutral">Common</Badge>
            </Card.Body>
          </Card>
          <Card>
            <Card.Body className="text-center">
              <div className={styles.rarityCount}>{collectionStats.rare}</div>
              <Badge variant="primary">Rare</Badge>
            </Card.Body>
          </Card>
          <Card>
            <Card.Body className="text-center">
              <div className={styles.rarityCount}>{collectionStats.epic}</div>
              <Badge variant="secondary">Epic</Badge>
            </Card.Body>
          </Card>
          <Card>
            <Card.Body className="text-center">
              <div className={styles.rarityCount}>{collectionStats.legendary}</div>
              <Badge variant="warning">Legendary</Badge>
            </Card.Body>
          </Card>
        </div>

        {/* Filters */}
        <div className={styles.filters}>
          <div className={styles.filterGroup}>
            <label className={styles.filterLabel}>Filter by Rarity:</label>
            <select
              className={styles.select}
              value={filterRarity}
              onChange={(e) => setFilterRarity(e.target.value)}
            >
              {rarities.map(rarity => (
                <option key={rarity} value={rarity}>
                  {rarity === 'all' ? 'All Rarities' : rarity}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.filterGroup}>
            <label className={styles.filterLabel}>Sort by:</label>
            <select
              className={styles.select}
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              {sortOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* NFT Grid */}
        {filteredNFTs.length > 0 ? (
          <div className={styles.nftGrid}>
            {filteredNFTs.map((nft) => (
              <Card
                key={nft.id}
                className={styles.nftCard}
                interactive
                onClick={() => setSelectedNFT(nft)}
              >
                <Card.Image src={nft.image} alt={nft.name} />
                <Card.Body>
                  <div className={styles.nftHeader}>
                    <h3 className={styles.nftName}>{nft.name}</h3>
                    <Badge variant={getRarityVariant(nft.rarity)}>
                      {nft.rarity}
                    </Badge>
                  </div>
                  <p className={styles.nftDescription}>{nft.description}</p>
                  <div className={styles.nftMeta}>
                    <div className={styles.nftDate}>
                      Earned {new Date(nft.dateEarned).toLocaleDateString()}
                    </div>
                    <Link
                      to={`/stories/${nft.storyId}`}
                      className={styles.storyLink}
                      onClick={(e) => e.stopPropagation()}
                    >
                      View Story
                    </Link>
                  </div>
                </Card.Body>
              </Card>
            ))}
          </div>
        ) : (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>
              <svg width="80" height="80" viewBox="0 0 20 20" fill="currentColor">
                <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
              </svg>
            </div>
            <h3>No NFTs found</h3>
            <p>
              {filterRarity === 'all'
                ? "You haven't earned any NFTs yet. Start participating in stories to earn unique collectibles!"
                : `No ${filterRarity} NFTs in your collection. Try different filters or earn more NFTs!`
              }
            </p>
            <Button as={Link} to="/stories">
              Explore Stories
            </Button>
          </div>
        )}

        {/* NFT Detail Modal */}
        {selectedNFT && (
          <div className={styles.modal} onClick={() => setSelectedNFT(null)}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
              <button
                className={styles.closeButton}
                onClick={() => setSelectedNFT(null)}
                aria-label="Close modal"
              >
                <svg width="24" height="24" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>

              <div className={styles.modalGrid}>
                <div className={styles.modalImage}>
                  <img src={selectedNFT.image} alt={selectedNFT.name} />
                </div>

                <div className={styles.modalDetails}>
                  <div className={styles.modalHeader}>
                    <h2 className={styles.modalTitle}>{selectedNFT.name}</h2>
                    <Badge variant={getRarityVariant(selectedNFT.rarity)} size="large">
                      {selectedNFT.rarity}
                    </Badge>
                  </div>

                  <p className={styles.modalDescription}>{selectedNFT.description}</p>

                  <div className={styles.modalMeta}>
                    <div className={styles.metaItem}>
                      <span className={styles.metaLabel}>Date Earned:</span>
                      <span className={styles.metaValue}>
                        {new Date(selectedNFT.dateEarned).toLocaleDateString()}
                      </span>
                    </div>
                    <div className={styles.metaItem}>
                      <span className={styles.metaLabel}>Story:</span>
                      <Link
                        to={`/stories/${selectedNFT.storyId}`}
                        className={styles.metaLink}
                      >
                        View Original Story
                      </Link>
                    </div>
                  </div>

                  {selectedNFT.attributes && (
                    <div className={styles.attributes}>
                      <h3 className={styles.attributesTitle}>Attributes</h3>
                      <div className={styles.attributesList}>
                        {selectedNFT.attributes.map((attr, index) => (
                          <div key={index} className={styles.attribute}>
                            <span className={styles.attributeType}>{attr.trait_type}</span>
                            <span className={styles.attributeValue}>{attr.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className={styles.modalActions}>
                    <Button variant="secondary" onClick={() => setSelectedNFT(null)}>
                      Close
                    </Button>
                    <Button variant="primary">
                      <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
                      </svg>
                      Share NFT
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </PageContainer>
  );
};

export default NFTCollectionPage;