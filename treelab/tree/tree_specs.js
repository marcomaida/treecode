export class TreeSpecs {
    constructor() {
        this.max_thickness = 10
        this.min_thickness = 2
        this.min_branch_length = 20
        this.branch_length = 50
        this.num_segments = 1
        this.colliderCoating = 5
    }

    thicknessAt(node) {
        const total_descendants = node.tree.root.numDescendants
        const weight = node.numDescendants / total_descendants

        return Math.lerp(this.min_thickness, this.max_thickness, weight)
    }

    lengthAt(node) {
        const total_descendants = node.tree.root.numDescendants
        const weight = node.numDescendants / total_descendants

        return Math.lerp(this.min_branch_length, this.min_branch_length, weight) //TODO do properly
    }

    angleAt(node, is_left) {

        const idx = node.father.children.indexOf(node)

        if (is_left)
            return idx === 0 ? Math.PI * (3/4) : Math.PI * (1/4)
        else
            return idx === node.father.children.length - 1 ? 
                   - Math.PI * (3/4) : 
                   - Math.PI * (1/4)
        
    }
}