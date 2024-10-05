import { HttpStatus, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { PrismaClient, Role } from '@prisma/client';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class UsersService extends PrismaClient implements OnModuleInit{

  private readonly logger = new Logger('ProductsService')

  onModuleInit() {
      this.$connect()
      this.logger.log('Database Connected')
  }


  async create(createUserDto: CreateUserDto) {
    return this.user.create({data: createUserDto, select: {id: true,nombre: true, apellido: true,email: true, role: true}});
  }

  async findOne(id: number) {
    const user = await this.user.findFirst({where: {id: id}, select: {id: true,nombre: true, apellido: true, email: true, role: true}});

    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const {id: __, ...data} = updateUserDto;

    await this.findOne(id);

    return this.user.update({where: {id}, data, select: {id: true,nombre: true, apellido: true,email: true, role: true}}); 
  }

  async remove(id: number) {
    await this.findOne(id);

    const user = await this.user.update({
      where: {id},
      data: {available: false},
      select: {id: true,nombre: true, apellido: true, email: true, role: true}
    });

    return user;
  }

  async login(loginUserDto: LoginUserDto) {
    const userX = await this.user.findFirst({
      where: {email: loginUserDto.email, password: loginUserDto.password},
      select: {id: true,nombre: true, apellido: true, email: true, role: true}
    });

    if(!userX) {
      throw new RpcException({
        message: `Incorrect Email / Incorrect Password`,
        status: HttpStatus.BAD_REQUEST
      });
    }

    const userF = await this.user.update({where: {id: userX.id}, select: {id: true,nombre: true, apellido: true, email: true, role: true}, data: {role: Role.USER}});


    return userF;
  }
}
