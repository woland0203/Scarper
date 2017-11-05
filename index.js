var tress = require('tress');
var needle = require('needle');
var mysql = require('mysql');

var resolve = require('url').resolve;
var fs = require('fs');
//var scrapingChecker = require('scraping-checker');
var scrapingParser = require('./lib/scraping-parser');
var initQueueInstance = require('./lib/init-queue').crateInitQueue((
    mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "1111",
        database: "scraping"
    })
));


//var URL = 'https://www.google.com.ua/search?q=%D0%BE%D0%BD%D0%BE+%D1%81%D0%BC%D0%BE%D1%82%D1%80%D0%B5%D1%82%D1%8C+%D0%BE%D0%BD%D0%BB%D0%B0%D0%B9%D0%BD+2017&oq=%D0%BE%D0%BD%D0%BE+%D1%81%D0%BC%D0%BE%D1%82%D1%80%D0%B5%D1%82%D1%8C+%D0%BE%D0%BD%D0%BB%D0%B0%D0%B9%D0%BD+2017';

initQueueInstance.getLast();
return;

initQueueInstance.getLast(function(URL){
    var scriptsDomain = [];
    var lastUrl;

    var q = tress(function(url, callback){
        needle.get(url, function(err, res){
            if (err) throw err;

            // var $ = cheerio.load(res.body);
            results = res.body;
            console.log(res);

            lastUrl = url.domain;

            // scrapingChecker.check(res.domain, function(){

            var scrapingParserInstance = scrapingParser.create({
                body : res.body,
                qScraper: q,
                qScript: scriptsDomain,
                checker : scrapingChecker
            });
            if(url.domain.indexOf('google.') !== -1){
                scrapingParserInstance.parseGoogle()
            }
            scrapingParserInstance.parseScript();



            //   });


            /*        if($('.b_infopost').contents().eq(2).text().trim().slice(0, -1) === 'Алексей Козлов'){
                        results.push({
                            title: $('h1').text(),
                            date: $('.b_infopost>.date').text(),
                            href: url,
                            size: $('.newsbody').text().length
                        });
                    }

                    $('.b_rewiev p>a').each(function() {
                        q.push($(this).attr('href'));
                    });

                    $('.bpr_next>a').each(function() {
                        q.push(resolve(URL, $(this).attr('href')));
                    });
            */
            callback();
        });
    }, 1);

    q.drain = function(){
        initQueueInstance.setLastUrl(lastUrl);
        //fs.writeFileSync('./data.json', JSON.stringify(results, null, 4));
        fs.writeFileSync('./data.html', results);
    }

    q.push(URL);

});
