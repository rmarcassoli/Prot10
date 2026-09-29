from PIL import Image, ImageDraw

SIZE = 1024
BG = (238, 242, 247)  # soft gray
OUTER = (12, 20, 36)
RING = (90, 176, 255)
RING_DARK = (14, 22, 34)
CHECK = (78, 196, 114)


def add_round_square(bg, radius=160, padding=60, fill=(255,255,255)):
    img = Image.new('RGBA', (SIZE, SIZE), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    d.rounded_rectangle(
        [padding, padding, SIZE-padding, SIZE-padding],
        radius=radius,
        fill=fill,
        outline=None
    )
    return img


def make_icon(path, splash=False):
    img = Image.new('RGBA', (SIZE, SIZE), BG + (255,))
    d = ImageDraw.Draw(img)

    # large rounded square backdrop
    rounded = Image.new('RGBA', (SIZE, SIZE), (0, 0, 0, 0))
    rd = ImageDraw.Draw(rounded)
    rd.rounded_rectangle([80, 80, SIZE - 80, SIZE - 80], radius=180, fill=(255, 255, 255, 255))
    img.alpha_composite(rounded)

    # dark circular ring
    ring_outer = (SIZE // 2, SIZE // 2)
    radius_outer = 420
    d.ellipse([SIZE // 2 - radius_outer, SIZE // 2 - radius_outer,
               SIZE // 2 + radius_outer, SIZE // 2 + radius_outer], outline=OUTER, width=52)

    # blue ring
    radius_blue = 340
    d.ellipse([SIZE // 2 - radius_blue, SIZE // 2 - radius_blue,
               SIZE // 2 + radius_blue, SIZE // 2 + radius_blue], outline=RING, width=32)

    # inner white circle
    inner_radius = 230
    d.ellipse([SIZE // 2 - inner_radius, SIZE // 2 - inner_radius,
               SIZE // 2 + inner_radius, SIZE // 2 + inner_radius], fill=(248, 250, 252, 255), outline=(255,255,255,255), width=2)

    # green check mark in center
    check_points = [
        (300, 510),
        (430, 630),
        (710, 370),
    ]
    d.line(check_points, fill=CHECK, width=50, joint='curve')

    # subtle top highlight
    highlight = Image.new('RGBA', (SIZE, SIZE), (0, 0, 0, 0))
    hd = ImageDraw.Draw(highlight)
    hd.rounded_rectangle([120, 120, SIZE - 120, SIZE - 120], radius=180, fill=(255,255,255,0))
    # add minimal light gradient effect using alpha
    for y in range(0, SIZE):
        alpha = int(18 * (1 - abs(y - SIZE/2) / (SIZE/2)))
        for x in range(0, SIZE):
            if x < SIZE * 0.6 and y < SIZE * 0.5:
                r, g, b, a = img.getpixel((x, y))
                if a:
                    img.putpixel((x, y), (r, g, b, max(0, min(255, a - alpha))))

    img.save(path)


# Build final icon and splash variants matching the selected concept.
make_icon('C:/Users/rmarc/Prot10/assets/icon.png')
make_icon('C:/Users/rmarc/Prot10/assets/splash-icon.png')
make_icon('C:/Users/rmarc/Prot10/assets/android-icon-foreground.png')
make_icon('C:/Users/rmarc/Prot10/assets/android-icon-background.png')
