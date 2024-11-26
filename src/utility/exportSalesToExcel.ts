import * as XLSX from "xlsx";
import { Response } from "express";

function exportSalesToExcel(sales: any, res: Response) {
  try {
    console.log("here sa:", sales);

    // Flatten the sales data to avoid nested objects
    const flattenedSales =
      sales.map((sale: any) => ({
        saleId: sale.id,
        userId: sale.user?.id,
        username: sale.user?.username,
        userEmail: sale.user?.email,
        carId: sale.car?.id,
        carName: sale.car?.name,
        carPlateNumber: sale.car?.plateNumberAr,
        stationId: sale.station?.id,
        stationName: sale.station?.name,
        status: getStatusLabel(sale.status), // Convert status to readable label
        amount: sale.amount,
        paymentType: getPaymentTypeLabel(sale.paymentType), // Convert payment type to readable label
        fuelType: getFuelTypeLabel(sale.fuelType), // Convert fuel type to readable label
        date: new Date(sale.date).toLocaleString(), // Format the date
        note: sale.note,
      }))

    // Create a new worksheet and workbook
    const worksheet = XLSX.utils.json_to_sheet(flattenedSales);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sales");

    // Create Excel buffer
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "buffer",
    });

    // Set the response headers for Excel file download
    res.setHeader("Content-Disposition", "attachment; filename=sales.xlsx");
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );

    // Send the Excel file as a response
    res.send(excelBuffer);
  } catch (error: any) {
    res.status(error.statusCode || 500).json({
      status: "error",
      statusCode: error.statusCode || 500,
      message: error.message || "Internal Server Error",
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
      originalError: error.originalError
        ? error.originalError.message
        : undefined,
    });
  }
}

// Helper function to convert status to readable label
function getStatusLabel(status: number) {
  switch (status) {
    case 1:
      return "Active";
    case 2:
      return "Under Process";
    case 3:
      return "Rejected";
    default:
      return "Unknown";
  }
}

// Helper function to convert payment type to readable label
function getPaymentTypeLabel(paymentType: number) {
  switch (paymentType) {
    case 1:
      return "Cash";
    case 2:
      return "Credit";
    default:
      return "Unknown";
  }
}

// Helper function to convert fuel type to readable label
function getFuelTypeLabel(fuelType: number) {
  switch (fuelType) {
    case 1:
      return "Petrol";
    case 2:
      return "Diesel";
    default:
      return "Unknown";
  }
}

export default exportSalesToExcel;
