#include <WiFi.h>
#include <HTTPClient.h>

#include "DHT.h"
#define DHTPIN 5
#define DHTTYPE DHT22 
DHT dht(DHTPIN, DHTTYPE);

const char* ssid = "WiFiSSIDHere";
const char* password = "WiFiPasswordHere";
const char* serverName = "http://serverIP:3010/api/dataset";

const char* sensorHumID = "";
const char* sensorTempID = "";

void setup() {
  Serial.begin(9600);

  dht.begin();

  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.println("Connecting to WiFi...");
  }

  Serial.println("Connected to WiFi");
}

void loop() {
  delay(10000);

  float h = dht.readHumidity();
  float t = dht.readTemperature();

  if (isnan(h) || isnan(t)) {
    Serial.println(F("Failed to read from DHT sensor!"));
    return;
  }

  Serial.print(F("Humidity: "));
  Serial.print(h);
  Serial.print(F("%  Temperature: "));
  Serial.print(t);
  Serial.println(F("°C "));

  //Temperature
  sendRequest("sensorTemp", t);
  //Humidity
  sendRequest("sensorHum", h);
}

void sendRequest(String sID, float value) {
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;

    http.begin(serverName);
    http.addHeader("Content-Type", "application/json");

    if(sID == "sensorTemp"){
      String httpRequestData = "{\"sensorID\":\"" + String(sensorHumID)+ "\",\"value\":\"" + String(value)+"%" + "\"}";
      int httpResponseCode = http.POST(httpRequestData);
      showRequestError(http.POST(httpRequestData), http);

    } else if(sID == "sensorHum") {
      String httpRequestData = "{\"sensorID\":\"" + String(sensorTempID)+ "\",\"value\":\"" + String(value)+"° C" + "\"}";
      showRequestError(http.POST(httpRequestData), http);
    }
    http.end();
  } else {
    Serial.println("Error in WiFi connection");
  }
}

void showRequestError(int rc, HTTPClient &hc){
  if (rc > 0) {
    String response = hc.getString();
    Serial.println(rc);
    //Serial.println(response);
  } else {
    Serial.print("Error on sending POST: ");
    //Serial.println(rc);
  }
}