// This is the final code for the Arduino MKR 1010 Wifi. It collects data and sends data by connecting to a WPA2 personal Wifi network.

///////////////////WIFI and IOT CLOUD////////////////////
//This part sets up the libraries and variables for Wifi connection and Https requests
#include <WiFiNINA.h> // Necessary library
#include <WiFiUdp.h> // Necessary library
#include "arduino_secrets.h" // Contains password
char server[] = "script.google.com";
char ssid[] = SECRET_SSID;
char pass[] = SECRET_PASS;
int status = WL_IDLE_STATUS;
WiFiSSLClient client;
String CPRdata = "";
///////////////////WIFI and IOT CLOUD////////////////////

///////////////////////////RTC///////////////////////////
//This part sets up the libraries and variables for the DS3231 RTC module
#include <Wire.h>
#include <RTCZero.h>
RTCZero rtc;
#define DS3231_I2C_ADDRESS 0x68
String yearString;
String monString;
String dayString;
String hourString;
String minString;
String secString;
String dateString;
String timeString;
String dataString;
byte decToBcd(byte val) {
  return ( (val / 10 * 16) + (val % 10) );
}
byte bcdToDec(byte val) {
  return ( (val / 16 * 10) + (val % 16) );
}
///////////////////////////RTC///////////////////////////

///////////////////////////SD////////////////////////////
//This part sets up the libraries and variables for the micro SD card module
#include <SPI.h>
#include <SD.h>
String filename = "CPR_Data.csv";
String title = "Date,Timestamp,Acceleration,Rate";
String sheetname;
int SDPin = 7; // CS (chip selected) Pin to digital pin 7
int i;
int p;
int vol;
bool waited = false;
bool uploaded = true;
//bool recorded = false;
bool filenamed = false;
bool marked = false;
File sensorData;
File sdfile;
///////////////////////////SD////////////////////////////

//////////////////////////ACC////////////////////////////
//This part sets up the libraries and variables for calculate the chest compresion rate based on the ACC readings from CorPatch
int accPin = A1; // ACC pin to Analog pin 1
int acc;
int maxval;
int compressionRate;
int maxThreshold = 910; // ACC readings that are higher than this threshold count as a valid compression
int minThreshold = 875; // ACC readings that are lower than this threshold count as no compression
int pinThreshold = 100; // If ACC reading is higher than this threshold, it means CorPatch is plugged in
unsigned long t;
unsigned long t1;
unsigned long t2;
unsigned long before;
unsigned long bef;
const long interval = 400; // Chest compression rate is calculated every 400ms
const long interval2 = 2000; // If longer than 2000ms,
//////////////////////////ACC////////////////////////////

////////////////////SETUP FUNCTION///////////////////////
// This setup function only run once at the beginning when the device is turned on
void setup() {
  Wire.begin();
  Serial.begin(115200);
  SD.begin(SDPin);
  while (status != WL_CONNECTED) { // This is a while loop function, which means it only stops until the condition is not true or a 'break' is called during the loop. Here if Wifi is not conected, the function loops until Wifi is connected or 'break' is called
    Serial.print("Connecting to wifi...");
    Serial.println(ssid);
    status = WiFi.begin(ssid, pass); // Connect to Wifi with SSID and password
    delay(10000);
  }
  Serial.println("Connected");
  updatetime();
}
////////////////////SETUP FUNCTION///////////////////////

/////////////////////LOOP FUNCTION///////////////////////
// This loop function is looped as long as the device is turned on after executing the setup function
void loop() {
  if (analogRead(accPin) > pinThreshold) { // If the ACC value is higher than pinThreshold (100), it means that the CorPatch is plugged in
    acceleration(); // Calculate compression rate
    currtime(); // Get current time
    unsigned long present = millis();
    if ((present - before) > 999) { //called every 1000ms
      savedata(); // Create a new csv file, save the current time (date, time), ACC value, compression rate value to this file in the micro SD card
      before = present; // refresh timer
    }
    uploaded = false; // This file is not uploaded to Google sheet yet
    marked = false; // This saved csv file is not marked as 'END' yet
    waited = false;
  }

  else if ((analogRead(accPin) <= pinThreshold) and uploaded == false and waited == false) { //If ACC value is lower than pinThreshold (100), it means CorPatch is unplugged, and if the data is not uploaded yet, upload the data here
    i = 0;
    before = millis();
    while (i < 600) {
      if ((millis() - before) > 1000) {
        before = millis();
        i++;
        currtime();
        dataString = dateString + "," + timeString + "," + "x" + "," + "0" + ","; // Combine the whole data into one string with commas in between
        sensorData = SD.open(sheetname, FILE_WRITE); // Save the data to the file that is used to upload to Google sheets
        if (sensorData) {
          if (p < 99) { // Write the 100 lines of the dataString in one row inside the csv file, so they can be uploaded in batch later
            sensorData.print(dataString);
            p++;
          }
          else {
            sensorData.println(dataString);
            p = 0;
          }
          sensorData.close();
          Serial.println(dataString);
          Serial.println(filenamed);
        }
        else {
          Serial.println("fail to write");
        }
      }
      if (analogRead(accPin) > pinThreshold) { // If the CorPatch is plugged in again, break this loop
        break;
      }
    }
    waited = true;
    filenamed = true;
  }

  else if ((analogRead(accPin) <= pinThreshold) and uploaded == false and waited == true) {
    markend(); // Mark an 'END' string at the end of the just saved csv file
    while (status != WL_CONNECTED) { // This is a while loop function, which means it only stops until the condition is not true or a 'break' is called during the loop. Here if Wifi is not conected, the function loops until Wifi is connected or 'break' is called
      Serial.println("Connecting to wifi...");
      status = WiFi.begin(ssid, pass); // Connect to Wifi with SSID and password
      if (analogRead(accPin) > pinThreshold) { // If the CorPatch is plugged in again, break this loop
        break;
      }
      if (uploaded == true) { // If data is uploaded, break this loop
        break;
      }
    }
    Serial.println("Connected to wifi");
    readdata(); // send data to Google sheets
    updatetime();
    p = 0;
    filenamed = false;// The new file for next case is not created yet
    waited = false;
    marked = false;
  }

  else { //After uploading the data of this case, the device goes to standby mode, which does nothing until the CorPatch is plugged in again
    filenamed = false; // The new file for the next case is not created yet
    marked = false; // The new file for the next case is not marked as 'END' yet
    //Serial.println(filenamed);
  }
}
/////////////////////LOOP FUNCTION///////////////////////

