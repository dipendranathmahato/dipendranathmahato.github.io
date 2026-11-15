"""Generate the College Algebra course site: course home + one page per section.
Run from this _builder folder:  python3 build.py [section ids…]  ->  rewrites the course pages in the folder above.
   python3 build.py --preview  ->  writes a test copy into _builder/out/ instead."""
import html as H, re, shutil, sys, hashlib, pathlib, datetime as dt
import course as C

ROOT = pathlib.Path(__file__).parent
SRC = ROOT / "src"
# This _builder folder lives inside courses/college-algebra-fall2026/, so by default the pages are written
# to the folder above it. Use --preview to write a throwaway copy into _builder/out/ instead.
OUT = ROOT / "out" / "college-algebra-fall2026" if "--preview" in sys.argv else ROOT.parent
BASE = "/courses/college-algebra-fall2026/"

SITE_CONTROLS = (ROOT / "src" / "site-controls.js").read_text()


def ver(path):
    return hashlib.md5(pathlib.Path(path).read_bytes()).hexdigest()[:10]


def head(title, desc):
    return f"""<!DOCTYPE html>
<html data-theme="light" lang="en"><head><meta charset="utf-8"/><meta content="width=device-width,initial-scale=1" name="viewport"/>
<title>{title}</title><meta name="description" content="{H.escape(desc)}"/>
<link href="/assets/css/style.css?v=b58e400b11f6" rel="stylesheet"/><link href="/assets/css/course.css?v=55f96e6298d0" rel="stylesheet"/><link href="/assets/css/interactive-course.css?v=65ffb2f69374" rel="stylesheet"/>
<link href="{BASE}assets/ca-course.css?v={ver(OUT / 'assets' / 'ca-course.css')}" rel="stylesheet"/>
<link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css" rel="stylesheet"/><link href="https://cdn.jsdelivr.net/npm/academicons/css/academicons.min.css" rel="stylesheet"/>
<script>window.MathJax={{tex:{{inlineMath:[['\\\\(','\\\\)']]}},svg:{{fontCache:'global'}}}};</script><script defer src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-svg.js"></script>
</head>"""


UNI = ('<div class="uni-header prominent ca-university-header"><div class="uni-header-left"><i class="fa-solid fa-school"></i><div>'
       '<h3 class="uni-title">University of Texas Rio Grande Valley</h3><div class="uni-subtitle">Current teaching · Edinburg, Texas · Fall 2026</div></div></div>'
       '<div class="uni-header-logo"><img alt="UTRGV" src="/assets/images/utrgv-logo.svg"/></div></div>')


def shell(title, desc, main, scripts):
    return (head(title, desc) + '<body class="course-page"><div class="page"><header class="top-nav" data-shared-template="header"></header>'
            '<main class="layout"><aside class="sidebar" data-shared-template="sidebar"></aside><section class="main">' + UNI +
            '<div class="ca">' + main + '</div></section></main><footer data-shared-template="footer"></footer></div>\n'
            '<script defer src="/assets/js/site-template.js?v=c072320e8862"></script>\n'
            f'<script id="ca-shared-site-controls">{SITE_CONTROLS}</script>\n' + scripts + '\n</body></html>\n')


def panels(body):
    """(id, heading) of every activity block in a section body."""
    out = []
    for m in re.finditer(r'<section class="ca-panel[^"]*" id="([^"]+)">\s*(?:<div class="ca-guided-heading">.*?)?<h3>(.*?)</h3>', body, re.S):
        out.append((m.group(1), re.sub(r'<[^>]+>', '', m.group(2)).strip()))
    return out


def toc(current=None, sub=()):
    parts = [f'<nav aria-label="Course navigation" class="ca-toc"><a class="ca-toc-home" href="{BASE}"><i class="fa-solid fa-house"></i> Course home · weekly plan</a>'
             '<strong><i class="fa-solid fa-list-ul"></i> COURSE MAP</strong>']
    for ch, name, icon in C.CHAPTERS:
        secs = [C.by_id(s) for s in C.order() if C.by_id(s)["ch"] == ch]
        is_open = current is not None and C.by_id(current)["ch"] == ch
        parts.append(f'<details class="ca-toc-chapter"{" open" if is_open else ""}><summary><i class="fa-solid {icon}"></i> {name} <i aria-hidden="true" class="fa-solid fa-chevron-down"></i></summary><div class="ca-toc-children">')
        for s in secs:
            cur = s["id"] == current
            parts.append(f'<a class="ca-toc-page{" ca-toc-current" if cur else ""}" href="{BASE}{s["slug"]}/"{" aria-current=page" if cur else ""}>{C.label(s["id"])} · {s["title"]}</a>')
            if cur and sub:
                parts.append('<div class="ca-toc-sub">' + ''.join(f'<a href="#{i}">{H.escape(t)}</a>' for i, t in sub) + '</div>')
        parts.append('</div></details>')
    parts.append('</nav>')
    return ''.join(parts)


