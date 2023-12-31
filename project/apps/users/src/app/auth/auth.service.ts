import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { LoginUserRequestDto } from './dto/login-user.dto';
import { CreateUserRequestDto } from '../users/dto/create-user.dto';
import { RestorePasswordRequestDto } from '../users/dto/restore-user-password.dto';
import { UsersRepository } from '../users/users.repository';
import { compare } from 'bcrypt';
import { NOT_REGISTERED, WRONG_CREDENTIALS } from './constants/auth.constants';
import { LoginUserResponseRdo } from './rdo/login-user.rdo';
import { UserEntity } from '../users/user.entity';

@Injectable()
export class AuthService {
  constructor(private usersRepository: UsersRepository) {}

  async validateUser(user: LoginUserRequestDto): Promise<UserEntity | null> {
    try {
      const { password, email } = user;

      const entityUser = await this.usersRepository.finByEmail(email);

      if (!entityUser) {
        throw new HttpException(NOT_REGISTERED, HttpStatus.BAD_REQUEST);
      }

      const isMatch = await compare(password, entityUser.password);

      if (isMatch) {
        return entityUser;
      } else {
        throw new HttpException(WRONG_CREDENTIALS, HttpStatus.BAD_REQUEST);
      }
    } catch (error) {
      throw error;
    }
  }
}
