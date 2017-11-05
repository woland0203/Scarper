var cheerio = require('cheerio');

function scrapingParser(initObject) {
    console.log('1')

    this.body = initObject.body;
    this.qScraper = initObject.qScraper;
    this.qScript = initObject.qScript;
    this.checker  = initObject.checker;

    var $ = cheerio.load(this.body);
    console.log($('a').eq(0).text())
}

scrapingParser.prototype.parseGoogle = function () {
   console.log('2');
   return this;
};

scrapingParser.prototype.parseScript = function () {
    console.log('3')
    return this;
};

module.exports.createParser =  function (initObject) {
    return new scrapingParser(initObject);
}