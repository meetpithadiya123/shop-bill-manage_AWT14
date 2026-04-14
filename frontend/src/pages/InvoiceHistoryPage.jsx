import { useEffect, useState } from "react";
import axios from "axios";
import { downloadInvoicePdf } from "../utils/invoicePdf";

const API_URL = "https://shop-backend-one.vercel.app/api/invoices";

const InvoiceHistoryPage = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const response = await axios.get(API_URL);
        setInvoices(response.data);
      } catch (fetchError) {
        setError(fetchError.response?.data?.message || "Failed to load history.");
      } finally {
        setLoading(false);
      }
    };

    fetchInvoices();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this invoice?")) return;

    try {
      await axios.delete(`${API_URL}/${id}`);
      setInvoices((prev) => prev.filter((inv) => inv._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete invoice.");
    }
  };

  if (loading) {
    return (
        <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600" />
            <p className="font-bold text-slate-500">Loading history...</p>
        </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl animate-in fade-in slide-in-from-bottom-4 duration-700 p-6 md:p-12 min-h-screen pb-24">
      <div className="mb-10 flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
            <h1 className="text-3xl font-black tracking-tight text-slate-900">Billing History</h1>
            <p className="mt-2 font-medium text-slate-500">A detailed record of all generated invoices.</p>
        </div>
        <div className="flex h-fit items-center gap-2 rounded-2xl bg-white px-4 py-2 shadow-sm border border-slate-100">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-bold text-slate-600 uppercase tracking-widest">{invoices.length} Invoices Found</span>
        </div>
      </div>

      {error && (
        <div className="mb-6 rounded-2xl bg-rose-50 p-4 text-center text-rose-700 border border-rose-100 font-bold">
            {error}
        </div>
      )}

      <div className="overflow-hidden rounded-3xl border border-white/40 bg-white/70 shadow-2xl shadow-indigo-100/30 backdrop-blur-xl">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50">
                <th className="px-6 py-5 text-xs font-bold uppercase tracking-widest text-slate-400">No.</th>
                <th className="px-6 py-5 text-xs font-bold uppercase tracking-widest text-slate-400">Customer</th>
                <th className="px-6 py-5 text-xs font-bold uppercase tracking-widest text-slate-400">Product</th>
                <th className="px-6 py-5 text-xs font-bold uppercase tracking-widest text-slate-400">Date</th>
                <th className="px-6 py-5 text-xs font-bold uppercase tracking-widest text-slate-400">Amount</th>
                <th className="px-6 py-5 text-right text-xs font-bold uppercase tracking-widest text-slate-400">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {invoices.length === 0 ? (
                <tr>
                  <td className="px-6 py-12 text-center" colSpan={6}>
                    <div className="flex flex-col items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-50 text-slate-300">
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>
                        <p className="text-sm font-bold text-slate-400 text-center">No invoices have been generated yet.<br/>Start by creating your first bill.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                invoices.map((invoice, index) => (
                  <tr key={invoice._id} className="group transition-colors hover:bg-slate-50/50">
                    <td className="px-6 py-5">
                        <p className="text-xs font-bold text-slate-400">#{index + 1}</p>
                    </td>
                    <td className="px-6 py-5">
                        <p className="font-bold text-slate-900">{invoice.customerName}</p>
                    </td>
                    <td className="px-6 py-5">
                        <p className="text-sm font-medium text-slate-600">{invoice.productName}</p>
                    </td>
                    <td className="px-6 py-5">
                        <p className="text-sm font-semibold text-slate-500">{new Date(invoice.billingDate).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                    </td>
                    <td className="px-6 py-5">
                        <p className="font-black text-indigo-600">Rs. {Number(invoice.total).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</p>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-bold text-slate-700 shadow-sm border border-slate-200 transition-all hover:bg-slate-900 hover:text-white hover:border-slate-900 active:scale-95"
                          onClick={() => downloadInvoicePdf(invoice)}
                          title="Download PDF"
                        >
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                          </svg>
                          PDF
                        </button>
                        <button
                          type="button"
                          className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-rose-50 text-rose-600 transition-all hover:bg-rose-600 hover:text-white active:scale-95"
                          onClick={() => handleDelete(invoice._id)}
                          title="Delete Invoice"
                        >
                          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default InvoiceHistoryPage;
