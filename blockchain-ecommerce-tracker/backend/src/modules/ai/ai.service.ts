import { Injectable, Logger } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { PrismaService } from '../database/prisma.service';
import { OpenAI } from 'openai';
import { Anthropic } from '@anthropic-ai/sdk';

@Injectable()
export class AIService {
  private readonly logger = new Logger(AIService.name);
  private openai: OpenAI;
  private anthropic: Anthropic;

  constructor(
    @InjectQueue('ai-queue') private aiQueue: Queue,
    private prisma: PrismaService,
  ) {
    this.initializeProviders();
  }

  private initializeProviders() {
    if (process.env.OPENAI_API_KEY) {
      this.openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
      });
    }

    if (process.env.ANTHROPIC_API_KEY) {
      this.anthropic = new Anthropic({
        apiKey: process.env.ANTHROPIC_API_KEY,
      });
    }
  }

  async queueJob(data: {
    type: string;
    input: any;
    userId?: string;
  }) {
    const job = await this.aiQueue.add('process-ai-job', data, {
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 2000,
      },
    });

    // Store job in database
    await this.prisma.aIJob.create({
      data: {
        userId: data.userId,
        type: data.type as any,
        input: data.input,
        prompt: this.getPromptTemplate(data.type),
        status: 'PENDING',
      },
    });

    return job;
  }

  async generateSummary(content: string, images?: string[]) {
    if (!this.openai) {
      return this.generateFallbackSummary(content);
    }

    try {
      const prompt = `Summarize this initiative update in 2-3 sentences, highlighting key progress and impact:

${content}

${images ? `Images described: ${images.join(', ')}` : ''}

Provide a concise, engaging summary that would be suitable for a progress report.`;

      const response = await this.openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 150,
        temperature: 0.7,
      });

      return response.choices[0].message.content;
    } catch (error) {
      this.logger.error('Failed to generate AI summary:', error);
      return this.generateFallbackSummary(content);
    }
  }

  async extractTags(content: string) {
    if (!this.openai) {
      return this.extractFallbackTags(content);
    }

    try {
      const prompt = `Extract up to 10 relevant tags from this content. Return only the tags, separated by commas:

${content}`;

      const response = await this.openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 100,
        temperature: 0.3,
      });

      return response.choices[0].message.content.split(',').map(tag => tag.trim());
    } catch (error) {
      this.logger.error('Failed to extract tags:', error);
      return this.extractFallbackTags(content);
    }
  }

  async generateRecommendations(userId: string, limit: number = 5) {
    // Get user's purchase history and preferences
    const userPurchases = await this.prisma.purchase.findMany({
      where: { userId },
      include: { initiative: true },
    });

    // Simple recommendation logic - could be enhanced with ML
    const allInitiatives = await this.prisma.initiative.findMany({
      where: { status: 'IN_PROGRESS' },
    });

    const userInitiativeIds = userPurchases.map(p => p.initiativeId);
    const recommendations = allInitiatives
      .filter(i => !userInitiativeIds.includes(i.id))
      .slice(0, limit);

    return recommendations;
  }

  async searchInitiatives(query: string, limit: number = 10) {
    // Simple text search - could be enhanced with vector embeddings
    const initiatives = await this.prisma.initiative.findMany({
      where: {
        OR: [
          { title: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } },
          { region: { contains: query, mode: 'insensitive' } },
        ],
      },
      take: limit,
    });

    return initiatives;
  }

  private getPromptTemplate(type: string): string {
    const templates = {
      SUMMARIZE_UPDATE: 'Summarize this initiative update in 2-3 sentences, highlighting key progress and impact.',
      EXTRACT_TAGS: 'Extract up to 10 relevant tags from this content. Return only the tags, separated by commas.',
      ANALYZE_IMAGE: 'Analyze this image and provide a description of what you see.',
      MODERATE_CONTENT: 'Review this content for inappropriate language or harmful content.',
      OCR_EXTRACTION: 'Extract text from this image using OCR.',
    };

    return templates[type] || 'Process this content using AI.';
  }

  private generateFallbackSummary(content: string): string {
    const words = content.split(' ');
    const firstWords = words.slice(0, 20).join(' ');
    return `${firstWords}...`;
  }

  private extractFallbackTags(content: string): string[] {
    // Simple keyword extraction
    const words = content.toLowerCase().split(/\W+/);
    const commonWords = new Set(['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by']);
    const keywords = words.filter(word => word.length > 3 && !commonWords.has(word));
    
    // Return unique keywords, limited to 10
    return [...new Set(keywords)].slice(0, 10);
  }
}
