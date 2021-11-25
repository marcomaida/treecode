from ui.experiments import worst_case_capacity, enumeration
from ui import ui_tools as tools

def run():
	img = tools.create_canvas()
	#worst_case_capacity.run(img)
	#worst_case_capacity.run(img)
	enumeration.run(img)
	tools.destroy_canvas()