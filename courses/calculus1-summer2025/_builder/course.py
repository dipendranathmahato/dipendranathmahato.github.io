"""Course map for MATH 1210 Calculus I at Tulane University: section titles, motivating questions, and the
bridges that connect one section to the next. The lesson content is the same for every Calculus I course folder;
only the TERM block below (folder, dates, meetings, weeks) changes from one course to the next."""
import datetime as dt

# ---------------------------------------------------------------- TERM (Summer 2025, section 01)
COURSE = "MATH 1210"
SECTION = "01"
TERM = "Summer 2025"
SLUG = "calculus-i-summer2025"
BASE = f"/courses/{SLUG}/"
NAME = "Calculus I"
UNIVERSITY = "Tulane University"
UNI_SUB = "Summer 2025 · Online"
HERO_LINE = "TULANE UNIVERSITY · SUMMER 2025 · MATH 1210-01"
MEETINGS = ["Mon–Fri · 11:00 AM–12:45 PM", "Online (Zoom)", "May 27 – June 27, 2025"]
WEEK1 = dt.date(2025, 5, 26)  # Monday of week 1 (classes start Tuesday, May 27)
# week of the course in which each section is taught (from the syllabus calendar)
WEEKS = {"1.1": 1, "1.2": 1, "1.3": 1, "1.4": 1, "1.5": 1, "2.1": 1, "2.2": 1,
         "2.3": 2, "2.4": 2, "3.1": 2, "3.2": 2, "3.3": 2, "3.5": 2, "3.6": 2,
         "3.9": 3, "3.4": 3, "4.2": 3, "4.3": 3, "4.5": 3, "4.7": 3, "4.6": 3, "4.8": 3, "4.10": 3,
         "5.1": 4, "5.2": 4, "5.3": 4, "5.4": 4, "5.5": 4, "5.6": 4,
         "5.7": 5, "6.1": 5, "6.5": 5}
SCHEDULE_NOTE = "Exam dates, knowledge checks, reviews, and TA sessions are in the syllabus and the Course Foundations panel."
# ---------------------------------------------------------------- end of TERM block

TEXTBOOK = "https://openstax.org/books/calculus-volume-1/pages/"  # syllabus: Calculus Volume 1 (Strang and Herman, OpenStax)
TEXTBOOK_HOME = TEXTBOOK + "1-introduction"

CHAPTERS = [
    ("1", "Chapter 1 · Functions and Graphs", "fa-chart-line"),
    ("2", "Chapter 2 · Limits", "fa-arrows-to-dot"),
    ("3", "Chapter 3 · Derivatives", "fa-wave-square"),
    ("4", "Chapter 4 · Applications of Derivatives", "fa-mountain-sun"),
    ("5", "Chapter 5 · Integration", "fa-chart-area"),
    ("6", "Chapter 6 · Applications of Integration", "fa-weight-hanging"),
]

