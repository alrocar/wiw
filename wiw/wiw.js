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
    
    WW.Game = function(gameModel, user, ui, scoreBoard, map, mapController, character) {
        var self = this;
        this.gameModel = gameModel;
        this.user = user;
        this.ui = ui;
        this.scoreBoard = scoreBoard;
        this.map = map;
        this.mapController = mapController;
        this.character = character;

        MM.addEvent(document, 'keydown', function(e) {
            //z
            if (e.keyCode == 90) {
                if (self.isStarted) {
                    self.passQuestion();
                }
            }
        });

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
        isStarted: false,
        _lastQuestion: null,
        _timeForNextQuestion: null,
        currentScore: 0,
        correctAnswers: 0,
        badAnswers: 0,
        timePlaying: 0,
        hintDuration: 3000,
        passCounter: 3,

        start: function() {
            //reiniciar todas las variables, hacer un init en toda regla
            this.question = null;            
            this._lastQuestion = null;
            this._timeForNextQuestion = null;
            this.isStarted = true;
            this.currentScore = 0;
            this.correctAnswers = 0;
            this.badAnswers = 0;
            this.timePlaying = 0;
            this.gameModel.reset();
            this.mapController.reset();
            this.ui.iniGameBar();
            this.character.showHint("Use the arrow keys ↑ ← ↓ → to move to the city");
        },

        pause: function() {

        },

        restart: function() {
            this.isStarted = false;
            this.ui.stop();
            this.start();
        },

        gameOver: function() {
            if (!this.isStarted) {
                this.ui.stop();
                return;
            }

            this.isStarted = false;
            this.ui.stop();
            this.ui.showScoreBoard(this.user);
            this.character.showHint("Game over. Eres un paquete!!");
        },

        onGameBarInited: function() {
            this.nextQuestion();
        },

        nextQuestion: function() {
            if (!this.isStarted) {
                return;
            }

            this._wait = false;
            if (this.question)
                this._lastQuestion = $.extend({}, this.question);
            this.question = this.gameModel.nextQuestion();
            
            if (!this.question) {
                this.gameOver();
                if (this.correctAnswers > 10) {
                    this.character.showHint("You are the f*cking master!! No more questions left!");
                } else if (this.correctAnswers <= 5) {
                    this.character.showHint("No more questions left... You are a cheater or this is a bug, I bet for the first thing ¬¬u");
                }
                return;
            }

            this._iniTime = new Date().getTime();    
            this._timeForNextQuestion = this.timeForNextQuestion();
            this.ui.setQuestion(this.question, this._timeForNextQuestion);
            // console.log("timeForNextQuestion: " + this._timeForNextQuestion);                 
            return this.question;
        },

        passQuestion: function() {
            if (this.passCounter <= 0) {
                this.character.showHint("You cannot pass more questions... Please study geography", this.hintDuration);
                return;
            }

            this._wait = true;
            
            var penaltyTime = this._getPenalty();

            this._addBadAnswer();
            this._addPoints(-penaltyTime);
            this.ui.removePoints(penaltyTime);
            this.character.showHint("Ouch!! You can pass " + this.passCounter-- + " more questions", this.hintDuration);
            this.ui.correctAnswer(this.nextQuestion, this);
        },

        timeForNextQuestion: function() {
            var lastLocation = new MM.Location(0, 0);
            if (this._lastQuestion) {
                lastLocation = new MM.Location(this.map.getCenter().lat, this.map.getCenter().lon);
            } 
            var lastPoint = this.map.locationPoint(lastLocation);

            var nextLocation = new MM.Location(this.question.lat, this.question.lon);
            var nextPoint = this.map.locationPoint(nextLocation);

            var distancePx = MM.Point.distance(lastPoint, nextPoint);

            //Average speed is 412,3 pixels/second
            var estimatedTime = distancePx / 412.3;

            //min time for a question 2 seconds, max time the double of the time to run to the destination
            return Math.max(6 * 1000, estimatedTime * 3 * 1000);
        },

        updateTime: function() {
            if (this.getRemainingTime() <= 0) {
                // console.log("No more time");                
                this._performBadAnswer();    
            } else if (this.getRemainingTime() * 3 < this._timeForNextQuestion) {
                this.ui.blinkQuestion();
            }
        },

        _getPenalty: function() {
            var penaltyTime = this.getRemainingTime() || 0 / 1000;
            if (penaltyTime < 0) {
                penaltyTime = 0;
            }

            penaltyTime = Math.round(penaltyTime);

            if (this.currentScore - penaltyTime < 0) {
                penaltyTime = 0;
            }

            return penaltyTime;
        },

        _performBadAnswer: function() {
            this._wait = true;
            this.ui.badAnswer(this.nextQuestion, this);
            this._addBadAnswer();
            this.character.showHint("Uppss!!", this.hintDuration);
            // this.ui.removePoints(Math.floor(this._timeForNextQuestion/10000));
        },

        _performCorrectAnswer: function() {
            this._wait = true;
            var questionScore = Math.floor(this.calcScore()/100);
            this._addCorrectAnswer();
            this._addPoints(questionScore);
            this.ui.addPoints(questionScore);
            this.ui.addTime(Math.floor(questionScore/10));
            this._addMarker(this.question, questionScore);
            this.ui.correctAnswer(this.nextQuestion, this);                
            this.character.showHint("Well done!!", this.hintDuration);
        },

        getElapsedTime: function() {
            var currentTime = new Date().getTime();            
            var elapsed = currentTime - this._iniTime;
            // console.log("elapsed time: " + elapsed);
            return elapsed;
        },

        getRemainingTime: function() {
            var remaining = this._timeForNextQuestion - this.getElapsedTime();
            // console.log("remaining time: " + remaining);
            return remaining;
        },

        calcScore: function() {
            var elapsedTime = this.getElapsedTime();
            this._addTimePlaying(10/elapsedTime);
            // console.log("Correct answer in: " + elapsedTime);
            return this.getRemainingTime();
        },

        isAnswerCorrect: function(answer) {
            if (this._wait) return;            
            var correct = this.gameModel.isAnswerCorrect(answer);
            if (correct) {
                this._performCorrectAnswer();
            }
            return correct;
        },

        setCurrentScore: function(score) {
            this.currentScore = score;
        },

        getCurrentScore: function() {
            return this.currentScore;
        },

        _addPoints: function(points) {
            this.currentScore += points;
        },

        _addCorrectAnswer: function() {
            this.correctAnswers++;
        },

        _addBadAnswer: function() {
            this.badAnswers++;
        },

        _addTimePlaying: function(time) {
            this.timePlaying += time;
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
        retruiveStatus: function() {

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