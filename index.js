var tress = require('tress');
var needle = require('needle');
var mysql = require('mysql');

var resolve = require('url').resolve;
var fs = require('fs');

var scrapingParser = require('./lib/scraping-parser');
var initQueueInstance = require('./lib/init-queue').crateInitQueue((
    mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "1111",
        database: "scraping"
    })
));




console.log(fs.readFileSync('./data.html'));

var scrapingParserInstance = scrapingParser.createParser({
    host : 'www.google/com/ua',
    body : fs.readFileSync('./data.html'),
    qScraper: [],
    checker : {}
});
    scrapingParserInstance.parseGoogle()


return;







initQueueInstance.getLast(function(URL){
    var scriptsDomain = [];
  //  var lastUrl;

    var q = tress(function(url, callback){
        needle.get(url, function(err, res){
            if (err) throw err;

            // var $ = cheerio.load(res.body);
            results = res.body;
          //  console.log(res);
          //  return;

            var lastUrl = res.req.agent.protocol + '//' + res.connection._host + res.connection._httpMessage.path;

            // scrapingChecker.check(res.domain, function(){

           var scrapingParserInstance = scrapingParser.create({
                host : res.connection._host,
                body : res.body,
                qScraper: q,

            });
            if(res.connection._host.indexOf('google.') !== -1){
                scrapingParserInstance.parseGoogle()
            }
            scrapingParserInstance.parseScript();
            scrapingParserInstance.parseExternalHosts();



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
            callback(lastUrl);
        });
    }, 1);

    q.drain = function(){
       // initQueueInstance.setLastUrl(lastUrl);
        //fs.writeFileSync('./data.json', JSON.stringify(results, null, 4));
        fs.writeFileSync('./data.html', results);
    }

    q.push(URL, function (url) {
        console.log('ddd');
        console.log(url);
        initQueueInstance.complateLastUrl(url)
    });

});