# id, slug, title, chapter, textbook slug, big question, card blurb (in the order taught)
SECTIONS = [
    ("1.1", "1-1", "Review of Functions", "1", "1-1-review-of-functions",
     "What makes a rule a <b>function</b>, and how do we read one from a formula, a table, or a graph?",
     "Function notation, domain and range, interval notation, graphs, the vertical line test, piecewise functions, and composition."),
    ("1.2", "1-2", "Basic Classes of Functions", "1", "1-2-basic-classes-of-functions",
     "Which <b>families of functions</b> will we meet again and again, and how do transformations move them?",
     "Linear functions and slope, polynomials, power and rational functions, algebraic and transcendental functions, and shifts, stretches, and reflections."),
    ("1.3", "1-3", "Trigonometric Functions", "1", "1-3-trigonometric-functions",
     "How do angles on the <b>unit circle</b> turn into the six trigonometric functions?",
     "Radians, the unit circle, the six trigonometric functions, identities, and the graphs of sine, cosine, and tangent."),
    ("1.4", "1-4", "Inverse Functions", "1", "1-4-inverse-functions",
     "When can we <b>undo</b> a function, and what does the graph of the inverse look like?",
     "One-to-one functions, the horizontal line test, finding inverses, reflection across y = x, restricted domains, and inverse trigonometric functions."),
    ("1.5", "1-5", "Exponential and Logarithmic Functions", "1", "1-5-exponential-and-logarithmic-functions",
     "What kind of growth <b>multiplies</b> instead of adds, and how do logarithms undo it?",
     "Exponential functions and their laws, the number e, logarithms as inverses, properties of logarithms, and solving exponential equations."),
    ("2.1", "2-1", "A Preview of Calculus", "2", "2-1-a-preview-of-calculus",
     "How can a <b>sequence of approximations</b> lead to an exact slope or an exact area?",
     "The tangent problem (secant slopes approaching a tangent), instantaneous velocity, and the area problem (rectangles under a curve)."),
    ("2.2", "2-2", "The Limit of a Function", "2", "2-2-the-limit-of-a-function",
     "What value does f(x) <b>approach</b> as x gets close to a, even if f(a) is undefined?",
     "Limits from tables and graphs, one-sided limits, when a limit does not exist, infinite limits, and vertical asymptotes."),
    ("2.3", "2-3", "The Limit Laws", "2", "2-3-the-limit-laws",
     "How can we <b>compute</b> limits exactly instead of guessing from tables?",
     "Limit laws, direct substitution, 0/0 forms handled by factoring, rationalizing, and simplifying, and the squeeze theorem."),
    ("2.4", "2-4", "Continuity", "2", "2-4-continuity",
     "What does it mean to draw a graph <b>without lifting the pencil</b>?",
     "Continuity at a point, removable, jump, and infinite discontinuities, continuity on intervals, and the Intermediate Value Theorem."),
    ("3.1", "3-1", "Defining the Derivative", "3", "3-1-defining-the-derivative",
     "How do secant slopes become the slope of the <b>tangent line</b>?",
     "The difference quotient, the derivative at a point as a limit, tangent lines, and the derivative as an instantaneous rate of change."),
    ("3.2", "3-2", "The Derivative as a Function", "3", "3-2-the-derivative-as-a-function",
     "If every point has a slope, what does the <b>slope function</b> look like?",
     "f′(x) from the limit definition, graphing f′ from f, where a function fails to be differentiable, and higher derivatives."),
    ("3.3", "3-3", "Differentiation Rules", "3", "3-3-differentiation-rules",
     "How can we find derivatives <b>without</b> computing a limit every time?",
     "The constant, power, sum, and constant-multiple rules, the product and quotient rules, and combining the rules."),
    ("3.5", "3-5", "Derivatives of Trigonometric Functions", "3", "3-5-derivatives-of-trigonometric-functions",
     "Why is the slope of sin x given by <b>cos x</b>?",
     "The derivatives of sin x and cos x, the other four trigonometric functions, and higher derivatives of sine and cosine."),
    ("3.6", "3-6", "The Chain Rule", "3", "3-6-the-chain-rule",
     "How do we differentiate a <b>function inside a function</b>?",
     "The chain rule for compositions, inside and outside functions, powers and trigonometric functions, chain rule with tables of values, and the derivatives of the inverse trigonometric functions."),
    ("3.9", "3-9", "Derivatives of Exponential and Logarithmic Functions", "3", "3-9-derivatives-of-exponential-and-logarithmic-functions",
     "Which function is its <b>own derivative</b>, and what is the derivative of ln x?",
     "Derivatives of eˣ and bˣ, of ln x and log<sub>b</sub> x, the chain rule with exponentials and logarithms, and logarithmic differentiation."),
    ("3.4", "3-4", "Derivatives as Rates of Change", "3", "3-4-derivatives-as-rates-of-change",
     "What does the derivative tell us about <b>motion</b> and other changing quantities?",
     "Amount of change and average rate, position, velocity, speed, and acceleration, speeding up and slowing down, and marginal cost."),
    ("4.2", "4-2", "Linear Approximations and Differentials", "4", "4-2-linear-approximations-and-differentials",
     "How can a <b>tangent line</b> estimate values that are hard to compute?",
     "The linear approximation L(x), estimating roots and powers, differentials dy and dx, and propagated error."),
    ("4.3", "4-3", "Maxima and Minima", "4", "4-3-maxima-and-minima",
     "Where can a function reach its <b>highest or lowest</b> value?",
     "Absolute and local extrema, the Extreme Value Theorem, critical points, Fermat's theorem, and the closed interval method."),
    ("4.5", "4-5", "Derivatives and the Shape of a Graph", "4", "4-5-derivatives-and-the-shape-of-a-graph",
     "What do f′ and f″ reveal about where a graph <b>rises, falls, and bends</b>?",
     "Increasing and decreasing intervals, the first derivative test, concavity, inflection points, and the second derivative test."),
    ("4.7", "4-7", "Applied Optimization Problems", "4", "4-7-applied-optimization-problems",
     "How do we find the <b>best</b> design when a quantity depends on a choice we make?",
     "Setting up an objective function and a constraint, the feasible interval, and maximizing area and volume or minimizing cost and distance."),
    ("4.6", "4-6", "Limits at Infinity and Asymptotes", "4", "4-6-limits-at-infinity-and-asymptotes",
     "What happens to f(x) as x grows <b>without bound</b>?",
     "Limits at infinity, horizontal asymptotes, end behavior of polynomials and rational functions, and oblique asymptotes."),
    ("4.8", "4-8", "L’Hôpital’s Rule", "4", "4-8-lhopitals-rule",
     "How can derivatives settle limits of the form <b>0/0 and ∞/∞</b>?",
     "L’Hôpital’s rule, rewriting 0 · ∞ and ∞ − ∞, indeterminate powers, and growth rates of functions."),
    ("4.10", "4-10", "Antiderivatives", "4", "4-10-antiderivatives",
     "Can we run differentiation <b>backwards</b>?",
     "Antiderivatives and the + C, indefinite integrals, basic integration formulas, and initial-value problems."),
    ("5.1", "5-1", "Approximating Areas", "5", "5-1-approximating-areas",
     "How can <b>rectangles</b> approximate the area under a curve?",
     "Sigma notation and sum formulas, left, right, and midpoint approximations, and the exact area as a limit of sums."),
    ("5.2", "5-2", "The Definite Integral", "5", "5-2-the-definite-integral",
     "What exact number do the <b>Riemann sums</b> approach?",
     "The definite integral as a limit of Riemann sums, net signed area, properties of the integral, and the average value of a function."),
    ("5.3", "5-3", "The Fundamental Theorem of Calculus", "5", "5-3-the-fundamental-theorem-of-calculus",
     "Why does an <b>antiderivative</b> compute an area?",
     "The accumulation function, FTC Part 1 (with the chain rule), evaluating definite integrals with FTC Part 2, and the Mean Value Theorem for integrals."),
    ("5.4", "5-4", "Integration Formulas and the Net Change Theorem", "5", "5-4-integration-formulas-and-the-net-change-theorem",
     "How does integrating a <b>rate</b> give the total change?",
     "Basic integration formulas, the net change theorem, displacement versus total distance, and integrals of even and odd functions."),
    ("5.5", "5-5", "Substitution", "5", "5-5-substitution",
     "How do we undo the <b>chain rule</b>?",
     "u-substitution for indefinite integrals, choosing u, and substitution for definite integrals with changed limits."),
    ("5.6", "5-6", "Integrals Involving Exponential and Logarithmic Functions", "5", "5-6-integrals-involving-exponential-and-logarithmic-functions",
     "Which integral produces a <b>logarithm</b>?",
     "Integrals of eˣ and bˣ, the integral of 1/x = ln|x|, the integral of ln x, substitution with exponentials and logarithms, and a price-demand application."),
    ("5.7", "5-7", "Integrals Resulting in Inverse Trigonometric Functions", "5", "5-7-integrals-resulting-in-inverse-trigonometric-functions",
     "Which integrals give <b>inverse trigonometric</b> functions?",
     "Integrals of 1/√(a² − u²), 1/(a² + u²), and 1/(u√(u² − a²)), and substitution into the inverse trigonometric forms."),
    ("6.1", "6-1", "Areas between Curves", "6", "6-1-areas-between-curves",
     "How do we measure the area <b>between two graphs</b>?",
     "Area between y = f(x) and y = g(x), finding intersection points, regions where the curves cross, and integrating with respect to y."),
    ("6.5", "6-5", "Physical Applications", "6", "6-5-physical-applications",
     "How can integrals compute <b>mass and work</b>?",
     "Mass from density, work done by a variable force, springs and Hooke's law, and pumping liquids out of a tank."),
]

