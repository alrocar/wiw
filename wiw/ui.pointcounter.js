(function($) {

    var template = '<div id="pointcounter" class="crappy-plastic-part-made-in-china2">'+
      '<div class="pad">'+        
        '<ul id="digit-4">'+
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
        '<ul id="digit-3">'+
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
        '<ul id="digit-2">'+
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
        '<ul id="digit-1">'+
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
        '<ul id="digit-0">'+
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

    var total = 0;
    var elem;

    var methods = {
        init : function( options ) { 
             var conf = {};
            $.extend(conf, options);
            return this.each(function() {
                elem = $(this);

                elem.append($(template));
                $('ul').roundabout({
                  shape: "waterWheel"
                });

                methods._applyCount(total);
            });
        },

        addPoints: function(points) {
          total += points;
          methods._applyCount(total);
        },

        removePoints: function(points) {
          total -= points;
          methods._applyCount(total);
        }, 

        _applyCount: function(total) {
            var i, part, child, factor, distance,
            count = new String(total),
            parts = count.split("").reverse();

            if (total > 9999999) {
              methods.tilt();
              return false;
            }

            for (i = parts.length - 1; i >= 0; i--) {
              part = parseInt(parts[i], 10);

              // get current position
              child = $('ul#digit-' + i).data('roundabout').childInFocus;
              factor = (part < child) ? (10 + part) - child : part - child;
              distance = factor * 36;
              
              if (i) {
                $('ul#digit-' + i).roundabout('animateToDelta', -distance);
              } else {
                $('ul#digit-' + i).roundabout('animateToDelta', -distance, function() {
                  $('.interact a').fadeTo(100, 1);
                  clickable = true;
                });
              }
              
            }
      },
      
      tilt: function() {
        for (var i = 0; i < 7; i++) {
          var amount = (Math.random()) ? 5 + (Math.random() * 20 - 10) : -5 - (Math.random() * 20 - 10);
          $('ul#digit-' + i).roundabout('animateToDelta', amount).find('li').css('color', '#c00');
        }
      }
      };

    $.fn.pointcounter = function( method ) {
    
        if ( methods[method] ) {
            return methods[method].apply( this, Array.prototype.slice.call( arguments, 1 ));
        } else if ( typeof method === 'object' || ! method ) {
            return methods.init.apply( this, arguments );
        } else {
            $.error( 'Method ' +  method + ' does not exist on jQuery pointcounter' );
        }
    };
})(jQuery);