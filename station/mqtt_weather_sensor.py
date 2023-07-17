import paho.mqtt.client as mqtt
from random import randrange, uniform
import time
import json
import uuid

client_id = "mqtt-client-" + str(uuid.uuid4())
mqttBroker = "127.0.0.1"
client = mqtt.Client(client_id)
client.connect(mqttBroker, port=1883)

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