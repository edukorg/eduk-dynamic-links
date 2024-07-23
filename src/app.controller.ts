import { Controller, Get, Query, Req, Res } from '@nestjs/common';

class ParamDto {
  link: string;
  apn: string;
  isi: string;
  ibi: string;
}

@Controller()
export class AppController {
  @Get()
  getHello(@Query() dto: ParamDto, @Req() req, @Res() res): void {
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
