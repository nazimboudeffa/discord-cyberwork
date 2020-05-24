const request = require("request");

class Work {
    constructor(worker, client, channelName='work-test'){
         this.client = client;
         this.channelName = channelName;
         this.currentWorker = worker;
         this.total_count = 0;
         this.issue = '';
    };

    startWork(language){
      var options = {
        url: 'https://api.github.com/search/issues?q=language:' + encodeURIComponent(language) + '+state:open',
        headers: {
          'User-Agent': 'request'
        }
      };
      request(options, function (error, response, data) {
        this.issues = JSON.parse(data).total_count;
        console.log(this.total_count);
      });
      return [`Number of Issues: ${this.total_count}\n`];
    }

    /* main menu */
    getIssue(language){

      var random_number = function (min, max) {
          return Math.floor(Math.random() * (max - min + 1)) + min;
      };

      var data;
      var issue;
      var counter = random_number(0, this.total_count);

      if ((counter > (this.issues - 1)) || (counter === 0)) {
        var options = {
          url: 'https://api.github.com/search/issues?q=language:' + encodeURIComponent(language) + '+state:open',
          headers: {
            'User-Agent': 'request'
          }
        };
        request(options, function (error, response, data) {
          this.issue = JSON.parse(data).items[counter];
          console.log(this.issue);
        });
        return [`Solve: ${this.issue.html_url}\n`];
      }

    }

    getStats(){
      return [`Your Issue: ${this.issue}\n`];
    }
}
module.exports = Work;
