import { Controller, Get, Query, Req, Res } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LinksEntity } from './entities/links.entity';

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
    if (exist) {
      await this.linksRepository.update({ ip: req.ip }, { deleted: true });
    }

    if (userAgent.includes('iPhone') || userAgent.includes('iPad') || userAgent.includes('Android')) {
      await this.linksRepository.save({ ip: req.ip, link: dto.link, deleted: false });

      if (userAgent.includes('iPhone') || userAgent.includes('iPad')) {
        res.redirect('https://apps.apple.com/app/id'+dto.isi);
      } else {
        res.redirect('https://play.google.com/store/apps/details?id='+dto.apn+'&pcampaignid=fdl_long&url='+dto.link);
      }
    } else {
      res.redirect(dto.link);
    }
  }

  @Get('link')
  async getLink(@Req() req): Promise<LinksEntity> {
    return await this.linksRepository.findOneBy({ ip: req.ip, deleted: false });
  }

}

