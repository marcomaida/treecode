import { clearDebug, drawDebugArrow } from "../drawing/debug.js"
import { springNeighborsDistance, springNeighborsAngle, springRandom, springNeighborsAngleSpine, springNeighborsSeed } from "./springs.js"
import { isBranchAreaIntersectingTree } from "./tree_collision.js"

export class Packer {
    constructor(tree) {
      this.tree = tree
      this.nodes = []
      this.initial_speed = 5
      this.speed = this.initial_speed
      this.decay = .999998
      this.init(tree.root)
    }

    init(node) {
        this.nodes.push(node)

        for (const c of node.children) {
            this.init(c)
        }
    }

    tick_many(steps) {
        for (var n = 0; n < steps; n++) {
            this.tick()
        }
    }

    tick() {

        // Pick speed
        if (this.speed <= 0)
            return
        
        var speed = this.speed
        this.speed *= this.decay
        if (this.speed <= 0.001) this.speed = 0

        // Pick random node
        const i = Math.ceil(Math.random() * (this.nodes.length -2)) // exclude root and first child
        const node = this.nodes[i+1]

        // Determine direction (no random)

        var dir = new PIXI.Vector(0,0)

        const father_multiplier = 3
        dir.add(springNeighborsDistance(node, father_multiplier))
        dir.add(springNeighborsAngleSpine(node))
        //dir.add(springNeighborsAngle(node))
        //dir.add(springNeighborsSeed(node).multiplyScalar(speed/3))

        // Try to move. If fail, retry adding random
        dir.normalize()
        dir.multiplyScalar(speed)

        var done = false
        var tries = 3
        var random_speed = dir.length()
        while (! done) {
            const oldPos = node.position.clone()
            const newPos = oldPos.clone().add(dir)
            node.setPosition(newPos)
            
            const acceptable = this.isAcceptable(node)
            if (! acceptable) {
                node.setPosition(oldPos)

                dir.add(springRandom(node).multiplyScalar(random_speed))
                //this.speed += .1
                tries --
                dir.multiplyScalar(1.0005)
                if (tries <= 0) done = true 
            }
            else {
                done = true
            }

            // clearDebug()
            // var color = (acceptable ? 0x22AA22 : 0xAA2222)
            // drawDebugArrow(node.tree.transformPosition(node.position.clone()), 
            //                node.tree.transformPosition(node.position.clone()).add(dir.clone().multiplyScalar(10)),
            //               3, color)
        }
    }

    isAcceptable(node) {
        var tooShort = false
        if (node.father !== null)
            tooShort = node.position.distanceTo(node.father.position) < node.tree.specs.min_branch_length

        for (const c of node.children) {
            if (tooShort) 
                break
                
            tooShort = node.position.distanceTo(c.position) < node.tree.specs.min_branch_length
        }
        
        return !tooShort && !isBranchAreaIntersectingTree(node)
    }
}