"""Makes the app icon from a picture, in the repository root: the Home Screen icon (apple-touch-icon.png), the installed
app's icons (icon-192.png, icon-512.png, and icon-maskable-512.png for Android, which may cut it to a circle), the
home page's tab icon (favicon.png) and its logo (logo.png). The square the icons are made from is kept as
src/app-icon.png.

Each subject keeps its own badge (SUBJECT_ICONS in src/shared/icons.mjs): this script also writes them as the
subject pages' tab icons (favicon-math.svg, favicon-physics.svg) and as the pictures of the manifest's shortcuts
(icon-math-192.png, icon-physics-192.png).

    python3 src/app_icon.py picture.jpg 252 96 668 512    # a new picture, cut to the box: left top right bottom (px)
    python3 src/app_icon.py picture.png                   # a new picture, cut to its largest square (from the top)
    python3 src/app_icon.py                               # the same icon again, from src/app-icon.png

Needs Pillow, and Node plus Python Playwright with Chromium for the badges. After a new picture, bump CACHE in sw.js,
or devices keep showing the saved icon."""
import json, os, subprocess, sys
from PIL import Image, ImageFilter

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SOURCE = os.path.join(ROOT, 'src', 'app-icon.png')


def square(img, box=None):
    """the picture cut to the box (left, top, right, bottom), then to its largest square: from the top of a tall
    picture, so a head stays in, and from the middle of a wide one"""
    if box:
        img = img.crop(box)
    w, h = img.size
    s = min(w, h)
    left = (w - s) // 2
    return img.crop((left, 0, left + s, s))


def flatten(img):
    """on white: an iPhone shows the see-through parts of an icon as black"""
    img = img.convert('RGBA')
    return Image.alpha_composite(Image.new('RGBA', img.size, (255, 255, 255, 255)), img).convert('RGB')


def resized(img, size):
    out = img.resize((size, size), Image.LANCZOS)
    if size <= 128:  # shrunk a lot: a little sharpening keeps the outlines crisp
        out = out.filter(ImageFilter.UnsharpMask(radius=0.8, percent=60, threshold=2))
    return out


def background(img):
    """the colour of the picture's corners, which the maskable icon is filled with"""
    w, h = img.size
    corners = [img.getpixel(p) for p in ((0, 0), (w - 1, 0), (0, h - 1), (w - 1, h - 1))]
    return max(set(corners), key=corners.count)


def maskable(img, size=512):
    """the drawing in the middle 80% (the part a launcher never cuts off), on the picture's own background; a drawing
    that runs off the bottom of the picture (a head and shoulders, say) stays on the bottom edge"""
    bg = background(img)
    inner = round(size * 0.8)
    art = img.resize((inner, inner), Image.LANCZOS)
    w, h = img.size
    runs_off = any(sum(abs(a - b) for a, b in zip(img.getpixel((x, h - 1)), bg)) > 60 for x in range(0, w, 4))
    out = Image.new('RGB', (size, size), bg)
    out.paste(art, ((size - inner) // 2, size - inner if runs_off else (size - inner) // 2))
    return out


def save(img, name):
    """256 colours, dithered: it looks the same and the file is about half the size (the Home Screen icon and the
    logo are saved for offline use on every device that opens the site)"""
    path = os.path.join(ROOT, name)
    img.quantize(colors=256, method=Image.Quantize.MEDIANCUT, dither=Image.Dither.FLOYDSTEINBERG).save(path, optimize=True)
    print(f'wrote {name} ({os.path.getsize(path) / 1024:.0f} KB)')


def badges():
    """each subject's badge, from src/shared/icons.mjs: an SVG file for its pages' browser tab, and a 192 px picture
    for the manifest's shortcuts"""
    js = "import('./src/shared/icons.mjs').then((m) => console.log(JSON.stringify(m.SUBJECT_ICONS)))"
    icons = json.loads(subprocess.check_output(['node', '-e', js], cwd=ROOT))
    from playwright.sync_api import sync_playwright
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page(viewport={'width': 192, 'height': 192})
        for subject, svg in icons.items():
            name = f'favicon-{subject}.svg'
            with open(os.path.join(ROOT, name), 'w') as f:
                f.write(svg.replace('<svg ', '<svg xmlns="http://www.w3.org/2000/svg" ', 1).replace(' aria-hidden="true"', '') + '\n')
            print(f'wrote {name}')
            page.set_content('<body style="margin:0;background:transparent">' + svg.replace('<svg ', '<svg width="192" height="192" style="display:block" ', 1) + '</body>')
            path = os.path.join(ROOT, f'icon-{subject}-192.png')
            page.screenshot(path=path, omit_background=True, clip={'x': 0, 'y': 0, 'width': 192, 'height': 192})
            Image.open(path).save(path, optimize=True)
            print(f'wrote icon-{subject}-192.png ({os.path.getsize(path) / 1024:.0f} KB)')
        browser.close()


def main():
    args = sys.argv[1:]
    if args:
        box = tuple(int(v) for v in args[1:5]) if len(args) >= 5 else None
        art = square(flatten(Image.open(args[0])), box)
        art.save(SOURCE, optimize=True)
        print(f'wrote src/app-icon.png ({art.size[0]} px square)')
    else:
        art = flatten(Image.open(SOURCE))
    for name, size in (('apple-touch-icon.png', 180), ('icon-192.png', 192), ('icon-512.png', 512), ('favicon.png', 64), ('logo.png', 108)):
        save(resized(art, size), name)
    save(maskable(art), 'icon-maskable-512.png')
    badges()


if __name__ == '__main__':
    main()
