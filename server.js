const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;
const LEADERBOARD_FILE = path.join(__dirname, 'leaderboard.json');

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('dist')); // Serve built files

// Initialize leaderboard file if it doesn't exist
async function initializeLeaderboard() {
    try {
        await fs.access(LEADERBOARD_FILE);
    } catch (error) {
        // File doesn't exist, create it with empty array
        await fs.writeFile(LEADERBOARD_FILE, JSON.stringify([]));
        console.log('Created leaderboard.json file');
    }
}

// Read leaderboard from file
async function readLeaderboard() {
    try {
        const data = await fs.readFile(LEADERBOARD_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading leaderboard:', error);
        return [];
    }
}

// Write leaderboard to file
async function writeLeaderboard(leaderboard) {
    try {
        await fs.writeFile(LEADERBOARD_FILE, JSON.stringify(leaderboard, null, 2));
        return true;
    } catch (error) {
        console.error('Error writing leaderboard:', error);
        return false;
    }
}

// API Routes

// Get leaderboard
app.get('/api/leaderboard', async (req, res) => {
    try {
        const leaderboard = await readLeaderboard();
        res.json(leaderboard);
    } catch (error) {
        res.status(500).json({ error: 'Failed to read leaderboard' });
    }
});

// Add score to leaderboard
app.post('/api/leaderboard', async (req, res) => {
    try {
        const { name, score } = req.body;

        if (!name || typeof score !== 'number') {
            return res.status(400).json({ error: 'Name and score are required' });
        }

        const leaderboard = await readLeaderboard();
        const trimmedName = name.trim() || 'Anonymous';
        const maxEntries = 10;

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
                return res.json({ success: false, message: 'Score not improved' });
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
        const topEntries = leaderboard.slice(0, maxEntries);

        // Save to file
        const success = await writeLeaderboard(topEntries);

        if (success) {
            res.json({ success: true, leaderboard: topEntries });
        } else {
            res.status(500).json({ error: 'Failed to save leaderboard' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Clear leaderboard (for admin/easter egg)
app.delete('/api/leaderboard', async (req, res) => {
    try {
        const success = await writeLeaderboard([]);
        if (success) {
            res.json({ success: true });
        } else {
            res.status(500).json({ error: 'Failed to clear leaderboard' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Check if score qualifies for leaderboard
app.post('/api/leaderboard/check', async (req, res) => {
    try {
        const { score } = req.body;

        if (typeof score !== 'number') {
            return res.status(400).json({ error: 'Score is required' });
        }

        const leaderboard = await readLeaderboard();
        const maxEntries = 10;

        let qualifies = false;
        let rank = -1;

        if (leaderboard.length < maxEntries) {
            qualifies = true;
        } else {
            const lowestScore = leaderboard[leaderboard.length - 1].score;
            qualifies = score > lowestScore;
        }

        // Calculate rank
        for (let i = 0; i < leaderboard.length; i++) {
            if (score >= leaderboard[i].score) {
                rank = i + 1;
                break;
            }
        }

        if (rank === -1 && leaderboard.length < maxEntries) {
            rank = leaderboard.length + 1;
        }

        res.json({ qualifies, rank });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Serve the game (fallback for client-side routing)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Start server
async function startServer() {
    await initializeLeaderboard();
    app.listen(PORT, () => {
        console.log(`🚀 Server running on port ${PORT}`);
        console.log(`📊 Leaderboard data will be saved to: ${LEADERBOARD_FILE}`);
    });
}

startServer().catch(console.error);