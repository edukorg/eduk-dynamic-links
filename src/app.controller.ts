import { Controller, Get, Query, Req, Res } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LinksEntity } from './entities/links.entity';

class ParamDto {
  link: string;
  apn: string;
  isi: string;
  ibi: string;
  ip: string;
}

@Controller()
export class AppController {
  constructor(
    @InjectRepository(LinksEntity) 
    private linksRepository: Repository<LinksEntity>
  ) {}

  @Get()
  async redirect(@Query() dto: ParamDto, @Req() req, @Res() res): Promise<void> {
    console.log('dto', dto);
    const userAgent = req.headers['user-agent'];

    const exist = await this.linksRepository.findOneBy({ ip: dto.ip, deleted: false });
    console.log('exist', exist);
    if (exist) {
      await this.linksRepository.update({ ip: exist.ip }, { deleted: true });
    }

    if (userAgent.includes('iPhone') || userAgent.includes('iPad') || userAgent.includes('Android')) {
      await this.linksRepository.save({ ip: dto.ip, link: dto.link, deleted: false });

      if (userAgent.includes('iPhone') || userAgent.includes('iPad')) {
        res.redirect('https://apps.apple.com/app/id'+dto.isi);
      } else {
        res.redirect('https://play.google.com/store/apps/details?id='+dto.apn);
      }
    } else {
      res.redirect(dto.link);
    }
  }

  @Get('link')
  async getLink(@Query() dto): Promise<LinksEntity> {
    console.log('ip', dto.ip);
    const link = await this.linksRepository.findOneBy({ ip: dto.ip, deleted: false });
    await this.linksRepository.update({ ip: dto.ip}, { deleted: true });
    console.log('link', link);
    return link;
  }

}

