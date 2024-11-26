// src/services/PreparedService.ts
import { prisma } from "../utility/prisma";
import { DatabaseError } from "../errors/DatabaseError";
import { NotFoundError } from "../errors/NotFoundError";
import convertEqualsToInt from "../utility/convertToInt";
import convertTopLevelStringBooleans from "../utility/convertTopLevelStringBooleans";
import dayjs from "dayjs";
import "dayjs/locale/ar";

export class PreparedService {
  public async getAllPrepared(filterData: any) {
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
      if (page && pageSize) {
        const skip = (+page - 1) * +pageSize;
        const take = +pageSize;
        const prepared = await prisma.prepared.findMany({
          where: { ...filterData },
          include: {
            employee: true,
          },
          skip: +skip,
          take: +take,
          orderBy,
        });
        const total = await prisma.prepared.count({
          where: { ...filterData },
        });

        return {
          info: prepared,
          total,
          page,
          pageSize,
        };
      }

      const prepared = await prisma.prepared.findMany({
        where: { ...filterData },
        include: {
          employee: true,
        },
      });
      return prepared;
    } catch (error) {
      console.log(error);
      throw new DatabaseError("Error: ", error);
    }
  }
  public async createPrepared(data: any) {
    try {
      const { name, time } = data;

      // Validate the input
      if (!name || !time) {
        throw new Error("Name or time not found");
      }

      // Find the employee by name
      const employee = await prisma.employee.findFirst({
        where: { name },
      });

      if (!employee) {
        throw new Error("Employee not found");
      }

      // Parse the date and get the day
      const dateTime = new Date(time);

      // Format the day in Arabic (e.g., "سبت", "أحد")
      const dayName = dayjs(dateTime).locale("ar").format("dddd"); // Arabic day name

      // Get the day in YYYY-MM-DD format for comparison
      const day = dayjs(dateTime).format("YYYY-MM-DD");

      // Check if a record already exists for the same employee on the same day
      const existingPrepared = await prisma.prepared.findFirst({
        where: {
          employeeId: employee.id,
          dateTime: {
            gte: new Date(`${day}T00:00:00`), // Start of the day
            lt: new Date(`${day}T23:59:59`), // End of the day
          },
        },
      });

      if (existingPrepared) {
        throw new Error(
          "An entry for this employee already exists on the same day"
        );
      }

      // Insert into Prepared table
      const prepared = await prisma.prepared.create({
        data: {
          day: dayName, // Save the day name in Arabic
          employeeId: employee.id,
          dateTime, // Use the provided time
        },
      });

      return prepared;
    } catch (error) {
      console.log(error);
      throw new Error("Error creating prepared entry");
    }
  }
}

export default new PreparedService();
