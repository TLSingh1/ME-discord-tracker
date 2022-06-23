const { Client, Intents } = require('discord.js')
const axios = require("axios")
const WOKCommands = require('wokcommands')
const path = require('path')
const dotenv = require('dotenv')
dotenv.config()

const client = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES]
})

client.on('ready', async () => {
  const guild = await client.guilds.fetch(process.env.GUILD_ID)

  const LAMPORTS_PER_SOL = 1000000000
  const floor = 'floor'
  const url = 'https://api-mainnet.magiceden.dev/v2/collections/fatcats_capital/stats'

  setInterval(async () => {
    const { data } = await axios.get(url)
    const floorPrice = data.floorPrice / LAMPORTS_PER_SOL
    guild.me.setNickname(`${floor.toUpperCase()}: ${floorPrice} SOL`)
  }, 60000 * 5);

  let last24Prices = []
  let pointer = 0
  
  console.log("The bot is on")

  setInterval(async () => {
    const { data } = await axios.get(url)
    const floorPrice = data.floorPrice / LAMPORTS_PER_SOL
    
    if (last24Prices[pointer]) {
      let percentChange = ((floorPrice/last24Prices[pointer] -1) * 100).toFixed(2)
      last24Prices[pointer] = floorPrice
      
      client.user?.setPresence({
        status: "online",
        activities: [
          {
            name: `${percentChange}%`,
            type: "PLAYING",
          },
        ],
      })
      if (pointer === 23 ) {
        pointer = 0;
      } else {
        pointer+=1;
      }
    } else {
      last24Prices[pointer] = floorPrice
      if (pointer === 23 ) {
        pointer = 0;
      } else {
        pointer+=1;
      }
    }
  }, 60000 * 60)

  new WOKCommands(client, {
    commandsDir: path.join(__dirname, 'commands'),
    testServers: [process.env.GUILD_ID]
  })
})

client.login(process.env.TOKEN)
