import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class DatabaseService extends PrismaClient implements OnModuleInit {
  // Uncomment to get query logs
  // constructor() {
  //   super({
  //     log: ['query', 'info', 'warn', 'error'], // Enable the desired log levels
  //   });
  // }

  async onModuleInit() {
    await this.$connect();
  }
}
