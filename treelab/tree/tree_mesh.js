
export function create_tree_mesh(tree) {
    var mesh = Array((tree.root.numDescendants-1) * 12).fill(0) // each branch has 2 triangles, so 12 coordinates
    initialize_nodes_mesh(tree.root)
    return mesh
}

/**
 * This function maps each node of the tree with a set of indices
 * of the vertices array that must be at the same position as the node.
 * 
 * The branch mesh is composed of two triangles:
 *    (node)
 *   c ___ d
 *    |\  |     mesh vertices: [ax,ay,bx,by,cx,cy,bx,by,cx,cy,dx,dy]
 *    | \ |     
 *    |__\|       
 *   a     b    
 *   (father)
 */
export function initialize_nodes_mesh(node, next_free_index=0) {
    if (node.father !== null){
        // first triangle
        const a1 = next_free_index
        const b1 = a1+2
        const c1 = a1+4
        // second triangle
        const b2 = a1+6
        const c2 = a1+8
        const d2 = a1+10

        node.vertices_start_left  = [a1]
        node.vertices_start_right = [b1,b2]
        node.vertices_end_left    = [c1,c2]
        node.vertices_end_right   = [d2]

        next_free_index += 12
    }

    for (const c of node.children) {
        next_free_index = initialize_nodes_mesh(c, next_free_index)
    }

    return next_free_index
}

/**
 * Moves the given left vertices and right vertices so that they are positioned on a circle
 * with center `start` and with radius `thickness`, on a line perpendicular to the direction
 * `end-start` 
 *      END
 *  /        /
 * /        /
 * L START R
 */
export function jointVertices(start, end, thickness, left_vertices, right_vertices, mesh) {
    var dir = end.clone()
                .sub(start)
                .normalize()
                .multiplyScalar(thickness/2)
                .perpendicular(false) // anti-clockwise
    var cpos = start.clone()
                    .add(dir)

    for (const vi of left_vertices) {
        mesh[vi] = cpos.x
        mesh[vi+1] = cpos.y
    }

    dir.multiplyScalar(-2)
    cpos.add(dir)

    for (const vi of right_vertices) {
        mesh[vi] = cpos.x
        mesh[vi+1] = cpos.y
    }
}

/**  
 * Converts a vertex in a mesh to a vector
*/
export function vertexToVec(v, mesh){
    return new PIXI.Vector(mesh[v], mesh[v+1])
}