const { RelayClient } = require('./relay-client');

console.log('[Relay Client] Starting HomeDashboard Relay Client...');

const client = new RelayClient();
client.start().catch(err => {
    console.error('[Relay Client] Fatal error:', err.message);
    process.exit(1);
});

// Handle graceful shutdown
process.on('SIGTERM', () => {
    console.log('[Relay Client] Received SIGTERM, shutting down...');
    client.disconnect();
    process.exit(0);
});

process.on('SIGINT', () => {
    console.log('[Relay Client] Received SIGINT, shutting down...');
    client.disconnect();
    process.exit(0);
});
