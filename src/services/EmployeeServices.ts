// src/services/EmployeeService.ts
import { prisma } from "../utility/prisma";
import { DatabaseError } from "../errors/DatabaseError";
import { NotFoundError } from "../errors/NotFoundError";
import convertEqualsToInt from "../utility/convertToInt";
import convertTopLevelStringBooleans from "../utility/convertTopLevelStringBooleans";

export class EmployeeService {
  public async getAllEmployees(filterData: any) {
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
        const employees = await prisma.employee.findMany({
          where: { ...filterData },

          skip: +skip,
          take: +take,
          orderBy,
        });
        const total = await prisma.employee.count({
          where: { ...filterData },
        });

        return {
          info: employees,
          total,
          page,
          pageSize,
        };
      }

      const employees = await prisma.employee.findMany({
        where: { ...filterData },
        orderBy,
      });
      return employees;
    } catch (error) {
      console.log(error);
      throw new DatabaseError("Error: ", error);
    }
  }

  public async createEmployee(data: any, filePath:string) {
    try {
      return await prisma.employee.create({
        data: {
          address: data.address,
          email: data.email,
          file: filePath,
          name: data.name,
          phone: data.phone
        }, 
      });
    } catch (error) {
      console.log(error);
      throw new DatabaseError("Error: ", error);
    }
  }

  public async updateEmployee(id: string, data: any) {
    try {
      const employeeExist = await prisma.employee.findFirst({
        where: {
          id: id,
        },
        
      });
      if (!employeeExist) {
        throw new NotFoundError("employee not found");
      }
      const employee = await prisma.employee.update({
        where: {
          id: id,
        },
        data: {
          name: data.name ? data.name : employeeExist.name,
          address: data.address ? data.address : employeeExist.address,
          email: data.email ? data.email : employeeExist.email,
          phone: data.phone ? data.phone : employeeExist.phone,
        },
      });
      return employee;
    } catch (error) {
      console.log(error);
      throw new DatabaseError("Error: ", error);
    }
  }

  public async deleteEmployee(id: string): Promise<string | null> {
    try {
      const employee = await prisma.employee.findUnique({ where: { id } });
      if (!employee) {
        throw new NotFoundError(`employee with id ${id} not found.`);
      }
      const employeeName = employee.name;
      await prisma.employee.delete({
        where: { id },
      });
      return employeeName;
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      throw new DatabaseError("Error deleting employee.", error);
    }
  }

}

export default new EmployeeService();