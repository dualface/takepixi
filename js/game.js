
var game = {

    start: function() {
        var node = qi.newNode();
        var sprite = qi.newSprite($R["MapA0002Bg.png"]);
        sprite.position.set(qi.view.cx, qi.view.cy);
        node.addChild(sprite);

        var stars = [];
        for (var i = 0; i < 1000; i++) {
            var star = qi.newSprite($R["star.png"]);
            star.position.set(Math.random() * qi.view.width, Math.random() * qi.view.height);
            stars.push(star);
            node.addChild(star);
        }

        node.time = 0;
        node.update = function(dt) {
            for (var i = stars.length - 1; i >= 0; i--) {
                stars[i].rotation += 0.1;
            }

            this.time = this.time + dt;
            if (this.time > 3) {
                qi.runScene(qi.newNode());
            }
        };
        node.scheduleUpdate();

        qi.runScene(node)
    }
};

