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
     - [Sources and tips](#sources-and-tips)
3. [First steps in the smarthome system](#first-steps-in-the-smarthome-system)
   - [Create the database and collections](#create-the-database-and-collections)
   - [Set up a database user for the API and the sensors](#set-up-a-database-user-for-the-api-and-the-sensors)
   - [Downloading and installing dependencies](#downloading-and-installing-dependencies)
   - [Start the smarthome system](#start-the-smarthome-system)


## Install OS
### Prerequisites
The Raspberry Pi is used as the hardware for hosting the web application, API and database. <br/>
If the system is to be used in the long term, it makes sense to use a Raspberry Pi 4 (or better) due to its higher performance. <br/>
It also makes sense to use a 64Gb+ SD card as a storage unit for the Raspberry Pi if the system is to be used in the long term. <br/>
The following documentation is implemented on a Raspberry Pi 4, there may be differences in installation procedures between different hardware. <br/>

### Installing Ubuntu Server
1. [Download](https://www.raspberrypi.com/software/) Raspberry Pi Imager <br/>
![grafik](https://github.com/user-attachments/assets/96d67cdc-9ece-48a7-9d35-65cb03a2db92)

2. Select your hardware under "Choose Device"

3. Now select the Ubuntu server image under “Choose OS” > “Other general-purposes OS” > “Ubuntu”
![grafik](https://github.com/user-attachments/assets/6b6e1ba6-ee01-48f3-9a7f-43a9c2ab7acc)

4. If you click on next, you can activate a user with a password under “EDIT SETTINGS” > “General” or SSH access under “EDIT SETTINGS” > “Services” as required <br/>
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

As already mentioned, everything above MongoDB 5.0+ no longer works so we need to [install MongoDB 4.4 on the Raspberry Pi](https://www.mongodb.com/developer/products/mongodb/mongodb-on-raspberry-pi/)

**1. Update OS**
   ```sh
   sudo apt-get update && apt-get upgrade -y 
   ```
<br/>

**2. Install MongoDB 4.4**
   
   Install the MongoDB 4.4 GPG key:
   ```sh 
   wget -qO - https://www.mongodb.org/static/pgp/server-4.4.asc | sudo apt-key add –
   ```

   Add the source location for the MongoDB packages:
   ```sh 
   echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/4.4 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-4.4.list
   ```

   Download the package details for the MongoDB packages:
   ```sh 
   sudo apt-get update
   ```

   Install MongoDB:
   ```sh 
   sudo apt-get install -y mongodb-org
   ```
<br/>

**3. Fixing version errors
   Due to the above-mentioned discontinuation of MongoDB support for the RPi, errors may occur after installation that prevent the MongoDB service from starting. 
   If this happens, MongoDB must be downgraded, and future updates must be withheld**

   Downgrade  to MongoDB 4.4.18
   ```sh 
   sudo apt-get install mongodb-org-mongos=4.4.18 mongodb-org-tools=4.4.18 mongodb-org-shell=4.4.18 mongodb-org-database-tools-extra=4.4.18 mongodb-org=4.4.18 mongodb-org-server=4.4.18
   ```

   Hold back updates
   ```sh 
   sudo apt-mark hold mongodb-org-mongos mongodb-org-tools mongodb-org-shell mongodb-org-database-tools-extra mongodb-org mongodb-org-server
   ```
<br/>

### Installing [MongoDB on Ubuntu 22.04+](https://www.mongodb.com/docs/manual/tutorial/install-mongodb-on-ubuntu/)

**1. Import the public key**
```sh
sudo apt-get install gnupg curl
```
```sh
curl -fsSL https://www.mongodb.org/static/pgp/server-8.0.asc | \
   sudo gpg -o /usr/share/keyrings/mongodb-server-8.0.gpg \
   --dearmor
```
<br/>

**2. Create the list file**
```sh
echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-8.0.gpg ] https://repo.mongodb.org/apt/ubuntu noble/mongodb-org/8.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-8.0.list
```
<br/>

**3. Reload package database**
```sh
sudo apt-get update
```
<br/>

**4. Install MongoDB Community Server**
```sh
sudo apt-get install -y mongodb-org
```
<br/>

### Configuring MongoDB
#### Start, restart, and stop MongoDB
MongoDB runs via the “Systemd services”
| Action                           | Command                             |
|----------------------------------|-------------------------------------|
| Start automatically with OS      | `sudo systemctl enable mongod.service` |
| Manually start service           | `sudo systemctl start mongod.service`  |
| Manually stop service            | `sudo systemctl stop mongod.service`   |
| Manually restart service         | `sudo systemctl restart mongod.service`|
| Check status                     | `sudo systemctl status mongod.service` |
<br/>


#### Create admin user
```sh
use admin
db.createUser( { user: "adminUserName",
            pwd: "enterPasswordHere",
            roles: [ "userAdminAnyDatabase",
                     "dbAdminAnyDatabase",
                     "readWriteAnyDatabase"] } )
exit
```
<br/>

#### Securing MongoDB
The next step is to back up the database. To do this, the config must be edited and authentication activated

**1. The MongoDB Config file is stored in /etc/ under Linux. Edit the following config:**
```sh
nano /etc/mongod.conf
```
<br/>

**2. Search for the security part and add the authentication part**
#### These two lines must be uncommented and in the file together:
```sh
security:
   authorization: enabled
```
<br/>

**3. Save and exit the changed config and restart the MongoDB service**
- Save and exit the editor with CTRL + X & Y + ENTER
- Restart service: 
```sh
systemctl restart mongod.service
```
<br/>


#### Make MongoDB accessible outside the localhost
To make the database accessible from outside the localhost, e.g. to work in the database from your own computer via MongoDB Compass, the corresponding IP must be changed in the config

**1. The MongoDB Config file is stored in /etc/ under Linux. Edit the following config:**
```sh
nano /etc/mongod.conf
```
<br/>

**2. Search for the security part and add the authentication part**
#### Change or add the bindIp to '0.0.0.0':
```sh
net:
   	     port: 27017
   	      bindIp: 127.0.0.1, 0.0.0.0

```
<br/>

**3. Now restart the database service and you have access from outside the localhost**

### Work with MongoDB
#### Working in MongoDB Shell
After authentication has been activated, log in with the previously created user

**1. Enter the mongo shell in terminal with created user**
```sh
mongosh -u "<createdUsername>" -p "<createdPassword>"
```
<br/>

**2. Now you can continue and create databases or manage users**
<br/>

#### Create a database

**1. Switch or create to database in MongoShell**
```sh
use <databaseName>
```
<br/>

**2. Create collection in database**
```sh
db.createCollection("<collectionName>")
```
<br/>

**3. List databases**
```sh
show dbs
```
<br/>


#### Working in MongoDB Compass
MongoDB Compass is the visual interface that can be used, for example, under Windows for easier administration

**1. Download and install MongoDB Compass from [here](https://www.mongodb.com/products/tools/compass)**
<br/>

**2. To establish a connection to the database, add a new connection under "Connections" > "+"**
![image](https://github.com/user-attachments/assets/aaceff7a-524a-4867-8565-89ffbded6e24)
<br/>

**3. Now adjust the connection string for your database and your user and connect**
```sh
mongodb://<username>:<userPassword>@<serverIP>:27017/?authMechanism=DEFAULT&authSource=admin
```
<br/>

**4. Now you can also create databases, collections and datasets here** <br/>
![image](https://github.com/user-attachments/assets/0ccbde0b-a741-42a3-a81c-b9e1b70f5f5a)
<br/>

#### Sources and tips 
<br/>
- https://www.mongodb.com/developer/products/mongodb/mongodb-on-raspberry-pi/#run-mongodb <br/>
- https://www.mongodb.com/community/forums/t/core-dump-on-mongodb-4-4-19-on-rpi-4/215223 <br/>
- https://www.w3schools.com/mongodb/index.php <br/>
- https://www.mongodb.com/docs/manual/tutorial/install-mongodb-on-ubuntu/ <br/>
<br/>

---
## First steps in the smarthome system
### Create the database and collections
The following instructions are for creating the database and the collections in <br/>
the Mongo Shell. Alternatively, the access set up via MongoDB Compass can be <br/>
used to create both with a graphical interface <br/>

**1. Connect to MongoDB as admin in terminal**
<br/>

**2. Create the database**
```sh
use nt-shs
```
<br/>

**3. Create the following collections**
```sh
db.createCollection("dataset")
```
&
```sh
db.createCollection("sensor")
```
<br/>

### Set up a database user for the API and the sensors
The API requires admin access to the nt-shs database in order to create, query <br/>
or delete data records or sensors. <br/>

A user is also required for the sensors. This is the same for each sensor, so each <br/>
sensor verifies itself with the API with the same access and thus validates its <br/>
data records <br/>

**1. Connect to MongoDB as admin in terminal**
<br/>

**2. Create the API user**
```sh
use admin
db.createUser({
  user: "apiUserName",
  pwd: "your-password",
  roles: [
    { role: "readWrite", db: "nt-shs" },
    { role: "clusterMonitor", db: "admin" }
  ]
})
```
<br/>

IMPORTANT: From this point on, the passwords in the API keys.json must be changed. <br/>
Standard login for API in keys.json: <br/>
User: `api` <br/>
Password: `nt-shs-api` <br/>
If a custom user name has been created, this must also be changed in every query, <br/>
e.g. in the connection string of the API database in the file `nt-shs-api.js`. <br/>


### Downloading and installing dependencies

**1. Download under Windows and Linux:**
```sh
git clone https://github.com/lpj-app/diy-smarthome.git
```
<br/>

**2. Download dependencies**
- Make sure that nodejs and npm are installed on the respective device <br/>

For the API:
- Navigate to the directory
```sh
cd diy-smarthome/shs-api/
```
&
```sh
npm i
```
<br/>

For the smarthome system:
- Navigate to the directory
```sh
cd diy-smarthome/smarthome-system/
```
&
```sh
npm i
```
<br/>

**Update user and password in `diy-smarthome/shs-api/` in `keys.json` and `nt-shs-api.js` accordingly if they have been changed**
<br/>

### Start the smarthome system
Navigate to the root directory of the project <br/>
**Start under Windows:** <br/>
Execute: `startOnWin.bat`.
<br/>

**Starting under Linux:** <br/>
Make the start script executable
```sh
chmod +x startOnLinux.sh
```
Execute: `./startOnLinux.sh`
<br/>

When selecting, you can choose whether API and or WebApp should be started <br/>
if one of them is already running in another window <br/>

API and WebApp should always run on the same server or device to minimize errors.<br/>
Furthermore, the scripts can be started, restarted or stopped via custom systectl files or started directly by booting the system<br/>
If the firewall is activated, the port for the API should be added as an exception (default port is 3010)<br/>