/////////////////////ACCELERATION////////////////////////
//This function is is called to get current ACC value and calculate compression rate every 400ms
void acceleration() {
  acc = analogRead(accPin); // Get ACC raw value
  if (millis() - t > interval) { // Do this every 400ms
    if (acc >= maxval) { // If the ACC value is increasing
      maxval = acc; // Max ACC value is the new reading
    } else { // If the ACC value starts to decrease, which means the last maxval is the peak during this period
      if (maxval > maxThreshold) { // If the peak ACC value is bigger than maxThreshold (910)
        compressionRate = 60000 / (millis() - t); // Calculate the compression rate by dividing 60000ms by the interval between current and last time the peak value occurs
        maxval = 0; // maxval set back to 0
        t = millis(); // current time is recorded to t
      }
    }
  }
  if (millis() - t > interval2 && acc < minThreshold) { // If ACC value is smaller than minThreshold (875) for more than 2 seconds
    compressionRate = 0; // Compression rate is set as 0
  }
}
/////////////////////ACCELERATION////////////////////////

////////////////SAVE DATA TO SD CARD/////////////////////
// This function is called to save the current data to a newly created csv file in the micro SD card
void savedata() {
  if (filenamed == false) { // If a new file is not created yet for the new rescue case
    sheetname = monString + dayString + hourString + minString + ".csv"; // Create a new file by namin it with current time, this file is used to upload data to Google sheets later
    filenamed = true; // File is created for the rescue case
    Serial.println(sheetname + "created");
    sdfile = SD.open(filename, FILE_WRITE); // Open the newly created file
    if (sdfile) {
      sdfile.println(title); // Write the file title "Date,Timestamp,Acceleration,Rate" in the first row of the csv file, so here 4 columns with these 4 titles are created inside the csv file
      sdfile.close();
    }
    else {
      Serial.println("fail to write");
    }
  }
  dataString = dateString + "," + timeString + "," + String(acc) + "," + String(compressionRate) + ","; // Combine the whole data into one string with commas in between
  sensorData = SD.open(sheetname, FILE_WRITE); // Save the data to the file that is used to upload to Google sheets
  if (sensorData) {
    if (p < 99) { // Write the 100 lines of the dataString in one row inside the csv file, so they can be uploaded in batch later
      sensorData.print(dataString);
      p++;
    }
    else {
      sensorData.println(dataString);
      p = 0;
    }
    sensorData.close();
  }
  else {
    Serial.println("fail to write");
  }

  sdfile = SD.open(filename, FILE_WRITE); // Open the backup CPRData.csv file,, which contains all the historic data
  if (sdfile) {
    sdfile.println(vol);
    sdfile.println(dataString); // Write the new data into the file
    sdfile.close();
  }
  else {
    Serial.println("fail to write");
  }
  Serial.println(dataString);
}
////////////////SAVE DATA TO SD CARD/////////////////////

//////////////////MARK FILE AS END///////////////////////
//This function is used to mark an "END" string at the end of an unuploaded file, so the Arduino knows when to stop upload data
void markend() {
  if (marked == false) { // If the file is not marked
    sensorData = SD.open(sheetname, FILE_WRITE); // Open the upload file
    if (sensorData) {
      sensorData.println("\nEND\n"); // Add "END" at then end of the file
      sensorData.close();
    }
    else {
      Serial.println("fail to mark end");
    }
    sdfile = SD.open(filename, FILE_WRITE); // Open the backup CPRData.csv file
    if (sdfile) {
      sdfile.println("\nEND\n"); // Add "END" at then end of the file
      sdfile.close();
    }
    else {
      Serial.println("fail to write");
    }
    marked = true; // The file is marked
  }
}
//////////////////MARK FILE AS END///////////////////////

