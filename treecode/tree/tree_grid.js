/**
 * Create a size x size grid 
 */
function create_grid(size) {
    return Array(size).fill(Array(size).fill(null))
}

export function set_layout(tree) {
    const grid_size = tree.root.num_descendants
    let grid = create_grid(grid_size)
    
    const start_pos_x = grid_size/2
    const start_pos_y = grid_size/2
    grid_placement(tree.root, grid, -1, -1, start_pos_x, start_pos_y)
}

function is_free(grid, x, y) {
    if (x < 0 || y < 0) { return false } 
    if (x > grid.length() || y < 0) { return false } 
    return grid[x][y] === null;
}

/**
 * Given a node, returns the free cells in clockwise order starting from the father
 *    0 1 2   
 * 0    x     <- another random node occupying this cell
 * 1  _ n _   <- n is the node, there are two free spaces left ad right
 * 2    f     <- father
 * 3         
 *        Returns [[0,1],[2,1]] 
 * 
 * In case of root (no father) implicitly starts from up
 */
function get_clockwise_free_cells(node, grid, father_x, father_y, pos_x, pos_y) {
    // urdl = up, right, down, left
    let urdl = [[pos_x, pos_y-1], [pos_x+1, pos_y], [pos_x, pos_y+1],[pos_x-1, pos_y]]
    if (node.father !== null) {
        console.assert(grid[father_x][father_y] === node.father)
        const father_pos = urdl.find(p => p[0]===father_x, p[1]===father_y)
        console.assert(father_pos !== undefined) // Father must be adjacent
        urdl = urdl.slice(father_pos, urdl.length).concat(urdl.slice(0,father_pos)) // Rotate array
    }

    return urdl.filter(p => is_free(grid, p[0], p[1]))
}

/**
 *        x
 *    ---------> 
 *   |
 * y |
 *   |
 *   V
 * 
 *  [[x1y1,x1y2],[x2y1,x2y2]]
 *  
 *  Recursively places the subtree in the grid.
 *  Returns true if it succeeds, false otherwise.
 */
function grid_placement(node, grid, father_x, father_y, pos_x, pos_y) {
    // Set node at position, assume grid is free
    console.assert(grid[pos_x][pos_y] === null)
    grid[pos_x][pos_y] = node

    // Leaves immediately succeed
    if (node.isLeaf()) { return true }

    const num_children = node.children.length()
    let clockwise_free_cells = get_clockwise_free_cells(node, grid, father_x, father_y, pos_x, pos_y)

    // No free cells: dead end. Backtrack.
    if (clockwise_free_cells.length() === 0) {
        grid[pos_x][pos_y] = null
        return false
    }
    
    // There might exist a solution, explore.
    // (have to maintain topology of tree w.r.t. parent)
    /**
     * MUST distinguish between SPROUT (grow children)
     * and GROW (elongate branch to explore)
     * SPROUT is preferable, GROW only in case there is no other solution.
     */

    // TODO recursive case, sprout
    // for (const c of node.children)
    //     grid_placement(c, grid, pos_x, pos_y, XXX, YYY)

}
