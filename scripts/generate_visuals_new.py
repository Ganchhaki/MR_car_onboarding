import matplotlib.pyplot as plt
import matplotlib.patches as patches
import numpy as np
import random

def setup_dark_theme(ax, fig):
    fig.patch.set_facecolor('#0a0a0c')
    ax.set_facecolor('#0a0a0c')
    ax.set_xticks([])
    ax.set_yticks([])
    for spine in ax.spines.values():
        spine.set_visible(False)

def generate_ux_deficit():
    fig, ax = plt.subplots(figsize=(16, 9), dpi=300)
    setup_dark_theme(ax, fig)
    
    # Left Side: Chaotic Web
    num_nodes = 70
    x_chaos = np.random.uniform(0.1, 0.45, num_nodes)
    y_chaos = np.random.uniform(0.2, 0.8, num_nodes)
    
    for i in range(num_nodes):
        for j in range(i + 1, num_nodes):
            if random.random() < 0.1:
                ax.plot([x_chaos[i], x_chaos[j]], [y_chaos[i], y_chaos[j]], 
                        color='#7000ff', alpha=0.1, linewidth=0.5)
    
    ax.scatter(x_chaos, y_chaos, color='#7000ff', s=5, alpha=0.3)
    ax.text(0.27, 0.15, 'Traditional: High Friction', color='#e0e0e6', 
            ha='center', fontsize=18, fontweight='bold', family='sans-serif')
    
    # Right Side: Clean Curve
    x_clean = np.linspace(0.55, 0.9, 100)
    y_clean = 0.5 + 0.2 * np.sin((x_clean - 0.55) * 5)
    # Simple smooth curve instead of sine
    x_clean = np.linspace(0.55, 0.9, 100)
    y_clean = 0.3 + 0.4 * (x_clean - 0.55) / 0.35
    
    # Glowing effect
    for w in range(10, 0, -2):
        ax.plot(x_clean, y_clean, color='#00f2ff', alpha=0.1, linewidth=w)
    ax.plot(x_clean, y_clean, color='#00f2ff', linewidth=3)
    
    ax.text(0.72, 0.15, 'MR: Intuitive Flow', color='#e0e0e6', 
            ha='center', fontsize=18, fontweight='bold', family='sans-serif')
    
    plt.tight_layout()
    plt.savefig('ux_deficit_viz.png', facecolor=fig.get_facecolor(), bbox_inches='tight', pad_inches=0)
    plt.close()

def generate_simulator_hurdle():
    fig, ax = plt.subplots(figsize=(16, 9), dpi=300)
    setup_dark_theme(ax, fig)
    ax.set_xlim(0, 16)
    ax.set_ylim(0, 9)
    
    # Blocks
    box_props_vr = dict(boxstyle='round,pad=1', facecolor='none', edgecolor='#7000ff', linewidth=3)
    ax.text(4, 4.5, 'VR Game Engine', color='#e0e0e6', ha='center', va='center', fontsize=20, bbox=box_props_vr)
    
    box_props_os = dict(boxstyle='round,pad=1', facecolor='none', edgecolor='#00f2ff', linewidth=3)
    ax.text(12, 4.5, 'Embedded Car OS', color='#e0e0e6', ha='center', va='center', fontsize=20, bbox=box_props_os)
    
    # Data Pipeline with shatter
    # Left part
    ax.plot([6, 7.5], [4.5, 4.5], color='#e0e0e6', linewidth=4, alpha=0.6)
    # Right part
    ax.plot([8.5, 10], [4.5, 4.5], color='#e0e0e6', linewidth=4, alpha=0.6)
    
    # Shatter effect in middle
    shatter_x = [7.5, 7.7, 7.5, 8.0, 8.3, 8.5, 8.2, 8.5]
    shatter_y = [4.5, 4.8, 4.2, 4.7, 4.3, 4.5, 4.2, 4.5]
    ax.plot(shatter_x, shatter_y, color='#ff4444', linewidth=3)
    
    ax.text(8, 5.5, 'OTA Update /\nPhysics Mismatch', color='#ff4444', 
            ha='center', va='center', fontsize=16, fontweight='bold')
    
    plt.savefig('simulator_hurdle_viz.png', facecolor=fig.get_facecolor(), bbox_inches='tight', pad_inches=0)
    plt.close()

