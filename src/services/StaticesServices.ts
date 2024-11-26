// src/services/StaticesService.ts
import { prisma } from "../utility/prisma";
import { DatabaseError } from "../errors/DatabaseError";

export class StaticesService {
  public async getAllStatices() {
    try {
      const attendanceData = await prisma.prepared.findMany({
        include: {
          employee: true,
        },
      });
  
      // Calculate the attendance summary (count presence and absence)
      const totalEmployees = await prisma.employee.count();
      const attendedEmployees = new Set(attendanceData.map((record) => record.employeeId));
      const attendanceCount = attendedEmployees.size;
      const absenceCount = totalEmployees - attendanceCount;
      const workTimes = await prisma.workTime.findMany();

    // Prepare the data for the chart (number of requests per day)
    const requestsPerDay: Record<string, number> = {
  'السبت': 0,
  'الأحد': 0,
  'الاثنين': 0,
  'الثلاثاء': 0,
  'الأربعاء': 0,
  'الخميس': 0,
  'الجمعة': 0
};

    workTimes.forEach((workTime) => {
      if (requestsPerDay[workTime.day] !== undefined) {
        requestsPerDay[workTime.day] += 1;
      }
    });

    // Count the number of attendances per employee
    const attendanceCountPerEmployee: Record<string, { name: string; count: number }> = {};

    attendanceData.forEach((record) => {
      const employeeId = record.employeeId;
      const employeeName = record.employee.name;

      if (!attendanceCountPerEmployee[employeeId]) {
        attendanceCountPerEmployee[employeeId] = { name: employeeName, count: 0 };
      }

      attendanceCountPerEmployee[employeeId].count++;
    });

    // Prepare data for the chart (top attendance)
    const topAttendance = Object.values(attendanceCountPerEmployee).map((employee) => ({
      name: employee.name,
      count: employee.count,
    }));
      return{
        cycle: {
          label: ["الحظور", "الغياب"],
          value: [attendanceCount, absenceCount]
        },
        requestsPerDay,
        topAttendance
      }
    } catch (error) {
      console.log(error);
      throw new DatabaseError("Error: ", error);
    }
  }
}

export default new StaticesService();
