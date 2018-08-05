const Discord = require('discord.js');
const client = new Discord.Client();

exports.run = async (client, message, args) => {
    if(message.guild.voiceConnection){
        message.guild.voiceConnection.dispatcher.end();
    }else{
        message.channel.send('Bot oda aramasında değil!')
    }
}

exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: ['skip'],
    permLevel: 0
};

exports.help = {
    name: "atla",
    description: 'Şarkıyı atlatır.',
    usage: 'atla'
};
