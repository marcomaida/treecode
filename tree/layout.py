import math

from tree import tree
from util.vector import Vector

PI = math.pi

def layout_tree_fractal(t, position, height, spread = (7/5 *PI), direction = Vector(0, -1), current_layer = 0):
	layers = tree.max_layers(t)
	assert layers > 0
	t.position = position

	branches = len(t.children)
	for i in range(len(t.children)):
		branch_length = height * ((2/3) ** (current_layer+1))
		child_pos = position + direction * branch_length
		angle = (spread/2) - spread/(branches-1)*i
		child_pos = child_pos.rotate(position, angle)
		child_dir = (child_pos - position).getNormalized()
		layout_tree_fractal(t.children[i], child_pos, height, spread, child_dir, current_layer+1)