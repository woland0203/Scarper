var mysql = require('mysql');

function initQueue(connection) {
    this.connect = connection;
  //  this.connect.connect();
  //  console.log(this.connect);
  //  return;

}


initQueue.prototype.getLast = function (callback) {
    this.connect.query('SELECT url from init_queue where status=0 order by id limit 1', function (error, results, fields) {
        if (error) throw error;
        if(results.length) callback(results[0].url)
        else console.log('init_queue is empty');
    });

};

initQueue.prototype.setLastUrl = function (lastUrl) {
    this.connect.query('insert into init_queue set url = \'' + lastUrl + '\', status=0',  function (error, results, fields) {

        if (error) throw error;
    });
};

initQueue.prototype.complateLastUrl = function (lastUrl) {
  /*  this.connect.query('update init_queue set status=1 where url="' + lastUrl + '"', function (error, results, fields) {
        if (error) throw error;
    });*/
};

module.exports.crateInitQueue = function (connection) {
    return new initQueue(connection);
}
