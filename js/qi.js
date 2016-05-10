
var qi = (function() {

    // engine

    var view = {
        width: 960,
        height: 640,
        cx: 0,
        cy: 0,
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
        rendererWidth: 0,
        rendererHeight: 0
    };

    var renderer;
    var stage;
    var index;

    var listener;
    var listeners = [];
    var listenersCount = 0;
    var listenersRemove = {};

    var start = function() {
        console.log("game.start()");

        renderer = PIXI.autoDetectRenderer(view.width, view.height, {backgroundColor: 0x000});
        stage = new PIXI.Container();
        requestAnimationFrame(update);

        document.body.appendChild(renderer.view);
        renderer.view.style.position = "absolute";
        resize();
    };

    var timestamp;
    var dt;

    var update = function(current) {
        if (!timestamp) {
            timestamp = current;
            dt = 1 / 60;
        } else {
            dt = (current - timestamp) / 1000;
            timestamp = current;
        }

        renderer.render(stage);
        listenersCount = listeners.length;
        for (index = 0; index < listenersCount; index++) {
            listener = listeners[index];
            listener.call(listener.context, dt);
        }

        for (index = listenersCount; index >= 0; index--) {
            listener = listeners[index];
            if (listenersRemove[listener]) {
                listeners.splice(index, 1);
                delete listenersRemove[listener];
            }
        }

        requestAnimationFrame(update);
    };

    var scheduleUpdate = function(listener, context) {
        listener.context = context;
        listeners.push(listener);
    };

    var unscheduleUpdate = function(listener) {
        listenersRemove[listener] = true;
    };

    var setViewSize = function() {
        var frameWidth = $(window).width();
        var frameHeight = $(window).height();

        var height = frameHeight;
        var scaleY = view.height / height;
        var width = view.width / scaleY;

        if (width > frameWidth) {
            var scaleX = frameWidth / width;
            height *= scaleX;
            width = frameWidth;
        }

        view.rendererWidth = width;
        view.rendererHeight = height;

        view.cx = view.width / 2;
        view.cy = view.height / 2;
        view.left = 0;
        view.right = view.width;
        view.top = 0;
        view.bottom = view.height;
    };

    var resize = function() {
        setViewSize();
        renderer.view.style.left = $(window).width() / 2 - view.rendererWidth / 2 + "px";
        renderer.view.style.top = $(window).height() / 2 - view.rendererHeight / 2 + "px";
        renderer.resize(view.rendererWidth, view.rendererHeight);
        stage.scale.set(view.rendererWidth / view.width);
    };

    // texture, sprite, node, scene

    var textures = {};
    var texture;
    var sprite;
    var scene;

    var addTexture = function(url) {
        textures[url] = new PIXI.Texture.fromImage(url);
        return textures[url];
    };

    var newSprite = function(url) {
        texture = textures[url];
        if (!texture) {
            texture = addTexture(url);
        }
        sprite = new PIXI.Sprite(texture);
        sprite.anchor.set(0.5, 0.5);
        return sprite;
    };

    var newNode = function() {
        return new PIXI.Container();
    };

    var runScene = function(node) {
        if (scene) {
            stage.removeChildren();
        }
        scene = node;
        node.position.set(0, 0);
        stage.addChild(node);
    };

    // return

    return {
        view: view,
        start: start,
        resizeWindow: resize,

        scheduleUpdate: scheduleUpdate,
        unscheduleUpdate: unscheduleUpdate,

        addTexture: addTexture,
        newSprite: newSprite,
        newNode: newNode,
        runScene: runScene
    };
})();

// extends PIXI

PIXI.Container.prototype.update = function(dt) {
};

var _cleanup = function() {
    qi.unscheduleUpdate(this.update);
};

PIXI.Container.prototype.scheduleUpdate = function() {
    if (this._scheduleUpdate) {
        return;
    }
    qi.scheduleUpdate(this.update, this);
    this.on("removed", _cleanup, this);
};

PIXI.Container.prototype.unscheduleUpdate = function() {
    if (!this._scheduleUpdate) {
        return;
    }
    qi.unscheduleUpdate(this.update);
    this.off("removed", _cleanup, this);
};