# the bridge text at the end of each section: why the next section matters
NEXT = {
    "1.1": "Next we meet the families of functions used throughout calculus and see how shifts and stretches move their graphs.",
    "1.2": "Trigonometric functions are the next family: they model anything that repeats, and calculus treats them in radians.",
    "1.3": "Some functions can be undone. Next we study inverse functions, including the inverse trigonometric functions.",
    "1.4": "Exponential and logarithmic functions are an important pair of inverses, and they finish our review of functions.",
    "1.5": "With the function toolkit in place, we preview the two questions calculus answers: slopes of tangent lines and areas under curves.",
    "2.1": "Both preview problems rest on one idea, the limit. Next we define it and read limits from tables and graphs.",
    "2.2": "Tables and graphs suggest limits; the limit laws let us compute them exactly.",
    "2.3": "Limits let us say precisely what it means for a function to be continuous.",
    "2.4": "With limits in hand, we return to the tangent problem and define the derivative.",
    "3.1": "Computing the derivative at every point gives a new function, the derivative function f′.",
    "3.2": "Limits of difference quotients take work. Next come the rules that make derivatives fast.",
    "3.3": "The rules so far cover algebraic functions. Next we find the derivatives of the trigonometric functions.",
    "3.5": "Many functions are compositions, like sin(x²). The chain rule handles them.",
    "3.6": "The chain rule also unlocks the derivatives of exponential and logarithmic functions.",
    "3.9": "Now we can differentiate almost anything. Next we interpret derivatives as rates: velocity, acceleration, and marginal cost.",
    "3.4": "A derivative also describes the tangent line. Next we use that line to approximate function values.",
    "4.2": "Tangent lines are horizontal at peaks and valleys. Next we find the maxima and minima of a function.",
    "4.3": "The signs of f′ and f″ describe the whole shape of a graph, not just its extreme points.",
    "4.5": "Finding extrema answers real design questions. Next we set up and solve optimization problems.",
    "4.7": "Graphs also have long-run behavior. Next we study limits as x → ±∞ and horizontal asymptotes.",
    "4.6": "Limits of the form 0/0 and ∞/∞ keep appearing. L’Hôpital’s rule uses derivatives to evaluate them.",
    "4.8": "Next we run differentiation backwards: antiderivatives, the bridge from derivatives to integrals.",
    "4.10": "Antiderivatives will compute areas. First we approximate areas with rectangles.",
    "5.1": "Taking more and more rectangles leads to the exact area: the definite integral.",
    "5.2": "Computing integrals as limits of sums is slow. The Fundamental Theorem of Calculus connects them to antiderivatives.",
    "5.3": "With the Fundamental Theorem, integrals of rates give net change. Next we collect the basic formulas and the net change theorem.",
    "5.4": "Many integrands come from the chain rule. Substitution undoes it.",
    "5.5": "Substitution together with the exponential and logarithm rules handles a new family of integrals.",
    "5.6": "A few more integrals produce inverse trigonometric functions.",
    "5.7": "Now we apply integration to geometry: the area between two curves.",
    "6.1": "Integrals also compute physical quantities: mass from density and work from force.",
    "6.5": "That completes the course content. Use the course home to review each chapter before the final exam.",
}

