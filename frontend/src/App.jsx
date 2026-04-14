import { NavLink, Route, Routes } from "react-router-dom";
import CreateInvoicePage from "./pages/CreateInvoicePage";
import InvoiceHistoryPage from "./pages/InvoiceHistoryPage";

const navClass = ({ isActive }) =>
  `inline-flex items-center rounded-xl px-5 py-2.5 text-sm font-bold transition-all ${
    isActive 
      ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200 ring-4 ring-indigo-50" 
      : "bg-transparent text-slate-500 hover:bg-slate-100 hover:text-slate-900"
  }`;

function App() {
  return (
    <div className="min-h-screen bg-slate-50 selection:bg-indigo-100 selection:text-indigo-700">
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 p-4 md:px-8">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 shadow-lg shadow-indigo-100">
                <span className="text-xl font-black text-white">S</span>
            </div>
            <h1 className="text-xl font-black tracking-tight text-slate-900 hidden sm:block">
              Sai <span className="text-indigo-600 underline decoration-indigo-200 decoration-4 underline-offset-4">Marketing</span>
            </h1>
          </div>
          <nav className="flex items-center gap-1">
            <NavLink to="/" className={navClass}>
              Create New
            </NavLink>
            <NavLink to="/history" className={navClass}>
              History
            </NavLink>
          </nav>
        </div>
      </header>

      <main>
        <Routes>
          <Route path="/" element={<CreateInvoicePage />} />
          <Route path="/history" element={<InvoiceHistoryPage />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
