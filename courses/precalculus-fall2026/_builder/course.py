"""Course map for MATH 2412 Precalculus (Fall 2026, section 804): weekly order from the syllabus,
section titles, motivating questions, and the bridges that connect one section to the next."""
import datetime as dt

COURSE = "MATH 2412"
NAME = "Precalculus · Section 804"  # three Precalculus sections this fall; these pages are for Section 804
BASE = "/courses/precalculus-fall2026/"
TEXTBOOK = "https://openstax.org/books/precalculus-2e/pages/"  # syllabus: OpenStax Precalculus 2e
WEEK1 = dt.date(2026, 8, 24)  # Monday of week 1 (classes start Wednesday, Aug 26)

CHAPTERS = [
    ("5", "Chapter 5 · Trigonometric Functions", "fa-circle-notch"),
    ("6", "Chapter 6 · Periodic Functions", "fa-wave-square"),
    ("7", "Chapter 7 · Trigonometric Identities and Equations", "fa-equals"),
    ("8", "Chapter 8 · Further Applications of Trigonometry", "fa-compass-drafting"),
    ("10", "Chapter 10 · Analytic Geometry", "fa-bullseye"),
]

# id, slug, title, chapter, week, textbook slug, big question, card blurb
SECTIONS = [
    ("5.1", "5-1", "Angles", "5", 1, "5-1-angles",
     "How do we measure a <b>turn</b>, and what happens after one full rotation?",
     "Standard position, degrees and radians, coterminal and reference angles, arc length, sector area, and linear and angular speed."),
    ("5.2", "5-2", "Unit Circle: Sine and Cosine Functions", "5", 2, "5-2-unit-circle-sine-and-cosine-functions",
     "How can a point moving around a circle <b>define sine and cosine</b>?",
     "The unit circle, sin t = y and cos t = x, the Pythagorean identity, special angles, and reference angles."),
    ("5.3", "5-3", "The Other Trigonometric Functions", "5", 2, "5-3-the-other-trigonometric-functions",
     "What other ratios can we build from the point <b>(x, y)</b>?",
     "Tangent, cotangent, secant, and cosecant; even and odd functions; fundamental identities; calculator values."),
    ("5.4", "5-4", "Right Triangle Trigonometry", "5", 3, "5-4-right-triangle-trigonometry",
     "How do the angles of a right triangle <b>control the ratios of its sides</b>?",
     "SOH-CAH-TOA, missing sides, cofunctions of complementary angles, and angles of elevation and depression."),
    ("6.1", "6-1", "Graphs of the Sine and Cosine Functions", "6", 4, "6-1-graphs-of-the-sine-and-cosine-functions",
     "What do sine and cosine look like when we <b>unroll the unit circle</b>?",
     "Periodic functions, amplitude, period, phase shift, vertical shift, and midline of y = A sin(Bx − C) + D."),
    ("6.2a", "6-2-parts-1-2", "Graphs of Tangent and Cotangent", "6", 5, "6-2-graphs-of-the-other-trigonometric-functions",
     "What happens to a trig graph when the function <b>divides by zero</b>?",
     "Period π, vertical asymptotes, and reference points of y = A tan(Bx − C) + D and y = A cot(Bx − C) + D."),
    ("6.2b", "6-2-part-3", "Graphs of Secant and Cosecant", "6", 5, "6-2-graphs-of-the-other-trigonometric-functions",
     "How does a <b>reciprocal</b> turn a smooth wave into U-shaped branches?",
     "Secant and cosecant from their cosine and sine guide curves: asymptotes, domain, range, and shifts."),
    ("6.3", "6-3", "Inverse Trigonometric Functions", "6", 6, "6-3-inverse-trigonometric-functions",
     "If we know the value of sine, can we <b>recover the angle</b>?",
     "Restricted domains, arcsin, arccos, arctan, exact and calculator values, and compositions."),
    ("7.1", "7-1", "Solving Trigonometric Equations with Identities", "7", 7, "7-1-solving-trigonometric-equations-with-identities",
     "How do we <b>prove</b> that two different-looking expressions are always equal?",
     "Pythagorean, reciprocal, quotient, and even-odd identities; verifying identities and simplifying expressions."),
    ("7.2", "7-2", "Sum and Difference Identities", "7", 7, "7-2-sum-and-difference-identities",
     "How can two <b>special angles</b> give exact values for angles like 15° and 105°?",
     "Sum and difference formulas for cosine, sine, and tangent, with exact values and given-quadrant problems."),
    ("7.3", "7-3", "Double-Angle and Half-Angle Formulas", "7", 8, "7-3-double-angle-half-angle-and-reduction-formulas",
     "What happens to sine and cosine when an angle is <b>doubled or halved</b>?",
     "Double-angle formulas for sine, cosine, and tangent; half-angle formulas and choosing the sign."),
    ("7.5a", "7-5-part-1", "Solving Trigonometric Equations: Linear Equations", "7", 8, "7-5-solving-trigonometric-equations",
     "Which angles make a trig equation <b>true</b>, and how many are there?",
     "Linear equations in one trig function, solutions in an interval and general solutions, and calculator angles."),
    ("7.5b", "7-5-part-2", "Solving Trigonometric Equations: Factoring and Identities", "7", 9, "7-5-solving-trigonometric-equations",
     "How do factoring and identities break a hard trig equation into <b>easy pieces</b>?",
     "Equations in factored and quadratic form, rejecting impossible values, and using identities before solving."),
    ("8.1", "8-1", "Non-right Triangles: Law of Sines", "8", 10, "8-1-non-right-triangles-law-of-sines",
     "How do we solve a triangle that has <b>no right angle</b>?",
     "The Law of Sines for ASA, AAS, and the ambiguous SSA case; area with sine; applications."),
    ("8.2", "8-2", "Non-right Triangles: Law of Cosines", "8", 10, "8-2-non-right-triangles-law-of-cosines",
     "What replaces the Pythagorean Theorem when the angle is <b>not 90°</b>?",
     "The Law of Cosines for SAS and SSS triangles, navigation problems, and Heron's formula."),
    ("8.8", "8-8", "Vectors", "8", 11, "8-8-vectors",
     "How do we describe a quantity that has both <b>size and direction</b>?",
     "Component form, magnitude and direction, vector arithmetic, unit vectors, i and j, and the dot product."),
    ("8.3", "8-3", "Polar Coordinates", "8", 12, "8-3-polar-coordinates",
     "Can we locate a point by <b>distance and angle</b> instead of x and y?",
     "Plotting polar points, converting points between polar and rectangular form, and converting equations."),
    ("10.1a", "10-1-part-1", "The Ellipse: Definition and Equations", "10", 12, "10-1-the-ellipse",
     "What curve keeps the <b>sum of two distances</b> constant?",
     "Foci, vertices, and co-vertices; a² = b² + c²; writing standard equations of ellipses centered at the origin."),
    ("10.1b", "10-1-part-2", "The Ellipse: From Equation to Graph", "10", 13, "10-1-the-ellipse",
     "How do we read an ellipse's <b>shape from its equation</b>?",
     "Orientation, vertices, co-vertices, foci, and axis lengths from the equation, and graphing ellipses."),
    ("10.2", "10-2", "The Hyperbola", "10", 13, "10-2-the-hyperbola",
     "What curve keeps the <b>difference of two distances</b> constant?",
     "Transverse and conjugate axes, c² = a² + b², asymptotes and the central rectangle, writing and reading equations."),
    ("10.3", "10-3", "The Parabola", "10", 14, "10-3-the-parabola",
     "Which points are the <b>same distance</b> from a point and a line?",
     "Focus, directrix, and latus rectum; x² = 4py and y² = 4px; writing and reading equations."),
]

