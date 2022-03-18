export class TreeSpecs {
    constructor() {
        this.max_thickness = 10
        this.min_thickness = 2
        this.branch_length = 35
        this.num_segments = 1
        this.collisionMinAngle = 20   / 360 * (2 * Math.PI) // Degrees
        this.colliderCoating = 5
        this.minBranchLength = 30
    }

    thicknessAt(node) {
        const total_descendants = node.tree.root.numDescendants
        const weight = node.numDescendants / total_descendants

        return Math.lerp(this.min_thickness, this.max_thickness, weight)
    }
}