import { Client } from "@stomp/stompjs";
import { bindable } from "aurelia-framework";

export class App {
  constructor() {

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
          (response) => {
            const payload = JSON.parse(response.body);
            this.displayMessages();
          }
        );
      },
    };

    this.client = new Client(this.stompConfig);

    this.client.webSocketFactory = function () {
      return new WebSocket("ws://localhost:8080/chat");
    };
    this.isLoggedIn = false;
    this.message = "";

    this.messages = [];
  }

  connect(user) {
    this.stompConfig.connectHeaders.login = user;
    this.isLoggedIn = true;
    this.client.activate();
  }

  publishMessage(user, message) {
    if (!this.client.connected) {
      alert("[Error] You are currently disconnected, can't send message.");
      return false;
    }
    if (message.length > 0) {
      const payLoad = { text: message, from: user, timestamp: new Date() };

      this.client.publish({
        destination: "/app/chat",
        body: JSON.stringify(payLoad),
      });
      this.messages.push(payLoad);
    }
    this.message = "";
    return true;
  }

  displayMessages() {
    this.messages.forEach((message) => console.log(message));
  }
}
