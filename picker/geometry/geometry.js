// Make a rectangle mesh (array of 12 elements)
export function rectangleMesh(from, to, thickness) {
    const a = to.clone()
            .sub(from)
            .normalize()
            .multiplyScalar(thickness/2)
            .rotate(Math.PI/2)

    const b = a.clone().rotate(-Math.PI)
    const c = b.clone()
    const d = a.clone()

    a.add(from)
    b.add(from)
    c.add(to)
    d.add(to)

    return [a.x, a.y, b.x, b.y, c.x, c.y,
            a.x, a.y, c.x, c.y, d.x, d.y]
}