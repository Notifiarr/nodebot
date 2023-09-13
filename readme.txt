This setup can handle custom bot tokens based on user files. If a bot token is added to a user on the site it automatically makes a file:
    /notifiarr-bots/user/<user-id>.json

This file contains the user apikey and bot token. Once a custom bot is added, it needs started
    service bot-users@<user-id> start
        The unit file for this is node notifiarr.js % and is not sharded

The configured user file for the live bot runs a sharded service
    service bot-users start
        The unit file for this is node index.js because it is sharded since it is over 2500 servers and that is required by discord
        index.js controls the sharding automatically
        discord.js shards every 1000 servers

The json file format is
{
    "botToken": "<discord-bot-token>", 
    "apikey": "<notifiarr-user-apikey>"
}

//---------------------------// TESTING //---------------------------//
cd /notifiarr-bots/testing
    node index.js
        This will use sharding just like the main bot does
        Make sure values are set properly in the top of the tester.js