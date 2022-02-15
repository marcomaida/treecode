
export function create_tree_mesh(tree) {
    tree.mesh = Array((tree.root.num_descendants-1) * 12).fill(0) // each branch has 2 triangles, so 12 coordinates
    initialize_nodes_mesh(tree.root)
}

/**
 * This function maps each node of the tree with a set of indices
 * of the vertices array that must be at the same position as the node.
 * 
 * The branch mesh is composed of two triangles:
 *    (node)
 *   c ___ d
 *    |\  |     mesh vertices: [ax,ay,bx,by,cx,cy,bx,by,cx,cy,dx,dy]
 *    | \ |     nodes-indices association:
 *    |__\|       (father).vertices_left => [0]    (father).vertices_right => [2,6] 
 *   a     b        (node).vertices_left => [4,8]    (node).vertices_right => [10]
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

        node.father.vertices_left.push(a1)
        node.father.vertices_right.push(b1,b2)
        node.vertices_left.push(c1,c2)
        node.vertices_right.push(d2)
        next_free_index += 12
    }

    for (const c of node.children) {
        next_free_index = initialize_nodes_mesh(c, next_free_index)
    }

    return next_free_index
}