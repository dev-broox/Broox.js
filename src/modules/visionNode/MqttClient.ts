import Paho from 'paho-mqtt';

/**
 * MQTT client
 */
export class MqttClient {
  private client: Paho.Client;
  private onMessageCallback: (message: any) => void;

  /**
   * Initializes a new instance of the MQTTClient class.
   * @param host Server host.
   * @param port Server port.
   */
  constructor(host: string, port: number) {
    this.client = new Paho.Client(host, port, 'clientjs');
    // set callback handlers
    this.client.onConnectionLost = () => {
      console.log('MQTT connection lost. Reconnecting in 5 seconds');
      setTimeout(() => {
        this.connect();
      }, 5000);
    }
    this.client.onMessageArrived = (message) => {
      this.onMessageCallback && this.onMessageCallback(JSON.parse(message.payloadString));
    };
  }

  /**
   * Connects to the MQTT server.
   */
  connect() {
    this.client.connect({ onSuccess: () => {
      console.log('MQTT connected');
      this.client.subscribe('#');
    }, onFailure: () => {
      setTimeout(() => {
        this.connect();
      }, 5000);
    }});
  }

  /**
   * Sets the callback function that fires when a message is recieved.
   * @param callback Callback fired when a new message is recieved.
   */
  onMessage(callback: (message: any) => void) {
    this.onMessageCallback = callback;
  }
}