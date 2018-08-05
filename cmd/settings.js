exports.run = (client, message, args) => {

    const serverSettings = client.serverSettings.get(message.guild.id);
    
    
    if (!args[0]) {
        const embed = {
            "color": 13632027,
            "author": {
            "name": `Sunucu Ayarları: \`${message.guild.name}\``
            },
            "fields": [
            {
                "name": `Lütfen bunları beğeninize göre değiştirin`,
                "value": `
\`Önek:\` **${serverSettings.prefix}**
\`ModLogKanalı:\` **${serverSettings.modlogchannel}**
\`KurucuRol:\` **${serverSettings.adminrole}**
\`ModeratorRol:\` **${serverSettings.modrole}**
\`ÜyeRol:\` **${serverSettings.memberrole}**
\`BaşlangıçMüzikSesi:\` **${serverSettings.defaultmusicvolume}**
\`OtomatikSıradakiŞarkı:\` **${serverSettings.displaynextsong}**                
`
            }
            ]
        };
        message.channel.send({ embed });
    } else {
        let selector = args[0].toLowerCase();
        let options = args[1];
        updateSettings(client, serverSettings, selector, options, message);
    }
  
}

function updateSettings(client, serverSettings, selector, options, message) {

    serverSettings[selector] = options;
    message.channel.send(`**${selector.toUpperCase()}** güncellendi \`${options.toUpperCase()}\``);
    client.serverSettings.set(message.guild.id, serverSettings);
}

  
exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: [],
    permLevel: 0
};
  
exports.help = {
    name: "ayarlar",
    description: "Sunucu ayarlarını listeleyecek",
    usage: "ayarlar <ayar> <seçenek>"
};
  
