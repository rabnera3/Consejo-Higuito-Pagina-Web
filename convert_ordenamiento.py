from PIL import Image
import os

source = r'c:\Users\rabne\OneDrive\Escritorio\Respaldo\Laptop\Consejo Higuito\Pagina Web\Consejo-Higuito-Pagina-Web\imagenes_consejohiguito\unidad-ordenamiento-territorial'
target = r'c:\Users\rabne\OneDrive\Escritorio\Respaldo\Laptop\Consejo Higuito\Pagina Web\Consejo-Higuito-Pagina-Web\Frontend\src\img\unidades\ordenamiento'

# Get all JPG files (_1 versions or files without _digit suffix)
files = []
for f in os.listdir(source):
    if f.endswith('.jpg'):
        # Include files ending with _1.jpg
        if '_1.jpg' in f:
            files.append(f)
        # Include files without any _digit.jpg pattern (like uni_orde_terr_17.jpg)
        elif not any(f.endswith(f'_{i}.jpg') for i in range(10)):
            files.append(f)

converted = 0
for f in sorted(files):
    webp_name = f.replace('.jpg', '.webp')
    source_path = os.path.join(source, f)
    target_path = os.path.join(target, webp_name)
    
    if not os.path.exists(target_path):
        img = Image.open(source_path)
        img.save(target_path, 'WEBP', quality=82)
        print(f'✓ Converted: {webp_name}')
        converted += 1
    else:
        print(f'  Exists: {webp_name}')

print(f'\nConverted: {converted}')
print(f'Total WebP files: {len([f for f in os.listdir(target) if f.endswith(".webp")])}')
