default: run-macos

run-macos:
	(sleep 1 && open http://localhost:731/index.html) & (cd treecode && python -m SimpleHTTPServer 731)

run-linux:
	cd treecode && sudo python -m SimpleHTTPServer 731 &
	sleep 1
	xdg-open http://localhost:731/index.html

find_server:
	ps -fA | grep SimpleHTTPServer