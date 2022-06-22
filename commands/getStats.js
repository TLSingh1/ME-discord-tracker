const {MessageEmbed} = require('discord.js')
const axios = require('axios')

module.exports = {
  category: "Stats",
  description: "Get stats",

  slash: 'both',
  testOnly: true,

  callback: async ({ message, text }) => {
    const LAMPORTS_PER_SOL = 1000000000
    const url = 'https://api-mainnet.magiceden.dev/v2/collections/fatcats_capital/stats'

    const { data } = await axios.get(url)
    let { floorPrice, listedCount, avgPrice24hr, volumeAll } = data
    floorPrice = floorPrice/LAMPORTS_PER_SOL
    avgPrice24hr = avgPrice24hr/LAMPORTS_PER_SOL
    volumeAll = volumeAll/LAMPORTS_PER_SOL

    const embed = new MessageEmbed()
      .setColor('DARK_PURPLE')
      .setTitle('FatCats Capital Stats')
      .setURL('https://magiceden.io/marketplace/fatcats_capital')
      .setAuthor({
        name: 'Robo Cat',
        iconURL: 'https://cdn.discordapp.com/icons/889310368093057044/41731e1bb9a35c01e804dcf10c37ac19.webp?size=128',
        url: 'https://fatcatscapital.com/'
      })
      .addFields([
        {
          name: 'Floor Price',
          value: `${floorPrice.toFixed(2)} SOL`,
        },
        {
          name: 'Listed Count',
          value: JSON.stringify(listedCount)
        },
        {
          name: 'Average Price Last 24H',
          value: `${avgPrice24hr.toFixed(2)} SOL`
        },
        {
          name: 'Total Volume',
          value: `${volumeAll.toFixed(2)} SOL`
        }
      ])
    return embed
  }
}