from graph_tool.all import *

def run():
    g = Graph()

    v1 = g.add_vertex()
    v2 = g.add_vertex()

    e = g.add_edge(v1, v2)

    graph_draw(g, vertex_text=g.vertex_index, output="two-nodes.pdf")
    interactive_window(g)