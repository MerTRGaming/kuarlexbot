exports.run = (client, message, args) => {
  const voiceChannel = message.member.voiceChannel ? message.member.voiceChannel : (message.guild.voiceConnection ? message.guild.voiceConnection.channel : null);
  if (!voiceChannel) {
    return message.reply("Bu komutu kullanmak için bir ses kanalında olmalısınız.");
  }

    if (!client.playlists.has(message.guild.id)) return message.channel.send("Hiç müzik çalmıyorum");
    client.playlists.get(message.guild.id).restart = false;
    client.playlists.get(message.guild.id).paused = false;
    let queue = client.playlists.get(message.guild.id);
    queue.songs = [];
    queue.dispatcher.end();
    message.guild.voiceConnection.disconnect();
}

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ['kuyruğutemizle', 'stop', 'durdur'],
  permLevel: 0
};

exports.help = {
  name: "kapat",
  description: "kuyruktaki tüm şarkıları temizler ve bağlantıyı keser",
  usage: "kapat"
};
