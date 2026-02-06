App link: ```https://dailytuki.netlify.app/ ```
# Daily Tuki 

Daily Tuki es una app web minimalista para cumplir **objetivos diarios simples** y mantener una **racha (streak)** de progreso.

Está pensada para días donde cuesta arrancar: micro-objetivos, feedback positivo y progreso visible, sin presión ni castigos.

---

## ✨ ¿Qué hace?

- Crear objetivos diarios (ej: “salir 10 min”, “tomar agua”, “mandar 1 CV”)
- Checklist de objetivos del día
- Marcar objetivos como completados
- Ver progreso diario en porcentaje
- Mantener racha de días cumplidos
- Guardar datos en localStorage (sin backend)

---

## 🎯 Regla de racha

Un día cuenta como completado si se cumplen **al menos 2 de 3 objetivos**.

Esto evita presión extrema y promueve consistencia.

---

## 🧩 MVP (Primera versión)

- [ ] Crear objetivos
- [ ] Editar/eliminar objetivos
- [ ] Checklist diario
- [ ] Progreso del día (%)
- [ ] Streak de días cumplidos
- [ ] Persistencia en localStorage
- [ ] Reinicio diario automático

---

## 🛠️ Stack

- React + Vite
- localStorage
- CSS / Tailwind (a definir)

---

## 🚀 Cómo correr el proyecto

```bash
npm install
npm run dev
```
---
## 🛠️ Simulacion de dias por consola
```bash
// Crear 3 tareas, completar 2, verificar streak = 1
__devSkipDay()    // avanzar un día
// Recargar → debería mostrar "nuevo día", tareas de ayer abajo
// Crear 3 tareas nuevas, completar 2 → streak = 2
__devSkipDay(2)   // saltar 2 días (rompe racha)
// Recargar → streak = 0, día limpio
__devResetDate()  // volver a fecha real
