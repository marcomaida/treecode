import {bitsToTree} from "../conversion/converter.js"
import {BitStreamText} from "../conversion/bit_stream.js"
import {} from "../geometry/vector.js"
import {} from "../geometry/math.js"
import { layout_wetherell_shannon } from "../tree/tree_layout.js";
import { Packer } from "../packer/tree_packer.js"
import { clearDebug, drawCircle, initDebug } from "../drawing/debug.js"
import { treeIterator } from "../tree/tree.js"

var stream = new BitStreamText("Hello world!")
var t = bitsToTree(stream)

const app = new PIXI.Application({
    width: window.innerWidth,
    height: window.innerHeight,
    resolution: 1
})
initDebug(app)

document.body.appendChild(app.view)
t.initializeMesh(app)

layout_wetherell_shannon(t)

var i = 0
var packer = new Packer(t)

var node = t.root.children[2].children[2]
//var base = node.position.clone()

//const base = t.root.position
//t.root.children[2].children[2].setPosition(t.root.children[2].children[2].position.add(new PIXI.Vector(-130,120)))
app.ticker.add((delta) => {
    //var seconds = new Date().getTime() / 1000
    //t.root.children[0].setPosition(base.clone().add(new PIXI.Vector(Math.cos(seconds/2)*50,Math.sin(seconds/2)*50)))
    packer.tick(10)
    i += 1

    if (i % 10000 == 0)
        layout_wetherell_shannon(t)

    t.buffer.update()
    clearDebug()
    for (var c of treeIterator(t))
    {
        for (var vec of c.colliderPolygon)
            drawCircle(t.transformPosition(vec), 4)
    }
    
    //console.log(isBranchIntersectingTree(t.root.children[2].children[2].children[1]))
})
