import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { SubscriptionTemplateService } from '../services/subscription.template.service';
import {
  ApiBody,
  ApiExtraModels,
  ApiOperation,
  ApiParam,
  ApiResponse,
  getSchemaPath,
} from '@nestjs/swagger';
import { CreateSubscriptionTemplateDto } from 'src/common/dtos/subscription-template/create.subscription-template.dto';
import { UpdateSubscriptionTemplateDto } from 'src/common/dtos/subscription-template/update.subscription.dto';
import { GetSubscriptionTemplateDto } from 'src/common/dtos/subscription-template/get.subscription.template.dto';
import { SubscriptionTemplateQueryDto } from 'src/common/dtos/subscription-template/query.subscription.template.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Roles } from '../decorators/role.decorator';
import { Role } from 'src/common/enums/role.enum';

@ApiBearerAuth('access-token')
@ApiExtraModels(GetSubscriptionTemplateDto, CreateSubscriptionTemplateDto)
@Controller('subscription-template')
export class SubscriptionTemplateController {
  constructor(
    private readonly subscriptionTemplateService: SubscriptionTemplateService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Получить все шаблоны подписок' })
  @ApiResponse({
    status: 200,
    description: 'Список шаблонов подписок',
    isArray: true,
    schema: {
      items: {
        $ref: getSchemaPath(GetSubscriptionTemplateDto),
      },
    },
  })
  async getAllTemplates(@Query() query: SubscriptionTemplateQueryDto) {
    return this.subscriptionTemplateService.getAllTemplates(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Получить шаблон подписки по ID' })
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
    description: 'ID шаблона подписки',
  })
  @ApiResponse({
    status: 200,
    description: 'Шаблон подписки',
    schema: {
      $ref: getSchemaPath(GetSubscriptionTemplateDto),
    },
  })
  @ApiResponse({ status: 404, description: 'Шаблон не найден' })
  async getTemplateById(@Param('id') id: string) {
    return this.subscriptionTemplateService.getTemplateById(id);
  }

  @Roles(Role.ADMIN)
  @Post()
  @ApiOperation({ summary: 'Создать новый шаблон подписки' })
  @ApiBody({ type: CreateSubscriptionTemplateDto })
  @ApiResponse({
    status: 201,
    description: 'Шаблон создан',
    schema: {
      $ref: getSchemaPath(GetSubscriptionTemplateDto),
    },
  })
  async createTemplate(@Body() createDto: CreateSubscriptionTemplateDto) {
    return this.subscriptionTemplateService.createTemplate(createDto);
  }

  @Roles(Role.ADMIN)
  @Patch(':id')
  @ApiOperation({ summary: 'Обновить шаблон подписки' })
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
    description: 'ID шаблона подписки',
  })
  @ApiBody({ type: UpdateSubscriptionTemplateDto })
  @ApiResponse({
    status: 200,
    description: 'Шаблон обновлен',
    schema: {
      $ref: getSchemaPath(GetSubscriptionTemplateDto),
    },
  })
  @ApiResponse({ status: 404, description: 'Шаблон не найден' })
  async updateTemplate(
    @Param('id') id: string,
    @Body() updateDto: UpdateSubscriptionTemplateDto,
  ) {
    return this.subscriptionTemplateService.updateTemplate(id, updateDto);
  }

  @Roles(Role.ADMIN)
  @Delete(':id')
  @ApiOperation({ summary: 'Удалить шаблон подписки' })
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
    description: 'ID шаблона подписки',
  })
  @ApiResponse({ status: 200, description: 'Шаблон удален' })
  @ApiResponse({ status: 404, description: 'Шаблон не найден' })
  async deleteTemplate(@Param('id') id: string) {
    return this.subscriptionTemplateService.deleteTemplate(id);
  }
}
