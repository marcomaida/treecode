from ui.experiments import (ui_polygon, ui_text, worst_case_capacity, 
                            enumeration, ui_geometry_debug, ui_graph_tool)
from ui import ui_tools as tools

def run():
    img = tools.create_canvas()
    #worst_case_capacity.run(img)
    #ui_text.run(img)
    #ui_polygon.run(img)
    #ui_geometry_debug.run(img)
    #tools.destroy_canvas()
    ui_graph_tool.run()