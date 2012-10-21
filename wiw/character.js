WW.Character = function(wiw, th, character) {
    var self = this;
    this.th = th;
    this.wiw = wiw;
    this.setCharacter(character);
    window.ch = this;
    th.callback(function(speed) {
        self.dir = Math.atan2(speed.y, speed.x) / (Math.PI / 4);

        var x;
        switch (Math.round(self.dir)) {
          case 2:  self.guydir = 'up'; break;
          case 3:  self.guydir = 'up_right'; break;
          case 1:  self.guydir = 'up_left'; break;
          case -2: self.guydir = 'down'; break;
          case -1: self.guydir = 'down_left'; break;
          case -3: self.guydir = 'down_right'; break;
          case 4:  self.guydir = 'right'; break;
          case -4: self.guydir = 'right'; break;
          case 0:  self.guydir = 'left'; break;
        }

        // Euclidean distance, normalize
        var spd = Math.round(Math.sqrt(Math.pow(speed.x, 2) + Math.pow(speed.y, 2)) / 5);    

        if ((+new Date() - self.lastdate) > (110 / spd)) {
            self.frame++;
            self.lastdate = +new Date();
            if (self.frame > self.totalFrames) self.frame = 0;
        }

        if (spd < 1) {
            self.frame = 0;
        }

        if (self.hintshown) {
            var ks = document.getElementById('keyboard-shortcuts');
            ks.parentNode.removeChild(ks);
            self.hintshown = false;
        }

        if (self.vertical)
         document.getElementById('person-marker').style.backgroundPosition = self.spritetypes[self.guydir] + 'px ' + self.f2y(self.frame) + 'px';
        else
         document.getElementById('person-marker').style.backgroundPosition =  self.f2y(self.frame) + 'px ' + self.spritetypes[self.guydir] + 'px';
    });

    MM.getFrame(window.ch.drawidle);
};

WW.Character.prototype = {
    map: null,    
    // there are 8 frames in the sequence
    frame: 0,
    totalFrames: 8,
    lastdate: +new Date(),
    spritetypes: {
     left:  -140,
     right: -210,
     down: 0,
     down_left: -280,
     down_right: -350,
     up_left: -420,
     up_right: -490,
     up: -70,
     idle: -560
   },
   dir: "down",
   guydir: 'down',
   hintshown: false,
   frt: 80,
   lastIdle: +new Date(),
   th: null,
   wiw: null,
   width: 40,
    height: 60,
    heightPx: 60,
    walkImg: "img/walk-cycle.png",
    idleImg: "img/idle-cycle.png",
    vertical: true,

  /*var spritetypes = {
    left:  -607,
    right: -202,
    down: 0,
    down_left: -708,
    down_right: -101,
    up_left: -506,
    up_right: -303,
    up: -405,
    idle: -560
  };*/

  /*  var totalFrames = 10;
  function f2y(y) {
    return y * -75;
  }*/
    setCharacter: function(options) {
        for (var op in options) {
            this[op] = options[op];
        }

        $("#person-marker").css({
                "width": this.width + "px", 
                "height": this.height + "px", 
                "backgound-image" : "url(" + this.walkImg + ")"
            });
    },

   f2y: function(y){
    if (window.ch.vertical)
     return y * -window.ch.height;
    return y * -window.ch.width;
   },

  drawidle: function() {
    if ((+new Date() - window.ch.lastIdle) > window.ch.frt) {
        var speed = window.ch.th.speed();
        var spd = Math.round(Math.sqrt(Math.pow(speed.x, 2) + Math.pow(speed.y, 2)) / 5);
        if (spd < 1) {
            // document.getElementById('person-marker').style.backgroundImage = 'url(' + window.ch.idleImg + ')';
            // window.ch.frame++;
            // if (window.ch.frame > window.ch.totalFrames) window.ch.frame = 0;
            // if (window.ch.vertical)
            //     document.getElementById('person-marker').style.backgroundPosition = window.ch.spritetypes[window.ch.guydir] + 'px ' + window.ch.f2y(window.ch.frame) + 'px';
            // else 
            //     document.getElementById('person-marker').style.backgroundPosition = window.ch.f2y(window.ch.frame) + 'px ' + window.ch.spritetypes[window.ch.guydir] + 'px';
            document.getElementById('person-marker').style.backgroundImage = 'url(' + window.ch.walkImg + ')';
        } else {
            document.getElementById('person-marker').style.backgroundImage = 'url(' + window.ch.walkImg + ')';
        }
        window.ch.lastIdle = +new Date();
    }
    MM.getFrame(window.ch.drawidle);
  }
};
