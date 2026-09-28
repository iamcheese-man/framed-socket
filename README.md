# framed-socket

A module that wraps the existing module `frame-stream` to make raw TCP easier to work with.

## Credits

# [frame-stream module, made by rkusa and davedoesdev on the NPMJS website.](https://www.npmjs.com/package/frame-stream)

## Installation
```bash
npm install framed-socket
```

## Usage OF the module

```javascript
const net = require('net');
const FramedSocket = require('framed-socket');
const port = 81;
const host = '0.0.0.0'

const server = net.createServer((rawSocket) => {
    const socket = new FramedSocket(rawSocket);

    socket.on('message', (msg) => {
        console.log('Received from client: ', msg);
        socket.write(`You sent: ${msg}`);
    });

    socket.on('close', () => {
        console.log(`A client has disconnected.`)
    });
});

server.listen(port, host, () => { console.log('Server is running.') });
```
