from PIL import Image, ImageDraw, ImageFilter
import random
import math

def create_base_canvas(width=1280, height=720):
    # Dark charcoal/black background
    return Image.new("RGB", (width, height), (10, 10, 12))

def draw_glow_line(draw, start, end, color, width=2, glow_width=10):
    # Draw multiple layers for glow effect
    for i in range(glow_width, 0, -2):
        alpha = int(100 * (1 - i/glow_width))
        draw.line([start, end], fill=(color[0], color[1], color[2], alpha), width=width + i)
    draw.line([start, end], fill=color, width=width)

def generate_ux_deficit():
    img = create_base_canvas()
    draw = ImageDraw.Draw(img, "RGBA")
    width, height = img.size
    
    # Generate "Cognitive Overload" - Messy network
    nodes = [(random.randint(100, width-100), random.randint(100, height-100)) for _ in range(30)]
    primary_color = (0, 242, 255) # Cyan
    accent_color = (112, 0, 255) # Purple
    
    for i, start in enumerate(nodes):
        for j, end in enumerate(nodes):
            if i != j and random.random() < 0.1:
                color = primary_color if random.random() > 0.3 else accent_color
                draw.line([start, end], fill=(color[0], color[1], color[2], 40), width=1)
    
    for node in nodes:
        r = random.randint(3, 8)
        draw.ellipse([node[0]-r, node[1]-r, node[0]+r, node[1]+r], fill=primary_color)
        
    img = img.filter(ImageFilter.GaussianBlur(radius=0.5))
    img.save("ux_deficit_viz.png")

def generate_simulator_hurdle():
    img = create_base_canvas()
    draw = ImageDraw.Draw(img, "RGBA")
    width, height = img.size
    
    # Generate "System Silos" - Misaligned grids
    grid_size = 50
    color1 = (0, 242, 255, 80)
    color2 = (112, 0, 255, 80)
    
    # Left Grid (Unreal Engine)
    for x in range(100, width//2, grid_size):
        draw.line([x, 100, x, height-100], fill=color1, width=1)
    for y in range(100, height-100, grid_size):
        draw.line([100, y, width//2 - 20, y], fill=color1, width=1)
        
    # Right Grid (Embedded OS) - Shifted and skewed
    offset_x = width//2 + 50
    skew = 20
    for x in range(offset_x, width-100, grid_size):
        draw.line([x, 120, x + skew, height-80], fill=color2, width=1)
    for y in range(100, height-100, grid_size):
        draw.line([offset_x, y + 20, width-80, y + 20], fill=color2, width=1)
        
    # Warning icons in the middle
    draw.text((width//2 - 10, height//2), "MISMATCH", fill=(255, 50, 50))
    
    img.save("simulator_hurdle_viz.png")

def generate_showroom_pivot():
    img = create_base_canvas()
    draw = ImageDraw.Draw(img, "RGBA")
    width, height = img.size
    
    # Generate "Spatial Anchors" - Concentric circles and targets
    center = (width//2, height//2)
    primary = (0, 242, 255)
    
    for r in range(50, 300, 50):
        draw.ellipse([center[0]-r, center[1]-r, center[0]+r, center[1]+r], outline=(primary[0], primary[1], primary[2], 100 - r//4), width=2)
    
    # Radar lines
    for angle in range(0, 360, 45):
        rad = math.radians(angle)
        end = (center[0] + 300 * math.cos(rad), center[1] + 300 * math.sin(rad))
        draw.line([center, end], fill=(primary[0], primary[1], primary[2], 50), width=1)
        
    # Floating tooltips
    tips = [(center[0]+150, center[1]-100), (center[0]-200, center[1]+50), (center[0]+100, center[1]+150)]
    for tip in tips:
        draw.rectangle([tip[0], tip[1], tip[0]+80, tip[1]+30], outline=primary, width=2)
        draw.line([center, (tip[0], tip[1]+15)], fill=primary, width=1)

    img.save("showroom_pivot_viz.png")

if __name__ == "__main__":
    generate_ux_deficit()
    generate_simulator_hurdle()
    generate_showroom_pivot()
    print("Visuals generated successfully.")
