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
      
      // TODO handle the fact that picking the two points like this
      // does not define thickness, which has to be instead defined
      // before computing the ending points. 
      var left, right = null
      if (this.father === null) {
        left = this.position.add(new PIXI.Vector(thickness/2, 0))
        right = left.clone().add(new PIXI.Vector(thickness, 0))
      }
      else {
        right = pos.clone()
                   .sub(this.father.position)
                   .normalize()
                   .multiplyScalar(thickness/2)
                   .rotate(Math.PI/2)
        left = right.clone().rotate(-Math.PI)

        left.add(pos)
        right.add(pos)
      }
      // left = this.position.add(new PIXI.Vector(thickness/2, 0))
      // right = left.clone().add(new PIXI.Vector(thickness, 0))
      

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