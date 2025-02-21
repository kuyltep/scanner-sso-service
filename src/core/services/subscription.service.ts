import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Injectable()
export class SubscriptionService {
  constructor(private readonly prismaService: PrismaService) {}
}
