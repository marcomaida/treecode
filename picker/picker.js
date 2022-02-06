import {getShader} from "./drawing.js";
import {bitsToTree} from "./converter.js";
import {BitStreamText} from "./bit_stream.js";

const app = new PIXI.Application();
document.body.appendChild(app.view);

const geometry = new PIXI.Geometry()
                    .addAttribute('aVertexPosition', [-100, -50, 100, -50, 0, 100, 100, 100, 200, 100, 300, 150]);
const triangle = new PIXI.Mesh(geometry, getShader());
triangle.position.set(400, 300);

app.stage.addChild(triangle);

var stream = new BitStreamText("Hello world")
var t = bitsToTree(stream)
console.log(t)

app.ticker.add((delta) => {
    triangle.rotation += 0.01;
});