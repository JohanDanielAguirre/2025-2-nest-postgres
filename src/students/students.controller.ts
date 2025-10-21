import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { StudentsService } from './students.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { PaginationDto } from './dto/pagination.dto';
import { Auth } from '../auth/decorators/auth-decorator';
import { ValidRoles } from '../auth/enums/roles.enum';
import { ApiResponse } from '@nestjs/swagger';

@Controller('students')
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  @Post()
  @Auth(ValidRoles.ADMIN)
  @ApiResponse({status: 201, description: 'Student created successfully.'})
  @ApiResponse({status: 403, description: 'Forbidden.'})
  @ApiResponse({status: 400, description: 'Bad Request.'})
  create(@Body() createStudentDto: CreateStudentDto) {
    return this.studentsService.create(createStudentDto);
  }

  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.studentsService.findAll(paginationDto);
  }

  @Get(':term')
  findOne(@Param('term') term: string) {
    return this.studentsService.findOne(term);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateStudentDto: UpdateStudentDto) {
    return this.studentsService.update(id, updateStudentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.studentsService.remove(id);
  }
}
