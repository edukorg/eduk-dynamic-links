import { Controller, Get, Query, Req, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { DynamicLinksEntity } from './entities/dynamic_links.entity';
import { DynamicLinksDto } from './dtos/dynamic_links.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  async redirect(@Query() dto: DynamicLinksDto, @Req() req, @Res() res) {
    const userAgent = req.headers['user-agent']; 
    await this.appService.redirect(userAgent, dto, res);
  }

  @Get('link')
  async getLink(@Query() dto): Promise<DynamicLinksEntity> {
    return await this.appService.getLink(dto.token);
  }
}
