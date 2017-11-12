var cheerio = require('cheerio');
var url = require('url');
var fs = require('fs');


const URLSearchParams = require('url').URLSearchParams;
var resolve = require('url').resolve;

const GOOGLE_MAX_PAGE = 4;



function scrapingParser(initObject) {
    console.log('1')

    this.url = initObject.url;
    this.host = initObject.host;
    this.protocol = initObject.protocol;
    this.body = initObject.body;
    this.qScraper = initObject.qScraper;
    this.checker  = initObject.checker;
    this.googleMaxPage = 10;

    this.$ = cheerio.load(this.body);

}

scrapingParser.prototype.parseGoogle = function () {
    console.log('parseGoogle: ' + this.url)
    var self = this;
    this.$('h3').each(function () { //search results
        var parsefUrl = url.parse(  self.$(this).find('a').attr('href') );

        if(parsefUrl.search){
            var newSearchParams = new URLSearchParams(parsefUrl.search);

            var q = newSearchParams.get('q');
            if(q){
                console.log( q )
                self.qScraper.push( q );
            }
        }
    });

    this.$('.csb').parent().next().find('a').each(function () { //pagintor
        var parsefUrl = self.$(this).attr('href');


       // console.log('Next ' + self.$(this).text());

       // console.log('Google paaaaaaaaaaaaaaaaaaaaaaaaaaaage');
       // console.log(parseInt(self.$(this).text()));

        if( parseInt(self.$(this).text()) < GOOGLE_MAX_PAGE){
         //   console.log(parseInt(self.$(this).text()));

          //  console.log(resolve(self.url, parsefUrl));
            self.qScraper.push( resolve(self.url, parsefUrl) );
        }

    });

   return this;
};

scrapingParser.prototype.parseScript = function () {
    console.log('parseScript: ' + this.url)

    fs.writeFileSync('./' + this.host + '.html', this.body);

    var self = this;
    var scriptsDomain = [];
    this.$('script[src]').each(function () {

        var src = self.$(this).attr('src');
       // console.log(src)
        if(src){
            if(self.isVAlidScriptSrc(src)){
                src = (src.indexOf('//') == 0) ? (self.protocol + src) : src;
                var parsefUrl = url.parse( src );

              //  console.log(parsefUrl)
                if(scriptsDomain.indexOf(parsefUrl.host) === -1 && parsefUrl.host != self.host){
                    scriptsDomain.push( parsefUrl.host );
                }
            }


        }
    });

    this.checker.saveNotExists(this.host, scriptsDomain);
    return this;
};


scrapingParser.prototype.parseExternalHosts = function () {
};

scrapingParser.prototype.isVAlidScriptSrc = function (src) {
    return (src.indexOf('http://') == 0  || src.indexOf('https://') == 0 || src.indexOf('//') == 0);
};

module.exports.createParser =  function (initObject) {
    return new scrapingParser(initObject);
}