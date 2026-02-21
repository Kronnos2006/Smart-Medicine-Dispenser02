# Smart Medicine Dispenser - Sistema IoT Inteligente

Este proyecto consiste en un sistema integral de dispensación de medicamentos diseñado para mejorar la adherencia al tratamiento médico mediante el uso de tecnologías IoT, análisis de datos con Inteligencia Artificial y una gestión robusta de la información.

## 👥 Integrantes del Equipo
1. [Nombre Integrante 1]
2. [Nombre Integrante 2]
3. [Nombre Integrante 3]
4. [Nombre Integrante 4]

## 📝 Descripción del Problema
El olvido o la administración incorrecta de medicamentos es un problema crítico de salud pública, especialmente en pacientes crónicos y adultos mayores. La falta de un sistema de monitoreo en tiempo real dificulta la supervisión por parte de familiares y médicos.

## 🎯 Objetivo del Proyecto
Diseñar e implementar un sistema IoT que automatice la dispensación de medicamentos, registre cada evento en una base de datos centralizada y utilice modelos de lenguaje (LLM) para analizar patrones de consumo y generar recomendaciones preventivas.

## 🛠️ Tecnologías Utilizadas

### Hardware
- **Microcontrolador:** Arduino (UNO/MEGA).
- **Sensores/Actuadores:** Servomotores (para la dispensación), Sensor ultrasónico (verificación de stock), Pantalla LCD.
- **Comunicación:** Serial (USB) hacia el Backend.

### Backend (Java)
- **Framework:** Spring Boot.
- **Base de Datos:** MySQL.
- **Paradigma:** Programación Orientada a Objetos (POO).
- **API:** RESTful para comunicación con el Dashboard y el LLM.

### Frontend (Dashboard Web)
- **Tecnologías:** React + Tailwind CSS (para una interfaz moderna y responsiva).
- **Gráficos:** Chart.js / Recharts.

### Inteligencia Artificial
- **Modelo:** Google Gemini API (Análisis de tendencias y recomendaciones).

## 📂 Estructura del Repositorio
- `/arduino`: Código fuente para el microcontrolador (.ino).
- `/backend-java`: Proyecto Spring Boot con la lógica de negocio y persistencia.
- `/src`: Código fuente del Dashboard Web (Frontend).
- `/docs`: Documentación adicional y diagramas.

## 🌿 Gestión de Ramas (GitFlow)
- `main`: Código estable y listo para producción.
- `develop`: Rama principal de desarrollo.
- `feature/*`: Ramas temporales para nuevas funcionalidades (ej: `feature/dispenser-logic`).

## 👥 Historias de Usuario (Backlog)

Para tu tablero de **GitHub Projects**, puedes usar estas historias:

1. **HU-01: Dispensación Automática**
   - *Como* paciente, *quiero* que el sistema entregue mi pastilla a la hora exacta *para* cumplir mi tratamiento sin errores.
2. **HU-02: Monitoreo de Stock**
   - *Como* cuidador, *quiero* ver cuánto medicamento queda en el dispositivo *para* comprar más antes de que se agote.
3. **HU-03: Historial Web**
   - *Como* familiar, *quiero* consultar una tabla con las dosis tomadas *para* verificar que el paciente se está medicando correctamente.
4. **HU-04: Análisis con IA**
   - *Como* médico, *quiero* un informe generado por IA sobre la adherencia del paciente *para* tomar decisiones clínicas informadas.

## 📅 Planificación (Issues de GitHub)

He dividido el trabajo en 4 hitos (Milestones) que puedes crear en GitHub:

### Hito 1: Cimientos y Diseño (Semanas 1-3)
- [ ] Crear documento de licitación de requerimientos.
- [ ] Configurar repositorio y estructura de carpetas.
- [ ] Diseñar diagrama de arquitectura del sistema.

### Hito 2: Hardware y Conectividad (Semanas 4-5)
- [ ] Programar lógica del servomotor en Arduino.
- [ ] Implementar lectura del sensor ultrasónico para stock.
- [ ] Establecer comunicación Serial entre Arduino y Java.

### Hito 3: Cerebro del Sistema (Semanas 6-7)
- [ ] Crear API REST con Spring Boot.
- [ ] Configurar base de datos MySQL y persistencia (JPA).
- [ ] Implementar endpoints para recibir datos de sensores.

### Hito 4: Interfaz y Cerebro IA (Semanas 8-10)
- [ ] Desarrollar Dashboard web con React y Tailwind.
- [ ] Integrar gráficas de consumo (Chart.js/Recharts).
- [ ] Conectar con la API de Gemini para análisis de datos.

## 🚀 Requerimientos Funcionales
1. Programación de horarios de dispensación.
2. Registro automático de cada dosis entregada.
3. Visualización de historial en el dashboard.
4. Generación de alertas por bajo stock de medicamentos.
5. Análisis inteligente de adherencia mediante Gemini.

## 📋 Requerimientos No Funcionales
1. Interfaz intuitiva para usuarios no técnicos.
2. Tiempo de respuesta del servidor menor a 2 segundos.
3. Seguridad en el manejo de datos del paciente.
4. Escalabilidad para soportar múltiples dispensadores.

---
*Proyecto desarrollado para el curso de Informática 2 - Mecatrónica.*
