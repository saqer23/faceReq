// src/services/WorkTimeService.ts
import { prisma } from "../utility/prisma";
import { DatabaseError } from "../errors/DatabaseError";
import { NotFoundError } from "../errors/NotFoundError";
import convertEqualsToInt from "../utility/convertToInt";
import convertTopLevelStringBooleans from "../utility/convertTopLevelStringBooleans";
import { hashPassword } from "../passport-config";

export class WorkTimeService {
  public async getAllWorkTimes(filterData: any) {
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
        const workTimes = await prisma.workTime.findMany({
          where: { ...filterData },

          skip: +skip,
          take: +take,
          orderBy,
        });
        const total = await prisma.workTime.count({
          where: { ...filterData },
        });

        return {
          info: workTimes,
          total,
          page,
          pageSize,
        };
      }

      const workTimes = await prisma.workTime.findMany({
        where: { ...filterData },
      });
      return workTimes;
    } catch (error) {
      console.log(error);
      throw new DatabaseError("Error: ", error);
    }
  }

  public async createWorkTime(data: any) {
    try {
      return await prisma.workTime.create({
        data: {
          amount: +data.amount,
          day: data.day,
          startTime: data.startTime,
        },
      });
    } catch (error) {
      console.log(error);
      throw new DatabaseError("Error: ", error);
    }
  }

  public async updateWorkTime(id: string, data: any) {
    try {
      const workTimeExist = await prisma.workTime.findFirst({
        where: {
          id: id,
        },
        
      });
      if (!workTimeExist) {
        throw new NotFoundError("workTime not found");
      }
      const workTime = await prisma.workTime.update({
        where: {
          id: id,
        },
        data: {
          day: data.day ? data.day : workTimeExist.day,
          startTime: data.startTime ? data.startTime : workTimeExist.startTime,
          amount: data.amount ? +data.amount : workTimeExist.amount,
        },
      });
      return workTime;
    } catch (error) {
      console.log(error);
      throw new DatabaseError("Error: ", error);
    }
  }

  public async deleteWorkTime(id: string): Promise<string | null> {
    try {
      const WorkTime = await prisma.workTime.findUnique({ where: { id } });
      if (!WorkTime) {
        throw new NotFoundError(`WorkTime with id ${id} not found.`);
      }
      const WorkTimeName = WorkTime.day;
      await prisma.workTime.delete({
        where: { id },
      });
      return WorkTimeName;
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      throw new DatabaseError("Error deleting WorkTime.", error);
    }
  }

}

export default new WorkTimeService();