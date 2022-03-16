let graphics = null
const DEBUG_COLOR = 0x22AA22

export function initDebug(app) {
    graphics = new PIXI.Graphics();
    app.stage.addChild(graphics);
}

export function drawCircle(center, radius, color = DEBUG_COLOR) {
    graphics.beginFill(color);
    graphics.drawCircle(center.x, center.y, radius);
    graphics.endFill();
}

export function drawPolygon(points, color = DEBUG_COLOR) {
    graphics.beginFill(color);
    const pts = points.map(p => new PIXI.Point(p.x, p.y))
    graphics.drawPolygon(pts)
    graphics.endFill();
}

export function drawRegularPolygon(center, radius, sides, color = DEBUG_COLOR) {
    var points = []
    for (var i = 0; i < sides; i++) {
        const angle = i / sides * 2 * Math.PI
        var p = new PIXI.Vector(Math.cos(angle), Math.sin(angle))
        p.multiplyScalar(radius)
        p.add(center)
        points.push(p)
    }
    
    drawPolygon(points, color)
}

export function clearDebug() {
    graphics.clear()
}