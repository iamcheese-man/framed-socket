const { EventEmitter } = require('events');
const frame = require('./frame-stream');

class FramedSocket extends EventEmitter {
    constructor(rawSocket) {
        super();
        this.socket = rawSocket;
        this.encoder = frame.encode();
        this.decoder = frame.decode();
        this._encoding = null;

        rawSocket.pipe(this.decoder);
        this.encoder.pipe(rawSocket);

        this.decoder.on('data', (msg) => {
            this.emit('message', this._encoding ? msg.toString(this._encoding) : msg);
        });

        rawSocket.on('error', (err) => this.emit('error', err));
        rawSocket.on('close', (hadErr) => this.emit('close', hadErr));
        rawSocket.on('drain', () => this.emit('drain'));
        rawSocket.on('connect', () => this.emit('connect'));
        rawSocket.on('connectionAttempt', (ip, port, family) => this.emit('connectionAttempt', ip, port, family));
        rawSocket.on('connectionAttemptFailed', (ip, port, family, error) => this.emit('connectionAttemptFailed', ip, port, family, error));
        rawSocket.on('connectionAttemptTimeout', (ip, port, family) => this.emit('connectionAttemptTimeout', ip, port, family));
        rawSocket.on('end', () => this.emit('end'));
        rawSocket.on('lookup', (err, address, family, host) => this.emit('lookup', err, address, family, host));
        rawSocket.on('ready', () => this.emit('ready'));
        rawSocket.on('timeout', () => this.emit('timeout'));
    }

    write(data) {
        this.encoder.write(data);
    }

    end(data) {
        if (data !== undefined) {
            this.encoder.end(data);
        } else {
            this.encoder.end();
        }
    }

    address() {
        return this.socket.address();
    }

    connect(...args) {
        return this.socket.connect(...args);
    }

    destroy(error) {
        return this.socket.destroy(error);
    }

    destroySoon() {
        return this.socket.destroySoon();
    }

    pause() {
        return this.socket.pause();
    }

    ref() {
        return this.socket.ref();
    }

    resume() {
        return this.socket.resume();
    }

    setEncoding(encoding) {
        // applied to decoded msgs, not the raw socket, since raw bytes never reach the caller directly,  they go through the decoder first
    
        this._encoding = encoding;
        return this;
    }

    setKeepAlive(enable, initialDelay) {
        return this.socket.setKeepAlive(enable, initialDelay);
    }

    setNoDelay(noDelay) {
        return this.socket.setNoDelay(noDelay);
    }

    setTimeout(timeout, callback) {
        return this.socket.setTimeout(timeout, callback);
    }

    unref() {
        return this.socket.unref();
    }
}

module.exports = FramedSocket;
