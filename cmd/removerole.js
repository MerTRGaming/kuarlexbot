const Discord = require("discord.js");

module.exports.run = async (bot, message, args) => {

}

exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: ['removerole'],
    permLevel: 0
  };

  exports.help = {
    name: "rolsil",
    description: "Seçilen şarkıyı çalacağım",
    usage: "rolsil <@KullanıcıAdı> <alınacak rol>"
  };
