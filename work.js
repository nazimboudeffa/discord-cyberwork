class Work {
    constructor(worker, client, channelName='work-test'){
         this.client = client;
         this.channelName = channelName;
         this.currentWorker = worker;
    };

    /* main menu */
    getIssue(){

      var random_number = function (min, max) {
          return Math.floor(Math.random() * (max - min + 1)) + min;
      };

      var range = function (begin, end) {
          var range = [];
          var delta = begin < end ? 1 : -1;
          for (var index = begin; index <= end; index += delta) {
              range.push(index);
          }
          return range;
      };

      var ACTION_SELECTOR = '.suggestionApp-action';
      var CONTENT_WRAPPER_SELECTOR = '.suggestionApp-content';
      var FORM_SELECTOR = '.suggestionApp-prompts form';
      var NOTICE_SELECTOR = '.items-notice';
      var HIDDEN_INPUT_SELECTOR = '.hiddenInput';
      var data = {};
      var LANGUAGE_SELECTOR = '#language-select';
      var CONTENT_HOLDER_SELECTOR = '.content-holder';
      var counter = 0;
      var total = $(NOTICE_SELECTOR).data('total');
      var randomPages = range(0, total).sort(function () { return Math.random() - 0.5 });
      var pageCounter = 0;
      var message = $(NOTICE_SELECTOR).data('message');

      if ((counter > (total - 1)) || (counter === 0)) {
        var language = 'Javascript'//$(LANGUAGE_SELECTOR).val();
        var jsonUrl = 'https://api.github.com/search/issues?q=language:' + encodeURIComponent(language) + '+state:open&page=' + randomPages[pageCounter];
        pageCounter = (pageCounter + 1) % total;
        data = get_json(jsonUrl, {});
        data.items.sort(function () { return Math.random() - 0.5 });
      }
      var issue = data.items[counter];
      console.log(issue);
      return issue;
    }
}
module.exports = Work;
