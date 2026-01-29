const fs = require('fs');
const path = require('path');

// Data directory for persistent storage
const DATA_DIR = process.env.DATA_DIR || '/data';

module.exports = {
    // Relay server URL
    relayUrl: process.env.RELAY_URL || 'wss://relay.sniper-guard.com',

    // User ID (set by iOS app via Supervisor API)
    get userId() {
        try {
            const filePath = path.join(DATA_DIR, 'user_id');
            return fs.readFileSync(filePath, 'utf8').trim();
        } catch {
            return null;
        }
    },

    // Home Assistant connection - use Supervisor API if available
    haUrl: process.env.SUPERVISOR_TOKEN
        ? 'http://supervisor/core'
        : process.env.HA_URL || 'http://localhost:8123',

    haToken: process.env.SUPERVISOR_TOKEN || process.env.HA_TOKEN || ''
};
