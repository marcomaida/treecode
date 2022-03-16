import { scalePolygon } from "../geometry/geometry.js";
import { jointVertices, vertexToVec } from "./tree_mesh.js";

const COLLIDER_SCALE = 1.5

export class TreeNode {
    constructor(father, children=[]) {
      this.father = father
      this.children = children;
      this.numDescendants = 0

      this.vertices_start_left  = []
      this.vertices_start_right = []
      this.vertices_end_left    = []
      this.vertices_end_right   = []

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
        jointVertices(this.father.position, this.position, thickness, this.vertices_start_left, this.vertices_start_right, this.tree.mesh)
        jointVertices(this.position, this.father.position, thickness, this.vertices_end_right, this.vertices_end_left, this.tree.mesh)
      }
      else
        jointVertices(this.position, new PIXI.Vector(0,0), thickness, this.vertices_end_right, this.vertices_end_left, this.tree.mesh)

      // Setting this children branch position
      for (const c of this.children)
        jointVertices(this.position, c.position, thickness, c.vertices_start_left, c.vertices_start_right, this.tree.mesh)

      if (this.father === null) {
        this.colliderPolygon = []
      }
      else {
        // Building collider from mesh, a bit dirty
        const sl = vertexToVec(this.vertices_start_left[0],this.tree.mesh)
        const sr = vertexToVec(this.vertices_start_right[0],this.tree.mesh)
        const el = vertexToVec(this.vertices_end_left[0],this.tree.mesh)
        const er = vertexToVec(this.vertices_end_right[0],this.tree.mesh)
        this.colliderPolygon = [sl,sr,er,el]

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