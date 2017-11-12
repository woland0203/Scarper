var tress = require('tress');
var needle = require('needle');
var mysql = require('mysql');
var scrapingChecker = require('./lib/scraping-checker');

var resolve = require('url').resolve;
var fs = require('fs');

var scrapingParser = require('./lib/scraping-parser');
var mysqlConnect = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "1111",
    database: "scraping"
});



var Horseman = require('node-horseman');
var horseman = new Horseman();

var r = [];
horseman
    .userAgent('Mozilla/5.0 (Windows NT 6.1; WOW64; rv:27.0) Gecko/20100101 Firefox/27.0')
    .on('loadFinished', function( res ){
        console.log('loadFinished');
        console.log(r.length);
    })
    .on('resourceReceived', function( res ){
        if(res.contentType && res.contentType.indexOf('javascript') !== -1){
            console.log(res.url);
            r.push(res.url)
        }

    })
    .open('http://okino.tv')

   /* .evaluate(function(ms, done){
        var pars = function () {
            var r = [];
            $('script[src]').each(function () {

                r.push( $(this).attr('src') );

            });
            done(null, r );
        }
        $(document).ready(function () {
            var intr;
            intr = setInterval(function () {
                if(document.readyState == "complete"){
                    clearInterval(intr);
                    pars();
                }

            },200);

        });
        if(document.readyState == "complete"){
            //return '1';
            setTimeout(function () {
                pars();

            }, 500);
        }

    }, 100)
    .then(function(actualMs){
        console.log(actualMs);
    })*/
   // .close();




return;


var initQueueInstance = require('./lib/init-queue').crateInitQueue(mysqlConnect);

var scrapingCheckerInstance = scrapingChecker.crateScrapingChecker(mysqlConnect);



initQueueInstance.getLast(function(URL){

    console.log('URL')
    console.log(URL)
    var results, lastUrl;
    var q = tress(function(url, callback){

        needle.get(url, function(err, res){

            if (err) throw err;

            results = res.body;


            var currentUrl = res.req.agent.protocol + '//' + res.connection._host + res.connection._httpMessage.path;

            lastUrl = currentUrl;
           var scrapingParserInstance = scrapingParser.createParser({
                url : currentUrl,
                host : res.connection._host,
                protocol : res.req.agent.protocol,
                body : res.body,
                qScraper: q,
                checker : scrapingCheckerInstance,
            });
            if(res.connection._host.indexOf('google.') !== -1){
                scrapingParserInstance.parseGoogle()
            }
            scrapingParserInstance.parseScript();
          //  scrapingParserInstance.parseExternalHosts();

            callback(null, currentUrl);
        });
    }, -1000);

    q.drain = function(){
        console.log('lastUrl');
        console.log(lastUrl);
   //    initQueueInstance.setLastUrl(lastUrl);
        //fs.writeFileSync('./data.json', JSON.stringify(results, null, 4));
        fs.writeFileSync('./data.html', results);
    }

    q.push(URL, function (url) {
        initQueueInstance.complateLastUrl(url)
    });

});
