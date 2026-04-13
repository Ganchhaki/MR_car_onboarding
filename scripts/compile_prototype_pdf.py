import os
import re
from PIL import Image

def compile_pdf():
    image_dir = r"C:\Users\Coder\Downloads\onboarding_experience\prototype"
    output_pdf = r"C:\Users\Coder\Downloads\onboarding_experience\prototype_presentation.pdf"

    if not os.path.exists(image_dir):
        print(f"Directory not found: {image_dir}")
        return

    # Find all images
    files = [f for f in os.listdir(image_dir) if f.lower().endswith(('.png', '.jpg', '.jpeg'))]

    # Sorting function: extract number from "Slide 16_9 - X.png"
    def extract_number(filename):
        try:
            # Get the part after the last " - " and before ".png"
            name_no_ext = os.path.splitext(filename)[0]
            if " - " in name_no_ext:
                num_str = name_no_ext.split(" - ")[-1]
                return float(num_str)
        except Exception:
            pass
        return 0.0

    files.sort(key=extract_number)
    
    print("Sequence to be compiled:")
    for f in files:
        print(f" - {f} (Value: {extract_number(f)})")

    images = []
    for f in files:
        path = os.path.join(image_dir, f)
        try:
            img = Image.open(path).convert('RGB')
            images.append(img)
        except Exception as e:
            print(f"Error opening {f}: {e}")

    if images:
        images[0].save(output_pdf, "PDF", save_all=True, append_images=images[1:])
        print(f"\nSuccessfully compiled {len(images)} images to {output_pdf}")
    else:
        print("No images found to compile.")

if __name__ == "__main__":
    compile_pdf()
