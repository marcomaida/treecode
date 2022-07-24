import {bitsToTree} from "../conversion/converter.js"
import {BitStreamText} from "../conversion/bit_stream.js"
import {} from "../geometry/vector.js"
import {} from "../geometry/math.js"
import { set_layout } from "../tree/tree_layout.js";
import { Packer } from "../packer/tree_packer.js"
import { clearDebug, initDebug } from "../drawing/debug.js"
import { treeIterator } from "../tree/tree.js"
import { isBranchIntersectingTree } from "../packer/tree_collision.js";
import { TreeSpecs } from "../tree/tree_specs.js";

//****** Setting up page */

const canvasDiv = document.getElementById("canvasDiv")
const inputTextBox = document.getElementById("inputText")
inputTextBox.select()
inputTextBox.focus()

const canvasheight = window.innerHeight-170

const app = new PIXI.Application({
    width: window.innerWidth,
    height: canvasheight, // Todo do properly
    resolution: 1
})
initDebug(app)

canvasDiv.appendChild(app.view)
document.body.scrollTop = 0; // <-- pull the page back up to the top
document.body.style.overflow = 'hidden'; // <-- relevant addition

var current_tree = null
var current_ticker = null

//****** Updating tree */

function updateTree() {
    if (current_tree !== null)
        current_tree.destroyMesh(app)
    if (current_ticker !== null)
        app.ticker.remove(current_ticker)

    var inputText = document.getElementById("inputText").value
    var stream = new BitStreamText(inputText)
    var specs = new TreeSpecs()

    current_tree = bitsToTree(stream, specs)
    current_tree.initializeMesh(app, new PIXI.Vector(window.innerWidth/2, canvasheight/1.2))
    set_layout(current_tree)

    var packer = new Packer(current_tree)
    current_ticker = (delta) => {
        console.log(inputTextBox.value)
        packer.tick_many((inputTextBox.value.length+1)*30)
        current_tree.buffer.update()
    }
    app.ticker.add(current_ticker)
}

updateTree()
inputTextBox.addEventListener('input', updateTree);
