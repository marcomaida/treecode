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
            else  {
                bit = iter.next().value; // node will have children, a 1 has been processed
                if (bit === undefined) bit = 0 // edge case in which this was the last 1
            }
        }
        
        for (var i = 0; i < specs.numSegments-1; i ++) {
            node.children = [new TreeNode(node)]
            node = node.children[0]
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

    return new Tree(root, specs);
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