def guided(num, title, intro):
    return (f'<section class="ca-panel ca-guided-section" id="guided-{num}"><div class="ca-guided-heading"><span class="ca-guided-kicker">PRACTICE</span>'
            f'<h3>Guided problems · {title}</h3><p>{intro}</p></div><div id="quiz-{num}-container"></div><div class="ca-controls">'
            f'<button class="ca-btn" id="quiz-{num}-check" type="button">Check answers</button><button class="ca-btn ca-btn-outline" id="quiz-{num}-reset" type="button">Try more problems</button></div>'
            f'<div aria-live="polite" class="ca-feedback" id="quiz-{num}-feedback">Choose an answer for each problem.</div></section>')


def wrapup(num, title, qa):
    lis = ''.join(f'<li><p>{q}</p><details><summary>Show answer</summary><p>{a}</p></details></li>' for q, a in qa)
    return (f'<section class="ca-panel ca-guided-section ca-exit-ticket ca-wrapup" id="wrap-{num}"><div class="ca-guided-heading">'
            f'<span class="ca-guided-kicker">WRAP-UP</span><h3>Check your understanding · {title}</h3>'
            '<p>Answer each question on paper first, then open the answer to check yourself.</p></div>'
            f'<ol class="ca-exit-list">{lis}</ol></section>')


def expand_macros(body, num):
    def g(m):
        return guided(num, m.group(1).strip(), m.group(2).strip())
    body = re.sub(r'<!--GUIDED\s*\|(.*?)\|(.*?)-->', g, body, flags=re.S)

    def w(m):
        title, text = m.group(1).strip(), m.group(2)
        qa = re.findall(r'^Q:\s*(.+?)\nA:\s*(.+?)(?=\nQ:|\Z)', text.strip(), re.S | re.M)
        return wrapup(num, title, [(q.strip(), a.strip().replace('\n', ' ')) for q, a in qa])
    return re.sub(r'<!--WRAP\s*\|([^\n]*)\n(.*?)-->', w, body, flags=re.S)


