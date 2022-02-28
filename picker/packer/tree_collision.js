import { doPolygonsIntersect } from "../geometry/geometry.js"

const MIN_ANGLE = 20     / 360 * (2 * Math.PI) // Degrees

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
    if (nodea === nodeb)
        return true

    const b_is_father = nodea.father === nodeb
    const b_is_child = nodea.children.indexOf(nodeb) >= 0
    const b_is_brother = nodea.father !== null && nodea.father.children.indexOf(nodeb) >= 0

    if (b_is_father || b_is_child || b_is_brother) {
        // Use angle-check instead of collisions
        var nodea_dir = nodea.direction
        var nodeb_dir = nodeb.direction

        if (b_is_father) nodeb_dir.multiplyScalar(-1)
        if (b_is_child)  nodea_dir.multiplyScalar(-1)

        return Math.abs(nodea_dir.angle(nodeb_dir)) < MIN_ANGLE
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