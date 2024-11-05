import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DynamicLinksEntity } from './entities/dynamic_links.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'edul-dynamic-links.db',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([DynamicLinksEntity]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
