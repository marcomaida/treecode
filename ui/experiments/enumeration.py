"""
Enumerates all the trees, starting from one
"""

import cv2 as cv
from ui import ui_tools as tools
from util.vector import Vector
from tree import tree, layout, stats, converter
import math

def run(img):
	auto = False
	t = tree.one()
	i = 1

	while True:
		img = tools.clean_canvas()

		tree_position = Vector(tools.canvasX/2,tools.canvasY*.5) 
		t = converter.convert(i)
		layout.layout_tree_fractal (t, tree_position, tools.canvasY*.25, 2, Vector(0,1))
		
		img = tools.draw_text(img, (50,100), f"N: {i}", scale=4)
		tools.draw_tree(img, t, 25)

		# Extra data
		ml = tree.max_layers(t)
		#next_layer = stats.treegrowth(3, ml)
		img = tools.draw_text(img, (50,200), f"Max layers: {ml}", scale=1)
		#img = tools.draw_text(img, (50,250), f"Next full tree at: { next_layer-1 }", scale=1)
		#if i == next_layer-1:		
	    #	img = tools.draw_text(img, (50,500), f"Full tree!", scale=4)
	    #	auto = False
	
		cv.imshow("tree", img)
		key = cv.waitKey(1 if auto else -1)
		if key == ord('a'): # Start auto
			auto = True
		elif key == ord('s'): # Stop auto
			auto = False
		
		#if key == ord('w'): # Fast forward
		#	auto = False
		#	while i < next_layer-3:
		#		t = tree.successor (t, 3)
		#		i +=1
				
		i+=1