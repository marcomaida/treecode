"""
Data structure of the tree, helper function
"""
from util.vector import Vector

class TreeNode:
	def __init__(self, children = [], position = Vector(0,0)):
		self.children = children 
		self.position = position
		self.n_descendants = None
		self.max_depth = None
		self.father_thickness = 1

	def _compute_descendants(self):
		self.n_descendants = sum([c._compute_descendants() 
								  for c in self.children], 
								  0) + 1
		return self.n_descendants
		
	def _compute_depth(self):
		self.max_depth = max([c._compute_depth() 
							  for c in self.children], default=0) + 1
		return self.max_depth
	
	def initialize(self):
		# compute metadata in each this node and children
		self._compute_descendants()
		self._compute_depth()

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

def n_branches(node):
	branches = 0
	for c in node.children:
		branches += 1 + n_branches(c)
	
	return branches

def per_layer_breadth(node, per_layer, layer=0):
	if node is None: return
	else:
		if layer in per_layer:
			per_layer[layer]+= 1
		else:	
			per_layer[layer] = 0
			
		for c in node.children:
			per_layer_breadth(c, per_layer, layer+1)
