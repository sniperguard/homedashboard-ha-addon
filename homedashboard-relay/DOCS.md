# AI for Home Assistant - Cloud Relay

Connect your AI for Home Assistant iOS app to your local Home Assistant from anywhere, without port forwarding or Nabu Casa.

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

### One-Tap Setup (Recommended)

If you're running Home Assistant OS or Supervised:

1. Open the **HomeDashboard** app on your iPhone
2. Go to **Settings** > **[Your Connection]** > **Remote Access**
3. Select **HomeDashboard Relay** and tap **Set Up Relay**
4. The app will automatically install and configure this add-on

That's it! The app handles everything automatically.

### Manual Setup

If automatic setup isn't available:

1. Install this add-on from the repository
2. Get your User ID from the AI for Home Assistant app (Settings > Remote Access)
3. Enter the User ID in the **Configuration** tab
4. Click **Save** and **Start**

## Configuration

| Option | Description |
|--------|-------------|
| `user_id` | Your HomeDashboard user ID (set automatically by the app) |

The user ID is set once during setup. After that, the add-on will automatically reconnect.

## Troubleshooting

### "User ID required"
Set up the relay from the AI for Home Assistant app, which will configure the user ID automatically.

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
