if (!String.prototype.format) {
  String.prototype.format = function() {
    var args = arguments;
    return this.replace(/{(\d+)}/g, function(match, number) { 
      return typeof args[number] != 'undefined'
        ? args[number]
        : match
      ;
    });
  };
}

$(document).ready(function() {
  createjs.Sound.alternateExtensions = ["mp3"];

  var isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

  if ($(document).height() < 700 || $(document).width() < 700) {
    isMobile = true;
  }

  window.loadHandler = function(event) {
    var osm = new modLayer(new MM.Template('/wiw/MAPBOX_GEO_flatx/{Z}/{X}/{Y}.png'), sepia);

    var th = new MM.ThrowableHandler();

    var handlers = [th, easey_handlers.DragHandler(),
                  easey_handlers.TouchHandler()];
        
    if(!isMobile) {
        handlers = [th];
    } else {
      $('#person-wrapper').addClass('mobile');
      $('#person-wrapper.mobile').css({left: $('.limiter').position().left + 180, top: $(document).height() - 100});
    }
    
    var map = new MM.Map('back-map', osm, null, handlers);
    var ui = new UI.ui();

    var character = new WW.Character(th, players.alone);
    
    var game = new WW.Game(new WW.gcapitals(WW.wcapitals), new WW.User('alrocar', 'void', 'void'), ui, null, map, new WW.ModestMapsController(map, isMobile), character, isMobile);
    window.game = game;
    
    ui.setGame(game);
  }

  if (!isMobile) {
    // createjs.Sound.addEventListener("fileload", window.loadHandler);
    createjs.Sound.registerSound("assets/M-GameBG.mp3", "background");
    createjs.Sound.registerSound("assets/NFF-choice-good.mp3", "correct");
    createjs.Sound.registerSound("assets/NFF-choice-bad.mp3", "error");
    createjs.Sound.registerSound("assets/NFF-coin-04.mp3", "click");
    createjs.Sound.registerSound("assets/dubbio.mp3", "blink");
    createjs.Sound.registerSound("assets/down.mp3", "pass");
    createjs.Sound.registerSound("assets/NFF-increase-02.mp3", "addpoints");
    createjs.Sound.registerSound("assets/NFF-gong.mp3", "gameover");
    window.loadHandler();
  } else {
    window.loadHandler();
  }
});