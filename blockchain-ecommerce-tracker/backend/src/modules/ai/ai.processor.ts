import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { Logger } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { AIService } from './ai.service';

@Processor('ai-queue')
export class AIProcessor {
  private readonly logger = new Logger(AIProcessor.name);

  constructor(
    private prisma: PrismaService,
    private aiService: AIService,
  ) {}

  @Process('process-ai-job')
  async handleAIJob(job: Job) {
    const { type, input, userId } = job.data;
    
    try {
      this.logger.log(`Processing AI job: ${type}`);

      // Update job status to processing
      await this.updateJobStatus(job.id.toString(), 'PROCESSING');

      let result;
      switch (type) {
        case 'SUMMARIZE_UPDATE':
          result = await this.aiService.generateSummary(input.content, input.images);
          break;
        case 'EXTRACT_TAGS':
          result = await this.aiService.extractTags(input.content);
          break;
        case 'GENERATE_RECOMMENDATIONS':
          result = await this.aiService.generateRecommendations(userId, input.limit);
          break;
        case 'MODERATE_CONTENT':
          result = await this.moderateContent(input.content);
          break;
        case 'OCR_EXTRACTION':
          result = await this.extractTextFromImage(input.imageUrl);
          break;
        default:
          throw new Error(`Unknown AI job type: ${type}`);
      }

      // Update job with result
      await this.updateJobStatus(job.id.toString(), 'COMPLETED', result);

      this.logger.log(`AI job ${type} completed successfully`);
    } catch (error) {
      this.logger.error(`AI job ${type} failed:`, error);
      await this.updateJobStatus(job.id.toString(), 'FAILED', null, error.message);
      throw error;
    }
  }

  private async moderateContent(content: string): Promise<{ isAppropriate: boolean; reason?: string }> {
    // Simple content moderation - could be enhanced with AI
    const inappropriateWords = ['spam', 'scam', 'fake'];
    const lowerContent = content.toLowerCase();
    
    for (const word of inappropriateWords) {
      if (lowerContent.includes(word)) {
        return { isAppropriate: false, reason: `Contains inappropriate content: ${word}` };
      }
    }
    
    return { isAppropriate: true };
  }

  private async extractTextFromImage(imageUrl: string): Promise<string> {
    // OCR implementation would go here
    // For now, return mock text
    return 'Mock OCR text extraction result';
  }

  private async updateJobStatus(jobId: string, status: string, result?: any, error?: string) {
    try {
      await this.prisma.aIJob.update({
        where: { id: jobId },
        data: {
          status: status as any,
          output: result,
          response: error,
        },
      });
    } catch (error) {
      this.logger.error('Failed to update job status:', error);
    }
  }
}
