const fs = require('fs');
const path = require('path');

// Data directory for persistent storage
const DATA_DIR = process.env.DATA_DIR || '/data';

module.exports = {
    // Relay server URL
    relayUrl: process.env.RELAY_URL || 'wss://relay.sniper-guard.com',

    // Pairing code from app
    pairingCode: process.env.PAIRING_CODE || '',

    // User ID (saved after pairing)
    get userId() {
        try {
            const filePath = path.join(DATA_DIR, 'user_id');
            return fs.readFileSync(filePath, 'utf8').trim();
        } catch {
            return null;
        }
    },

    set userId(value) {
        try {
            fs.mkdirSync(DATA_DIR, { recursive: true });
            const filePath = path.join(DATA_DIR, 'user_id');
            fs.writeFileSync(filePath, value);
        } catch (err) {
            console.error('[Config] Failed to save userId:', err.message);
        }
    },

    // Home Assistant connection - use Supervisor API if available
    haUrl: process.env.SUPERVISOR_TOKEN
        ? 'http://supervisor/core'
        : process.env.HA_URL || 'http://localhost:8123',

    haToken: process.env.SUPERVISOR_TOKEN || process.env.HA_TOKEN || ''
};
