import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { RawMaterialsModule } from './raw-materials/raw-materials.module';
import { EntriesModule } from './entries/entries.module';
import { ProductionRequestsModule } from './production-requests/production-requests.module';
import { ProductionModule } from './production/production.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', '.env.local'],
    }),
    PrismaModule,
    UsersModule,
    AuthModule,
    RawMaterialsModule,
    EntriesModule,
    ProductionRequestsModule,
    ProductionModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
