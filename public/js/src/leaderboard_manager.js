/**
 * LeaderboardManager class.
 * Manages leaderboard operations including saving and retrieving scores.
 * @type {LeaderboardManager}
 */

class LeaderboardManager {
    constructor() {
        this.maxEntries = 10;
        this.storageKey = 'dino3d_leaderboard';
        this.apiBase = '/api/leaderboard';
    }

    /**
     * Get all leaderboard entries sorted by score (highest first)
     * @returns {Promise<Array>} Array of {name, score, date} objects
     */
    async getLeaderboard() {
        try {
            const response = await fetch(this.apiBase);
            if (response.ok) {
                return await response.json();
            } else {
                console.error('Failed to fetch leaderboard from server');
                return this.getLocalLeaderboard();
            }
        } catch (e) {
            console.error('Error loading leaderboard from server:', e);
            return this.getLocalLeaderboard();
        }
    }

    /**
     * Fallback to localStorage if server is unavailable
     * @returns {Array} Array of {name, score, date} objects
     */
    getLocalLeaderboard() {
        try {
            const data = localStorage.getItem(this.storageKey);
            if (!data) {
                return [];
            }
            return JSON.parse(data);
        } catch (e) {
            console.error('Error loading local leaderboard:', e);
            return [];
        }
    }

    /**
     * Add a new score to the leaderboard
     * @param {string} name - Player name
     * @param {number} score - Player score
     * @returns {Promise<boolean>} True if score was added to top 10
     */
    async addScore(name, score) {
        if (!name || name.trim() === '') {
            name = 'Anonymous';
        }

        try {
            const response = await fetch(this.apiBase, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name: name.trim(), score })
            });

            if (response.ok) {
                const result = await response.json();
                return result.success;
            } else {
                console.error('Failed to save score to server');
                return this.addScoreLocal(name, score);
            }
        } catch (e) {
            console.error('Error saving to server:', e);
            return this.addScoreLocal(name, score);
        }
    }

    /**
     * Fallback to localStorage if server is unavailable
     * @param {string} name - Player name
     * @param {number} score - Player score
     * @returns {boolean} True if score was added
     */
    addScoreLocal(name, score) {
        const leaderboard = this.getLocalLeaderboard();
        const trimmedName = name.trim();

        // Check if name already exists
        const existingEntry = leaderboard.find(entry =>
            entry.name.toLowerCase() === trimmedName.toLowerCase()
        );

        if (existingEntry) {
            // Update score only if new score is higher
            if (score > existingEntry.score) {
                existingEntry.score = Math.floor(score);
                existingEntry.date = new Date().toISOString();
            } else {
                return false;
            }
        } else {
            // Add new entry
            leaderboard.push({
                name: trimmedName,
                score: Math.floor(score),
                date: new Date().toISOString()
            });
        }

        // Sort by score (highest first)
        leaderboard.sort((a, b) => b.score - a.score);

        // Keep only top entries
        const topEntries = leaderboard.slice(0, this.maxEntries);

        // Save back to localStorage
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(topEntries));
            return true;
        } catch (e) {
            console.error('Error saving to local leaderboard:', e);
            return false;
        }
    }

    /**
     * Check if a score qualifies for the leaderboard
     * @param {number} score - Score to check
     * @returns {Promise<boolean>} True if score qualifies
     */
    async isTopScore(score) {
        try {
            const response = await fetch(`${this.apiBase}/check`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ score })
            });

            if (response.ok) {
                const result = await response.json();
                return result.qualifies;
            } else {
                console.error('Failed to check score with server');
                return this.isTopScoreLocal(score);
            }
        } catch (e) {
            console.error('Error checking score with server:', e);
            return this.isTopScoreLocal(score);
        }
    }

    /**
     * Fallback local score check
     * @param {number} score - Score to check
     * @returns {boolean} True if score qualifies
     */
    isTopScoreLocal(score) {
        const leaderboard = this.getLocalLeaderboard();

        if (leaderboard.length < this.maxEntries) {
            return true;
        }

        const lowestScore = leaderboard[leaderboard.length - 1].score;
        return score > lowestScore;
    }

    /**
     * Clear all leaderboard entries
     * @returns {Promise<boolean>} True if successful
     */
    async clearLeaderboard() {
        try {
            const response = await fetch(this.apiBase, {
                method: 'DELETE'
            });

            if (response.ok) {
                // Also clear local storage
                localStorage.removeItem(this.storageKey);
                return true;
            } else {
                console.error('Failed to clear server leaderboard');
                return this.clearLocalLeaderboard();
            }
        } catch (e) {
            console.error('Error clearing server leaderboard:', e);
            return this.clearLocalLeaderboard();
        }
    }

    /**
     * Clear local leaderboard
     * @returns {boolean} True if successful
     */
    clearLocalLeaderboard() {
        try {
            localStorage.removeItem(this.storageKey);
            return true;
        } catch (e) {
            console.error('Error clearing local leaderboard:', e);
            return false;
        }
    }

    /**
     * Get player's rank for a given score
     * @param {number} score - Score to check
     * @returns {Promise<number>} Rank (1-based) or -1 if not in top 10
     */
    async getRank(score) {
        try {
            const response = await fetch(`${this.apiBase}/check`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ score })
            });

            if (response.ok) {
                const result = await response.json();
                return result.rank;
            } else {
                console.error('Failed to get rank from server');
                return this.getRankLocal(score);
            }
        } catch (e) {
            console.error('Error getting rank from server:', e);
            return this.getRankLocal(score);
        }
    }

    /**
     * Get local rank calculation
     * @param {number} score - Score to check
     * @returns {number} Rank (1-based) or -1 if not in top 10
     */
    getRankLocal(score) {
        const leaderboard = this.getLocalLeaderboard();

        for (let i = 0; i < leaderboard.length; i++) {
            if (score >= leaderboard[i].score) {
                return i + 1;
            }
        }

        if (leaderboard.length < this.maxEntries) {
            return leaderboard.length + 1;
        }

        return -1;
    }
}