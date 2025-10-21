/* eslint-disable */
import {
  IsString,
  IsNumber,
  IsEmail,
  IsIn,
  IsArray,
  IsPositive,
  IsOptional,
} from 'class-validator';
import { Grade } from '../entities/grade.entity';
import { ApiProperty } from '@nestjs/swagger';
export class CreateStudentDto {
   
        @IsString()
        @ApiProperty({
          description: 'Name of the student',
          example: 'John Doe',
        })
        name: string;
    
        @IsNumber()
        @IsPositive()
        @IsOptional()
        @ApiProperty({
          description: 'Age of the student',
          example: 20,
        })
        age: number;
    
        @IsString()
        @IsEmail()
        @ApiProperty({
          description: 'Email of the student',
          example: 'johangamertag@gmail.com'
        })
        email:string;
    
         @IsString()
         @IsIn(['Male', 'Female', 'Other'])
         @ApiProperty({
          description: 'Gender of the student',
          example: 'Male',
         })
        gender: string;

        @IsArray()
        subjects: string[]

        @IsArray()
        @IsOptional()
        grades: Grade[];


}
