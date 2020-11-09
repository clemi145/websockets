import { Client } from "@stomp/stompjs";

export class App {
  user = "";
  constructor() {

    this.user = "";

    this.client;
    this.stompConfig = {
      connectHeaders: {
        login: App.user,
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
          (response) => {
            const payload = JSON.parse(response.body);
            // console.log(payload.from, payload.text, payload.timestamp);
            this.displayMessages();
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

  displayMessages() {
    this.messages.forEach(message => console.log(message));
  }
}
