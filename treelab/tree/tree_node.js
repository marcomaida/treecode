import { coatPolygon, scalePolygon } from "../geometry/geometry.js";
import { drawJoint, jointVertices, vertexToVec } from "./tree_mesh.js";
export class TreeNode {
    constructor(father, children=[]) {
      this.father = father
      this.children = children;
      this.numDescendants = 0
      this.label = null

      this.vertices_start_left  = []
      this.vertices_start_right = []
      this.vertices_end_left    = []
      this.vertices_end_right   = []
      this.vertices_joint = 0

      this.colliderPolygon = null
      this.position = new PIXI.Vector(0,0)
      this.tree = null
    }

    // sets node position and updates all the mesh points
    setPosition(pos){
      this.position = pos.clone()

      const thickness = this.tree.specs.thicknessAt(this)
    
      // Setting this branch position
      if (this.father !== null)
      {
        jointVertices(this.father.position, this.position, this.tree.specs.thicknessAt(this.father), this.vertices_start_left, this.vertices_start_right, this.tree.mesh)
        jointVertices(this.position, this.father.position, thickness, this.vertices_end_right, this.vertices_end_left, this.tree.mesh)
      }
      else
        jointVertices(this.position, new PIXI.Vector(0,0), thickness, this.vertices_end_right, this.vertices_end_left, this.tree.mesh)

      // Setting this children branch position
      for (const c of this.children) {
        jointVertices(this.position, c.position, thickness, c.vertices_start_left, c.vertices_start_right, this.tree.mesh)
        c.colliderFromMesh()
        drawJoint(c)
        //coatPolygon(c.colliderPolygon, c.tree.specs.colliderCoating)
      }

      this.colliderFromMesh()
      drawJoint(this)

      //scalePolygon(this.colliderPolygon, this.tree.specs.colliderCoating)
      coatPolygon(this.colliderPolygon, this.tree.specs.colliderCoating)
    }

    colliderFromMesh() {
      const thickness = this.tree.specs.thicknessAt(this)

      if (this.father === null) {
        this.tree.seedCollider() 
      }
      else {
        // Building collider from mesh, a bit dirty
        const sl = vertexToVec(this.vertices_start_left[0],this.tree.mesh)
        const sr = vertexToVec(this.vertices_start_right[0],this.tree.mesh)
        const el = vertexToVec(this.vertices_end_left[0],this.tree.mesh)
        const er = vertexToVec(this.vertices_end_right[0],this.tree.mesh)

        // adding joint
        const extra = this.direction.normalize().multiplyScalar(thickness/2)
        el.add(extra)
        er.add(extra)

        this.colliderPolygon = [sr,sl,er,el]
      } 
    }
    
    get direction() {
      if (this.father === null)
        return new PIXI.Vector(0,-1)
      else
        return this.position.clone().sub(this.father.position)
    }
  
    // relative to father
    get relativePosition() {
      if (this.father === null)
        return this.position.clone()
      else
        return this.position.clone().sub(this.father.position)
    }
  
    get isLeaf() {
      return this.children.length === 0;
    }
  }