# the "Where we are coming from" recap, quoted at the top of the next section
RECAP = {
    "1.1": "we described functions by formulas, tables, and graphs and found their domains and ranges",
    "1.2": "we met linear, polynomial, rational, and power functions and moved graphs with transformations",
    "1.3": "we defined the six trigonometric functions on the unit circle, in radians",
    "1.4": "we undid one-to-one functions and reflected their graphs across y = x",
    "1.5": "we studied exponential growth and the logarithms that undo it",
    "2.1": "we approximated tangent slopes with secant slopes and areas with rectangles",
    "2.2": "we read limits from tables and graphs, including one-sided and infinite limits",
    "2.3": "we computed limits exactly with the limit laws and algebra",
    "2.4": "we defined continuity and used the Intermediate Value Theorem",
    "3.1": "we defined the derivative at a point as a limit of secant slopes",
    "3.2": "we built the derivative function f′ and read its graph from the graph of f",
    "3.3": "we differentiated with the power, product, and quotient rules",
    "3.5": "we found the derivatives of all six trigonometric functions",
    "3.6": "we differentiated compositions with the chain rule",
    "3.9": "we differentiated exponential and logarithmic functions",
    "3.4": "we used derivatives as rates of change, especially velocity and acceleration",
    "4.2": "we approximated values with the tangent line and used differentials",
    "4.3": "we located absolute and local extrema at critical points",
    "4.5": "we used f′ and f″ to describe where a graph rises, falls, and bends",
    "4.7": "we solved optimization problems by maximizing or minimizing an objective function",
    "4.6": "we computed limits at infinity and found horizontal asymptotes",
    "4.8": "we evaluated indeterminate forms with L’Hôpital’s rule",
    "4.10": "we found antiderivatives and solved initial-value problems",
    "5.1": "we approximated areas with left, right, and midpoint Riemann sums",
    "5.2": "we defined the definite integral as the limit of Riemann sums",
    "5.3": "we connected integrals and antiderivatives with the Fundamental Theorem of Calculus",
    "5.4": "we used the net change theorem to integrate rates",
    "5.5": "we evaluated integrals with u-substitution",
    "5.6": "we integrated exponential functions and 1/x",
    "5.7": "we found integrals that produce inverse trigonometric functions",
    "6.1": "we computed areas between curves",
}

LABELS = {}


def by_id(sid):
    for s in SECTIONS:
        if s[0] == sid:
            return dict(id=s[0], slug=s[1], title=s[2], ch=s[3], week=WEEKS[sid], book=TEXTBOOK + s[4], q=s[5], blurb=s[6])
    raise KeyError(sid)


def label(sid):
    return LABELS.get(sid, sid)


def number(sid):
    return sid


def order():
    return [s[0] for s in SECTIONS]


def week_dates(w):
    start = WEEK1 + dt.timedelta(days=7 * (w - 1))
    end = start + dt.timedelta(days=6)
    return start, end
