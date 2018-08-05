exports.run = async (client, message, args) => {
    const voiceChannel = message.member.voiceChannel;
    try {
        await voiceChannel.join();
        message.channel.send(`Başarıyla katıldı: **__${voiceChannel.name}__**`);
    } catch (err) {
        message.channel.send(`Ses kanalınıza katılamadım`);        
    }
}

exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: ['join'],
    permLevel: 0
  };
  
  exports.help = {
    name: "çağır",
    description: "Bu komutu sesli kanala gönderen kullanıcıya bağlanacağım",
    usage: "çağır"
  };