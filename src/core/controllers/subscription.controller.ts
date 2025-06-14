import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { SubscriptionService } from '../services/subscription.service';
import {
  ApiBearerAuth,
  ApiBody,
  ApiExtraModels,
  ApiOperation,
  ApiParam,
  ApiResponse,
  getSchemaPath,
} from '@nestjs/swagger';
import {
  GetSubscriptionDto,
  GetSubscriptionsDto,
} from 'src/common/dtos/subscription/get.subscription.dto';
import {
  ChangeTemplateSubscriptionDto,
  UpdateSubscriptionDto,
} from 'src/common/dtos/subscription/update.subscription.dto';
import { CreateSubscriptionDto } from 'src/common/dtos/subscription/create.subscription.dto';
import {
  QuerySubscriptionDto,
  QuerySubscriptionRenewDto,
} from 'src/common/dtos/subscription/query.subscription.dto';
import { Roles } from '../decorators/role.decorator';
import { Role } from 'src/common/enums/role.enum';

@ApiExtraModels(
  GetSubscriptionDto,
  UpdateSubscriptionDto,
  CreateSubscriptionDto,
  GetSubscriptionsDto,
  ChangeTemplateSubscriptionDto,
)
@ApiBearerAuth('access-token')
@Controller('subscriptions')
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  @Roles(Role.ADMIN)
  @Get()
  @ApiOperation({ summary: 'Получить все подписки' })
  @ApiResponse({
    status: 200,
    description: 'Список подписок',
    isArray: true,
    schema: {
      items: {
        $ref: getSchemaPath(GetSubscriptionsDto),
      },
    },
  })
  async getAllSubscriptions(@Query() query: QuerySubscriptionDto) {
    return await this.subscriptionService.getAllSubscriptions(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Получить подписку по ID' })
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
    description: 'ID подписки',
  })
  @ApiResponse({
    status: 200,
    description: 'Подписка',
    schema: {
      $ref: getSchemaPath(GetSubscriptionDto),
    },
  })
  @ApiResponse({ status: 404, description: 'Подписка не найдена' })
  async getSubscriptionById(@Param('id') id: string) {
    return await this.subscriptionService.getSubscriptionById(id);
  }

  @Post()
  @ApiOperation({ summary: 'Создать новую подписку' })
  @ApiBody({ type: CreateSubscriptionDto })
  @ApiResponse({
    status: 201,
    description: 'Подписка создана',
    schema: {
      $ref: getSchemaPath(GetSubscriptionsDto),
    },
  })
  async createSubscription(@Body() createDto: CreateSubscriptionDto) {
    return await this.subscriptionService.createSubscription(createDto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('/:id/check-scans')
  @ApiParam({
    name: 'id',
    required: true,
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'Количество сканирований успешно уменьшено',
  })
  @ApiResponse({ status: 403, description: 'Подписка неактивна' })
  @ApiResponse({ status: 429, description: 'Лимит сканирований исчерпан' })
  @ApiResponse({ status: 404, description: 'Подписка не найдена' })
  public async checkScans(@Param('id') id: string) {
    return await this.subscriptionService.checkAndDecrementScans(id);
  }

  @Roles(Role.ADMIN)
  @Patch(':id/template')
  @ApiOperation({ summary: 'Изменить шаблон подписки' })
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
    description: 'ID подписки',
  })
  @ApiBody({
    schema: {
      $ref: getSchemaPath(ChangeTemplateSubscriptionDto),
    },
  })
  @ApiResponse({ status: 200, description: 'Подписка успешно обновлена' })
  @ApiResponse({ status: 404, description: 'Подписка или шаблон не найдены' })
  async changeSubscriptionTemplate(
    @Param('id') id: string,
    @Body() body: ChangeTemplateSubscriptionDto,
  ) {
    return this.subscriptionService.changeSubscriptionTemplate(
      id,
      body.template_id,
    );
  }

  @Roles(Role.ADMIN)
  @Patch(':id')
  @ApiOperation({ summary: 'Обновить подписку' })
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
    description: 'ID подписки',
  })
  @ApiBody({ type: UpdateSubscriptionDto })
  @ApiResponse({
    status: 200,
    description: 'Подписка обновлена',
  })
  @ApiResponse({ status: 404, description: 'Подписка не найдена' })
  async updateSubscription(
    @Param('id') id: string,
    @Body() updateDto: UpdateSubscriptionDto,
  ) {
    return await this.subscriptionService.updateSubscription(id, updateDto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('renew')
  @ApiOperation({ summary: 'Продлить подписки по параметрам' })
  @ApiResponse({
    status: 200,
    description: 'Подписки продлены',
  })
  public async renewSubscriptions(@Query() query: QuerySubscriptionRenewDto) {
    return await this.subscriptionService.renewSubscriptions(query);
  }

  @HttpCode(HttpStatus.OK)
  @Post(':id/renew')
  @ApiOperation({ summary: 'Продлить подписку' })
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
    description: 'ID подписки',
  })
  @ApiResponse({
    status: 200,
    description: 'Подписка продлена',
    schema: {
      $ref: getSchemaPath(GetSubscriptionsDto),
    },
  })
  @ApiResponse({ status: 404, description: 'Подписка не найдена' })
  async renewSubscription(@Param('id') id: string) {
    return await this.subscriptionService.renewSubscription(id);
  }
}
