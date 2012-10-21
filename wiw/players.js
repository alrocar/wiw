var players = {
  sotmus: {   
      // there are 8 frames in the sequence     
      totalFrames: 8,    
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
      frt: 80,
      width: 40,
      height: 60,       
      walkImg: "img/walk-cycle.png",
      idleImg: "img/idle-cycle.png",
      vertical: true
  }, 
  optimus: {          
      totalFrames: 10,    
      spritetypes: {
        left:  -607,
        right: -202,
        down: 0,
        down_left: -708,
        down_right: -101,
        up_left: -506,
        up_right: -303,
        up: -405,
        idle: -560
      },   
      frt: 80,
      width: 75,
      height: 101,      
      walkImg: "img/walk-cycle_.png",
      idleImg: "img/walk-cycle_.png",
      vertical: false
  },
  sonec: {

  },
  principezerda: {
      totalFrames: 5,    
      spritetypes: {
        left:  -102,
        right: -51,
        down: 0,
        down_left: -204,
        down_right: -153,
        up_left: -255,
        up_right: -306,
        up: -357,
        idle: 0
      },   
      frt: 40,
      width: 29,      
      height: 51,
      walkImg: "sprites/zerda.png",
      idleImg: "sprites/zerda.png",
      vertical: false
  },
  captainmoco: {
    totalFrames: 4,    
      spritetypes: {
        left:  -128,
        right: -256,
        down: 0,
        down_left: -512,
        down_right: -640,
        up_left: -768,
        up_right: -896,
        up: -384,
        idle: 0
      },   
      frt: 80,
      width: 78,      
      height: 128,
      walkImg: "sprites/actor1m.png",
      idleImg: "sprites/actor1m.png",
      vertical: false
  },
  alone: {
    totalFrames: 9,    
      spritetypes: {
        left:  -184,
        right: -552,
        down: 0,
        down_left: -92,
        down_right: -644,
        up_left: -276,
        up_right: -460,
        up: -368,
        idle: 0
      },   
      frt: 20,
      width: 48,      
      height: 92,
      walkImg: "sprites/f0.png",
      idleImg: "sprites/f0.png",
      vertical: false
  },
  multicrea: {
    totalFrames: 8,    
      spritetypes: {
        left:  -148.125,
        right: -345.625,
        down: -49.375,
        down_left: -98.75,
        down_right: 0,
        up_left: -197.5,
        up_right: -296.25,
        up: -246.875,
        idle: 0
      },   
      frt: 40,
      width: 47.25,      
      height: 49.375,
      walkImg: "sprites/multi.png",
      idleImg: "sprites/multi.png",
      vertical: false
  },
  vlad: {
    totalFrames: 8,    
      spritetypes: {
        left:  -336,
        right: 0,
        down: -192,
        down_left: -288,
        down_right: -240,
        up_left: -144,
        up_right: -96,
        up: -48,
        idle: 0
      },   
      frt: 40,
      width: 48,      
      height: 48,
      walkImg: "sprites/vlad.png",
      idleImg: "sprites/vlad.png", 
      vertical: false
  }
}