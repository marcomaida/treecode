    
"""
Test geometry
"""

from ui import ui_tools as tools
from util.vector import Vector
from util import geometry
from cv2 import cv2 as cv

def run(img):
    circle_center = Vector(tools.canvasX*.5, tools.canvasY*.5)
    circle_radius = tools.canvasY*.3
    circle = geometry.Polygon.circle(circle_center, circle_radius, 20)
    cx = 0
    cy = 10
    while True:
        img = tools.clean_canvas()

        tools.draw_polygon(img, circle)

        nv = len(circle.vertices)
        l1 = geometry.Segment(circle.vertices[(cx)%nv], circle.vertices[((cx)+10)%nv], True)

        # make a short segment, but make it a line
        l21 = circle.vertices[(cy)%nv]
        l22 = (circle.vertices[((cy)+cx)%nv] - l21).getNormalized() + l21
        l2 = geometry.Segment(l21,l22,True)
        tools.draw_segment(img, l1, 10)
        tools.draw_segment(img, l2, 10)
        cx +=1
        cy +=3

        i1 = l1.intersection(l2)
        i2 = l2.intersection(l1)
        if i1 is not None: 
            tools.draw_circle(img, i1, 30, 10, tools.LESS_COLOR)
            assert i1 in l1 and i1 in l2
            assert i1 != i1 + Vector(0,0.00001)
            assert i1 == i1 + Vector(0.000000001,0.000000000001)
        if i2 is not None: 
            tools.draw_circle(img, i2, 20, 10, tools.MORE_COLOR)
            assert i2 in l1 and i2 in l2

        cv.imshow("tree", img)
        key = cv.waitKey(-1)