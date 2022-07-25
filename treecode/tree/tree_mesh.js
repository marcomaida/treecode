const NUM_JOINT_SEGMENTS = 5
const NUM_SEED_SEGMENTS = 25
export const SEED_RING_OUTER_RADIUS = 20
const SEED_RING_INNER_RADIUS = SEED_RING_OUTER_RADIUS * .85
const SEED_CIRCLE_RADIUS = SEED_RING_INNER_RADIUS * .8

export function create_tree_mesh(tree) {
    /**  You need 6 elements for one triangle.
         You need 12 elements for one quad polygon.
         The tree mesh has 1) branches, 2) joints, 3) the seed
    */
    const branches_size = (tree.root.numDescendants-1) * 12
    const tree_size = branches_size + (tree.root.numDescendants-1) * NUM_JOINT_SEGMENTS * 6
    const tree_and_seed_size = tree_size + NUM_SEED_SEGMENTS * (12 /*ring*/ + 6 /*circle*/)
    tree.seedPosition = tree_size
    var mesh = Array(tree_and_seed_size).fill(0)
    initialize_nodes_mesh(tree.root, 0, branches_size)

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
export function initialize_nodes_mesh(node, next_node_index, next_joint_index) {
    if (node.father !== null){
        // first triangle
        const a1 = next_node_index
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

        next_node_index += 12

        node.vertices_joint = next_joint_index
        next_joint_index += NUM_JOINT_SEGMENTS * 6
    }

    for (const c of node.children) {
        [next_node_index, next_joint_index] = initialize_nodes_mesh(c, next_node_index, next_joint_index)
    }

    return [next_node_index, next_joint_index]
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

    for (const vi of right_vertices) {
        mesh[vi] = cpos.x
        mesh[vi+1] = cpos.y
    }

    dir.multiplyScalar(-2)
    cpos.add(dir)

    for (const vi of left_vertices) {
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

export function drawJoint(node) {
    const posStart = vertexToVec(node.vertices_end_right[0], node.tree.mesh)
    // const angleStart = posStart.sub(node.position).rad() - Math.PI/2

    const angleStart = node.direction.perpendicular(true).rad()

    for (var i = 0; i < NUM_JOINT_SEGMENTS; i ++) {
        const anglea = i/NUM_JOINT_SEGMENTS * Math.PI + angleStart
        const angleb = (i+1)/NUM_JOINT_SEGMENTS * Math.PI + angleStart

        const thickness = node.tree.specs.thicknessAt(node)
        const posA = new PIXI.Vector(Math.cos(anglea), Math.sin(anglea))
        const posB = new PIXI.Vector(Math.cos(angleb), Math.sin(angleb))
        posA.multiplyScalar(thickness/2).add(node.position)
        posB.multiplyScalar(thickness/2).add(node.position)
        const mesh = node.tree.mesh
        const ib = node.vertices_joint + i * 6

        mesh[ib  ] = node.position.x
        mesh[ib+1] = node.position.y
        mesh[ib+2] = posA.x
        mesh[ib+3] = posA.y
        mesh[ib+4] = posB.x
        mesh[ib+5] = posB.y
    }
}

/**
 * Drawing a ring and a circle
 *
 * rc ___  rd
 *    \\  \
 *     \ \ \
 *      \__\\
 *     ra      rb
 *
 *
 * Circle:
 *   c  ______  cb
 *     .\    /
 *    .  \  /
 *   .....\/ ca
 *
 */
export function drawSeed(tree) {
    const mesh = tree.mesh

    var ri = tree.seedPosition  // ring start position
    var ci = ri + NUM_SEED_SEGMENTS * 12 //circle start position

    const c = tree.root.position.clone()

    var ra = null
    var rb = null
    var rc = new PIXI.Vector(1 * SEED_RING_INNER_RADIUS, 0).add(c)
    var rd = new PIXI.Vector(1 * SEED_RING_OUTER_RADIUS, 0).add(c)
    var ca = null
    var cb = new PIXI.Vector(1 * SEED_CIRCLE_RADIUS, 0).add(c)

    for (var i = 1; i <= NUM_SEED_SEGMENTS; i ++) {
        ra = rc
        rb = rd
        ca = cb

        const angle = i / NUM_SEED_SEGMENTS * 2 * Math.PI
        const dir = new PIXI.Vector(Math.cos(angle), Math.sin(angle))

        rc = c.clone().add(dir.clone().multiplyScalar(SEED_RING_INNER_RADIUS))
        rd = c.clone().add(dir.clone().multiplyScalar(SEED_RING_OUTER_RADIUS))
        cb = c.clone().add(dir.clone().multiplyScalar(SEED_CIRCLE_RADIUS))

        mesh[ri   ] = ra.x
        mesh[ri+ 1] = ra.y
        mesh[ri+ 2] = rb.x
        mesh[ri+ 3] = rb.y
        mesh[ri+ 4] = rc.x
        mesh[ri+ 5] = rc.y
        mesh[ri+ 6] = rb.x
        mesh[ri+ 7] = rb.y
        mesh[ri+ 8] = rc.x
        mesh[ri+ 9] = rc.y
        mesh[ri+10] = rd.x
        mesh[ri+11] = rd.y
        ri+=12

        mesh[ci   ] = c.x
        mesh[ci+ 1] = c.y
        mesh[ci+ 2] = ca.x
        mesh[ci+ 3] = ca.y
        mesh[ci+ 4] = cb.x
        mesh[ci+ 5] = cb.y
        ci += 6
    }
}
