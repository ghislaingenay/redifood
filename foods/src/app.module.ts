import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { currentUser } from 'redifood-module/src/middlewares/current-user';
import { requireAuth } from 'redifood-module/src/middlewares/require-auth';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FoodsModule } from './foods/foods.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), FoodsModule],
  controllers: [AppController],
  providers: [AppService],
})
// export class AppModule {}
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(currentUser, requireAuth).forRoutes('*');
  }
}
