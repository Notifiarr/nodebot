config.json
-------------------------
{
	"botToken": "", //-- Token for the bot that is sent to discord for notifications to be sent from (required)
	"userApikey": ", //-- Notifiarr apikey for the user running the bot (required)
	"devDiscordUsers": [], //-- List of dicord ids the bot will listen to when testing = true (optional)

	"notifiarrApiURL": "", //-- Notifiarr API path for webhooks to be sent to (required)
	"betterUptimeURL": "", //-- Betteruptime heartbeat url for uptime checking (optional)
	"cronitorURL": "", //-- Cronitor heartbeat url for uptime checking (optional)

	"webhooks": true, //-- Send webhooks to the Notifiarr
	"testing": true, //-- Testing bot
	"debug": true, //-- Output information to the console
	"upPing": false, //-- Send uptime pings to Betteruptime or Cronitor
	"scPing": false, //-- Send server count information to Notifiarr for this bot token
	"uptimeDelay": 4, //-- How long to wait between uptime pings
	"countDelay": 10 //-- How long to wait between sending user counts
}

Usage
-------------------------
The container is looking for a config.json in root so it knows what token to start the bot with and what user it belongs to
