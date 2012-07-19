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
            $gamebar = $("#gamebar");
            if (this.firstGame) {                
                $gamebar.parent().append("<div class='saw-black saww'></div>");
                $gamebar.parent().append("<div class='saw-white saww'></div>");
                $gamebar.addClass("gameback");
                $gamebar.pointcounter({initialValue: 5});
                $gamebar.downclock({initialValue: 62});
                $gamebar.append($("<div class='question'><label class='question-label' id='q'></label></div>"));
                $gamebar.append($("<div class='question_time'></div>"));
                $gamebar.css("width", 0);
                $(".saww").css("left", -50);
                $gamebar.animate({opacity: 1,"width": document.width - $(".limiter").outerWidth() - $(".saw").outerWidth()}, 1000, 
                    function() {                    
                        $(".saww").animate({"left": $gamebar.outerWidth()+"px"}, 1000, function(){});
                        self.game.onGameBarInited();                    
                    });
                var self = this;
                $gamebar.bind("secondpassed", function() {                
                    self.game.updateTime();
                });
                this.firstGame = false;
            } else {
                $gamebar.downclock("start");
                $gamebar.pointcounter("reset");
            }
        },

        stop: function() {
            $gamebar = $("#gamebar");            
            $gamebar.downclock("stop");
            $(".question_time").stop();            
            // $gamebar.empty();
        },

        setQuestion: function(question, timeForNextQuestion) {
            // $(".question_time").hide();
            $(".question-label").fadeIn(200);
            $(".question-label").fadeTo(50, 1);
            $(".question_time").css({"right" : "0px"}).stop().animate({"right" : $("#gamebar").outerWidth() + "px"}, timeForNextQuestion);
            // $(".question_time").show();
            $("#q").hide();
            var q = question;
            $("#q").show();$("#q").text(q.name);
        },

        correctAnswer: function(callback, scope) {
            $(".question-label").css({"right" : "0px"}).stop().animate({"right" : $("#gamebar").outerWidth() + "px"}, 200, function() {
                callback.apply(scope, arguments);
            });
        },

        badAnswer: function(callback, scope) {
            $(".question-label").fadeOut(200, 
                function() {
                    callback.apply(scope, arguments);
                });
        },

        heartbeatClock: function() {

        },

        blinkQuestion: function() {
            $(".question-label").fadeTo(300, 0).fadeTo(300, 1);
        },

        addPoints: function(points) {
            $("#gamebar").pointcounter("addPoints", points);
        },

        removePoints: function(points) {
            $("#gamebar").pointcounter("removePoints", points);
        },

        addTime: function(seconds) {
            $("#gamebar").downclock("addTime", seconds);  
        },

        removeTime: function(seconds) {
            $("#gamebar").downclock("removeTime", seconds);  
        }
    };
}
)(UI);