/////////////UPLOAD DATA TO GOOGLE SHEETS////////////////
//This function uplaods the saved csv file to the google sheets
void readdata() {
  sensorData = SD.open(sheetname); // Open the upload file
  if (sensorData) {
    while (sensorData.available()) { // During upload, this while loop only stops is the SD card module is not communicating or a break is called
      CPRdata = sensorData.readStringUntil('\n'); // Read the first line and assign it to CPRdata string, which contains 100 lines of the dataString (100s of data)
      Serial.println(CPRdata);
      if (client.connectSSL(server, 443)) {
        Serial.println("connected to server");
        client.println("GET https://script.google.com/macros/s/AKfycbxDM06hdTlMFUWGLjKmGLiaKIRJxn9GqSkoV0SwFIw6q1LOwCI/exec?CPRdata=" + CPRdata); // Attach the CPRdata string at the end of this Https address to upload data to Google sheets
        client.println("Host: script.google.com");
        client.println("Connection: close");
        client.println();
      }
      if (CPRdata == "END") { // If the CPRdata is assigned as "END", which means this is the end of the file
        uploaded = true; // Mark the file as uploaded
        break; // Get out of the while loop
      }
    }
  } else Serial.println("fail");
}
/////////////UPLOAD DATA TO GOOGLE SHEETS////////////////

///////////////////GET CURRENT TIME//////////////////////
// This function gets the current time from the DS3231 module
void readDS3231time(byte * second, byte * minute, byte * hour, byte * dayOfWeek, byte * dayOfMonth, byte * month, byte * year)
{
  Wire.beginTransmission(DS3231_I2C_ADDRESS);
  Wire.write(0); // set DS3231 register pointer to 00h
  Wire.endTransmission();
  Wire.requestFrom(DS3231_I2C_ADDRESS, 7);
  // request seven bytes of data from DS3231 starting from register 00h
  *second = bcdToDec(Wire.read() & 0x7f);
  *minute = bcdToDec(Wire.read());
  *hour = bcdToDec(Wire.read() & 0x3f);
  *dayOfWeek = bcdToDec(Wire.read());
  *dayOfMonth = bcdToDec(Wire.read());
  *month = bcdToDec(Wire.read());
  *year = bcdToDec(Wire.read());

  if (*month < 10) { // Following codes format the corresponding time unit into 2 digits
    monString = "0" + String(*month, DEC);
  } else monString = String(*month, DEC);

  if (*dayOfMonth < 10) {
    dayString = "0" + String(*dayOfMonth, DEC);
  } else dayString = String(*dayOfMonth, DEC);

  if (*minute < 10) {
    minString = "0" + String(*minute, DEC);
  } else minString = String(*minute, DEC);

  if (*second < 10) {
    secString = "0" + String(*second, DEC);
  } else secString = String(*second, DEC);
}
///////////////////GET CURRENT TIME//////////////////////

//////////FORMAT CURRENT TIME INTO A STRING//////////////
// This function combines the time data into one formatted string as "2020-02-09" and "23:04:12", for example.
void currtime()
{
  byte second, minute, hour, dayOfWeek, dayOfMonth, month, year;
  readDS3231time(&second, &minute, &hour, &dayOfWeek, &dayOfMonth, &month, &year);
  dateString = "20" + String(year, DEC) + "-" + monString + "-" + dayString;
  hourString = String(hour, DEC);
  timeString = hourString + ":" + minString + ":" + secString;
}
//////////FORMAT CURRENT TIME INTO A STRING//////////////

//////////////////////RESET TIME/////////////////////////
// This function reset the current time in the DS3231 module
void setDS3231time(byte second, byte minute, byte hour, byte dayOfWeek, byte dayOfMonth, byte month, byte year)
{
  // sets time and date data to DS3231
  Wire.beginTransmission(DS3231_I2C_ADDRESS);
  Wire.write(0); // set next input to start at the seconds register
  Wire.write(decToBcd(second)); // set seconds
  Wire.write(decToBcd(minute)); // set minutes
  Wire.write(decToBcd(hour)); // set hours
  Wire.write(decToBcd(dayOfWeek)); // set day of week (1=Sunday, 7=Saturday)
  Wire.write(decToBcd(dayOfMonth)); // set date (1 to 31)
  Wire.write(decToBcd(month)); // set month
  Wire.write(decToBcd(year)); // set year (0 to 99)
  Wire.endTransmission();
}
//////////////////////RESET TIME/////////////////////////

void updatetime() {
  rtc.begin();
  unsigned long epoch;
  while (epoch < 1603744500) {
    epoch = WiFi.getTime();
    delay(2000);
  }
  Serial.print("Epoch received: ");
  Serial.println(epoch);
  rtc.setEpoch(epoch + 3600);
  Serial.println();
  setDS3231time(rtc.getSeconds(), rtc.getMinutes(), rtc.getHours(), 6, rtc.getDay(), rtc.getMonth(), rtc.getYear()); // This function is used to synce current time
  currtime();
  Serial.println(timeString);
  Serial.println("time updated");
}
