"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
var _global = typeof global !== 'undefined' ? global : (typeof window !== 'undefined' ? window : {});
var NativeWebSocket = _global.WebSocket || _global.MozWebSocket;
var Backoff = require("backo2");
var eventemitter3_1 = require("eventemitter3");
var isString = require("lodash.isstring");
var isObject = require("lodash.isobject");
var printer_1 = require("graphql/language/printer");
var getOperationAST_1 = require("graphql/utilities/getOperationAST");
var protocol_1 = require("./protocol");
var defaults_1 = require("./defaults");
var message_types_1 = require("./message-types");
__export(require("./helpers"));
var SubscriptionClient = (function () {
    function SubscriptionClient(url, options, webSocketImpl) {
        var _a = (options || {}), _b = _a.connectionCallback, connectionCallback = _b === void 0 ? undefined : _b, _c = _a.connectionParams, connectionParams = _c === void 0 ? {} : _c, _d = _a.timeout, timeout = _d === void 0 ? defaults_1.WS_TIMEOUT : _d, _e = _a.reconnect, reconnect = _e === void 0 ? false : _e, _f = _a.reconnectionAttempts, reconnectionAttempts = _f === void 0 ? Infinity : _f, _g = _a.lazy, lazy = _g === void 0 ? false : _g;
        this.wsImpl = webSocketImpl || NativeWebSocket;
        if (!this.wsImpl) {
            throw new Error('Unable to find native implementation, or alternative implementation for WebSocket!');
        }
        this.connectionParams = connectionParams;
        this.connectionCallback = connectionCallback;
        this.url = url;
        this.operations = {};
        this.nextOperationId = 0;
        this.wsTimeout = timeout;
        this.unsentMessagesQueue = [];
        this.reconnect = reconnect;
        this.reconnecting = false;
        this.reconnectionAttempts = reconnectionAttempts;
        this.lazy = !!lazy;
        this.forceClose = false;
        this.backoff = new Backoff({ jitter: 0.5 });
        this.eventEmitter = new eventemitter3_1.EventEmitter();
        this.middlewares = [];
        this.client = null;
        if (!this.lazy) {
            this.connect();
        }
    }
    Object.defineProperty(SubscriptionClient.prototype, "status", {
        get: function () {
            if (this.client === null) {
                return this.wsImpl.CLOSED;
            }
            return this.client.readyState;
        },
        enumerable: true,
        configurable: true
    });
    SubscriptionClient.prototype.close = function (isForced) {
        if (isForced === void 0) { isForced = true; }
        if (this.client !== null) {
            this.forceClose = isForced;
            this.sendMessage(undefined, message_types_1.default.GQL_CONNECTION_TERMINATE, null);
            this.client.close();
            this.client = null;
        }
    };
    SubscriptionClient.prototype.query = function (options) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var handler = function (error, result) {
                if (result) {
                    resolve(result);
                }
                else {
                    reject(error);
                }
            };
            _this.executeOperation(options, handler);
        });
    };
    SubscriptionClient.prototype.subscribe = function (options, handler) {
        var legacyHandler = function (error, result) {
            var operationPayloadData = result && result.data || null;
            var operationPayloadErrors = result && result.errors || null;
            if (error) {
                operationPayloadErrors = error;
                operationPayloadData = null;
            }
            handler(operationPayloadErrors, operationPayloadData);
        };
        if (this.client === null) {
            this.connect();
        }
        if (!handler) {
            throw new Error('Must provide an handler.');
        }
        return this.executeOperation(options, legacyHandler);
    };
    SubscriptionClient.prototype.on = function (eventName, callback, context) {
        var handler = this.eventEmitter.on(eventName, callback, context);
        return function () {
            handler.off(eventName, callback, context);
        };
    };
    SubscriptionClient.prototype.onConnect = function (callback, context) {
        this.logWarningOnNonProductionEnv('This method will become deprecated in the next release. ' +
            'You can use onConnecting and onConnected instead.');
        return this.onConnecting(callback, context);
    };
    SubscriptionClient.prototype.onDisconnect = function (callback, context) {
        this.logWarningOnNonProductionEnv('This method will become deprecated in the next release. ' +
            'You can use onDisconnected instead.');
        return this.onDisconnected(callback, context);
    };
    SubscriptionClient.prototype.onReconnect = function (callback, context) {
        this.logWarningOnNonProductionEnv('This method will become deprecated in the next release. ' +
            'You can use onReconnecting and onReconnected instead.');
        return this.onReconnecting(callback, context);
    };
    SubscriptionClient.prototype.onConnected = function (callback, context) {
        return this.on('connected', callback, context);
    };
    SubscriptionClient.prototype.onConnecting = function (callback, context) {
        return this.on('connecting', callback, context);
    };
    SubscriptionClient.prototype.onDisconnected = function (callback, context) {
        return this.on('disconnected', callback, context);
    };
    SubscriptionClient.prototype.onReconnected = function (callback, context) {
        return this.on('reconnected', callback, context);
    };
    SubscriptionClient.prototype.onReconnecting = function (callback, context) {
        return this.on('reconnecting', callback, context);
    };
    SubscriptionClient.prototype.unsubscribe = function (opId) {
        if (this.operations[opId]) {
            delete this.operations[opId];
            this.sendMessage(opId, message_types_1.default.GQL_STOP, undefined);
        }
    };
    SubscriptionClient.prototype.unsubscribeAll = function () {
        var _this = this;
        Object.keys(this.operations).forEach(function (subId) {
            _this.unsubscribe(subId);
        });
    };
    SubscriptionClient.prototype.applyMiddlewares = function (options) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var queue = function (funcs, scope) {
                var next = function (error) {
                    if (error) {
                        reject(error);
                    }
                    else {
                        if (funcs.length > 0) {
                            var f = funcs.shift();
                            if (f) {
                                f.applyMiddleware.apply(scope, [options, next]);
                            }
                        }
                        else {
                            resolve(options);
                        }
                    }
                };
                next();
            };
            queue(_this.middlewares.slice(), _this);
        });
    };
    SubscriptionClient.prototype.use = function (middlewares) {
        var _this = this;
        middlewares.map(function (middleware) {
            if (typeof middleware.applyMiddleware === 'function') {
                _this.middlewares.push(middleware);
            }
            else {
                throw new Error('Middleware must implement the applyMiddleware function.');
            }
        });
        return this;
    };
    SubscriptionClient.prototype.logWarningOnNonProductionEnv = function (warning) {
        if (process && process.env && process.env.NODE_ENV !== 'production') {
            console.warn(warning);
        }
    };
    SubscriptionClient.prototype.checkOperationOptions = function (options, handler) {
        var query = options.query, variables = options.variables, operationName = options.operationName;
        if (!query) {
            throw new Error('Must provide a query.');
        }
        if (!handler) {
            throw new Error('Must provide an handler.');
        }
        if ((!isString(query) && !getOperationAST_1.getOperationAST(query, operationName)) ||
            (operationName && !isString(operationName)) ||
            (variables && !isObject(variables))) {
            throw new Error('Incorrect option types. query must be a string or a document,' +
                '`operationName` must be a string, and `variables` must be an object.');
        }
    };
    SubscriptionClient.prototype.executeOperation = function (options, handler) {
        var _this = this;
        var opId = this.generateOperationId();
        this.operations[opId] = { options: options, handler: handler };
        this.applyMiddlewares(options)
            .then(function (processedOptions) {
            _this.checkOperationOptions(processedOptions, handler);
            if (_this.operations[opId]) {
                _this.operations[opId] = { options: processedOptions, handler: handler };
                _this.sendMessage(opId, message_types_1.default.GQL_START, processedOptions);
            }
        })
            .catch(function (error) {
            _this.unsubscribe(opId);
            handler(_this.formatErrors(error));
        });
        return opId;
    };
    SubscriptionClient.prototype.buildMessage = function (id, type, payload) {
        var payloadToReturn = payload && payload.query ? __assign({}, payload, { query: typeof payload.query === 'string' ? payload.query : printer_1.print(payload.query) }) :
            payload;
        return {
            id: id,
            type: type,
            payload: payloadToReturn,
        };
    };
    SubscriptionClient.prototype.formatErrors = function (errors) {
        if (Array.isArray(errors)) {
            return errors;
        }
        if (errors && errors.errors) {
            return this.formatErrors(errors.errors);
        }
        if (errors && errors.message) {
            return [errors];
        }
        return [{
                name: 'FormatedError',
                message: 'Unknown error',
                originalError: errors,
            }];
    };
    SubscriptionClient.prototype.sendMessage = function (id, type, payload) {
        this.sendMessageRaw(this.buildMessage(id, type, payload));
    };
    SubscriptionClient.prototype.sendMessageRaw = function (message) {
        switch (this.status) {
            case this.client.OPEN:
                var serializedMessage = JSON.stringify(message);
                var parsedMessage = void 0;
                try {
                    parsedMessage = JSON.parse(serializedMessage);
                }
                catch (e) {
                    throw new Error("Message must be JSON-serializable. Got: " + message);
                }
                this.client.send(serializedMessage);
                break;
            case this.client.CONNECTING:
                this.unsentMessagesQueue.push(message);
                break;
            default:
                if (!this.reconnecting) {
                    throw new Error('A message was not sent because socket is not connected, is closing or ' +
                        'is already closed. Message was: ${JSON.parse(serializedMessage)}.');
                }
        }
    };
    SubscriptionClient.prototype.generateOperationId = function () {
        return String(++this.nextOperationId);
    };
    SubscriptionClient.prototype.tryReconnect = function () {
        var _this = this;
        if (!this.reconnect || this.backoff.attempts > this.reconnectionAttempts) {
            return;
        }
        if (!this.reconnecting) {
            Object.keys(this.operations).forEach(function (key) {
                _this.unsentMessagesQueue.push(_this.buildMessage(key, message_types_1.default.GQL_START, _this.operations[key].options));
            });
            this.reconnecting = true;
        }
        var delay = this.backoff.duration();
        setTimeout(function () {
            _this.connect();
        }, delay);
    };
    SubscriptionClient.prototype.flushUnsentMessagesQueue = function () {
        var _this = this;
        this.unsentMessagesQueue.forEach(function (message) {
            _this.sendMessageRaw(message);
        });
        this.unsentMessagesQueue = [];
    };
    SubscriptionClient.prototype.checkConnection = function () {
        this.wasKeepAliveReceived ? this.wasKeepAliveReceived = false : this.close(false);
    };
    SubscriptionClient.prototype.connect = function () {
        var _this = this;
        this.client = new this.wsImpl(this.url, protocol_1.GRAPHQL_WS);
        this.client.onopen = function () {
            _this.eventEmitter.emit(_this.reconnecting ? 'reconnecting' : 'connecting');
            var payload = typeof _this.connectionParams === 'function' ? _this.connectionParams() : _this.connectionParams;
            _this.sendMessage(undefined, message_types_1.default.GQL_CONNECTION_INIT, payload);
            _this.flushUnsentMessagesQueue();
        };
        this.client.onclose = function () {
            _this.eventEmitter.emit('disconnected');
            if (_this.forceClose) {
                _this.forceClose = false;
            }
            else {
                _this.tryReconnect();
            }
        };
        this.client.onerror = function () {
        };
        this.client.onmessage = function (_a) {
            var data = _a.data;
            _this.processReceivedData(data);
        };
    };
    SubscriptionClient.prototype.processReceivedData = function (receivedData) {
        var parsedMessage;
        var opId;
        try {
            parsedMessage = JSON.parse(receivedData);
            opId = parsedMessage.id;
        }
        catch (e) {
            throw new Error("Message must be JSON-parseable. Got: " + receivedData);
        }
        if ([message_types_1.default.GQL_DATA,
            message_types_1.default.GQL_COMPLETE,
            message_types_1.default.GQL_ERROR,
        ].indexOf(parsedMessage.type) !== -1 && !this.operations[opId]) {
            this.unsubscribe(opId);
            return;
        }
        switch (parsedMessage.type) {
            case message_types_1.default.GQL_CONNECTION_ERROR:
                if (this.connectionCallback) {
                    this.connectionCallback(parsedMessage.payload);
                }
                break;
            case message_types_1.default.GQL_CONNECTION_ACK:
                this.eventEmitter.emit(this.reconnecting ? 'reconnected' : 'connected');
                this.reconnecting = false;
                this.backoff.reset();
                if (this.connectionCallback) {
                    this.connectionCallback();
                }
                break;
            case message_types_1.default.GQL_COMPLETE:
                delete this.operations[opId];
                break;
            case message_types_1.default.GQL_ERROR:
                this.operations[opId].handler(this.formatErrors(parsedMessage.payload), null);
                delete this.operations[opId];
                break;
            case message_types_1.default.GQL_DATA:
                var parsedPayload = !parsedMessage.payload.errors ?
                    parsedMessage.payload : __assign({}, parsedMessage.payload, { errors: this.formatErrors(parsedMessage.payload.errors) });
                this.operations[opId].handler(null, parsedPayload);
                break;
            case message_types_1.default.GQL_CONNECTION_KEEP_ALIVE:
                var firstKA = typeof this.wasKeepAliveReceived === 'undefined';
                this.wasKeepAliveReceived = true;
                if (firstKA) {
                    this.checkConnection();
                }
                if (this.checkConnectionTimeoutId) {
                    clearTimeout(this.checkConnectionTimeoutId);
                }
                this.checkConnectionTimeoutId = setTimeout(this.checkConnection.bind(this), this.wsTimeout);
                break;
            default:
                throw new Error('Invalid message type!');
        }
    };
    return SubscriptionClient;
}());
exports.SubscriptionClient = SubscriptionClient;
//# sourceMappingURL=client.js.map