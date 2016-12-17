interface Connection {
	createSession(state: boolean, session: number) : Session;
	start(callback: Function): void;
}

interface connectionFuture {
	getValue(): Connection;
}

declare class JmsConnectionFactory {
    constructor(url: string);
    createConnection(callback: () => void) : connectionFuture;
}

interface textMessage {
	setStringProperty(key: string, value: string): void;

}

interface Topic{}

interface Queue {}

interface Consumer {
	setMessageListener(callback: Function): void;
	close(callback: Function): void;
}

interface Producer {
	close(): void;
	send(message: textMessage,callback: Function): FutureException;

}

interface FutureException {
	exception: string;
}

declare class Session {
	static AUTO_ACKNOWLEDGE: number;
	createTopic(name: string): Topic;
	createQueue(name: string): Queue;
	createTextMessage(message: string): textMessage;
	createProducer(dest: Topic | Topic): Producer;
	createConsumer(topic: Topic): Consumer;
}
