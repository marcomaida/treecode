import { springAngle, springNeighbors, springRandom } from "./springs.js"
import { isBranchAreaIntersectingTree } from "./tree_collision.js"

export class Packer {
    constructor(tree) {
      this.tree = tree
      this.nodes = []
      this.initial_speed = 5
      this.speed = this.initial_speed
      this.init(tree.root)
    }

    init(node) {
        this.nodes.push(node)

        for (const c of node.children) {
            this.init(c)
        }
    }

    tick(steps) {
        for (var n = 0; n < steps; n++) {
            this.tick()
        }
    }

    tick() {
        // Pick random node
        const i = Math.ceil(Math.random() * (this.nodes.length -1)) // exclude root
        const node = this.nodes[i]

        var done = false
        var tries = 5
        while (! done) {
            const oldPos = node.position.clone()

            var dir = new PIXI.Vector(0,0)
            dir.add(springNeighbors(node).multiplyScalar(this.speed))
            dir.add(springRandom(node).multiplyScalar(this.speed))
            dir.add(springAngle(node).multiplyScalar(this.speed))

            const newPos = oldPos.clone().add(dir)
            node.setPosition(newPos)
            
            if (! this.isAcceptable(node)) {
                node.setPosition(oldPos)
                //this.speed += .1
                tries --

                if (tries <= 0) done = true 
            }
            else {
                done = true
            }
        }
    }

    isAcceptable(node) {
        var tooShort = false
        if (node.father !== null)
            tooShort = node.position.distanceTo(node.father.position) < node.tree.specs.minBranchLength

        for (const c of node.children) {
            if (tooShort) 
                break
                
            tooShort = node.position.distanceTo(c.position) < node.tree.specs.minBranchLength
        }
        
        return !tooShort && !isBranchAreaIntersectingTree(node)
    }
}