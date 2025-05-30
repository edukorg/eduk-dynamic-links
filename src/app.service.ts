import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { DynamicLinksEntity } from './entities/dynamic_links.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DynamicLinksDto } from './dtos/dynamic_links.dto';
import { toZonedTime } from 'date-fns-tz';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(DynamicLinksEntity)
    private dynamicLinksRepository: Repository<DynamicLinksEntity>,
  ) {}

  async redirect(userAgent: string, dto: DynamicLinksDto, res: any) {
    try {
      console.log('Token - Redirect: ' + dto.token);
      const exist = await this.dynamicLinksRepository.findOneBy({
        token: dto.token,
        deleted: false,
      });
      if (exist) {
        console.log('Already exists dynamic link');
        await this.dynamicLinksRepository.update(
          { token: exist.token },
          { deleted: true },
        );
        console.log('Deleted exists dynamic link');
      }

      if (
        userAgent.includes('iPhone') ||
        userAgent.includes('iPad') ||
        userAgent.includes('Android')
      ) {
        const expireAt = new Date();
        expireAt.setMinutes(expireAt.getMinutes() + 5);
        console.log(this._getDateOnTimeZone(expireAt));
        await this.dynamicLinksRepository.save({
          token: dto.token,
          link: dto.link,
          expireAt: this._getDateOnTimeZone(expireAt),
        });
        console.log('Saved dynamic link');

        if (userAgent.includes('iPhone') || userAgent.includes('iPad')) {
          res.redirect(`https://apps.apple.com/app/id${dto.isi}`);
          console.log('Redirecting to Apple Store');
        } else {
          res.redirect(
            `https://play.google.com/store/apps/details?id=${dto.apn}`,
          );
          console.log('Redirecting to Play Store');
        }
      } else {
        res.redirect(dto.link);
        console.log('Redirecting to Web');
      }
    } catch (error) {
      console.error(error);
      throw new HttpException(
        'Unexpected error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getLink(token: string): Promise<DynamicLinksEntity> {
    console.log('Token - GetLink: ' + token);
    const result = await this.dynamicLinksRepository.findOneBy({
      token: token,
      deleted: false,
    });

    if (!result) {
      console.log('Dynamic link not found');
      throw new HttpException('Dynamic link not found', HttpStatus.NOT_FOUND);
    }

    const now = this._getDateOnTimeZone(new Date());
    if (result.expireAt <= now) {
      await this._deleteDynamicLink(token);
      console.log('Expired dynamic link');
      throw new HttpException('Expired dynamic link', HttpStatus.BAD_REQUEST);
    }

    await this._deleteDynamicLink(token);
    return result;
  }

  async _deleteDynamicLink(token: string) {
    try {
      await this.dynamicLinksRepository.update(
        { token: token },
        { deleted: true },
      );
      console.log(`Deleted dynamic link`);
    } catch (error) {
      console.error(error);
      throw new HttpException(
        'Unexpected error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  _getDateOnTimeZone(date: Date): Date {
    const timezone = 'America/Sao_Paulo';
    return toZonedTime(date, timezone);
  }
}
