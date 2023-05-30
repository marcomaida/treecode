import { Tree } from "../tree/tree.js"
import { TreeNode } from "../tree/tree_node.js";

export function bitsToTree(stream, specs) {
    var root = new TreeNode(null)
    root.children = [new TreeNode(root)]
    var frontier = [root.children[0]];
    var iter = stream.getStream()
    for (var bit of iter) {
        var node = frontier.shift();

        if (frontier.length > 0) { // node is allowed to have no children
            if (bit == 0) continue; // no child
            else {
                bit = iter.next().value; // node will have children, a 1 has been processed
                if (bit === undefined) bit = 0 // edge case in which this was the last 1
            }
        }

        if (bit === 0)
            node.children = [new TreeNode(node), new TreeNode(node)];
        else {
            console.assert(bit === 1)
            node.children = [new TreeNode(node), new TreeNode(node), new TreeNode(node)];
        }

        for (const c of node.children)
            frontier.push(c)
    }

    wrap_tree(root);
    return new Tree(root, specs);
}

/**
 * Encode child ordering in topology
 */
export function wrap_tree(parent_node) {
    // TODO
    // needs_ord = not all([tree.tree.equal(node.children[i - 1], node.children[i]) 
    //                      for i in range(1, len(node.children))])

    for (const [i, c] of parent_node.children.entries()) {
        wrap_tree(c)

        var wrap_node = c
        for (var w = 0; w < i; w++) {
            parent_node.children[i] = new TreeNode(parent_node, [wrap_node])
            wrap_node.parent_node = parent_node.children[i]
            wrap_node = parent_node.children[i]
        }
    }
}

export function treeToBits(tree) {
    var root = tree.root
    var frontier = [root.children[0]];
    var bits = []

    while (frontier.length > 0) {
        var node = frontier.shift();

        // 1 - If the node has a choice, does it have children?
        if (frontier.length > 0) {
            if (node.children.length === 0) bits += [0]
            else bits += [1]
        }

        // 2 - How many children?
        if (node.children.length === 2) bits += [0]
        else if (node.children.length === 3) bits += [1]
        else console.assert(node.children.length === 0)

        for (const c of node.children)
            frontier.push(c)
    }

    const last_one = bits.lastIndexOf(1)
    return bits.slice(0, last_one)
}
