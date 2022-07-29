export class TreeSpecs {
    constructor() {
        this.max_thickness = 8
        this.min_thickness = 2
        this.min_branch_length = 12
        this.max_branch_length = 20
        this.branch_length = 30 // used by initial layout //TODO remove
        this.colliderCoating = 1.2 
        this.branchAngleSpan = Math.PI/2
    }

    thicknessAt(node) {
        const total_descendants = node.tree.root.numDescendants
        const weight = node.numDescendants / total_descendants

        return Math.lerp(this.min_thickness, this.max_thickness, weight)
    }

    lengthAt(node) {
        const total_descendants = node.tree.root.numDescendants
        const weight = node.numDescendants / total_descendants

        var leaves = 0
        for (const c of node.children) {
            leaves += c.children.length === 0
        }
        if (leaves >= node.children.length-1)
            return this.min_branch_length

        return Math.lerp(this.min_branch_length, this.max_branch_length, weight)
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