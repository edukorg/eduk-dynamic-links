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
    console.log('getHello');
    const userAgent = req.headers['user-agent'];
    if (userAgent.includes('iPhone') || userAgent.includes('iPad')) {
      res.redirect('https://apps.apple.com/app/id'+dto.ibi);
    } else if (userAgent.includes('Android')) {
      res.redirect('https://play.google.com/store/apps/details?id='+dto.apn+'&pcampaignid=fdl_long&url='+dto.link);
    } else {
      res.redirect(dto.link);
    }
  }

  @Get('.well-known/assetlink.json')
  getAssetLink(@Res() res) {
    console.log('getAssetLink');
    return res.json([{
      "relation": ["delegate_permission/common.handle_all_urls"],
      "target": {
        "namespace": "android_app",
        "package_name": "com.example.deep_link",
        "sha256_cert_fingerprints":
        ["A1:61:C9:09:30:4B:AF:E6:1A:3D:A3:1D:C1:38:9E:B5:5D:EE:50:B7:70:44:0B:E3:24:92:99:27:5E:2B:6C:EE"]
      }
    }]);
  }
}

