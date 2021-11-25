"""
Data about how trees grow and how much data they can contain.
"""

from matplotlib import pyplot
import numpy as np
import math

qr = {
"QR_V1 (smallest)" : 21**2,
"QR_V4 (standard)" : 33**2,
"QR_V10" : 57**2,
"QR_V25" : 117**2,
"QR_V40 (biggest)" : 177**2 }

def treegrowth(max_branches_per_fork, l, fork_types = 1):
    assert max_branches_per_fork > 1
    assert l > 0
    r = max_branches_per_fork
    for _ in range(l-2):
        new_r = 1
        for b in range(2,max_branches_per_fork+1):
            new_r += r**b
        r = new_r * fork_types
    return r

def evaluate_ranges():
    max_branches_per_fork = 3

    print(f"Max {max_branches_per_fork} max branches per fork allowed.\n")

    for i in range(1, 11):
        trees = treegrowth(max_branches_per_fork, i)
        bits = math.log2(trees)

        # Check QR code capacity
        for (name, val) in qr.items():
            if val < bits:
                print(f"\n<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<, {name} ({val} bits) <<<")
        qr = {k: v for k, v in qr.items() if v >= bits}

        print("")
        print(f"#### {i} layers")
        print (f"10^{int(math.log10(trees))} trees")
        print (f"{int(max_branches_per_fork**i)} worst-case branches")
        print (f"{int(bits)} bits")
        print (f"{int(bits//8)} bytes")
        print (f"{int(bits//8//1024)} kB")
        print (f"{int(bits//16)} unicode chars")


