import {} from "../geometry/vector.js"
import {} from "../geometry/math.js"
import { clearDebug, drawCircle, initDebug } from "../drawing/debug.js"

const app = new PIXI.Application({
    width: window.innerWidth,
    height: window.innerHeight,
    resolution: 1
})
initDebug(app)

document.body.appendChild(app.view)

app.ticker.add((delta) => {
    drawCircle(100, 40)
})
