import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TransactionsController } from './transactions/transactions.controller';
import { RewardsController } from './rewards/rewards.controller';

@Module({
  imports: [],
  controllers: [AppController, TransactionsController, RewardsController],
  providers: [AppService],
})
export class AppModule {}
