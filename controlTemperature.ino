#include <ESP8266WiFi.h>
#include <PubSubClient.h>
#include <OneWire.h>
#include <DallasTemperature.h>
#include "DHT.h"

#define DHTTYPE DHT11 
#define DHTPIN D4
#define ONE_WIRE_BUS D3
#define portLight D1

OneWire oneWire(ONE_WIRE_BUS);
DallasTemperature sensors(&oneWire);

float Celsius=0;

// Wifi constant and server ip !
//***********************
const char* ssid = "Fenou-Houefa"; //"ForTheBest";
const char* password = "djidjoho13nouatin";
const char* mqtt_server = "192.168.0.143";

WiFiClient espClient;
PubSubClient client(espClient);

long lastTime = 0;
char msg[150];

DHT dht(DHTPIN, DHTTYPE);

void setup() {
  pinMode(portLight, OUTPUT);  
  digitalWrite(portLight, LOW);
  Serial.begin(115200);
  sensors.begin();
  dht.begin();
  setup_wifi();
  client.setServer(mqtt_server, 1883);
  client.setCallback(callback);
}

void setup_wifi() {
  delay(10);
  // We start by connecting to a WiFi network
  Serial.println();
  Serial.print("Connecting to ");
  Serial.println(ssid);

  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println("");
  Serial.println("WiFi connected");
  Serial.println("IP address: ");
  Serial.println(WiFi.localIP());
}

void callback(char* topic, byte* payload, unsigned int length) {
  Serial.print("Message arrived [");
  Serial.print(topic);
  Serial.print("] ");
  for (int i = 0; i < length; i++) {
    Serial.print((char)payload[i]);
  }
  Serial.println(length);    
  if ((char)payload[0] == '0') {
    digitalWrite(portLight, LOW);   // Turn the light on
  } else {
    digitalWrite(portLight, HIGH);  // Turn the light off
  }
}

void reconnect() {
  // Loop until we're reconnected
  while (!client.connected()) {
    Serial.print("Attempting MQTT connection...");
    // Attempt to connect
    if (client.connect("ESP8266Client")) {
      Serial.println("connected");
      // Once connected, publish one message...
      client.publish("defi/temperature", "{\"record\":\"begin !\"}");
      // resubscribtion
      client.subscribe("defi/tempResp");
    } else {
      Serial.print("failed, rc=");
      Serial.print(client.state());
      Serial.println(" try again in 5 seconds");
      delay(5000);
    }
  }
}


void loop() {

  if (!client.connected()) {
    reconnect();
  }
  client.loop();
    
  long now = millis();
  if (now - lastTime >= 2000) {
    lastTime = now;    
    sensors.requestTemperatures(); 
    Celsius = sensors.getTempCByIndex(0);
    float h = dht.readHumidity();
    float t = dht.readTemperature();
    if (!isnan(h) && !isnan(t)) {             
      int etat = digitalRead(portLight);      
      snprintf (msg, 150, "{\"from\":\"device\",\"temp\":{\"outSide\":%.2f,\"inSide\":%.2f},\"hum\":%.2f,\"lampStatus\":%d}",Celsius, t, h, etat);
      Serial.print("Publish message: ");
      Serial.println(msg);
      client.publish("defi/temperature", msg);
    }
    else Serial.println("Failed to read from DHT sensor!");
  }
}
