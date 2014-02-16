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

    var hints = {
        move: "Use the arrow keys ↑ ← ↓ → to move me on over {0}",
        gameover: 'Game over. Click the "PLAY" button to try again',
        nopass: "You cannot pass more questions... Please study geography ¬¬u",
        master: "You are the f*cking master!! No more questions left!",
        cheater: "No more questions left... You are a cheater or this is a bug, I bet for the first thing ¬¬u",
        pass: "Ouch!! You can pass {0} more questions",
        welldone: "Well done!! Go for the next city"
    };

    var hintsMobile = {
        move: "Drag the map to {0} and tap over the city location"

    };

    var rank = {
        100: 'Internet Explorer',
        200: 'George Bush',
        300: 'Oh my port!',
        400: 'Monkey',
        500: '4 Years Child',
        600: 'Tom Cruise',
        700: 'Robocop',
        800: '10 Years Child',
        900: 'Student',
        1000: 'Mapper',
        1100: 'Addams Family',
        1200: 'Scribblenaut',
        1300: 'Gamer',
        1400: 'Geek',
        1500: 'Geo-Geek',
        1600: 'Dr. Northing',
        1700: 'Metacat',
        1800: 'Bob Squarepants',
        1900: 'Snoopy',
        2000: 'Geographer',
        2100: 'Cartographer',
        2200: 'Scientist',
        2300: 'Astronaut',
        2400: 'L33t B4rn3r',
        2500: 'H4ck3r',
        2600: 'He-Man',
        2700: 'Master of the Universe',
        2800: 'Chuck Norris'
    };

    var sounds = {};
    
    WW.Game = function(gameModel, user, ui, scoreBoard, map, mapController, character, isMobile) {
        var self = this;
        this.gameModel = gameModel;
        this.user = user;
        this.ui = ui;
        this.scoreBoard = scoreBoard;
        this.map = map;
        this.mapController = mapController;
        this.character = character;
        this.mapController.game = this;
        this.isMobile = isMobile;

        if (this.isMobile) {
            this.hints = $.extend({}, hints, hintsMobile);
        } else {
            this.hints = hints;
        }

        MM.addEvent(document, 'keydown', function(e) {
            //z
            if (e.keyCode == 90) {
                if (self.isStarted) {
                    self.passQuestion();
                }
            }
        });

        this.mapController.goToInitPosition();

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
            this.passCounter = 3;
            this.gameModel.reset();
            this.mapController.reset();
            this.ui.iniGameBar();
            this.playSound('background');
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
            this.stopSound('background');
            this.playSound('gameover');
            this.ui.stop();
            this.ui.showScoreBoard(this.user);
            this.character.showHint(this.hints.gameover);
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
                    this.character.showHint(this.hints.master);
                } else if (this.correctAnswers <= 5) {
                    this.character.showHint(this.hints.cheater);
                }
                return;
            }

            this._iniTime = new Date().getTime();    
            this._timeForNextQuestion = this.timeForNextQuestion();
            this.ui.setQuestion(this.question, this._timeForNextQuestion);
            // console.log("timeForNextQuestion: " + this._timeForNextQuestion); 
            if (this.correctAnswers === 0) {
                this.character.showHint(this.hints.move.format(this.question.name));
            }
            
            return this.question;
        },

        passQuestion: function() {
            if (!this.isStarted) {
                return;
            }

            if (this.passCounter <= 0) {
                this.character.showHint(this.hints.nopass, this.hintDuration);
                return;
            }

            this._wait = true;

            this.playSound('pass');
            
            var penaltyTime = this._getPenalty();

            this._addBadAnswer();
            this._addPoints(-penaltyTime);
            this.ui.removePoints(penaltyTime);
            this.character.showHint(this.hints.pass.format(--this.passCounter), this.hintDuration);
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
            this.timePlaying++;
            if (this.getRemainingTime() <= 0) {
                // console.log("No more time");                
                this._performBadAnswer();    
            } else if (this._isBlinking()) {
                this.playSound('blink');
                this.ui.blinkQuestion();
            }
        },

        _isBlinking: function() {
            return this.getRemainingTime() * 3 < this._timeForNextQuestion;
        },

        getRank: function() {
            for (var r in rank) {
                if (r > this.currentScore) {
                    return rank[r];
                }
            }

            return "NULL :P";
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
            this.playSound('error');
            this.ui.badAnswer(this.nextQuestion, this);
            this._addBadAnswer();
            this.character.showHint("Uppss!!", this.hintDuration);
            // this.ui.removePoints(Math.floor(this._timeForNextQuestion/10000));
        },

        _performCorrectAnswer: function() {
            this._wait = true;
            this.playSound('correct');
            var questionScore = Math.floor(this.calcScore()/100);
            this._addCorrectAnswer();
            this._addPoints(questionScore);
            this.ui.addPoints(questionScore);
            this.ui.addTime(Math.floor(questionScore/10));
            this._addMarker(this.question, questionScore);
            this.ui.correctAnswer(this.nextQuestion, this);                
            this.character.showHint(this.hints.welldone, this.hintDuration);
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
            //var elapsedTime = this.getElapsedTime();
            // console.log("Correct answer in: " + elapsedTime);
            return this.getRemainingTime();
        },

        isAnswerCorrect: function(answer) {
            if (!this.isStarted) {
                return;
            }

            if (this._wait) return;

            var correct = this.gameModel.isAnswerCorrect(answer, this.isMobile);
            if (correct) {
                this.character.hideHint();
                this._performCorrectAnswer();
            } 

            if (this._isBlinking()) {
                this.character.showHint("Distance: " + Math.round(answer.distance) + " Km.");
            }
            return correct;
        },

        setCurrentScore: function(score) {
            this.currentScore = score;
        },

        getCurrentScore: function() {
            return this.currentScore;
        },

        playSound: function(name) {
            if (this.isMobile) {
                return;
            }
            try {
                var instance = sounds[name];
                if (instance) {
                    instance.play();
                } else {
                    instance = createjs.Sound.play(name);
                    sounds[name] = instance;
                }
                instance.volume = 0.2;
            } catch (e) {

            }
        },

        stopSound: function(name) {
            if (this.isMobile) {
                return;
            }
            try {
                if (sounds[name]) {
                    sounds[name].removeAllEventListeners();
                    sounds[name].stop();
                    sounds[name].isInLoop = false;
                }
            } catch (e) {

            }
        },

        loopSound: function(name) {
            if (this.isMobile) {
                return;
            }
            try {
                var instance = sounds[name];
                if (!instance) {
                    instance = createjs.Sound.play(name);
                    instance.addEventListener('complete', function() {
                        if (instance.isInLoop) {
                            instance.play();
                        }
                    });
                    sounds[name] = instance;
                    sounds[name].isInLoop = true;
                } else {
                    if (instance.isInLoop) {
                        return;
                    } else {
                        instance.play();
                        instance.addEventListener('complete', function() {
                            if (instance.isInLoop) {
                                instance.play();
                            }
                        });
                    }
                }
            } catch (e) {

            }
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