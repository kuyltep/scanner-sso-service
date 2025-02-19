import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { ExceptionService } from './exception.service';
import { Prisma } from '@prisma/client';
import { UserRegisterDto } from 'src/common/dtos/auth/user.register.dto';
import { DateService } from './date.service';

@Injectable()
export class UserService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly exceptionService: ExceptionService,
    private readonly dateService: DateService,
  ) {}

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
}
