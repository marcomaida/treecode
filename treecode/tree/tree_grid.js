/**
 * Create a size x size grid 
 */
function create_grid(size) {
    return Array(size).fill(Array(size).fill(null))
}

export function set_layout(tree) {
    const grid_size = tree.root.numDescendants
    let grid = create_grid(grid_size)
    
    const start_pos_x = Math.floor(grid_size/2)
    const start_pos_y = Math.floor(grid_size/2)
    const res = grid_placement(tree.root, grid, -1, -1, start_pos_x, start_pos_y)
    
    console.assert(res.length > 0) // TODO replace with error
}

function is_free(grid, x, y) {
    if (x < 0 || y < 0) { return false } 
    if (x > grid.length || y < 0) { return false } 
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


function* all_possible_placements(num_children, clockwise_free_cells) {
    console.assert(num_children <= clockwise_free_cells)
    
    // TODO enumerate all alternatives, currently just cuts
    yield clockwise_free_cells.slice(0,num_children)
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
    if (node.isLeaf()) { return [[pos_x, pos_y]] }

    let clockwise_free_cells = get_clockwise_free_cells(node, grid, father_x, father_y, pos_x, pos_y)

    // No free cells: dead end. Backtrack.
    if (clockwise_free_cells.length === 0) {
        grid[pos_x][pos_y] = null
        return []
    }

    /**
     * Must distinguish between SPROUT (grow children)
     * and GROW (elongate branch to explore)
     * SPROUT is preferable, GROW only in case there is no other solution.
     */

    const num_children = node.children.length
    if (num_children <= clockwise_free_cells.length) {
        /* SPROUT
         * (There are enough free cells, try to place children)
         */

        for (const placement in all_possible_placements(num_children, clockwise_free_cells)) {
            console.log(placement.length == num_children)
            let covered_children = []
            let success = true
            for (const [i, c] of node.children.entries()) {
                const covered = grid_placement(c, grid, pos_x, pos_y, placement[i][0], placement[i][1])
                if (covered.length == 0) {
                    success = false
                    break
                }
                else { covered_children = covered_children.concat(covered) }
            }

            if (success) { return covered_children }
            else { 
                /* failed, must clean all covered cells */ 
                for (cell of covered_children) { grid[cell[0]][cell[1]] = null }
            }   
        }
    }

    /* GROW
     * (Sprout failed, but there is at least one free cell) 
     */
    for (const grow_cell of clockwise_free_cells) {
        const covered = grid_placement(node, grid, pos_x, pos_y, grow_cell[0], grow_cell[1]);
        if (covered.length > 0) { return covered }
    }

    // Grow failed, backtrack
    grid[pos_x][pos_y] = false
    return []
}
