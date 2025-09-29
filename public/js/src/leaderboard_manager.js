/**
 * LeaderboardManager class.
 * Manages leaderboard operations including saving and retrieving scores.
 * @type {LeaderboardManager}
 */

class LeaderboardManager {
    constructor() {
        this.maxEntries = 10;
        this.storageKey = 'dino3d_leaderboard';
    }

    /**
     * Get all leaderboard entries sorted by score (highest first)
     * @returns {Array} Array of {name, score, date} objects
     */
    getLeaderboard() {
        try {
            const data = localStorage.getItem(this.storageKey);
            if (!data) {
                return [];
            }
            return JSON.parse(data);
        } catch (e) {
            console.error('Error loading leaderboard:', e);
            return [];
        }
    }

    /**
     * Add a new score to the leaderboard
     * @param {string} name - Player name
     * @param {number} score - Player score
     * @returns {boolean} True if score was added to top 10
     */
    addScore(name, score) {
        if (!name || name.trim() === '') {
            name = 'Anonymous';
        }

        const leaderboard = this.getLeaderboard();
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
                // Score is not better, don't update
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
            console.error('Error saving to leaderboard:', e);
            return false;
        }
    }

    /**
     * Check if a score qualifies for the leaderboard
     * @param {number} score - Score to check
     * @returns {boolean} True if score qualifies
     */
    isTopScore(score) {
        const leaderboard = this.getLeaderboard();

        if (leaderboard.length < this.maxEntries) {
            return true;
        }

        const lowestScore = leaderboard[leaderboard.length - 1].score;
        return score > lowestScore;
    }

    /**
     * Clear all leaderboard entries
     */
    clearLeaderboard() {
        try {
            localStorage.removeItem(this.storageKey);
        } catch (e) {
            console.error('Error clearing leaderboard:', e);
        }
    }

    /**
     * Get player's rank for a given score
     * @param {number} score - Score to check
     * @returns {number} Rank (1-based) or -1 if not in top 10
     */
    getRank(score) {
        const leaderboard = this.getLeaderboard();

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