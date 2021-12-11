"""
Shows the full, worst-case trees with a varying number of layers, max branches and fork types.
"""

import cv2 as cv
from ui import ui_tools as tools
from util.vector import Vector
from tree import tree, layout, stats
import math

CONTENT = "This text can be encoded in a tree with this worst case using Unicode (2 byte/character)."

def run(img):
	for l in range(5,10):
		for b in range(2,6):
			for f in range(1,2):
				img = tools.clean_canvas()

				tree_position = Vector(tools.canvasX/2,tools.canvasY*.5) 
				t = tree.full_tree(l,b) 
				layout.layout_tree_fractal (t, tree_position, tools.canvasY*.25)
				cv.circle(img, t.position_cv(), 50, tools.TREE_COLOR, 15)
				tools.draw_tree(img, t, 25)
				
				# Drawing statistics
				tree_count = stats.number_of_trees(b, l, f)
				bits = int(math.log2(tree_count))
				tree_count = tools.big_number_label(tree_count)
				branches = tools.big_number_label(b**l)
				text = f"{l} layers | {b} branches per fork | {f} fork types >>> {bits} bits | {bits//8} bytes | {branches} branches on screen | {tree_count} possible trees "
				img = tools.draw_text(img, (50,50), text)

				# Drawing QR comparison
				tools.draw_qr_comparison(img, tools.canvasX, tools.canvasY, bits)

				# Drawing bottom text
				chars = bits//16
				if chars < len(CONTENT):
					content = CONTENT[:chars]
				else:
					content = CONTENT + f".. ({chars-len(CONTENT)} chars more)"
				img = tools.draw_text(img, (50, tools.canvasY-70), content)

				cv.imshow("tree", img)
				cv.waitKey(-1)