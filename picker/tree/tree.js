import { create_tree_mesh } from "./tree_mesh.js";
import { TreeSpecs } from "./tree_specs.js";
export class Tree {
    constructor(root) {
      this.root = root
      this.specs = new TreeSpecs()
      this.initialize_nodes(this.root)
      create_tree_mesh(this)
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
  }