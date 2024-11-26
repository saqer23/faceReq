import nodemailer from "nodemailer";

export async function sendEmail(to: string, subject: string, salesData: any[]) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
    tls: {
      rejectUnauthorized: false, // Allow self-signed certificates
    },
    connectionTimeout: 10000,
    greetingTimeout: 10000,
  });

  // Construct HTML table from the sales data
  const htmlContent = `
    <h1 style="text-align: right;" dir="rtl">بيانات المبيعات</h1>
<table
  border="1"
  cellpadding="5"
  cellspacing="0"
  style="border-collapse: collapse; width: 100%; text-align: right;"
  dir="rtl"
>
  <thead>
    <tr>
      <th>الرقم التعريفي</th>
      <th>اسم المستخدم</th>
      <th>الايميل</th>
      <th>من سيارة</th>
      <th>الى المحطة</th>
      <th>قيمة التحويل</th>
      <th>طريقة الدفع</th>
      <th>نوع الوقود</th>
      <th>التاريخ</th>
    </tr>
  </thead>
  <tbody>
    ${salesData
      .map(
        (sale) => `
      <tr>
        <td>${sale.id}</td>
        <td>${sale.user?.username}</td>
        <td>${sale.user?.email}</td>
        <td>${sale.car?.name}</td>
        <td>${sale.station?.name}</td>
        <td>${sale.amount}</td>
        <td>${getPaymentTypeLabel(sale.paymentType)}</td>
        <td>${getFuelTypeLabel(sale.fuelType)}</td>
        <td>${new Date(sale.date).toLocaleString()}</td>
      </tr>
    `
      )
      .join("")}
  </tbody>
</table>
  `;

  const mailOptions = {
    from: `"${process.env.EMAIL_SENDER_NAME}" <${process.env.EMAIL_SENDER_ADDRESS}>`,
    to: to,
    subject: subject,
    html: htmlContent, // Use the generated table as the email body
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent: %s", info.messageId);
    return info;
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
}

// Helper functions to convert payment type and fuel type
function getPaymentTypeLabel(paymentType: number) {
  switch (paymentType) {
    case 1:
      return "كاش";
    case 2:
      return "شبكة";
    default:
      return "Unknown";
  }
}

function getFuelTypeLabel(fuelType: number) {
  switch (fuelType) {
    case 1:
      return "95";
    case 2:
      return "91";
    case 3:
      return "Desal";
    default:
      return "Unknown";
  }
}
