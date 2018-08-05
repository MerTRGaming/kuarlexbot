const Discord = require('discord.js');
const client = new Discord.Client();
const ayarlar = require('../settings.json');

exports.run = (client, message) => {
  if (message.channel.type !== 'dm') {
    const ozelmesajkontrol = new Discord.RichEmbed()
    .setColor(0x00AE86)
    .setTimestamp()
    .setAuthor(message.author.username, message.author.avatarURL)
    .setDescription('Sunucumuzun Kurallarını Özelden Attım! :postbox: ');
    message.channel.sendEmbed(ozelmesajkontrol) }
	const pingozel = new Discord.RichEmbed()
    .setColor(0x00AE86)
    .setDescription(':loudspeaker: Kurallar: **:no_entry_sign:Reklam Yasak**');
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ['kurallar', 'rules', 'rule', 'kurallar ne', 'kurallarne'],
  permLevel: 0
};

exports.help = {
  name: 'kurallar',
  description: 'Bot, kuralları size özelden dm olarak atar.',
  usage: 'kurallar'
};
