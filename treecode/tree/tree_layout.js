export function layout_wetherell_shannon(tree) {
    wetherell_shannon(tree.root)
}

function wetherell_shannon(node, per_layer=[], depth=0){
    if (per_layer.length <= depth) {
        var start_point = null
        if (depth > 0) {
            start_point = per_layer[depth-1].clone() 
                                            .add(new PIXI.Vector(-node.tree.specs.branch_length, -node.tree.specs.branch_length))
        }
        else
            start_point = new PIXI.Vector(0, 0)
        
        per_layer.push(start_point) 
    }

    node.setPosition(per_layer[depth])
    
    for (const c of node.children)
        wetherell_shannon(c, per_layer, depth+1)

    per_layer[depth].add(new PIXI.Vector(node.tree.specs.branch_length, 0))
    
}