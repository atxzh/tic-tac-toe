
### SVG

1. The `currentColor` at each `<path>`, `<line>` or other sub `<svg>` tags refers to the fixed color. which can be modified with `color` when calling.

2. SVG Sprites can't be used with css directly.
    - Need to specify `background-position`

### Pseudo Classes

1. `:has` always looks for the selector list of elements it contains
    - `:is` instead looks for any selector it contains within
    - `:where` is similar but has no specificity rule

### JavaScript

1. Using `Array.prototype.every` to return `true` if condition is successful for all the elements in the array

2. Use `.bind()` as a way to partially set arguments and return the function later for other use.