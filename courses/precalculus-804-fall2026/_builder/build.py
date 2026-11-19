"""Generate the Precalculus course site: course home + one page per section.
Run from this _builder folder:  python3 build.py [section ids…]  ->  rewrites the course pages in the folder above.
   python3 build.py --preview  ->  writes a test copy into _builder/out/ instead."""
import html as H, re, shutil, sys, hashlib, pathlib
import course as C

ROOT = pathlib.Path(__file__).parent
SRC = ROOT / "src"
# This _builder folder lives inside courses/precalculus-804-fall2026/ (C.SLUG), so by default the pages are written
# to the folder above it. Use --preview to write a throwaway copy into _builder/out/ instead.
OUT = ROOT / "out" / C.SLUG if "--preview" in sys.argv else ROOT.parent
BASE = C.BASE
SITE_TEMPLATE_VERSION = "269f880fda8c"

SITE_CONTROLS = (ROOT / "src" / "site-controls.js").read_text()


def ver(path):
    return hashlib.md5(pathlib.Path(path).read_bytes()).hexdigest()[:10]


def head(title, desc):
    return f"""<!DOCTYPE html>
<html data-theme="light" lang="en"><head><meta charset="utf-8"/><meta content="width=device-width,initial-scale=1" name="viewport"/><meta content="{BASE}" name="course-base"/>
<title>{title}</title><meta name="description" content="{H.escape(desc)}"/>
<link href="/assets/css/style.css?v=b58e400b11f6" rel="stylesheet"/><link href="/assets/css/course.css?v=55f96e6298d0" rel="stylesheet"/><link href="/assets/css/interactive-course.css?v=65ffb2f69374" rel="stylesheet"/>
<link href="{BASE}assets/pc-course.css?v={ver(OUT / 'assets' / 'pc-course.css')}" rel="stylesheet"/>
<link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css" rel="stylesheet"/><link href="https://cdn.jsdelivr.net/npm/academicons/css/academicons.min.css" rel="stylesheet"/>
</head>"""


UNI = ('<div class="uni-header prominent ca-university-header"><div class="uni-header-left"><i class="fa-solid fa-school"></i><div>'
       '<h3 class="uni-title">University of Texas Rio Grande Valley</h3><div class="uni-subtitle">Current teaching · Edinburg, Texas · Fall 2026</div></div></div>'
       '<div class="uni-header-logo"><img alt="UTRGV" src="/assets/images/utrgv-logo.svg"/></div></div>')


def shell(title, desc, main, scripts):
    return (head(title, desc) + '<body class="course-page pc-course"><div class="page"><header class="top-nav" data-shared-template="header"></header>'
            '<main class="layout"><aside class="sidebar" data-shared-template="sidebar"></aside><section class="main">' + UNI +
            '<div class="ca">' + main + '</div><div class="footer" data-shared-template="footer"></div></section></main></div>\n'
            f'<script defer src="/assets/js/site-template.js?v={SITE_TEMPLATE_VERSION}"></script>\n'
            f'<script id="ca-shared-site-controls">{SITE_CONTROLS}</script>\n' + scripts + '\n</body></html>\n')


def panels(body):
    """(id, heading) of every activity block in a section body."""
    out = []
    for m in re.finditer(r'<section class="ca-panel[^"]*" id="([^"]+)">\s*(?:<div class="ca-guided-heading">.*?)?<h3>(.*?)</h3>', body, re.S):
        out.append((m.group(1), re.sub(r'<[^>]+>', '', m.group(2)).strip()))
    return out


