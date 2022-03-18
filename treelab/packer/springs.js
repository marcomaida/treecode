
export function springNeighbors(node) {
    var spring = new PIXI.Vector(0,0)

    spring.add(node.father.position.clone().sub(node.position).multiplyScalar(10))

    for (const c of node.children) {
        spring.add(c.position.clone().sub(node.position))
    }

    return spring.normalize()
}
export function springRandom(node) {

    const spring = new PIXI.Vector((Math.random()-0.5)*2, (Math.random()-0.5)*2)

    return spring
}

export function springAngle(node) {

    //TODO this thing does not work!

    var spring = new PIXI.Vector(0,0)
    const relPos = node.direction

    const cRelFather = node.father.direction.multiplyScalar(-1)
    var angle = relPos.angle(cRelFather)
    var sign = angle >= 0 ? 1 : -1
    var force = (1 - (angle / (Math.PI))) ** 2 // squared
    spring.add(node.direction.normalize().perpendicular(true).multiplyScalar(force*sign))

    for (const c of node.father.children) {
        if (c === node) continue

        const cRelPos = c.direction 
        angle = relPos.angle(cRelPos)
        
        sign = angle >= 0 ? 1 : -1
        force = (1 - (angle / (Math.PI))) ** 2 // squared

        spring.add(node.direction.normalize().perpendicular(false).multiplyScalar(force*sign))
    }

    return spring.normalize()
}