/// <reference path="qi/init.ts" />

let $ = jQuery;

import R from "R";

export class Game {
    private _director: qi.Director;

    private _randomColor(): number {
        return Math.round(Math.random() * 255);
    }

    private _randomTint(): number {
        return (this._randomColor() << 16) | (this._randomColor() << 8) | this._randomColor();
    }

    public constructor() {
        console.log("[Game] create instance");
        let config: qi.AutoScaleConfig = {
            width: 960,
            height: 640,
            policy: qi.ScalePolicy.FIXED_HEIGHT
        };
        let director = new qi.Director(config);
        let renderer = director.getRenderer();
        document.body.appendChild(renderer.view);

        let frameWidth = $(window).width();
        let frameHeight = $(window).height();
        director.setFrameSize(frameWidth, frameHeight);
        let left = frameWidth / 2 - director.size.rendererWidth / 2 + "px";
        let top = frameHeight / 2 - director.size.rendererHeight / 2 + "px";
        renderer.view.style.left = left;
        renderer.view.style.top = top;

        director.start();
        this._director = director;
    }


    public start(): void {
        let scene = new PIXI.Container();

        let texture = PIXI.Texture.fromImage(R["MapA0002Bg.png"]);
        let bg = new PIXI.Sprite(texture);
        scene.addChild(bg);


        this._director.runWithScene(scene);
    }

        // var node = qi.newNode();
        // var sprite = qi.newSprite();
        // sprite.position.set(qi.view.cx, qi.view.cy);
        // node.addChild(sprite);

        // var stars = [];
        // for (var i = 0; i < 100; i++) {
        //     var star = qi.newSprite($R["star.png"]);
        //     star.position.set(Math.random() * qi.view.width, Math.random() * qi.view.height);
        //     // star.scale.set(0.3);
        //     star.tint = randomTint();
        //     // star.alpha = 0.3;
        //     stars.push(star);
        //     node.addChild(star);
        // }

        // node.sortz();

        // node.countdown = 60;
        // node.update = function (dt) {
        //     for (var i = stars.length - 1; i >= 0; i--) {
        //         stars[i].rotation += 0.1;
        //     }

        //     this.countdown -= dt;
        //     if (this.countdown <= 0) {
        //         qi.runScene(qi.newNode());
        //     }
        // };
        // node.scheduleUpdate();

        // qi.runScene(node)
}

