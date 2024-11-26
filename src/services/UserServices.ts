// src/services/UserService.ts
import { prisma } from "../utility/prisma";
import { DatabaseError } from "../errors/DatabaseError";
import { NotFoundError } from "../errors/NotFoundError";
import convertEqualsToInt from "../utility/convertToInt";
import convertTopLevelStringBooleans from "../utility/convertTopLevelStringBooleans";
import { hashPassword } from "../passport-config";

export class UserService {
  public async getAllUsers(filterData: any) {
    try {
      const { page, pageSize } = filterData;
      const { orderBy } = filterData;
      let { include } = filterData;
      delete filterData.orderBy;
      delete filterData.page;
      delete filterData.pageSize;
      delete filterData.include;
      if (include) {
        const convertTopLevel = convertTopLevelStringBooleans(include);
        include = convertTopLevel;
      } else {
        include = [];
      }
      const convertString = convertEqualsToInt(filterData);
      filterData = convertString;
      if (page && pageSize) {
        const skip = (+page - 1) * +pageSize;
        const take = +pageSize;
        const users = await prisma.user.findMany({
          where: { ...filterData },

          skip: +skip,
          take: +take,
          orderBy,
        });
        const total = await prisma.user.count({
          where: { ...filterData },
        });

        return {
          info: users,
          total,
          page,
          pageSize,
        };
      }

      const users = await prisma.user.findMany({
        where: { ...filterData },
        orderBy,
      });
      return users;
    } catch (error) {
      console.log(error);
      throw new DatabaseError("Error: ", error);
    }
  }

  public async createUser(data: any) {
    try {
      return await prisma.user.create({
        data: {
          username: data.username,
          password: await hashPassword(data.password),
        },
      });
    } catch (error) {
      console.log(error);
      throw new DatabaseError("Error: ", error);
    }
  }

  public async updateUser(id: string, data: any) {
    try {
      const userExist = await prisma.user.findFirst({
        where: {
          id: id,
        },
        
      });
      if (!userExist) {
        throw new NotFoundError("user not found");
      }
      const user = await prisma.user.update({
        where: {
          id: id,
        },
        data: {
          username: data.username ? data.username : userExist.username,
         
          password: data.password
            ? await hashPassword(data.password)
            : userExist.password,
        },
        select: {
          id: true,
          username: true,
        },
      });
      return user;
    } catch (error) {
      console.log(error);
      throw new DatabaseError("Error: ", error);
    }
  }

  public async deleteUser(id: string): Promise<string | null> {
    try {
      const user = await prisma.user.findUnique({ where: { id } });
      if (!user) {
        throw new NotFoundError(`user with id ${id} not found.`);
      }
      const userName = user.username;
      await prisma.user.delete({
        where: { id },
      });
      return userName;
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      throw new DatabaseError("Error deleting user.", error);
    }
  }

}

export default new UserService();