import { BitStreamBitString, BitStreamText } from "../conversion/bit_stream.js";
import { bitsToTree, treeToBits } from "../conversion/converter.js";
import { TreeSpecs } from "../tree/tree_specs.js";
import {} from "../geometry/vector.js"
import {} from "../geometry/math.js"
import { initDebug } from "../drawing/debug.js";
import { set_layout } from "../tree/tree_layout.js";


const VISUALIZE_TREE = true

const log_text = document.createElement('div');
document.body.appendChild(log_text)

const ok_text = document.createElement('div');
document.body.appendChild(ok_text)
ok_text.style.fontSize = "x-large"

var app = null
if (VISUALIZE_TREE) {
    // Visualize tree
    app = new PIXI.Application({
       width: window.innerWidth,
       height: window.innerHeight-200,
       resolution: 1
   })
   initDebug(app)

   document.body.appendChild(app.view)
}

function tick(i) {
    var bits_input = i.toString(2)
    var stream = new BitStreamBitString(bits_input)
    const bits_stream = Array.from(stream.getStream())

    var specs = new TreeSpecs()
    var t = bitsToTree(stream, specs)
    var bits_decoded = treeToBits(t).toString()

    log_text.innerHTML = "######## " + i + "<br>" +
                        "Input........ " + bits_input + "<br>" +
                        "Decoded.. " + bits_decoded;

    if (VISUALIZE_TREE) {
        t.initializeMesh(app, new PIXI.Vector(100, (window.innerHeight-100)/1.3))
        set_layout(t)
    }

    return bits_input === bits_decoded
}

for (var i=0; i < 100000000; i++) {
    if (VISUALIZE_TREE) {
        for (var j = app.stage.children.length - 1; j >= 0; j--) {	app.stage.removeChild(app.stage.children[j]) }
    }

    const result = tick(i)

    if (result) {
        ok_text.innerHTML = "OK"
        ok_text.style.color = "green"
        await new Promise(resolve => setTimeout(resolve, 0.0001));
    }
    else {
        ok_text.innerHTML = "FAIL!"
        ok_text.style.color = "red"
        break
    }
}
