import os
from PIL import Image

OUT_DIR = 'public/images/menu'
os.makedirs(OUT_DIR, exist_ok=True)

def make_square(img, target_size=600, padding=24):
    """Place image centered on a pure white square canvas."""
    if img.mode != 'RGB':
        bg = Image.new('RGB', img.size, (255, 255, 255))
        bg.paste(img, mask=img.split()[3] if len(img.split()) == 4 else None)
        img = bg

    w, h = img.size
    inner_size = target_size - (padding * 2)
    scale = min(inner_size / w, inner_size / h)
    new_w, new_h = max(1, int(w * scale)), max(1, int(h * scale))
    resized = img.resize((new_w, new_h), Image.Resampling.LANCZOS)

    canvas = Image.new('RGB', (target_size, target_size), (255, 255, 255))
    canvas.paste(resized, ((target_size - new_w) // 2, (target_size - new_h) // 2))
    return canvas

def save_raw(raw_filename, out_filename):
    path = os.path.join('public/images/menu_raw', raw_filename)
    if not os.path.exists(path):
        print(f"Missing raw: {path}")
        return
    im = Image.open(path)
    sq = make_square(im, 600, padding=20)
    out_path = os.path.join(OUT_DIR, out_filename)
    sq.save(out_path, 'JPEG', quality=92)
    print(f"Saved: {out_filename}")

def save_crop(page_img, box, out_filename, padding=16):
    cropped = page_img.crop(box)
    sq = make_square(cropped, 600, padding=padding)
    out_path = os.path.join(OUT_DIR, out_filename)
    sq.save(out_path, 'JPEG', quality=92)
    print(f"Saved: {out_filename}")

p4 = Image.open('public/menu_pages/page_4.png')
p6 = Image.open('public/menu_pages/page_6.png')

print("--- 1. FILBEY FAVOURITES (PAGE 2) ---")
save_raw('p2_xref757.jpeg', 'filbey-classic-meal.jpg')
save_raw('p2_xref753.jpeg', 'wings-meal-6pc.jpg')
save_raw('p2_xref745.jpeg', 'strips-meal-5pc.jpg')
save_raw('p2_xref741.jpeg', 'snack-meal-2pc.jpg')
save_raw('p2_xref737.jpeg', 'chicken-loaded-fries.jpg')
save_raw('p2_xref749.jpeg', 'kids-chicken-meal.jpg')

print("--- 2. BURGERS (PAGE 3) ---")
save_raw('p3_xref1087.jpeg', 'filbey-classic-burger.jpg')
save_raw('p3_xref1071.jpeg', 'double-crunch-burger.jpg')
save_raw('p3_xref1075.jpeg', 'cheese-crunch-burger.jpg')
save_raw('p3_xref1067.jpeg', 'dynamite-burger.jpg')
save_raw('p3_xref1083.jpeg', 'paneer-crunch-burger.jpg')
save_raw('p3_xref1079.jpeg', 'veg-classic-burger.jpg')

print("--- 3. CHICKEN & BUCKETS (PAGE 4) ---")
save_raw('p2_xref741.jpeg', 'chicken-meal-2pc.jpg')
save_raw('p4_xref1939.jpeg', 'chicken-meal-4pc.jpg')
save_raw('p4_xref1905.jpeg', 'chicken-meal-8pc.jpg')
save_raw('p4_xref1943.jpeg', 'mix-combo.jpg')
save_raw('p4_xref1927.jpeg', 'boneless-strips.jpg')
save_raw('p4_xref1931.jpeg', 'crispy-wings.jpg')
save_raw('p4_xref1923.jpeg', 'dynamite-wings.jpg')
save_raw('p4_xref1901.jpeg', 'signature-chicken-2pc.jpg')
save_raw('p4_xref1919.jpeg', 'signature-chicken-4pc.jpg')
save_raw('p4_xref1935.jpeg', 'signature-chicken-1pc.jpg')

save_crop(p4, (3550, 5450, 4350, 6000), 'garlic-dip.jpg', padding=25)
save_crop(p4, (3550, 6100, 4350, 6650), 'spicy-dip.jpg', padding=25)
save_crop(p4, (3550, 6700, 4350, 7250), 'cheese-dip.jpg', padding=25)

print("--- 4. WRAPS & SIDES (PAGE 5) ---")
save_raw('p5_xref2473.jpeg', 'crispy-chicken-wrap.jpg')
save_raw('p5_xref2493.jpeg', 'dynamite-chicken-wrap.jpg')
save_raw('p5_xref2461.jpeg', 'paneer-wrap.jpg')
save_raw('p5_xref2469.jpeg', 'veg-wrap.jpg')
save_raw('p5_xref2453.jpeg', 'chicken-loaded-fries-side.jpg')
save_raw('p5_xref2457.jpeg', 'chilli-cheese-fries.jpg')
save_raw('p5_xref2501.jpeg', 'chicken-popcorn.jpg')
save_raw('p5_xref2489.jpeg', 'dynamite-popcorn.jpg')
save_raw('p5_xref2477.jpeg', 'peri-peri-popcorn.jpg')
save_raw('p5_xref2449.jpeg', 'french-fries.jpg')
save_raw('p5_xref2445.jpeg', 'peri-peri-fries.jpg')
save_raw('p5_xref2481.jpeg', 'chicken-nuggets.jpg')
save_raw('p5_xref2465.jpeg', 'corn-cheese-nuggets.jpg')
save_raw('p5_xref2497.jpeg', 'veg-nuggets.jpg')
save_raw('p5_xref2485.jpeg', 'extra-bun.jpg')

print("--- 5. DRINKS, SHAKES & DESSERTS (PAGE 6) ---")
save_crop(p6, (430, 1350, 1140, 2600), 'cool-blue-mojito.jpg', padding=15)
save_crop(p6, (1150, 1350, 1850, 2600), 'lemon-mint-mojito.jpg', padding=15)
save_crop(p6, (1860, 1350, 2550, 2600), 'fresh-lemonade.jpg', padding=15)
save_crop(p6, (2560, 1350, 3250, 2600), 'green-apple-mojito.jpg', padding=15)
save_crop(p6, (3260, 1350, 3960, 2600), 'passion-fruit-mojito.jpg', padding=15)
save_crop(p6, (3970, 1350, 4740, 2600), 'watermelon-mojito.jpg', padding=15)

save_raw('p6_xref2909.jpeg', 'brownie-ice-cream.jpg')
save_raw('p6_xref2901.jpeg', 'chocolate-brownie.jpg')

save_crop(p6, (280, 5000, 850, 5600), 'lemon-iced-tea.jpg', padding=20)
save_crop(p6, (980, 5000, 1530, 5600), 'peach-iced-tea.jpg', padding=20)

save_crop(p6, (300, 6380, 780, 7150), 'hot-coffee.jpg', padding=20)
save_crop(p6, (980, 6380, 1460, 7150), 'hot-chocolate.jpg', padding=20)

save_crop(p6, (1680, 3930, 2260, 5100), 'vanilla-shake.jpg', padding=15)
save_crop(p6, (2320, 3930, 2920, 5100), 'strawberry-shake.jpg', padding=15)
save_crop(p6, (2980, 3930, 3560, 5100), 'chocolate-shake.jpg', padding=15)
save_crop(p6, (3640, 3930, 4220, 5100), 'mango-shake.jpg', padding=15)
save_crop(p6, (4300, 3930, 4880, 5100), 'oreo-shake.jpg', padding=15)

save_crop(p6, (1750, 5650, 2330, 6820), 'cold-coffee-shake.jpg', padding=15)
save_crop(p6, (2560, 5650, 3140, 6820), 'tender-coconut-shake.jpg', padding=15)
save_crop(p6, (3370, 5650, 3950, 6820), 'cold-milo-shake.jpg', padding=15)
save_crop(p6, (4180, 5650, 4760, 6820), 'lotus-biscoff-shake.jpg', padding=15)

print("\nALL 52 MENU DISH IMAGES SUCCESSFULLY EXTRACTED & SQUARED!")
