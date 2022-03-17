import { Tree } from "../tree/tree.js"
import { TreeNode } from "../tree/tree_node.js";

export function bitsToTree(stream, specs) {
    var root = new TreeNode(null)
    root.children = [new TreeNode(root)]
    var frontier = [root.children[0]];
    var iter = stream.getStream()
    for (var bit of iter) { 
        var father = frontier.shift();

        if (frontier.length > 0) { // Father can have no children
            if (bit == 0)
                continue; // no child
            else 
                bit = iter.next(); // father will have children, a 1 has been processed
        }
        
        for (var i = 0; i < specs.numSegments-1; i ++) {
            father.children = [new TreeNode(father)]
            father = father.children[0]
        }

        var children = [new TreeNode(father), new TreeNode(father)];
        if (bit == 1) 
            children.push(new TreeNode(father));

        for (const c of children)
            frontier.push(c);
        father.children = children;
    }

    return new Tree(root, specs); 
}