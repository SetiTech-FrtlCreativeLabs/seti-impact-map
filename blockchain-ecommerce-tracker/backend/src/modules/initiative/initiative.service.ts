import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { AIService } from '../ai/ai.service';
import { RealtimeGateway } from '../realtime/realtime.gateway';

@Injectable()
export class InitiativeService {
  private readonly logger = new Logger(InitiativeService.name);

  constructor(
    private prisma: PrismaService,
    private aiService: AIService,
    private realtimeGateway: RealtimeGateway,
  ) {}

  async getAllInitiatives() {
    return this.prisma.initiative.findMany({
      include: {
        updates: {
          orderBy: { createdAt: 'desc' },
          take: 5,
        },
        _count: {
          select: { purchases: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getInitiativeById(id: string) {
    return this.prisma.initiative.findUnique({
      where: { id },
      include: {
        updates: {
          orderBy: { createdAt: 'desc' },
        },
        purchases: {
          include: {
            user: {
              select: { id: true, name: true, email: true },
            },
          },
        },
        _count: {
          select: { purchases: true },
        },
      },
    });
  }

  async getInitiativeBySlug(slug: string) {
    return this.prisma.initiative.findUnique({
      where: { slug },
      include: {
        updates: {
          orderBy: { createdAt: 'desc' },
        },
        _count: {
          select: { purchases: true },
        },
      },
    });
  }

  async createInitiative(data: {
    title: string;
    description: string;
    lat: number;
    lng: number;
    region: string;
    groupId?: string;
    metadata?: any;
  }) {
    const slug = data.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    
    return this.prisma.initiative.create({
      data: {
        ...data,
        slug,
      },
    });
  }

  async updateInitiative(id: string, data: any) {
    return this.prisma.initiative.update({
      where: { id },
      data,
    });
  }

  async createInitiativeUpdate(data: {
    initiativeId: string;
    authorId: string;
    type: string;
    content: string;
    images?: string[];
  }) {
    const update = await this.prisma.initiativeUpdate.create({
      data: {
        ...data,
        published: true,
      },
      include: {
        author: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    // Queue AI job for summary and tags
    await this.aiService.queueJob({
      type: 'SUMMARIZE_UPDATE',
      input: {
        content: data.content,
        images: data.images,
        updateId: update.id,
      },
    });

    await this.aiService.queueJob({
      type: 'EXTRACT_TAGS',
      input: {
        content: data.content,
        updateId: update.id,
      },
    });

    // Broadcast real-time update
    this.realtimeGateway.broadcastInitiativeUpdate(data.initiativeId, update);

    return update;
  }

  async getInitiativeUpdates(initiativeId: string) {
    return this.prisma.initiativeUpdate.findMany({
      where: { initiativeId, published: true },
      include: {
        author: {
          select: { id: true, name: true, email: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async searchInitiatives(query: string) {
    return this.prisma.initiative.findMany({
      where: {
        OR: [
          { title: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } },
          { region: { contains: query, mode: 'insensitive' } },
        ],
      },
      include: {
        _count: {
          select: { purchases: true },
        },
      },
    });
  }
}
