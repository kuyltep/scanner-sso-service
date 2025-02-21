import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { UpdateSubscriptionDto } from 'src/common/dtos/subscription/update.subscription.dto';
import { CreateSubscriptionDto } from 'src/common/dtos/subscription/create.subscription.dto';
import { DateService } from './date.service';
import {
  QuerySubscriptionDto,
  QuerySubscriptionRenewDto,
} from 'src/common/dtos/subscription/query.subscription.dto';
import { Prisma } from '@prisma/client';
import { ExceptionService } from './exception.service';

@Injectable()
export class SubscriptionService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly dateService: DateService,
    private readonly exceptionService: ExceptionService,
  ) {}

  public async getAllSubscriptions(query: QuerySubscriptionDto) {
    const subscriptionsArgs = {
      where: {
        template: {},
      },
      skip: query.page_number * query.page_size,
      take: query.page_size,
    } as Prisma.SubscriptionFindManyArgs;

    if (query.status) {
      subscriptionsArgs.where.status = query.status;
    }

    if (query.type) {
      subscriptionsArgs.where.template.type = query.type;
    }

    return await this.prismaService.subscription.findMany(subscriptionsArgs);
  }

  public async getSubscriptionById(id: string) {
    return await this.prismaService.subscription.findUnique({
      where: {
        id,
      },
      include: {
        template: true,
      },
    });
  }

  public async createSubscription(createDto: CreateSubscriptionDto) {
    const { template_id, ...data } = createDto;
    return await this.prismaService.subscription.create({
      data: {
        ...data,
        end_date: data.end_date || this.dateService.getDateWithOffset(0, 1, 0),
        template_id,
      },
    });
  }

  public async updateSubscription(
    id: string,
    updateDto: UpdateSubscriptionDto,
  ) {
    return await this.prismaService.subscription.update({
      where: { id },
      data: {
        ...updateDto,
      },
    });
  }

  public async renewSubscriptions(query: QuerySubscriptionRenewDto) {
    const subscriptionsArgs = {
      where: {
        template: {},
      },
      select: {
        id: true,
        template_id: true,
      },
    } as Prisma.SubscriptionFindManyArgs;
    query.ids.length
      ? (subscriptionsArgs.where.id = {
          in: query.ids,
        })
      : (subscriptionsArgs.where.end_date = {
          lte: this.dateService.getCurrentDate(),
        });

    query.status ? (subscriptionsArgs.where.status = query.status) : null;
    query.type ? (subscriptionsArgs.where.template.type = query.type) : null;
    const subscriptions =
      await this.prismaService.subscription.findMany(subscriptionsArgs);

    const groupedByTemplate: Record<string, string[]> = {};
    for (const subscription of subscriptions) {
      if (!groupedByTemplate[subscription.template_id]) {
        groupedByTemplate[subscription.template_id] = [];
      }
      groupedByTemplate[subscription.template_id].push(subscription.id);
    }

    const templateIds = Object.keys(groupedByTemplate);
    const templates = await this.prismaService.subscriptionTemplate.findMany({
      where: {
        id: { in: templateIds },
      },
      select: {
        id: true,
        limit: true,
      },
    });

    const templateLimits: Record<string, number> = {};
    for (const template of templates) {
      templateLimits[template.id] = template.limit;
    }

    const updates = [];
    for (const templateId of templateIds) {
      const subscriptionIds = groupedByTemplate[templateId];
      const limit = templateLimits[templateId];

      if (limit !== undefined) {
        updates.push(
          this.prismaService.subscription.updateMany({
            where: {
              id: { in: subscriptionIds },
            },
            data: {
              status: 'ACTIVE',
              scans: limit,
              start_date: this.dateService.getCurrentDate(),
              end_date: this.dateService.getDateWithOffset(0, 1, 0),
            },
          }),
        );
      }
    }

    await this.prismaService.$transaction(updates);
    return { message: 'ok' };
  }

  public async renewSubscription(id: string) {
    const template = await this.prismaService.subscriptionTemplate.findFirst({
      where: {
        subscriptions: {
          some: {
            id,
          },
        },
      },
      select: {
        limit: true,
      },
    });

    return await this.prismaService.subscription.update({
      where: {
        id,
      },
      data: {
        status: 'ACTIVE',
        scans: template.limit,
        start_date: this.dateService.getCurrentDate(),
        end_date: this.dateService.getDateWithOffset(0, 1, 0),
      },
    });
  }

  public async changeSubscriptionTemplate(
    subscriptionId: string,
    newTemplateId: string,
  ) {
    const newTemplate =
      await this.prismaService.subscriptionTemplate.findUnique({
        where: { id: newTemplateId },
        select: { limit: true },
      });

    if (!newTemplate) {
      throw this.exceptionService.notFoundError('Template not found');
    }

    return await this.prismaService.subscription.update({
      where: { id: subscriptionId },
      data: {
        template_id: newTemplateId,
        scans: newTemplate.limit,
        start_date: this.dateService.getCurrentDate(),
        end_date: this.dateService.getDateWithOffset(0, 1, 0),
        status: 'ACTIVE',
      },
    });
  }
}
