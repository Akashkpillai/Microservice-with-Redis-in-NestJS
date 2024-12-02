import UtilsService from './../helpers/service/util.service';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create.dto';
import * as argon2 from 'argon2';
import { User } from './dto/user.dto';
import { UpdateDto } from './dto/update.dto';

@Injectable()
export class UserService {
    constructor(
        private prismaService: PrismaService,
        private utilsService: UtilsService
    ) {}

    async create(data: CreateUserDto): Promise<User> {
        const existingUser = await this.utilsService.querySingle<User>(
            `SELECT * FROM "user" WHERE email = $1 OR number = $2`,
            data.email,
            data.number
        );

        if (existingUser) {
            const conflictField = existingUser.email === data.email ? 'email' : 'number';
            throw new HttpException(
                { message: `User with same ${conflictField} already exist` },
                HttpStatus.CONFLICT
            );
        }

        const hashedPassword = await this.hashPassword(data.password);

        let query = 'INSERT INTO "user" (name, email, password ,number ,gender ,';
        let values = `VALUES ('${data.name}', '${data.email}', '${hashedPassword}' ,${data.number},'${data.gender}',`;

        if (data.bio) {
            query += ' bio,';
            values += ` '${data.bio}',`;
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
                ` SELECT * FROM "user" WHERE id = ${user[0].id}`
            );
            return userData;
        } else {
            console.error('Failed to create user or unexpected response:', user);
            throw new HttpException(
                { message: 'User creation failed' },
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    async update(id, payload: UpdateDto): Promise<{ message: string }> {
        if (!payload) {
            throw new HttpException(
                { message: 'Please provide the data to be update' },
                HttpStatus.BAD_REQUEST
            );
        }

        const existingUser = await this.findById(id);

        if (!existingUser) {
            throw new HttpException({ message: 'User not found to update' }, HttpStatus.NOT_FOUND);
        } else {
            const updateResult = await this.utilsService.updateQuery(
                'user', // Table name
                payload, // Fields to update
                { id: parseInt(id, 10) } // Condition for the update
            );
            return updateResult ? { message: 'User updated' } : { message: 'User updation failed' };
        }
    }

    async findAll(): Promise<User[]> {
        const users = await this.prismaService.$queryRawUnsafe<User[]>(
            `SELECT name , email , bio ,gender , preferences FROM "user";`
        );
        if (!users.length) {
            throw new HttpException({ message: 'User details not found' }, HttpStatus.NOT_FOUND);
        }
        return users;
    }

    async findById(id): Promise<User> {
        if (typeof id == 'string') {
            id = parseInt(id, 10);
        }
        const user = await this.utilsService.querySingle<User>(
            `SELECT id , name , email , number ,bio , gender ,preferences FROM "user" WHERE id = $1`,
            id
        );

        if (!user) {
            throw new HttpException({ message: 'User not found' }, HttpStatus.NOT_FOUND);
        } else {
            return user;
        }
    }

    async delete(id): Promise<boolean> {
        const existingUser = await this.findById(id);

        if (!existingUser) {
            throw new HttpException({ message: 'User not found to update' }, HttpStatus.NOT_FOUND);
        }

        const deleted = await this.prismaService.$queryRawUnsafe(
            `DELETE FROM "user" WHERE id = ${id} RETURNING id AS id;`
        );
        return deleted && deleted[0].id ? true : false;
    }

    async hashPassword(password: string): Promise<string> {
        return await argon2.hash(password);
    }

    async verifyPassword(hash: string, password: string): Promise<boolean> {
        return await argon2.verify(hash, password);
    }
}
