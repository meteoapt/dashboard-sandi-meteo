import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import {
  Plus,
  Edit2,
  Trash2,
  Search,
  X,
  AlertTriangle,
  FileSignature,
  Loader2,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Filter,
} from "lucide-react";

export default function InputKesalahan() {
  const [kesalahan, setKesalahan] = useState([]);
  const [listPegawai, setListPegawai] = useState([]);
  const [loading, setLoading] = useState(true);

  // State untuk Filter & Pencarian
  const [search, setSearch] = useState("");
  const [filterJenis, setFilterJenis] = useState("");
  const [filterBulan, setFilterBulan] = useState("");
  const [filterTahun, setFilterTahun] = useState("");

  // State untuk Pagination
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  // Ambil tanggal hari ini (Format YYYY-MM-DD)
  const today = new Date().toISOString().split("T")[0];

  // State Modal Form
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    id: null,
    tanggal: today,
    pegawai_id: "",
    jenis_sandi: "METAR/SPECI",
    sandi_salah: "",
    sandi_seharusnya: "",
    keterangan: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // State Modal Delete
  const [deleteId, setDeleteId] = useState(null);

  // Fetch Data
  const fetchData = async () => {
    setLoading(true);
    const { data: pegawaiData } = await supabase
      .from("pegawai")
      .select("id, nama")
      .order("nama", { ascending: true });
    if (pegawaiData) setListPegawai(pegawaiData);

    const { data: kesalahanData } = await supabase
      .from("kesalahan_sandi")
      .select("*")
      .order("tanggal", { ascending: false })
      .order("created_at", { ascending: false });
    if (kesalahanData) setKesalahan(kesalahanData);

    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Reset ke halaman 1 setiap kali filter, search, atau itemsPerPage diubah
  useEffect(() => {
    setCurrentPage(1);
  }, [search, filterJenis, filterBulan, filterTahun, itemsPerPage]);

  // Handler Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const selectedPegawai = listPegawai.find(
      (p) => p.id === formData.pegawai_id,
    );
    const namaPegawai = selectedPegawai
      ? selectedPegawai.nama
      : formData.nama_pegawai;

    const payload = {
      tanggal: formData.tanggal,
      pegawai_id: formData.pegawai_id || null,
      nama_pegawai: namaPegawai,
      jenis_sandi: formData.jenis_sandi,
      sandi_salah: formData.sandi_salah,
      sandi_seharusnya: formData.sandi_seharusnya,
      keterangan: formData.keterangan?.trim() || null,
    };

    if (formData.id) {
      await supabase
        .from("kesalahan_sandi")
        .update(payload)
        .eq("id", formData.id);
    } else {
      await supabase.from("kesalahan_sandi").insert([payload]);
    }

    setIsSubmitting(false);
    setIsModalOpen(false);
    resetForm();
    fetchData();
  };

  const resetForm = () => {
    setFormData({
      id: null,
      tanggal: today,
      pegawai_id: listPegawai.length > 0 ? listPegawai[0].id : "",
      jenis_sandi: "METAR/SPECI",
      sandi_salah: "",
      sandi_seharusnya: "",
      keterangan: "",
    });
  };

  const handleEdit = (k) => {
    setFormData({
      id: k.id,
      tanggal: k.tanggal,
      pegawai_id: k.pegawai_id || "",
      nama_pegawai: k.nama_pegawai,
      jenis_sandi: k.jenis_sandi,
      sandi_salah: k.sandi_salah,
      sandi_seharusnya: k.sandi_seharusnya,
      keterangan: k.keterangan || "",
    });
    setIsModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    await supabase.from("kesalahan_sandi").delete().eq("id", deleteId);
    setDeleteId(null);
    fetchData();
  };

  // Generate opsi Tahun dinamis
  const availableYears = [
    ...new Set(kesalahan.map((k) => new Date(k.tanggal).getFullYear())),
  ];
  if (!availableYears.includes(new Date().getFullYear()))
    availableYears.push(new Date().getFullYear());
  availableYears.sort((a, b) => b - a);

  const daftarBulan = [
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

  // === LOGIKA FILTER ===
  const filteredData = kesalahan.filter((k) => {
    const matchSearch =
      k.nama_pegawai.toLowerCase().includes(search.toLowerCase()) ||
      k.jenis_sandi.toLowerCase().includes(search.toLowerCase()) ||
      k.sandi_salah.toLowerCase().includes(search.toLowerCase()) ||
      (k.keterangan &&
        k.keterangan.toLowerCase().includes(search.toLowerCase()));

    const matchJenis = filterJenis ? k.jenis_sandi === filterJenis : true;

    const d = new Date(k.tanggal);
    const monthStr = String(d.getMonth() + 1).padStart(2, "0");
    const yearStr = String(d.getFullYear());

    const matchBulan = filterBulan ? monthStr === filterBulan : true;
    const matchTahun = filterTahun ? yearStr === filterTahun : true;

    return matchSearch && matchJenis && matchBulan && matchTahun;
  });

  // === LOGIKA PAGINATION ===
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  const getBadgeColor = (jenis) => {
    if (jenis === "TAF")
      return "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800/50";
    if (jenis === "SYNOPTIK")
      return "bg-orange-50 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 border-orange-200 dark:border-orange-800/50";
    return "bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-800/50";
  };

  const formatTanggal = (tgl) => {
    return new Date(tgl).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* HEADER & ACTION BAR */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <FileSignature className="w-6 h-6 text-[#38B2A6] dark:text-[#52C7B4]" />
            Input Kesalahan Sandi
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
            Catat kesalahan penyandian cuaca
          </p>
        </div>

        <button
          onClick={() => {
            resetForm();
            setIsModalOpen(true);
          }}
          className="flex items-center justify-center gap-2 bg-[#38B2A6] hover:bg-[#2F9E93] dark:bg-[#38B2A6] dark:hover:bg-[#4BB8A6] text-white px-5 py-2.5 rounded-xl font-medium shadow-lg shadow-[#38B2A6]/30 dark:shadow-[#38B2A6]/10 transition-all active:scale-95"
        >
          <Plus className="w-5 h-5" />
          <span>Input Kesalahan</span>
        </button>
      </div>

      {/* CARD KONTEN UTAMA */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] border border-slate-100 dark:border-slate-800 overflow-hidden flex flex-col transition-colors">
        {/* Filter & Search Bar */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 flex flex-col lg:flex-row gap-4 justify-between transition-colors">
          <div className="relative w-full lg:max-w-md">
            <Search className="w-5 h-5 text-slate-400 dark:text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari nama pegawai, jenis, isi sandi, atau keterangan..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-700 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#38B2A6]/50 dark:focus:ring-[#52C7B4]/50 transition-all"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-1.5 shadow-sm transition-colors">
              <Filter className="w-4 h-4 text-slate-400 dark:text-slate-500" />
              {/* Filter Jenis Sandi (Sebelah Kiri Semua Bulan) */}
              <select
                value={filterJenis}
                onChange={(e) => setFilterJenis(e.target.value)}
                className="bg-transparent text-sm text-slate-700 dark:text-slate-200 focus:outline-none cursor-pointer"
              >
                <option value="" className="dark:bg-slate-900">
                  Semua Sandi
                </option>
                <option value="METAR/SPECI" className="dark:bg-slate-900">
                  METAR / SPECI
                </option>
                <option value="TAF" className="dark:bg-slate-900">
                  TAF
                </option>
                <option value="SYNOPTIK" className="dark:bg-slate-900">
                  SYNOPTIK
                </option>
              </select>
              <div className="w-px h-4 bg-slate-200 dark:bg-slate-700 mx-1" />
              <select
                value={filterBulan}
                onChange={(e) => setFilterBulan(e.target.value)}
                className="bg-transparent text-sm text-slate-700 dark:text-slate-200 focus:outline-none cursor-pointer"
              >
                <option value="" className="dark:bg-slate-900">
                  Semua Bulan
                </option>
                {daftarBulan.map((b) => (
                  <option
                    key={b.val}
                    value={b.val}
                    className="dark:bg-slate-900"
                  >
                    {b.label}
                  </option>
                ))}
              </select>
              <div className="w-px h-4 bg-slate-200 dark:bg-slate-700 mx-1" />
              <select
                value={filterTahun}
                onChange={(e) => setFilterTahun(e.target.value)}
                className="bg-transparent text-sm text-slate-700 dark:text-slate-200 focus:outline-none cursor-pointer"
              >
                <option value="" className="dark:bg-slate-900">
                  Semua Tahun
                </option>
                {availableYears.map((t) => (
                  <option
                    key={t}
                    value={String(t)}
                    className="dark:bg-slate-900"
                  >
                    {t}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-1.5 shadow-sm transition-colors">
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                Tampil:
              </span>
              <select
                value={itemsPerPage}
                onChange={(e) => setItemsPerPage(Number(e.target.value))}
                className="bg-transparent text-sm font-semibold text-slate-700 dark:text-slate-200 focus:outline-none cursor-pointer"
              >
                <option value={10} className="dark:bg-slate-900">
                  10
                </option>
                <option value={25} className="dark:bg-slate-900">
                  25
                </option>
                <option value={50} className="dark:bg-slate-900">
                  50
                </option>
                <option value={100} className="dark:bg-slate-900">
                  100
                </option>
              </select>
            </div>
          </div>
        </div>

        {/* Tabel Data */}
        <div className="overflow-x-auto min-h-[400px]">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 text-slate-400 dark:text-slate-500">
              <Loader2 className="w-8 h-8 animate-spin text-[#38B2A6] dark:text-[#52C7B4] mb-4" />
              <p>Memuat riwayat sandi...</p>
            </div>
          ) : filteredData.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-slate-400 dark:text-slate-500">
              <FileSignature className="w-12 h-12 mb-4 text-slate-200 dark:text-slate-700" />
              <p>Belum ada riwayat kesalahan yang tercatat / ditemukan.</p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/40 text-slate-500 dark:text-slate-400 text-sm font-semibold uppercase tracking-wider border-b border-slate-200 dark:border-slate-700">
                  <th className="px-5 py-4 w-32">Tanggal</th>
                  <th className="px-5 py-4 w-48">Pegawai</th>
                  <th className="px-5 py-4">Detail Kesalahan</th>
                  <th className="px-5 py-4 w-64">Keterangan</th>
                  <th className="px-5 py-4 text-right w-28">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                {paginatedData.map((k) => (
                  <tr
                    key={k.id}
                    className="hover:bg-[#F8FCFB] dark:hover:bg-slate-800/30 transition-colors"
                  >
                    <td className="px-5 py-4 whitespace-nowrap text-sm text-slate-600 dark:text-slate-300 font-medium align-top">
                      {formatTanggal(k.tanggal)}
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap align-top">
                      <div className="font-semibold text-slate-800 dark:text-slate-100">
                        {k.nama_pegawai}
                      </div>
                      <span
                        className={`inline-flex items-center px-2 py-0.5 mt-1 rounded text-[10px] font-bold border uppercase tracking-wider ${getBadgeColor(k.jenis_sandi)}`}
                      >
                        {k.jenis_sandi}
                      </span>
                    </td>
                    <td className="px-5 py-4 align-top">
                      <div className="flex flex-col gap-2 min-w-[260px]">
                        <div className="flex items-start gap-2">
                          <span className="shrink-0 w-16 text-xs font-semibold text-slate-400 dark:text-slate-500 mt-1">
                            Salah:
                          </span>
                          <span className="font-mono text-sm px-2 py-1 bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-100 dark:border-rose-900/50 rounded line-through decoration-rose-400/50 dark:decoration-rose-600/50 break-all">
                            {k.sandi_salah}
                          </span>
                        </div>
                        <div className="flex items-start gap-2">
                          <span className="shrink-0 w-16 text-xs font-semibold text-slate-400 dark:text-slate-500 mt-1">
                            Benar:
                          </span>
                          <span className="font-mono text-sm px-2 py-1 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/50 rounded font-medium break-all">
                            {k.sandi_seharusnya}
                          </span>
                        </div>
                      </div>
                    </td>
                    {/* Kolom Keterangan (Sebelah Kanan Detail Kesalahan) */}
                    <td className="px-5 py-4 align-top text-sm text-slate-600 dark:text-slate-300 max-w-xs">
                      {k.keterangan ? (
                        <p className="whitespace-pre-line break-words leading-relaxed">
                          {k.keterangan}
                        </p>
                      ) : (
                        <span className="text-slate-400 dark:text-slate-600 italic text-xs">
                          -
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap text-right align-top">
                      <div className="flex justify-end gap-2 mt-1">
                        <button
                          onClick={() => handleEdit(k)}
                          className="p-2 text-sky-600 dark:text-sky-400 hover:bg-sky-50 dark:hover:bg-sky-900/30 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit2 className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => setDeleteId(k.id)}
                          className="p-2 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/30 rounded-lg transition-colors"
                          title="Hapus"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* PAGINATION FOOTER */}
        {filteredData.length > 0 && (
          <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/30 flex flex-col sm:flex-row items-center justify-between gap-4 transition-colors">
            <span className="text-sm text-slate-500 dark:text-slate-400">
              Menampilkan{" "}
              <span className="font-semibold text-slate-700 dark:text-slate-200">
                {startIndex + 1}
              </span>{" "}
              -{" "}
              <span className="font-semibold text-slate-700 dark:text-slate-200">
                {Math.min(startIndex + itemsPerPage, filteredData.length)}
              </span>{" "}
              dari{" "}
              <span className="font-semibold text-slate-700 dark:text-slate-200">
                {filteredData.length}
              </span>{" "}
              data
            </span>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <div className="px-4 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-700 dark:text-slate-200">
                Hal {currentPage} / {totalPages || 1}
              </div>

              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages || totalPages === 0}
                className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ================= MODAL TAMBAH/EDIT ================= */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-slate-900/40 dark:bg-slate-900/80 backdrop-blur-sm"
            onClick={() => setIsModalOpen(false)}
          />

          <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200 border border-transparent dark:border-slate-700">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">
                {formData.id ? "Edit Kesalahan" : "Input Kesalahan Baru"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-slate-400 dark:text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={handleSubmit}
              className="p-6 space-y-5 max-h-[85vh] overflow-y-auto"
            >
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                    Tanggal
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.tanggal}
                    onChange={(e) =>
                      setFormData({ ...formData, tanggal: e.target.value })
                    }
                    className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#38B2A6]/50 dark:focus:ring-[#52C7B4]/50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                    Jenis Sandi
                  </label>
                  <select
                    required
                    value={formData.jenis_sandi}
                    onChange={(e) =>
                      setFormData({ ...formData, jenis_sandi: e.target.value })
                    }
                    className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#38B2A6]/50 dark:focus:ring-[#52C7B4]/50"
                  >
                    <option value="METAR/SPECI">METAR / SPECI</option>
                    <option value="TAF">TAF</option>
                    <option value="SYNOPTIK">SYNOPTIK</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                  Nama Pegawai
                </label>
                {listPegawai.length === 0 ? (
                  <div className="text-sm text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30 p-3 rounded-lg border border-amber-200 dark:border-amber-900/50">
                    Belum ada data pegawai. Silakan tambah pegawai di menu "Data
                    Pegawai" terlebih dahulu.
                  </div>
                ) : (
                  <select
                    required
                    value={formData.pegawai_id}
                    onChange={(e) =>
                      setFormData({ ...formData, pegawai_id: e.target.value })
                    }
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#38B2A6]/50 dark:focus:ring-[#52C7B4]/50"
                  >
                    <option value="" disabled>
                      -- Pilih Pegawai --
                    </option>
                    {listPegawai.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.nama}
                      </option>
                    ))}
                    {formData.id && !formData.pegawai_id && (
                      <option value="" disabled>
                        {formData.nama_pegawai} (Pegawai telah dihapus)
                      </option>
                    )}
                  </select>
                )}
              </div>

              <div className="space-y-4 pt-2">
                <div className="relative">
                  <label className="block text-sm font-bold text-rose-600 dark:text-rose-400 mb-1.5">
                    Sandi yang Salah
                  </label>
                  <textarea
                    required
                    rows="2"
                    value={formData.sandi_salah}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        sandi_salah: e.target.value.toUpperCase(),
                      })
                    }
                    placeholder="Input Sandi yang salah di sini..."
                    className="w-full px-4 py-3 bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/50 rounded-xl text-sm text-slate-900 dark:text-rose-50 font-mono focus:outline-none focus:ring-2 focus:ring-rose-500/50 dark:focus:ring-rose-600/50 transition resize-none placeholder:font-sans placeholder:text-slate-400 dark:placeholder:text-slate-500"
                  />
                </div>
                <div className="flex justify-center -my-3 relative z-10">
                  <div className="bg-white dark:bg-slate-900 p-1 rounded-full border border-slate-200 dark:border-slate-700 shadow-sm">
                    <ArrowRight className="w-4 h-4 text-slate-400 dark:text-slate-500 rotate-90" />
                  </div>
                </div>
                <div className="relative">
                  <label className="block text-sm font-bold text-emerald-600 dark:text-emerald-400 mb-1.5">
                    Sandi Seharusnya (Benar)
                  </label>
                  <textarea
                    required
                    rows="2"
                    value={formData.sandi_seharusnya}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        sandi_seharusnya: e.target.value.toUpperCase(),
                      })
                    }
                    placeholder="Input Sandi yang benar di sini..."
                    className="w-full px-4 py-3 bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/50 rounded-xl text-sm text-slate-900 dark:text-emerald-50 font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500/50 dark:focus:ring-emerald-600/50 transition resize-none placeholder:font-sans placeholder:text-slate-400 dark:placeholder:text-slate-500"
                  />
                </div>

                {/* Input Keterangan (Di Bawah Sandi Seharusnya) */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                    Keterangan{" "}
                    <span className="text-xs font-normal text-slate-400">
                      (Opsional)
                    </span>
                  </label>
                  <textarea
                    rows="2"
                    value={formData.keterangan}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        keterangan: e.target.value,
                      })
                    }
                    placeholder="Tambahkan keterangan atau catatan kesalahan di sini..."
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#38B2A6]/50 dark:focus:ring-[#52C7B4]/50 transition resize-none placeholder:text-slate-400 dark:placeholder:text-slate-500"
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 text-sm font-medium text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={
                    isSubmitting || (listPegawai.length === 0 && !formData.id)
                  }
                  className="px-5 py-2.5 text-sm font-medium text-white bg-[#38B2A6] hover:bg-[#2F9E93] dark:bg-[#38B2A6] dark:hover:bg-[#4BB8A6] disabled:opacity-70 rounded-xl flex items-center justify-center min-w-[120px] transition cursor-pointer shadow-md shadow-[#38B2A6]/20 dark:shadow-[#38B2A6]/10"
                >
                  {isSubmitting ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    "Simpan Data"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL KONFIRMASI HAPUS ================= */}
      {deleteId && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-slate-900/40 dark:bg-slate-900/80 backdrop-blur-sm"
            onClick={() => setDeleteId(null)}
          />
          <div className="relative w-full max-w-sm bg-white dark:bg-slate-900 rounded-2xl shadow-2xl p-6 text-center animate-in zoom-in-95 duration-200 border border-transparent dark:border-slate-700">
            <div className="w-14 h-14 bg-rose-100 dark:bg-rose-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-7 h-7 text-rose-500 dark:text-rose-400" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2">
              Hapus Riwayat?
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
              Riwayat kesalahan ini akan dihapus secara permanen dan tidak akan
              masuk dalam hitungan statistik Dashboard.
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => setDeleteId(null)}
                className="flex-1 px-4 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition cursor-pointer"
              >
                Batal
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-rose-500 dark:bg-rose-600 hover:bg-rose-600 dark:hover:bg-rose-700 rounded-xl transition cursor-pointer shadow-md shadow-rose-500/20 dark:shadow-none"
              >
                Ya, Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
