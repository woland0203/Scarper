var cheerio = require('cheerio');
var url = require('url');

const URLSearchParams = require('url').URLSearchParams;
//var scrapingChecker = require('scraping-checker');
var resolve = require('url').resolve;

const GOOGLE_MAX_PAGE = 4;



function scrapingParser(initObject) {
    console.log('1')

    this.host = initObject.host;
    this.body = initObject.body;
    this.qScraper = initObject.qScraper;
    this.checker  = initObject.checker;
    this.googleMaxPage = 10;

    this.$ = cheerio.load(this.body);

}

scrapingParser.prototype.parseGoogle = function () {

    var self = this;
    this.$('h3').each(function () {
        var parsefUrl = url.parse(  self.$(this).find('a').attr('href') );

        if(parsefUrl.search){
            var newSearchParams = new URLSearchParams(parsefUrl.search);

            var q = newSearchParams.get('q');
            if(q){
                console.log( q )
                // this.qScraper.push( newSearchParams.q );
            }
        }
    });

    this.$('a.fl').each(function () {
        var parsefUrl = self.$(this).attr('href');

        if( parseInt(self.$(this).text()) <= GOOGLE_MAX_PAGE){
            console.log(parseInt(self.$(this).text()))
            console.log(parsefUrl)
        }
        // this.qScraper.push( parsefUrl );
    });

   return this;
};

scrapingParser.prototype.parseScript = function () {
    console.log('3')
    var self = this;
    var scriptsDomain = [];
    this.$('script').each(function () {
        var src = self.$(this).find('script').attr('src');
        if(src){
            scriptsDomain.push( src );
        }
    });

    scrapingChecker.saveNotExists(this.host, scriptsDomain);
    return this;
};

scrapingParser.prototype.parseExternalHosts = function () {
};

module.exports.createParser =  function (initObject) {
    return new scrapingParser(initObject);
}