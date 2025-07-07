/* eslint-disable no-console */
import mqtt from 'mqtt';
const MQTT_BROKER_URL =
  process.env.MQTT_BROKER_URL || 'wss://broker.hivemq.com:8884/mqtt';

const options = {
  username: process.env.MQTT_USERNAME,
  password: process.env.MQTT_PASSWORD,
  reconnectPeriod: 1000
};

const mqttClient = mqtt.connect(MQTT_BROKER_URL, options);
mqttClient.on('connect', () => {
  console.log('MQTT Connected to HiveMQ');
});
mqttClient.on('error', (err) => {
  console.log('MQTT Connection Error: ', err);
});

export default mqttClient;
