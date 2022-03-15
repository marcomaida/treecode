let graphics = null

export function initDebug(app) {
    graphics = new PIXI.Graphics();
    app.stage.addChild(graphics);
}

export function drawCircle(center, radius) {
    graphics.beginFill(0xAA4F08);
    graphics.drawCircle(center.x, center.y, radius);
    graphics.endFill();
}

export function clearDebug() {
    graphics.clear()
}