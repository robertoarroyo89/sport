# Trackout · Seguimiento de entrenamientos (Mobile-First)

WebApp móvil para planificar y registrar entrenamientos de gimnasio y cardio.
Sin backend ni base de datos: **todo se guarda en `localStorage`** y puedes
exportar/importar una copia de seguridad en JSON.

## Stack

- **React 18** + **Vite**
- **Tailwind CSS** (tema oscuro personalizado)
- **lucide-react** (iconos)

## Puesta en marcha

```bash
npm install
npm run dev      # arranca el servidor de desarrollo
npm run build    # genera la build de producción en /dist
npm run preview  # sirve la build de producción
```

Abre la URL que indique Vite (por defecto `http://localhost:5173`).
Para verla como móvil, usa las DevTools del navegador en modo responsive.

## Estructura

```
workout-tracker/
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
└── src/
    ├── main.jsx                 # entrada de React
    ├── App.jsx                  # shell + navegación por pestañas
    ├── index.css                # Tailwind + fuentes + tema
    ├── constants/
    │   └── config.js            # splits, ejercicios, tipos de cardio, constantes
    ├── context/
    │   └── WorkoutContext.jsx   # estado global + persistencia + acciones
    ├── utils/
    │   ├── date.js              # semana (Lunes=0), formatos, saludos
    │   ├── plan.js              # generación del plan semanal
    │   ├── progression.js       # sobrecarga progresiva del cardio (+10%)
    │   └── storage.js           # localStorage + exportar/importar JSON
    ├── components/
    │   ├── BottomNav.jsx        # barra inferior (4 pestañas)
    │   ├── ProgressBar.jsx      # barra de progreso
    │   ├── SessionCard.jsx      # tarjeta de sesión (gym/cardio)
    │   └── icons.js             # mapeo de iconos de cardio
    └── screens/
        ├── Onboarding.jsx       # cuestionario inicial
        ├── Dashboard.jsx        # Inicio
        ├── WeekView.jsx         # Semana + Cerrar semana
        ├── Stats.jsx            # Progreso / historial
        └── Profile.jsx          # Perfil + copia de seguridad + reset
```

## Lógica de progresión

- **Cardio:** al pulsar **"Cerrar semana"**, por cada tipo de cardio cuyas
  sesiones estén todas completadas, su objetivo (minutos / km / series) sube
  un **10%** para la semana siguiente. Si no se completó, se mantiene.
- **Gimnasio:** no escala numéricamente. Muestra el foco muscular del día y
  3-4 ejercicios sugeridos; el usuario solo marca la sesión como completada.

## Modelo de datos (localStorage → clave `trackout:state:v1`)

```jsonc
{
  "profile": {
    "name": "Rober",
    "gymDays": 3,
    "splitId": "ppl",
    "cardio": {
      "cycling": { "enabled": true,  "value": 30 },
      "zone2":   { "enabled": true,  "value": 30 },
      "hills":   { "enabled": false, "value": 6  },
      "longRun": { "enabled": false, "value": 8  }
    }
  },
  "week": {
    "number": 1,
    "startDate": "2026-06-01",
    "sessions": [
      { "id": "w1-s0", "day": 0, "type": "gym",
        "focus": "Empuje", "exercises": ["..."], "completed": false },
      { "id": "w1-s1", "day": 1, "type": "cardio",
        "cardioKey": "cycling", "target": 30, "unit": "min", "completed": false }
    ]
  },
  "history": [ /* semanas cerradas con su resumen y progresión */ ]
}
```
