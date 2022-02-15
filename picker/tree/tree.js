import { rectangleMesh } from "../geometry/geometry.js";
import { TreeSpecs } from "./tree_specs.js";

export class TreeNode {
    constructor(father, children=[]) {
      this.father = father
      this.children = children;
      this.vertices = [];
      this.position = 0
    }

    setPosition(pos, mesh){
      this.position = pos
      for (const vi of this.vertices) {
        mesh[vi] = pos.x
        mesh[vi+1] = pos.y
      }
    }
  
    get isLeaf() {
      return this.children.length === 0;
    }
  }
  
export class Tree {
    constructor(root) {
      this.root = root
      this.specs = new TreeSpecs()

      var vertices = []
      this.makeMesh(this.root, vertices)
      this.vertices = vertices
    }

    children_count(node) {
      children = 1
      for (c of node.children){
        children += self.children_count(c)
      }
      return children
    }

    makeMesh(node, vertices=[], per_layer=[], depth=0){
      if (depth !== 0) {
        if (per_layer.length <= depth) {
          const new_point = per_layer[depth-1].clone()
                                              .add(new PIXI.Vector(0, -this.specs.branch_length))
                                             // .setX(0)
          per_layer.push(new_point)
        }

        vertices.push(...rectangleMesh(per_layer[depth-1], per_layer[depth], this.specs.thickness))

        for (const c of node.children){
          this.makeMesh(c, vertices, per_layer, depth+1)
        }

        per_layer[depth].add(new PIXI.Vector(this.specs.branch_length, 0))
      }
      else {
        per_layer = [new PIXI.Vector(0, 0)]

        for (const c of node.children){
          this.makeMesh(c, vertices, per_layer, depth+1)
        }
      }
    }
  }