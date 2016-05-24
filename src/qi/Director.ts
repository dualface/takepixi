'use strict';

namespace qi {

    export const enum ScalePolicy {
        FIXED_HEIGHT,
        FIXED_WIDTH,
        SHOW_ALL,
        FIT_ALL
    }

    export interface AutoScaleConfig {
        width?: number;
        height?: number;
        policy?: ScalePolicy;
    }

    export class FrameSize {
        constructor() {
            this.center = new PIXI.Point();
        }

        width: number;
        height: number;
        left: number;
        top: number;
        right: number;
        bottom: number;
        center: PIXI.Point;
        rendererWidth: number;
        rendererHeight: number;
        rendererScaleX: number;
        rendererScaleY: number;
    }

    export class Director {
        private _start: boolean = false;
        private _scaleConfig: AutoScaleConfig;
        private _stage: PIXI.Container;
        private _scene: PIXI.Container;
        private _renderer;
        private _timestamp: number = 0;
        private _updateCall;
        private _lastSeconds: number = 0;
        private _tickCount: number = 0;

        public size: FrameSize = new FrameSize();

        public constructor(config: AutoScaleConfig) {
            console.log("[Director] create instance");
            if (!config.width) {
                config.width = 960;
            }
            if (!config.height) {
                config.height = 640;
            }
            if (!config.policy) {
                config.policy = ScalePolicy.SHOW_ALL;
            }
            this._scaleConfig = config;

            this._renderer = PIXI.autoDetectRenderer(config.width, config.height, { backgroundColor: 0xf00 });
            this._renderer.view.style.position = "absolute";

            this._stage = new PIXI.Container();
        }

        public getRenderer(): any {
            return this._renderer;
        }

        public getRunningScene(): PIXI.Container {
            return this._scene;
        }

        public runWithScene(scene: PIXI.Container) {
            this._stage.removeChildren();
            this._scene = scene;
            scene.position.set(0, 0);
            this._stage.addChild(scene);
        }

        public start(): void {
            if (!this._start) {
                this._start = true;
                this._timestamp = 0;
                this._updateCall = this._update.bind(this);
                requestAnimationFrame(this._updateCall);
            }
        }

        public stop(): void {
            if (this._start) {
                this._start = false;
            }
        }

        public setFrameSize(frameWidth: number, frameHeight: number): void {
            let width: number = frameWidth;
            let height: number = frameHeight;

            switch (this._scaleConfig.policy) {
                // case AutoScalePolicy.FIXED_HEIGHT:
                //     break;
                // case AutoScalePolicy.FIXED_WIDTH:
                //     break;
                // case AutoScalePolicy.FIT_ALL:
                //     break;
                // case AutoScalePolicy.SHOW_ALL:
                default:
                    this.size.rendererScaleX = width / this._scaleConfig.width;
                    this.size.rendererScaleY = height / this._scaleConfig.height;
            }


            // let scaleY = this.autoScaleConfig.height / height;
            // let width = this.autoScaleConfig.width / scaleY;

            // if (width > frameWidth) {
            //     let scaleX = frameWidth / width;
            //     height *= scaleX;
            //     width = frameWidth;
            // }

            this.size.center.x = this._scaleConfig.width / 2;
            this.size.center.y = this._scaleConfig.height / 2;
            this.size.left = 0;
            this.size.right = this._scaleConfig.width;
            this.size.top = 0;
            this.size.bottom = this._scaleConfig.height;
            this.size.rendererWidth = width;
            this.size.rendererHeight = height;

            this._stage.scale.set(this.size.rendererScaleX, this.size.rendererScaleY);
            this._renderer.resize(width, height);
        }

        // private methods

        private _update(current: number): void {
            if (!this._start) {
                return;
            }

            let dt = (this._timestamp) ? (current - this._timestamp) / 1000 : 1.0 / 60.0;

            this._lastSeconds += dt;
            if (this._lastSeconds >= 1.0) {
                this._lastSeconds -= 1.0;
                this._tickCount++;
                console.log("[Director] tick " + this._tickCount.toString());
            }

            this._timestamp = current;
            this._renderer.render(this._stage);
            requestAnimationFrame(this._updateCall);
        }

    }

}

