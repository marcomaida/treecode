import {getShader} from "./shader.js";

const app = new PIXI.Application();
document.body.appendChild(app.view);

const geometry = new PIXI.Geometry()
    .addAttribute('aVertexPosition', [-100, -50, 100, -50, 0, 100]);

const shader = getShader()

const triangle = new PIXI.Mesh(geometry, shader);

triangle.position.set(400, 300);

app.stage.addChild(triangle);

app.ticker.add((delta) => {
    //triangle.rotation += 0.01;
});