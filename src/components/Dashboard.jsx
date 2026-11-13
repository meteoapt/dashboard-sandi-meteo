import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { useTheme } from "../context/ThemeContext";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import {
  LayoutDashboard,
  Calendar,
  AlertCircle,
  CloudSunRain,
  ThermometerSun,
  Loader2,
  Filter,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const formatTanggal = (tgl) =>
  new Date(tgl).toLocaleDateString("id-ID", { day: "numeric", month: "short" });

const getInitials = (name) => {
  if (!name) return "";
  const words = name.trim().split(" ");
  if (words.length === 1) return words[0].substring(0, 2).toUpperCase();
  return (words[0][0] + words[1][0]).toUpperCase();
};

const MiniTable = ({ title, icon: Icon, colorClass, data }) => {
  const [itemsPerPage, setItemsPerPage] = useState(5); // Default ke 5
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setCurrentPage(1);
  }, [data, itemsPerPage]);

  const totalPages = Math.ceil(data.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = data.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none border border-slate-100 dark:border-slate-800 flex flex-col h-[440px] overflow-hidden transition-colors">
      <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/40 shrink-0">
        <div className="flex items-center gap-2">
          <Icon className={`w-5 h-5 ${colorClass}`} />
          <h3 className="font-bold text-slate-800 dark:text-slate-100 tracking-wide">
            {title}
          </h3>
        </div>
        <span className="text-xs font-bold px-2.5 py-1 bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-full">
          {data.length} Kesalahan Sandi
        </span>
      </div>

      <div className="flex-1 overflow-y-auto">
        {data.length === 0 ? (
          <div className="h-full flex items-center justify-center text-slate-400 dark:text-slate-500 text-sm p-4">
            Nihil kesalahan. Josjis!
          </div>
        ) : (
          <table className="w-full text-left border-collapse text-sm">
            <thead className="bg-white dark:bg-slate-900 sticky top-0 shadow-sm z-10">
              <tr className="text-slate-500 dark:text-slate-400 font-semibold border-b border-slate-100 dark:border-slate-800">
                <th className="px-4 py-3 w-16">Tgl</th>
                <th className="px-4 py-3 w-28">Pegawai</th>
                <th className="px-4 py-3">Kesalahan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-slate-800/80">
              {paginatedData.map((d) => (
                <tr
                  key={d.id}
                  className="hover:bg-[#F8FCFB] dark:hover:bg-slate-800/50 transition-colors"
                >
                  <td className="px-4 py-3 whitespace-nowrap text-slate-500 dark:text-slate-400 align-top">
                    {formatTanggal(d.tanggal)}
                  </td>
                  <td className="px-4 py-3 font-medium text-slate-700 dark:text-slate-200 align-top">
                    {d.nama_pegawai}
                  </td>
                  <td className="px-4 py-3 align-top">
                    <div className="flex flex-col gap-1 text-[13px]">
                      <span className="font-mono bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 px-1.5 py-0.5 rounded line-through decoration-rose-300 dark:decoration-rose-500/50 break-all">
                        {d.sandi_salah}
                      </span>
                      <span className="font-mono bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 px-1.5 py-0.5 rounded font-medium break-all">
                        {d.sandi_seharusnya}
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {data.length > 0 && (
        <div className="p-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/40 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-1.5">
            <select
              value={itemsPerPage}
              onChange={(e) => setItemsPerPage(Number(e.target.value))}
              className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 rounded p-1 focus:outline-none cursor-pointer shadow-sm"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={15}>15</option>
            </select>
            <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              / hal
            </span>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="p-1 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-40 transition shadow-sm cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs font-semibold text-slate-600 dark:text-slate-300 w-14 text-center">
              {currentPage} / {totalPages || 1}
            </span>
            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages || totalPages === 0}
              className="p-1 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-40 transition shadow-sm cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default function Dashboard() {
  const [kesalahan, setKesalahan] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isDark } = useTheme();

  const currentMonth = String(new Date().getMonth() + 1).padStart(2, "0");
  const currentYear = new Date().getFullYear().toString();

  const [filterBulan, setFilterBulan] = useState(currentMonth);
  const [filterTahun, setFilterTahun] = useState(currentYear);

  const fetchData = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("kesalahan_sandi")
      .select("*")
      .order("tanggal", { ascending: false });

    if (!error && data) setKesalahan(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const availableYears = [
    ...new Set(kesalahan.map((k) => new Date(k.tanggal).getFullYear())),
  ];
  if (!availableYears.includes(Number(currentYear)))
    availableYears.push(Number(currentYear));
  availableYears.sort((a, b) => b - a);

  const daftarBulan = [
    { val: "", label: "Sepanjang Tahun" },
    { val: "01", label: "Januari" },
    { val: "02", label: "Februari" },
    { val: "03", label: "Maret" },
    { val: "04", label: "April" },
    { val: "05", label: "Mei" },
    { val: "06", label: "Juni" },
    { val: "07", label: "Juli" },
    { val: "08", label: "Agustus" },
    { val: "09", label: "September" },
    { val: "10", label: "Oktober" },
    { val: "11", label: "November" },
    { val: "12", label: "Desember" },
  ];

  const filteredData = kesalahan.filter((k) => {
    const d = new Date(k.tanggal);
    const matchBulan =
      filterBulan === ""
        ? true
        : String(d.getMonth() + 1).padStart(2, "0") === filterBulan;
    const matchTahun =
      filterTahun === "" ? true : String(d.getFullYear()) === filterTahun;
    return matchBulan && matchTahun;
  });

  const dataMetar = filteredData.filter((d) => d.jenis_sandi === "METAR/SPECI");
  const dataTaf = filteredData.filter((d) => d.jenis_sandi === "TAF");
  const dataSynoptik = filteredData.filter((d) => d.jenis_sandi === "SYNOPTIK");

  const pieData = [
    { name: "METAR/SPECI", value: dataMetar.length, color: "#A855F7" },
    { name: "TAF", value: dataTaf.length, color: "#3B82F6" },
    { name: "SYNOPTIK", value: dataSynoptik.length, color: "#F97316" },
  ].filter((d) => d.value > 0);

  const pegawaiMap = {};
  filteredData.forEach((d) => {
    pegawaiMap[d.nama_pegawai] = (pegawaiMap[d.nama_pegawai] || 0) + 1;
  });
  const barData = Object.keys(pegawaiMap)
    .map((key) => ({
      nama: key,
      inisial: getInitials(key),
      jumlah: pegawaiMap[key],
    }))
    .sort((a, b) => b.jumlah - a.jumlah)
    .slice(0, 7);

  // Styling dinamis untuk Tooltip Recharts
  const tooltipStyle = {
    borderRadius: "12px",
    border: isDark ? "1px solid #334155" : "none",
    backgroundColor: isDark ? "#1E293B" : "#FFFFFF",
    color: isDark ? "#F8FAFC" : "#1E293B",
    boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.25)",
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] text-slate-400">
        <Loader2 className="w-10 h-10 animate-spin text-[#38B2A6] mb-4" />
        <p className="font-medium">Menyusun Laporan Dashboard...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* HEADER & FILTER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-5 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none border border-slate-100 dark:border-slate-800 transition-colors">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <LayoutDashboard className="w-6 h-6 text-[#38B2A6]" />
            Dashboard Statistik
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
            Laporan monitoring mutu sandi TAF, METAR/SPECI, dan SYNOPTIK.
          </p>
        </div>

        <div className="flex items-center gap-3 bg-[#EEF8F7] dark:bg-slate-800 p-2 rounded-xl border border-[#BCE6E1]/50 dark:border-slate-700">
          <Calendar className="w-5 h-5 text-[#1A7A8C] dark:text-[#52C7B4] ml-2" />
          <select
            value={filterBulan}
            onChange={(e) => setFilterBulan(e.target.value)}
            className="bg-transparent text-sm font-semibold text-[#1A7A8C] dark:text-slate-200 focus:outline-none cursor-pointer"
          >
            {daftarBulan.map((b) => (
              <option key={b.val} value={b.val} className="dark:bg-slate-800">
                {b.label}
              </option>
            ))}
          </select>
          <span className="text-[#9FD9D2] dark:text-slate-600">/</span>
          <select
            value={filterTahun}
            onChange={(e) => setFilterTahun(e.target.value)}
            className="bg-transparent text-sm font-semibold text-[#1A7A8C] dark:text-slate-200 focus:outline-none cursor-pointer pr-2"
          >
            <option value="" className="dark:bg-slate-800">
              Semua
            </option>
            {availableYears.map((t) => (
              <option key={t} value={t} className="dark:bg-slate-800">
                {t}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none border border-slate-100 dark:border-slate-800 flex items-center gap-4 relative overflow-hidden transition-colors">
          <div className="w-14 h-14 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 shrink-0 relative z-10">
            <AlertCircle className="w-7 h-7" />
          </div>
          <div className="relative z-10">
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
              Total Kesalahan Sandi
            </p>
            <h3 className="text-3xl font-bold text-slate-800 dark:text-slate-100">
              {filteredData.length}
            </h3>
          </div>
          <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-slate-50 dark:bg-slate-800/40 rounded-full z-0" />
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none border border-slate-100 dark:border-slate-800 flex items-center gap-4 relative overflow-hidden transition-colors">
          <div className="w-14 h-14 rounded-full bg-purple-100 dark:bg-purple-950/60 flex items-center justify-center text-purple-600 dark:text-purple-400 shrink-0 relative z-10">
            <CloudSunRain className="w-7 h-7" />
          </div>
          <div className="relative z-10">
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
              METAR/SPECI
            </p>
            <h3 className="text-3xl font-bold text-slate-800 dark:text-slate-100">
              {dataMetar.length}
            </h3>
          </div>
          <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-purple-50 dark:bg-purple-950/20 rounded-full z-0" />
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none border border-slate-100 dark:border-slate-800 flex items-center gap-4 relative overflow-hidden transition-colors">
          <div className="w-14 h-14 rounded-full bg-blue-100 dark:bg-blue-950/60 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0 relative z-10">
            <CloudSunRain className="w-7 h-7" />
          </div>
          <div className="relative z-10">
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
              TAF
            </p>
            <h3 className="text-3xl font-bold text-slate-800 dark:text-slate-100">
              {dataTaf.length}
            </h3>
          </div>
          <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-blue-50 dark:bg-blue-950/20 rounded-full z-0" />
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none border border-slate-100 dark:border-slate-800 flex items-center gap-4 relative overflow-hidden transition-colors">
          <div className="w-14 h-14 rounded-full bg-orange-100 dark:bg-orange-950/60 flex items-center justify-center text-orange-600 dark:text-orange-400 shrink-0 relative z-10">
            <ThermometerSun className="w-7 h-7" />
          </div>
          <div className="relative z-10">
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
              SYNOPTIK
            </p>
            <h3 className="text-3xl font-bold text-slate-800 dark:text-slate-100">
              {dataSynoptik.length}
            </h3>
          </div>
          <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-orange-50 dark:bg-orange-950/20 rounded-full z-0" />
        </div>
      </div>

      {/* AREA GRAFIK */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none border border-slate-100 dark:border-slate-800 lg:col-span-2 transition-colors">
          <h3 className="font-bold text-slate-800 dark:text-slate-100 mb-6 flex items-center gap-2">
            <Filter className="w-5 h-5 text-[#38B2A6]" />
            Grafik Kesalahan Sandi
          </h3>
          <div className="h-72 w-full">
            {barData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={barData}
                  margin={{ top: 10, right: 10, left: -20, bottom: 20 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke={isDark ? "#334155" : "#E2E8F0"}
                  />
                  <XAxis
                    dataKey="inisial"
                    tick={{
                      fontSize: 13,
                      fill: isDark ? "#94A3B8" : "#64748B",
                      fontWeight: 600,
                    }}
                    axisLine={false}
                    tickLine={false}
                    interval={0}
                  />
                  <YAxis
                    allowDecimals={false}
                    tick={{
                      fontSize: 12,
                      fill: isDark ? "#94A3B8" : "#64748B",
                    }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    cursor={{ fill: isDark ? "#1E293B" : "#F1F9F8" }}
                    contentStyle={tooltipStyle}
                    itemStyle={{ color: "#38B2A6", fontWeight: 600 }}
                    labelFormatter={(label, payload) => {
                      if (payload && payload.length > 0)
                        return payload[0].payload.nama;
                      return label;
                    }}
                  />
                  <Bar
                    dataKey="jumlah"
                    name="Jumlah Kesalahan"
                    fill="#38B2A6"
                    radius={[6, 6, 0, 0]}
                    barSize={40}
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-400 dark:text-slate-500">
                Tidak ada data untuk grafik ini.
              </div>
            )}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none border border-slate-100 dark:border-slate-800 flex flex-col transition-colors">
          <h3 className="font-bold text-slate-800 dark:text-slate-100 mb-2 text-center">
            Distribusi Kategori
          </h3>
          <div className="flex-1 min-h-[220px]">
            {pieData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={85}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={tooltipStyle}
                    itemStyle={{ color: isDark ? "#F8FAFC" : "#1E293B" }}
                  />
                  <Legend
                    verticalAlign="bottom"
                    height={36}
                    iconType="circle"
                    wrapperStyle={{
                      fontSize: "12px",
                      color: isDark ? "#CBD5E1" : "#475569",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-400 dark:text-slate-500">
                Belum ada distribusi sandi.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 3 TABEL DETAIL */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <MiniTable
          title="METAR / SPECI"
          icon={CloudSunRain}
          colorClass="text-purple-500"
          data={dataMetar}
        />
        <MiniTable
          title="TAF"
          icon={CloudSunRain}
          colorClass="text-blue-500"
          data={dataTaf}
        />
        <MiniTable
          title="SYNOPTIK"
          icon={ThermometerSun}
          colorClass="text-orange-500"
          data={dataSynoptik}
        />
      </div>

      <div className="h-10" />
    </div>
  );
}
