import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AuthModule } from './modules/auth/auth.module';
import { TransactionModule } from './modules/transaction/transaction.module';
import { TransactionItemModule } from './modules/transaction_item/transactionItem.module';
import { BookModule } from './modules/book/book.module';
import { UserModule } from './modules/user/user.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [
    ConfigModule.forRoot({isGlobal:true}),
    AuthModule,
    TransactionModule,
    TransactionItemModule,
    BookModule,
    UserModule,
    PrismaModule,
  ],
})
export class AppModule {}
