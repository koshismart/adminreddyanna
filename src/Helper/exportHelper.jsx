import * as XLSX from "xlsx";

// Excel export function
export const exportToExcel = (data, filename = "account-statement") => {
  try {
    const excelData = data.map((item, index) => ({
      "Sr No": index + 1,
      Date: new Date(item.createdAt).toLocaleString("en-IN"),
      Credit: item.credit || 0,
      Debit: item.debit || 0,
      Balance: item.totalUserBalance || 0,
      Remark: item.narration || "",
      //   Remark: item.remark || "",
      "From/To": item.fromto || "",
    }));

    const ws = XLSX.utils.json_to_sheet(excelData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Account Statement");

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

// PDF export function - FIXED VERSION
export const exportToPDF = async (data, filename = "account-statement") => {
  try {
    // Dynamic import to avoid loading issues
    const { jsPDF } = await import("jspdf");
    await import("jspdf-autotable");

    // Create PDF instance
    const doc = new jsPDF();

    // Add title
    doc.setFontSize(16);
    doc.text("Account Statement", 14, 15);

    // Add date
    doc.setFontSize(10);
    doc.text(`Generated on: ${new Date().toLocaleString("en-IN")}`, 14, 25);

    // Prepare table data
    const tableData = data.map((item, index) => [
      index + 1,
      new Date(item.createdAt).toLocaleDateString("en-IN"),
      item.credit || 0,
      item.debit || 0,
      item.totalUserBalance || 0,
      //   item.narration || "",
      item.narration || "",
      item.fromto || "",
    ]);

    // Define table columns
    const tableColumns = [
      "Sr No",
      "Date",
      "Credit",
      "Debit",
      "Balance",
      //   "Narration",
      "Remark",
      "From/To",
    ];

    // Add table using autoTable
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
        0: { cellWidth: 15 }, // Sr No
        1: { cellWidth: 25 }, // Date
        2: { cellWidth: 20 }, // Credit
        3: { cellWidth: 20 }, // Debit
        4: { cellWidth: 25 }, // Balance
        5: { cellWidth: 40 }, // Narration
        6: { cellWidth: 30 }, // Remark
        7: { cellWidth: 30 }, // From/To
      },
      margin: { left: 14, right: 14 },
    });

    // Save PDF
    doc.save(`${filename}-${new Date().toISOString().split("T")[0]}.pdf`);

    return true;
  } catch (error) {
    console.error("PDF export error:", error);
    throw new Error("PDF export failed: " + error.message);
  }
};

// bank page excel and pdf page

