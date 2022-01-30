from tree.tree import TreeNode
from tree.tree import rightmost
from tree.stats import number_of_trees as comb

#def convert(n):
#    assert n > 0
#    if n == 1 : return TreeNode()
#    return TreeNode([TreeNode(), convert(n-1)])
"""
def get_root(n):
    tree_root = TreeNode()
    tree_node = tree_root
    l = 1
    tree_c = comb(3,l)
    while n >= tree_c:
        n -= tree_c 
        l += 1
        tree_c = comb(3,l)

        tree_node.children = [TreeNode(), TreeNode()]
        tree_node = tree_node.children[0]

    # returns the root, the layers to compute the rest, and 
    # the remaining n
    return tree_root, l, n

def get_branches(l,n):
    print(f"B {l},{n}")
    assert l > 1 
    assert n >= 0
    assert n < comb(3, l)

    #if n < l:
    #    return rightmost(n+1)

    # Base case 
    if l==2:
        assert n < 3
        if n == 0: return TreeNode()
        if n == 1: return TreeNode([TreeNode(),TreeNode()])
        if n == 2: return TreeNode([TreeNode(),TreeNode(),TreeNode()])

    # Inductive case
    t = TreeNode()
    clm1 = comb(3, l-1)
    b2_limit = clm1**2
    if n >= b2_limit:
        print("3 Branches")
        n -= b2_limit
        lc = get_branches(l-1, n//b2_limit)
        n = n%b2_limit
        cc = get_branches(l-1, n//clm1)
        rc = get_branches(l-1, n%clm1)
        t.children=[lc,cc,rc]
    else:
        print("2 Branches")
        lc = get_branches(l-1, n//clm1)
        rc = get_branches(l-1, n%clm1)
        t.children=[lc,rc]
    
    return t
"""

def bits_to_tree(stream): #TODO replace with proper stream
    root = TreeNode()
    frontier = [root]
    while not stream.is_finished():
        bit = stream.next()
        assert bit == 1 or bit == 0
        assert len(frontier) > 0

        father = frontier.pop(0)
        if len(frontier) > 0: # Father can have no children
            if bit == 0: 
                continue # no child
            else: 
                # father will have children, a 1 has been processed
                bit = stream.next()

        children = [TreeNode(), TreeNode()]
        if bit == 1: children.append(TreeNode())
        for c in children:
            frontier.append(c)
        father.children = children
    
    root.initialize()
    return root