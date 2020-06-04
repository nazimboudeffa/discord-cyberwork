const Discord = require('discord.js');

//const { CONFIG_TOKEN } = require('./config.json');
const { greetings } = require('./data.json');

const client = new Discord.Client();
const express = require('express')
const app = express()
const ejs = require('ejs')
const path = require('path')
const rp = require('request-promise');

const Work = require('./work.js');

//var token = CONFIG_TOKEN || process.env.TOKEN
var token = process.env.TOKEN
var port = process.env.PORT || 3000

// set the view engine to ejs
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, '/public'))

app.use(express.static('public'));

app.get('/', function (req, res) {
  res.render('index')
})

app.listen(port, function () {
  console.log('Work app listening on port 3000!')
})

const prefix = 'w!';

let work;
let userJoined = false;
let workChannel = 'work-work';

/* User joins the server */
client.on('message', (message) => {

    if (!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).split(' ');
    const command = args.shift().toLowerCase();

    var actualChannel = message.channel.name

    if(actualChannel != workChannel) {
        message.channel.send(`${message.author} you cannot use a w! command here, please work in #${workChannel}`);
    } else {

      if(command === 'join'){

        if (!args.length) {
          return message.channel.send(`Type : h!join javascript or another language like php or python, ${message.author}`);
        } else {

          work = new Work(message.author.username, client, workChannel, args[0]); //Initilizes our work engine
          let myRet = work.startWork();
          const embed = new Discord.MessageEmbed()
          .setTitle("Welcome to Let's Code Better Together")
          .setColor(0xFF0000)
          .addField(`${message.author.username} has joined`, myRet);
          message.channel.send(embed);
          //message.channel.send(`${message.author} type w!commands to see the list of commands.`);
          userJoined = true;
          return;

        }

      }

      else if(command === 'commands'){

        const exampleEmbed = {
        	color: 0x0099ff,
        	title: 'Work Bot Commands',
        	url: 'https://discord-cyberwork.herokuapp.com',
        	author: {
        		name: 'Work Bot',
        		icon_url: 'https://i.imgur.com/GoDjz2b.jpg',
        		url: 'https://discord-cyberwork.herokuapp.com',
        	},
        	description: 'Somme commands to use to Work in Discord',
        	thumbnail: {
        		url: 'https://i.imgur.com/GoDjz2b.jpg',
        	},
        	fields: [
            {
              name: 'w!join language',
              value: 'Join the GitHub language (optional)',
            },
        		{
        			name: 'w!lang language',
        			value: 'If you want to change the language (not implemented)',
        		},
        		{
        			name: 'w!issue',
        			value: 'Gets an issue on GitHub',
        		},
        		{
        			name: 'w!stats',
        			value: 'To see the stats',
        		},
        	],
        	image: {
        		url: 'https://i.imgur.com/GoDjz2b.jpg',
        	},
        	timestamp: new Date(),
        	footer: {
        		text: 'Eat, Sleep, Code',
        		icon_url: 'https://i.imgur.com/GoDjz2b.jpg',
        	},
        };

        message.channel.send({ embed: exampleEmbed });

      }

      if(userJoined == true){
          if(command === 'issue'){

            var random_number = function (x) {
                return Math.random(x);
            };

            var options = {
              url: 'https://api.github.com/search/issues?q=language:' + encodeURIComponent(work.language) + '+state:open',
              headers: {
                'User-Agent': 'request'
              }
            };

            rp(options, function (error, response, body) {
               if (!error && response.statusCode === 200) {

                 //TODO understand why it doesn't work when I pass it the the Work class

                 const embed = new Discord.MessageEmbed()
                 .setTitle(JSON.parse(body).items[0].title)
                 .setColor(0xFF0000)
                 .addField(`URL`, JSON.parse(body).items[0].html_url);
                 message.channel.send(embed);

               }
            })

          }

          else if(command === 'stats'){
            var options = {
              url: 'https://api.github.com/search/issues?q=language:' + encodeURIComponent(work.language) + '+state:open',
              headers: {
                'User-Agent': 'request'
              }
            };

            rp(options, function (error, response, body) {
               if (!error && response.statusCode === 200) {
                 message.channel.send(work.getStats(body));
               }
            })
          }

          else if(command === 'leave'){
              let tempLeave = message.author.username;
              message.channel.send([`${tempLeave} has left the Work.`]);
              userJoined = false;
          }

          else if(command === 'issues'){
            let issues

            var options = {
              url: 'https://api.github.com/search/issues?q=language:' + encodeURIComponent(work.language) + '+state:open',
              headers: {
                'User-Agent': 'request'
              }
            };

            rp(options, function (error, response, body) {
               if (!error && response.statusCode === 200) {
                 issues = JSON.parse(body).total_count;
                 console.log(issues);
                 message.channel.send([`There is ${issues} open issues in ${work.language}`]);
               }
            })
          }
      }
    }
});

client.on('ready', () => {
    console.log('Work is now connected to Discord');
});

client.login(token);