def section_page(sid):
    s = C.by_id(sid)
    order = C.order()
    i = order.index(sid)
    prev = C.by_id(order[i - 1]) if i > 0 else None
    nxt = C.by_id(order[i + 1]) if i + 1 < len(order) else None
    num = s["id"].replace(".", "")
    body = expand_macros((SRC / "sections" / f'{s["slug"]}.html').read_text(), num)
    sub = panels(body)
    start, _ = C.week_dates(s["week"])
    hero = (f'<header class="ca-hero ca-hero-section"><span class="ca-eyebrow"><i class="fa-solid fa-book-open-reader"></i> MATH 1314 · '
            f'WEEK {s["week"]} · SECTION {C.label(sid).upper()}</span><h1>{s["title"]}</h1><p class="ca-hero-question">{s["q"]}</p>'
            f'<div class="ca-hero-links"><a class="ca-hero-home" href="{BASE}"><i class="fa-solid fa-house"></i> Course home</a>'
            f'<a href="{s["book"]}" rel="noopener" target="_blank"><i class="fa-solid fa-book"></i> Textbook reading · Section {sid[:3]}</a></div></header>')
    bridge_from = ''
    if prev:
        bridge_from = (f'<aside class="ca-bridge ca-bridge-from"><i aria-hidden="true" class="fa-solid fa-route ca-bridge-icon"></i><div>'
                       f'<small>Where we are coming from</small><p>In <a href="{BASE}{prev["slug"]}/">{C.label(prev["id"])} · {prev["title"]}</a>, '
                       f'{C.RECAP[prev["id"]]}.</p></div></aside>')
    if nxt:
        bridge_next = (f'<aside class="ca-bridge ca-bridge-next"><i aria-hidden="true" class="fa-solid fa-forward ca-bridge-icon"></i><div>'
                       f'<small>Up next · {C.label(nxt["id"])}</small><p>{C.NEXT[sid]}</p>'
                       f'<a class="ca-bridge-link" href="{BASE}{nxt["slug"]}/">Go to {C.label(nxt["id"])} · {nxt["title"]} <i class="fa-solid fa-arrow-right"></i></a></div></aside>')
    else:
        bridge_next = (f'<aside class="ca-bridge ca-bridge-next"><i aria-hidden="true" class="fa-solid fa-flag-checkered ca-bridge-icon"></i><div>'
                       f'<small>End of the course content</small><p>{C.NEXT[sid]}</p><a class="ca-bridge-link" href="{BASE}">Back to the course home <i class="fa-solid fa-arrow-right"></i></a></div></aside>')
    pager = '<nav class="ca-pager" aria-label="Section pages">' + (f'<a href="{BASE}{prev["slug"]}/">← {C.label(prev["id"])} · {prev["title"]}</a>' if prev else '<span></span>') + \
            (f'<a href="{BASE}{nxt["slug"]}/">{C.label(nxt["id"])} · {nxt["title"]} →</a>' if nxt else '') + '</nav>'
    main = (hero + '<div class="ca-layout">' + toc(sid, sub) + '<div class="ca-content">' + bridge_from +
            f'<article class="ca-lesson" id="lesson-{num}">' + body + '</article>' + bridge_next + pager + '</div></div>')
    title = f'{C.label(sid)} {s["title"]} · College Algebra | Dipendranath Mahato'
    desc = f'Interactive notes for College Algebra (MATH 1314, UTRGV) Section {sid[:3]}: {re.sub("<[^>]+>", "", s["blurb"])}'
    core = OUT / "assets" / "ca-core.js"
    lesson = OUT / s["slug"] / "lesson.js"
    scripts = (f'<script src="{BASE}assets/ca-core.js?v={ver(core)}"></script>\n<script src="{BASE}{s["slug"]}/lesson.js?v={ver(lesson)}"></script>')
    return shell(title, desc, main, scripts)


