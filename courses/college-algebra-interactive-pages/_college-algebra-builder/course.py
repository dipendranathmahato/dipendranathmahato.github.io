"""Course map for MATH 1314 (Fall 2026, section 204): weekly order from the syllabus,
section titles, motivating questions, and the bridges that connect one section to the next."""
import datetime as dt

TEXTBOOK = "https://openstax.org/books/college-algebra/pages/"  # syllabus: OpenStax College Algebra, 1st edition
WEEK1 = dt.date(2026, 8, 24)  # Monday of week 1 (HW 3.1 due Sunday, Aug 30)

CHAPTERS = [
    ("3", "Chapter 3 · Functions", "fa-chart-line"),
    ("7", "Chapter 7 · Systems of Equations", "fa-code-merge"),
    ("5", "Chapter 5 · Polynomial and Rational Functions", "fa-wave-square"),
    ("6", "Chapter 6 · Exponential and Logarithmic Functions", "fa-arrow-trend-up"),
]

# id, slug, title, chapter, week, textbook slug, big question, card blurb
SECTIONS = [
    ("3.1", "3-1", "Functions and Function Notation", "3", 1, "3-1-functions-and-function-notation",
     "What makes a rule a <b>function</b>, and how do we read f(x)?",
     "Relations, function notation, and reading inputs and outputs from formulas, tables, and graphs."),
    ("3.2", "3-2", "Domain and Range", "3", 2, "3-2-domain-and-range",
     "Which inputs are <b>allowed</b>, and which outputs can actually happen?",
     "Interval and set-builder notation, domains from formulas, and domain and range from graphs."),
    ("3.3", "3-3", "Rates of Change and Behavior of Graphs", "3", 2, "3-3-rates-of-change-and-behavior-of-graphs",
     "How <b>fast</b> is a function changing, and where is it rising or falling?",
     "Average rate of change from formulas, tables, and graphs; increasing, decreasing, and constant intervals."),
    ("3.4", "3-4", "Composition of Functions", "3", 3, "3-4-composition-of-functions",
     "What happens when the <b>output of one function</b> becomes the input of another?",
     "Function arithmetic, composite functions from formulas, tables, and graphs, and their domains."),
    ("3.5a", "3-5-part-1", "Transformations: Shifts", "3", 3, "3-5-transformation-of-functions",
     "How can one small change to a formula <b>slide a whole graph</b>?",
     "Vertical and horizontal shifts of toolkit graphs, tables, and combined shifts."),
    ("3.5b", "3-5-part-2", "Transformations: Reflections, Stretches, and Compressions", "3", 4, "3-5-transformation-of-functions",
     "How do we <b>flip, stretch, and squeeze</b> a graph, and in what order?",
     "Reflections over the axes, vertical and horizontal stretches and compressions, and combinations."),
    ("3.7", "3-7", "Inverse Functions", "3", 4, "3-7-inverse-functions",
     "Can a function be <b>run backward</b>?",
     "One-to-one functions, the horizontal line test, finding and verifying inverses, and restricting domains."),
    ("7.1", "7-1", "Systems of Linear Equations: Two Variables", "7", 5, "7-1-systems-of-linear-equations-two-variables",
     "Where do two conditions hold <b>at the same time</b>?",
     "Solving systems by graphing, substitution, and elimination; independent, inconsistent, and dependent systems."),
    ("5.1", "5-1", "Quadratic Functions", "5", 6, "5-1-quadratic-functions",
     "Where does a parabola <b>turn</b>, and how high or low can it go?",
     "Vertex, axis of symmetry, intercepts, general and standard form, and maximum or minimum values."),
    ("5.2", "5-2", "Power Functions and Polynomial Functions", "5", 7, "5-2-power-functions-and-polynomial-functions",
     "What does a polynomial do <b>far to the left and far to the right</b>?",
     "Power functions, polynomial vocabulary (degree, leading term), and end behavior."),
    ("5.3", "5-3", "Graphs of Polynomial Functions", "5", 7, "5-3-graphs-of-polynomial-functions",
     "What happens in the <b>middle</b> of a polynomial graph?",
     "Intercepts by factoring, zeros and multiplicity, turning points, and sketching polynomial graphs."),
    ("5.5", "5-5", "Zeros of Polynomial Functions", "5", 8, "5-5-zeros-of-polynomial-functions",
     "How do we find zeros when <b>factoring is not obvious</b>?",
     "The Division Algorithm, Remainder Theorem, Factor Theorem, and synthetic division."),
    ("5.6", "5-6", "Rational Functions", "5", 8, "5-6-rational-functions",
     "What happens when we <b>divide one polynomial by another</b>?",
     "Domains, holes, intercepts, arrow notation, and vertical, horizontal, and slant asymptotes."),
    ("6.1", "6-1", "Exponential Functions", "6", 10, "6-1-exponential-functions",
     "What kind of function models <b>growth by a percentage</b>?",
     "Exponential functions f(x) = abˣ, the number e, and compound interest."),
    ("6.2", "6-2", "Graphs of Exponential Functions", "6", 10, "6-2-graphs-of-exponential-functions",
     "How do <b>three key points</b> and transformations draw any exponential graph?",
     "Key points, asymptotes, and transformations of exponential graphs."),
    ("6.3", "6-3", "Logarithmic Functions", "6", 11, "6-3-logarithmic-functions",
     "If bʸ = x, how do we <b>solve for the exponent</b> y?",
     "Logarithms as exponents: converting between forms, common and natural logarithms."),
    ("6.4", "6-4", "Graphs of Logarithmic Functions", "6", 11, "6-4-graphs-of-logarithmic-functions",
     "What does the <b>inverse of an exponential</b> look like?",
     "Domains of logarithmic functions, key points, vertical asymptotes, and transformations."),
    ("6.5", "6-5", "Logarithmic Properties", "6", 12, "6-5-logarithmic-properties",
     "Which <b>rules</b> let us expand, condense, and evaluate logarithms?",
     "Product, quotient, and power rules; expanding and condensing; change of base."),
    ("6.6", "6-6", "Exponential Equations", "6", 12, "6-6-exponential-and-logarithmic-equations",
     "How do we solve an equation when <b>x is in the exponent</b>?",
     "Common-base equations, solving with logarithms, and reading solutions as intersections."),
    ("6.7", "6-7", "Exponential and Logarithmic Models", "6", 13, "6-7-exponential-and-logarithmic-models",
     "How long until a quantity <b>doubles or halves</b>?",
     "Exponential growth and decay, doubling time, half-life, and radiocarbon dating."),
]

