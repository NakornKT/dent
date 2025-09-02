import React, { useState, useEffect } from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

function Report({ userRole, userId, reportType: propReportType }) {
  const [reportType, setReportType] = useState(propReportType || 'appointment');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [appointments, setAppointments] = useState([]);
  const [incomeSummary, setIncomeSummary] = useState({
    total: 0,
    byDoctor: {},
    paymentBreakdown: { cash: { count: 0, amount: 0 }, transfer: { count: 0, amount: 0 } },
  });
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        let url = '';
        if (reportType === 'appointment') {
          url = `http://localhost:5001/api/${userRole}/appointments?date=${selectedDate}&userId=${userId}`;
        } else if (reportType === 'summary') {
          url = `http://localhost:5001/api/${userRole}/income?date=${selectedDate}&userId=${userId}`;
        } else if (reportType === 'receipt') {
          url = `http://localhost:5001/api/${userRole}/receipts?date=${selectedDate}&userId=${userId}`;
        }
        const response = await fetch(url, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });
        const data = await response.json();
        if (response.ok) {
          if (reportType === 'appointment') setAppointments(data.appointments || []);
          else if (reportType === 'summary') {
            setIncomeSummary({
              total: data.total || 0,
              byDoctor: data.byDoctor || {},
              paymentBreakdown: data.paymentBreakdown || { cash: { count: 0, amount: 0 }, transfer: { count: 0, amount: 0 } },
            });
          } else if (reportType === 'receipt') {
            setAppointments(data.receipts || []);
          }
        } else {
          setError(data.error || 'Failed to fetch report data');
        }
      } catch (error) {
        console.error('Fetch error:', error);
        setError('Network error. Please try again.');
      }
    };
    fetchData();
  }, [reportType, selectedDate, userRole, userId]);

  const exportToPDF = () => {
    const isReceipt = reportType === 'receipt';
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: isReceipt ? [148, 210] : [210, 297], // A5 for receipt, A4 for others
    });

    doc.setFontSize(16);
    doc.text(`Report - ${reportType === 'appointment' ? 'ตารางนัด' : reportType === 'summary' ? 'สรุปยอด' : 'ใบเสร็จรับเงิน'}`, 20, 20);
    doc.setFontSize(12);
    doc.text(`วันที่: ${new Date(selectedDate).toLocaleDateString()}`, 20, 30);

    let startY = 40;
    if (reportType === 'appointment') {
      const tableData = appointments.map((appt) => [
        appt.doctorName || 'N/A',
        new Date(appt.dateTime).toLocaleString(),
        appt.status || 'N/A',
      ]);
      doc.autoTable({
        head: [['หมอ', 'วันที่และเวลา', 'สถานะ']],
        body: tableData,
        startY,
        margin: { top: 10 },
        pageBreak: 'auto',
      });
    } else if (reportType === 'summary') {
      const tableData = Object.entries(incomeSummary.byDoctor).map(([doctor, amount]) => [doctor, `${amount} บาท`]);
      doc.autoTable({
        head: [['หมอ', 'ยอดรายได้']],
        body: tableData,
        startY,
        margin: { top: 10 },
        pageBreak: 'auto',
      });

      startY = doc.autoTable.previous.finalY + 10;
      doc.text(`สรุปการชำระเงิน:`, 20, startY);
      startY += 10;
      doc.text(`โอน: ${incomeSummary.paymentBreakdown.transfer.count} รายการ, ${incomeSummary.paymentBreakdown.transfer.amount} บาท`, 20, startY);
      startY += 10;
      doc.text(`เงินสด: ${incomeSummary.paymentBreakdown.cash.count} รายการ, ${incomeSummary.paymentBreakdown.cash.amount} บาท`, 20, startY);
      startY += 10;
      doc.text(`ยอดรวมทั้งหมด: ${incomeSummary.total} บาท`, 20, startY);
    } else if (reportType === 'receipt') {
      appointments.forEach((receipt, index) => {
        if (index > 0) doc.addPage();
        doc.text(`ใบเสร็จรับเงิน #${receipt.id}`, 20, startY);
        startY += 10;
        doc.text(`ชื่อ: ${receipt.patientName || 'N/A'}`, 20, startY);
        startY += 10;
        doc.text(`วันที่: ${new Date(receipt.date).toLocaleDateString()}`, 20, startY);
        startY += 10;
        doc.text(`ยอด: ${receipt.amount} บาท`, 20, startY);
        startY += 10;
        doc.text(`ประเภทการชำระ: ${receipt.paymentType || 'N/A'}`, 20, startY);
      });
    }

    doc.save(`report_${reportType}_${selectedDate}.pdf`);
  };

  if (error) return <p className="text-red-500">{error}</p>;
  return (
    <div className="container mx-auto p-4 bg-gradient-to-r from-gray-50 to-indigo-50 min-h-screen">
      <nav className="bg-white shadow-md rounded-lg p-4 mb-6 flex justify-between items-center">
        <div>
          <button
            onClick={() => setReportType('appointment')}
            className={`mr-4 px-4 py-2 rounded ${reportType === 'appointment' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          >
            ตารางนัด
          </button>
          <button
            onClick={() => setReportType('summary')}
            className={`px-4 py-2 rounded ${reportType === 'summary' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          >
            สรุปยอด
          </button>
          {(userRole === 'staff' || userRole === 'admin') && (
            <button
              onClick={() => setReportType('receipt')}
              className={`ml-4 px-4 py-2 rounded ${reportType === 'receipt' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
            >
              ใบเสร็จ
            </button>
          )}
        </div>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="border p-2 rounded"
        />
        <button onClick={exportToPDF} className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
          Export to PDF
        </button>
      </nav>

      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-3xl font-bold mb-4 text-indigo-600">Report</h2>
        {reportType === 'appointment' ? (
          <div>
            <h3 className="text-2xl font-bold mb-4">ตารางนัดหมาย</h3>
            {appointments.length > 0 ? (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border p-2">หมอ</th>
                    <th className="border p-2">วันที่และเวลา</th>
                    <th className="border p-2">สถานะ</th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.map((appt) => (
                    <tr key={appt.id} className="border">
                      <td className="border p-2">{appt.doctorName || 'N/A'}</td>
                      <td className="border p-2">{new Date(appt.dateTime).toLocaleString()}</td>
                      <td className="border p-2">{appt.status || 'N/A'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>ไม่มีข้อมูลตารางนัดหมาย</p>
            )}
          </div>
        ) : reportType === 'summary' ? (
          <div>
            <h3 className="text-2xl font-bold mb-4">สรุปยอดรายได้</h3>
            {Object.keys(incomeSummary.byDoctor).length > 0 ? (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border p-2">หมอ</th>
                    <th className="border p-2">ยอดรายได้</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(incomeSummary.byDoctor).map(([doctor, amount]) => (
                    <tr key={doctor} className="border">
                      <td className="border p-2">{doctor}</td>
                      <td className="border p-2">{amount} บาท</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>ไม่มีข้อมูลสรุปยอด</p>
            )}
            <div className="mt-4">
              <p>สรุปการชำระเงิน:</p>
              <p>โอน: {incomeSummary.paymentBreakdown.transfer.count} รายการ, {incomeSummary.paymentBreakdown.transfer.amount} บาท</p>
              <p>เงินสด: {incomeSummary.paymentBreakdown.cash.count} รายการ, {incomeSummary.paymentBreakdown.cash.amount} บาท</p>
              <p className="font-bold">ยอดรวมทั้งหมด: {incomeSummary.total} บาท</p>
            </div>
          </div>
        ) : reportType === 'receipt' && (userRole === 'staff' || userRole === 'admin') ? (
          <div>
            <h3 className="text-2xl font-bold mb-4">ใบเสร็จรับเงิน</h3>
            {appointments.length > 0 ? (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border p-2">หมายเลขใบเสร็จ</th>
                    <th className="border p-2">ชื่อคนไข้</th>
                    <th className="border p-2">วันที่</th>
                    <th className="border p-2">ยอด</th>
                    <th className="border p-2">ประเภทการชำระ</th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.map((receipt) => (
                    <tr key={receipt.id} className="border">
                      <td className="border p-2">{receipt.id}</td>
                      <td className="border p-2">{receipt.patientName || 'N/A'}</td>
                      <td className="border p-2">{new Date(receipt.date).toLocaleDateString()}</td>
                      <td className="border p-2">{receipt.amount} บาท</td>
                      <td className="border p-2">{receipt.paymentType || 'N/A'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>ไม่มีใบเสร็จ</p>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default Report;