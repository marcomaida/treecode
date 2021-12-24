import math

from tree import tree
from util.vector import Vector

PI = math.pi

def layout(t, polygon, start_pos):
    assert start_pos < len(polygon.vertices)

    # Base case
    if t.children == []:
        t.position = polygon.centroid()
        return

    # 1 - grow branch, cut
    
    

    
    

    


