(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define("MyLib", [], factory);
	else if(typeof exports === 'object')
		exports["MyLib"] = factory();
	else
		root["MyLib"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(1);


/***/ },
/* 1 */
/***/ function(module, exports) {

	/// <reference path="./JmsClient.d.ts" />
	"use strict";
	var wsJmsLib = (function () {
	    function wsJmsLib() {
	    }
	    //////////////////////////////////////////////////////////////////////////////////
	    wsJmsLib.prototype.createDestination = function (name) {
	        if (name.indexOf(wsJmsLib.baseTopicUrl) == 0) {
	            return this.session.createTopic(name);
	        }
	        else if (name.indexOf(wsJmsLib.baseQueueUrl) == 0) {
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
	        var connectionFuture = connectionFactory.createConnection(function () {
	            this.connection = connectionFuture.getValue();
	            this.session = this.connection.createSession(false, Session.AUTO_ACKNOWLEDGE);
	            this.connection.start(function () {
	                callback();
	            });
	        });
	    };
	    ;
	    wsJmsLib.prototype.subscribe = function (channelName, messageListener) {
	        // assuming connection has already been established and started
	        // ideally we need to maintain the state of the connection and throw error
	        // if the controller calls subscribe before connection is established
	        // or after the connection is closed
	        var topic = this.session.createTopic(channelName);
	        var consumer = this.session.createConsumer(topic);
	        this.consumers[channelName] = consumer;
	        consumer.setMessageListener(messageListener);
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


/***/ }
/******/ ])
});
;
//# sourceMappingURL=MyLib.js.map