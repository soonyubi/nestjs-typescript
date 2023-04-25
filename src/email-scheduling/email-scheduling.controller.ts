import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { EmailSchedulingService } from './email-scheduling.service';
import JwtAuthenticationGuard from 'src/authentication/guard/jwt-authentication.guard';
import EmailScheduleDto from './dto/email-scheduling.dto';

@Controller('email-scheduling')
export class EmailSchedulingController {
  constructor(private readonly emailSchedulingService: EmailSchedulingService) {}
 
  @Post('schedule')
  @UseGuards(JwtAuthenticationGuard)
  async scheduleMail(@Body() emailSchedule : EmailScheduleDto){
    this.emailSchedulingService.scheduleEmail(emailSchedule); 
  }
}