def toc(current=None, sub=()):
    parts = [f'<nav aria-label="Course navigation" class="ca-toc"><a class="ca-toc-home" href="{BASE}"><i class="fa-solid fa-house"></i> Course home · all sections</a>'
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
    hero = (f'<header class="ca-hero ca-hero-section"><span class="ca-eyebrow"><i class="fa-solid fa-book-open-reader"></i> {C.COURSE} {C.NAME.upper()} · '
            f'WEEK {s["week"]} · {C.label(sid).upper()}</span><h1>{s["title"]}</h1><p class="ca-hero-question">{s["q"]}</p>'
            f'<div class="ca-hero-links"><a class="ca-hero-home" href="{BASE}"><i class="fa-solid fa-house"></i> Course home</a>'
            f'<a href="{s["book"]}" rel="noopener" target="_blank"><i class="fa-solid fa-book"></i> Textbook reading · Section {C.number(sid)}</a></div></header>')
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
    title = f'{C.label(sid)} {s["title"]} · {C.NAME} | Dipendranath Mahato'
    desc = f'Interactive notes for {C.NAME} ({C.COURSE}, UTRGV), {C.label(sid)}: {re.sub("<[^>]+>", "", s["blurb"])}'
    core = OUT / "assets" / "pc-core.js"
    lesson = OUT / s["slug"] / "lesson.js"
    scripts = (f'<script src="{BASE}assets/pc-core.js?v={ver(core)}"></script>\n<script src="{BASE}{s["slug"]}/lesson.js?v={ver(lesson)}"></script>')
    return shell(title, desc, main, scripts)


def home_page():
    hero = (f'<header class="ca-hero"><span class="ca-eyebrow"><i class="fa-solid fa-book-open-reader"></i> UNIVERSITY OF TEXAS RIO GRANDE VALLEY · FALL 2026 · {C.COURSE}-{C.SECTION}</span>'
            f'<h1>{C.NAME}<span class="ca-h1-sub">Interactive Course Notes</span></h1>'
            '<p class="ca-hero-schedule"><i aria-hidden="true" class="fa-regular fa-calendar-days"></i> '
            + ' <span class="ca-hero-schedule-separator">·</span> '.join(C.MEETINGS) + '</p><div class="ca-hero-links">'
            '<button class="ca-foundations-btn" id="foundations-open" type="button"><i class="fa-solid fa-layer-group"></i> Course Foundations</button>'
            '<a href="#sections" id="ca-this-week" hidden><i class="fa-solid fa-calendar-check"></i> <span>This week</span></a>' +
            f'<a href="{C.TEXTBOOK}5-introduction-to-trigonometric-functions" rel="noopener" target="_blank"><i class="fa-solid fa-book"></i> OpenStax Precalculus 2e (textbook)</a></div></header>')
    intro = ('<div class="ca-home-intro">'
             '<div><b><i class="fa-solid fa-route"></i> One page per section.</b> Each section has its own page with interactive activities, guided problems, and a short wrap-up.</div>'
             '<div><b><i class="fa-solid fa-list-ol"></i> Listed by chapter.</b> Sections appear in the order we cover them in class. The week-by-week order is at the bottom of this page.</div>'
             '<div><b><i class="fa-solid fa-link"></i> Every section connects.</b> Each page starts with where we are coming from and ends with why the next section matters.</div></div>')

    def dates(w):
        a, b = C.week_dates(w)
        return a, b, f'{a.strftime("%b")} {a.day}–{b.strftime("%b") + " " if b.month != a.month else ""}{b.day}'

    chapters = []
    for ch, name, icon in C.CHAPTERS:
        secs = [C.by_id(sid) for sid in C.order() if C.by_id(sid)["ch"] == ch]
        weeks = sorted({s["week"] for s in secs})
        wr = f'Week {weeks[0]}' if len(weeks) == 1 else f'Weeks {weeks[0]}–{weeks[-1]}'
        cards = []
        for s in secs:
            a, b, _ = dates(s["week"])
            cards.append(f'<a class="ca-sec-card" id="sec-{s["slug"]}" href="{BASE}{s["slug"]}/" data-start="{a.isoformat()}" data-end="{b.isoformat()}" data-label="{C.label(s["id"])}">'
                         f'<small>SECTION {C.label(s["id"]).upper()}<span class="ca-week-tag">Week {s["week"]}</span></small><b>{s["title"]}</b><span>{s["blurb"]}</span>'
                         f'<em><i class="fa-solid fa-circle-question"></i> {re.sub("<[^>]+>", "", s["q"])}</em></a>')
        cnum, ctitle = name.split(' · ', 1)
        chapters.append(f'<section class="ca-unit" id="chapter-{ch}" aria-labelledby="chapter-{ch}-h"><div class="ca-unit-head"><span><i class="fa-solid {icon}"></i> {cnum}</span>'
                        f'<h2 id="chapter-{ch}-h">{ctitle}</h2><p>{len(secs)} section{"s" if len(secs) != 1 else ""} · {wr}</p></div><div class="ca-sec-grid">{"".join(cards)}</div></section>')

    sched = []
    for w in sorted({C.by_id(sid)["week"] for sid in C.order()}):
        _, _, d = dates(w)
        links = ';<br>'.join(f'<a href="{BASE}{s["slug"]}/">{C.label(s["id"])} {s["title"]}</a>' for s in (C.by_id(x) for x in C.order()) if s["week"] == w)
        sched.append(f'<li><b>Week {w}</b> <small>{d}</small><span>{links}</span></li>')
    schedule = ('<details class="ca-schedule" id="weekly-order"><summary><i class="fa-solid fa-calendar-week"></i> Week-by-week order of the sections</summary>'
                f'<ol>{"".join(sched)}</ol><p class="ca-note">Test dates, recitation labs, reviews, and breaks are in the syllabus and the Course Foundations panel.</p></details>')

    foundations = (SRC / "foundations-dialog.html").read_text()
    main = (hero + '<div class="ca-chapter-notice" role="note"><i aria-hidden="true" class="fa-solid fa-circle-info"></i><span>Open any section below, or use the course map on each section page to move between sections.</span></div>'
            + intro + '<div class="ca-roadmap" id="sections">' + ''.join(chapters) + '</div>' + schedule + foundations)
    grades = (SRC / "grade-calculator.js").read_text()
    # Runs in the visitor's browser on every visit: marks the sections scheduled for the current week and shows the
    # "This week" button. In weeks with no new section (the review week, the end of the semester) nothing is shown.
    thisweek = """(()=>{const t=new Date(),d=t.getFullYear()+'-'+String(t.getMonth()+1).padStart(2,'0')+'-'+String(t.getDate()).padStart(2,'0');
const now=[...document.querySelectorAll('.ca-sec-card[data-start]')].filter(e=>e.dataset.start<=d&&d<=e.dataset.end);if(!now.length)return;
now.forEach(e=>e.classList.add('is-now'));const a=document.getElementById('ca-this-week');if(!a)return;a.href='#'+now[0].id;
const ls=now.map(e=>e.dataset.label);a.querySelector('span').textContent='This week: Section'+(ls.length>1?'s ':' ')+ls.join(' and ');a.hidden=false;})();"""
    dialog = """(()=>{const modal=document.getElementById('foundations-modal'),HASH='#course-foundations';if(!modal)return;const open=()=>{if(location.hash===HASH&&!modal.open)modal.showModal();};
document.getElementById('foundations-open').addEventListener('click',()=>{if(location.hash!==HASH)history.replaceState(null,'',HASH);});
modal.addEventListener('close',()=>{if(location.hash===HASH)history.replaceState(null,'',location.pathname+location.search);});window.addEventListener('hashchange',open);open();})();"""
    scripts = f'<script>{grades}</script>\n<script>{thisweek}</script>\n<script>{dialog}</script>'
    return shell(f'{C.NAME} · Interactive Notes | Dipendranath Mahato',
                 f'Interactive course notes for {C.NAME} ({C.COURSE}) at UTRGV, Fall 2026: one interactive page per section, listed by chapter.', main, scripts)


def main():
    (OUT / "assets").mkdir(parents=True, exist_ok=True)
    shutil.copy(SRC / "pc-course.css", OUT / "assets" / "pc-course.css")
    shutil.copy(SRC / "pc-core.js", OUT / "assets" / "pc-core.js")
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
