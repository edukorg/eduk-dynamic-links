import { Controller, Get, Query, Req, Res } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LinksEntity } from './entities/links.entity';
import { Repository } from 'typeorm';

class ParamDto {
  link: string;
  apn: string;
  isi: string;
  ibi: string;
}

@Controller()
export class AppController {
  constructor(
    @InjectRepository(LinksEntity) 
    private linksRepository: Repository<LinksEntity>
  ) {}

  @Get()
  async redirect(@Query() dto: ParamDto, @Req() req, @Res() res): Promise<void> {
    const userAgent = req.headers['user-agent'];

    if (userAgent.includes('iPhone') || userAgent.includes('iPad')) {
      res.redirect('https://apps.apple.com/app/id'+dto.ibi);
    } else if (userAgent.includes('Android')) {
      res.redirect('https://play.google.com/store/apps/details?id='+dto.apn+'&pcampaignid=fdl_long&url='+dto.link);
    } else {
      res.redirect(dto.link);
    }
  }
}

