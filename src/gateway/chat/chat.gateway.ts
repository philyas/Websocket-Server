import { WebSocketGateway, OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server , WebSocket} from 'ws';


@WebSocketGateway()
export class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  private server: Server;

  afterInit() {
    this.server = new Server({ port: 3001 }); // Create a new WebSocket server on port 3001
    this.server.on('connection', this.handleConnection.bind(this));
    console.log('WebSocket server initialized');
  }

  handleConnection(client: WebSocket) {
    console.log('Client connected');
    client.on('message', (message: string) => this.handleMessage(client, message));
    client.on('close', () => this.handleDisconnect(client));
  }

  handleDisconnect(client: WebSocket) {
    console.log('Client disconnected');
  }

  handleMessage(client: WebSocket, message: string) {
    console.log('Message received:', message);
    this.server.clients.forEach((connectedClient) => {
      if (connectedClient.readyState === WebSocket.OPEN) {
        connectedClient.send(`Message from server: ${message}`);
      }
    });
  }
}
