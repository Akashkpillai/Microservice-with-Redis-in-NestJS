import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export default class UtilsService {
  constructor(private readonly prismaService: PrismaService) {}

  async querySingle<T>(query: string, ...params: any[]): Promise<T | null> {
    const result = await this.prismaService.$queryRawUnsafe<T[]>(
      query,
      ...params,
    );
    return result.length > 0 ? result[0] : null;
  }

  async updateQuery<T>(
    tableName: string,
    data: Record<string, any>,
    where: Record<string, any>,
  ): Promise<T | null> {
    const setClauses = Object.keys(data)
      .map((key, index) =>
        key === 'gender'
          ? `"${key}" = $${index + 1}::gender`
          : `"${key}" = $${index + 1}`,
      )
      .join(', ');
    const whereClauses = Object.keys(where)
      .map(
        (key, index) => `"${key}" = $${Object.keys(data).length + index + 1}`,
      )
      .join(' AND ');

    const query = `UPDATE "${tableName}" SET ${setClauses} WHERE ${whereClauses} RETURNING id AS id`;

    const params = [...Object.values(data), ...Object.values(where)];

    // Execute the query
    const result = await this.prismaService.$executeRawUnsafe(query, ...params);

    return result ? ({ updated: true } as T) : ({ updated: false } as T);
  }
}