// Bank Excel export function
export const bankexportToExcel = (data, filename = "bank-users-report") => {
  try {
    const excelData = data.map((item, index) => ({
      "Sr No": index + 1,
      "User Name": item["User Name"] || "",
      "Login ID": item["Login ID"] || "",
      CR: item["CR"] || "0.00",
      Pts: item["Pts"] || "0.00",
      "Client(P/L)": item["Client(P/L)"] || "0.00",
      Exposure: item["Exposure"] || "0.00",
      "Available Pts": item["Available Pts"] || "0.00",
      "Account Type": item["Account Type"] || "",
      Status: item["Status"] || "Active",
    }));

    const ws = XLSX.utils.json_to_sheet(excelData);

    // Set column widths
    const wscols = [
      { wch: 8 }, // Sr No
      { wch: 20 }, // User Name
      { wch: 15 }, // Login ID
      { wch: 15 }, // CR
      { wch: 15 }, // Pts
      { wch: 15 }, // Client(P/L)
      { wch: 15 }, // Exposure
      { wch: 15 }, // Available Pts
      { wch: 15 }, // Account Type
      { wch: 20 }, // Status
    ];
    ws["!cols"] = wscols;

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Bank Users");

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

// Bank PDF export function
export const bankexportToPDF = async (data, filename = "bank-users-report") => {
  try {
    // Dynamic import to avoid loading issues
    const { jsPDF } = await import("jspdf");
    await import("jspdf-autotable");

    // Create PDF instance
    const doc = new jsPDF();

    // Add title
    doc.setFontSize(16);
    doc.text("Bank Users Report", 14, 15);

    // Add date and info
    doc.setFontSize(10);
    doc.text(`Generated on: ${new Date().toLocaleString("en-IN")}`, 14, 25);
    doc.text(`Total Users: ${data.length}`, 14, 32);

    // Prepare table data
    const tableData = data.map((item, index) => [
      index + 1,
      item["User Name"] || "",
      item["Login ID"] || "",
      item["CR"] || "0.00",
      item["Pts"] || "0.00",
      item["Client(P/L)"] || "0.00",
      item["Exposure"] || "0.00",
      item["Available Pts"] || "0.00",
      item["Account Type"] || "",
      item["Status"] || "Active",
    ]);

    // Define table columns
    const tableColumns = [
      "Sr No",
      "User Name",
      "Login ID",
      "CR",
      "Pts",
      "Client(P/L)",
      "Exposure",
      "Available Pts",
      "Account Type",
      "Status",
    ];

    // Add table using autoTable
    doc.autoTable({
      startY: 40,
      head: [tableColumns],
      body: tableData,
      theme: "grid",
      styles: {
        fontSize: 8,
        cellPadding: 3,
        overflow: "linebreak",
      },
      headStyles: {
        fillColor: [41, 128, 185],
        textColor: 255,
        fontStyle: "bold",
        fontSize: 9,
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245],
      },
      columnStyles: {
        0: { cellWidth: 10, halign: "center" }, // Sr No
        1: { cellWidth: 25 }, // User Name
        2: { cellWidth: 20 }, // Login ID
        3: { cellWidth: 15, halign: "right" }, // CR
        4: { cellWidth: 15, halign: "right" }, // Pts
        5: { cellWidth: 18, halign: "right" }, // Client(P/L)
        6: { cellWidth: 18, halign: "right" }, // Exposure
        7: { cellWidth: 20, halign: "right" }, // Available Pts
        8: { cellWidth: 20 }, // Account Type
        9: { cellWidth: 20 }, // Status
      },
      margin: { left: 10, right: 10 },
      pageBreak: "auto",
    });

    // Save PDF
    doc.save(`${filename}-${new Date().toISOString().split("T")[0]}.pdf`);

    return true;
  } catch (error) {
    console.error("PDF export error:", error);
    throw new Error("PDF export failed: " + error.message);
  }
};







// profitloss pdf and excel code 

// import XLSX from 'xlsx';

// Party Win/Loss Excel export function
export const partyExportToExcel = (data, filename = "party-win-loss-report") => {
  try {
    const excelData = data.map((item) => ({
      "Sr No": item.No || 0,
      "User Name": item["User Name"] || "",
      "Login ID": item["Login ID"] || "",
      "Level": item.Level || "",
      "Casino Pts": item["Casino Pts"] || "0.00",
      "Sports Pts": item["Sports Pts"] || "0.00",
      "Third Party Pts": item["Third Party Pts"] || "0.00",
      "Profit/Loss": item["Profit/Loss"] || "0.00",
      "Partnership Type": item["Partnership Type"] || "",
      "Game Date": item["Game Date"] || "",
      "Sport Type": item["Sport Type"] || "",
      "Game Name": item["Game Name"] || ""
    }));

    const ws = XLSX.utils.json_to_sheet(excelData);

    // Set column widths
    const wscols = [
      { wch: 8 },   // Sr No
      { wch: 25 },  // User Name
      { wch: 15 },  // Login ID
      { wch: 12 },  // Level
      { wch: 15 },  // Casino Pts
      { wch: 15 },  // Sports Pts
      { wch: 18 },  // Third Party Pts
      { wch: 15 },  // Profit/Loss
      { wch: 20 },  // Partnership Type
      { wch: 15 },  // Game Date
      { wch: 15 },  // Sport Type
      { wch: 20 },  // Game Name
    ];
    ws["!cols"] = wscols;

    // Add title row
    const title = "Party Win/Loss Report";
    XLSX.utils.sheet_add_aoa(ws, [[title]], { origin: "A1" });

    // Merge title cells
    if (!ws['!merges']) ws['!merges'] = [];
    ws['!merges'].push({ s: { r: 0, c: 0 }, e: { r: 0, c: wscols.length - 1 } });

    // Style title row
    const titleCell = ws["A1"];
    titleCell.s = {
      font: { sz: 16, bold: true },
      alignment: { horizontal: "center" }
    };

    // Add date info
    const dateInfo = `Generated on: ${new Date().toLocaleString("en-IN")} | Total Records: ${data.length}`;
    XLSX.utils.sheet_add_aoa(ws, [[dateInfo]], { origin: "A2" });
    
    if (!ws['!merges']) ws['!merges'] = [];
    ws['!merges'].push({ s: { r: 1, c: 0 }, e: { r: 1, c: wscols.length - 1 } });

    // Add header row starting from row 3
    const headers = Object.keys(excelData[0] || {});
    XLSX.utils.sheet_add_aoa(ws, [headers], { origin: "A3" });

    // Style header row
    const range = XLSX.utils.decode_range(ws['!ref']);
    for (let C = range.s.c; C <= range.e.c; ++C) {
      const address = XLSX.utils.encode_cell({ r: 3, c: C });
      if (!ws[address]) continue;
      ws[address].s = {
        font: { bold: true, color: { rgb: "FFFFFF" } },
        fill: { fgColor: { rgb: "2980B9" } },
        alignment: { horizontal: "center" }
      };
    }

    // Adjust data start position (header is at row 3, so data starts at row 4)
    const dataStart = 4;
    for (let R = dataStart; R <= range.e.r; ++R) {
      for (let C = range.s.c; C <= range.e.c; ++C) {
        const address = XLSX.utils.encode_cell({ r: R, c: C });
        if (!ws[address]) continue;
        
        // Style numeric columns
        if (C >= 4 && C <= 7) { // Casino Pts to Profit/Loss columns
          ws[address].s = {
            numFmt: '#,##0.00',
            alignment: { horizontal: "right" }
          };
        }
        
        // Add alternating row colors
        if (R % 2 === 0) {
          ws[address].s = {
            ...ws[address].s,
            fill: { fgColor: { rgb: "F8F9FA" } }
          };
        }
      }
    }

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Party Win Loss");

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

// Party Win/Loss PDF export function
export const partyExportToPDF = async (data, filename = "party-win-loss-report") => {
  try {
    // Dynamic import to avoid loading issues
    const { jsPDF } = await import("jspdf");
    await import("jspdf-autotable");

    // Create PDF instance
    const doc = new jsPDF();

    // Add title
    doc.setFontSize(16);
    doc.text("Party Win/Loss Report", 14, 15);

    // Add date and info
    doc.setFontSize(10);
    doc.text(`Generated on: ${new Date().toLocaleString("en-IN")}`, 14, 25);
    doc.text(`Total Records: ${data.length}`, 14, 32);

    // Prepare table data
    const tableData = data.map((item) => [
      item.No || 0,
      item["User Name"] || "",
      item["Login ID"] || "",
      item.Level || "",
      parseFloat(item["Casino Pts"]?.replace(/,/g, '') || 0).toFixed(2),
      parseFloat(item["Sports Pts"]?.replace(/,/g, '') || 0).toFixed(2),
      parseFloat(item["Third Party Pts"]?.replace(/,/g, '') || 0).toFixed(2),
      parseFloat(item["Profit/Loss"]?.replace(/,/g, '') || 0).toFixed(2),
      item["Partnership Type"] || "",
      item["Game Date"] || "",
      item["Sport Type"] || "",
      item["Game Name"] || ""
    ]);

    // Define table columns
    const tableColumns = [
      "Sr No",
      "User Name",
      "Login ID",
      "Level",
      "Casino Pts",
      "Sports Pts",
      "Third Party Pts",
      "Profit/Loss",
      "Partnership Type",
      "Game Date",
      "Sport Type",
      "Game Name"
    ];

    // Add table using autoTable
    doc.autoTable({
      startY: 40,
      head: [tableColumns],
      body: tableData,
      theme: "grid",
      styles: {
        fontSize: 7,
        cellPadding: 2,
        overflow: "linebreak",
      },
      headStyles: {
        fillColor: [41, 128, 185],
        textColor: 255,
        fontStyle: "bold",
        fontSize: 8,
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245],
      },
      columnStyles: {
        0: { cellWidth: 8, halign: "center" },   // Sr No
        1: { cellWidth: 20 },                    // User Name
        2: { cellWidth: 15 },                    // Login ID
        3: { cellWidth: 12 },                    // Level
        4: { cellWidth: 15, halign: "right" },   // Casino Pts
        5: { cellWidth: 15, halign: "right" },   // Sports Pts
        6: { cellWidth: 18, halign: "right" },   // Third Party Pts
        7: { cellWidth: 15, halign: "right" },   // Profit/Loss
        8: { cellWidth: 20 },                    // Partnership Type
        9: { cellWidth: 15 },                    // Game Date
        10: { cellWidth: 15 },                   // Sport Type
        11: { cellWidth: 20 }                    // Game Name
      },
      margin: { left: 5, right: 5 },
      pageBreak: "auto",
    });

    // Add totals if needed
    if (data.length > 0) {
      const finalY = doc.lastAutoTable.finalY || 40;
      doc.setFontSize(10);
      doc.setTextColor(100);
      doc.text(`Report exported with ${data.length} records`, 14, finalY + 10);
    }

    // Save PDF
    doc.save(`${filename}-${new Date().toISOString().split("T")[0]}.pdf`);

    return true;
  } catch (error) {
    console.error("PDF export error:", error);
    throw new Error("PDF export failed: " + error.message);
  }
};

