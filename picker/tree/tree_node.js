import { scalePolygon } from "../geometry/geometry.js";

const COLLIDER_SCALE = 1.5

export class TreeNode {
    constructor(father, children=[]) {
      this.father = father
      this.children = children;
      this.numDescendants = 0
      this.vertices_left = []
      this.vertices_right = []
      this.colliderPolygon = null
      this.position = 0
      this.tree = null
    }

    // sets node position and updates all the mesh points
    setPosition(pos){
      this.position = pos.clone()

      const thickness = this.tree.specs.thicknessAt(this)
      
      // TODO handle the fact that picking the two points like this
      // does not define thickness, which has to be instead defined
      // before computing the ending points. 
      var left, right = null
      if (this.father === null) {
        left = this.position.clone().add(new PIXI.Vector(thickness/2, 0))
        right = left.clone().add(new PIXI.Vector(thickness, 0))
      }
      else {
        right = pos.clone()
                   .sub(this.father.position)
                   .normalize()
                   .multiplyScalar(thickness/2)
                   .perpendicular(false)
        left = right.clone().multiplyScalar(-1)

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

      if (this.father === null) {
        this.colliderPolygon = [left, right]
      }
      else {
        const father_polygon = this.father.colliderPolygon
        const n = father_polygon.length

        if (this.direction.angle(this.father.direction) > Math.PI/2)
          [left, right] = [right, left] // if angle is greater than 90 degrees, swap left and right (draw to understand)

        // Expects the father collider to have the last two elements as
        // the points of the children's collider
        this.colliderPolygon = [father_polygon[n-1].clone(), 
                                father_polygon[n-2].clone(), 
                                left, right]

        scalePolygon(this.colliderPolygon, COLLIDER_SCALE)
      }
    }
    
    get direction() {
      if (this.father === null)
        return new PIXI.Vector(0,1)
      else
        return this.position.clone().sub(this.father.position)
    }
  
    get isLeaf() {
      return this.children.length === 0;
    }
  }