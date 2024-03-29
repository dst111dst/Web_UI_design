class Utils {
    static getRandomNumber(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }
    static getRGBColor(r, g, b) {
        const rr = r || this.getRandomNumber(0, 255);
        const rg = g || this.getRandomNumber(0, 255);
        const rb = b || this.getRandomNumber(0, 255);
        return 'rgb(' + rr + ', ' + rg + ', ' + rb + ')';
    }
    static getHSLColor(hue, saturation, lightness) {
        const rHue = hue || this.getRandomNumber(0, 360);
        const rSaturation = saturation || this.getRandomNumber(0, 100);
        const rLightness = lightness || this.getRandomNumber(0, 100);
        return 'hsl(' + rHue + ', ' + rSaturation + '%, ' + rLightness + '%)';
    }
    static getGradientColor(ctx, type, cr, cg, cb, ca, x, y, r, ex, ey) {
        let col, g;
        switch (type) {
            case 'linear':
                col = cr + "," + cg + "," + cb;
                g = ctx.createLinearGradient(x, y, ex, ey);
                g.addColorStop(0, "rgba(" + col + ", " + ca * 1 + ")");
                g.addColorStop(0.5, "rgba(" + col + ", " + ca * 0.5 + ")");
                g.addColorStop(1, "rgba(" + col + ", " + ca * 0 + ")");
                return g;
                break;
            case 'radial':
                col = cr + "," + cg + "," + cb;
                g = ctx.createRadialGradient(x, y, 0, x, y, r);
                g.addColorStop(0, "rgba(" + col + ", " + ca * 1 + ")");
                g.addColorStop(0.5, "rgba(" + col + ", " + ca * 0.5 + ")");
                g.addColorStop(1, "rgba(" + col + ", " + ca * 0 + ")");
                return g;
                break;
            default:
                console.log('mistaken params');
                break;}

    }
    static getMultipleArray(yLength, xLength) {
        const multArr = new Array(yLength);
        for (let y = 0; y < yLength; y++) {
            multArr[y] = new Array(xLength);
            for (let x = 0; x < xLength; x++) {
                multArr[y][x] = 0;
            }
        }
        return multArr;
    }}



class Vector2d {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    add(v, x, y) {
        if (v instanceof Vector2d) {
            return new Vector2d(this.x + v.x, this.y + v.y);
        } else {
            this.x += x;
            this.y += y;
        }
    }

    sub(v, x, y) {
        if (v instanceof Vector2d) {
            return new Vector2d(this.x - v.x, this.y - v.y);
        } else {
            this.x -= x;
            this.y -= y;
        }
    }
    mult(v, num) {
        if (v instanceof Vector2d) {
            return new Vector2d(this.x * v.x, this.y * v.x);
        } else {
            this.x *= num;
            this.y *= num;
        }
    }
    fromAngle(radian) {
        this.x = Math.cos(radian);
        this.y = Math.sin(radian);
    }

    negate() {
        this.x = -this.x;
        this.y = -this.y;
    }

    rotate(radian) {
        const x = this.x;
        const y = this.y;
        const cosVal = Math.cos(radian);
        const sinVal = Math.sin(radian);
        this.x = x * cosVal - y * sinVal;
        this.y = x * sinVal + y * cosVal;
    }

    length() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    lengthSquared() {
        return this.x * this.x + this.y * this.y;
    }

  
    normalize() {
        const len = Math.sqrt(this.x * this.x + this.y * this.y);
        if (len) {
            this.x /= len;
            this.y /= len;
        }
        return len;
    }

    dotProduct(v) {
        return this.x * v.x + this.y * v.y;
    }

    edge(v) {
        return this.sub(v);
    }
    perpendicular() {
        const v = new Vector2d();
        v.x = this.y;
        v.y = 0 - this.x;
        return v;
    }

    /*
    * Return normalized vertical vector
    */
    normal() {
        const p = this.perpendicular();
        return p.normalize();
    }

    /*
    * Display vector by string
    */
    toString() {
        return '(' + this.x.toFixed(3) + ',' + this.y.toFixed(3) + ')';
    }}

class CollideWithCircle {

    constructor(array) {
        this.array = array;
    }

