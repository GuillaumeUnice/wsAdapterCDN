/// <reference path="./wsJMSKaazing.d.ts" />
"use strict";
var wsJmsLib = (function () {
    //////////////////////////////////////////////////////////////////////////////////
    function wsJmsLib() {
        this.connection = {};
        this.session = {};
        this.consumers = {};
    }
    wsJmsLib.prototype.createDestination = function (name) {
        var reTopic = new RegExp(wsJmsLib.baseTopicUrl, 'i');
        var reQueue = new RegExp(wsJmsLib.baseQueueUrl, 'i');
        if (name.match(reTopic)) {
            return this.session.createTopic(name);
        }
        else if (name.match(reQueue)) {
            return this.session.createQueue(name);
        }
        else {
            throw new Error("Destination must start with /topic/ or /queue/");
        }
    };
    wsJmsLib.prototype.buildMessage = function (message) {
        var textMessage = this.session.createTextMessage(message);
        return textMessage;
    };
    //////////////////////////////////////////////////////////////////////////////////
    wsJmsLib.prototype.connect = function (url, callback) {
        var connectionFactory = new JmsConnectionFactory(url);
        var that = this;
        var connectionFuture = connectionFactory.createConnection(function () {
            try {
                that.connection = connectionFuture.getValue();
            }
            catch (err) {
                console.error(err);
            }
            that.session = that.connection.createSession(false, Session.AUTO_ACKNOWLEDGE);
            that.connection.start(function () {
                callback();
            });
        });
    };
    ;
    wsJmsLib.prototype.subscribe = function (channelName, messageListener) {
        var _this = this;
        // assuming connection has already been established and started
        // ideally we need to maintain the state of the connection and throw error
        // if the controller calls subscribe before connection is established
        // or after the connection is closed
        var topic = this.session.createTopic(channelName);
        var consumer = this.session.createConsumer(topic);
        this.consumers[channelName] = consumer;
        consumer.setMessageListener(function (message) {
            messageListener.call(_this, message.getText());
        });
    };
    ;
    wsJmsLib.prototype.send = function (message, topic, callback) {
        var dest = this.createDestination(topic);
        var producer = this.session.createProducer(dest);
        var textMessage = this.buildMessage(message);
        try {
            var future_1 = producer.send(textMessage, function () {
                if (future_1.exception) {
                    console.error(future_1.exception);
                }
                callback();
            });
        }
        catch (e) {
            console.error(e);
        }
        producer.close();
    };
    wsJmsLib.prototype.unsubscribe = function (channelName, callback) {
        var consumer = this.consumers[channelName];
        if (consumer) {
            delete this.consumers[channelName];
            consumer.close(callback);
        }
    };
    ;
    wsJmsLib.baseTopicUrl = 'topic';
    wsJmsLib.baseQueueUrl = 'queue';
    return wsJmsLib;
}());
exports.wsJmsLib = wsJmsLib;
