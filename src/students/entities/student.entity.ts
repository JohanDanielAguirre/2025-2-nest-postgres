import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Grade } from './grade.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Student {

    @PrimaryGeneratedColumn('uuid')
    @ApiProperty({
        description: 'Unique identifier for the student',
        example: 'a1b2c3d4-e5f6-xxxx-9i0j-k1l2m3n4o5p6',
      uniqueItems: true
    })
    id: string;

    @Column('text')
    @ApiProperty({
        description: 'Full name of the student',
        example: 'John Doe'
    })
    name: string;

    @Column({
        type: 'int',
        nullable: true
    })
    @ApiProperty({
        description: 'Age of the student',
        example: 20,
        nullable: true
    })
    age: number;

    @Column({
        type: 'text',
        unique: true
    })
    email:string;

    @Column('text')
    @ApiProperty({
        description: 'Nickname of the student, auto-generated if not provided',
        example: 'john_doe20'
    })
    nickname: string;

    @Column('text')
    @ApiProperty({
        description: 'Gender of the student',
        example: 'Male'
    })
    gender: string;

    @Column({
        type: 'text',
        array: true
    })
  @ApiProperty({
        description: 'List of subjects the student is enrolled in',
        example: ['Math', 'Science', 'History']
  })
    subjects: string[]
  @OneToMany(() => Grade, (grade) => grade.student, { cascade: true, eager: true })
  grades?: Grade[]
  @BeforeInsert()
  checkNickcnameFirst() {
      if (!this.nickname) {
          this.nickname = this.name;
      }
      this.nickname = this.nickname.toLowerCase().replace(" ", "_")+this.age;
  }

  @BeforeUpdate()
  checkNickname() {
    this.nickname = this.nickname.toLowerCase().replace(" ", "_")+this.age;
  }
}
