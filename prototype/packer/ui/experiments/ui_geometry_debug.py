"""
Test geometry
"""

from tree.layouts.layout import PI
from ui import ui_tools as tools
from util.vector import Vector
from util.vector import vec
from util import geometry
import random
from cv2 import cv2 as cv

def run(img):
    cx = 0
    cy = 10
    random.seed(42)
    auto = False
    while True:
        circle_center = Vector(tools.canvasX*.5, tools.canvasY*.5)
        circle_radius = tools.canvasY*random.uniform(.3,.4)
        vertices = random.randint(3,40)
        circle = geometry.Polygon.circle(circle_center, circle_radius, vertices)
        
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
        tools.draw_circle(img, l2.p1, 30)
        tools.draw_circle(img, (l2.p2-l2.p1).getNormalized()*100+l2.p1, 15)
        cx += random.randint(0,3)
        cy += random.randint(0,3)
        i1 = l1.intersection(l2)
        i2 = l2.intersection(l1)
        if i1 is not None: 
            tools.draw_circle(img, i1, 30, 10)
        if i2 is not None: 
            tools.draw_circle(img, i2, 15, 10)

        #################################
        # Checking poly cut with l2
        #################################

        lsec,rsec = circle.cut(l2)
        if lsec is not None:
            trans = 100
            tools.draw_polygon(img, lsec, 25, tools.GREEN)
            tools.draw_polygon(img, rsec, 8, tools.RED)

        #################################
        # Perpendicular line
        #################################

        s1 = geometry.Segment(vec(l1.p1),vec(l1.p2))
        s1.set_length(100)
        tools.draw_segment(img, s1, 10, tools.ORANGE)
        ps1 = geometry.Segment(vec(s1.p1),vec(s1.p2))
        ps1.rotate(PI/2)
        tools.draw_segment(img, ps1, 10, tools.ORANGE)
        ps1.rotate(random.uniform(-PI/2.1, PI/2.1))
        tools.draw_segment(img, ps1, 5, tools.RED)
        ps2 = geometry.Segment(vec(s1.p1),vec(s1.p2))
        ps2.rotate(-PI/2)
        tools.draw_segment(img, ps2, 10, tools.RED)
        ps2.rotate(random.uniform(-PI/2.1, PI/2.1))
        tools.draw_segment(img, ps2, 5, tools.GREEN)

        #################################
        # Area cut
        #################################

        base_pos = Vector.lerp(circle.vertices[0], circle.vertices[1], .5)
        cut_line = geometry.Segment(base_pos, vec(circle.vertices[0]), True)
        cut_line.rotate(.01)
        lsec2_area = random.uniform(0.01,.999)
        lsec2,rsec2 = circle.cut_area_percentage(cut_line, PI, lsec2_area)
        tools.draw_polygon(img, lsec2, 5, tools.ORANGE)
        tools.draw_polygon(img, rsec2, 5, tools.ORANGE)

        #################################
        # Text info 
        #################################

        infos = []
        infos += [f"Edges: {vertices}"]
        infos += [f"Radius: {circle_radius:.2f}"]
        side_length = (circle.vertices[1]-circle.vertices[0]).getLength()
        infos += [f"Side length: {side_length:.2f}"]
        infos += [f"Yellow area-based cut: {lsec2_area:.2f}"]
        if lsec is not None:
            infos += [f"Area lsec: {lsec.area():.2f}"]
            infos += [f"Area rsec: {rsec.area():.2f}"]
            infos += [f"Area sum: {(lsec.area()+rsec.area()):.2f}"]
        infos += [f"Area total: {circle.area():.2f}"]

        img = tools.draw_text_list(img, Vector(50,50), infos, distance=50)
        
        #################################
        # Draw  
        #################################

        cv.imshow("tree", img)
        key = cv.waitKey(1 if auto else -1)
        if key == ord(' '):
            auto = not auto

        #################################
        # Extra checks 
        #################################
        actual_area_perc = lsec2.area()/circle.area()
        assert geometry.geq(actual_area_perc, lsec2_area)
        assert s1.has_at_right(ps1.p2)
        assert (not s1.has_at_right(ps2.p2)) or s1.p1 == ps2.p2

        if lsec is not None:
            assert geometry.geq(lsec.area() + rsec.area(), circle.area())
        assert nv == vertices
        assert (lsec is None) == (rsec is None)
        if i1 is not None: 
            assert i1 in l1
            assert i1 in l2
            assert i1 != i1 + Vector(0,0.0001)
            assert i1 == i1 + Vector(0.0000000001,0.000000000001) # geq
        if i2 is not None: 
            assert i2 in l1 
            assert i2 in l2