    collide() {
        const v = new Vector2d(0, 0);
        let dist, obj1, obj2;
        for (let c = 0; c < this.array.length; c++) {
            obj1 = this.array[c];
            for (let i = c + 1; i < this.array.length; i++) {
                obj2 = this.array[i];
                v.x = obj2.x - obj1.x;
                v.y = obj2.y - obj1.y;
                dist = v.length();
                if (dist < obj1.radius + obj2.radius) {
                    v.normalize();
                    v.mult(null, obj1.radius + obj2.radius - dist);
                    v.negate();
                    obj1.x += v.x;
                    obj1.y += v.y;
                    this.bounce(obj1, obj2);
                }
            }
        }
    }
    bounce(obj1, obj2) {
        const colnAngle = Math.atan2(obj1.y - obj2.y, obj1.x - obj2.x);
        const length1 = obj1.v.length();
        const length2 = obj2.v.length();
        const dirAngle1 = Math.atan2(obj1.v.y, obj1.v.x);
        const dirAngle2 = Math.atan2(obj2.v.y, obj2.v.x);
        const newVX1 = length1 * Math.cos(dirAngle1 - colnAngle);
        const newVX2 = length2 * Math.cos(dirAngle2 - colnAngle);
        obj1.v.y = length1 * Math.sin(dirAngle1 - colnAngle);
        obj2.v.y = length2 * Math.sin(dirAngle2 - colnAngle);
        obj1.v.x = ((obj1.radius - obj2.radius) * newVX1 + 2 * obj2.radius * newVX2) / (obj1.radius + obj2.radius);
        obj2.v.x = ((obj2.radius - obj1.radius) * newVX2 + 2 * obj1.radius * newVX1) / (obj1.radius + obj2.radius);
        obj1.v.rotate(colnAngle);
        obj2.v.rotate(colnAngle);
    }}


class Stopwatch {

    constructor() {
        this.startTime = null;
        this.elapsedTime = null;
        this.running = null;
        this.elapsedTimeForCalc = null;
        this.fps = null;
        this.lastTime = null;
    }

    calcTime() {
        const time = Date.now();
        this.elapsedTimeForCalc = time - this.lastTime;
        this.fps = 1000 / this.elapsedTimeForCalc;
        this.lastTime = time;
    }

    start() {
        this.startTime = Date.now();
        this.elapsedTime = null;
        this.running = true;
    }

    /*
    * Stop stop watch
    */
    stop() {
        this.elapsedTime = Date.now() - this.startTime;
        this.running = false;
    }

    getElapsedTime() {
        if (this.running) {
            return Date.now() - this.startTime;
        } else {
            return this.elapsedTime;
        }
    }

    isRunning() {
        return this.running;
    }


    reset() {
        this.elapsedTime = null;
    }}


class AnimationTimer {
    constructor(duration) {
        if (duration !== undefined) this.duration = duration;
        this.timeWarp = this.setTimeWarpFunction();
        this.stopwatch = new Stopwatch();
    }

    setTimeWarpFunction()
    {return this.makeEaseInOut();}

    start() {
        this.stopwatch.start();
    }

    stop() {
        this.stopwatch.stop();
    }

    getElapsedTime() {
        const elapsedTime = this.stopwatch.getElapsedTime();
        const percentComplete = elapsedTime / this.duration;
        if (!this.stopwatch.running) return undefined;
        if (this.timeWarp === undefined) return elapsedTime;
        return [elapsedTime * (this.timeWarp(percentComplete) / percentComplete), this.timeWarp(percentComplete)];
    }

    isRunning() {
        return this.stopwatch.running;
    }

    isOver() {
        return this.stopwatch.getElapsedTime() > this.duration;
    }

    makeEaseIn(strength) {
        const st = strength || 1;
        return percentComplete => {
            return Math.pow(percentComplete, st * 2);
        };
    }

    makeEaseOut(strength) {
        const st = strength || 1;
        return percentComplete => {
            return 1 - Math.pow(1 - percentComplete, st * 2);
        };
    }

    makeEaseInOut() {
        return percentComplete => {
            return percentComplete - Math.sin(percentComplete * 2 * Math.PI) / (2 * Math.PI);
        };
    }

    makeElastic(passes) {
        const pas = passes || 4;
        return percentComplete => {
            return (1 - Math.cos(percentComplete * Math.PI * pas)) * (1 - percentComplete) + percentComplete;
        };
    }

    makeBounce(bounces) {
        const bo = bounces || 5;
        const fn = this.makeElastic(bo);
        return percentComplete => {
            percentComplete = fn(percentComplete);
            return percentComplete <= 1 ? percentComplete : 2 - percentComplete;
        };
    }

    makeLinear() {
        return percentComplete => {
            return percentComplete;
        };
    }}

class Angle {
    /*
    * @constructor
    * @param {number} angle
    */
    constructor(angle) {
        this.a = angle;
        this.radian = this.a * Math.PI / 180;
    }

    getAngle() {
        return this.a;
    }

    /*
    * Return radian
    */
    getRadian() {
        return this.radian;
    }

    /*
    * Increase angle
    */
    increaseAngle(num) {
        this.a += num;
    }}


/**
 * Canvas
 */
class Canvas {
    constructor(bool) {
        // create canvas.
        this.canvas = document.createElement("canvas");
        // if on screen.
        if (bool === true) {
            this.canvas.style.position = 'relative';
            this.canvas.style.display = 'block';
            this.canvas.style.zIndex = '-1';
            this.canvas.style.backgroundColor = 'black';
            this.canvas.style.top = '0';
            this.canvas.style.left = '0';
            document.getElementsByTagName("body")[0].appendChild(this.canvas);
        }
        this.ctx = this.canvas.getContext("2d");
        this.width = this.canvas.width = window.innerWidth;
        this.height = this.canvas.height = window.innerHeight;
        // times
        this.times = null;
        // mouse infomation.
        this.mouseX = null;
        this.mouseY = null;
        this.mouseZ = null;
        // shape
        this.numberOfShapes = null;
        this.shapesArray = null;
    }

