import { Client } from "@stomp/stompjs";

export class App {
  constructor() {
    this.user;

    this.client;
    this.stompConfig = {
      connectHeaders: {
        login: this.user,
        passcode: "",
      },
      brokerUrl: "ws://localhost:8080/chat",
      debug: (str) => {
        console.log("[STOMP] " + str);
      },
      reconnectDelay: 200,

      onConnect: (frame) => {
        const subscription = this.client.subscribe(
          "/topic/messages",
          (message) => {
            const payload = JSON.parse(message.body);
            this.displayIncomingMessage(payload.user, payload.message);
            // console.log(payload.user, payload.message);
          }
        );
      },
    };

    this.client = new Client(this.stompConfig);

    this.client.webSocketFactory = function () {
      return new WebSocket("ws://localhost:8080/chat");
    };

    this.messages = [];
  }

  connect() {
    this.client.activate();
  }

  publishMessage(user, message) {
    if (!this.client.connected) {
      alert("[Error] You are currently disconnected, can't send message.");
      return false;
    }
    if (message.length > 0) {
      const payLoad = {"text": message, "from": user, "timestamp": new Date()};

      this.client.publish({
        destination: "/topic/messages",
        body: JSON.stringify(payLoad),
      });
      this.messages.push(payLoad);
    }
    return true;
  }

  displayIncomingMessage(user, message) {
    console.log(user, )
  }
}
