from PIL import Image, ImageDraw, ImageFont
import os

FONT_PATH = "/usr/share/fonts/truetype/dejavu/DejaVuSansMono-Bold.ttf"
FONT_PATH_REG = "/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf"

# slug, title, width, height, base_color(top), base_color(bottom)
items = [
    ("pixel-sunset",   "Pixel Sunset",   800, 600, (30,45,90),  (12,20,45)),
    ("pixel-forest",   "Pixel Forest",   800, 600, (40,90,60),  (15,40,25)),
    ("space-cruiser",  "Space Cruiser",  960, 540, (25,30,70),  (8,10,30)),
    ("stone-castle",   "Stone Castle",   600, 800, (90,95,110), (45,50,65)),
    ("hero-sprite",    "Hero Sprite",    700, 700, (100,50,140),(45,20,70)),
    ("night-city",     "Night City",     960, 540, (15,25,50),  (5,8,20)),
    ("iso-room",       "Iso Room",       800, 600, (150,120,190),(90,70,130)),
    ("ice-crystal",    "Ice Crystal",    450, 800, (60,110,180),(20,45,90)),
    ("mech-unit",      "Mech Unit",      700, 700, (60,40,90),  (25,15,45)),
    ("mountain-mist",  "Mountain Mist",  960, 540, (140,170,200),(90,110,140)),
    ("ocean-dusk",     "Ocean Dusk",     900, 600, (30,90,130), (10,40,70)),
    ("flower-meadow",  "Flower Meadow",  800, 600, (90,150,90), (50,100,50)),
    ("night-forest",   "Night Forest",   600, 800, (20,50,30),  (8,20,12)),
]

os.makedirs("/home/claude/work/src/images", exist_ok=True)

for slug, title, w, h, top, bottom in items:
    img = Image.new("RGB", (w, h), top)
    draw = ImageDraw.Draw(img)
    # vertical gradient
    for y in range(h):
        t = y / h
        r = int(top[0] + (bottom[0]-top[0])*t)
        g = int(top[1] + (bottom[1]-top[1])*t)
        b = int(top[2] + (bottom[2]-top[2])*t)
        draw.line([(0,y),(w,y)], fill=(r,g,b))

    # subtle diagonal stripe pattern for a "placeholder" texture
    stripe_color = (255,255,255)
    step = 40
    for x in range(-h, w, step):
        draw.line([(x,0),(x+h,h)], fill=stripe_color, width=2)
    # overlay a translucent dark panel behind text for readability
    overlay = Image.new("RGBA", (w, h), (0,0,0,0))
    odraw = ImageDraw.Draw(overlay)

    title_font_size = max(28, w // 14)
    label_font_size = max(16, w // 30)
    dim_font_size = max(14, w // 36)

    title_font = ImageFont.truetype(FONT_PATH, title_font_size)
    label_font = ImageFont.truetype(FONT_PATH_REG, label_font_size)
    dim_font = ImageFont.truetype(FONT_PATH_REG, dim_font_size)

    lines = [
        (title, title_font, (255,255,255,255)),
        ("PLACEHOLDER IMAGE", label_font, (255,214,102,255)),
        (f"replace: src/images/{slug}.png", label_font, (200,220,255,255)),
        (f"{w}x{h}", dim_font, (180,190,210,255)),
    ]
    total_h = sum(odraw.textbbox((0,0), t, font=f)[3] for t,f,_ in lines) + 14*(len(lines)-1)
    panel_w = max(odraw.textbbox((0,0), t, font=f)[2] for t,f,_ in lines) + 48
    panel_h = total_h + 40
    px = (w - panel_w)//2
    py = (h - panel_h)//2
    odraw.rectangle([px, py, px+panel_w, py+panel_h], fill=(10,12,20,190))
    odraw.rectangle([px, py, px+panel_w, py+panel_h], outline=(255,255,255,120), width=2)

    cy = py + 20
    for text, font, color in lines:
        bbox = odraw.textbbox((0,0), text, font=font)
        tw = bbox[2]-bbox[0]
        th = bbox[3]-bbox[1]
        odraw.text(((w-tw)//2, cy), text, font=font, fill=color)
        cy += th + 14

    img = Image.alpha_composite(img.convert("RGBA"), overlay).convert("RGB")
    img.save(f"/home/claude/work/src/images/{slug}.png")
    print(f"saved {slug}.png ({w}x{h})")
