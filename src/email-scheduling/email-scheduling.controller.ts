import { Controller } from '@nestjs/common';
import { EmailSchedulingService } from './email-scheduling.service';

@Controller('email-scheduling')
export class EmailSchedulingController {
  constructor(private readonly emailSchedulingService: EmailSchedulingService) {}
}
