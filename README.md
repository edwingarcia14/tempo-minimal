# Tempo ⏱️ | Cronómetro Minimalista

**Tempo** es un cronómetro minimalista de alta precisión, diseñado para profesionales que buscan un flujo de trabajo enfocado y sin distracciones. La simplicidad se une a la robustez técnica.

## 🚀 Tecnologías
* **HTML5:** Estructura semántica orientada a la accesibilidad.
* **CSS3:** Diseño responsivo, variables CSS, animaciones fluidas y efectos de luz.
* **JavaScript (ES6+):** Lógica de estado centralizada, manipulación del DOM y gestión eficiente de eventos.

## ✨ Características Principales
* **Precisión:** Cálculos de tiempo basados en `Date.now()` para una exactitud milimétrica.
* **Minimalismo Visual:** Interfaz limpia con efectos de sombra y animaciones circulares.
* **UX Fluida:** Interacción intuitiva con transiciones suaves y estados visuales claros (Play/Pause/Stop).
* **Arquitectura Robusta:** Código modular basado en la separación de intereses (Lógica vs. Vista).

## 🛠️ Estructura del Proyecto
```text
tempo/
├── assets/
│   └── icons/
│       └── favicon.png
├── css/
│   └── style.css       # Estilos, animaciones y diseño responsivo
├── js/
│   └── scripts.js      # Lógica del cronómetro y gestión de estado
├── index.html          # Estructura principal
├── LICENSE             # Licencia del proyecto (MIT)
└── README.md           # Documentación del proyecto
```
## 🧠 Lógica y Aprendizajes

Este proyecto fue un ejercicio de **Ingeniería de Software aplicado al Frontend**, destacando:

* **State Management:** Implementación de un objeto de estado para centralizar la lógica de la aplicación.
* **Separación de Responsabilidades:** Lógica de cálculo independiente de la actualización del DOM (`updateDisplay`).
* **CSS Avanzado:** Uso de `::before` y `::after` para crear iconos dinámicos sin necesidad de imágenes.
* **Optimización de Rendimiento:** Uso de `setInterval` y limpieza correcta de intervalos (`clearInterval`).

## 📝 Licencia

Este proyecto está bajo la Licencia MIT. Consulta el archivo [LICENSE](LICENSE) para más detalles.

---
*Creado por Edwin García | 2026*
