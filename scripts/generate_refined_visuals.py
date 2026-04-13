import matplotlib.pyplot as plt
import matplotlib.patches as patches
import matplotlib.patheffects as path_effects
import numpy as np
import random

# Global Settings
BG_COLOR = '#0a0a0c'
SURFACE_COLOR = '#16161a'
CYAN = '#00f2ff'
PURPLE = '#7000ff'
RED = '#ff4444'
TEXT_MAIN = '#e0e0e6'
TEXT_MUTED = '#a0a0ab'

plt.rcParams['text.color'] = TEXT_MAIN
plt.rcParams['axes.labelcolor'] = TEXT_MAIN
plt.rcParams['xtick.color'] = TEXT_MUTED
plt.rcParams['ytick.color'] = TEXT_MUTED

def setup_fig(width_px, height_px, dpi=150, bg=BG_COLOR):
    fig = plt.figure(figsize=(width_px/dpi, height_px/dpi), dpi=dpi)
    fig.patch.set_facecolor(bg)
    ax = fig.add_axes([0, 0, 1, 1])
    ax.set_facecolor(bg)
    ax.set_xlim(0, width_px)
    ax.set_ylim(0, height_px)
    ax.axis('off')
    return fig, ax

def add_glow(artist, color, weight=2, alpha=0.1, layers=5):
    artist.set_path_effects([
        path_effects.withStroke(linewidth=weight + i*2, foreground=color, alpha=alpha/(i+1))
        for i in range(layers)
    ] + [path_effects.Normal()])

def generate_title_viz():
    print("Generating title_viz.png...")
    fig, ax = setup_fig(1920, 1080, dpi=150)
    
    # Hexagonal Grid
    size = 100
    h = size * np.sqrt(3)
    for i in range(-2, 22):
        for j in range(-2, 12):
            x_offset = (j % 2) * (size * 1.5)
            x = i * (size * 3) + x_offset
            y = j * (h / 2)
            # Simple hex-like lines
            ax.plot([x, x+size], [y, y], color=TEXT_MAIN, alpha=0.04, lw=1)
            ax.plot([x+size, x+size*1.5], [y, y+h/2], color=TEXT_MAIN, alpha=0.04, lw=1)
            ax.plot([x+size*1.5, x+size], [y+h/2, y+h], color=TEXT_MAIN, alpha=0.04, lw=1)

    # Purple radial glow center-right
    circle = plt.Circle((1400, 540), 600, color=PURPLE, alpha=0.05)
    ax.add_patch(circle)

    # Digital Nervous System - Nodes arranged like a dashboard
    nodes = []
    # Steering wheel arc
    for a in np.linspace(0.2, 0.8, 15):
        angle = a * np.pi
        r = 350
        nodes.append((960 + r*np.cos(angle + np.pi/2), 300 + r*np.sin(angle + np.pi/2)))
    # Dashboard lines
    for x in np.linspace(400, 1520, 20):
        y = 400 + 50 * np.sin((x-960)/300)
        nodes.append((x, y))
    
    # Random connections
    for _ in range(150):
        n1 = random.choice(nodes)
        n2 = random.choice(nodes)
        dist = np.sqrt((n1[0]-n2[0])**2 + (n1[1]-n2[1])**2)
        if 50 < dist < 400:
            ax.plot([n1[0], n2[0]], [n1[1], n2[1]], color=CYAN, alpha=0.1, lw=0.5)

    # Draw nodes
    for i, (nx, ny) in enumerate(nodes):
        size = 3 if random.random() > 0.1 else 8
        alpha = 0.4 if size == 3 else 0.8
        node = plt.Circle((nx, ny), size, color=CYAN, alpha=alpha)
        ax.add_patch(node)
        if size > 3:
            add_glow(node, CYAN)

    plt.savefig('title_viz.png', dpi=150, bbox_inches='tight', facecolor=fig.get_facecolor())
    plt.close()

def generate_ux_deficit_viz():
    print("Generating ux_deficit_viz.png...")
    fig, ax = setup_fig(900, 500, dpi=150, bg=SURFACE_COLOR)
    
    # Human head silhouette (simplified)
    head_pts = [(300, 100), (450, 100), (550, 200), (550, 400), (450, 450), (250, 450), (150, 400), (150, 200)]
    poly = patches.Polygon(head_pts, closed=True, facecolor=BG_COLOR, edgecolor=TEXT_MUTED, lw=2)
    ax.add_patch(poly)

    # Overflowing bar chart inside
    labels = ["ADAS", "Infotainment", "OTA", "Manual"]
    values = [300, 250, 320, 200] # height from base 150
    base_y = 150
    x_start = 200
    for i, (label, val) in enumerate(zip(labels, values)):
        # Gradient bar (simulated with multiple rectangles)
        for h in range(val):
            color = CYAN if h/val > 0.5 else PURPLE
            ax.plot([x_start + i*80, x_start + i*80 + 40], [base_y + h, base_y + h], color=color, alpha=0.1)
        
        # Red overflow indicator if val > boundary (approx 350 total)
        if base_y + val > 400:
            ax.text(x_start + i*80 + 20, base_y + val + 10, "⚠", color=RED, ha='center', fontsize=20)
            ax.plot([x_start + i*80, x_start + i*80 + 40], [400, 400], color=RED, lw=2)

        ax.text(x_start + i*80 + 20, base_y - 30, label, color=TEXT_MUTED, ha='center', fontsize=10, rotation=45)

    # Conversion Rate arrow
    ax.arrow(700, 350, 0, -150, head_width=30, head_length=30, fc=RED, ec=RED)
    ax.text(700, 370, "CONVERSION RATE", color=RED, ha='center', fontweight='bold', fontsize=12)

    plt.savefig('ux_deficit_viz.png', dpi=150, bbox_inches='tight', facecolor=fig.get_facecolor())
    plt.close()

