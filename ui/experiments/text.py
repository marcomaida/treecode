"""
Enumerates all the trees, starting from one
"""

import cv2 as cv
from ui import ui_tools as tools
from util.vector import Vector
from util import bit_stream as bsn
from tree import tree, layout, converter
import math

def run(img):
	auto = False
	t = tree.one()
	text = ""

	while True:
		img = tools.clean_canvas()

		tree_position = Vector(tools.canvasX/2,tools.canvasY*.8) 
		stream = bsn.bit_stream_text(text)
		t = converter.bits_to_tree(stream)
		layout.layout_tree_fractal (t, tree_position, tools.canvasY*.07, 1.5, Vector(0,-1))
		
		tools.draw_tree(img, t, 3)

		# Extra data
		ml = tree.max_layers(t)
		img = tools.draw_text(img, (50,100), f"{text}", scale=3)
		img = tools.draw_text(img, (50,200), f"Characters: { len(text) }", scale=1)
		img = tools.draw_text(img, (50,250), f"Bits: { len(text)*8 }", scale=1)
		img = tools.draw_text(img, (50,300), f"Max layers: {ml}", scale=1)
		img = tools.draw_text(img, (50,350), f"Branches: { tree.n_branches(t) }", scale=1)
	
		cv.imshow("tree", img)
		key = cv.waitKey(1 if auto else -1)
		if key == ord('2'):
			text+=text
		text += chr(key)

		if key == 127: # backslash
			text = ""
				