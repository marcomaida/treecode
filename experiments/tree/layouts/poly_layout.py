import math

from tree import tree
from util.vector import Vector
from util.vector import vec
from util.geometry import Segment

PI = math.pi

def layout(t, polygon, start_pos, leaf_siblings = ([],[])):
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
    furthest = Vector.lerp(furthest, centroid, .1)

    # Decide position of main branch
    weight = 1/t.max_depth
    t.position = Vector.lerp(start_pos, furthest, weight)

    # Handle leaf siblings
    lsib,rsib = leaf_siblings
    left_v = polygon.closest_vertex_to_point_on_perimeter(start_pos, True, False)
    right_v = polygon.closest_vertex_to_point_on_perimeter(start_pos, False, True)
    assert left_v is not None 
    assert right_v is not None 
    assert left_v != right_v
    seg_to_centroid = Segment(start_pos, centroid)
    assert seg_to_centroid.has_at_right(right_v)
    assert not seg_to_centroid.has_at_right(left_v)
    max_lerp = .9
    for i,f in enumerate(lsib,1):
        l = i/len(lsib)*max_lerp
        f.position = Vector.lerp(t.position, left_v, l)
    for i,f in enumerate(rsib,1):
        l = i/len(rsib)*max_lerp
        f.position = Vector.lerp(t.position, right_v, l)

    # Prune branche to the shortest (aesthetics)
    main_len = Vector.distance(start_pos, t.position)
    min_len = min([Vector.distance(start_pos, f.position) 
                   for f in lsib+rsib+[t]], 
                   default = main_len)
    for b in lsib+rsib+[t]:
        dist = Vector.distance(start_pos, b.position)
        if min_len < dist:
            seg_prune = Segment(start_pos, b.position)
            seg_prune.set_length(min_len)
            b.position = seg_prune.p2

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
    
    merged_children = merge_children(t.children)

    for i,(c,lsib,rsib) in enumerate(merged_children):
        if i == len(merged_children)-1: # last child takes all the polygon
            layout(c, cpolygon, vec(t.position), (lsib,rsib))
        else:
            tpos = vec(t.position)
            weight = c.n_descendants / (t.n_descendants -1)
            assert weight > 0.
            cut_line = Segment(tpos, cpolygon.centroid(), True)

            # Get point at left of sitting edge of polygon
            cv = cpolygon.closest_vertex_to_point_on_perimeter(tpos, True, False)
            assert cv is not None
            cut_line.p2 = cv
            cut_line.rotate(PI/180) # Start with a valid cut

            lsec, rsec = cpolygon.cut_area_percentage(cut_line, PI-.001, weight)
            assert(lsec is not None)
            layout(c, lsec, vec(tpos), (lsib,rsib))
            cpolygon = rsec
 
def merge_children(children):
    # Handling merging of leaf siblings to improve space utilization 
    # The code works for an arbitrary number of children because why not
    merged_children = [] # (child, left leaf siblings, right leaf siblings)
    if all([c.max_depth == 1 for c in children]): # all leaves
        m = len(children)//2 # middle child
        merged_children = [(children[m],children[:m],children[m+1:])]
    else:
        lsib = []
        rsib = []
        child = None
        for c in children:
            if c.max_depth > 1:
                if child is not None:
                    merged_children.append((child, lsib, rsib))
                    lsib=[]
                    rsib=[]
                child = c
            else:       
                if child is None: 
                    lsib.append(c)
                else:             
                    rsib.append(c)

        assert child is not None
        merged_children.append((child, lsib, rsib))

    assert sum([sum(map(len,mc[1:]))+1 for mc in merged_children]) == len(children)

    return merged_children

    

    
    

    


