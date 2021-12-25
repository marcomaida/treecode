import math

from tree import tree
from util.vector import Vector
from util.vector import vec
from util.geometry import Segment

PI = math.pi

def layout(t, polygon, start_pos, leaf_bros = ([],[])):
    assert polygon is not None
    assert polygon.has_on_perimeter(start_pos)

    # 1 - grow branch, cut
    centroid = polygon.centroid()
    vline = Segment(start_pos, centroid, True)
    itss = [vline.intersection(polygon.segment(i))
            for i in range(len(polygon.vertices)) 
            if vline.intersection(polygon.segment(i)) is not None]
    furthest = None
    for its in itss:
        if (furthest == None or 
           Vector.distance(start_pos, its) >
           Vector.distance(start_pos, furthest)):
           furthest = its
    assert furthest != None

    weight = 1/t.max_depth
    t.position = Vector.lerp(start_pos, furthest, weight)

    # Base case
    if t.children == []: 
        return

    # 1 - cut horizontal wasted space
    cut_line = Segment(t.position, start_pos, True)
    cut_line.rotate(-PI/2)
    lsec, rsec = polygon.cut(cut_line)
    assert lsec is not None and rsec is not None
    #assert lsec.area() >= rsec.area()
    ins1 = lsec.has_on_perimeter(start_pos)
    ins2 = rsec.has_on_perimeter(start_pos)
    assert ins1 != ins2

    # 2 - subdivide space and call recursively
    cpolygon = rsec if ins1 else lsec # Children polygon
    assert cpolygon.has_on_perimeter(t.position)

    total_descendants = t.n_descendants -1
    for i,c in enumerate(t.children):
        if i == len(t.children)-1: # last child takes all the polygon
            layout(c, cpolygon, vec(t.position))
        else:
            tpos = vec(t.position)
            weight = c.n_descendants / total_descendants
            assert weight > 0.
            cut_line = Segment(tpos, cpolygon.centroid(), True)

            # Get point at left of sitting edge of polygon
            ss = [cpolygon.segment(i) for i in range(len(cpolygon.vertices))
                                      if tpos in cpolygon.segment(i)]
            cv = None # closest vertex on the left
            vs = [v for s in ss for v in (s.p1, s.p2)]
            for v in vs:
                if (not cut_line.has_at_right(v) and
                    tpos != v and 
                    (cv == None or 
                     Vector.distance(tpos, v) <
                     Vector.distance(tpos, cv))):
                    cv = v
            assert cv is not None
            cut_line.p2 = cv
            cut_line.rotate(0.001) # Start with a valid cut

            lsec, rsec = cpolygon.cut_area_percentage(cut_line, PI-.001, weight)
            assert(lsec is not None)
            layout(c, lsec, vec(tpos))
            cpolygon = rsec
 
    




    

    
    

    


