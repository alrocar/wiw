(function($) {

    var template = '<div id="downclock" class="crappy-plastic-part-made-in-china">'+
      '<div class="pad">'+
        '<ul id="seconds-hundreds">'+
          '<li>0</li>'+
          '<li>1</li>'+
          '<li>2</li>'+
          '<li>3</li>'+
          '<li>4</li>'+
          '<li>5</li>'+
          '<li>6</li>'+
          '<li>7</li>'+
          '<li>8</li>'+
          '<li>9</li>'+
        '</ul>'+
        '<ul id="seconds-tens">'+
          '<li>0</li>'+
          '<li>1</li>'+
          '<li>2</li>'+
          '<li>3</li>'+
          '<li>4</li>'+
          '<li>5</li>'+
          '<li>6</li>'+
          '<li>7</li>'+
          '<li>8</li>'+
          '<li>9</li>'+
        '</ul>'+
        '<ul id="seconds-ones">'+
          '<li>0</li>'+
          '<li>1</li>'+
          '<li>2</li>'+
          '<li>3</li>'+
          '<li>4</li>'+
          '<li>5</li>'+
          '<li>6</li>'+
          '<li>7</li>'+
          '<li>8</li>'+
          '<li>9</li>'+
        '</ul>'+
      '</div>'+
    '</div>';

    var clock = 101;
    var elem;

    var methods = {
        init : function( options ) { 
             var conf = {};
            $.extend(conf, options);
            return this.each(function() {
                elem = $(this);
                
                if (conf.initialValue) {
                    clock = conf.initialValue;
                }
                elem.append($(template));
                methods.updateClock();
            });
        },

        updateClock: function() {
            var breakdown = methods.getCurrentClock();
            $('ul#seconds-hundreds').roundabout({
                easing: 'easeOutExpo',
                shape: 'waterWheel',
                startingChild: breakdown.secondsHundreds,
                minScale: 0
            });
            $('ul#seconds-tens').roundabout({
              easing: 'easeOutExpo',
              shape: 'waterWheel',
              startingChild: breakdown.secondsTens,
              minScale: 0
            });
            $('ul#seconds-ones').roundabout({
              easing: 'easeOutExpo',
              shape: 'waterWheel',
              startingChild: breakdown.secondsOnes,
              minScale: 0
            });
            
            setInterval(function() {
                var c = methods.getCurrentClock();
                elem.trigger("secondpassed");
                if (c == 0) {
                    elem.trigger("clockzero");                    
                }
              var breakdown = c + "";
              
              if (breakdown.length == 1) {
                $('ul#seconds-hundreds').roundabout("animateToChild", 0);  
                $('ul#seconds-tens').roundabout("animateToChild", 0);
                $('ul#seconds-ones').roundabout("animateToChild", breakdown);
              } else if (breakdown.length == 2) {
                $('ul#seconds-hundreds').roundabout("animateToChild", 0);  
                $('ul#seconds-tens').roundabout("animateToChild", breakdown.substring(0, 1));
                $('ul#seconds-ones').roundabout("animateToChild", breakdown.substring(1, 2));
              } else if (breakdown.length == 3) {
                $('ul#seconds-hundreds').roundabout("animateToChild", breakdown.substring(0, 1));  
                $('ul#seconds-tens').roundabout("animateToChild", breakdown.substring(1, 2));
                $('ul#seconds-ones').roundabout("animateToChild", breakdown.substring(2, 3));
              } else {
                $('ul#seconds-hundreds').roundabout("animateToChild", 9);  
                $('ul#seconds-tens').roundabout("animateToChild", 9);
                $('ul#seconds-ones').roundabout("animateToChild", 9);
              }
              
            }, 1000);
        },

        getCurrentClock: function() {
            if (clock <= 0) {
                return clock;
            }
            clock--;
            return clock;        
        },

        addTime: function(time) {
            clock += time;
        },

        removeTime: function(time) {
            clock -= time;
        },

        getRemainingTime: function() {
            return clock;
        }
      };

    $.fn.downclock = function( method ) {
    
        if ( methods[method] ) {
            return methods[method].apply( this, Array.prototype.slice.call( arguments, 1 ));
        } else if ( typeof method === 'object' || ! method ) {
            return methods.init.apply( this, arguments );
        } else {
            $.error( 'Method ' +  method + ' does not exist on jQuery downclock' );
        }
    };
})(jQuery);