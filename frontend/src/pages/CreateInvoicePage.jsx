import { useMemo, useState } from "react";
import axios from "axios";
import { downloadInvoicePdf } from "../utils/invoicePdf";

const API_URL = "https://shop-backend-one.vercel.app/";

const today = new Date().toISOString().split("T")[0];

const initialForm = {
  shopName: "Sai Marketing",
  shopAddress: "2, harvandan road, mumbai",
  shopContact: "8989997796",
  customerName: "",
  billingDate: today,
  productName: "",
  price: "",
  quantity: "",
};

const CreateInvoicePage = () => {
  const [formData, setFormData] = useState(initialForm);
  const [message, setMessage] = useState("");
  const [savedInvoice, setSavedInvoice] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const calculatedValues = useMemo(() => {
    console.log("Saving Invoice Payload:", formData);

    const price = Number(formData.price) || 0;
    const quantity = Number(formData.quantity) || 0;
    const total = price * quantity;

    return { total };
  }, [formData.price, formData.quantity]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage("");
    setIsLoading(true);

    try {
      const payload = { ...formData, ...calculatedValues, subtotal: calculatedValues.total };
      const response = await axios.post(API_URL, payload);
      setSavedInvoice(response.data);
      setMessage("Invoice saved successfully!");
    } catch (error) {
      if (!error.response) {
        setMessage("Connection Error: Backend server is not reachable.");
      } else {
        // Show the specific error message from the backend if available
        const backendError = error.response.data.error || error.response.data.message;
        setMessage(`Error: ${backendError}`);
      }
      console.error("Submission Error:", error);
    } finally {
      setIsLoading(false);
      // Auto-hide message after 3 seconds
      setTimeout(() => setMessage(""), 3000);
    }
  };

  const previewInvoice = {
    ...formData,
    ...calculatedValues,
  };

  return (
    <div className="min-h-[calc(100vh-73px)] lg:h-[calc(100vh-73px)] lg:overflow-hidden bg-gradient-to-br from-slate-50 to-slate-100 font-sans text-slate-900 overflow-y-auto">
      {/* Premium Toast Notification */}
      {message && (
        <div className={`fixed top-8 left-1/2 z-50 -translate-x-1/2 animate-in fade-in slide-in-from-top-4 duration-500 w-[90%] max-w-md`}>
          <div className={`flex items-center gap-3 rounded-2xl px-4 py-3 md:px-6 md:py-4 shadow-2xl backdrop-blur-xl border ${
            message.includes("success") 
            ? "bg-emerald-500/90 text-white border-emerald-400" 
            : "bg-rose-500/90 text-white border-rose-400"
          }`}>
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-white/20">
              {message.includes("success") ? (
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </div>
            <p className="text-sm font-bold tracking-wide">{message}</p>
          </div>
        </div>
      )}

      <div className="mx-auto h-full max-w-7xl p-4 md:p-6 lg:p-8 pb-20 md:pb-8">
        <div className="grid h-full gap-6 lg:grid-cols-12 lg:overflow-hidden">
          {/* Form Section */}
          <div className="lg:col-span-7 lg:h-full lg:overflow-y-auto pr-2 custom-scrollbar">
            <form
              onSubmit={handleSubmit}
              className="rounded-3xl border border-white/40 bg-white/70 p-6 shadow-xl shadow-indigo-100/50 backdrop-blur-xl mb-4"
            >
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-lg shadow-indigo-200">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </div>
                <h2 className="text-xl font-bold text-slate-800">New Bill</h2>
              </div>

              <div className="grid gap-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-500 ml-1">Shop Name</label>
                    <input className="w-full rounded-xl border-0 bg-slate-100/50 p-3 text-sm transition-all focus:bg-white focus:ring-2 focus:ring-indigo-500" name="shopName" value={formData.shopName} onChange={handleChange} required />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-500 ml-1">Contact No.</label>
                    <input className="w-full rounded-xl border-0 bg-slate-100/50 p-3 text-sm transition-all focus:bg-white focus:ring-2 focus:ring-indigo-500" name="shopContact" value={formData.shopContact} onChange={handleChange} />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-500 ml-1">Shop Address</label>
                  <input className="w-full rounded-xl border-0 bg-slate-100/50 p-3 text-sm transition-all focus:bg-white focus:ring-2 focus:ring-indigo-500" name="shopAddress" value={formData.shopAddress} onChange={handleChange} />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-500 ml-1">Customer Name</label>
                    <input className="w-full rounded-xl border-0 bg-slate-100/50 p-3 text-sm transition-all focus:bg-white focus:ring-2 focus:ring-indigo-500" name="customerName" value={formData.customerName} onChange={handleChange} required />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-500 ml-1">Billing Date</label>
                    <input className="w-full rounded-xl border-0 bg-slate-100/50 p-3 text-sm transition-all focus:bg-white focus:ring-2 focus:ring-indigo-500" type="date" name="billingDate" value={formData.billingDate} onChange={handleChange} required />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-500 ml-1">Product Details</label>
                  <input className="w-full rounded-xl border-0 bg-slate-100/50 p-3 text-sm transition-all focus:bg-white focus:ring-2 focus:ring-indigo-500" name="productName" placeholder="Enter product name" value={formData.productName} onChange={handleChange} required />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-600 ml-1">Price (Rs.)</label>
                    <input className="w-full rounded-xl border-0 bg-slate-100/50 p-3 text-sm transition-all focus:bg-white focus:ring-2 focus:ring-indigo-500" type="number" min="0" name="price" value={formData.price} onChange={handleChange} required />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-600 ml-1">Quantity</label>
                    <input className="w-full rounded-xl border-0 bg-slate-100/50 p-3 text-sm transition-all focus:bg-white focus:ring-2 focus:ring-indigo-500" type="number" min="1" name="quantity" value={formData.quantity} onChange={handleChange} required />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 p-3.5 font-bold text-white transition-all hover:bg-indigo-700 hover:shadow-lg active:scale-[0.98] disabled:bg-slate-300"
              >
                {isLoading ? (
                  <svg className="h-5 w-5 animate-spin text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                ) : "Generate & Save Invoice"}
              </button>
            </form>
          </div>

          {/* Preview Section */}
          <div className="lg:col-span-5 lg:h-full lg:overflow-hidden flex flex-col gap-4 pr-2">
            <div className="flex-1 lg:overflow-y-auto rounded-3xl border border-white/40 bg-white shadow-xl flex flex-col custom-scrollbar">
              <div className="bg-indigo-950 p-4 text-white shrink-0">
                <h3 className="text-md font-bold">Live Preview</h3>
                <p className="text-[10px] text-indigo-300 uppercase tracking-wider">PDF Mockup</p>
              </div>

              <div className="p-6 flex-1">
                <div className="mb-4 flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-lg font-black text-slate-800 uppercase leading-none truncate">{previewInvoice.shopName || "SAI MARKETING"}</p>
                    <p className="text-[10px] text-slate-500 mt-1 line-clamp-2">{previewInvoice.shopAddress}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Date</p>
                    <p className="text-xs font-bold text-slate-800 mt-1">{new Date(previewInvoice.billingDate).toLocaleDateString()}</p>
                  </div>
                </div>

                <div className="mb-4 h-px bg-slate-100" />

                <div className="mb-4">
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[2px] mb-1">Billed To</p>
                  <p className="text-md font-bold text-slate-800 truncate">{previewInvoice.customerName || "Customer Name"}</p>
                </div>

                <div className="mb-4 overflow-hidden rounded-xl border border-slate-100">
                  <div className="bg-slate-50 px-3 py-2 grid grid-cols-12 gap-1">
                    <span className="col-span-6 text-[9px] font-bold text-slate-400 uppercase">Product</span>
                    <span className="col-span-2 text-center text-[9px] font-bold text-slate-400 uppercase">Qty</span>
                    <span className="col-span-4 text-right text-[9px] font-bold text-slate-400 uppercase">Amount</span>
                  </div>
                  <div className="px-3 py-3 grid grid-cols-12 gap-1 items-center">
                    <p className="col-span-6 text-xs font-bold text-slate-700 truncate">{previewInvoice.productName || "Product Name"}</p>
                    <p className="col-span-2 text-center text-xs font-medium text-slate-500">{Number(previewInvoice.quantity) || 0}</p>
                    <p className="col-span-4 text-right text-xs font-bold text-indigo-600">Rs. {(Number(previewInvoice.price) || 0).toLocaleString()}</p>
                  </div>
                </div>

                <div className="flex justify-between items-center bg-indigo-50 rounded-xl p-4 border border-indigo-100">
                  <div>
                    <p className="text-[9px] font-black text-indigo-400 uppercase tracking-widest leading-none">Total Amount</p>
                  </div>
                  <p className="text-2xl font-black text-indigo-900 leading-none">
                    Rs. {previewInvoice.total.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </p>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => downloadInvoicePdf(savedInvoice || previewInvoice)}
              disabled={!previewInvoice.customerName || !previewInvoice.productName || !formData.price}
              className="group flex w-full items-center justify-center gap-2 rounded-xl bg-white p-4 font-bold text-slate-900 shadow-lg transition-all hover:bg-slate-900 hover:text-white disabled:cursor-not-allowed disabled:opacity-50 shrink-0"
            >
              <svg className="h-5 w-5 transition-transform group-hover:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span>Download PDF</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateInvoicePage;
