from util.vector import Vector
import cv2 as cv
import numpy as np
import math
from tree import tree, stats, converter, layout

CONTENT = "This text can be encoded in a tree with this worst case using Unicode (2 byte/character)."
TREE_COLOR = (0,0,0)
DIRECT_TREE_COLOR = (0,100,0)
LESS_COLOR = (0,0,90)
MORE_COLOR = (0,90,0)

canvasX = 3200
canvasY = 1600

def draw_tree(img, tree, thickness, color=TREE_COLOR):
	for child in tree.children:
		cv.line(img, tree.position_cv(),child.position_cv(),color, thickness)
		draw_tree(img, child, max(1,int(thickness//2)),color)

def draw_text(img, position, text, color = (0,0,0), scale = 1):
	font = cv.FONT_HERSHEY_SIMPLEX
	fontScale = scale
	thickness = 2*scale
	return cv.putText(img, text, position, font, fontScale, color, thickness, cv.LINE_AA)
					
def big_number_label(num):
	if num > 10**5: 
		return f"10^{int(math.log10(num))}"
	else:
		return str(num)

def create_canvas():
	img = np.ones((canvasY,canvasX,3), dtype=np.uint8)*255
	cv.imshow("tree", img)
	cv.setWindowProperty('tree', cv.WND_PROP_TOPMOST, 1)
	return img

"""
def successor(img):
	auto = False
	tree = treeshape.one()
	i = 1
	while True:
		img = np.ones((canvasY,canvasX,3), dtype=np.uint8)*255

		tree_position = Vector(canvasX/2,canvasY*.5) 
		treeshape.layout_tree_fractal (tree, tree_position, canvasY*.25, 2, Vector(0,1)  )
		
		img = draw_text(img, (50,100), f"{i}", scale=4)
		draw_tree(img, tree, 25)

		# Direct generation
		tree_position += 50
		direct_tree = treeconverter.convert(i)
		treeshape.layout_tree_fractal (direct_tree, tree_position, canvasY*.25, 2, Vector(0,1)  )
		#draw_tree(img, direct_tree, 25, DIRECT_TREE_COLOR)

		# Extra data
		ml = treeshape.max_layers(tree)
		next_layer = treegrowth.treegrowth(3, ml)
		img = draw_text(img, (50,200), f"Max layers: {ml}", scale=1)
		img = draw_text(img, (50,250), f"Next full tree at: { next_layer-1 }", scale=1)
		if i == next_layer-1:		
			img = draw_text(img, (50,500), f"Full tree!", scale=4)
			auto = False
	
		cv.imshow("tree", img)
		key = cv.waitKey(1 if auto else -1)
		if key == ord('a'): # Start auto
			auto = True
		elif key == ord('s'): # Stop auto
			auto = False
		
		if key == ord('w'): # Fast forward
			auto = False
			while i < next_layer-3:
				tree = treeshape.successor (tree, 3)
				i +=1
				
		tree = treeshape.successor(tree, 3)
		i+=1

def growth_eval(img):
	for l in range(5,10):
		for b in range(2,6):
			for f in range(1,2):
				tree_position = Vector(canvasX/2,canvasY*.5) 
				tree = treeshape.full_tree(l,b) 
				treeshape.layout_tree_fractal (tree, tree_position, canvasY*.25)

				img = np.ones((canvasY,canvasX,3), dtype=np.uint8)*255
				cv.circle(img, tree.position_cv(), 50, TREE_COLOR, 15)
				draw_tree(img, tree, 25)
				
				# Drawing statistics
				tree_count = treegrowth.treegrowth(b, l, f)
				bits = int(math.log2(tree_count))
				tree_count = big_number_label(tree_count)
				branches = big_number_label(b**l)
				text = f"{l} layers | {b} branches per fork | {f} fork types >>> {bits} bits | {bits//8} bytes | {branches} branches on screen | {tree_count} possible trees "
				img = draw_text(img, (50,50), text)

				# Drawing QR comparison
				y = canvasY-70-(len(treegrowth.qr.items())*50)
				for name, qr_bits in treegrowth.qr.items():
					is_more = bits > qr_bits
					comp = ">" if is_more else "<"
					color = MORE_COLOR if is_more else LESS_COLOR
					img = draw_text(img, (50,y), f"{comp} {name} : {qr_bits//8} bytes", color)
					y += 50

				# Drawing bottom text
				chars = bits//16
				if chars < len(CONTENT):
					content = CONTENT[:chars]
				else:
					content = CONTENT + f".. ({chars-len(CONTENT)} chars more)"
				img = draw_text(img, (50, canvasY-70), content)

				cv.imshow("tree", img)
				cv.waitKey(-1)
"""

#growth_eval(img)
#successor(img)
#cv.destroyAllWindows()

def growth_eval(img):
	for l in range(5,10):
		for b in range(2,6):
			for f in range(1,2):
				tree_position = Vector(canvasX/2,canvasY*.5) 
				t = tree.full_tree(l,b) 
				layout.layout_tree_fractal (t, tree_position, canvasY*.25)

				img = np.ones((canvasY,canvasX,3), dtype=np.uint8)*255
				cv.circle(img, t.position_cv(), 50, TREE_COLOR, 15)
				draw_tree(img, t, 25)
				
				# Drawing statistics
				tree_count = stats.treegrowth(b, l, f)
				bits = int(math.log2(tree_count))
				tree_count = big_number_label(tree_count)
				branches = big_number_label(b**l)
				text = f"{l} layers | {b} branches per fork | {f} fork types >>> {bits} bits | {bits//8} bytes | {branches} branches on screen | {tree_count} possible trees "
				img = draw_text(img, (50,50), text)

				# Drawing QR comparison
				y = canvasY-70-(len(stats.qr.items())*50)
				for name, qr_bits in stats.qr.items():
					is_more = bits > qr_bits
					comp = ">" if is_more else "<"
					color = MORE_COLOR if is_more else LESS_COLOR
					img = draw_text(img, (50,y), f"{comp} {name} : {qr_bits//8} bytes", color)
					y += 50

				# Drawing bottom text
				chars = bits//16
				if chars < len(CONTENT):
					content = CONTENT[:chars]
				else:
					content = CONTENT + f".. ({chars-len(CONTENT)} chars more)"
				img = draw_text(img, (50, canvasY-70), content)

				cv.imshow("tree", img)
				cv.waitKey(-1)

def run():
	img = create_canvas()
	growth_eval(img)
	cv.destroyAllWindows()