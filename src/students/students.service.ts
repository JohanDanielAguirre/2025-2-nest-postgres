import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Student } from './entities/student.entity';
import { Repository } from 'typeorm';
import { PaginationDto } from './dto/pagination.dto';
import { isUUID, IsUUID } from 'class-validator';


@Injectable()
export class StudentsService {
  private logger = new Logger();

  constructor(
    @InjectRepository(Student)
    private readonly studentRepository: Repository<Student>,
  ) {}

  async create(createStudentDto: CreateStudentDto) {
    try {
      const student = this.studentRepository.create(createStudentDto);
      await this.studentRepository.save(student);
    } catch (e) {
      this.handleExeption(e);
    }
  }

  findAll(paginationDto: PaginationDto) {
    const { limit, offset } = paginationDto;
    try {
      return this.studentRepository.find({
        take: limit,
        skip: offset,
      });
    } catch (e) {
      this.handleExeption(e);
    }
  }

  async findOne(term: string) {
    let student: Student | null;
    if (isUUID(term)) {
      student = await this.studentRepository.findOneBy({ id: term });
    } else {
      const queryBuilder = this.studentRepository.createQueryBuilder('student');
      student = await queryBuilder
        .where('UPPER(name) =: name or nickaname = :nickname', {
          name: term.toUpperCase(),
          nickname: term.toLowerCase(),
        })
        .getOne();
    }

    if (!student)
      throw new InternalServerErrorException(
        `Student with id, name or nickname "${term}" not found`,
      );
    return student;
  }

  async update(id: string, updateStudentDto: UpdateStudentDto) {
    const student = await this.studentRepository.preload({
      id: id,
      ...updateStudentDto,
    });
    if (!student) {throw new NotFoundException(`Student with id "${id}" not found`);}

    try {
      await this.studentRepository.save(student);
      return student;
    } catch (e) {
      this.handleExeption(e);
    }
  }

  async remove(id: string) {
    const student = await this.findOne(id);
    await this.studentRepository.remove(student);
  }

  private handleExeption(err) {
    if (err.code === 2505) {
      throw new InternalServerErrorException(err.detail);
      this.logger.error(err);
    }
  }
}
