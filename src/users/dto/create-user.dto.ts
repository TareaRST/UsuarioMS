import { Type } from "class-transformer";
import { IsDate, IsEmail, IsNotEmpty, IsString} from "class-validator";

export class CreateUserDto {

    @IsString()
    @IsNotEmpty()
    nombre: string;

    @IsString()
    @IsNotEmpty()
    apellido: string;

    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsNotEmpty()
    @IsString()
    domicilio: string;

    @IsNotEmpty()
    @IsDate()
    @Type(() => Date)
    fechaNacimiento: Date;

    @IsNotEmpty()
    @IsString()
    dni: string;
}
