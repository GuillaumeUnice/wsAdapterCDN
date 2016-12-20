/// <reference path="./wsJMSKaazing.d.ts" />

export  class wsJmsLib {

	private static baseTopicUrl: string = 'topic';
	private static baseQueueUrl: string = 'queue';

  public connection: any;
  public session: any;
  public consumers: any;
	//////////////////////////////////////////////////////////////////////////////////
	constructor() {
		this.connection = {};
		this.session = {};
		this.consumers = {};
	}
	private createDestination(name: string): Topic | Queue {
		if (name.indexOf(wsJmsLib.baseTopicUrl) == 0) {
			return this.session.createTopic(name);
		}
		else if (name.indexOf(wsJmsLib.baseQueueUrl) == 0) {
			return this.session.createQueue(name);
		}
		else {
			throw new Error("Destination must start with /topic/ or /queue/");
		}
	}

  private buildMessage (message: string): textMessage {
    let textMessage: textMessage = this.session.createTextMessage(message);
    return textMessage;
  }

	//////////////////////////////////////////////////////////////////////////////////

	public connect(url: string, callback: Function) {
    let connectionFactory = new JmsConnectionFactory(url);

		let that = this;

		let connectionFuture = connectionFactory.createConnection(function(){
			try {
				that.connection = connectionFuture.getValue();
			} catch (err) {
				console.error(err);
			}

			that.session = that.connection.createSession(false, Session.AUTO_ACKNOWLEDGE);
			that.connection.start(function() {
				callback();
			});
		});
	};

	public subscribe(channelName: string, messageListener: Function) {
		// assuming connection has already been established and started
		// ideally we need to maintain the state of the connection and throw error
		// if the controller calls subscribe before connection is established
		// or after the connection is closed
		let topic: Topic | Queue = this.session.createTopic(channelName);
		let consumer: Consumer = this.session.createConsumer(topic);
		this.consumers[channelName] = consumer;
		consumer.setMessageListener(messageListener);
	};


	public send(message: string, topic: string, callback: Function): void {
		let dest: Queue | Topic = this.createDestination(topic);
		let producer: Producer = this.session.createProducer(dest);
    let textMessage: textMessage = this.buildMessage(message);
		
		try {
			let future: FutureException = producer.send(textMessage, function () {
					if (future.exception) {
							console.error(future.exception);
					}
					callback();
			});
		} catch (e) {
			console.error(e);
		}
			producer.close();
	}

  public unsubscribe(channelName: string, callback: Function) {
    let consumer: Consumer = this.consumers[channelName];
    if (consumer) {
      delete this.consumers[channelName];
      consumer.close(callback);
    }
  };
}
