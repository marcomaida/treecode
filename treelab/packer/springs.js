import { drawDebugArrow, clearDebug } from "../drawing/debug.js"

/** returns a force vector that pushes v to reach the 
 *  target distance to v_other */
function distanceSpring(v, v_other, target_dist) {
    const diff = v_other.clone().sub(v)
    const dist = diff.length()

    if (dist < target_dist)
        diff.multiplyScalar(-1)
         
    diff.normalize().multiplyScalar((target_dist - dist)**2)
    return diff
}

/** returns a force vector that pushes v to reach the 
 *  target angle to v_other w.r.t. center. 
 *  Positive/negative is important. A positive angle goes anticlockwise. 
 * */
function angleSpring(v, v_other, center, target_angle) {
    var angle = v.angleRelativeTo(v_other, center)

    // Normalize angles 

    target_angle = target_angle % (2 * Math.PI)

    if (Math.sign(angle) !== Math.sign(target_angle)) {
        if (angle < target_angle) 
            angle += 2 * Math.PI
        else
            target_angle += 2 * Math.PI
    }
    
    angle = angle % (2 * Math.PI)
    target_angle = target_angle % (2 * Math.PI)

    // Now both angles are positive and normalized

    const dist = (angle - target_angle) ** 2

    return v.clone().sub(center)
                    .normalize()
                    .perpendicular(angle > target_angle)
                    .multiplyScalar(dist)
}

export function springNeighborsDistance(node) {
    var spring = new PIXI.Vector(0,0)

    spring.add(distanceSpring(node.position, node.father.position, node.tree.specs.lengthAt(node)))
    spring.multiplyScalar(3)

    for (const c of node.children) {
        if (c === node) continue
        spring.add(distanceSpring(node.position, c.position, node.tree.specs.lengthAt(c)))
    }

    if (spring.lengthSq() > 1)
        spring.normalize()

    return spring
}


/**   
 *    L     N        
 *     \ tL /        Need to identify the left and right nodes
 *      \  /  tR     They both may be the grandfather (L = R)
 *       C ----- R   Need to find target angles tL, tR
 */
export function springNeighborsAngle(node) {

    const N = node.position.clone()
    const C = node.father.position.clone()
    var L, tL, R, tR = null

    const idx = node.father.children.indexOf(node)

    if (idx === 0) { // father is on the left
        L = node.father.father === null ? 
            node.father.position.clone().add(new PIXI.Vector(0,1)) :
            node.father.father.position.clone()
    }
    else { // brother is on the left
        L = node.father.children[idx-1].position.clone()
    }

    if (idx === node.father.children.length-1) { // father is on the right
        R = node.father.father === null ? 
            node.father.position.clone().add(new PIXI.Vector(0,1)) :
            node.father.father.position.clone()
    }
    else { // brother is on the right
        R = node.father.children[idx+1].position.clone()
    }

    tL = node.tree.specs.angleAt(node, true)
    tR = node.tree.specs.angleAt(node, false)

    var spring = new PIXI.Vector(0,0)

    spring.add(angleSpring(N, L, C, tL))
    spring.add(angleSpring(N, R, C, tR))

    if (spring.lengthSq() > 1)
        spring.normalize()

    return spring
}

export function springRandom(node) {
    const spring = new PIXI.Vector((Math.random()-0.5)*2, (Math.random()-0.5)*2)

    return spring
}