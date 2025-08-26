import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'AI Diplomatic Negotiator Gateway is running!';
  }
}
