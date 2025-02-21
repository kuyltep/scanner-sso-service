import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { ExceptionService } from './exception.service';
import { Prisma } from '@prisma/client';
import { UserRegisterDto } from 'src/common/dtos/auth/user.register.dto';
import { DateService } from './date.service';
import {
  UserChangePasswordDto,
  UserUpdateDto,
} from 'src/common/dtos/user/user.update.dto';
import { UserQueryDto } from 'src/common/dtos/user/user.query.dto';
import * as bcrypt from 'bcrypt';
@Injectable()
export class UserService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly exceptionService: ExceptionService,
    private readonly dateService: DateService,
  ) {}

  public async getUsersByQuery(query: UserQueryDto) {
    const usersArgs = {
      where: {
        subscription: {
          template: {},
        },
      },
      skip: query.page_number * query.page_size,
      take: query.page_size,
    } as Prisma.UserFindManyArgs;

    if (query.subscription_status) {
      usersArgs.where.subscription = {
        status: query.subscription_status,
      };
    }

    if (query.subscription_type) {
      usersArgs.where.subscription = {
        template: {
          type: query.subscription_type,
        },
      };
    }

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
    } as Prisma.UserFindFirstArgs;
    const user = await this.prismaService.user.findFirst(userArgs);
    !isSelectPassword ? delete user.password : null;
    return user;
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

    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(userRegisterDto.password, salt);

    const userCreateArgs = {
      data: {
        ...userRegisterDto,
        password: hash,
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
      omit: {
        password: true,
      },
    });
  }

  public async changePassword(
    id: string,
    changePasswordDto: UserChangePasswordDto,
  ) {
    const user = await this.getUserByUnique(id, true);

    const isCompare = await bcrypt.compare(
      changePasswordDto.old_password,
      user.password,
    );

    if (!isCompare) {
      throw this.exceptionService.unauthorizedException(
        'Invalid password was provided',
      );
    }

    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(changePasswordDto.new_password, salt);

    await this.prismaService.user.update({
      where: {
        id,
      },
      data: {
        password: hash,
      },
    });
    return { message: 'ok' };
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
