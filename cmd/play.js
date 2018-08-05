const Discord = require("discord.js");
const config = require("../settings.json");
const ytdl = require("ytdl-core");
const ytapi = require("simple-youtube-api");
const youtube = new ytapi(config.YTAPI);


exports.run = async (client, message, args) => {
    const voiceChannel = message.member.voiceChannel;
    if (!voiceChannel) return message.channel.send("Üzgünüm, ama şarkı söylemek için ses kanalında olmalısın.");
    const permissions = voiceChannel.permissionsFor(message.client.user);
    if (!permissions.has("CONNECT")) return message.channel.send("Ses kanalına bağlanamıyorum, lütfen doğru izinlere sahip olduğumdan emin olun.");
    if(!permissions.has("SPEAK")) return message.channel.send("Bu ses kanalında konuşamıyorum, lütfen doğru izinlere sahip olduğumdan emin olun.");
    const serverQueue = client.playlists.get(message.guild.id);
    let songRequest = args.join(" ");
    let index = 0;
    let song = null;
    let serverInfo = null;
    let videoIndex = 1;

    try {
        serverInfo = await youtube.searchVideos(songRequest, 5);
    } catch (err) {
        message.channel.send("Lütfen geçerli bir youtube bağlantısı sağlayın");
    }
    if (!songRequest.includes("playlist")) {

        if (!songRequest.includes("https")) {

            const embed = {
                "color": 13632027,
                "author": {
                "name": "Şarkı Seçimi. "
                },
                "footer": {
                    "text": `Bu 30 saniye içinde zaman aşımı olacaktır. Aramayı iptal etmek için iptal yazın.`
                },
                "fields": [
                {
                    "name": `1 ile 5 arasında bir sayı yazın.`,
                    "value": `${serverInfo.map(songSelection => `**${++index}** - **${songSelection.title.substring(0, 50)}**`).join("\n")}`
                }
                ]
            };
            message.channel.send({ embed });

            try {
                var response = await message.channel.awaitMessages(msg2 => msg2.content > 0 && msg2.content < 6 || msg2.content == "iptal", {
                    maxMatches: 1,
                    time: 30000,
                    error: ['time']
                });
            } catch(err) {
                message.channel.send(`Hiçbir değer verilmedi, aramayı iptal etti`);
            }

            if (response.first().content == "iptal") return message.channel.send(`Arama iptal edildi`);

            videoIndex = parseInt(response.first().content);
    }


        song = await searchVideos(serverInfo, videoIndex, message);
    }



    if(!client.playlists.has(message.guild.id)) {

        client.playlists.set(message.guild.id, {
            loading: false,
            restart: false,
            dispatcher: null,
            textChannel: message.channel,
            voiceChannel: voiceChannel,
            connection: null,
            songs: [],
            volume: client.serverSettings.get(message.guild.id).defaultmusicvolume,
            playing: true,
            paused: false,
            playlist: false
        });


        if (!songRequest.includes("playlist")) {
            client.playlists.get(message.guild.id).songs.push(song);
        }

        if (songRequest.includes("playlist")) {

            try {
                var connection = await voiceChannel.join();
                client.playlists.get(message.guild.id).connection = connection;
                return playlist(client, message, message.guild, songRequest);
            } catch (err) {
                client.playlists.delete(message.guild.id);
                console.log(`Bir hata oluştu: ${err}`);
            }

        }
        try {
            var connection = await voiceChannel.join();
            message.channel.send(`Katılıyor **${voiceChannel.name}**`);
            client.playlists.get(message.guild.id).connection = connection;
            play(client, message, message.guild, client.playlists.get(message.guild.id).songs[0]);
        } catch (err) {
            client.playlists.delete(message.guild.id);
            console.log(`There was an error: ${err}`);
        }


    } else {
        if (songRequest.includes("playlist")) return playlist(client, message, message.guild, songRequest);
        client.playlists.get(message.guild.id).songs.push(song);
        message.channel.send(`**${song.songTitle} (${song.hours}:${song.minutes}:${song.seconds})** sıraya eklendi`)
    }


}

