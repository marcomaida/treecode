import cv2 as cv
from tree import stats
import math
import numpy as np

TREE_COLOR = (0,0,0)
LESS_COLOR = (0,0,90)
MORE_COLOR = (0,90,0)

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

def draw_qr_comparison(img, canvasX, canvasY, bits):
    y = canvasY-70-(len(stats.qr.items())*50)
    for name, qr_bits in stats.qr.items():
        is_more = bits > qr_bits
        comp = ">" if is_more else "<"
        color = MORE_COLOR if is_more else LESS_COLOR
        img = draw_text(img, (50,y), f"{comp} {name} : {qr_bits//8} bytes", color)
        y += 50