# Bridge text: why the next section matters, written from the end of the current section.
NEXT = {
    "3.1": "A function gives every input exactly one output, but not every number can be an input: 1/x breaks at x = 0 and √x breaks for negative x. Next we describe <b>which inputs are allowed</b> and <b>which outputs appear</b>: domain and range.",
    "3.2": "You can now say <i>where</i> a function lives. The next question is <i>how it behaves</i> there: how fast the outputs change between two inputs, and where the graph rises, falls, or stays flat.",
    "3.3": "A rate compares two outputs of the same function. Next we <b>combine functions</b>: add, subtract, multiply, and divide them, and feed the output of one function into another.",
    "3.4": "Composition has a visual payoff: f(x) + k and f(x − h) are compositions with very simple functions, and they <b>slide the whole graph</b>. Next: shifts.",
    "3.5a": "Shifts move a graph without changing its shape. Next we change the shape itself: <b>reflect</b> it over an axis and <b>stretch or compress</b> it.",
    "3.5b": "Reflecting over the x- or y-axis flips a graph. Reflecting over the line <b>y = x</b> does something deeper: it swaps every input with its output. That is the idea of an <b>inverse function</b>.",
    "3.7": "An inverse answers “which input gives this output?” for one equation. Many real questions have <b>two unknowns and two conditions</b> at once. Next: systems of linear equations, where two lines meet.",
    "7.1": "Lines change at a constant rate and never turn. Next come <b>quadratic functions</b>: their rate changes, their graphs turn at a vertex, and the shifts and stretches from 3.5 describe them exactly.",
    "5.1": "A quadratic is a degree-2 polynomial. Next we raise the power: <b>power functions and polynomials</b>, starting with what their graphs do far to the left and right.",
    "5.2": "End behavior tells us what happens at the far ends. Next we fill in the <b>middle</b> of the graph: zeros, how the graph crosses or bounces at each zero, and turning points.",
    "5.3": "When a polynomial factors nicely, its zeros are easy to read. Next we learn tools for when it does not: the <b>Remainder and Factor Theorems</b> and <b>synthetic division</b>.",
    "5.5": "Dividing polynomials gave us quotients and remainders. Next we study the quotient of two polynomials <b>as a function</b>: rational functions, with holes and asymptotes.",
    "5.6": "A rational function can level off at a horizontal asymptote. Exponential functions have one too, but on the other side they grow <b>faster than any polynomial</b>. Next: exponential functions and compound interest.",
    "6.1": "You can evaluate abˣ and use it for money. Next we picture it: <b>three key points</b> and the transformations from 3.5 draw any exponential graph.",
    "6.2": "Every exponential graph passes the horizontal line test, so it is one-to-one, and by 3.7 it has an <b>inverse</b>. That inverse has its own name: the <b>logarithm</b>.",
    "6.3": "A logarithm is the inverse of an exponential function. Next we graph it by <b>reflecting exponential graphs over y = x</b> and find its domain.",
    "6.4": "You can read and graph logarithms. Next come the <b>rules</b> that make them powerful: product, quotient, power, and change of base.",
    "6.5": "The power rule moves an exponent down in front of a logarithm. That is exactly what we need to <b>solve equations with x in the exponent</b>.",
    "6.6": "You can now solve exponential equations. Next we put them to work: <b>doubling time, half-life, and radiocarbon dating</b>.",
    "6.7": "That completes the course content. Use the course home to review each chapter before the final exam.",
}
# Short recap shown at the top of the following page.
RECAP = {
    "3.1": "every input of a function has exactly one output, and f(a) is read from formulas, tables, and graphs",
    "3.2": "we described which inputs are allowed (domain) and which outputs occur (range)",
    "3.3": "we measured how fast a function changes and where its graph rises, falls, or stays flat",
    "3.4": "we combined functions and fed the output of one function into another",
    "3.5a": "f(x) + k and f(x − h) slide a graph up/down and left/right",
    "3.5b": "we reflected, stretched, and compressed graphs and combined transformations",
    "3.7": "a one-to-one function can be run backward with its inverse",
    "7.1": "two linear equations can meet at one point, never meet, or be the same line",
    "5.1": "a parabola turns at its vertex, which gives its maximum or minimum value",
    "5.2": "the leading term of a polynomial decides its end behavior",
    "5.3": "zeros and their multiplicities describe how a polynomial graph meets the x-axis",
    "5.5": "the Remainder and Factor Theorems and synthetic division find zeros",
    "5.6": "rational functions have holes and vertical, horizontal, or slant asymptotes",
    "6.1": "exponential functions abˣ model growth by a percentage, as in compound interest",
    "6.2": "three key points and transformations draw any exponential graph",
    "6.3": "a logarithm is an exponent: y = log_b x means bʸ = x",
    "6.4": "logarithmic graphs are reflections of exponential graphs over y = x",
    "6.5": "product, quotient, and power rules expand and condense logarithms",
    "6.6": "equations with x in the exponent are solved with common bases or logarithms",
}

