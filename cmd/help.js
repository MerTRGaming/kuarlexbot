exports.run = (client, message, args) => {
    if (!args[0]) {
      const embed = {
      "description": "Bu, tüm komutlarımın tam listesi.",
      "color": 1666666,
      "footer": {
        "text": `Ek komut kullanımı için, ${client.serverSettings.get(message.guild.id).prefix}yardım <komut>`
      },
      "author": {
        "name": "Yardım Menüsü",
      },
      "fields": [
        {
          "name": "Müzik Komutları",
          "value": "`oynat` `çağır` `kapat` `kuyruk`"
        },
	{ "name": "Üye Komutları",
	  "value": "`ping` `yardım` `sunucubilgi` `avatarım` `bilgi` `botbilgi` `davet` `kullanıcıbilgim` `sunucuresmi`",
	},
        {
          "name": "Yönetici Komutları",
          "value": "`ayarlar` `ban` `kick` `oylama` `load` `reboot` `reload` `sustur` `temizle` `unban` `unload` `uyar` `yaz`",
	},
	{ 
	  "name": "Eğlence Komutları",
	  "value": "`banned` `herkesebendençay` `koş` `yumrukat` `çayaşekerat` `çayiç` `çekiç`"
        }
      ]
    };
    message.channel.send({ embed });
  } else {
    let command = args[0];
    if(client.commands.has(command)) {
      command = client.commands.get(command);
      const embed = {
        "color": 1666666,
        "author": {
          "name": `Komut: \`${command.help.name}\``,
        },
        "fields": [
          {
            "name": `Gereken izin seviyesi`,
            "value": `${command.conf.permLevel}`
          },
          {
            "name": "Açıklama",
            "value": `${command.help.description}`
          },
          {
            "name": "Kullanım",
            "value": `${command.help.usage}`
          }
        ]
      };
      message.channel.send({ embed });
    }
  }
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ['komutlar'],
  permLevel: 0
};

exports.help = {
  name : "yardım",
  description: "Tüm mevcut komutları listeleyecek",
  usage: "yardım [komut]"
};
