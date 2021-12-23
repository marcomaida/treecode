    
"""
Test geometry
"""

from ui import ui_tools as tools
from util.vector import Vector
from util.vector import vec
from util import geometry
import random
from cv2 import cv2 as cv

def run(img):
    circle_center = Vector(tools.canvasX*.5, tools.canvasY*.5)
    circle_radius = tools.canvasY*.3
    circle = geometry.Polygon.circle(circle_center, circle_radius, 20)
    cx = 0
    cy = 10
    random.seed(0)
    while True:
        img = tools.clean_canvas()

        tools.draw_polygon(img, circle, 30)

        #################################
        # Checking line intersections
        #################################
        nv = len(circle.vertices)
        l1 = geometry.Segment(vec(circle.vertices[(cx)%nv]), vec(circle.vertices[((cx)+10)%nv]), True)
        l2i1, l2i2 = cy%nv, (cy+cx)%nv
        if l2i1 == l2i2: l2i2 = (l2i2+1)%nv
        l21 = vec(circle.vertices[(cy)%nv])
        l22 = (circle.vertices[l2i2] - l21).getNormalized() + l21
        l2 = geometry.Segment(l21,l22,True)
        trans = 200
        l1.translate(Vector.random(size=trans))
        l2.translate(Vector.random(size=trans))
        tools.draw_segment(img, l1, 10, tools.BLACK)
        tools.draw_segment(img, l2, 10, tools.ORANGE)
        cx += random.randint(0,3)
        cy += random.randint(0,3)
        i1 = l1.intersection(l2)
        i2 = l2.intersection(l1)
        if i1 is not None: 
            tools.draw_circle(img, i1, 30, 10)
        if i2 is not None: 
            tools.draw_circle(img, i2, 20, 10)

        #################################
        # Checking poly cut with l2
        #################################

        sec1,sec2 = circle.cut(l2)
        if sec1 is not None:
            trans = 100
            tools.draw_polygon(img, sec1, 20, tools.GREEN)
            tools.draw_polygon(img, sec2, 10, tools.RED)

        cv.imshow("tree", img)
        key = cv.waitKey(-1)
        
        #################################
        # Extra checks 
        #################################

        assert (sec1 is None) == (sec2 is None)
        if i1 is not None: 
            assert i1 in l1
            assert i1 in l2
            assert i1 != i1 + Vector(0,0.00001)
            assert i1 == i1 + Vector(0.0000000001,0.000000000001)
        if i2 is not None: 
            assert i2 in l1 
            assert i2 in l2