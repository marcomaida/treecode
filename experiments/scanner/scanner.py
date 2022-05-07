import matplotlib.pyplot as plt
from skimage import io
from skimage.color import rgb2gray

##################################### 
### Reading image
##################################### 

original = io.imread("examples/Hello world!.png")

##################################### 
### Processing image
##################################### 

original = original[:,:,:3]
processed = rgb2gray(original)

##################################### 
### Plot original and processed
##################################### 
fig, axes = plt.subplots(1, 2, figsize=(8, 4))
ax = axes.ravel()
ax[0].imshow(original)
ax[0].set_title("Original")
ax[1].imshow(processed, cmap=plt.cm.gray)
ax[1].set_title("Processed")
fig.tight_layout()
plt.show()