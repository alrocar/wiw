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
    var finishTemplate = 
        '<div id="finish-content">' +
            '<h1 class="main-title">Game Over</h1>' +
            '<h3 class="sub-title">Thanks for playing this beta version! More games coming soon...</h3>' +
            '<div class="section">' +
              '<h3>Correct answers <span class="correct-answers semi-bold"></span></h3>' + 
              '<h3>Incorrect answers <span class="bad-answers semi-bold"></span></h3>' +
              '<h3>Seconds playing <span class="time-playing semi-bold"></span></h3>' +
            '</div>' +
            '<div class="score-content">' +
                '<h1>Your score <span class="score semi-bold"></span></h1>' +
            '</div>' +
        '</div>';

    var socialTemplate = 
        '<div class="social container">' +
              '<div class="row">' +
                  '<div class="col-md-12">' +
                    '<a class="icon-google" target="_blank" href="https://plusone.google.com/_/+1/confirm?hl=en&url=http://alrocar.github.com/wiw"></a>' +
                    '<a class="icon-facebook" href="https://www.facebook.com/sharer/sharer.php?u=http://alrocar.github.com/wiw" target="_blank"></a>' +
                    '<a class="icon-twitter" href="https://twitter.com/share?source=tweetbutton&text=WiW&url=http://alrocar.github.com/wiw" target="_blank"></a>' +
                   '</div>' +
              '</div>' +
          '</div>';
    
    UI.ui = function() {
        var self = this;
        $(".start-button").click(function() {
          // $("ul").roundabout();
          if (self.game.isStarted) {
            self.game.restart();
          } else {
            self.game.start();
          }
        });

        return this;
    };

    UI.ui.prototype = {

        game: null,
        firstGame: true,
        time: 62,

        setGame: function(wiw) {
            this.game = wiw;
        },

        iniGameBar: function() {
            var self = this;
            this._removeFinishbar();
            var $gamebar = $("#gamebar");
            this.$gamebar = $gamebar;

            if (this.game.isMobile) {
                this.$totalPoints = $('.total-points');
                this.$questionLabel = $('.question-label');
                this.$questionTime = $('.question_time');

                this.$totalPoints.text(0);

                if (this.firstGame) {
                    this.firstGame = false;

                    $gamebar.pointcounter({initialValue: 5});
                    $gamebar.downclock({initialValue: this.time});

                    $('#pointcounter').hide();
                    $('#downclock').hide();

                    $('.knob').knob();

                    $gamebar.unbind("secondpassed").bind("secondpassed", function() {
                        self.game.updateTime();
                    });
                    $gamebar.unbind("clockzero").bind("clockzero", function() {
                        setTimeout(function() {
                            self.game.gameOver();
                        }, 1000);
                    });

                    this.afterFirstGameBarInited();
                } else {
                    window.game.ui.afterGameBarInited();
                }
            } else {

                $('#q2').remove();
                $('.knob').hide();

                if (this.firstGame) {                
                    $gamebar.parent().append("<div class='saw-black saww'></div>");
                    $gamebar.parent().append("<div class='saw-white saww'></div>");
                    $gamebar.addClass("gameback");
                    
                    $gamebar.pointcounter({initialValue: 5});
                    $gamebar.downclock({initialValue: this.time});
                    
                    $gamebar.append($("<div class='question'><label class='question-label' id='q'></label></div>"));
                    $gamebar.append($("<div class='question_time'></div>"));

                    this.$totalPoints = $('.total-points');
                    this.$questionLabel = $('.question-label');
                    this.$questionTime = $('.question_time');

                    this.$totalPoints.hide();
                    
                    $gamebar.unbind("secondpassed").bind("secondpassed", function() {
                        self.game.updateTime();
                    });
                    $gamebar.unbind("clockzero").bind("clockzero", function() {
                        setTimeout(function() {
                            self.game.gameOver();
                        }, 1000);
                    });

                    this.animateGameBar(function() {
                        self.afterFirstGameBarInited();
                    });
                    
                    this.firstGame = false;
                } else {
                    this.animateGameBar(function() {
                        window.game.ui.afterGameBarInited();
                    }); 
                }
            }

            $('.start-button').text('RESTART');
        },

        stop: function() {
            $('.start-button').text('PLAY');
            this.$gamebar.downclock("stop");
            this.$questionTime.stop();
        },

        afterFirstGameBarInited: function() {
            this.game.onGameBarInited();
        },

        afterGameBarInited: function() {
            this.$gamebar.downclock("start");
            this.$gamebar.pointcounter("reset");
            this.$totalPoints.hide();
        },

        clearMap: function() {
            
        },

        animateGameBar: function(fn) {
            var self = this;
            
            this.$gamebar.css({
                "width": 0,
                "left": 0,
                "display": 'block'
            });

            self.$gamebar.find('#downclock').show();
            self.$gamebar.find('#pointcounter').show();
            self.$gamebar.find('.question').show();
            self.$gamebar.find('.question_time').show();

            $(".saww").css("left", -50);
            
            self.$gamebar.parent().find('.saw-black').show();
            self.$gamebar.parent().find('.saw-white').show();
            
            var gamebarPos = $('body').outerWidth() - $(".limiter").outerWidth() - $(".saw").outerWidth() -20;
            $(".saww").animate({"left":  gamebarPos}, 1000, function(){});
            this.$gamebar.animate({opacity: 1,"width": gamebarPos + 1}, 1000, 
            function() {
                fn.call();
            });
        },

        showScoreBoard: function(user) {
            this.showFinishGameBar(user);
        },

        showFinishGameBar: function(user) {
            var self = this;
            var $gamebar = this.$gamebar.clone();
            $gamebar.attr('id', 'finishbar');
            $gamebar.find('#downclock').remove();
            $gamebar.find('#pointcounter').remove();
            $gamebar.find('.question').remove();
            $gamebar.find('.question_time').remove();
            
            this.$finishbar = $gamebar;
            
            $gamebar.css({
                "width": 0,
                "left": 0,
                "display": 'block'
            });

            $('#gamebar-container').prepend($gamebar);

            $gamebar.parent().append("<div class='saw-finish saww finish'></div>");
            $gamebar.addClass("gameback").addClass('finish');
            
            $(".saww.finish").css("left", -50);            
            
            var fadeOutTime = 250;
            self.$gamebar.find('#downclock').fadeOut(fadeOutTime);
            self.$gamebar.find('#pointcounter').fadeOut(fadeOutTime);
            self.$gamebar.find('.question').fadeOut(fadeOutTime);
            self.$gamebar.find('.question_time').fadeOut(fadeOutTime);
            
            self.$gamebar.parent().find('.saw-black').fadeOut(fadeOutTime);
            self.$gamebar.parent().find('.saw-white').fadeOut(fadeOutTime);

            var gamebarPos = $('body').outerWidth() - $(".limiter").outerWidth() - $(".saw").outerWidth() - 20;
            var animationDuration = 1000;
            
            self.$gamebar.animate({
                left: gamebarPos,
                opacity: 0.5
            }, animationDuration);

            $(".saww.finish").animate({"left":  gamebarPos}, animationDuration, function(){});
            $gamebar.animate({opacity: 1,"width": gamebarPos + 1}, animationDuration, 
            function() {
                self.$gamebar.fadeOut();
                var $finishTemplate = $(finishTemplate).clone();
                var $socialTemplate = $(socialTemplate).clone();
                self.$finishbar.append($finishTemplate);
                self.$finishbar.append($socialTemplate);
                self.showScoreBoardDialog(user);
            });
        },

        showScoreBoardDialog: function(user) {
            var correctAnswers = this.game.correctAnswers;
            var badAnswers = this.game.badAnswers;
            var timePlaying = Math.round(this.game.timePlaying / 1000);
            var score = this.game.getCurrentScore();

            this.$finishbar.find('.correct-answers').text(correctAnswers);
            this.$finishbar.find('.bad-answers').text(badAnswers);
            this.$finishbar.find('.time-playing').text(timePlaying);
            this.$finishbar.find('.score').text(score);
        },

        setQuestion: function(question, timeForNextQuestion) {
            // $(".question_time").hide();
            this.$questionLabel.fadeIn(200);
            this.$questionLabel.fadeTo(50, 1);
            this.$questionTime.css({"right" : "0px"}).stop().animate({"right" : this.$gamebar.outerWidth() + "px"}, timeForNextQuestion);
            // $(".question_time").show();
            $('.knob.minute').trigger('configure', 
            {
                min: 0,
                max: Math.round(timeForNextQuestion/1000)
            }).val(Math.round(timeForNextQuestion/1000)).trigger('change');
            
            var q = question;

            $("#q").hide();
            $("#q").show();
            $("#q").text(q.name);

            $("#q2").hide();
            $("#q2").show();
            $("#q2").text(q.name);
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
            this.$totalPoints.text(this.game.currentScore);
        },

        removePoints: function(points) {
            this.$gamebar.pointcounter("removePoints", points);
            this.$totalPoints.text(this.game.currentScore);
        },

        addTime: function(seconds) {
            this.$gamebar.downclock("addTime", seconds);  
        },

        removeTime: function(seconds) {
            this.$gamebar.downclock("removeTime", seconds);  
        },

        _removeFinishbar: function() {
            if (this.$finishbar) {
                $('.saw-finish').fadeOut(200, function() {
                    $(this).remove();
                });
                this.$finishbar.fadeOut(200, function() {
                    $(this).remove();
                });
            }
        }
    };
}
)(UI);