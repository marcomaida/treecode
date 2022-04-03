import { doPolygonsIntersect } from "../geometry/geometry.js"

export function isBranchAreaIntersectingTree(node) {
    if (isBranchIntersectingSubtree(node, node.tree.root))
        return true

    for (const c of node.children) {
        if (isBranchIntersectingSubtree(c, node.tree.root))
        return true
    }

    return false
}

export function isBranchIntersectingTree(node) {
    return isBranchIntersectingSubtree(node, node.tree.root)
}

function isBranchIntersectingSubtree(node, curr_node) {
    if (node !== curr_node) {
        if (areBranchesIntersecting(node, curr_node))
            return true
    }

    for (const c of curr_node.children) {
        if (isBranchIntersectingSubtree(node, c))
            return true
    }

    return false
}

function areBranchesIntersecting(nodea, nodeb) {
    if (nodea.father === null || nodeb.father === null)
        return false

    if (nodea === nodeb)
        return true

    const b_is_father = nodea.father === nodeb
    const b_is_child = nodea.children.indexOf(nodeb) >= 0
    const b_is_brother = nodea.father !== null && nodea.father === nodeb.father

    if (b_is_father || b_is_child || b_is_brother) {
        // In case of neighbor node, we allow some intersection, as long as 
        // the tips of the branches diverge enough considering their thickness

        // Use angle-check instead of collisions
        // var nodea_dir = nodea.direction
        // var nodeb_dir = nodeb.direction

        var center = null
        var tipa = null
        var tipb = null
        if (b_is_father) {
            center = nodeb
            tipa = nodea
            tipb = nodeb.father
        }
        else if (b_is_child) {
            center = nodea
            tipa = nodea.father
            tipb = nodeb
        }
        else { // brother
            center = nodea.father
            tipa = nodea
            tipb = nodeb
        }

        const min_distance = Math.max(tipa.tree.specs.thicknessAt(tipa), 
                                      tipb.tree.specs.thicknessAt(tipb)) * 2 + 3

        var longer = null
        var shorter = null

        if (center.position.distanceToSq(tipa.position) < 
            center.position.distanceToSq(tipb.position)) {
            shorter = tipa.position
            longer = tipb.position
        }
        else {
            shorter = tipb.position
            longer = tipa.position
        }

        longer = longer.clone()
                        .sub(center.position)
                        .normalize()
                        .multiplyScalar(center.position.distanceTo(shorter))
                        .add(center.position)

        return shorter.distanceToSq(longer) < min_distance**2

        // if (b_is_child)  nodea_dir.multiplyScalar(-1)
        //return Math.abs(nodea_dir.angle(nodeb_dir)) < nodea.tree.specs.collisionMinAngle
    }
    else {
        console.assert(!b_is_brother && !b_is_child && !b_is_brother)
        // base case, no relationship between nodes
        // console.log("##################")
        // console.log("NODEA")
        // console.log(nodea.colliderPolygon)
        // console.log(nodea.numDescendants)
        // console.log(nodea)
        // console.log(nodea.father)
        // console.log("NODEB")
        // console.log(nodeb.colliderPolygon)
        // console.log(nodeb.numDescendants)
        // console.log(nodeb)
        // console.log(nodeb.father)

        return doPolygonsIntersect(nodea.colliderPolygon, nodeb.colliderPolygon)
    }
}