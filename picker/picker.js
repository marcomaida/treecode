import {getShader} from "./drawing/drawing.js"
import {bitsToTree} from "./conversion/converter.js"
import {BitStreamText} from "./conversion/bit_stream.js"
import {} from "./geometry/vector.js"
import {} from "./geometry/math.js"
import { rectangleMesh } from "./geometry/geometry.js";
import { layout_wetherell_shannon } from "./tree/tree_layout.js";


var stream = new BitStreamText("Hello world!")
var t = bitsToTree(stream)
layout_wetherell_shannon(t)

const app = new PIXI.Application({
    width: window.innerWidth,
    height: window.innerHeight,
    resolution: 1
})

document.body.appendChild(app.view)
const geometry = new PIXI.Geometry()
                    .addAttribute('aVertexPosition', t.mesh)
const mesh = new PIXI.Mesh(geometry, getShader())
const buffer = mesh.geometry.getBuffer('aVertexPosition');
mesh.position.set(100, window.innerHeight-50)
app.stage.addChild(mesh)
t.mesh = buffer.data

const base = t.root.children[2].position
app.ticker.add((delta) => {
    var seconds = new Date().getTime() / 1000
    t.root.children[2].setPosition(base.clone().add(new PIXI.Vector(Math.cos(seconds*3)*50,Math.sin(seconds*3)*50)))
    buffer.update()
})