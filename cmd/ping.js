exports.run = (client, message, args) => {

    message.channel.send(`Gecikme durumum ${new Date().getTime() - message.createdTimestamp}ms` + `. API Gecikmesi ${Math.round(client.ping)}ms`);
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ['lag'],
  permLevel: 0
};

exports.help = {
  name: "ping",
  description: "Bağlantınızı botla test edecek.",
  usage: "ping"
};