# Bridge text: why the next section matters, written from the end of the current section.
NEXT = {
    "5.1": "An angle in standard position has a terminal side that crosses the <b>unit circle</b> at exactly one point. The coordinates of that point are the two most important functions of the course: <b>cosine and sine</b>.",
    "5.2": "Sine and cosine are the y- and x-coordinates of a point. Next we divide and invert them to build the other four functions: <b>tangent, cotangent, secant, and cosecant</b>.",
    "5.3": "All six functions came from a point on a circle. Drop a perpendicular from that point to the x-axis and you get a <b>right triangle</b>: next we read the same ratios from its sides and use them to measure heights and distances.",
    "5.4": "So far each trig value came from one angle. Next we let the angle run along the x-axis and plot the outputs: the <b>graphs of sine and cosine</b>, and how A, B, C, and D reshape them.",
    "6.1": "Sine and cosine are smooth waves that never break. Their quotient <b>tan x = sin x / cos x</b> breaks wherever cos x = 0. Next: graphs with vertical asymptotes.",
    "6.2a": "Tangent and cotangent are quotients of sine and cosine. The last two functions are <b>reciprocals</b>: sec x = 1/cos x and csc x = 1/sin x, graphed from their guide curves.",
    "6.2b": "Every trig graph repeats, so none of them passes the horizontal line test. Next we <b>restrict the domains</b> so that sine, cosine, and tangent can be run backward: inverse trig functions.",
    "6.3": "You can now move between angles and values in both directions. Next we connect the six functions to each other with <b>identities</b> and use them to verify and simplify expressions.",
    "7.1": "The fundamental identities relate functions of <b>one</b> angle. Next we combine <b>two</b> angles: the sum and difference formulas give exact values for angles like 15°, 75°, and 105°.",
    "7.2": "Set β = α in the sum formulas and you get the <b>double-angle formulas</b>; run them backward and you get the <b>half-angle formulas</b>.",
    "7.3": "You now have a full toolkit of identities. Next we use the unit circle and inverse functions to <b>solve trig equations</b>: find every angle that makes an equation true.",
    "7.5a": "Linear equations isolate one trig function. Next come equations that need <b>factoring, the quadratic formula, or an identity</b> before they can be solved.",
    "7.5b": "Trig equations find unknown angles. Next we find unknown <b>sides and angles of triangles</b> that have no right angle, starting with the Law of Sines.",
    "8.1": "The Law of Sines needs a known angle–side pair. When you know <b>two sides and the included angle</b>, or all <b>three sides</b>, you need the Law of Cosines.",
    "8.2": "Navigation problems combine distances and headings. A <b>vector</b> packages a distance and a direction into one object that we can add, scale, and measure.",
    "8.8": "A vector's magnitude and direction are a distance and an angle. Using that pair to locate any point gives a new coordinate system: <b>polar coordinates</b>.",
    "8.3": "Polar equations like r = 4 cos θ turned out to be circles. Next we study the other famous curves defined by distances: the <b>conic sections</b>, starting with the ellipse.",
    "10.1a": "You can now build an ellipse's equation from its features. Next we go the other way: start from an <b>equation</b> and read off the vertices, co-vertices, foci, and graph.",
    "10.1b": "An ellipse keeps the <b>sum</b> of two distances constant. Change “sum” to “<b>difference</b>” and the curve splits into two branches: the hyperbola.",
    "10.2": "An ellipse and a hyperbola each have two foci. The last conic has <b>one focus and one line</b>: the parabola.",
    "10.3": "That completes the course content. Use the course home to review each chapter before the final exam.",
}
# Short recap shown at the top of the following page.
RECAP = {
    "5.1": "we measured angles in degrees and radians and found coterminal and reference angles",
    "5.2": "the point on the unit circle at angle t is (cos t, sin t)",
    "5.3": "tan, cot, sec, and csc are built from x and y, and the fundamental identities connect all six functions",
    "5.4": "in a right triangle, sin = opposite/hypotenuse, cos = adjacent/hypotenuse, and tan = opposite/adjacent",
    "6.1": "A, B, C, and D set the amplitude, period, phase shift, and midline of a sine or cosine graph",
    "6.2a": "tangent and cotangent have period π/|B| and vertical asymptotes where they divide by zero",
    "6.2b": "secant and cosecant are drawn from their cosine and sine guide curves",
    "6.3": "arcsin, arccos, and arctan return angles in restricted ranges",
    "7.1": "we verified identities by rewriting one side until it matched the other",
    "7.2": "the sum and difference formulas give exact values from two special angles",
    "7.3": "double- and half-angle formulas give exact values of sin 2θ, cos 2θ, sin(θ/2), and more",
    "7.5a": "we solved linear trig equations with reference angles and quadrants",
    "7.5b": "factoring, the quadratic formula, and identities reduce harder equations to simple ones",
    "8.1": "the Law of Sines solves ASA, AAS, and SSA triangles, including the ambiguous case",
    "8.2": "the Law of Cosines solves SAS and SSS triangles, and Heron's formula gives the area",
    "8.8": "a vector has a magnitude and a direction and can be added, scaled, and dotted",
    "8.3": "a point can be named by polar coordinates (r, θ) as well as by (x, y)",
    "10.1a": "an ellipse keeps the sum of the distances to its foci equal to 2a, with a² = b² + c²",
    "10.1b": "the larger denominator of an ellipse's equation is a² and tells us the major axis",
    "10.2": "a hyperbola keeps the difference of the distances equal to 2a, with c² = a² + b²",
}

LABELS = {"6.2a": "6.2 Parts I–II", "6.2b": "6.2 Part III", "7.5a": "7.5 Part I", "7.5b": "7.5 Part II",
          "10.1a": "10.1 Part I", "10.1b": "10.1 Part II"}


def by_id(sid):
    for s in SECTIONS:
        if s[0] == sid:
            return dict(id=s[0], slug=s[1], title=s[2], ch=s[3], week=s[4], book=TEXTBOOK + s[5], q=s[6], blurb=s[7])
    raise KeyError(sid)


def label(sid):
    """Display label: 7.5a -> 7.5 Part I."""
    return LABELS.get(sid, sid)


def number(sid):
    """Textbook section number: 10.1a -> 10.1."""
    return sid.rstrip("ab")


def order():
    return [s[0] for s in SECTIONS]


def week_dates(w):
    start = WEEK1 + dt.timedelta(days=7 * (w - 1))
    end = start + dt.timedelta(days=6)
    return start, end
