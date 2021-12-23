from warnings import simplefilter
import util.vector
from util.vector import vec
from util.vector import Vector
import math, numpy as np

TOL=util.vector.TOL # Tolerance for two numbers considereded equal

def geq(n1,n2):
    return math.isclose(n1,n2, abs_tol=TOL)

class Polygon:
    def __init__(self, vertices):
        self.vertices = vertices

    def __str__(self):
        return str(self.vertices)
    __repr__ = __str__

    def centroid(self):
        return sum(self.vertices, start=Vector(0,0))/len(self.vertices)

    def segment(self, i):
        assert i < len(self.vertices)
        return Segment(self.vertices[i], self.vertices[(i+1)%len(self.vertices)])

    def translate(self, vec):
        for v in self.vertices:
            v += vec

    def cut(self, line):
        assert line.is_line

        intersections = [(i, line.intersection(self.segment(i))) 
                             for i in range(len(self.vertices)) 
                             if line.intersection(self.segment(i)) is not None]
        
        if len(intersections) < 2:
            return None, None
            
        if len(intersections) > 2: # removing duplicate intersections in case on cut on vertex
            uniq_its =[]
            for its in intersections:
                inside = False
                for uits in uniq_its:
                    inside = its[1] == uits[1]
                    if inside: break
                if not inside:
                    uniq_its.append(its)
            intersections = uniq_its

        assert len(intersections) == 2

        i1,i2 = (intersections[0], intersections[1])  # in the form (vertex index, intersection) 
        assert i1[0] != i2[0]
        if i2[0] < i1[0]: i1,i2 = i2,i1 # ordered pair

        s1 = [Vector(v) for v in self.vertices[i1[0]+1:i2[0]+1]]
        l_vs = [vec(i1[1])] + s1 + [vec(i2[1])]

        s2 = [Vector(v) for v in self.vertices]
        r_vs = [vec(i1[1]), vec(i2[1])] + s2[i2[0]+1:] + s2[:i1[0]+1]

        return Polygon(l_vs), Polygon(r_vs)
    
    @staticmethod
    def circle(center, radius, n_edges):
        vs = [Vector(math.cos(a), math.sin(a))*radius + center for a in np.linspace(math.pi/2.,-math.pi*3/2, n_edges, endpoint=False)]
        return Polygon(vs)

class Segment:
    def __init__(self, p1, p2, is_line=False):
        self.p1 = p1
        self.p2 = p2
        self.is_line = is_line

    def __str__(self) -> str:
        return f"{self.p1} -> {self.p2}"
    __repr__ = __str__
    
    def __contains__(self, vec):
        x1,y1 = self.p1.x, self.p1.y
        x2,y2 = self.p2.x, self.p2.y
        x3,y3 = vec.x, vec.y

        if geq(x1,x2): # vertical line
            return geq(x2,x3) and (self.is_line or (y1 <= y3 <= y2 or y1 >= y3 >= y2))
        if geq(y1,y2): # horizontal line
            return geq(y2,y3) and (self.is_line or (x1 <= x3 <= x2 or x1 >= x3 >= x2))

        tx = (x3-x2)/(x1-x2)
        ty = (y3-y2)/(y1-y2)
        return geq(tx, ty) and (self.is_line or (0 <= tx <= 1))

    def translate(self, vec):
        self.p1 +=vec
        self.p2 +=vec

    def intersection(self, line):
        x1,y1 = self.p1.x, self.p1.y
        x2,y2 = self.p2.x, self.p2.y
        x3,y3 = line.p1.x, line.p1.y
        x4,y4 = line.p2.x, line.p2.y

        dx1 = x2 - x1
        dx2 = x4 - x3
        dy1 = y2 - y1
        dy2 = y4 - y3
        dx3 = x1 - x3
        dy3 = y1 - y3

        det = dx1 * dy2 - dx2 * dy1
        det1 = dx1 * dy3 - dx3 * dy1
        det2 = dx2 * dy3 - dx3 * dy2

        if geq(det,0.0):  # lines are parallel
            if not geq(det1,0.0) \
               or not geq(det2,0.0):  # lines are not co-linear
                return None  # so no solution

            if self.p1 in line: return vec(self.p1) 
            if self.p2 in line: return vec(self.p2)
            if line.p1 in self: return vec(line.p1)
            if line.p2 in self: return vec(line.p2)
            assert False # Should never reach here

        s = det1 / det
        t = det2 / det
        sok = line.is_line or (0.0 <= s <= 1.0)
        tok = self.is_line or (0.0 <= t <= 1.0)
        if sok and tok:
            return Vector(x1 + t * dx1, y1 + t * dy1)