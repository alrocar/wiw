var previousUI = UI;

// namespacing for backwards-compatibility
if (!es) {
    var es = {};
    if (!es.alrocar) es.alrocar = {};
	if (!es.alrocar.UI) es.alrocar.UI = {};
}

var UI = es.alrocar.UI = {
  noConflict: function() {
    UI = previousUI;
    return this;
  }
};

(function(UI) {
    
    UI.ui = function() {
        var self = this;
        $(".logo").click(function() {
          // $("ul").roundabout();
          if (self.game.isStarted) {
            self.game.finish();
          } else {
            self.game.start();
          }
        });

        return this;
    };

    UI.ui.prototype = {

        game: null,
        firstGame: true,

        setGame: function(wiw) {
            this.game = wiw;
        },

        iniGameBar: function() {
            // $("#gamebar").hide();
            var $gamebar = $("#gamebar");
            this.$gamebar = $gamebar;
            if (this.firstGame) {                
                $gamebar.parent().append("<div class='saw-black saww'></div>");
                $gamebar.parent().append("<div class='saw-white saww'></div>");
                $gamebar.addClass("gameback");
                $gamebar.pointcounter({initialValue: 5});
                $gamebar.downclock({initialValue: 12});
                $gamebar.append($("<div class='question'><label class='question-label' id='q'></label></div>"));
                $gamebar.append($("<div class='question_time'></div>"));
                $gamebar.css("width", 0);
                $(".saww").css("left", -50);
                var gamebarPos = $('body').outerWidth() - $(".limiter").outerWidth() - $(".saw").outerWidth();
                $(".saww").animate({"left":  gamebarPos}, 1000, function(){});
                $gamebar.animate({opacity: 1,"width": gamebarPos}, 1000, 
                    function() {
                        self.game.onGameBarInited();                    
                    });
                var self = this;
                $gamebar.bind("secondpassed", function() {
                    self.game.updateTime();
                });
                $gamebar.bind("clockzero", function() {
                    setTimeout(function() {
                        self.game.gameOver();
                    }, 1000);
                });
                this.firstGame = false;
            } else {
                $gamebar.downclock("start");
                $gamebar.pointcounter("reset");
            }

            this.$questionLabel = $('.question-label');
            this.$questionTime = $('.question_time');
        },

        stop: function() {
            this.$gamebar.downclock("stop");
            this.$questionTime.stop();
        },

        showScoreBoard: function(user) {
            this.showFinishGameBar(user);
            this.showScoreBoardDialog(user);
        },

        showFinishGameBar: function(user) {
            // var $gamebar = this.$gamebar.clone();
            // if (this.firstGame) {                
            //     $gamebar.parent().append("<div class='saw-black saww'></div>");
            //     $gamebar.parent().append("<div class='saw-white saww'></div>");
            //     $gamebar.addClass("gameback");
            //     $gamebar.pointcounter({initialValue: 5});
            //     $gamebar.downclock({initialValue: 12});
            //     $gamebar.append($("<div class='question'><label class='question-label' id='q'></label></div>"));
            //     $gamebar.append($("<div class='question_time'></div>"));
            //     $gamebar.css("width", 0);
            //     $(".saww").css("left", -50);
            //     var gamebarPos = $('body').outerWidth() - $(".limiter").outerWidth() - $(".saw").outerWidth();
            //     $(".saww").animate({"left":  gamebarPos}, 1000, function(){});
            //     $gamebar.animate({opacity: 1,"width": gamebarPos}, 1000, 
            //         function() {
            //             self.game.onGameBarInited();                    
            //         });
            //     var self = this;
            //     $gamebar.bind("secondpassed", function() {
            //         self.game.updateTime();
            //     });
            //     $gamebar.bind("clockzero", function() {
            //         setTimeout(function() {
            //             self.game.gameOver();
            //         }, 1000);
            //     });
            //     this.firstGame = false;
            // } else {
            //     $gamebar.downclock("start");
            //     $gamebar.pointcounter("reset");
            // }
        },

        showScoreBoardDialog: function(user) {
            alert("Your score: " + user.getCurrentScore());
        },

        setQuestion: function(question, timeForNextQuestion) {
            // $(".question_time").hide();
            this.$questionLabel.fadeIn(200);
            this.$questionLabel.fadeTo(50, 1);
            this.$questionTime.css({"right" : "0px"}).stop().animate({"right" : this.$gamebar.outerWidth() + "px"}, timeForNextQuestion);
            // $(".question_time").show();
            $("#q").hide();
            var q = question;
            $("#q").show();$("#q").text(q.name);
        },

        correctAnswer: function(callback, scope) {
            this.$questionLabel.css({"right" : "0px"}).stop().animate({"right" : this.$gamebar.outerWidth() + "px"}, 200, function() {
                callback.apply(scope, arguments);
            });
        },

        badAnswer: function(callback, scope) {
            this.$questionLabel.fadeOut(200, 
                function() {
                    callback.apply(scope, arguments);
                });
        },

        heartbeatClock: function() {

        },

        blinkQuestion: function() {
            this.$questionLabel.fadeTo(300, 0).fadeTo(300, 1);
        },

        addPoints: function(points) {
            this.$gamebar.pointcounter("addPoints", points);
        },

        removePoints: function(points) {
            this.$gamebar.pointcounter("removePoints", points);
        },

        addTime: function(seconds) {
            this.$gamebar.downclock("addTime", seconds);  
        },

        removeTime: function(seconds) {
            this.$gamebar.downclock("removeTime", seconds);  
        }
    };
}
)(UI);