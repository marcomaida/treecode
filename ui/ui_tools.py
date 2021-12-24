import cv2 as cv
from tree import stats
import math
import numpy as np
from util.geometry import Segment
from util.vector import Vector

BLACK = (0,0,0)
RED = (0,0,120)
GREEN = (0,90,0)
ORANGE = (25, 175, 255)

canvasX = 3200
canvasY = 1600

def clean_canvas():
    return np.ones((canvasY,canvasX,3), dtype=np.uint8)*255

def create_canvas():
	img = clean_canvas()
	cv.imshow("tree", img)
	cv.setWindowProperty('tree', cv.WND_PROP_TOPMOST, 1)
	return img

def destroy_canvas():
	cv.destroyAllWindows()

def cvp(vec):
	return [int(vec.x), int(vec.y)]

def draw_segment(img, seg, thickness, color=BLACK):
	if seg.is_line: 
		# Not really a bulletproof approach but I am lazy 
		# and this is just for debugging
		dir = (seg.p2 - seg.p1).getNormalized() * canvasX
		p1 = seg.p1 - dir
		p2 = seg.p2 + dir
	else:
		p1 = seg.p1
		p2 = seg.p2

	cv.line(img, cvp(p1),cvp(p2), color, thickness)

def draw_tree(img, tree, thickness, color=BLACK):
	for child in tree.children:
		draw_segment(img, Segment(tree.position, child.position), thickness, color)
		draw_tree(img, child, max(1,int(thickness/1)),color)

def draw_polygon(img, polygon, thickness=10, color=BLACK):
	n = len(polygon.vertices)
	for i in range(n):
		draw_segment(img, Segment(polygon.vertices[i],polygon.vertices[(i+1)%n]), 
					 	  thickness, color)

def draw_circle(img, center, radius, thickness=10, color=BLACK):
	cv.circle(img, cvp(center), radius, color, thickness) 

def draw_text(img, position, text, color = (0,0,0), scale = 1):
	font = cv.FONT_HERSHEY_SIMPLEX
	fontScale = scale
	thickness = 2*scale
	return cv.putText(img, text, position, font, fontScale, color, thickness, cv.LINE_AA)

def draw_text_list(img, position, texts, color=BLACK, scale=1, distance=70):
	for i,text in enumerate(texts):
		tpos = position.y + i * distance
		img = draw_text(img, (position.x,tpos), text, scale)
	return img
	
def big_number_label(num):
	if num > 10**5: 
		return f"10^{int(math.log10(num))}"
	else:
		return str(num)

def draw_qr_comparison(img, canvasX, canvasY, bits):
    y = canvasY-70-(len(stats.qr.items())*50)
    for name, qr_bits in stats.qr.items():
        is_more = bits > qr_bits
        comp = ">" if is_more else "<"
        color = GREEN if is_more else RED
        img = draw_text(img, (50,y), f"{comp} {name} : {qr_bits//8} bytes", color)
        y += 50