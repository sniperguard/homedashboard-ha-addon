const WebSocket = require('ws');
const fetch = require('node-fetch');
const config = require('./config');

class RelayClient {
    constructor() {
        this.ws = null;
        this.userId = config.userId;
        this.reconnectDelay = 1000;
        this.maxReconnectDelay = 60000;
        this.shouldReconnect = true;
    }

    async start() {
        // If no userId saved, validate pairing code first
        if (!this.userId) {
            await this.validatePairing();
        }

        this.connect();
    }

    async validatePairing() {
        if (!config.pairingCode) {
            throw new Error('No pairing code configured. Set PAIRING_CODE environment variable.');
        }

        console.log('[Relay] Validating pairing code...');

        const httpUrl = config.relayUrl.replace('wss://', 'https://').replace('ws://', 'http://');
        const response = await fetch(`${httpUrl}/pairing/validate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ pairingCode: config.pairingCode })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(`Pairing failed: ${error.error}`);
        }

        const data = await response.json();
        this.userId = data.userId;

        // Save userId for reconnection
        config.userId = this.userId;

        console.log('[Relay] Pairing successful, userId:', this.userId.substring(0, 8) + '...');
    }

    connect() {
        if (!this.shouldReconnect) return;

        console.log('[Relay] Connecting to relay server...');

        const url = `${config.relayUrl}/ws?role=client&userId=${this.userId}`;
        this.ws = new WebSocket(url);

        this.ws.on('open', () => {
            console.log('[Relay] Connected to relay server');
            this.reconnectDelay = 1000;
        });

        this.ws.on('message', async (data) => {
            try {
                const message = JSON.parse(data.toString());
                await this.handleMessage(message);
            } catch (e) {
                console.error('[Relay] Message error:', e);
            }
        });

        this.ws.on('close', (code, reason) => {
            console.log(`[Relay] Disconnected (${code}), reconnecting in ${this.reconnectDelay}ms...`);
            if (this.shouldReconnect) {
                setTimeout(() => this.connect(), this.reconnectDelay);
                this.reconnectDelay = Math.min(this.reconnectDelay * 2, this.maxReconnectDelay);
            }
        });

        this.ws.on('error', (error) => {
            console.error('[Relay] WebSocket error:', error.message);
        });
    }

    disconnect() {
        this.shouldReconnect = false;
        if (this.ws) {
            this.ws.close();
            this.ws = null;
        }
    }

    async handleMessage(message) {
        switch (message.type) {
            case 'connected':
                console.log('[Relay] Connection confirmed');
                break;

            case 'ha_request':
                await this.proxyHARequest(message);
                break;

            case 'ping':
                this.ws.send(JSON.stringify({ type: 'pong', id: message.id }));
                break;
        }
    }

    async proxyHARequest(message) {
        const { requestId, method, endpoint, body } = message;

        console.log(`[Relay] Proxying ${method} ${endpoint}`);

        try {
            const url = `${config.haUrl}/api/${endpoint}`;
            const response = await fetch(url, {
                method: method || 'GET',
                headers: {
                    'Authorization': `Bearer ${config.haToken}`,
                    'Content-Type': 'application/json'
                },
                body: body ? JSON.stringify(body) : undefined
            });

            let data;
            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
                data = await response.json().catch(() => ({}));
            } else {
                data = {};
            }

            this.ws.send(JSON.stringify({
                type: 'ha_response',
                requestId,
                status: response.status,
                data
            }));
        } catch (error) {
            console.error(`[Relay] Proxy error:`, error.message);
            this.ws.send(JSON.stringify({
                type: 'ha_response',
                requestId,
                status: 500,
                error: error.message
            }));
        }
    }
}

module.exports = { RelayClient };