# Weekly calendar (syllabus order). Items are section ids or ("event"/"test", text, detail).
WEEKS = {
    1: [("event", "Growth mindset and syllabus", "First class meetings"), "3.1"],
    2: ["3.2", "3.3"],
    3: ["3.4", "3.5a"],
    4: ["3.5b", "3.7"],
    5: ["7.1", ("event", "Review for Test 1", "PLTL Review Test 1")],
    6: [("test", "Test 1 · Tuesday, September 29", "Tuesday/Thursday section"), "5.1"],
    7: ["5.2", "5.3", ("event", "Retest 1", "")],
    8: ["5.5", "5.6"],
    9: [("event", "Review for Test 2", "PLTL Review Test 2"), ("test", "Test 2 · Thursday, October 22", "Tuesday/Thursday section")],
    10: ["6.1", "6.2", ("event", "Retest 2", "")],
    11: ["6.3", "6.4"],
    12: ["6.5", "6.6"],
    13: ["6.7", ("event", "Review for Test 3", "PLTL Review Test 3")],
    14: [("test", "Test 3 · Friday, December 4", "Tuesday/Thursday section"), ("event", "Thanksgiving break", "November 26–27")],
    15: [("event", "Retest 3", ""), ("event", "Review for the final exam", "PLTL Review Final Exam")],
    16: [("test", "Final exam", "Comprehensive · date TBA")],
}

UNITS = [
    ("Unit 1", "Functions: the toolkit", "Weeks 1–4", "What a function is, where it lives, how it changes, how to combine it, move it, and undo it.", ["3.1", "3.2", "3.3", "3.4", "3.5a", "3.5b", "3.7"], [1, 2, 3, 4]),
    ("Unit 2", "Two conditions at once", "Week 5", "Systems of linear equations, then review for Test 1.", ["7.1"], [5]),
    ("Unit 3", "Polynomial and rational functions", "Weeks 6–9", "Test 1, then parabolas, polynomials, their zeros, and quotients of polynomials, then Test 2.", ["5.1", "5.2", "5.3", "5.5", "5.6"], [6, 7, 8, 9]),
    ("Unit 4", "Exponential and logarithmic functions", "Weeks 10–16", "Growth and decay, their inverses (logarithms), solving equations, and models, then Test 3 and the final exam.", ["6.1", "6.2", "6.3", "6.4", "6.5", "6.6", "6.7"], [10, 11, 12, 13, 14, 15, 16]),
]


def by_id(sid):
    for s in SECTIONS:
        if s[0] == sid:
            return dict(id=s[0], slug=s[1], title=s[2], ch=s[3], week=s[4], book=TEXTBOOK + s[5], q=s[6], blurb=s[7])
    raise KeyError(sid)


def label(sid):
    """Display label: 3.5a -> 3.5 Part I."""
    return {"3.5a": "3.5 Part I", "3.5b": "3.5 Part II"}.get(sid, sid)


def order():
    return [s[0] for s in SECTIONS]


def week_dates(w):
    start = WEEK1 + dt.timedelta(days=7 * (w - 1))
    end = start + dt.timedelta(days=6)
    return start, end
