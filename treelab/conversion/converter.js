import { Tree } from "../tree/tree.js"
import { TreeNode } from "../tree/tree_node.js";

export function bitsToTree(stream) {
    var root = new TreeNode(null);
    var frontier = [root];
    var iter = stream.getStream()
    for (var bit of iter) { 
        var father = frontier.shift();

        if (frontier.length > 0) { // Father can have no children
            if (bit == 0)
                continue; // no child
            else 
                bit = iter.next(); // father will have children, a 1 has been processed
        }

        var children = [new TreeNode(father), new TreeNode(father)];
        if (bit == 1) 
            children.push(new TreeNode(father));

        for (const c of children)
            frontier.push(c);
        father.children = children;
    }

    return new Tree(root); 
}