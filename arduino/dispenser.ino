#include <Servo.h>
#include <Stepper.h>

/**
 * PROYECTO: Smart Medicine Dispenser
 * DESCRIPCIÓN: Control de dispensación basado en diagnóstico de síntomas.
 * HARDWARE: Arduino UNO/MEGA, Motor Paso a Paso, Servomotor, LCD, Matriz LED.
 */

// Configuración Motor Paso a Paso (Carrusel de 3 pastillas)
const int stepsPerRevolution = 2048; 
Stepper myStepper(stepsPerRevolution, 8, 10, 9, 11);

// Configuración Servomotor (Empujador)
Servo dispenserServo;
const int servoPin = 12;

// Configuración de Síntomas
const int totalPreguntas = 25;
bool respuestas[totalPreguntas];
int preguntaActual = 0;

// Estados del Sistema
enum Estado { STANDBY, DIAGNOSTICANDO, DISPENSANDO, ERROR };
Estado estadoActual = STANDBY;

void setup() {
  Serial.begin(9600);
  dispenserServo.attach(servoPin);
  dispenserServo.write(0);
  myStepper.setSpeed(10);
  
  Serial.println("{\"status\": \"ready\", \"msg\": \"Sistema de Diagnóstico Iniciado\"}");
}

void loop() {
  switch (estadoActual) {
    case STANDBY:
      // Esperar a que el usuario inicie con un botón (simulado por Serial)
      if (Serial.available() > 0) {
        char cmd = Serial.read();
        if (cmd == 'S') iniciarDiagnostico();
      }
      break;

    case DIAGNOSTICANDO:
      // Lógica de preguntas (Simulada por Serial: 'Y' para Sí, 'N' para No)
      if (Serial.available() > 0) {
        char resp = Serial.read();
        if (resp == 'Y' || resp == 'N') {
          respuestas[preguntaActual] = (resp == 'Y');
          preguntaActual++;
          
          if (preguntaActual >= totalPreguntas) {
            finalizarDiagnostico();
          } else {
            Serial.print("{\"pregunta\": ");
            Serial.print(preguntaActual);
            Serial.println("}");
          }
        }
      }
      break;

    case DISPENSANDO:
      ejecutarDispensacion(1); // Ejemplo: pastilla 1
      estadoActual = STANDBY;
      break;
  }
}

void iniciarDiagnostico() {
  preguntaActual = 0;
  estadoActual = DIAGNOSTICANDO;
  Serial.println("{\"event\": \"inicio_diagnostico\"}");
}

void finalizarDiagnostico() {
  // Lógica simplificada de diagnóstico (3 enfermedades)
  int score = 0;
  for(int i=0; i<totalPreguntas; i++) if(respuestas[i]) score++;
  
  String diagnostico = "Gripe Común";
  int pastilla = 1;
  
  if (score > 15) {
    diagnostico = "Infección Severa";
    pastilla = 2;
  } else if (score > 8) {
    diagnostico = "Alergia Estacional";
    pastilla = 3;
  }

  Serial.print("{\"event\": \"diagnostico_finalizado\", \"resultado\": \"");
  Serial.print(diagnostico);
  Serial.print("\", \"pastilla\": ");
  Serial.print(pastilla);
  Serial.println("}");
  
  estadoActual = DISPENSANDO;
}

void ejecutarDispensacion(int posicion) {
  // 1. Girar carrusel con Motor Paso a Paso
  int pasos = (posicion - 1) * (stepsPerRevolution / 3);
  myStepper.step(pasos);
  
  // 2. Activar Servomotor para empujar
  dispenserServo.write(90);
  delay(1000);
  dispenserServo.write(0);
  
  // 3. Regresar carrusel (opcional)
  myStepper.step(-pasos);
  
  Serial.println("{\"event\": \"dispensacion_completa\"}");
}
