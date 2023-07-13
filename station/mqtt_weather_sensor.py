import paho.mqtt.client as mqtt
from random import randrange, uniform
import time
import json

mqttBroker = "broker.hivemq.com"
client = mqtt.Client("Test1")
client.connect(mqttBroker)

while True:
    randTemp = uniform(19.0, 45.0)
    randHumid = uniform(19.0, 45.0)

    data = {
        "temperature": randTemp,
        "humidity": randHumid
    }
    data = json.dumps(data)

    client.publish("Weather_Data", data, qos=2, retain=True)
    print("[+] Published: " + str(randTemp) + " : "+ str(randHumid))
    time.sleep(3)