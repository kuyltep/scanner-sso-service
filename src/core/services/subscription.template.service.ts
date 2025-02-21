import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { CreateSubscriptionTemplateDto } from 'src/common/dtos/subscription-template/create.subscription-template.dto';
import { UpdateSubscriptionTemplateDto } from 'src/common/dtos/subscription-template/update.subscription.dto';
import { SubscriptionTemplateQueryDto } from 'src/common/dtos/subscription-template/query.subscription.template.dto';
import { filterUndefined } from 'src/common/utils/filterUndefined';
import { Prisma } from '@prisma/client';

@Injectable()
export class SubscriptionTemplateService {
  constructor(private readonly prismaService: PrismaService) {}
  async getAllTemplates(query: SubscriptionTemplateQueryDto) {
    const filteredQuery = filterUndefined(query);
    const templatesArgs = {
      where: {
        limit: {},
        price: {},
      },
      skip: query.page_number * query.page_size,
    } as Prisma.SubscriptionTemplateFindManyArgs;

    if (filteredQuery.version) {
      templatesArgs.where.version = filteredQuery.version;
    }
    if (filteredQuery.type) {
      templatesArgs.where.type = filteredQuery.type;
    }
    if (filteredQuery.min_limit || filteredQuery.max_limit) {
      const limitObject = {} as Prisma.IntFilter;
      filteredQuery.min_limit
        ? (limitObject.gte = filteredQuery.min_limit)
        : null;
      filteredQuery.max_limit
        ? (limitObject.lte = filteredQuery.max_limit)
        : null;
      templatesArgs.where.limit = limitObject;
    }

    if (filteredQuery.min_price || filteredQuery.max_price) {
      const priceObject = {} as Prisma.FloatFilter;
      filteredQuery.min_price
        ? (priceObject.gte = filteredQuery.min_price)
        : null;
      filteredQuery.max_price
        ? (priceObject.lte = filteredQuery.max_price)
        : null;

      templatesArgs.where.price = priceObject;
    }

    return this.prismaService.subscriptionTemplate.findMany(templatesArgs);
  }

  async getTemplateById(id: string) {
    return this.prismaService.subscriptionTemplate.findUnique({
      where: { id },
    });
  }

  async createTemplate(createDto: CreateSubscriptionTemplateDto) {
    return this.prismaService.subscriptionTemplate.create({ data: createDto });
  }

  async updateTemplate(id: string, updateDto: UpdateSubscriptionTemplateDto) {
    return this.prismaService.subscriptionTemplate.update({
      where: { id },
      data: updateDto,
    });
  }

  async deleteTemplate(id: string) {
    await this.prismaService.subscriptionTemplate.delete({ where: { id } });
    return { message: 'ok' };
  }
}
