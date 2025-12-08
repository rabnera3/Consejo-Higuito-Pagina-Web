# Guía para Insertar 3 Blogs de la Unidad SAN

## ⚠️ NOTA IMPORTANTE

El error anterior (`#1054 - La columna 'content' en field list es desconocida`) ha sido corregido.

**Cambios aplicados:**
- ✅ La columna se llama `body` (no `content`)
- ✅ Se agregó la columna `slug` requerida
- ✅ Las columnas `category` y `tags` se crean automáticamente si no existen

## Blogs a Insertar

### Blog 1: Diversificación Productiva
- **Título**: Diversificación Productiva: Estrategia de Seguridad Alimentaria
- **Categoría**: Seguridad Alimentaria
- **Imagen**: blog1
- **Fecha**: 2019-12-05
- **Tags**: diversificación, agricultura, seguridad alimentaria, cultivos

**Contenido**:
La diversificación productiva constituye un cambio estratégico en la estructura agrícola regional, transicionando de la dependencia de un único cultivo hacia un modelo de producción múltiple y sostenible. Este enfoque permite a las familias no solo satisfacer sus necesidades alimentarias locales, sino también generar excedentes destinados a comercialización, lo que se traduce en un retorno económico significativo para el núcleo familiar. A través de esta diversificación se fortalece la resiliencia agrícola, reduce riesgos asociados a fluctuaciones de precios y plagas, y contribuye a la seguridad alimentaria y nutricional de las comunidades.

**Extracto**:
Cambio de la dominancia regional de un solo cultivo a varios cultivos para consumo local y comercialización.

---

### Blog 2: Sistemas Agroforestales
- **Título**: Entrega de Material Vegetativo para Sistemas Agroforestales
- **Categoría**: Seguridad Alimentaria
- **Imagen**: blog2
- **Fecha**: 2019-10-28
- **Tags**: agroforestería, fruticultura, seguridad alimentaria, desarrollo sostenible

**Contenido**:
En el marco de la iniciativa EUROSAN HIGUITO, con el apoyo financiero de la Unión Europea y el respaldo institucional de los Gobiernos Locales a través de la Unidad Municipal de Seguridad Alimentaria y Nutricional, se ha llevado a cabo la entrega de árboles frutales y material vegetativo de calidad fitosanitaria certificada. Esta acción busca fortalecer la implementación de sistemas agroforestales sostenibles, integrando la producción de frutas con cultivos tradicionales, mejorando la cobertura vegetal del territorio, incrementando la biodiversidad agrícola y generando fuentes adicionales de ingresos para las familias beneficiarias a través de la comercialización de productos de calidad.

**Extracto**:
Entrega de árboles frutales y material vegetativo para fortalecer sistemas agroforestales sostenibles.

---

### Blog 3: Granos Básicos
- **Título**: Programa de Apoyo a Productores de Granos Básicos en Municipios Vulnerables
- **Categoría**: Seguridad Alimentaria
- **Imagen**: blog3
- **Fecha**: 2019-12-05
- **Tags**: granos básicos, agricultura, pobreza, desarrollo rural, cooperación internacional

**Contenido**:
Dentro del marco del Convenio de Cooperación establecido entre CESAL, Fundación ETEA, Consejo Intermunicipal Higuito, CDE MIPYME y el Gobierno de Honduras, y financiado por la Agencia Española de Cooperación Internacional para el Desarrollo (AECID), se ha ejecutado el proyecto denominado "Impulso de la competitividad local para reducción de la pobreza en población vulnerable a través de cadenas de valor sostenibles e inclusivas". Como respuesta a los impactos de la pandemia COVID-19 en la economía local, se ha realizado la entrega de fertilizante de calidad agronómica a un total de 216 familias en condición de vulnerabilidad económica, dedicadas principalmente al cultivo de granos básicos en los municipios de Corquín, San Pedro y Cucuyagua. Esta acción contribuye al fortalecimiento de la producción agrícola local, la seguridad alimentaria y el mejoramiento de los ingresos familiares en territorios priorizados.

**Extracto**:
Entrega de fertilizante a 216 familias vulnerables productoras de granos básicos en occidente de Honduras.

---

## 🚀 Cómo Insertar en la Base de Datos

### Opción 1: Usar phpMyAdmin (RECOMENDADO)
1. Abre phpMyAdmin
2. Selecciona la base de datos del Consejo Higuito
3. Ve a la pestaña "SQL"
4. **Copia TODO el contenido del archivo** `Backend/database/migrations/012_insert_blogs_san_final.sql`
5. **Pega en el área de texto SQL**
6. Haz clic en el botón **"Ejecutar"** (abajo a la derecha)

El script se ejecutará y los 3 blogs se insertarán automáticamente.

### Opción 2: Usar línea de comandos MySQL
```bash
cd Backend/database/migrations
mysql -u usuario -p nombre_base_datos < 012_insert_blogs_san_final.sql
```

---

## ✅ Verificación Post-Inserción

Después de ejecutar el script, verifica que los blogs fueron insertados correctamente:

```sql
SELECT id, title, category, status, created_at 
FROM blog_posts 
WHERE category = 'Seguridad Alimentaria' 
AND created_at >= '2019-10-28'
ORDER BY created_at DESC;
```

**Deberías ver 3 registros:**
1. "Diversificación Productiva: Estrategia de Seguridad Alimentaria" (2019-12-05)
2. "Entrega de Material Vegetativo para Sistemas Agroforestales" (2019-10-28)
3. "Programa de Apoyo a Productores de Granos Básicos en Municipios Vulnerables" (2019-12-05)

---

## 📋 Campos Utilizados

| Campo | Valor |
|-------|-------|
| `title` | Título del blog |
| `slug` | URL amigable (generada automáticamente) |
| `excerpt` | Resumen corto visible en listados |
| `body` | Contenido completo del blog |
| `cover_image` | blog1, blog2 o blog3 (nombre del archivo) |
| `author_id` | 1 (usuario admin) |
| `status` | 'published' (visible públicamente) |
| `category` | 'Seguridad Alimentaria' |
| `tags` | Palabras clave separadas por comas |
| `created_at` | Fecha de creación original |
| `updated_at` | Fecha de última actualización |

---

## 📁 Archivos Relacionados

- **Script SQL**: `Backend/database/migrations/012_insert_blogs_san_final.sql`
- **Instrucciones**: `BLOGS_INSTRUCCIONES.md` (este archivo)
- **Imágenes**: Deben estar en `/Backend/uploads/` con nombres blog1, blog2, blog3

---

## 🐛 Troubleshooting

**Si ves error similar al anterior:**
- Revisa que estés usando el archivo **012_insert_blogs_san_final.sql** (versión corregida)
- Asegúrate de copiar TODO el contenido, incluyendo las líneas iniciales de ALTER TABLE

**Si el slug genera error de duplicado:**
- Elimina cualquier blog existente con slugs similares
- Los slugs se generan automáticamente del título

