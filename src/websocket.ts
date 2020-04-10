interface MessageHandlers {
    [x: string]: Function;
}

export class WebsocketManager {
    socket: WebSocket;
    handlers: MessageHandlers;
    onStart: Function;

    constructor(handlers: MessageHandlers) {
        this.socket = new WebSocket("ws://localhost:5000/ws");
        this.handlers = handlers;
        this.onStart = () => undefined;

        this.socket.onmessage = (message: any) => {
            let message_json: any = JSON.parse(message.data);

            if (message_json.type in handlers) {
                handlers[message_json.type](message_json);
            } else if (message_json.type === "startGame") {
                this.onStart();
            }
        };
    }

    public sendStart() {
        console.log(this.socket);
        this.socket.send(
            JSON.stringify({
                type: "startGame",
                content: "",
                gameFrame: 0
            })
        );
    }
}
