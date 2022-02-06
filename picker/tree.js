import { rectangle } from "./geometry.js";

export class TreeNode {
    constructor(children=[]) {
      this.children = children;
      this.vertices = -1;
    }
  
    get isLeaf() {
      return this.children.length === 0;
    }
  }
  
export class Tree {
    constructor(root, thickness = 10) {
      this.root = root;
    }

    makeMesh(node, vertices=[], per_layer=[], depth=0){
      vertices.append(rectangle())
    }
  }