export function layout_wetherell_shannon(tree) {
    // wetherell_shannon(tree.root)
    mods_rockers(tree.root)
}

// Pre-order visit
function wetherell_shannon(node, per_layer=[], depth=0) {
    var start_point = null
    if (depth > 0) {
        // Go down one level in depth and left
        start_point = per_layer[depth-1].clone()
                                        .add(new PIXI.Vector(-node.tree.specs.branch_length, -node.tree.specs.branch_length))
    }
    else
        start_point = new PIXI.Vector(0, 0)

    // Add new layer
    per_layer.push(start_point)

    node.setPosition(per_layer[depth])

    for (const c of node.children)
        wetherell_shannon(c, per_layer, depth+1)

    // Go right on the same layer
    per_layer[depth].add(new PIXI.Vector(node.tree.specs.branch_length, 0))
}

// Post-order visit
function mods_rockers(node, per_layer=[], depth=0) {
    setup(node, per_layer, depth)
}

function setup(node, per_layer=[], depth=0) {
    if (per_layer.length <= depth)
        per_layer.push(new PIXI.Vector(-node.tree.specs.branch_length*depth, -node.tree.specs.branch_length*depth))

    for (const c of node.children)
        setup(c, per_layer, depth+1)

    node.setPosition(per_layer[depth])
    per_layer[depth].add(new PIXI.Vector(node.tree.specs.branch_length, 0))
}

// switch (node.children.length) {
//     case 0:
//         node.setPosition(per_layer[depth])
//         break
//     case 1:
//         node.setPosition(per_layer[depth])
//         break
//     case 2:
//         mid = (node.children[1].position.x - node.children[0].position.x) / 2
//         newpos = per_layer[depth].clone().add(new PIXI.Vector(-mid, 0))
//         node.setPosition(newpos)
//         node.setPosition(per_layer[depth])
//         break
//     default:
//         node.setPosition(per_layer[depth])
//         break
// }
