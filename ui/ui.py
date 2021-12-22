from ui.experiments import worst_case_capacity, enumeration, text, polygon
from ui import ui_tools as tools

def run():
	img = tools.create_canvas()
	#worst_case_capacity.run(img)
	#text.run(img)
	polygon.run(img)
	tools.destroy_canvas()