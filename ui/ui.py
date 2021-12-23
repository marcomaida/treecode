from ui.experiments import (ui_polygon, worst_case_capacity, 
                            enumeration, text, ui_geometry_debug)
from ui import ui_tools as tools

def run():
    img = tools.create_canvas()
    #worst_case_capacity.run(img)
    #text.run(img)
    ui_polygon.run(img)
    #ui_geometry_debug.run(img)
    tools.destroy_canvas()