<h1 align="center">DIY Smarthome-System</h1>

This documentation is for a do it yourself smarthome system. This system is for tech enthusiasts who prefer a mixture of do it yourself and ready to use. 
The system consists of a database, a Raspberry Pi as host and an API that communicates between sensors and database and web application and database. 
The web application was programmed using the React Next.js framework and the API was developed using JavaScript. 
At the end of this documentation, anyone should be able to operate a self-built smarthome system with the database and web application running locally on a Raspberry Pi. 
The sensors can be implemented with an Arduino, ESP-32 or similar IoT devices. There may be code deviations here.

## Table of Contents
1. [Install OS](#install-os)
   - [Prerequisites](#prerequisites)
   - [Installing Ubuntu Server](#installing-ubuntu-server)
2. [Install and configure database](#install-and-configure-database)
   - [Installing MongoDB on RPi Ubuntu Server](#installing-mongodb-on-rpi-ubuntu-server)
   - [Installing MongoDB on Ubuntu 22.04+](#installing-mongodb-on-ubuntu-2204)
   - [Configuring MongoDB](#configuring-mongodb)
     - [Start, restart and stop MongoDB](#start-restart-and-stop-mongodb)
     - [Create admin user](#create-admin-user)
     - [Securing MongoDB](#securing-mongodb)
     - [Make MongoDB accessible outside the localhost](#make-mongodb-accessible-outside-the-localhost)
   - [Work with MongoDB](#work-with-mongodb)
     - [Working in MongoDB Shell](#working-in-mongodb-shell)
     - [Create a database](#create-a-database)
     - [Working in MongoDB Compass](#working-in-mongodb-compass)
3. [First steps in the smarthome system](#first-steps-in-the-smarthome-system)
   - [Create the database and collections](#create-the-database-and-collections)
   - [Set up a database user for the API and the sensors](#set-up-a-database-user-for-the-api-and-the-sensors)


## Install OS
### Prerequisites
The Raspberry Pi is used as the hardware for hosting the web application, API and database. <br/>
If the system is to be used in the long term, it makes sense to use a Raspberry Pi 4 (or better) due to its higher performance. <br/>
It also makes sense to use a 64Gb+ SD card as a storage unit for the Raspberry Pi if the system is to be used in the long term. <br/>
The following documentation is implemented on a Raspberry Pi 4, there may be differences in installation procedures between different hardware. <br/>

### Installing Ubuntu Server
1. [Download](https://www.raspberrypi.com/software/) Raspberry Pi Imager
![grafik](https://github.com/user-attachments/assets/96d67cdc-9ece-48a7-9d35-65cb03a2db92)

2. Select your hardware under "Choose Device"

3. Now select the Ubuntu server image under “Choose OS” > “Other general-purposes OS” > “Ubuntu”
![grafik](https://github.com/user-attachments/assets/6b6e1ba6-ee01-48f3-9a7f-43a9c2ab7acc)

4. If you click on next, you can activate a user with a password under “EDIT SETTINGS” > “General” or SSH access under “EDIT SETTINGS” > “Services” as required
![grafik](https://github.com/user-attachments/assets/c05657db-d77b-4b5e-8290-29a2ed854e27)

5.	When everything is set, apply custom os settings and confirm the formatting process

6.	When the write process is finished, insert the SD card into the Raspberry and boot up

7.	Finally, log in with your created user and password (Step 4) via SSH

---
## Install and configure database

To keep the database simple and clear MongoDB is used. <br/>
Furthermore, MongoDB offers the possibility to use a visual working environment in the database via the MongoDB Compass App, e.g. via Windows <br/>

IMPORTANT: Support for version 5+ has been discontinued for the Raspberry Pi due to the processor architecture 

See more: <br/>
https://www.mongodb.com/docs/manual/release-notes/5.0-compatibility/#removed-raspberry-pi-support <br/>
https://www.mongodb.com/docs/manual/administration/production-notes/


### Installing MongoDB on RPi Ubuntu Server

### Installing MongoDB on Ubuntu 22.04+

### Configuring MongoDB
#### Start, restart, and stop MongoDB
#### Create admin user
#### Securing MongoDB
#### Make MongoDB accessible outside the localhost

### Work with MongoDB
#### Working in MongoDB Shell
#### Create a database
#### Working in MongoDB Compass
---
## First steps in the smarthome system
### Create the database and collections
### Set up a database user for the API and the sensors

