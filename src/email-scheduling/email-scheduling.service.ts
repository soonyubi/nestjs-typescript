import { Injectable } from '@nestjs/common';
import { EmailService } from 'src/email/email.service';
import {SchedulerRegistry } from "@nestjs/schedule";
import EmailScheduleDto from './dto/email-scheduling.dto';
import {CronJob} from "cron";

@Injectable()
export class EmailSchedulingService {
    constructor(
        private readonly emailService : EmailService,
        private readonly schedulerRegistry : SchedulerRegistry
    ){}

    scheduleEmail(emailSchedule : EmailScheduleDto){
        const date = new Date(emailSchedule.date);
        console.log(date);
        const job = new CronJob(date, ()=>{
            this.emailService.sendMail({
                to : emailSchedule.recipient,
                subject : emailSchedule.subject,
                text : emailSchedule.content
            });
        });
        console.log(job);
        this.schedulerRegistry.addCronJob(`${Date.now()}-${emailSchedule.subject}`,job);
        job.start();
    }
}
