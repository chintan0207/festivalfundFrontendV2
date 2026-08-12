import type { Contribution, Expense, Festival } from "@/lib/data/mockData";

export interface PdfReportData {
  festival: Festival;
  contributions: Contribution[];
  expenses: Expense[];
  openingBalance: number;
  totalCollected: number;
  pendingAmount: number;
  totalSpent: number;
  currentBalance: number;
  categoryTotals: Record<string, number>;
  filteredDateLabel?: string;
}

export interface FilteredPdfData<T> {
  festivalName: string;
  items: T[];
  filterLabel?: string;
  totalAmount: number;
}

export function generateFestivalReportPdf(data: PdfReportData) {
  const {
    festival,
    contributions,
    expenses,
    openingBalance,
    totalCollected,
    pendingAmount,
    totalSpent,
    currentBalance,
    categoryTotals,
    filteredDateLabel,
  } = data;

  const nowStr = new Date().toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });

  const contributionRows = contributions
    .map(
      (c, i) => `
      <tr>
        <td style="padding: 8px; border-bottom: 1px solid #e5e7eb; font-size: 11px;">${i + 1}</td>
        <td style="padding: 8px; border-bottom: 1px solid #e5e7eb; font-size: 11px; font-weight: 600;">
          ${c.contributorName}
          <div style="font-size: 10px; color: #6b7280; font-weight: normal;">Rec: ${c.receiptNo} | ${c.paymentMode || "CASH"}</div>
        </td>
        <td style="padding: 8px; border-bottom: 1px solid #e5e7eb; font-size: 11px;">${c.date}</td>
        <td style="padding: 8px; border-bottom: 1px solid #e5e7eb; font-size: 11px; text-align: right; font-weight: bold; color: #059669;">
          ₹${c.amount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
        </td>
        <td style="padding: 8px; border-bottom: 1px solid #e5e7eb; font-size: 11px; text-align: center;">
          <span style="display: inline-block; padding: 2px 8px; border-radius: 12px; font-size: 10px; font-weight: bold; background: ${
            c.status === "DEPOSITED" ? "#d1fae5; color: #065f46;" : "#fef3c7; color: #92400e;"
          }">${c.status}</span>
        </td>
      </tr>
    `
    )
    .join("");

  const expenseRows = expenses
    .map(
      (e, i) => `
      <tr>
        <td style="padding: 8px; border-bottom: 1px solid #e5e7eb; font-size: 11px;">${i + 1}</td>
        <td style="padding: 8px; border-bottom: 1px solid #e5e7eb; font-size: 11px; font-weight: 600;">
          ${e.title}
          <div style="font-size: 10px; color: #6b7280; font-weight: normal;">Voucher: ${e.voucherNo} | Paid to: ${e.paidTo}</div>
        </td>
        <td style="padding: 8px; border-bottom: 1px solid #e5e7eb; font-size: 11px;">${e.category}</td>
        <td style="padding: 8px; border-bottom: 1px solid #e5e7eb; font-size: 11px;">${e.date}</td>
        <td style="padding: 8px; border-bottom: 1px solid #e5e7eb; font-size: 11px; text-align: right; font-weight: bold; color: #dc2626;">
          ₹${e.amount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
        </td>
      </tr>
    `
    )
    .join("");

  const categoryRows = Object.entries(categoryTotals)
    .map(
      ([cat, amt]) => `
      <tr>
        <td style="padding: 8px; border-bottom: 1px solid #e5e7eb; font-size: 11px; font-weight: 500;">${cat}</td>
        <td style="padding: 8px; border-bottom: 1px solid #e5e7eb; font-size: 11px; text-align: right; font-weight: bold;">
          ₹${amt.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
        </td>
        <td style="padding: 8px; border-bottom: 1px solid #e5e7eb; font-size: 11px; text-align: right; color: #6b7280;">
          ${totalSpent > 0 ? ((amt / totalSpent) * 100).toFixed(1) : 0}%
        </td>
      </tr>
    `
    )
    .join("");

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Festival Financial Report - ${festival?.name || "Festival"}</title>
        <style>
          @page {
            size: A4;
            margin: 15mm;
          }
          body {
            font-family: 'Segoe UI', Arial, sans-serif;
            color: #1f2937;
            margin: 0;
            padding: 0;
            background: #ffffff;
          }
          .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 2px solid #3b82f6;
            padding-bottom: 12px;
            margin-bottom: 20px;
          }
          .title {
            font-size: 22px;
            font-weight: bold;
            color: #1e3a8a;
            margin: 0;
          }
          .subtitle {
            font-size: 12px;
            color: #4b5563;
            margin-top: 4px;
          }
          .meta {
            text-align: right;
            font-size: 10px;
            color: #6b7280;
          }
          .kpi-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 10px;
            margin-bottom: 20px;
          }
          .kpi-box {
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 6px;
            padding: 10px;
            text-align: center;
          }
          .kpi-label {
            font-size: 10px;
            color: #64748b;
            text-transform: uppercase;
            font-weight: 600;
          }
          .kpi-val {
            font-size: 14px;
            font-weight: bold;
            color: #0f172a;
            margin-top: 4px;
          }
          .section-title {
            font-size: 14px;
            font-weight: bold;
            color: #1e40af;
            border-bottom: 1px solid #cbd5e1;
            padding-bottom: 4px;
            margin-top: 20px;
            margin-bottom: 10px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 16px;
          }
          th {
            background: #f1f5f9;
            color: #334155;
            font-size: 11px;
            font-weight: bold;
            text-align: left;
            padding: 8px;
            border-bottom: 2px solid #cbd5e1;
          }
          .sign-block {
            margin-top: 40px;
            display: flex;
            justify-content: space-between;
            padding-top: 30px;
            border-top: 1px dashed #94a3b8;
          }
          .sign-box {
            text-align: center;
            width: 200px;
          }
          .sign-line {
            border-top: 1px solid #475569;
            margin-top: 40px;
            padding-top: 4px;
            font-size: 11px;
            font-weight: bold;
            color: #334155;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <h1 class="title">${festival?.name || "Festival Fund"}</h1>
            <div class="subtitle">Complete Financial Summary & Audit Statement ${festival?.year ? `(${festival.year})` : ""}</div>
            ${filteredDateLabel ? `<div style="font-size: 10px; color: #2563eb; margin-top: 2px;">Filtered: ${filteredDateLabel}</div>` : ""}
          </div>
          <div class="meta">
            <div><strong>Report ID:</strong> RPT-${Date.now().toString().slice(-6)}</div>
            <div><strong>Generated:</strong> ${nowStr}</div>
            <div><strong>Status:</strong> AUDITED & VERIFIED</div>
          </div>
        </div>

        <div class="kpi-grid">
          <div class="kpi-box">
            <div class="kpi-label">Opening Balance</div>
            <div class="kpi-val">₹${openingBalance.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</div>
          </div>
          <div class="kpi-box">
            <div class="kpi-label">Total Contributions</div>
            <div class="kpi-val" style="color: #059669;">₹${totalCollected.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</div>
          </div>
          <div class="kpi-box">
            <div class="kpi-label">Total Expenses</div>
            <div class="kpi-val" style="color: #dc2626;">₹${totalSpent.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</div>
          </div>
          <div class="kpi-box" style="background: #eff6ff; border-color: #bfdbfe;">
            <div class="kpi-label">Net Current Balance</div>
            <div class="kpi-val" style="color: #1d4ed8;">₹${currentBalance.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</div>
          </div>
        </div>

        <div class="section-title">1. Financial Balance Sheet Overview</div>
        <table>
          <thead>
            <tr>
              <th>Particulars</th>
              <th style="text-align: right;">Amount (₹)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style="padding: 8px; border-bottom: 1px solid #e5e7eb; font-size: 11px;">Opening Balance Brought Forward</td>
              <td style="padding: 8px; border-bottom: 1px solid #e5e7eb; font-size: 11px; text-align: right; font-weight: bold;">₹${openingBalance.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border-bottom: 1px solid #e5e7eb; font-size: 11px; color: #059669;">Add: Total Verified Contributions Received</td>
              <td style="padding: 8px; border-bottom: 1px solid #e5e7eb; font-size: 11px; text-align: right; font-weight: bold; color: #059669;">+ ₹${totalCollected.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border-bottom: 1px solid #e5e7eb; font-size: 11px; color: #dc2626;">Less: Total Festival Expenses Approved</td>
              <td style="padding: 8px; border-bottom: 1px solid #e5e7eb; font-size: 11px; text-align: right; font-weight: bold; color: #dc2626;">- ₹${totalSpent.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</td>
            </tr>
            <tr style="background: #f0fdf4;">
              <td style="padding: 10px; border-bottom: 2px solid #059669; font-size: 12px; font-weight: bold; color: #065f46;">Net Closing Treasury Balance</td>
              <td style="padding: 10px; border-bottom: 2px solid #059669; font-size: 12px; text-align: right; font-weight: bold; color: #065f46;">₹${currentBalance.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border-bottom: 1px solid #e5e7eb; font-size: 11px; color: #d97706;">Pending Uncollected Pledges</td>
              <td style="padding: 8px; border-bottom: 1px solid #e5e7eb; font-size: 11px; text-align: right; font-weight: bold; color: #d97706;">₹${pendingAmount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</td>
            </tr>
          </tbody>
        </table>

        <div class="section-title">2. Expenditure Category Allocation Breakdown</div>
        <table>
          <thead>
            <tr>
              <th>Expense Category</th>
              <th style="text-align: right;">Total Spent (₹)</th>
              <th style="text-align: right;">Share (%)</th>
            </tr>
          </thead>
          <tbody>
            ${categoryRows || '<tr><td colSpan="3" style="padding: 8px; text-align: center; color: #9ca3af;">No expenses recorded.</td></tr>'}
          </tbody>
        </table>

        <div class="section-title">3. Detailed Contributions Ledger (${contributions.length} Records)</div>
        <table>
          <thead>
            <tr>
              <th style="width: 30px;">#</th>
              <th>Contributor & Receipt</th>
              <th>Date</th>
              <th style="text-align: right;">Amount</th>
              <th style="text-align: center;">Status</th>
            </tr>
          </thead>
          <tbody>
            ${contributionRows || '<tr><td colSpan="5" style="padding: 8px; text-align: center; color: #9ca3af;">No contributions found.</td></tr>'}
          </tbody>
        </table>

        <div class="section-title">4. Detailed Expenses Ledger (${expenses.length} Records)</div>
        <table>
          <thead>
            <tr>
              <th style="width: 30px;">#</th>
              <th>Voucher Title & Vendor</th>
              <th>Category</th>
              <th>Date</th>
              <th style="text-align: right;">Amount</th>
            </tr>
          </thead>
          <tbody>
            ${expenseRows || '<tr><td colSpan="5" style="padding: 8px; text-align: center; color: #9ca3af;">No expenses found.</td></tr>'}
          </tbody>
        </table>

        <div class="sign-block">
          <div class="sign-box">
            <div class="sign-line">Treasurer / Cashier Signature</div>
          </div>
          <div class="sign-box">
            <div class="sign-line">Festival Secretary Signature</div>
          </div>
          <div class="sign-box">
            <div class="sign-line">Independent Auditor Sign-off</div>
          </div>
        </div>

        <script>
          window.onload = function() {
            setTimeout(function() {
              window.print();
            }, 400);
          };
        </script>
      </body>
    </html>
  `;

  const printWindow = window.open("", "_blank");
  if (printWindow) {
    printWindow.document.write(htmlContent);
    printWindow.document.close();
  } else {
    alert("Please allow popups to open and print the PDF report.");
  }
}

export function generateFilteredContributionsPdf(data: FilteredPdfData<Contribution>) {
  const { festivalName, items, filterLabel, totalAmount } = data;
  const nowStr = new Date().toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" });

  const rows = items
    .map(
      (c, i) => `
      <tr>
        <td style="padding: 8px; border-bottom: 1px solid #e5e7eb; font-size: 11px;">${i + 1}</td>
        <td style="padding: 8px; border-bottom: 1px solid #e5e7eb; font-size: 11px; font-weight: bold;">
          ${c.contributorName}
          <div style="font-size: 10px; color: #6b7280; font-weight: normal;">Rec: ${c.receiptNo} | ${c.paymentMode || "CASH"}</div>
        </td>
        <td style="padding: 8px; border-bottom: 1px solid #e5e7eb; font-size: 11px;">${c.date}</td>
        <td style="padding: 8px; border-bottom: 1px solid #e5e7eb; font-size: 11px; text-align: right; font-weight: bold; color: #059669;">
          ₹${c.amount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
        </td>
        <td style="padding: 8px; border-bottom: 1px solid #e5e7eb; font-size: 11px; text-align: center;">
          <span style="display: inline-block; padding: 2px 8px; border-radius: 12px; font-size: 10px; font-weight: bold; background: ${
            c.status === "DEPOSITED" ? "#d1fae5; color: #065f46;" : "#fef3c7; color: #92400e;"
          }">${c.status}</span>
        </td>
      </tr>
    `
    )
    .join("");

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Filtered Contributions PDF Report - ${festivalName}</title>
        <style>
          @page { size: A4; margin: 15mm; }
          body { font-family: 'Segoe UI', Arial, sans-serif; color: #1f2937; margin: 0; padding: 0; }
          .header { border-bottom: 2px solid #8b5cf6; padding-bottom: 10px; margin-bottom: 16px; display: flex; justify-content: space-between; }
          .filter-banner { background: #f3e8ff; border: 1px solid #d8b4fe; color: #6b21a8; font-size: 11px; font-weight: 600; padding: 8px 12px; border-radius: 6px; margin-bottom: 16px; }
          table { width: 100%; border-collapse: collapse; }
          th { background: #f5f3ff; color: #581c87; font-size: 11px; padding: 8px; text-align: left; border-bottom: 2px solid #ddd6fe; }
          .total-bar { margin-top: 16px; background: #faf5ff; border: 1px solid #e9d5ff; padding: 12px; font-weight: bold; display: flex; justify-content: space-between; border-radius: 6px; }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <h1 style="font-size: 20px; color: #581c87; margin: 0;">${festivalName}</h1>
            <div style="font-size: 12px; color: #6b7280;">Filtered Contributions Ledger Report</div>
          </div>
          <div style="text-align: right; font-size: 10px; color: #6b7280;">
            <div>Generated: ${nowStr}</div>
            <div>Records: ${items.length}</div>
          </div>
        </div>

        ${filterLabel ? `<div class="filter-banner">Filtered by: ${filterLabel}</div>` : ""}

        <table>
          <thead>
            <tr>
              <th style="width: 30px;">#</th>
              <th>Contributor & Receipt</th>
              <th>Date</th>
              <th style="text-align: right;">Amount</th>
              <th style="text-align: center;">Status</th>
            </tr>
          </thead>
          <tbody>
            ${rows || '<tr><td colSpan="5" style="padding: 12px; text-align: center; color: #9ca3af;">No matching contributions found.</td></tr>'}
          </tbody>
        </table>

        <div class="total-bar">
          <span>Total Filtered Contributions</span>
          <span style="color: #059669; font-size: 14px;">₹${totalAmount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
        </div>

        <script>
          window.onload = function() { setTimeout(function() { window.print(); }, 400); };
        </script>
      </body>
    </html>
  `;

  const win = window.open("", "_blank");
  if (win) {
    win.document.write(html);
    win.document.close();
  }
}

export function generateFilteredExpensesPdf(data: FilteredPdfData<Expense>) {
  const { festivalName, items, filterLabel, totalAmount } = data;
  const nowStr = new Date().toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" });

  const rows = items
    .map(
      (e, i) => `
      <tr>
        <td style="padding: 8px; border-bottom: 1px solid #e5e7eb; font-size: 11px;">${i + 1}</td>
        <td style="padding: 8px; border-bottom: 1px solid #e5e7eb; font-size: 11px; font-weight: bold;">
          ${e.title}
          <div style="font-size: 10px; color: #6b7280; font-weight: normal;">Voucher: ${e.voucherNo} | Paid to: ${e.paidTo}</div>
        </td>
        <td style="padding: 8px; border-bottom: 1px solid #e5e7eb; font-size: 11px;">${e.category}</td>
        <td style="padding: 8px; border-bottom: 1px solid #e5e7eb; font-size: 11px;">${e.date}</td>
        <td style="padding: 8px; border-bottom: 1px solid #e5e7eb; font-size: 11px; text-align: right; font-weight: bold; color: #dc2626;">
          ₹${e.amount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
        </td>
      </tr>
    `
    )
    .join("");

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Filtered Expenses PDF Report - ${festivalName}</title>
        <style>
          @page { size: A4; margin: 15mm; }
          body { font-family: 'Segoe UI', Arial, sans-serif; color: #1f2937; margin: 0; padding: 0; }
          .header { border-bottom: 2px solid #e11d48; padding-bottom: 10px; margin-bottom: 16px; display: flex; justify-content: space-between; }
          .filter-banner { background: #ffe4e6; border: 1px solid #fecdd3; color: #9f1239; font-size: 11px; font-weight: 600; padding: 8px 12px; border-radius: 6px; margin-bottom: 16px; }
          table { width: 100%; border-collapse: collapse; }
          th { background: #fff1f2; color: #881337; font-size: 11px; padding: 8px; text-align: left; border-bottom: 2px solid #fecdd3; }
          .total-bar { margin-top: 16px; background: #fff1f2; border: 1px solid #fecdd3; padding: 12px; font-weight: bold; display: flex; justify-content: space-between; border-radius: 6px; }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <h1 style="font-size: 20px; color: #9f1239; margin: 0;">${festivalName}</h1>
            <div style="font-size: 12px; color: #6b7280;">Filtered Expenses Voucher Ledger Report</div>
          </div>
          <div style="text-align: right; font-size: 10px; color: #6b7280;">
            <div>Generated: ${nowStr}</div>
            <div>Records: ${items.length}</div>
          </div>
        </div>

        ${filterLabel ? `<div class="filter-banner">Filtered by: ${filterLabel}</div>` : ""}

        <table>
          <thead>
            <tr>
              <th style="width: 30px;">#</th>
              <th>Voucher Title & Payee</th>
              <th>Category</th>
              <th>Date</th>
              <th style="text-align: right;">Amount</th>
            </tr>
          </thead>
          <tbody>
            ${rows || '<tr><td colSpan="5" style="padding: 12px; text-align: center; color: #9ca3af;">No matching expenses found.</td></tr>'}
          </tbody>
        </table>

        <div class="total-bar">
          <span>Total Filtered Expenses</span>
          <span style="color: #dc2626; font-size: 14px;">₹${totalAmount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
        </div>

        <script>
          window.onload = function() { setTimeout(function() { window.print(); }, 400); };
        </script>
      </body>
    </html>
  `;

  const win = window.open("", "_blank");
  if (win) {
    win.document.write(html);
    win.document.close();
  }
}