async function searchVideos(serverInfo, videoIndex, message) {
    const duration = await youtube.getVideoByID(serverInfo[videoIndex - 1].id);

    song = {
        songTitle: serverInfo[videoIndex - 1].title,
        url: `https://youtube.com/watch?v=${serverInfo[videoIndex - 1].id}`,
        playTimeSeconds: duration.duration,
        hours: duration.duration.hours,
        requester: message.guild.member(message.author).displayName,
        minutes: duration.duration.minutes,
        seconds: duration.duration.seconds
    };
    return song;
}


async function playlist(client, message, guild, songRequest) {
    const playlist = await youtube.getPlaylist(songRequest);
    const videos = await playlist.getVideos();
    client.playlists.get(message.guild.id).loading = true;
    if (videos.length > 300) {
        message.channel.send(`Playlist limit is 300 songs or less, your playlist is ${videos.length}`);
        message.guild.voiceConnection.disconnect();
        client.playlists.delete(message.guild.id);
        return;
    }
    message.channel.send(`Bulundu ve eklendi \`${videos.length}\` gelen şarkılar \`${playlist.title}\` **NOT** Bu biraz zaman alacak`);
    for (var i = 0; i < videos.length; i++) {
        const duration = await youtube.getVideoByID(videos[i].id);
        client.playlists.get(message.guild.id).songs.push({

        songTitle: videos[i].title,
        url: `https://youtube.com/watch?v=${videos[i].id}`,
        playTimeSeconds: duration.duration,
        requester: message.guild.member(message.author).displayName,
        hours: duration.duration.hours,
        minutes: duration.duration.minutes,
        seconds: duration.duration.seconds

        });
    }

    if (client.playlists.get(message.guild.id).playlist === true) return;
    client.playlists.get(message.guild.id).playlist = true;
    setTimeout(() => {
       play(client, message, guild, client.playlists.get(message.guild.id).songs[0]);
    }, 500);
}

function play(client, message, guild, song) {
    const serverQueue = client.playlists.get(guild.id);

    if (!song) {
        client.playlists.get(message.guild.id).voiceChannel.leave();
        client.playlists.delete(message.guild.id);
        return message.channel.send("Kuyruk Sona Erdi");
    }
    client.playlists.get(message.guild.id).loading = false;

    const dispatcher = serverQueue.connection.playStream(ytdl(`${song.url}`));
    client.playlists.get(message.guild.id).dispatcher = dispatcher;
    dispatcher.setVolume(client.playlists.get(message.guild.id).volume / 100);
    if (client.playlists.get(message.guild.id).playlist == false) client.playlists.get(message.guild.id).playlist = true;

    if (client.playlists.get(message.guild.id).restart === true && client.serverSettings.get(message.guild.id).displaynextsong === true) message.channel.send(`Tekrar Oynatılıyor **${song.songTitle} (${song.hours}:${song.minutes}:${song.seconds})** - **${song.requester}** Tarafından istendi`);
    if (client.playlists.get(message.guild.id).restart === false && client.serverSettings.get(message.guild.id).displaynextsong === true) message.channel.send(`Oynatılıyor **${song.songTitle} (${song.hours}:${song.minutes}:${song.seconds})** - **${song.requester}** Tarafından istendi`);

    dispatcher.on("end", () => {
        if (client.playlists.get(message.guild.id).restart === true) {
            setTimeout(() => {
             play(client, message, guild, client.playlists.get(message.guild.id).songs[0]);
            }, 500);
            return
        }

        client.playlists.get(message.guild.id).songs.shift();
        setTimeout(() => {
             play(client, message, guild, client.playlists.get(message.guild.id).songs[0]);
        }, 500);

    });


}

exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: ['play'],
    permLevel: 0
  };

  exports.help = {
    name: "oynat",
    description: "Seçilen şarkıyı çalacağım",
    usage: "oynat <URL/ŞARKI/OYNATMALISTESI>"
  };