import { Column, Entity, Index, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import User from '../users/entities/user.entity';
import Category from '../categories/category.entity';
import Comment from '../comments/entities/comment.entity';

@Entity()
class Post {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public title: string;

  @Column('text',{array:true,nullable :true})
  public paragraphs : string[];

  @Column({ nullable: true })
  public category?: string;

  @Index("post_authorId_index")
  @ManyToOne(() => User, (author: User) => author.posts)
  public author: User;
 
  @ManyToMany(() => Category, (category: Category) => category.posts)
  @JoinTable()
  public categories: Category[];

  @OneToMany(() => Comment, (comment: Comment) => comment.post)
  public comments: Comment[];
}

export default Post;