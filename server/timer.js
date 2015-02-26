module.exports = function() {

    var Timer = function(interval){
        this.round = 0;
        this.interval = interval;
        this.intervalId = null;
        this.changePlayer = function(){
            //console.log("I'm running every " + interval/1000 + " seconds!");
            this.round += 1;
            this.stop();
            this.start();
            return this.round;
        }.bind(this);
        this.start = function() {
            this.intervalId = setInterval(this.changePlayer, interval);
        };
        this.stop = function() {
          clearInterval(this.intervalId);
        };
    };

    return Timer;
};