import {getShader} from "./drawing/drawing.js"
import {bitsToTree} from "./conversion/converter.js"
import {BitStreamText} from "./conversion/bit_stream.js"
import {} from "./geometry/vector.js"
import { rectangleMesh } from "./geometry/geometry.js";


var stream = new BitStreamText("Hello world!")
var t = bitsToTree(stream)

const app = new PIXI.Application()
document.body.appendChild(app.view)
const geometry = new PIXI.Geometry()
                    .addAttribute('aVertexPosition', t.vertices)
const mesh = new PIXI.Mesh(geometry, getShader())
mesh.position.set(100, 500)
app.stage.addChild(mesh)

// app.ticker.add((delta) => {
//     triangle.rotation += 0.01
// })
