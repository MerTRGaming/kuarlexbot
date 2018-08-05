const Discord = require("discord.js");
const settings = require("../settings.json");
const red = settings.red;
const green = settings.green;
const orange = settings.orange;

module.exports.run = async (bot, message, args) => {

    if(args[0] == "help"){
      message.reply("Kullanım: .şikayet <kullanıcı> <sebep>");
      return;
    }
    let rUser = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
    if(!rUser) return message.channel.send("Kullanıcı bulunamadı yada isim ve sebep yazılmadı.");
    let rreason = args.join(" ").slice(22);

    let reportEmbed = new Discord.RichEmbed()
    .setDescription("Şikayetler")
    .setColor(orange)
    .addField("Şikayet Edilen Kullanıcı", `${rUser} with ID: ${rUser.id}`)
    .addField("Şikayet Eden", `${message.author} with ID: ${message.author.id}`)
    .addField("Kanal", message.channel)
    .addField("Zaman", message.createdAt)
    .addField("Sebep", rreason);

    let reportschannel = message.guild.channels.find(`name`, "şikayetler");
    if(!reportschannel) return message.channel.send("şikayetler adlı kanal bulunamadı.");


    message.delete().catch(O_o=>{});
    reportschannel.send(reportEmbed);

}

exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: ['report'],
    permLevel: 0
  };

  exports.help = {
    name: "şikayet",
    description: "Seçilen şarkıyı çalacağım",
    usage: "şikayet <Kullanıcı> <Sebep>"
  };
