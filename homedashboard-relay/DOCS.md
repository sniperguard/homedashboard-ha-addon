# HomeDashboard Relay

Connect your HomeDashboard iOS app to your local Home Assistant from anywhere, without port forwarding or Nabu Casa.

## How It Works

```
Your iPhone          Relay Server           This Add-on
     |                    |                      |
     |------ WSS -------->|<------ WSS ----------|
     |                    |                      |
     |    Encrypted       |     Encrypted        |---> Home Assistant
     |    Connection      |     Connection       |     (local API)
```

1. This add-on connects to the HomeDashboard relay server
2. Your iOS app also connects to the relay server
3. Commands from the app are forwarded through the relay to your Home Assistant
4. All traffic is encrypted end-to-end

## Setup

### Step 1: Get a Pairing Code

1. Open the **HomeDashboard** app on your iPhone
2. Go to **Settings** > **[Your Connection]** > **Remote Access**
3. Select **HomeDashboard Relay** and tap **Set Up**
4. Copy the 6-character pairing code (valid for 15 minutes)

### Step 2: Configure the Add-on

1. Enter the pairing code in the **Configuration** tab
2. Click **Save**

### Step 3: Start the Add-on

1. Go to the **Info** tab
2. Click **Start**
3. Check the **Log** tab to verify connection

### Step 4: Complete Setup in App

1. Return to the HomeDashboard app
2. Tap **Check Connection**
3. Once connected, tap **Done**

## Configuration

| Option | Description |
|--------|-------------|
| `pairing_code` | 6-character code from the HomeDashboard app |

The pairing code is only needed once. After initial pairing, the add-on will automatically reconnect.

## Troubleshooting

### "Pairing code required"
Get a new code from the HomeDashboard app. Codes expire after 15 minutes.

### "Connection failed"
- Check your internet connection
- Restart the add-on
- Check the logs for detailed error messages

### "Relay client not connected" in app
- Make sure this add-on is running (check the Info tab)
- Check the add-on logs for errors

## Privacy & Security

- All traffic is encrypted using TLS/WSS
- The relay server only forwards encrypted traffic
- Your Home Assistant token never leaves your network
- The relay server is operated by SniperGuard LLC

## Support

- [GitHub Issues](https://github.com/sniperguard/homedashboard-ha-addon/issues)
- [HomeDashboard Support](https://sniper-guard.com/contact)
