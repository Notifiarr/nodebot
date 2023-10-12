# Notifiarr NodeBot

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
UP_PING=              # Send uptime pings to Betteruptime or Cronitor
SC_PING=              # Send server count information to Notifiarr for this bot token
UPTIME_DELAY=         # How long to wait between uptime pings
COUNT_DELAY=          # How long to wait between sending user counts
```

## Usage

The container is looking for the above environment variables so it knows what token to start the bot with and what user it belongs to
