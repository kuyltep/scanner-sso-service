import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { ExceptionService } from './exception.service';
import { Prisma } from '@prisma/client';
import { UserRegisterDto } from 'src/common/dtos/auth/user.register.dto';
import { DateService } from './date.service';
import { UserUpdateDto } from 'src/common/dtos/user/user.update.dto';
import { UserQueryDto } from 'src/common/dtos/user/user.query.dto';

@Injectable()
export class UserService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly exceptionService: ExceptionService,
    private readonly dateService: DateService,
  ) {}

  public async getUsersByQuery(query: UserQueryDto) {
    const usersArgs = {
      skip: query.page_number * query.page_size,
      take: query.page_size,
    } as Prisma.UserFindManyArgs;

    query.subscription_id
      ? (usersArgs.where.subscription_id = query.subscription_id)
      : null;

    query.subscription_status
      ? (usersArgs.where.subscription.status = query.subscription_status)
      : null;

    query.subscription_type
      ? (usersArgs.where.subscription.template.type = query.subscription_type)
      : null;

    return await this.prismaService.user.findMany(usersArgs);
  }

  public async getUserByUnique(
    unique: string,
    isSelectPassword: boolean = true,
  ) {
    const userArgs = {
      where: {
        OR: [{ email: unique }, { username: unique }],
      },
    } as Prisma.UserFindUniqueArgs;
    !isSelectPassword ? (userArgs.select.password = false) : null;
    return await this.prismaService.user.findUnique(userArgs);
  }

  public async createUser(userRegisterDto: UserRegisterDto) {
    const lastCreatedFreeTemplate =
      await this.prismaService.subscriptionTemplate.findFirst({
        orderBy: {
          created_at: 'desc',
        },
        take: 1,
        select: {
          id: true,
          limit: true,
        },
      });

    const userCreateArgs = {
      data: {
        ...userRegisterDto,
        subscription: {
          create: {
            end_date: this.dateService.getDateWithOffsetWithoutTime(0, -1, 0),
            scans: lastCreatedFreeTemplate.limit,
            template: {
              connect: { id: lastCreatedFreeTemplate.id },
            },
          },
        },
      },
    } as Prisma.UserCreateArgs;
    await this.prismaService.user.create(userCreateArgs);

    return { message: 'ok' };
  }

  public async getUserById(id: string) {
    return await this.prismaService.user.findUnique({
      where: {
        id,
      },
      include: {
        subscription: {
          include: {
            template: true,
          },
        },
      },
    });
  }

  public async updateUserById(id: string, updateUserData: UserUpdateDto) {
    return await this.prismaService.user.update({
      where: {
        id,
      },
      data: {
        ...updateUserData,
      },
    });
  }

  public async deleteUserById(id: string) {
    await this.prismaService.user.delete({
      where: {
        id,
      },
    });

    return { message: 'ok' };
  }
}
