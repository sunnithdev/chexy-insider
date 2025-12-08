import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TransactionsController } from './transactions/transactions.controller';
import { RewardsController } from './rewards/rewards.controller';
import { AiModule } from './ai/ai.module';

@Module({
  imports: [AiModule],
  controllers: [AppController, TransactionsController, RewardsController],
  providers: [AppService],
})
export class AppModule { }