def generate_simulator_hurdle_viz():
    print("Generating simulator_hurdle_viz.png...")
    fig, ax = setup_fig(900, 500, dpi=150)
    
    # Boxes
    boxes = [
        {"text": "VR SIMULATOR", "sub": "Unreal Engine Build", "x": 100},
        {"text": "OTA UPDATE", "sub": "Version Mismatch", "x": 375},
        {"text": "DIGITAL TWIN", "sub": "Liability Risk", "x": 650}
    ]
    
    for i, b in enumerate(boxes):
        rect = patches.FancyBboxPatch((b['x'], 200), 180, 100, boxstyle="round,pad=10", facecolor=BG_COLOR, edgecolor=CYAN, lw=2)
        ax.add_patch(rect)
        ax.text(b['x']+90, 250, b['text'], ha='center', va='center', fontweight='bold', color=TEXT_MAIN)
        ax.text(b['x']+90, 180, b['sub'], ha='center', va='center', color=TEXT_MUTED, fontsize=9)
        
        # Connection arrows
        if i < len(boxes) - 1:
            ax.arrow(b['x']+180, 250, 95, 0, head_width=20, head_length=20, fc=CYAN, ec=CYAN, alpha=0.6)

    # Broken link between 2 and 3
    ax.text(600, 250, "X", color=RED, ha='center', va='center', fontsize=60, fontweight='black', path_effects=[path_effects.withSimplePatchShadow()])
    # Radial glow
    glow = plt.Circle((600, 250), 80, color=RED, alpha=0.1)
    ax.add_patch(glow)

    # Danger Meter
    ax.add_patch(patches.Rectangle((850, 100), 20, 300, facecolor=RED, alpha=0.3))
    ax.add_patch(patches.Rectangle((850, 100), 20, 250, facecolor=RED))
    ax.text(830, 250, "NEGATIVE TRANSFER RISK", rotation=90, va='center', color=RED, fontweight='bold', fontsize=10)

    plt.savefig('simulator_hurdle_viz.png', dpi=150, bbox_inches='tight', facecolor=fig.get_facecolor())
    plt.close()

def generate_showroom_pivot_viz():
    print("Generating showroom_pivot_viz.png...")
    fig, ax = setup_fig(900, 500, dpi=150)
    
    # Isometric Slabs
    def draw_slab(y, color, label, alpha=0.5):
        pts = np.array([[200, y], [700, y], [800, y+50], [300, y+50]])
        poly = patches.Polygon(pts, closed=True, facecolor=color, edgecolor=CYAN, alpha=alpha, lw=2)
        ax.add_patch(poly)
        ax.text(500, y+25, label, ha='center', va='center', color=TEXT_MAIN, fontweight='bold', fontsize=12)
        return pts

    slab_bottom = draw_slab(100, SURFACE_COLOR, "PHYSICAL CAR — Steering Wheel, Controls", 1.0)
    slab_middle = draw_slab(200, CYAN, "MR PASSTHROUGH VISOR — Video Feed", 0.3)
    slab_top = draw_slab(300, PURPLE, "SPATIAL ANCHORS — Digital Overlays", 0.4)

    # Connecting lines
    for px in [300, 500, 700]:
        ax.plot([px, px+50], [125, 225], color=CYAN, ls='--', alpha=0.4)
        ax.plot([px+50, px+100], [225, 325], color=CYAN, ls='--', alpha=0.4)
        ax.scatter([px, px+50, px+100], [125, 225, 325], color=CYAN, s=20)

    # Anchor icon
    ax.text(750, 420, "NO SIMULATION\nREQUIRED", color=CYAN, fontweight='bold', ha='right')
    
    plt.savefig('showroom_pivot_viz.png', dpi=150, bbox_inches='tight', facecolor=fig.get_facecolor())
    plt.close()

