from ui.experiments import worst_case_capacity, enumeration, text
from ui import ui_tools as tools

def run():
	img = tools.create_canvas()
	#worst_case_capacity.run(img)
	#worst_case_capacity.run(img)
	text.run(img)
	tools.destroy_canvas()