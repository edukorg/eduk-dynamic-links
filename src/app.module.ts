import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LinksEntity } from './entities/links.entity';

@Module({
  // imports: [
  //   TypeOrmModule.forRoot({
  //     type: 'sqlite',
  //     database: 'src/database/eduk-dynamic-link.db',
  //     entities: [__dirname + '/**/*.entity{.ts,.js}'],
  //     synchronize: true,
  //   }),
  //   TypeOrmModule.forFeature([LinksEntity])
  // ],
  controllers: [AppController],
})

export class AppModule {}