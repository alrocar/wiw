var previousWW = WW;

// namespacing for backwards-compatibility
if (!es) {
    var es = {};
    if (!es.alrocar) es.alrocar = {};
	if (!es.alrocar.WW) es.alrocar.WW = {};
}

var WW = es.alrocar.WW = {
  noConflict: function() {
    WW = previousWW;
    return this;
  }
};

(function(WW) {
    
    WW.Game = function(gameModel, user, ui, scoreBoard, map, mapController) {
        this.gameModel = gameModel;
        this.user = user;
        this.ui = ui;
        this.scoreBoard = scoreBoard;
        this.map = map;
        this.mapController = mapController;

        return this;
    };

    WW.Game.prototype = {

        gameModel : null,
        user : null,
        ui : null,
        scoreBoard : null,
        map : null,
        mapController : null,
        question: null,
        _lastQuestion: null,

        start: function() {
            this.ui.iniGameBar();
            this.nextQuestion();
        },

        pause: function() {

        },

        finish: function() {

        },

        nextQuestion: function() {
            if (this.question)
                this._lastQuestion = $.extend({}, this.question);
            this.question = this.gameModel.nextQuestion();
            this.ui.setQuestion(this.question);
            this._iniTime = new Date().getTime();    
            this._timeForNextQuestion = this.timeForNextQuestion();
            console.log("timeForNextQuestion: " + this._timeForNextQuestion);                 
            return this.question;
        },

        timeForNextQuestion: function() {
            var lastLocation = new MM.Location(0, 0);
            if (this._lastQuestion) {
                lastLocation = new MM.Location(this._lastQuestion.lat, this._lastQuestion.lon);
            } 
            var lastPoint = this.map.locationPoint(lastLocation);

            var nextLocation = new MM.Location(this.question.lat, this.question.lon);
            var nextPoint = this.map.locationPoint(nextLocation);

            var distancePx = MM.Point.distance(lastPoint, nextPoint);

            //Average speed is 412,3 pixels/second
            var estimatedTime = distancePx / 412.3;

            //min time for a question 2 seconds, max time the double of the time to run to the destination
            return Math.max(6 * 1000, estimatedTime * 4 * 1000);
        },

        updateTime: function() {            
            if (this.getRemainingTime() <= 0) {
                // console.log("No more time");
                this.nextQuestion();
            }
        },

        getElapsedTime: function() {
            var currentTime = new Date().getTime();            
            var elapsed = currentTime - this._iniTime;
            // console.log("elapsed time: " + elapsed);
            return elapsed;
        },

        getRemainingTime: function() {
            var currentTime = new Date().getTime();
            var remaining = this._timeForNextQuestion - this.getElapsedTime();
            // console.log("remaining time: " + remaining);
            return remaining;
        },

        calcScore: function() {
            var elapsedTime = this.getElapsedTime();
            // console.log("Correct answer in: " + elapsedTime);
            return this.getRemainingTime();
        },

        isAnswerCorrect: function(answer) {
            var correct = this.gameModel.isAnswerCorrect(answer);
            if (correct) {
                var questionScore = Math.floor(this.calcScore()/100);
                this.ui.addPoints(questionScore);
                this.ui.addTime(Math.floor(questionScore/1000));
                this._addMarker(this.question, questionScore);
                this.nextQuestion();                
            }
            return correct;
        },

        _addMarker: function(question, score) {
            var marker = { 
                "type": "Feature",
                "geometry": { 
                    "type": "Point",
                    "coordinates": [question.lon, question.lat]
                },
                "properties": {                    
                    "text":  question.name  + "  +" +score
                }
            };

            this.mapController.addPointToGeoJSON(marker);
        }
    };

    WW.Question = function(lon, lat, name, p) {
        this.lon = lon;
        this.lat = lat;
        this.name = name;
        this.p = p;        
    }

    WW.Question.prototype = {
        lon: null,
        lat: null,
        name: null,
        p: null
    };

    WW.Answer = function(locationPixel, destinationPixel, distance) {
        this.distance = distance;
        this.locationPixel = locationPixel;
        this.destinationPixel = destinationPixel;
    }

    WW.Answer.prototype = {
        distance: null,
        locationPixel: null,
        destinationPixel: null
    };

    WW.User = function(userName, mail, pass) {
        this.userName = userName;
        this.mail = mail;
        this.pass = pass;
    };

    WW.User.prototype = {

        userName: null,
        mail: null,
        pass: null,
        currentScore: null,
        allScores: null,
        badges: null,
        status: null,

        //go to server and get the scores of this user
        retrieveAllScores: function() {

        },

        //go to server and get the user badges
        retrieveBadges: function() {

        },

        //go to server and get the user status
        retrueveStatus: function() {

        }
    };

    //WW.randomFromTo(100,1000) //950
    WW.randomFromTo = function(from, to){
        return Math.floor(Math.random() * (to - from + 1) + from);
    };

    //WW.randomItem([1,2,3,4,23,64]) //23
    WW.randomItem =  function(array){
        return array[randomFromTo(0, array.length - 1)];
    };
}
)(WW);