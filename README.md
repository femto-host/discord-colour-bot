## Discord Colour Bot

> Gives random colours to peoples names

### Usage

In order to allow the bot to connect to Discord, you will need to give it a token.  Copy the `config.default.hjson` file to `config.hjson` and populate it with a token for a bot you own.

When first run, you will need to setup the bot to create the required roles to assign people, you can do this with the `createRoleColors` function, e.g. by running the following when the bot is ready:

```javascript
    for (let [guildId, guild] of client.guilds) {
        await createRoleColors(guild, 'light')
    }
```

You will only want to run this once.  After it runs stop the program, remove those lines and restart it.  It will now give random colours to everyone who joins the server (every 60 seconds).