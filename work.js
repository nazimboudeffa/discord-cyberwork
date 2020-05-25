const rp = require('request-promise');
class Work {
    constructor(worker, client, channelName='work-test', language){

         this.client = client;
         this.channelName = channelName;
         this.currentWorker = worker;
         this.language = language;

    };

    startWork(){
      return [`Language: ${this.language}\n`];
    }

    getIssue(){

      var issue;
      var random_number = function (min, max) {
          return Math.floor(Math.random() * (max - min + 1)) + min;
      };

      var options = {
        url: 'https://api.github.com/search/issues?q=language:' + encodeURIComponent(this.language) + '+state:open',
        headers: {
          'User-Agent': 'request'
        }
      };

      rp(options, function (error, response, body) {
         if (!error && response.statusCode === 200) {
           return(JSON.parse(body).items[0]);
         }
      })

      console.log(issue);

    }

    getStats(data){
      return [`Issues in ${this.language}: ${JSON.parse(data).total_count}\n`];
    }
}
module.exports = Work;
