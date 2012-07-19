MM.ThrowableHandler = function() {
  var handler = {};
  var keyCount = 0,
      keysPressed = {},
      trappedKeys = {
        37: true,
        38: true,
        39: true,
        40: true
      },
      maxSpeed = 7,
      prevT = 0,
      acceleration = 25.0,
      speed = null,
      drag = 0.15,
      mousePoint = null,
      mouseDownPoint = null,
      mouseDownTime = 0,
      zoomSpeed = 0,
      callback,
      zoomPoint = null;

  handler.callback = function(x) {
      if (!arguments.length) return callback;
      callback = x;
  };

  handler.speed = function() {
      return {
          x: speed.x,
          y: speed.y
      };
  };

  handler.init = function(map) {
        function animate(t) {
            var dir = { x: 0, y: 0 };
            if (keysPressed[37]) { dir.x += 1; }
            if (keysPressed[38]) { dir.y += 1; }
            if (keysPressed[39]) { dir.x -= 1; }
            if (keysPressed[40]) { dir.y -= 1; }

            // if (dir.x && dir.y) {
            //   dir.x /= 2;
            //   dir.y /= 2;
            // }

            var dt = Math.max(0.001,(t - prevT) / 1000.0);
            if (dir.x || dir.y) {
                var len = Math.sqrt(dir.x*dir.x + dir.y*dir.y);
                dir.x /= len;
                dir.y /= len;
                speed.x += dir.x * acceleration * dt;
                speed.y += dir.y * acceleration * dt;
            } else if (mousePoint && prevMousePoint) {
                dir.x = mousePoint.x - prevMousePoint.x;
                  dir.y = mousePoint.y - prevMousePoint.y;
                  speed.x = dir.x;
                  speed.y = dir.y;
              } else {
                  speed.x -= speed.x * drag;
                  speed.y -= speed.y * drag;
                  if (Math.abs(speed.x) < 0.001) {
                      speed.x = 0;
                  }
                  if (Math.abs(speed.y) < 0.001) {
                      speed.y = 0;
                  }
              }

              if (speed.x > maxSpeed)  speed.x = maxSpeed;
              if (speed.x < -maxSpeed) speed.x = -maxSpeed;
              if (speed.y > maxSpeed)  speed.y = maxSpeed;
              if (speed.y < -maxSpeed) speed.y = -maxSpeed;

              if (speed.x || speed.y) {
                  if (callback) callback({
                    x: speed.x,
                    y: speed.y});
                  // if (map.getCenter().lon > 170 || map.getCenter().lon < -170 || map.getCenter().lat > 80 || map.getCenter().lat < -80)
                  //   map.panBy(-speed.x,-speed.y);
                  // else
                    map.panBy(speed.x,speed.y);
              }
              if (zoomSpeed && zoomPoint) {
                  map.zoomByAbout(zoomSpeed * dt, zoomPoint);
                  zoomSpeed -= zoomSpeed * 0.125;
                  if (Math.abs(zoomSpeed) < 0.001) {
                      zoomSpeed = 0;
                  }
              }
              prevT = t;
              // tick every frame for time-based anim accuracy
              MM.getFrame(animate);
          }

          function keyDown(e) {
            // if (keyup) {              
            //   t1 = new Date().getTime();
            //   console.log("init: " + t1);                
            //   keyup = false;
            //   total = 0;
            // }
            // total++;
              if (!(e.keyCode in keysPressed)) {
                  keysPressed[e.keyCode] = true;
                  keyCount++;
              }
              if (e.keyCode in trappedKeys) {
                return MM.cancelEvent(e);
              }
          }

          function keyUp(e) {
            // keyup = true;
            // t2 = new Date().getTime();
            // console.log("elapsed: " + (t2 - t1));
            // console.log("total: " + total);  
              keyCount--;
              delete keysPressed[e.keyCode];
              if (e.keyCode in trappedKeys) {
                return MM.cancelEvent(e);
              }
          }

          function mouseDown(e) {
              if (e.touches) { MM.cancelEvent(e); e = e.touches[0]; }
              mousePoint = prevMousePoint = MM.getMousePoint(e, map);
              return MM.cancelEvent(e);
          }

          function mouseMove(e) {
              if (mousePoint) {
                  if (e.touches) { MM.cancelEvent(e); e = e.touches[0]; }
                  prevMousePoint = mousePoint;
                  mousePoint = MM.getMousePoint(e, map);
                  return MM.cancelEvent(e);
              }
          }

          function mouseUp(e) {
              if (e.touches) { MM.cancelEvent(e); e = e.touches[0]; }
              mousePoint = prevMousePoint = null;
              return MM.cancelEvent(e);
          }

          MM.addEvent(document, 'keydown', keyDown);
          MM.addEvent(document, 'keyup', keyUp);
          MM.addEvent(map.parent, 'mousedown', mouseDown);
          MM.addEvent(map.parent, 'mousemove', mouseMove);
          MM.addEvent(map.parent, 'mouseup', mouseUp);

          function isTouchable () {
               var el = document.createElement('div');
               el.setAttribute('ongesturestart', 'return;');
               return (typeof el.ongesturestart === 'function');
          }

          if (isTouchable()) {
              MM.addEvent(map.parent, 'touchmove', mouseMove);
              MM.addEvent(map.parent, 'touchstart', mouseDown);
              MM.addEvent(map.parent, 'touchup', mouseDown);
          }

          // tick every frame for time-based anim
          prevT = new Date().getTime();
          speed = { x: 0, y: 0 };
          MM.getFrame(animate);
      };

    return handler;
};
