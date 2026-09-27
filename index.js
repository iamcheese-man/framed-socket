const { EventEmitter } = require('events');
const frame = require('frame-stream');

class FramedSocket extends EventEmitter {
    constructor(rawSocket) {
        super();
        this.socket = rawSocket;
        this.encoder = frame.encode();
        this.decoder = frame.decode();

        rawSocket.pipe(this.decoder);
        this.encoder.pipe(rawSocket);

        this.decoder.on('data', (msg) => {
            this.emit('message', msg.toString());
        });

        rawSocket.on('error', (err) => this.emit('error', err));
        rawSocket.on('close', (hadErr) => this.emit('close', hadErr));
    }

    write(text) {
        this.encoder.write(text);
    }

    end(text) {
        if (text !== undefined) {
            this.encoder.end(text);
        } else {
            this.encoder.end();
        }
    }
}

module.exports = FramedSocket;