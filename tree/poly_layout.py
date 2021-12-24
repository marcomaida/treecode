import math

from tree import tree
from util.vector import Vector
from util.geometry import Segment

PI = math.pi

def layout(t, polygon, start_pos, space_perc=.05):
    assert polygon.has_on_perimeter(start_pos)

    centroid = polygon.centroid()
    # Base case
    if t.children == []:
        t.position = centroid
        return

    # 1 - grow branch, cut
    t.position = Vector.lerp(start_pos, centroid, space_perc)
    cut_line = Segment(t.position, start_pos, True)
    cut_line.rotate(PI/2)
    lsec, rsec = polygon.cut(cut_line)
    assert lsec is not None and rsec is not None
    assert lsec.area() >= rsec.area()
    ins1 = lsec.has_on_perimeter(start_pos)
    ins2 = rsec.has_on_perimeter(start_pos)
    assert ins1 != ins2

    # 2 - subdivide space and call recursively
    cpolygon = rsec if ins1 else lsec # Children polygon
    assert cpolygon.has_on_perimeter(t.position)
    total_descendants = t.n_descendants -1
    dweights = [c.n_descendants / total_descendants for c in t.children]

    
 
    




    

    
    

    


