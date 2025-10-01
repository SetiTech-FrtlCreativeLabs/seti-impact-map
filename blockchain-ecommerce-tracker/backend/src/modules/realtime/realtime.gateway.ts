import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';

@WebSocketGateway({
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  },
})
export class RealtimeGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(RealtimeGateway.name);

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('join-initiative')
  handleJoinInitiative(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { initiativeId: string },
  ) {
    client.join(`initiative:${data.initiativeId}`);
    this.logger.log(`Client ${client.id} joined initiative ${data.initiativeId}`);
  }

  @SubscribeMessage('leave-initiative')
  handleLeaveInitiative(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { initiativeId: string },
  ) {
    client.leave(`initiative:${data.initiativeId}`);
    this.logger.log(`Client ${client.id} left initiative ${data.initiativeId}`);
  }

  // Broadcast methods for server-side events
  broadcastInitiativeUpdate(initiativeId: string, update: any) {
    this.server.to(`initiative:${initiativeId}`).emit('initiative:update', update);
    this.logger.log(`Broadcasted update for initiative ${initiativeId}`);
  }

  broadcastPurchaseUpdate(userId: string, purchase: any) {
    this.server.to(`user:${userId}`).emit('purchase:update', purchase);
    this.logger.log(`Broadcasted purchase update for user ${userId}`);
  }

  broadcastNotification(userId: string, notification: any) {
    this.server.to(`user:${userId}`).emit('notification:new', notification);
    this.logger.log(`Broadcasted notification to user ${userId}`);
  }
}
