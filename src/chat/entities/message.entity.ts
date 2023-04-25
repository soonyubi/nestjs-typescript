import User from 'src/users/entities/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';


@Entity()
export class Message {
    @PrimaryGeneratedColumn()
    public id : number;

    @Column()
    public content : string;

    @Column()
    public author : User;
}

export default Message;
