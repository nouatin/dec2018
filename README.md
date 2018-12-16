# dec2018
Quelques contrôles à distance d'objets connectés communiquant avec serveur NodeJs dans le cadre du défi IoT Montreal 2018 


One device based on ESP8266 send outside and inside temperature with inside l'humidity  (took with DS18B20 and DHT11) 
to nodejs server running on raspberry-pi by MQTT. Web client connect to the serveur display differents values by graphic.
With One button in the interface, i can change light state. 
From client interface, by one touch i can take a photo with my raspberry pi  from home and have it on my mobile phone. 
All photos took in that connexion can appear on my mobile phone.
Another side of the project is made with Node-red :
With Pir sensor connected to the PI, i measure and save my work-time on local data-base mongodb.
My target by doing this is to visualize my work duration at home per week, per month and per year. This part is not include here.
With Hall sensor, i can receive email notification if the door is open. it's build on node-red.
