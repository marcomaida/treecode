import { getShader } from "../drawing/drawing.js";
import { create_tree_mesh } from "./tree_mesh.js";
import { TreeSpecs } from "./tree_specs.js";
export class Tree {
    constructor(root, specs) {
      this.root = root
      this.specs = specs

      this.mesh = null
      this.pixiMesh = null
      this.buffer = null

      this.initialize_nodes(this.root)
    }

    /** Including the node itself, i.e., a leaf node has 1 descendant (itself) */
    initialize_nodes(node) {
      var num = 1
      for (const c of node.children){
        this.initialize_nodes(c)
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
      this.pixiMesh.position.set(100, window.innerHeight-50)
      app.stage.addChild(this.pixiMesh)
      this.mesh = this.buffer.data
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