import { rectangleMesh } from "./geometry.js";

export class TreeNode {
    constructor(children=[]) {
      this.children = children;
      this.verticesIndex = -1;
    }
  
    get isLeaf() {
      return this.children.length === 0;
    }
  }
  
export class Tree {
    constructor(root, thickness = 5, branch_length = 20) {
      this.root = root
      this.thickness = thickness
      this.branch_length = branch_length

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
                                              .add(new PIXI.Vector(0, -this.branch_length))
                                             // .setX(0)
          per_layer.push(new_point)
        }

        vertices.push(...rectangleMesh(per_layer[depth-1], per_layer[depth], this.thickness))

        for (const c of node.children){
          this.makeMesh(c, vertices, per_layer, depth+1)
        }

        per_layer[depth].add(new PIXI.Vector(this.branch_length, 0))
      }
      else {
        per_layer = [new PIXI.Vector(0, 0)]

        for (const c of node.children){
          this.makeMesh(c, vertices, per_layer, depth+1)
        }
      }
    }
  }