var mysql = require('mysql');

function scrapingChecker(connection) {
    this.connect = connection;
    //  this.connect.connect();
    //  console.log(this.connect);
    //  return;

}

scrapingChecker.prototype.saveNotExists = function (ownernerDomain, subDomains) {

        var self = this;
        var updateSubDomainRelation = function (ownernerDomainId, subDomainId) {

            self.connect.query(
                'insert into domain_relation set owner_id = ' + ownernerDomainId + ', sub_id = ' + subDomainId +
                ' on duplicate key update updated = NOW()'
            );
        };


        var updateSubDomains = function (ownernerDomainId) {
            var subDomainsStr = subDomains.join("','");
            self.connect.query('select * from domain where domain.domain in (\'' + subDomainsStr + '\') and domain.`type` = \'sub\'', function(error, results){

                var resultSsubDomains = [];
                var resultSsubId = [];
                for(var j in results){
                    resultSsubDomains.push(results[j].domain );
                    resultSsubId.push(results[j].id );
                }

                for(var i in subDomains){
                    var index = resultSsubDomains.indexOf(subDomains[i]);
                    if(index === -1){
                        self.connect.query(
                            'insert into domain set domain = \'' + subDomains[i] + '\', type = \'sub\' \n' +
                            'on duplicate key update created = NOW()',
                                function (err, result) {
                                if (err) throw err;

                                resultSsubDomains.push(subDomains[i]);
                                resultSsubId.push(result.insertId);
                                updateSubDomainRelation(ownernerDomainId, result.insertId);
                            }
                        );

                    }
                    else {

                        updateSubDomainRelation(ownernerDomainId, resultSsubId[index]);
                        self.connect.query(
                            'update domain set `count`=`count`+1 where id= \'' + resultSsubId[index] + '\' and type = \'sub\' \n'
                        );
                    }
                }
            });
        };


        this.connect.query(
            'select id from domain where domain = \'' + ownernerDomain + '\' and domain.`type` = \'owner\'',
            function (error, results, fields) {
                if (error) throw error;
                console.log(results);
                if(!results.length){
                    self.connect.query(
                        'insert into domain set domain = \'' + ownernerDomain + '\', type = \'owner\' \n' +
                        'on duplicate key update created = NOW()',
                        function (err, result) {
                            if (err) throw err;
                            console.log("1 record inserted, ID: " + result.insertId);
                            updateSubDomains(result.insertId)

                        });
                }
                else {
                    updateSubDomains(results[0].id);
                }


        });

}

module.exports.crateScrapingChecker =  function (connection) {
    return new scrapingChecker(connection);
}