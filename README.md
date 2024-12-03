# convolve-2

Starting off small, then slowly moving to something that will guide a brush to make an image.

## Starting simple

Two canvases are for editing and seeing what happens with a brush stroke (in a miniature 4x4 canvas) convolved against a target image (not much bigger).

It helps to start off small, just to get the bugs out and predict what the outcome will be (and checking assumptions against output).

Better to stare at graphics than tables of numbers, so I spent the time to make the paint like editor and to display the results visually.

## Next steps

Once all the matches are found, a random pick from the top ranked spots in the convolution will act as the painted stroke and be painted magenta in the target. Then run the whole thing again and again until no matches are found.

Each stroke stored for use in the brush plotter.

## Scaling out and up

Larger resolution and value depth of brush stroke images, as well as bigger and deeper target images will make the search bigger and the results more interesting. 

So far all this has been monochrome (with the exception of magenta as a marker color) but with a catalog of paints, brushes and brush-strokes.

