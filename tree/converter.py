from tree.tree import TreeNode

def convert(n):
    assert n > 0
    if n == 1 : return TreeNode()
    return TreeNode([TreeNode(), convert(n-1)])