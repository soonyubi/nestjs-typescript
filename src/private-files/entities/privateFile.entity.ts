import User from "../../users/entities/user.entity";
import {Entity, Column, ManyToOne, PrimaryGeneratedColumn} from "typeorm";

@Entity()
export class PrivateFile{
    @PrimaryGeneratedColumn()
    public id: number;

    @Column()
    public key: string;

    @ManyToOne(() => User, (owner: User) => owner.files)
    public owner?: User;
}