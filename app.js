require('dotenv').config();
const Discord = require('discord.js');

const { greetings } = require('./data.json');

const client = new Discord.Client();
const express = require('express')
const app = express()
const ejs = require('ejs')
const path = require('path')

const Work = require('./work.js');

var token = process.env.TOKEN
//var token = process.env.TOKEN
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
let language = 'javascript'
let userJoined = false;

/* User joins the server */
client.on('message', (message) => {

    if (!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).split('!');
    const command = args.shift().toLowerCase();

    if(command === 'join'){

      work = new Work(message.author.username, client, 'work-work'); //Initilizes our work engine
      let myRet = work.startWork(language);
      const embed = new Discord.MessageEmbed()
      .setTitle("Welcome to Let's Code Better Together")
      .setColor(0xFF0000)
      .addField(`${message.author.username} has Joined`, myRet);
      message.channel.send(embed);
      message.channel.send(`${message.author} type w!commands to see the list of commands.`);
      userJoined = true;
      return;

    }

    if(userJoined == true){
        if(command === 'issue'){
          //message.channel.send(work.getIssue(language));
          let issue = work.getIssue(language);
          const embed = new Discord.MessageEmbed()
          .setTitle(issue.title)
          .setColor(0xFF0000)
          .addField(`URL`, issue.html_url);
          message.channel.send(embed);
        }
        else if(command === 'stats'){
          message.channel.send(work.getStats());
        }
    }
});

client.on('ready', () => {
    console.log('Work is now connected to Discord');
});

client.login(token);
