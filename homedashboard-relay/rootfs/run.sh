#!/usr/bin/with-contenv bashio
# HomeDashboard Relay Add-on Run Script

set -e

# Read configuration
PAIRING_CODE=$(bashio::config 'pairing_code')

if [ -z "$PAIRING_CODE" ] && [ ! -f /data/user_id ]; then
    bashio::log.error "Pairing code required. Get one from HomeDashboard app:"
    bashio::log.error "  Settings > Remote Access > HomeDashboard Relay > Set Up"
    bashio::exit.nok
fi

# Export environment
export RELAY_URL="wss://relay.sniper-guard.com"
export PAIRING_CODE="$PAIRING_CODE"
export HA_URL="http://supervisor/core"
export SUPERVISOR_TOKEN="$SUPERVISOR_TOKEN"
export DATA_DIR="/data"

bashio::log.info "Starting HomeDashboard Relay..."
bashio::log.info "Relay URL: $RELAY_URL"

if [ -f /data/user_id ]; then
    bashio::log.info "Already paired, connecting..."
else
    bashio::log.info "Pairing with code: $PAIRING_CODE"
fi

# Start relay client
cd /app
exec node src/index.js
