export class TreeSpecs {
    constructor() {
        this.max_thickness = 10
        this.min_thickness = 5
        this.branch_length = 15
    }

    thicknessAt(node) {
        const total_descendants = node.tree.root.num_descendants
        const weight = node.num_descendants / total_descendants

        return Math.lerp(this.min_thickness, this.max_thickness, weight)
    }
}