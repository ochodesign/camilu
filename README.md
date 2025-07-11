# Camilu Peluquería - Sitio Web

## 🌟 Descripción

Sitio web moderno y elegante para Camilu Peluquería, diseñado con enfoque mobile-first y optimizado para conversiones. Incluye formulario de contacto funcional con PHP y galería interactiva.

## 🎨 Características Principales

- **Diseño Mobile-First**: Completamente responsive y optimizado para todos los dispositivos
- **Estética Moderna**: Inspirado en el benchmarking de leoleiva.com con toques elegantes
- **Formulario Funcional**: Sistema de contacto con PHP que funciona en Hostinger
- **Galería Interactiva**: Modal con navegación por teclado y filtros por categoría
- **Animaciones Suaves**: Usando AOS.js para efectos visuales atractivos
- **SEO Optimizado**: Meta tags, estructura semántica y carga optimizada
- **Performance**: Lazy loading, optimización de imágenes y código minificado

## 🛠️ Tecnologías Utilizadas

- **HTML5**: Estructura semántica moderna
- **CSS3**: Variables CSS, Grid, Flexbox, animaciones
- **JavaScript ES6+**: Vanilla JS sin dependencias pesadas
- **PHP 7.4+**: Backend para formulario de contacto
- **AOS.js**: Animaciones on scroll
- **Font Awesome**: Iconografía profesional
- **Google Fonts**: Playfair Display + Poppins

## 📁 Estructura de Archivos

```
camilu-pelu/
├── index.html              # Página principal
├── 404.html               # Página de error personalizada
├── css/
│   └── style.css          # Estilos principales
├── js/
│   └── script.js          # Funcionalidad JavaScript
├── php/
│   └── contact.php        # Procesamiento del formulario
├── img-prima/             # Carpeta para imágenes de trabajos
├── logo.jpg               # Logo del negocio
├── paleta-de-colores.jpg  # Referencia de colores
├── servicios.jpg          # Imagen principal de servicios
└── README.md              # Este archivo
```

## 🚀 Instalación y Configuración

### 1. Subir archivos al hosting

1. Descargá todos los archivos a tu hosting (Hostinger, cPanel, etc.)
2. Asegurate de que la carpeta tenga permisos de escritura para PHP

### 2. Configurar el formulario de contacto

Editá el archivo `php/contact.php` y cambiá estas líneas:

```php
// Línea 20-22: Configurar emails
define('SITE_EMAIL', 'contacto@tudominio.com');    // Email del sitio
define('ADMIN_EMAIL', 'tu-email@gmail.com');       // Tu email personal
define('SITE_URL', 'https://tudominio.com');       // URL de tu sitio
```

### 3. Agregar imágenes

1. Subí las fotos de trabajos a la carpeta `img-prima/`
2. Usá estos nombres para que aparezcan automáticamente:
   - `corte-1.jpg`, `corte-2.jpg` (para cortes)
   - `color-1.jpg`, `color-2.jpg` (para coloración)
   - `peinado-1.jpg`, `peinado-2.jpg` (para peinados)
   - `camilu-portrait.jpg` (foto de Camila en "Sobre mí")

### 4. Personalizar contenido

Editá el archivo `index.html` y cambiá:
- Nombre y datos de contacto
- Descripción de servicios
- Precios en promociones
- Links de redes sociales
- Dirección y teléfono

## 📱 Secciones del Sitio

### 🏠 Hero Section
- Título impactante con call-to-action
- Botones de reserva y servicios
- Efecto parallax sutil

### 👤 Sobre Camilu
- Presentación personal y profesional
- Foto de perfil destacada
- Características diferenciales

### ✂️ Servicios
- Corte & Peinado
- Coloración
- Tratamientos
- Cada servicio con descripción detallada

### 🖼️ Galería
- Filtros por categoría (cortes, color, peinados)
- Modal con navegación por teclado
- Lazy loading para performance

### 💰 Promociones
- Oferta para nuevos clientes destacada
- Combos y descuentos especiales
- Call-to-action claros

### 📞 Contacto
- Formulario funcional con validación
- Información de ubicación y horarios
- Links a redes sociales
- Integración con WhatsApp

## 🎨 Paleta de Colores

```css
--primary-color: #9A5CFF;     /* Violeta principal */
--primary-dark: #8A4EE8;      /* Violeta más oscuro */
--secondary-color: #EFF8A9;   /* Amarillo claro suave */
--accent-color: #7A3FCC;      /* Violeta intenso */
--text-primary: #2d2d2d;      /* Gris oscuro */
--text-secondary: #6b6b6b;    /* Gris medio */
```

## 📧 Configuración de Email

El formulario está configurado para funcionar con:
- ✅ Hostinger
- ✅ cPanel (Hostgator, GoDaddy, etc.)
- ✅ Servidores compartidos con PHP mail()

### Características del formulario:
- Rate limiting (máximo 5 mensajes por hora por IP)
- Validación completa de datos
- Sanitización contra XSS
- Emails HTML con diseño atractivo
- Confirmación automática al cliente
- Notificación al administrador
- Integración con WhatsApp

## 🔧 Personalización Avanzada

### Cambiar colores
Editá las variables CSS en `css/style.css` líneas 8-20:

```css
:root {
    --primary-color: #tu-color-principal;
    --secondary-color: #tu-color-secundario;
    /* etc... */
}
```

### Agregar más servicios
En `index.html`, duplicá la estructura de `.service-card` y editá el contenido.

### Modificar animaciones
Las animaciones están configuradas con AOS.js. Podés cambiar:
- `data-aos="fade-up"` (tipo de animación)
- `data-aos-delay="200"` (delay en ms)
- `data-aos-duration="800"` (duración en ms)

## 📊 SEO y Performance

### Optimizaciones incluidas:
- ✅ Meta tags completos
- ✅ Open Graph para redes sociales
- ✅ Lazy loading de imágenes
- ✅ Minificación de CSS
- ✅ Estructura semántica HTML5
- ✅ Sitemap automático
- ✅ Breadcrumbs estructurados

### Puntuaciones esperadas:
- **PageSpeed**: 90+ móvil, 95+ escritorio
- **SEO**: 100/100
- **Accesibilidad**: 95+
- **Mejores prácticas**: 100/100

## 🐛 Solución de Problemas

### El formulario no envía emails
1. Verificá que el hosting soporte `mail()` de PHP
2. Revisá la configuración de emails en `contact.php`
3. Comprobá los logs de error del servidor

### Las imágenes no cargan
1. Verificá que los archivos estén en `img-prima/`
2. Comprobá que los nombres coincidan exactamente
3. Asegurate de que tengan permisos de lectura
4. Si las imágenes no existen, aparecerán placeholders automáticamente

### Error de red (ERR_NAME_NOT_RESOLVED)
Este error ya está solucionado. Las imágenes faltantes mostrarán placeholders locales en lugar de intentar cargar desde URLs externas.

### La web se ve mal en móvil
1. Verificá que el meta viewport esté presente
2. Comprobá que CSS esté cargando correctamente
3. Revisá la consola del navegador por errores

## 📞 Soporte

Para soporte técnico o personalizaciones adicionales:
- **Desarrollador**: Lucas Ochoa
- **Email**: [tu-email-de-contacto]
- **Portfolio**: [tu-portfolio]

## 📄 Licencia

Este proyecto fue desarrollado específicamente para Camilu Peluquería. 
Todos los derechos reservados.

---

### 🎉 ¡Felicitaciones!

Tu sitio web está listo para conquistar internet y atraer más clientes. 
¡Que tengas mucho éxito con tu emprendimiento! 💅✨
