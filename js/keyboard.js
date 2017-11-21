MM.getFrame = function() {
    // native animation frames
    // http://webstuff.nfshost.com/anim-timing/Overview.html
    // http://dev.chromium.org/developers/design-documents/requestanimationframe-implementation
    // http://paulirish.com/2011/requestanimationframe-for-smart-animating/
    // can't apply these directly to MM because Chrome needs window
    // to own webkitRequestAnimationFrame (for example)
    // perhaps we should namespace an alias onto window instead?
    // e.g. window.mmRequestAnimationFrame?
    return function(callback) {
        (window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.oRequestAnimationFrame ||
            window.msRequestAnimationFrame ||
            function(callback) {
                window.setTimeout(function() {
                    callback(+new Date());
                }, 10);
            })(callback);
    };
}();

MM.addEvent = function(obj, type, fn) {
    if (obj.addEventListener) {
        obj.addEventListener(type, fn, false);
        if (type == 'mousewheel') {
            obj.addEventListener('DOMMouseScroll', fn, false);
        }
    } else if (obj.attachEvent) {
        obj['e' + type + fn] = fn;
        obj[type + fn] = function() { obj['e' + type + fn](window.event); };
        obj.attachEvent('on' + type, obj[type + fn]);
    }
};

MM.cancelEvent = function(e) {
    // there's more than one way to skin this cat
    e.cancelBubble = true;
    e.cancel = true;
    //deprecated
    // e.returnValue = false;
    if (e.stopPropagation) { e.stopPropagation(); }
    if (e.preventDefault) { e.preventDefault(); }
    return false;
};

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
        maxSpeed = 100,
        prevT = 0,
        acceleration = 50.0,
        speed = null,
        drag = 1,
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
        map.dragging.disable();
        map.touchZoom.disable();
        map.doubleClickZoom.disable();
        map.scrollWheelZoom.disable();
        map.boxZoom.disable();
        map.keyboard.disable();
        function animate(t) {
            var dir = { x: 0, y: 0 };
            if (keysPressed[37]) { dir.x -= 1; }
            if (keysPressed[38]) { dir.y -= 1; }
            if (keysPressed[39]) { dir.x += 1; }
            if (keysPressed[40]) { dir.y += 1; }

            // if (dir.x && dir.y) {
            //   dir.x /= 2;
            //   dir.y /= 2;
            // }

            var dt = Math.max(0.1, (t - prevT) / 1000.0);
            if (dir.x || dir.y) {
                var len = Math.sqrt(dir.x * dir.x + dir.y * dir.y);
                dir.x /= len;
                dir.y /= len;
                speed.x += dir.x * acceleration * dt;
                speed.y += dir.y * acceleration * dt;
            } else if (mousePoint && prevMousePoint) {

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

            if (speed.x > maxSpeed) speed.x = maxSpeed;
            if (speed.x < -maxSpeed) speed.x = -maxSpeed;
            if (speed.y > maxSpeed) speed.y = maxSpeed;
            if (speed.y < -maxSpeed) speed.y = -maxSpeed;

            if (speed.x || speed.y) {
                if (callback) callback({
                    x: speed.x,
                    y: speed.y
                });

                // speed.x = -speed.x;
                // speed.y = -speed.y;
                map.panBy(speed);
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
            if (!(e.keyCode in keysPressed)) {
                keysPressed[e.keyCode] = true;
                keyCount++;
            }
            if (e.keyCode in trappedKeys) {
                return MM.cancelEvent(e);
            }
        }

        function keyUp(e) {
            keyCount--;
            delete keysPressed[e.keyCode];
            if (e.keyCode in trappedKeys) {
                return MM.cancelEvent(e);
            }
        }

        MM.addEvent(document, 'keydown', keyDown);
        MM.addEvent(document, 'keyup', keyUp);

        // tick every frame for time-based anim
        prevT = new Date().getTime();
        speed = { x: 0, y: 0 };
        MM.getFrame(animate);
    };

    return handler;
};