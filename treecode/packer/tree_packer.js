import { clearDebug, drawDebugArrow } from "../drawing/debug.js"
import { springNeighborsDistance, springNeighborsAngle, springRandom, springNeighborsAngleSpine, springNeighborsSeed } from "./springs.js"
import { checkTreeAreaCollision } from "./tree_collision.js"

export class Packer {
    constructor(tree) {
      this.tree = tree
      this.nodes = []
      this.init(tree.root)
      this.initial_speed = 1+(Math.pow(1-(1/this.nodes.length),100))*20
      this.speed = this.initial_speed
      this.decay = .99+(Math.pow(1-(1/this.nodes.length),2))*.00999999
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
        // Pick random node
        const i = Math.ceil(Math.random() * (this.nodes.length -2)) // exclude root and first child
        const node = this.nodes[i+1]

        // Pick speed
        if (this.speed <= 0)
            return

        var speed = this.speed
        const bl = node.position.distanceTo(node.father.position)
        if (bl < node.tree.specs.lengthAt(node)*1.4) {
            this.speed *= this.decay
            if (this.speed <= 0.001) this.speed = 0
        }
        else {
            this.speed *= 1/this.decay
            if (this.speed > this.initial_speed)
                this.speed = this.initial_speed
        }

        // Determine direction (no random)

        var dir = new PIXI.Vector(0,0)

        const father_multiplier = 3
        dir.add(springNeighborsDistance(node, father_multiplier))
        dir.add(springNeighborsAngleSpine(node))
        dir.add(node.pushForce)
        node.pushForce.multiplyScalar(0)
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

            const tooShort = this.isTooShort(node)
            const orderViolated = this.hasViolatedOrder(node)
            var colliding = false
            if(!tooShort && !orderViolated) {
                const collision = checkTreeAreaCollision(node)
                if (collision !== null) {
                    colliding = true
                    collision.pushForce.add(dir)
                }
            }
            if (tooShort || colliding || orderViolated) {
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

    isTooShort(node) {
        var tooShort = false
        if (node.father !== null)
            tooShort = node.position.distanceTo(node.father.position) < node.tree.specs.min_branch_length

        for (const c of node.children) {
            if (tooShort)
                break

            tooShort = node.position.distanceTo(c.position) < node.tree.specs.min_branch_length
        }

        return tooShort
    }

    hasViolatedOrder(node) {
        if (node.father !== null) {
            const cs = node.father.children

            for (var i = 1; i < cs.length; i++) {
                if (!cs[i-1].angleFromFather > cs[i].angleFromFather)
                    return true
            }
        }

        return false
    }
}