def generate_showroom_pivot():
    fig, ax = plt.subplots(figsize=(16, 9), dpi=300)
    setup_dark_theme(ax, fig)
    ax.set_xlim(0, 16)
    ax.set_ylim(0, 9)
    
    # Concentric rings (LiDAR style)
    center_x, center_y = 8, 4.5
    for r in np.linspace(1, 4, 6):
        circle = plt.Circle((center_x, center_y), r, color='#00f2ff', fill=False, alpha=0.1, linewidth=1)
        ax.add_patch(circle)
        
    # Wireframe grid
    for i in range(17):
        ax.plot([i, i], [0, 9], color='#ffffff', alpha=0.03, linewidth=0.5)
    for j in range(10):
        ax.plot([0, 16], [j, j], color='#ffffff', alpha=0.03, linewidth=0.5)
        
    # Spatial anchors (Markers)
    anchor_points = [(5, 6), (11, 3), (6, 2), (10, 7), (4, 4)]
    x_p, y_p = zip(*anchor_points)
    ax.scatter(x_p, y_p, color='#7000ff', marker='D', s=100, edgecolors='white', linewidth=1, zorder=5)
    
    # Connect some with dashed lines
    ax.plot([5, 11], [6, 3], color='#7000ff', linestyle='--', alpha=0.4, linewidth=1)
    ax.plot([6, 10], [2, 7], color='#7000ff', linestyle='--', alpha=0.4, linewidth=1)
    
    # Tooltips (stylized)
    for px, py in anchor_points:
        rect = patches.Rectangle((px+0.2, py+0.2), 2, 0.8, linewidth=1, edgecolor='#00f2ff', facecolor='#16161a', alpha=0.8)
        ax.add_patch(rect)
        ax.text(px+1.2, py+0.6, 'ANCHOR DATA', color='#00f2ff', ha='center', va='center', fontsize=8, fontweight='bold')

    plt.savefig('showroom_pivot_viz.png', facecolor=fig.get_facecolor(), bbox_inches='tight', pad_inches=0)
    plt.close()

def generate_title_viz():
    fig, ax = plt.subplots(figsize=(16, 9), dpi=300)
    setup_dark_theme(ax, fig)
    ax.set_xlim(0, 16)
    ax.set_ylim(0, 9)
    
    # Abstract car silhouette or futuristic lines
    x = np.linspace(2, 14, 200)
    y = 3 + 1.5 * np.exp(-(x-8)**2 / 10) + 0.5 * np.sin(x)
    
    # Glow effect
    for w in range(20, 0, -2):
        ax.plot(x, y, color='#00f2ff', alpha=0.05, linewidth=w)
    ax.plot(x, y, color='#00f2ff', linewidth=2, alpha=0.6)
    
    # Lower lines
    y2 = 2.5 + 1.2 * np.exp(-(x-8)**2 / 12)
    ax.plot(x, y2, color='#7000ff', alpha=0.3, linewidth=1)
    
    # Particle field
    px = np.random.uniform(0, 16, 200)
    py = np.random.uniform(0, 9, 200)
    ax.scatter(px, py, color='white', s=1, alpha=0.2)
    
    plt.savefig('title_viz.png', facecolor=fig.get_facecolor(), bbox_inches='tight', pad_inches=0)
    plt.close()

if __name__ == "__main__":
    generate_title_viz()
    generate_ux_deficit()
    generate_simulator_hurdle()
    generate_showroom_pivot()
    print("Visuals generated successfully.")
