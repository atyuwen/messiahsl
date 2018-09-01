// Modified from https://github.com/stef-levesque/vscode-shader/blob/master/src/hlsl/hlslGlobals.ts

exports.intrinsicfunctions = {
    abs: {
        desc: "Returns the absolute value of the specified value.",
        params: [
            { label: 'value', doc: "The specified value" }
        ],
        link: "https://msdn.microsoft.com/en-us/library/windows/desktop/bb509562(v=vs.85).aspx"
    },
    acos: {
        desc: "Returns the arccosine of the specified value.",
        params: [
            { label: 'value', doc: "The specified value. Each component should be a floating-point value within the range of -1 to 1." }
        ],
        link: "https://msdn.microsoft.com/en-us/library/windows/desktop/bb509563(v=vs.85).aspx"
    },
    all: {
        desc: "Determines if all components of the specified value are non-zero.",
        params: [
            { label: 'value', doc: "The specified value" }
        ],
        link: "https://msdn.microsoft.com/en-us/library/windows/desktop/bb509564(v=vs.85).aspx"
    },
    any: {
        desc: "Determines if any components of the specified value are non-zero.",
        params: [
            { label: 'value', doc: "The specified value" }
        ],
        link: "https://msdn.microsoft.com/en-us/library/windows/desktop/bb509565(v=vs.85).aspx"
    },
    asin: {
        desc: "Returns the arcsine of the specified value.",
        params: [
            { label: 'value', doc: "The specified value" }
        ],
        link: "https://msdn.microsoft.com/en-us/library/windows/desktop/bb509571(v=vs.85).aspx"
    },
    atan: {
        desc: "Returns the arctangent of the specified value.",
        params: [
            { label: 'value', doc: "The specified value" }
        ],
        link: "https://msdn.microsoft.com/en-us/library/windows/desktop/bb509574(v=vs.85).aspx"
    },
    atan2: {
        desc: "Returns the arctangent of two values (x,y).",
        params: [
            { label: 'y', doc: "The y value." },
            { label: 'x', doc: "The x value." }
        ],
        link: "https://msdn.microsoft.com/en-us/library/windows/desktop/bb509575(v=vs.85).aspx"
    },
    ceil: {
        desc: "Returns the smallest integer value that is greater than or equal to the specified value.",
        params: [
            { label: 'value', doc: "The specified value" }
        ],
        link: "https://msdn.microsoft.com/en-us/library/windows/desktop/bb509577(v=vs.85).aspx"
    },
    clamp: {
        desc: "Clamps the specified value to the specified minimum and maximum range.",
        params: [
            { label: 'value', doc: "A value to clamp." },
            { label: 'min', doc: "The specified minimum range." },
            { label: 'max', doc: "The specified maximum range." }
        ],
        link: "https://msdn.microsoft.com/en-us/library/windows/desktop/bb204824(v=vs.85).aspx"
    },
    clip: {
        desc: "Discards the current pixel if the specified value is less than zero.",
        params: [
            { label: 'value', doc: "The specified value" }
        ],
        link: "https://msdn.microsoft.com/en-us/library/windows/desktop/bb204826(v=vs.85).aspx"
    },
    cos: {
        desc: "Returns the cosine of the specified value.",
        params: [
            { label: 'value', doc: "The specified value, in radians." }
        ],
        link: "https://msdn.microsoft.com/en-us/library/windows/desktop/bb509583(v=vs.85).aspx"
    },
    cross: {
        desc: "Returns the cross product of two floating-point, 3D vectors.",
        params: [
            { label: 'x', doc: "The first floating-point, 3D vector." },
            { label: 'y', doc: "The second floating-point, 3D vector." }
        ],
        link: "https://msdn.microsoft.com/en-us/library/windows/desktop/bb509585(v=vs.85).aspx"
    },
    ddx: {
        desc: "Returns the partial derivative of the specified value with respect to the screen-space x-coordinate.",
        params: [
            { label: 'value', doc: "The specified value." }
        ],
        link: "https://msdn.microsoft.com/en-us/library/windows/desktop/bb509588(v=vs.85).aspx"
    },
    ddy: {
        desc: "Returns the partial derivative of the specified value with respect to the screen-space y-coordinate.",
        params: [
            { label: 'value', doc: "The specified value." }
        ],
        link: "https://msdn.microsoft.com/en-us/library/windows/desktop/bb509589(v=vs.85).aspx"
    },
    degrees: {
        desc: "Converts the specified value from radians to degrees.",
        params: [
            { label: 'value', doc: "The specified value." }
        ],
        link: "https://msdn.microsoft.com/en-us/library/windows/desktop/bb509590(v=vs.85).aspx"
    },
    determinant: {
        desc: "Returns the determinant of the specified floating-point, square matrix.",
        params: [
            { label: 'value', doc: "The specified value." }
        ],
        link: "https://msdn.microsoft.com/en-us/library/windows/desktop/bb509591(v=vs.85).aspx"
    },
    distance: {
        desc: "Returns a distance scalar between two vectors.",
        params: [
            { label: 'x', doc: "The first floating-point vector to compare." },
            { label: 'y', doc: "The second floating-point vector to compare." }
        ],
        link: "https://msdn.microsoft.com/en-us/library/windows/desktop/bb509592(v=vs.85).aspx"
    },
    dot: {
        desc: "Returns the dot product of two vectors.",
        params: [
            { label: 'x', doc: "The first vector." },
            { label: 'y', doc: "The second vector." }
        ],
        link: "https://msdn.microsoft.com/en-us/library/windows/desktop/bb509594(v=vs.85).aspx"
    },
    exp: {
        desc: "Returns the base-e exponential, or e^x, of the specified value.",
        params: [
            { label: 'value', doc: "The specified value." }
        ],
        link: "https://msdn.microsoft.com/en-us/library/windows/desktop/bb509595(v=vs.85).aspx"
    },
    exp2: {
        desc: "Returns the base 2 exponential, or 2^x, of the specified value.",
        params: [
            { label: 'value', doc: "The specified value." }
        ],
        link: "https://msdn.microsoft.com/en-us/library/windows/desktop/bb509596(v=vs.85).aspx"
    },
    floor: {
        desc: "Returns the largest integer that is less than or equal to the specified value.",
        params: [
            { label: 'value', doc: "The specified value." }
        ],
        link: "https://msdn.microsoft.com/en-us/library/windows/desktop/bb509599(v=vs.85).aspx"
    },
    fmod: {
        desc: "Returns the floating-point remainder of x/y.",
        params: [
            { label: 'x', doc: "The floating-point dividend." },
            { label: 'y', doc: "The floating-point divisor." }
        ],
        link: "https://msdn.microsoft.com/en-us/library/windows/desktop/bb509601(v=vs.85).aspx"
    },
    frac: {
        desc: "Returns the fractional (or decimal) part of x; which is greater than or equal to 0 and less than 1.",
        params: [
            { label: 'value', doc: "The specified value." }
        ],
        link: "https://msdn.microsoft.com/en-us/library/windows/desktop/bb509603(v=vs.85).aspx"
    },
    frexp: {
        desc: "Returns the mantissa and exponent of the specified floating-point value.",
        params: [
            { label: 'x', doc: "The specified floating-point value. If the x parameter is 0, this function returns 0 for both the mantissa and the exponent." },
            { label: 'exp', doc: "The returned exponent of the x parameter." }
        ],
        link: "https://msdn.microsoft.com/en-us/library/windows/desktop/bb509604(v=vs.85).aspx"
    },
    fwidth: {
        desc: "Returns the absolute value of the partial derivatives of the specified value.",
        params: [
            { label: 'value', doc: "The specified value." }
        ],
        link: "https://msdn.microsoft.com/en-us/library/windows/desktop/bb509608(v=vs.85).aspx"
    },
    isfinite: {
        desc: "Determines if the specified floating-point value is finite.",
        params: [
            { label: 'value', doc: "The specified value." }
        ],
        link: "https://msdn.microsoft.com/en-us/library/windows/desktop/bb509612(v=vs.85).aspx"
    },
    isinf: {
        desc: "Determines if the specified value is infinite.",
        params: [
            { label: 'value', doc: "The specified value." }
        ],
        link: "https://msdn.microsoft.com/en-us/library/windows/desktop/bb509613(v=vs.85).aspx"
    },
    isnan: {
        desc: "Determines if the specified value is NAN or QNAN.",
        params: [
            { label: 'value', doc: "The specified value." }
        ],
        link: "https://msdn.microsoft.com/en-us/library/windows/desktop/bb509614(v=vs.85).aspx"
    },
    length: {
        desc: "Returns the length of the specified floating-point vector.",
        params: [
            { label: 'value', doc: "The specified floating-point vector." }
        ],
        link: "https://msdn.microsoft.com/en-us/library/windows/desktop/bb509617(v=vs.85).aspx"
    },
    lerp: {
        desc: "Performs a linear interpolation.",
        params: [
            { label: 'x', doc: "The first floating-point value." },
            { label: 'y', doc: "The second floating-point value." },
            { label: 's', doc: "A value that linearly interpolates between the x parameter and the y parameter." }
        ],
        link: "https://msdn.microsoft.com/en-us/library/windows/desktop/bb509618(v=vs.85).aspx"
    },
    log: {
        desc: "Returns the base-e logarithm of the specified value.",
        params: [
            { label: 'value', doc: "The specified value." }
        ],
        link: "https://msdn.microsoft.com/en-us/library/windows/desktop/bb509620(v=vs.85).aspx"
    },
    log10: {
        desc: "Returns the base-10 logarithm of the specified value.",
        params: [
            { label: 'value', doc: "The specified value." }
        ],
        link: "https://msdn.microsoft.com/en-us/library/windows/desktop/bb509621(v=vs.85).aspx"
    },
    log2: {
        desc: "Returns the base-2 logarithm of the specified value.",
        params: [
            { label: 'value', doc: "The specified value." }
        ],
        link: "https://msdn.microsoft.com/en-us/library/windows/desktop/bb509622(v=vs.85).aspx"
    },
    max: {
        desc: "Selects the greater of x and y.",
        params: [
            { label: 'x', doc: "The x input value." },
            { label: 'y', doc: "The y input value." }
        ],
        link: "https://msdn.microsoft.com/en-us/library/windows/desktop/bb509624(v=vs.85).aspx"
    },
    min: {
        desc: "Selects the lesser of x and y.",
        params: [
            { label: 'x', doc: "The x input value." },
            { label: 'y', doc: "The y input value." }
        ],
        link: "https://msdn.microsoft.com/en-us/library/windows/desktop/bb509625(v=vs.85).aspx"
    },
    modf: {
        desc: "Splits the value x into fractional and integer parts, each of which has the same sign as x.",
        params: [
            { label: 'x', doc: "The x input value." },
            { label: 'ip', doc: "The integer portion of x." }
        ],
        link: "https://msdn.microsoft.com/en-us/library/windows/desktop/bb509627(v=vs.85).aspx"
    },
    mul: {
        desc: "Multiplies x and y using matrix math. The inner dimension x-columns and y-rows must be equal.",
        params: [
            { label: 'x', doc: "The x input value. If x is a vector, it treated as a row vector." },
            { label: 'y', doc: "The y input value. If y is a vector, it treated as a column vector." }
        ],
        link: "https://msdn.microsoft.com/en-us/library/windows/desktop/bb509628(v=vs.85).aspx"
    },
    normalize: {
        desc: "Normalizes the specified floating-point vector according to x / length(x).",
        params: [
            { label: 'value', doc: "The specified floating-point vector." }
        ],
        link: "https://msdn.microsoft.com/en-us/library/windows/desktop/bb509630(v=vs.85).aspx"
    },
    pow: {
        desc: "Returns the specified value raised to the specified power.",
        params: [
            { label: 'x', doc: "The specified value." },
            { label: 'y', doc: "The specified power." }
        ],
        link: "https://msdn.microsoft.com/en-us/library/windows/desktop/bb509636(v=vs.85).aspx"
    },
    rcp: {
        desc: "Calculates a fast, approximate, per-component reciprocal.",
        params: [
            { label: 'value', doc: "The input value." }
        ],
        link: "https://msdn.microsoft.com/en-us/library/windows/desktop/ff471436(v=vs.85).aspx"
    },
    reflect: {
        desc: "Returns a reflection vector using an incident ray and a surface normal.",
        params: [
            { label: 'i', doc: "A floating-point, incident vector." },
            { label: 'n', doc: "A floating-point, normal vector." }
        ],
        link: "https://msdn.microsoft.com/en-us/library/windows/desktop/bb509639(v=vs.85).aspx"
    },
    refract: {
        desc: "Returns a refraction vector using an entering ray, a surface normal, and a refraction index.",
        params: [
            { label: 'i', doc: "A floating-point, ray direction vector." },
            { label: 'n', doc: "A floating-point, surface normal vector." },
            { label: 'η', doc: "A floating-point, refraction index scalar." }
        ],
        link: "https://msdn.microsoft.com/en-us/library/windows/desktop/bb509640(v=vs.85).aspx"
    },
    round: {
        desc: "Rounds the specified value to the nearest integer.",
        params: [
            { label: 'value', doc: "The specified value." }
        ],
        link: "https://msdn.microsoft.com/en-us/library/windows/desktop/bb509642(v=vs.85).aspx"
    },
    rsqrt: {
        desc: "Returns the reciprocal of the square root of the specified value.",
        params: [
            { label: 'value', doc: "The specified value." }
        ],
        link: "https://msdn.microsoft.com/en-us/library/windows/desktop/bb509643(v=vs.85).aspx"
    },
    saturate: {
        desc: "Clamps the specified value within the range of 0 to 1.",
        params: [
            { label: 'value', doc: "The specified value." }
        ],
        link: "https://msdn.microsoft.com/en-us/library/windows/desktop/bb509645(v=vs.85).aspx"
    },
    sign: {
        desc: "Returns the sign of x.",
        params: [
            { label: 'value', doc: "The input value." }
        ],
        link: "https://msdn.microsoft.com/en-us/library/windows/desktop/bb509649(v=vs.85).aspx"
    },
    sin: {
        desc: "Returns the sine of the specified value.",
        params: [
            { label: 'value', doc: "The specified value, in radians." }
        ],
        link: "https://msdn.microsoft.com/en-us/library/windows/desktop/bb509651(v=vs.85).aspx"
    },
    sincos: {
        desc: "Returns the sine and cosine of x.",
        params: [
            { label: 'value', doc: "The specified value, in radians." },
            { label: 's', doc: "Returns the sine of x." },
            { label: 'c', doc: "Returns the cosine of x." }
        ],
        link: "https://msdn.microsoft.com/en-us/library/windows/desktop/bb509652(v=vs.85).aspx"
    },
    smoothstep: {
        desc: "Returns a smooth Hermite interpolation between 0 and 1, if x is in the range [min, max].",
        params: [
            { label: 'min', doc: "The minimum range of the x parameter." },
            { label: 'max', doc: "The maximum range of the x parameter." },
            { label: 'x', doc: "The specified value to be interpolated." }
        ],
        link: "https://msdn.microsoft.com/en-us/library/windows/desktop/bb509658(v=vs.85).aspx"
    },
    sqrt: {
        desc: "Returns the square root of the specified floating-point value, per component.",
        params: [
            { label: 'value', doc: "The specified floating-point value." }
        ],
        link: "https://msdn.microsoft.com/en-us/library/windows/desktop/bb509662(v=vs.85).aspx"
    },
    step: {
        desc: "Compares two values, returning 0 or 1 based on which value is greater.",
        params: [
            { label: 'y', doc: "The first floating-point value to compare." },
            { label: 'x', doc: "The second floating-point value to compare." }
        ],
        link: "https://msdn.microsoft.com/en-us/library/windows/desktop/bb509665(v=vs.85).aspx"
    },
    tan: {
        desc: "Returns the tangent of the specified value.",
        params: [
            { label: 'value', doc: "The specified value, in radians." }
        ],
        link: "https://msdn.microsoft.com/en-us/library/windows/desktop/bb509670(v=vs.85).aspx"
    },
    transpose: {
        desc: "Transposes the specified input matrix.",
        params: [
            { label: 'value', doc: "The specified matrix." }
        ],
        link: "https://msdn.microsoft.com/en-us/library/windows/desktop/bb509701(v=vs.85).aspx"
    },
    trunc: {
        desc: "Truncates a floating-point value to the integer component.",
        params: [
            { label: 'value', doc: "The specified input." }
        ],
        link: "https://msdn.microsoft.com/en-us/library/windows/desktop/cc308065(v=vs.85).aspx"
    },
    ".Sample": {
        desc: "Sample a texture object.",
        params: [
            { label: 'sampler', doc: "The specified sampler object." },
            { label: 'location', doc: "The specified texture location." }
        ],
    },
    ".SampleRGBA": {
        desc: "Sample a texture object (separated alpha enabled).",
        params: [
            { label: 'sampler', doc: "The specified sampler object." },
            { label: 'location', doc: "The specified texture location." }
        ],
    },
    ".SampleBias": {
        desc: "Sample a texture object with mip bias.",
        params: [
            { label: 'sampler', doc: "The specified sampler object." },
            { label: 'location', doc: "The specified texture location." },
            { label: 'bias', doc: "The mip bias value." }
        ],
    },
    ".SampleRGBABias": {
        desc: "Sample a texture object with mip bias (separated alpha enabled).",
        params: [
            { label: 'sampler', doc: "The specified sampler object." },
            { label: 'location', doc: "The specified texture location." },
            { label: 'bias', doc: "The mip bias value." }
        ],
    },
    ".SampleGrad": {
        desc: "Sample a texture object with specified gradient.",
        params: [
            { label: 'sampler', doc: "The specified sampler object." },
            { label: 'location', doc: "The specified texture location." },
            { label: 'ddx', doc: "The ddx gradient." },
            { label: 'ddy', doc: "The ddy gradient." }
        ],
    },
    ".SampleLevel": {
        desc: "Sample a texture object with specified lod.",
        params: [
            { label: 'sampler', doc: "The specified sampler object." },
            { label: 'location', doc: "The specified texture location." },
            { label: 'lod', doc: "The specified lod." },
        ],
    },
    ".Load": {
        desc: "Load value from a texture object.",
        params: [
            { label: 'index', doc: "The specified index." }
        ],
    },
    ".Store": {
        desc: "Store value to a texture object.",
        params: [
            { label: 'index', doc: "The specified index." },
            { label: 'value', doc: "The specified value." }
        ],
    },
}
