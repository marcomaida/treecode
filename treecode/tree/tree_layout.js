export function set_layout(tree) {
    reingold_tilford(tree.root)
}

/* Post-order visit based on
   https://rachel53461.wordpress.com/2014/04/20/algorithm-for-drawing-trees/

   GUARANTEES:
   1) All nodes are spaced *at least* the defined branch_length amount (therefore no overlaps)
   2) All nodes are centered with respect to their children
*/
function reingold_tilford(root) {
    set_initial_pos(root)
    add_x_mod(root)
    center_root(root)
    squareify_tree(root)
}

function set_initial_pos(node, depth=0) {
    for (const c of node.children)
        set_initial_pos(c, depth+1)

    const tree_spacing = node.tree.specs.initial_branch_length
    let x_pos = null
    if (node.isLeaf()) {
        if (node.isLeftmostSibling()) {
            x_pos = 0
        }
        else {
            x_pos = node.getLeftSibling().position.x + tree_spacing
        }
    }
    else if (node.children.length === 1) { // TODO simplify these two cases
        if (node.isLeftmostSibling()) {
            x_pos = node.children[0].position.x
        }
        else {
            x_pos = node.getLeftSibling().position.x + tree_spacing
            node.x_mod = x_pos - node.children[0].position.x // Actual x - desired x
        }
    }
    else {
        let rightmost_child = node.children[node.children.length - 1]
        let mid_x = (node.children[0].position.x + rightmost_child.position.x) / 2

        if (node.isLeftmostSibling()) {
            x_pos = mid_x
        }
        else {
            x_pos = node.getLeftSibling().position.x + tree_spacing
            node.x_mod = x_pos - mid_x // Actual x - desired x
        }
    }

    node.setPosition(new PIXI.Vector(x_pos, -tree_spacing*depth))
    resolve_conflicts(node)
}

// TODO this makes the algorithm O(n^2) because of get contour
function resolve_conflicts(node) {
    if (node.isLeaf() || node.isLeftmostSibling())
        return
    const tree_spacing = node.tree.specs.initial_branch_length

    // Iterate over all nodes between this node and the leftmost sibling
    let node_contour = node.getLeftContour()
    let sibling = node.father.children[0]
    while (sibling != null && sibling != node) {
        let sibling_contour = sibling.getRightContour()
        let max_common_depth = Math.min(sibling_contour.length, node_contour.length)
        let shift_amount = 0

        // Two nodes having a distance < tree_spacing is considered a conflict
        // i.e. they don't necessarily have to touch or overlap (they do only when distance <= 0)
        for (let depth = 0; depth < max_common_depth; depth++) {
            let distance = node_contour[depth] - sibling_contour[depth]
            if (distance + shift_amount < tree_spacing)
                shift_amount = tree_spacing - distance
        }

        // Resolve the conflict, if any
        if (shift_amount > 0) {
            node.setPosition(node.position.clone().add(new PIXI.Vector(shift_amount, 0)))
            node.x_mod += shift_amount

            // Update contour
            for (let i = 0; i < node_contour.length; i++)
                node_contour[i] += shift_amount

            // Edge case: there was a node in between, then it must be moved in the middle
            if (node.father.children.length === 3 && sibling.isLeftmostSibling() && node.isRightmostSibling()) {
                let mid_child = node.father.children[1]
                let mid = (node.position.x + sibling.position.x) / 2
                let mid_shift = mid - mid_child.position.x
                mid_child.setPosition(mid_child.position.clone().add(new PIXI.Vector(mid_shift, 0)))
                mid_child.x_mod += mid_shift
                // Shrug
                resolve_conflicts(mid_child)
            }
        }

        sibling = sibling.getRightSibling()
    }
}

function add_x_mod(node, modsum=0) {
    node.setPosition(node.position.clone().add(new PIXI.Vector(modsum, 0)))

    for (const c of node.children)
        add_x_mod(c, modsum + node.x_mod)
}

function center_root(root) {
    shift_tree_x(root, -root.position.x)
}

function shift_tree_x(node, x_offset) {
    node.setPosition(node.position.clone().add(new PIXI.Vector(x_offset, 0)))

    for (const c of node.children)
        shift_tree_x(c, x_offset)
}

function stretch_tree_y(node, mult) {
    node.setPosition(new PIXI.Vector(node.position.x, node.position.y*mult))

    for (const c of node.children)
        stretch_tree_y(c, mult)
}

// Squareifies only if tree is more wide than deep
function squareify_tree(root) {
    let [[min_x, max_x], [min_y, max_y]] = root.getPosExtremes()
    let width = max_x - min_x
    let height = max_y - min_y
    if (width > height) {
        let new_height = width
        let multiplier = new_height/height
        // Don't stretch the root node!
        for (const c of root.children[0].children)
            stretch_tree_y(c, multiplier)
    }
}

// Old pre-order visit
function wetherell_shannon(node, per_layer=[], depth=0) {
    var start_point = null
    if (depth > 0) {
        // Go down one level in depth and left
        start_point = per_layer[depth-1].clone()
                                        .add(new PIXI.Vector(-node.tree.specs.initial_branch_length, -node.tree.specs.initial_branch_length))
    }
    else
        start_point = new PIXI.Vector(0, 0)

    // Add new layer
    per_layer.push(start_point)

    node.setPosition(per_layer[depth])

    for (const c of node.children)
        wetherell_shannon(c, per_layer, depth+1)

    // Go right on the same layer
    per_layer[depth].add(new PIXI.Vector(node.tree.specs.initial_branch_length, 0))
}
