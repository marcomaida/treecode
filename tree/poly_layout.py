import math

from tree import tree
from util.vector import Vector

PI = math.pi

def layout(t, polygon, start_vertex_idx):
    assert start_vertex_idx < len(polygon.vertices)

    # Base case
    if t.children == []:
        t.position = polygon.centroid()
        return
    
    
    
    

    


