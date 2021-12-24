"""
Enumerates all the trees, starting from one
"""

import cv2 as cv
from ui import ui_tools as tools
from util.vector import Vector,vec
from util import bit_stream as bsn, geometry
from tree import tree, layout, poly_layout, converter

def run(img):
	auto = False
	t = tree.one()
	text = "Trees are beautiful, and so are you."
	tree_position = Vector(tools.canvasX/2,tools.canvasY*.8) 
	branch_size = tools.canvasY*.07
	tree_speed = tools.canvasX*.01
	circle_center = Vector(tools.canvasX*.5, tools.canvasY*.5)
	circle_radius = tools.canvasY*.3
	circle = geometry.Polygon.circle(circle_center, circle_radius, 20)

	while True:
		img = tools.clean_canvas()

		stream = bsn.bit_stream_text(text)
		t = converter.bits_to_tree(stream)
		ml = tree.max_layers(t)
		plbr = {}
		tree.per_layer_breadth(t, plbr)
		br = max (plbr.values())
		layout.layout_tree_fractal_weighted (t, t.n_descendants, tree_position, branch_size, 2, Vector(0,-1))
		poly_layout.layout(t, circle, vec(circle.vertices[0]))
		x_width = 20
		offsets = [-x_width * plbr[i]//2 + br*i/ml for i in range(ml)]
		nexts = {}
		
		tools.draw_tree(img, t, 1)
		tools.draw_polygon(img, circle)

		# Extra data
		img = tools.draw_text(img, (50,100), f"{text}", scale=3)
		img = tools.draw_text(img, (50,200), f"Characters: { len(text) }", scale=1)
		img = tools.draw_text(img, (50,250), f"Bits: { len(text)*8 }", scale=1)
		img = tools.draw_text(img, (50,300), f"Max layers: {ml}", scale=1)
		img = tools.draw_text(img, (50,350), f"Branches: { tree.n_branches(t) }", scale=1)
		img = tools.draw_text(img, (50,400), f"Breadth: { max(plbr.values()) }", scale=1)
	
		cv.imshow("tree", img)
		key = cv.waitKey(1 if auto else -1)
	
		if key == ord('1'):
			branch_size -= tree_speed
		elif key == ord('2'):
			branch_size += tree_speed
		elif key == ord('3'):
			text+=text
		elif key == 127: # backslash
			text = ""
		elif key == 0: #up
			tree_position.y -= tree_speed
		elif key == 1: #down
			tree_position.y += tree_speed
		elif key == 2: #left
			tree_position.x -= tree_speed
		elif key == 3: #right
			tree_position.x += tree_speed
		else:
			text += chr(key)
		
		
				