import * as XLSX from "xlsx";

// Excel export function for User History
export const exportToExcel = (data, filename = "user-history") => {
  try {
    const excelData = data.map((item, index) => ({
      "Sr No": index + 1,
      Country: item.country || "N/A",
      Region: item.region || "N/A",
      City: item.city || "N/A",
      ISP: item.isp || "N/A",
      "IP Address": item.IpAddress || "N/A",
      "Login Time": item.loginDate || "N/A",
      Latitude: item.lat || "N/A",
      Longitude: item.lon || "N/A",
    }));

    const ws = XLSX.utils.json_to_sheet(excelData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "User History");

    XLSX.writeFile(
      wb,
      `${filename}-${new Date().toISOString().split("T")[0]}.xlsx`
    );

    return true;
  } catch (error) {
    console.error("Excel export error:", error);
    throw new Error("Excel export failed");
  }
};

// PDF export function for User History
export const exportToPDF = async (data, filename = "user-history") => {
  try {
    // Dynamic import to avoid loading issues
    const { jsPDF } = await import("jspdf");
    await import("jspdf-autotable");

    // Create PDF instance
    const doc = new jsPDF();

    // Add title
    doc.setFontSize(16);
    doc.text("User History Report", 14, 15);

    // Add date
    doc.setFontSize(10);
    doc.text(`Generated on: ${new Date().toLocaleString("en-IN")}`, 14, 25);

    // Prepare table data
    const tableData = data.map((item, index) => [
      index + 1,
      item.country || "N/A",
      item.region || "N/A",
      item.city || "N/A",
      item.isp || "N/A",
      item.IpAddress || "N/A",
      item.loginDate || "N/A",
      item.lat || "N/A",
      item.lon || "N/A",
    ]);

    // Define table columns for User History
    const tableColumns = [
      "Sr No",
      "Country",
      "Region",
      "City",
      "ISP",
      "IP Address",
      "Login Time",
      "Latitude",
      "Longitude",
    ];

    // Add table using autoTable
    doc.autoTable({
      startY: 30,
      head: [tableColumns],
      body: tableData,
      theme: "grid",
      styles: {
        fontSize: 7,
        cellPadding: 2,
      },
      headStyles: {
        fillColor: [41, 128, 185],
        textColor: 255,
        fontStyle: "bold",
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245],
      },
      columnStyles: {
        0: { cellWidth: 15 }, // Sr No
        1: { cellWidth: 25 }, // Country
        2: { cellWidth: 25 }, // Region
        3: { cellWidth: 25 }, // City
        4: { cellWidth: 30 }, // ISP
        5: { cellWidth: 25 }, // IP Address
        6: { cellWidth: 30 }, // Login Time
        7: { cellWidth: 20 }, // Latitude
        8: { cellWidth: 20 }, // Longitude
      },
      margin: { left: 10, right: 10 },
    });

    // Save PDF
    doc.save(`${filename}-${new Date().toISOString().split("T")[0]}.pdf`);

    return true;
  } catch (error) {
    console.error("PDF export error:", error);
    throw new Error("PDF export failed: " + error.message);
  }
};

// Export function for Password History
export const exportPasswordHistoryToExcel = (
  data,
  filename = "password-history"
) => {
  try {
    const excelData = data.map((item, index) => ({
      "Sr No": index + 1,
      Username: item.username || "N/A",
      Date: item.date || item.loginDate || "N/A",
      "IP Address": item.IpAddress || "N/A",
      Country: item.country || "N/A",
      Region: item.region || "N/A",
      ISP: item.isp || "N/A",
    }));

    const ws = XLSX.utils.json_to_sheet(excelData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Password History");

    XLSX.writeFile(
      wb,
      `${filename}-${new Date().toISOString().split("T")[0]}.xlsx`
    );

    return true;
  } catch (error) {
    console.error("Excel export error:", error);
    throw new Error("Excel export failed");
  }
};

// PDF export function for Password History
export const exportPasswordHistoryToPDF = async (
  data,
  filename = "password-history"
) => {
  try {
    const { jsPDF } = await import("jspdf");
    await import("jspdf-autotable");

    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text("Password Change History", 14, 15);

    doc.setFontSize(10);
    doc.text(`Generated on: ${new Date().toLocaleString("en-IN")}`, 14, 25);

    const tableData = data.map((item, index) => [
      index + 1,
      item.username || "N/A",
      item.date || item.loginDate || "N/A",
      item.IpAddress || "N/A",
      item.country || "N/A",
      item.region || "N/A",
      item.isp || "N/A",
    ]);

    const tableColumns = [
      "Sr No",
      "Username",
      "Date",
      "IP Address",
      "Country",
      "Region",
      "ISP",
    ];

    doc.autoTable({
      startY: 30,
      head: [tableColumns],
      body: tableData,
      theme: "grid",
      styles: {
        fontSize: 8,
        cellPadding: 2,
      },
      headStyles: {
        fillColor: [41, 128, 185],
        textColor: 255,
        fontStyle: "bold",
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245],
      },
      columnStyles: {
        0: { cellWidth: 15 },
        1: { cellWidth: 25 },
        2: { cellWidth: 30 },
        3: { cellWidth: 25 },
        4: { cellWidth: 25 },
        5: { cellWidth: 25 },
        6: { cellWidth: 30 },
      },
      margin: { left: 10, right: 10 },
    });

    doc.save(`${filename}-${new Date().toISOString().split("T")[0]}.pdf`);

    return true;
  } catch (error) {
    console.error("PDF export error:", error);
    throw new Error("PDF export failed: " + error.message);
  }
};
