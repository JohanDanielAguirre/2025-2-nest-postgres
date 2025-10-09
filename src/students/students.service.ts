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
import { DataSource, Repository } from 'typeorm';
import { PaginationDto } from './dto/pagination.dto';
import { isUUID, IsUUID } from 'class-validator';
import { Grade } from './entities/grade.entity';


@Injectable()
export class StudentsService {
  private logger = new Logger();

  constructor(
    @InjectRepository(Grade)
    private readonly gradeRepository: Repository<Grade>,
    @InjectRepository(Student)
    private readonly studentRepository: Repository<Student>,
    private readonly dataSource: DataSource
  ) {}

  async create(createStudentDto: CreateStudentDto) {
    try {

      const {grades = [], ...studentDetails}= createStudentDto;

      const student = this.studentRepository.create({
        ...studentDetails,
        grades: grades.map( grade => this.gradeRepository.create(grade) )
      });
      await this.studentRepository.save(student);
    } catch (e) {
      this.handleExeption(e);
    }
  }

 async findAll(paginationDto: PaginationDto) {
    const { limit, offset } = paginationDto;
    try {
      return await this.studentRepository.find({
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
        }).leftJoinAndSelect('student.grades','studentGrade')
        .getOne();
    }

    if (!student)
      throw new InternalServerErrorException(
        `Student with id, name or nickname "${term}" not found`,
      );
    return student;
  }

  async update(id: string, updateStudentDto: UpdateStudentDto) {
    const {grades, ...StudentDetails} = updateStudentDto;
    const student = await this.studentRepository.preload({
      id: id,
      ...StudentDetails,
    });
    if (!student) {throw new NotFoundException(`Student with id "${id}" not found`);}

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      if (grades) {
        await queryRunner.manager.delete(Grade, { student: { id } });
        student.grades = grades.map( grade => this.gradeRepository.create(grade) );
        await queryRunner.manager.save(student);
        await queryRunner.commitTransaction();
        await queryRunner.release();

        return this.findOne(id);
      }

    }catch (e){
      await queryRunner.rollbackTransaction();
      await queryRunner.release();
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
