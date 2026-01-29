#!/usr/bin/with-contenv bashio
# HomeDashboard Relay Add-on Run Script

set -e

# Read configuration - user_id is passed directly from iOS app
USER_ID=$(bashio::config 'user_id')

if [ -z "$USER_ID" ] && [ ! -f /data/user_id ]; then
    bashio::log.error "User ID required. Set up relay from HomeDashboard app:"
    bashio::log.error "  Settings > Remote Access > HomeDashboard Relay"
    bashio::exit.nok
fi

# Save user_id to persistent storage if provided in config
if [ -n "$USER_ID" ]; then
    echo "$USER_ID" > /data/user_id
    bashio::log.info "User ID configured"
fi

# Export environment
export RELAY_URL="wss://relay.sniper-guard.com"
export HA_URL="http://supervisor/core"
export SUPERVISOR_TOKEN="$SUPERVISOR_TOKEN"
export DATA_DIR="/data"

bashio::log.info "Starting HomeDashboard Relay..."
bashio::log.info "Relay URL: $RELAY_URL"

# Start relay client
cd /app
exec node src/index.js
