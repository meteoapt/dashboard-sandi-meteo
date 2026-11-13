import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import {
  Plus,
  Edit2,
  Trash2,
  Search,
  X,
  AlertTriangle,
  Users,
  Loader2,
} from "lucide-react";

export default function Pegawai() {
  const [pegawai, setPegawai] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // State untuk Modal Form
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    id: null,
    nip: "",
    nama: "",
    jabatan: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // State untuk Modal Konfirmasi Delete
  const [deleteId, setDeleteId] = useState(null);

  // Ambil data dari Supabase
  const fetchPegawai = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("pegawai")
      .select("*")
      .order("nama", { ascending: true });

    if (!error) setPegawai(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchPegawai();
  }, []);

  // Handler Form (Tambah / Edit)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (formData.id) {
      // Update data
      await supabase
        .from("pegawai")
        .update({
          nip: formData.nip,
          nama: formData.nama,
          jabatan: formData.jabatan,
        })
        .eq("id", formData.id);
    } else {
      // Insert data baru
      await supabase.from("pegawai").insert([
        {
          nip: formData.nip,
          nama: formData.nama,
          jabatan: formData.jabatan,
        },
      ]);
    }

    setIsSubmitting(false);
    setIsModalOpen(false);
    setFormData({ id: null, nip: "", nama: "", jabatan: "" });
    fetchPegawai(); // Refresh tabel
  };

  // Handler Buka Modal Edit
  const handleEdit = (p) => {
    setFormData({ id: p.id, nip: p.nip, nama: p.nama, jabatan: p.jabatan });
    setIsModalOpen(true);
  };

  // Handler Hapus Data
  const confirmDelete = async () => {
    if (!deleteId) return;
    await supabase.from("pegawai").delete().eq("id", deleteId);
    setDeleteId(null);
    fetchPegawai(); // Refresh tabel
  };

  // Filter pencarian
  const filteredPegawai = pegawai.filter(
    (p) =>
      p.nama.toLowerCase().includes(search.toLowerCase()) ||
      p.nip.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* HEADER & ACTION BAR */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <Users className="w-6 h-6 text-[#38B2A6] dark:text-[#52C7B4]" />
            Kelola Pegawai
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
            Data Forecaster/Observer
          </p>
        </div>

        <button
          onClick={() => {
            setFormData({ id: null, nip: "", nama: "", jabatan: "" });
            setIsModalOpen(true);
          }}
          className="flex items-center justify-center gap-2 bg-[#38B2A6] dark:bg-[#38B2A6] hover:bg-[#2F9E93] dark:hover:bg-[#4BB8A6] text-white px-5 py-2.5 rounded-xl font-medium shadow-lg shadow-[#38B2A6]/30 dark:shadow-[#38B2A6]/10 transition-all active:scale-95"
        >
          <Plus className="w-5 h-5" />
          <span>Tambah Pegawai</span>
        </button>
      </div>

      {/* CARD KONTEN UTAMA */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] border border-slate-100 dark:border-slate-800 overflow-hidden flex flex-col transition-colors">
        {/* Search Bar */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 transition-colors">
          <div className="relative max-w-md">
            <Search className="w-5 h-5 text-slate-400 dark:text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari berdasarkan nama atau NIP..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-700 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#38B2A6]/50 dark:focus:ring-[#52C7B4]/50 transition-all"
            />
          </div>
        </div>

        {/* Tabel Data */}
        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 text-slate-400 dark:text-slate-500">
              <Loader2 className="w-8 h-8 animate-spin text-[#38B2A6] dark:text-[#52C7B4] mb-4" />
              <p>Memuat data pegawai...</p>
            </div>
          ) : filteredPegawai.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-slate-400 dark:text-slate-500">
              <Users className="w-12 h-12 mb-4 text-slate-200 dark:text-slate-700" />
              <p>Belum ada data pegawai yang sesuai.</p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/40 text-slate-500 dark:text-slate-400 text-sm font-semibold uppercase tracking-wider border-b border-slate-200 dark:border-slate-700">
                  <th className="px-6 py-4">Nama Pegawai</th>
                  <th className="px-6 py-4">NIP</th>
                  <th className="px-6 py-4">Jabatan</th>
                  <th className="px-6 py-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                {filteredPegawai.map((p) => (
                  <tr
                    key={p.id}
                    className="hover:bg-[#F8FCFB] dark:hover:bg-slate-800/30 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-semibold text-slate-800 dark:text-slate-100">
                        {p.nama}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-slate-600 dark:text-slate-400 font-medium">
                      {p.nip}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-[#E8F6F4] dark:bg-teal-950/40 text-[#1A7A8C] dark:text-[#52C7B4] border border-[#BCE6E1]/50 dark:border-teal-900/50">
                        {p.jabatan}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleEdit(p)}
                          className="p-2 text-sky-600 dark:text-sky-400 hover:bg-sky-50 dark:hover:bg-sky-900/30 rounded-lg transition-colors cursor-pointer"
                          title="Edit Pegawai"
                        >
                          <Edit2 className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => setDeleteId(p.id)}
                          className="p-2 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/30 rounded-lg transition-colors cursor-pointer"
                          title="Hapus Pegawai"
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
      </div>

      {/* ================= MODAL TAMBAH/EDIT ================= */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-slate-900/40 dark:bg-slate-900/80 backdrop-blur-sm"
            onClick={() => setIsModalOpen(false)}
          />

          <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200 border border-transparent dark:border-slate-700">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">
                {formData.id ? "Edit Data Pegawai" : "Tambah Pegawai Baru"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-slate-400 dark:text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                  NIP
                </label>
                <input
                  type="text"
                  required
                  value={formData.nip}
                  onChange={(e) =>
                    setFormData({ ...formData, nip: e.target.value })
                  }
                  placeholder="Input NIP pegawai..."
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#38B2A6]/50 dark:focus:ring-[#52C7B4]/50 transition"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                  Nama Lengkap
                </label>
                <input
                  type="text"
                  required
                  value={formData.nama}
                  onChange={(e) =>
                    setFormData({ ...formData, nama: e.target.value })
                  }
                  placeholder="Input nama pegawai..."
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#38B2A6]/50 dark:focus:ring-[#52C7B4]/50 transition"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                  Jabatan
                </label>
                <input
                  type="text"
                  required
                  value={formData.jabatan}
                  onChange={(e) =>
                    setFormData({ ...formData, jabatan: e.target.value })
                  }
                  placeholder="Misal: PMG Pertama"
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#38B2A6]/50 dark:focus:ring-[#52C7B4]/50 transition"
                />
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
                  disabled={isSubmitting}
                  className="px-5 py-2.5 text-sm font-medium text-white bg-[#38B2A6] hover:bg-[#2F9E93] dark:bg-[#38B2A6] dark:hover:bg-[#4BB8A6] disabled:opacity-70 rounded-xl flex items-center justify-center min-w-[100px] transition cursor-pointer shadow-md shadow-[#38B2A6]/20 dark:shadow-[#38B2A6]/10"
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
              Hapus Pegawai?
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
              Apakah Anda yakin? Data pegawai ini akan dihapus secara permanen
              dari sistem, namun riwayat kesalahan sandinya tetap aman.
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
