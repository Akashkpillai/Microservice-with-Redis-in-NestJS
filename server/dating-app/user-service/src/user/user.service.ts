import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create.dto';
import * as argon2 from 'argon2';
import { User } from './dto/user.dto';

@Injectable()
export class UserService {
  constructor(private prismaService: PrismaService) {}

  async create(data: CreateUserDto): Promise<User> {
    const existingUser = await this.prismaService.$queryRawUnsafe<User>(
      `SELECT * FROM "user" WHERE email = $1 OR number = $2`,
      data.email,
      data.number,
    );

    if (existingUser && existingUser[0]) {
      const conflictField =
        existingUser[0].email === data.email ? 'email' : 'number';
      throw new HttpException(
        { message: `User with same ${conflictField} already exist` },
        HttpStatus.CONFLICT,
      );
    }

    const hashedPassword = await this.hashPassword(data.password);

    let query = 'INSERT INTO "user" (name, email, password ,number ,gender ,';
    let values = `VALUES ('${data.name}', '${data.email}', '${hashedPassword}' ,${data.number},'${data.gender}',`;

    if (data.bio) {
      query += ' bio,';
      values += `, '${data.bio}'`;
    }

    if (data.preferences) {
      query += ' preferences';
      values += `'${data.preferences}'`;
    }

    query += ') ';
    values += ')';

    const fullQuery = `${query} ${values} RETURNING id;`;

    const user = await this.prismaService.$queryRawUnsafe(fullQuery);

    if (user[0].id) {
      const userData: User = await this.prismaService.$queryRawUnsafe(
        ` SELECT * FROM "user" WHERE id = ${user[0].id}`,
      );
      return userData;
    } else {
      console.error('Failed to create user or unexpected response:', user);
      throw new HttpException(
        { message: 'User creation failed' },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async hashPassword(password: string): Promise<string> {
    return await argon2.hash(password);
  }

  async verifyPassword(hash: string, password: string): Promise<boolean> {
    return await argon2.verify(hash, password);
  }
}
