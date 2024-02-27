# Notifiarr NodeBot

This is the production Notifiarr bot used on Discord. This bot handles all the chat binds and sends
them to the website (different code) where they're parsed, processed and actioned. We run one nodebot
instance for the main Notifiarr bot (with many shards), and one instance for each custom bot.

You may run this bot yourself via Docker if you wish to 
[use a custom bot](https://notifiarr.wiki/en/Website/Discord/CustomBot) in your Discord server.


## .env

```env
BOT_TOKEN=            # Token for the bot that is sent to discord for notifications to be sent from (required)
USER_API_KEY=         # Notifiarr apikey for the user running the bot (required)
DEV_DISCORD_USERS=    # List of dicord ids the bot will listen to when testing = true (optional)

NOTIFIARR_API_URL=    # Notifiarr API path for webhooks to be sent to (required)
BETTER_UPTIME_URL=    # Betteruptime heartbeat url for uptime checking (optional)
CRONITOR_URL=         # Cronitor heartbeat url for uptime checking (optional)

WEBHOOKS=             # Send webhooks to the Notifiarr
TESTING=              # Testing bot
LOG_LEVEL=            # Set how much output you want. Use one of: 'error', 'warn', 'info', 'http', 'verbose', 'debug', 'silly'
LOG_PATH="logs"       # The path where log files are output, default is logs folder relative to the running application, otherwise a full path should be used
UP_PING=              # Send uptime pings to Betteruptime or Cronitor
SC_PING=              # Send server count information to Notifiarr for this bot token
UPTIME_DELAY=         # How long to wait between uptime pings
COUNT_DELAY=          # How long to wait between sending user counts
```

## Usage

The container is looking for the above environment variables so it knows what token to start the bot with and what user it belongs to
