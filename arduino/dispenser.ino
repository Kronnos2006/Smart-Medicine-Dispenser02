#include <Servo.h>
#include <LiquidCrystal.h>

// Configuración de Pines
const int servoPin = 9;
const int trigPin = 10;
const int echoPin = 11;
Servo dispenserServo;

// Variables de estado
bool dispensando = false;
long duracion;
int distancia;

void setup() {
  Serial.begin(9600);
  dispenserServo.attach(servoPin);
  dispenserServo.write(0); // Posición inicial
  
  pinMode(trigPin, OUTPUT);
  pinMode(echoPin, INPUT);
  
  Serial.println("{\"status\": \"ready\", \"message\": \"Dispensador iniciado\"}");
}

void loop() {
  // Leer comandos del Backend (Java)
  if (Serial.available() > 0) {
    String command = Serial.readStringUntil('\n');
    if (command == "DISPENSE") {
      dispensarMedicamento();
    }
  }

  // Monitoreo de Stock (Simulado con ultrasónico)
  digitalWrite(trigPin, LOW);
  delayMicroseconds(2);
  digitalWrite(trigPin, HIGH);
  delayMicroseconds(10);
  digitalWrite(trigPin, LOW);
  
  duracion = pulseIn(echoPin, HIGH);
  distancia = duracion * 0.034 / 2;

  // Enviar datos al Backend cada 5 segundos
  static unsigned long lastUpdate = 0;
  if (millis() - lastUpdate > 5000) {
    enviarDatos(distancia);
    lastUpdate = millis();
  }
}

void dispensarMedicamento() {
  Serial.println("{\"event\": \"dispensing\", \"timestamp\": " + String(millis()) + "}");
  dispenserServo.write(90);
  delay(1000);
  dispenserServo.write(0);
  Serial.println("{\"event\": \"completed\", \"success\": true}");
}

void enviarDatos(int stockDist) {
  // Formato JSON para que el Backend Java lo procese fácilmente
  Serial.print("{\"type\": \"telemetry\", \"stock_level\": ");
  Serial.print(stockDist);
  Serial.println("}");
}
