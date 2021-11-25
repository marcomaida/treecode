"""
Data structure of the tree, helper function
"""
from util.vector import Vector

class TreeNode:
	def __init__(self, children = [], position = Vector(0,0)):
		self.children = children 
		self.position = position

	def position_cv(self):
		return (int(self.position.x), int(self.position.y))

	def __repr__(self) -> str:
		return f" {len(self.children)} > {str(self.children)}"
	
def full_tree (layers, max_branches):
	assert layers > 0

	if layers == 1:
		return TreeNode([])
	else:
		cs = [full_tree(layers-1, max_branches) for _ in range(max_branches)]
		return TreeNode(cs)

def max_layers(t):
	return 1 + max([max_layers(c) for c in t.children], default=0)

def rightmost(layers):
	assert layers > 0
	if layers == 1:
		return TreeNode()
	else:
		return TreeNode([TreeNode(), rightmost(layers-1)])
	
def one():
	return rightmost(2)