def home_page():
    hero = ('<header class="ca-hero"><span class="ca-eyebrow"><i class="fa-solid fa-book-open-reader"></i> UNIVERSITY OF TEXAS RIO GRANDE VALLEY · FALL 2026 · MATH 1314</span>'
            '<h1>College Algebra — Interactive Course Notes</h1><p class="ca-hero-schedule"><i aria-hidden="true" class="fa-regular fa-calendar-days"></i> Tue &amp; Thu · 8:00–9:15 AM · EMAGC 1.206 '
            '<span class="ca-hero-schedule-separator">·</span> PLTL online 9:30–10:45 AM</p><div class="ca-hero-links">'
            '<button class="ca-foundations-btn" id="foundations-open" type="button"><i class="fa-solid fa-layer-group"></i> Course Foundations</button>'
            '<a href="#week-1" id="ca-this-week" hidden><i class="fa-solid fa-calendar-check"></i> <span>Jump to this week</span></a>' +
            f'<a href="{C.TEXTBOOK}1-introduction-to-prerequisites" rel="noopener" target="_blank"><i class="fa-solid fa-book"></i> OpenStax College Algebra (textbook)</a></div></header>')
    intro = ('<div class="ca-home-intro">'
             '<div><b><i class="fa-solid fa-route"></i> One page per section.</b> Each section has its own page with interactive activities, guided problems, and a short wrap-up.</div>'
             '<div><b><i class="fa-solid fa-calendar-week"></i> Follow the weeks.</b> The plan below follows the syllabus schedule, including test dates.</div>'
             '<div><b><i class="fa-solid fa-link"></i> Every section connects.</b> Each page starts with where we are coming from and ends with why the next section matters.</div></div>')
    weeks_html = []
    for unit, uname, uweeks, udesc, _, wlist in C.UNITS:
        weeks_html.append(f'<section class="ca-unit" aria-labelledby="unit-{unit[-1]}"><div class="ca-unit-head"><span>{unit} · {uweeks}</span><h2 id="unit-{unit[-1]}">{uname}</h2><p>{udesc}</p></div>')
        for w in wlist:
            a, b = C.week_dates(w)
            dates = f'{a.strftime("%b")} {a.day}–{b.strftime("%b") + " " if b.month != a.month else ""}{b.day}'
            items = []
            for it in C.WEEKS[w]:
                if isinstance(it, tuple):
                    kind, text, detail = it
                    items.append(f'<div class="ca-event{" test" if kind == "test" else ""}"><i class="fa-solid {"fa-file-pen" if kind == "test" else "fa-calendar-day"}"></i> {text}{f"<small>{detail}</small>" if detail else ""}</div>')
                else:
                    s = C.by_id(it)
                    items.append(f'<a class="ca-sec-card" href="{BASE}{s["slug"]}/"><small>SECTION {C.label(it).upper()}</small><b>{s["title"]}</b><span>{s["blurb"]}</span><em><i class="fa-solid fa-circle-question"></i> {re.sub("<[^>]+>", "", s["q"])}</em></a>')
            weeks_html.append(f'<div class="ca-week" id="week-{w}" data-start="{a.isoformat()}" data-end="{b.isoformat()}" data-week="{w}"><div class="ca-week-label">Week {w}<small>{dates}</small></div><div class="ca-week-items">{"".join(items)}</div></div>')
        weeks_html.append('</section>')
    foundations = (SRC / "foundations-dialog.html").read_text()
    main = (hero + '<div class="ca-chapter-notice" role="note"><i aria-hidden="true" class="fa-solid fa-circle-info"></i><span>Open any section below, or use the course map on each section page to move between sections.</span></div>'
            + intro + '<div class="ca-roadmap">' + ''.join(weeks_html) + '</div>' + foundations)
    grades = (SRC / "grade-calculator.js").read_text()
    thisweek = """(()=>{const t=new Date(),d=t.getFullYear()+'-'+String(t.getMonth()+1).padStart(2,'0')+'-'+String(t.getDate()).padStart(2,'0');
const w=[...document.querySelectorAll('.ca-week[data-start]')].find(e=>e.dataset.start<=d&&d<=e.dataset.end);if(!w)return;w.classList.add('is-now');
const a=document.getElementById('ca-this-week');if(a){a.href='#'+w.id;a.querySelector('span').textContent='Jump to this week (Week '+w.dataset.week+')';a.hidden=false;}})();"""
    redirect = """(()=>{const map={%s};const go=()=>{const id=location.hash.slice(1);if(map[id])location.replace('%s'+map[id]+'/#'+id);};go();window.addEventListener('hashchange',go);
const modal=document.getElementById('foundations-modal'),HASH='#course-foundations';if(!modal)return;const open=()=>{if(location.hash===HASH&&!modal.open)modal.showModal();};
document.getElementById('foundations-open').addEventListener('click',()=>{if(location.hash!==HASH)history.replaceState(null,'',HASH);});
modal.addEventListener('close',()=>{if(location.hash===HASH)history.replaceState(null,'',location.pathname+location.search);});window.addEventListener('hashchange',open);open();})();"""
    old = {}
    for sid in ("3.1", "3.2"):
        body = (SRC / "sections" / f'{C.by_id(sid)["slug"]}.html').read_text()
        for i, _ in panels(expand_macros(body, sid.replace('.', ''))):
            old[i] = C.by_id(sid)["slug"]
        old['lesson-' + sid.replace('.', '')] = C.by_id(sid)["slug"]
    old.update({'exit-31': '3-1', 'exit-32': '3-2'})
    js = ','.join(f"'{k}':'{v}'" for k, v in old.items())
    scripts = f'<script>{grades}</script>\n<script>{thisweek}</script>\n<script>{redirect % (js, BASE)}</script>'
    return shell('College Algebra · Interactive Notes | Dipendranath Mahato',
                 'Interactive course notes for College Algebra (MATH 1314) at UTRGV, Fall 2026: a weekly plan with one interactive page per section.', main, scripts)


def main():
    (OUT / "assets").mkdir(parents=True, exist_ok=True)
    shutil.copy(SRC / "ca-course.css", OUT / "assets" / "ca-course.css")
    shutil.copy(SRC / "ca-core.js", OUT / "assets" / "ca-core.js")
    only = [a for a in sys.argv[1:] if not a.startswith("--")]
    for sid in C.order():
        s = C.by_id(sid)
        src_html = SRC / "sections" / f'{s["slug"]}.html'
        if not src_html.exists() or (only and sid not in only):
            continue
        (OUT / s["slug"]).mkdir(exist_ok=True)
        shutil.copy(SRC / "sections" / f'{s["slug"]}.js', OUT / s["slug"] / "lesson.js")
        (OUT / s["slug"] / "index.html").write_text(section_page(sid))
        print('built', sid)
    (OUT / "index.html").write_text(home_page())
    print('built home')


if __name__ == "__main__":
    main()
