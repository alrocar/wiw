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

        start: function() {
            this.nextQuestion();
        },

        pause: function() {

        },

        finish: function() {

        },

        nextQuestion: function() {
            this.question = this.gameModel.nextQuestion();
            $("#q").parent().animate({opacity: 1,height: 'toggle'}, 1000, function() {$("#q").hide();});
            var q = this.question;
            $("#q").parent().animate({opacity: 1,height: 'toggle'}, 1000, function() {$("#q").show();$("#q").text(q.name);});
            return this.question;
        },

        timeForNextQuestion: function() {

        },

        getElapsedTime: function() {

        },

        getRemainingTime: function() {

        },

        calcScore: function() {

        },

        isAnswerCorrect: function(answer) {
            var correct = this.gameModel.isAnswerCorrect(answer);
            if (correct) {
                this._addMarker(this.question);
                this.nextQuestion();                
            }
            return correct;
        },

        _addMarker: function(question) {
            var marker = { 
                "type": "Feature",
                "geometry": { 
                    "type": "Point",
                    "coordinates": [question.lon, question.lat]
                },
                "properties": {                    
                    "text":  question.name
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