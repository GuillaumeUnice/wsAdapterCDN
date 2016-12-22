/// <reference path="../src/wsJMSKaazing.d.ts" />
export declare class wsJmsLib {
    private static baseTopicUrl;
    private static baseQueueUrl;
    connection: any;
    session: any;
    consumers: any;
    constructor();
    private createDestination(name);
    private buildMessage(message);
    connect(url: string, callback?: Function): void;
    subscribe(channelName: string, messageListener: Function): void;
    send(message: string, topic: string, callback?: Function): void;
    unsubscribe(channelName: string, callback?: Function): void;
}