    init() {
        this.numberOfShapes = 200;
        this.shapesArray = [];
        this.times = new Stopwatch();
        for (let i = 0; i < this.numberOfShapes; i++) {
            const s = new Shape(this.ctx, this.width, this.height, i);
            this.shapesArray.push(s);
        }
    }

    render() {
        // times
        this.times.calcTime();
        // clear canvas
        this.ctx.clearRect(0, 0, this.width, this.height);
        // render
        for (let i = 0; i < this.shapesArray.length; i++) {
            this.shapesArray[i].render(Date.now());
        }
        // draw fps
        this.drawFPS();
        // itereation
        requestAnimationFrame(() => {
            this.render();
        });
    }

    drawFPS() {
        const ctx = this.ctx;
        ctx.save();
        ctx.fillStyle = 'white';
        ctx.font = '16px sans-serif';
        ctx.textAlign = 'right';
        ctx.textBaseline = 'bottom';
        ctx.fillText(this.times.fps.toFixed() + ' FPS', this.width, this.height);
        ctx.restore();
    }

    resize() {
        this.width = this.canvas.width = window.innerWidth;
        this.height = this.canvas.height = window.innerHeight;
        this.init();
    }}


/**
 * Shape class.
 */
class Shape {
    constructor(ctx, ww, wh, index) {
        this.ctx = ctx;
        this.ww = ww;
        this.wh = wh;
        this.init(index);
    }

    init(index) {
        this.index = index;
        // Coordinate
        this.x = this.ww * Math.random();
        this.y = this.wh + 15;
        // vector
        this.v = new Vector2d(0, -Math.random());
        // for animation
        this.AnimationTimer = new AnimationTimer(
            Utils.getRandomNumber(500, 5000),
            document.getElementsByTagName('select')[0].value,
            document.getElementsByTagName('input')[0].value);

        this.AnimationTimer.start();
        this.lastTime = null;
        // shape settings
        this.lineWidth = 1;
        this.radius = Math.random() * 10 + 5;
        this.fillColor = 'white';
        this.strokeColor = 'white';
        this.globalAlpha = 1;
        this.scalar = 200;
    }

    draw(time) {
        const ctx = this.ctx;
        ctx.save();
        ctx.globalAlpha = this.globalAlpha;
        ctx.lineWidth = this.lineWidth;
        ctx.fillStyle = this.fillColor;
        ctx.strokeStyle = this.strokeColor;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        ctx.fill();
        ctx.stroke();
        ctx.restore();
    }

    updatePositionTimeBased(elapsedTime, percentComplete) {
        const deltaX = this.v.x * this.scalar * elapsedTime;
        const deltaY = this.v.y * this.scalar * elapsedTime;
        this.x += deltaX;
        this.y += deltaY;
        this.globalAlpha = 1 - percentComplete;
    }

    judgeAnimation() {
        if (this.AnimationTimer.isRunning()) {
            const times = this.AnimationTimer.getElapsedTime();
            const animationElapsed = times[0] || 0.01;
            const percentComplete = times[1];
            if (this.lastTime !== null) {
                let elapsed = animationElapsed - this.lastTime;
                this.updatePositionTimeBased(elapsed / 1000, percentComplete);
            }
            if (this.AnimationTimer.isOver()) {
                this.AnimationTimer.stop();
                this.init(this.index);
                return;
            }
            this.lastTime = animationElapsed;
        }
    }

    render(nowTime) {
        this.draw(nowTime / 1000);
        this.judgeAnimation();
    }}



(() => {
    'use strict';
    window.addEventListener('load', () => {
        console.clear();
        const canvas = new Canvas(true);
        canvas.init();
        canvas.render();
        window.addEventListener("resize", () => {
            canvas.resize();
        }, false);
        canvas.canvas.addEventListener('mousemove', e => {
            canvas.mouseX = e.clientX;
            canvas.mouseY = e.clientY;
        }, false);

        // smartphone event
        let touchStartX, touchMoveX, touchEndX,
            touchStartY, touchMoveY, touchEndY;

        canvas.canvas.addEventListener('touchstart', e => {
            const touch = e.targetTouches[0];
            touchStartX = touch.pageX;
            touchStartY = touch.pageY;
        }, false);
        canvas.canvas.addEventListener('touchmove', e => {
            const touch = e.targetTouches[0];
            touchMoveX = touch.pageX;
            touchMoveY = touch.pageY;
            touchEndX = touchStartX - touchMoveX;
            touchEndY = touchStartY - touchMoveY;
            canvas.mouseX = touch.pageX;
            canvas.mouseY = touch.pageY;
        }, false);
        canvas.canvas.addEventListener('touchend', e => {
            touchStartX = null;
            touchStartY = null;
            touchMoveX = null;
            touchMoveY = null;
            touchEndX = null;
            touchEndY = null;
            canvas.mouseX = null;
            canvas.mouseY = null;
        }, false);
    }, false);
})();
