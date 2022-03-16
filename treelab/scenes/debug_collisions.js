import {} from "../geometry/vector.js"
import {} from "../geometry/math.js"
import { clearDebug, drawPolygon, drawCircle, initDebug } from "../drawing/debug.js"
import { doPolygonsIntersect } from "../geometry/geometry.js"

const app = new PIXI.Application({
    width: window.innerWidth,
    height: window.innerHeight,
    resolution: 1
})
initDebug(app)

document.body.appendChild(app.view)

var p1 = [new PIXI.Vector(100,100),
            new PIXI.Vector(200,200),
            new PIXI.Vector(400,200),
            new PIXI.Vector(400,100)]

var p2 = [new PIXI.Vector(100,100),
        new PIXI.Vector(200,200),
        new PIXI.Vector(400,200),
        new PIXI.Vector(400,100)]

p2.map(p=>p.add(new PIXI.Vector(250,70)))

const RED = 0xAA2222
const GREEN = 0x22AA22

var d1 = new PIXI.Vector(1, 1)
var d2 = new PIXI.Vector(-1, 1)

app.ticker.add((delta) => {
    //drawCircle(100, 40)
    clearDebug()

    const int = doPolygonsIntersect(p1, p2)
    const color =  int ? RED : GREEN
    drawPolygon(p1, color)
    drawPolygon(p2, color)

    var speed = 10
    var d1t = d1.clone().multiplyScalar(delta * speed)
    var d2t = d2.clone().multiplyScalar(delta * speed)

    p1.map(p=> p.add(d1t))
    p2.map(p=> p.add(d2t))
    //p1.map(p=> p.add(new PIXI.Vector((Math.random()-0.5)*10, (Math.random()-0.5)*10)))
    //p2.map(p=> p.add(new PIXI.Vector((Math.random()-0.5)*10, (Math.random()-0.5)*10)))

    if (p1[0].x < 0 || p1[0].x > 700) {
        d1.x = -d1.x
    }
    if (p1[0].y < 0 || p1[0].y > 600) {
        d1.y = -d1.y
    }

    if (p2[0].x < 0 || p2[0].x > 700) {
        d2.x = -d2.x
    }
    if (p2[0].y < 0 || p2[0].y > 600) {
        d2.y = -d2.y
    }
})
