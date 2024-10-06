import { HttpStatus, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaClient } from '@prisma/client';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class UsersService extends PrismaClient implements OnModuleInit{

  private readonly logger = new Logger('ProductsService')

  onModuleInit() {
      this.$connect()
      this.logger.log('Database Connected')
  }


  async create(createUserDto: CreateUserDto) {
    try {
      return this.user.create({data: createUserDto});
    } catch (error) {
      throw new RpcException({
        status: HttpStatus.BAD_REQUEST,
        message: 'Error en la creacion del usuario'
      })
    }
  }

  async findOne(id: number) {
    try {
      const user = await this.user.findFirst({where: {id: id}});

      return user;
    } catch (error) {
      throw new RpcException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Usuario no encontrado'
      })
    }
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    try {
      
      const {id: __, ...data} = updateUserDto;

      await this.findOne(id);

      return this.user.update({where: {id}, data}); 

    } catch (error) {
      throw new RpcException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Error en la actualización del usuario'
      })
    }
  }

  async remove(id: number) {
    try {

      await this.findOne(id);

      const user = await this.user.update({
        where: {id},
        data: {available: false}
      });

      
      return user;

    } catch (error) {
      throw new RpcException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Error en la eliminación del usuario'
      })
    }
  }
}
