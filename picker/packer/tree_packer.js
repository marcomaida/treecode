import { isBranchAreaIntersectingTree } from "./tree_collision.js"

export class Packer {
    constructor(tree) {
      this.tree = tree
      this.nodes = []
      this.initial_speed = 10
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
            const i = Math.ceil(Math.random() * (this.nodes.length -1)) // exclude root
            const node = this.nodes[i]

            var done = false
            var tries = 5
            while (! done) {
                const oldPos = node.position.clone()

                var dir = new PIXI.Vector((Math.random()-0.5)*2, (Math.random()-0.5)*2)
                dir.multiplyScalar(this.speed)
                dir.add(node.father.position.clone().sub(oldPos).normalize().multiplyScalar(this.speed/1.9))

                const newPos = oldPos.clone().add(dir)
                node.setPosition(newPos)
                
                if (! this.isAcceptable(node)) {
                    node.setPosition(oldPos)
                    //this.speed += .1
                    tries --

                    if (tries <= 0)
                        done = true
                }
                else {
                    done = true
                    //this.speed = Math.max(this.speed - 3, this.initial_speed)
                }
            }
        }
    }


    isAcceptable(node) {
        var tooShort = false
        if (node.father !== null)
            tooShort = node.position.distanceTo(node.father.position) < 30

        return !tooShort && !isBranchAreaIntersectingTree(node)
    }
}