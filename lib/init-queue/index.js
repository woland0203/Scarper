var mysql = require('mysql');

function initQueue(connection) {
    this.connect = connection;
  //  this.connect.connect();
  //  console.log(this.connect);
  //  return;

}


initQueue.prototype.getLast = function (callback) {
    this.connect.query('SELECT * from init_queue', function (error, results, fields) {
        if (error) throw error;
        console.log(results);
    });

};

initQueue.prototype.setLastUrl = function (lastUrl) {

};

module.exports.crateInitQueue = function (connection) {
    return new initQueue(connection);
}
