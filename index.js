const Discord = require('discord.js')
const randomColor = require('randomcolor')
const config = require('@femto-host/config')
const client = new Discord.Client()

const pause = time => new Promise(resolve => setTimeout(resolve, time))

function countRoles(guild) {
    let count = 0

    for (let [roleId, role] of guild.roles) {
        count += 1
    }

    return count
}

function createRole(guild, name, color) {
    return guild.createRole({
        name, color,
        mentionable: false,
        position: countRoles(guild) - 8
    })
}

async function undoLightRoles(guild) {
    for (let [memberId, member] of guild.members) {
        for (let [roleId, role] of member.roles) {
            if (role.name.startsWith('Light')) {
                console.log(`removing ${roleId}, ${role.name} from ${member.user.username}`)
                await pause(300)
                member.removeRole(roleId)
            }
        }
    }
}

async function createRoleColors(guild, colour) {
    if (colour === 'light') {
        const colours = randomColor({ luminosity: colour, count: 16 })

        let count = 0
        for (let color of colours) {
            count += 1
            await createRole(guild, `Light-${count}`, color)
        }
        // console.log(colours)
    }
}

async function updateUsers() {
    for (let [guildId, guild] of client.guilds) {
        const colourRoles = []
        const colourRoleIds = []

        for (let [roleId, role] of guild.roles) {
            if (role.name.startsWith('Light')) {
                colourRoles[Number(role.name.split('-')[1]) - 1] = [roleId, role]
                colourRoleIds[Number(role.name.split('-')[1]) - 1] = roleId
            }
        }

        memberLoop: for (let [memberId, member] of guild.members) {
            for (let [roleId, role] of member.roles) {
                // console.log(colourRoleIds, roleId)
                if (colourRoleIds.includes(roleId)) {
                    continue memberLoop
                }
            }

            // only reaches if not in any colour role.
            console.log(`Adding light colour role to ${member.user.username}`)
            member.addRole(colourRoles[Math.floor(Math.random() * colourRoles.length)][1])

            await pause(2000)
        }
    }
}

client.on('ready', async () => {
    console.log(`Logged in as ${client.user.tag}!`)

    for (let [guildId, guild] of client.guilds) {
        // await createRoleColors(guild, 'light')
        // await undoLightRoles(guild)
    }

    
    updateUsers()
    setInterval(updateUsers, 60000)
})

client.on('message', msg => {
    if (msg.content === 'ping') {
        msg.reply('Pong!')
    }
})

client.on('error', error => {
    console.error('The WebSocket encountered an error:', error);
});

client.login(config.get('discord.token'));