export class TreeNode {
    constructor(father, children=[]) {
      this.father = father
      this.children = children;
      this.num_descendants = 0
      this.vertices_left = [];
      this.vertices_right = [];
      this.position = 0
      this.tree = null
    }

    // sets node position and updates all the mesh points
    setPosition(pos){
      this.position = pos

      const thickness = this.tree.specs.thicknessAt(this)
      
      //if (this.father === null) {
        const left = this.position.add(new PIXI.Vector(thickness/2))
        const right = left.clone().add(new PIXI.Vector(thickness))
      //}

      for (const vi of this.vertices_left) {
        this.tree.mesh[vi] = left.x
        this.tree.mesh[vi+1] = left.y
      }
      for (const vi of this.vertices_right) {
        this.tree.mesh[vi] = right.x
        this.tree.mesh[vi+1] = right.y
      }
    }
  
    get isLeaf() {
      return this.children.length === 0;
    }
  }