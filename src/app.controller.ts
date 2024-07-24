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
    const exist = await this.linksRepository.findOneBy({ ip: req.ip, deleted: false });
    if (exist){
      this.linksRepository.save({ link: exist.link, ip: exist.ip, deleted: true });
    }


    if (userAgent.includes('iPhone') || userAgent.includes('iPad')) {
      this.linksRepository.save({ link: dto.link, ip: req.ip, deleted: false });
      res.redirect('https://apps.apple.com/app/id'+dto.ibi);
    } else if (userAgent.includes('Android')) {
      this.linksRepository.save({ link: dto.link, ip: req.ip, deleted: false });
      res.redirect('https://play.google.com/store/apps/details?id='+dto.apn+'&pcampaignid=fdl_long&url='+dto.link);
    } else {
      res.redirect(dto.link);
    }
  }

  @Get('link')
  async link(@Query() ip: string): Promise<LinksEntity> {
    const link = await this.linksRepository.findOneBy({ ip: ip });
    this.linksRepository.save({ link: link.link, ip: link.ip, deleted: true });
    return link;
  }
}