def generate_constraints_viz():
    print("Generating constraints_viz.png...")
    fig, ax = setup_fig(1400, 500, dpi=150)
    
    # Spider Chart
    categories = ["GLARE INTERFERENCE", "BATTERY DRAIN", "SALES FRICTION", "SENSORY CONFLICT"]
    N = len(categories)
    angles = np.linspace(0, 2*np.pi, N, endpoint=False).tolist()
    angles += angles[:1] # close the loop
    
    # Center 700, 250
    cx, cy = 700, 250
    r_max = 200
    
    # Grid lines
    for r in [50, 100, 150, 200]:
        pts = [(cx + r*np.cos(a), cy + r*np.sin(a)) for a in angles]
        ax.plot([p[0] for p in pts], [p[1] for p in pts], color=TEXT_MUTED, alpha=0.1)

    # Data
    current = [0.9, 0.8, 0.7, 0.85]
    target = [0.3, 0.2, 0.4, 0.3]
    
    current += current[:1]
    target += target[:1]
    
    def get_pts(data):
        return [(cx + d*r_max*np.cos(a), cy + d*r_max*np.sin(a)) for d, a in zip(data, angles)]

    curr_pts = get_pts(current)
    targ_pts = get_pts(target)
    
    ax.fill([p[0] for p in curr_pts], [p[1] for p in curr_pts], color=RED, alpha=0.3, label="CURRENT STATE")
    ax.plot([p[0] for p in curr_pts], [p[1] for p in curr_pts], color=RED, lw=2)
    
    ax.fill([p[0] for p in targ_pts], [p[1] for p in targ_pts], color=CYAN, alpha=0.3, label="MANAGED STATE")
    ax.plot([p[0] for p in targ_pts], [p[1] for p in targ_pts], color=CYAN, lw=2)

    # Labels and icons
    icons = ["☀", "🔋", "👤", "🧠"]
    for i, (label, angle) in enumerate(zip(categories, angles)):
        lx, ly = cx + 240*np.cos(angle), cy + 240*np.sin(angle)
        ax.text(lx, ly, f"{icons[i]}\n{label}", ha='center', va='center', fontweight='bold', fontsize=10)

    # Legend
    ax.text(100, 450, "CURRENT STATE", color=RED, fontweight='bold')
    ax.text(100, 420, "MANAGED STATE", color=CYAN, fontweight='bold')

    plt.savefig('constraints_viz.png', dpi=150, bbox_inches='tight', facecolor=fig.get_facecolor())
    plt.close()

def generate_conclusion_viz():
    print("Generating conclusion_viz.png...")
    fig, ax = setup_fig(1600, 900, dpi=150)
    
    # Dividing line
    ax.plot([800, 800], [100, 800], color=CYAN, lw=2, alpha=0.6)
    ax.text(800, 450, "MR INTERVENTION POINT", color=CYAN, rotation=90, ha='center', va='center', fontsize=14, backgroundcolor=BG_COLOR)

    # Left Half - Confidence
    ax.text(400, 850, "CONFIDENCE — FOR USERS", color=CYAN, ha='center', fontweight='black', fontsize=20)
    x = np.linspace(50, 750, 100)
    y = 150 + 500 * (1 - np.exp(-(x-50)/300))
    ax.plot(x, y, color=CYAN, lw=4)
    add_glow(ax.lines[-1], CYAN)
    
    milestones = [
        (100, "First Touch"), (300, "Feature Discovery"), 
        (550, "MR Session"), (700, "Purchase Decision")
    ]
    for mx, label in milestones:
        my = 150 + 500 * (1 - np.exp(-(mx-50)/300))
        ax.scatter(mx, my, color=CYAN, s=100)
        ax.text(mx, my+30, label, ha='center', color=TEXT_MAIN, fontsize=10)

    # Right Half - Conversion
    ax.text(1200, 850, "CONVERSION — FOR BUSINESS", color=PURPLE, ha='center', fontweight='black', fontsize=20)
    bar_x = [900, 1050, 1200, 1350]
    bar_h = [200, 350, 500, 650]
    labels = ["Q1 (40%)", "Q2 (55%)", "Q3 (70%)", "Q4 (88%)"]
    
    for bx, bh, bl in zip(bar_x, bar_h, labels):
        ax.add_patch(patches.Rectangle((bx, 150), 100, bh, facecolor=PURPLE, alpha=0.7))
        ax.text(bx+50, 150 + bh + 20, bl, ha='center', color=TEXT_MAIN, fontweight='bold')
        if bh == 650: # Target
            circle = plt.Circle((bx+50, 150+bh), 30, color=CYAN, fill=False, lw=3)
            ax.add_patch(circle)
            add_glow(circle, CYAN)

    plt.savefig('conclusion_viz.png', dpi=150, bbox_inches='tight', facecolor=fig.get_facecolor())
    plt.close()

if __name__ == "__main__":
    generate_title_viz()
    generate_ux_deficit_viz()
    generate_simulator_hurdle_viz()
    generate_showroom_pivot_viz()
    generate_constraints_viz()
    generate_conclusion_viz()
    print("All refined visuals generated successfully.")
