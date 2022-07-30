import { doPolygonsIntersect } from "../geometry/geometry.js"

export function checkTreeAreaCollision(node) {
    var collision = checkSubtreeCollision(node, node.tree.root)
    if (collision !== null)
        return collision

    for (const c of node.children) {
        collision = checkSubtreeCollision(c, node.tree.root)
        if (collision !== null) return collision
    }

    return null
}

export function checkTreeCollision(node) {
    return checkSubtreeCollision(node, node.tree.root)
}

function checkSubtreeCollision(node, curr_node) {
    if (node !== curr_node) {
        if (areBranchesIntersecting(node, curr_node))
            return curr_node
    }

    for (const c of curr_node.children) {
        const collision = checkSubtreeCollision(node, c)
        if (collision !== null)
            return collision
    }

    return null
}

function areBranchesIntersecting(nodea, nodeb) {
    if (nodea === nodeb)
        return true

    const b_is_father = nodea.father === nodeb
    const b_is_child = nodea.children.indexOf(nodeb) >= 0
    const b_is_brother = nodea.father !== null && nodea.father === nodeb.father

    if (nodea.father === null || nodeb.father === null)
    {// Checking collision with root
        if (b_is_father || b_is_child)
            return false
        else
            return doPolygonsIntersect(nodea.colliderPolygon, nodeb.colliderPolygon)
    }

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

        const min_distance = tipa.tree.specs.thicknessAt(tipa) + 
                             tipb.tree.specs.thicknessAt(tipb) + 1
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