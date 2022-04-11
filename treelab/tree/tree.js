import { getShader } from "../drawing/drawing.js";
import { circlePolygon } from "../geometry/geometry.js";
import { create_tree_mesh, drawSeed, SEED_RING_OUTER_RADIUS } from "./tree_mesh.js";
import { TreeSpecs } from "./tree_specs.js";

const SEED_COLLIDER_SEGMENTS = 10

export class Tree {
    constructor(root, specs) {
      this.root = root
      this.specs = specs

      this.mesh = null
      this.seedPosition = null
      this.pixiMesh = null
      this.buffer = null

      this.initialize_nodes(this.root, "X")
    }

    /** Including the node itself, i.e., a leaf node has 1 descendant (itself) */
    initialize_nodes(node, prefix) {
      node.label = prefix
      var num = 1
      for (const [i, c] of node.children.entries()) {
        this.initialize_nodes(c, prefix + i.toString())
        num += c.numDescendants
      }
      node.numDescendants = num
      node.tree = this
    }

    initializeMesh(app) {
      const vertices = create_tree_mesh(this)

      const geometry = new PIXI.Geometry()
                              .addAttribute('aVertexPosition', vertices)
      this.pixiMesh = new PIXI.Mesh(geometry, getShader())
      this.buffer = this.pixiMesh.geometry.getBuffer('aVertexPosition');
      this.pixiMesh.position.set(window.innerWidth/2, window.innerHeight/2)
      app.stage.addChild(this.pixiMesh)
      this.mesh = this.buffer.data

      drawSeed(this)
    }

    seedCollider() {
      var r = SEED_RING_OUTER_RADIUS*1.2 //TODO more science, this is a random number
      this.root.colliderPolygon = circlePolygon(this.root.position, r, SEED_COLLIDER_SEGMENTS)
    }

    transformPosition(vec) {
      return vec.add(new PIXI.Vector(this.pixiMesh.position.x, this.pixiMesh.position.y))
    }
  }

export function* treeIterator(tree) {
    var node = tree.root
    var frontier = [node]

    while (frontier.length > 0) { 
      node = frontier.shift()
      frontier.push(...node.children) 
      yield node
    }
}