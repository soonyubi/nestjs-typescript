import { Injectable } from '@nestjs/common';
import { EmailService } from 'src/email/email.service';

@Injectable()
export class EmailSchedulingService {
    constructor(
        private readonly emailService : EmailService
    ){}
}
