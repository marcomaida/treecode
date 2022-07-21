import {} from "../geometry/vector.js"
import {} from "../geometry/math.js"
import { clearDebug, drawDebugPolygon, drawDebugCircle, initDebug, drawDebugArrow } from "../drawing/debug.js"
import { coatPolygon, doPolygonsIntersect } from "../geometry/geometry.js"

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
    //drawDebugCircle(100, 40)
    clearDebug()

    const int = doPolygonsIntersect(p1, p2)
    const color =  int ? RED : GREEN
    drawDebugPolygon(p1, color)
    drawDebugPolygon(p2, color)
    drawDebugArrow (p1[0], p2[0], 10, 0x2222AA)

    var speed = 2
    var d1t = d1.clone().multiplyScalar(delta * speed)
    var d2t = d2.clone().multiplyScalar(delta * speed)

    //p1.map(p=> p.add(d1t))
    p2.map(p=> p.add(d2t))

    coatPolygon(p1, 1)
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
