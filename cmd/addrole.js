const Discord = require("discord.js");

module.exports.run = async (bot, message, args) => {

//!addrole @mert <role here>
  if(!message.member.hasPermission("MANAGE_MEMBERS")) return message.reply("Sorry pal, you can't do that.")
  let rmember = message.guild.member(message.mentions.users.first()) || message.guild.members.get(args[0]);
  if(!rMember) return message.reply("Couldn't find that user, yo.");
  let role = args.join(" ").slice(22);
  if(!role) return message.reply("Specify a role!");
  let gRole = message.guild.roles.find(`name`, role);
  if(!gRole) return message.reply("Couldn't find that role.");

  if(rMember.roles.has(gRole.id));
  await(rMember.addRole(gRole.id));

  try{
    rMember.send(`Congrats, you have has been given the role ${gRole.name}`)
  }catch(e){
    message.channel.send(`Congrats to <@${rMember.id}>, they have you have has been given the role ${gRole.name}. We tried to DM them, but their DMs are locked. `)
  }
}

exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: ['rolekle'],
    permLevel: 0
  };

  exports.help = {
    name: "rolekle",
    description: "Seçilen şarkıyı çalacağım",
    usage: "rolekle <@KullanıcıAdı> <rol> "
  };
