import math

from tree import tree
from util.vector import Vector

PI = math.pi

def layout_tree_fractal(t, position, height, spread = (PI/9), direction = Vector(0, -1), current_layer = 0):
	layers = tree.max_layers(t)
	assert layers > 0
	t.position = position

	branches = len(t.children)
	for i in range(len(t.children)):
		branch_length = height * ((2.7/3) ** (current_layer+1))
		child_pos = position + direction * branch_length
		angle = (spread/2) - spread/(branches-1)*i
		child_pos = child_pos.rotate(position, angle)
		child_dir = (child_pos - position).getNormalized()
		layout_tree_fractal(t.children[i], child_pos, height, spread*.95, child_dir, current_layer+1)

def layout_tree_fractal_weighted(t, total_nodes, position, height, spread = (PI/9), direction = Vector(0, -1), current_layer = 0):
	layers = tree.max_layers(t)
	assert layers > 0
	t.position = position
	total_descendants = t.n_descendants -1
	dweights = [c.n_descendants / total_descendants for c in t.children]

	if total_descendants > 0:
		assert len(t.children) > 0
		dirs = []
		for i in range(len(t.children)):
			angle = (spread/2) - spread/(len(t.children)-1)*i
			child_pos = (position + direction).rotate(position, -angle) # opposite angle
			dirs += [(child_pos - direction).getNormalized()]
		
		# Update direction to follow spine
		directions = [dirs[i] * dweights[i] for i in range(len(t.children))]
		#print(directions)
		s = Vector(0,0)
		for d in directions:
			s += d
		# direction = s.getNormalized()
	else:
		assert len(t.children) == 0

	branches = len(t.children)
	aspread = max(spread/3, spread * t.n_descendants/total_nodes)
	for i in range(len(t.children)):
		min_h = height / 5
		branch_length = max(min_h,height * t.children[i].n_descendants/total_nodes)
		child_pos = position + direction * branch_length
		angle = (aspread/2) - aspread/(branches-1)*i
		child_pos = child_pos.rotate(position, angle)
		child_dir = (child_pos - position).getNormalized()
		layout_tree_fractal_weighted(t.children[i], total_nodes, child_pos, height, spread*1, child_dir, current_layer+1)
		
def lt_wetherell_shannon_line(t, position, branch_len, offsets, spread, direction, current_layer, nexts):
		t.position = Vector(0,0)
		if current_layer in nexts: 
			t.position.x = nexts[current_layer]
			nexts[current_layer] += spread
		else:
			t.position.x = position.x+offsets[current_layer]
			nexts[current_layer] = t.position.x+spread

		t.position.y = position.y + direction.y * current_layer * branch_len

		for c in t.children:
			lt_wetherell_shannon_line(c, position,branch_len*.95, offsets, spread, direction, current_layer+1, nexts)
	