module.exports = function(app, io) {

    var Timer = function(interval){
        var self = this;
        this.round = 0;
        this.interval = interval;
        this.intervalId = null;
        this.intervalAction = function(){
            //console.log("I'm running every " + interval/1000 + " seconds!");
            self.round += 1;
            io.emit('change players', self.round, { for: 'everyone' });
        };
        this.start = function() {
            this.intervalId = setInterval(this.intervalAction, interval);
        };
        this.stop = function() {
          clearInterval(this.intervalId);
        };
    };

    var timer = new Timer(35000);
    timer.start();

};