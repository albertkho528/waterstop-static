export type Brand = "Mapei" | "Bondall";
export type Shape = "pail" | "roll" | "bottle";

export interface Product {
  brand: Brand;
  shape: Shape; // bentuk kemasan pada model 3D (ilustrasi)
  name: string;
  type: string;
  desc: string;
  specs: [string, string][];
}

export const BRANDS: Brand[] = ["Mapei", "Bondall"];

export const BADGE: Record<Brand, [string, string]> = {
  Mapei: ["#0b5fb4", "#ffffff"],
  Bondall: ["#e7e9e6", "#0b0c0d"],
};
export const DOT: Record<Brand, string> = { Mapei: "#4a9fec", Bondall: "#e7e9e6" };

export const PRODUCTS: Product[] = [
  {
    brand: "Mapei", shape: "pail", name: "Mapelastic", type: "Membran semen fleksibel 2 komponen",
    desc: "Lapisan kedap yang ikut bergerak bersama beton. Standar untuk kamar mandi, balkon, teras dan kolam renang sebelum keramik.",
    specs: [["Komponen", "2 (bubuk + cair)"], ["Area", "Kamar mandi, balkon, kolam"], ["Aplikasi", "Trowel / kuas"]],
  },
  {
    brand: "Mapei", shape: "pail", name: "Mapelastic Smart", type: "Membran semen sangat fleksibel",
    desc: "Lebih encer dan lebih elastis, nyaman untuk kuas atau roller pada bentuk rumit dan banyak detail.",
    specs: [["Komponen", "2"], ["Area", "Dak, area detail"], ["Aplikasi", "Kuas / roller"]],
  },
  {
    brand: "Mapei", shape: "pail", name: "Mapelastic Foundation", type: "Membran untuk beton bawah tanah",
    desc: "Untuk struktur bawah tanah yang menahan air dari luar maupun dalam.",
    specs: [["Komponen", "2"], ["Area", "Tandon, pondasi"], ["Tekanan", "Positif & negatif"]],
  },
  {
    brand: "Mapei", shape: "pail", name: "Planiseal 88", type: "Lapisan semen osmotik",
    desc: "Masuk ke pori beton dan menahan rembesan dari sisi dalam. Pilihan untuk basement yang tidak bisa digali dari luar.",
    specs: [["Komponen", "1"], ["Area", "Basement, dinding"], ["Tekanan", "Negatif"]],
  },
  {
    brand: "Mapei", shape: "pail", name: "Aquaflex Roof", type: "Membran cair siap pakai",
    desc: "Langsung dipakai tanpa dicampur. Untuk dak dan atap yang terkena matahari langsung.",
    specs: [["Komponen", "1, siap pakai"], ["Area", "Dak, atap"], ["Aplikasi", "Kuas / roller"]],
  },
  {
    brand: "Mapei", shape: "roll", name: "Mapeband", type: "Pita karet sambungan",
    desc: "Ditanam di dalam membran pada sudut, sambungan dan sekitar pipa, titik yang paling sering bocor.",
    specs: [["Fungsi", "Detail sudut"], ["Area", "Semua sistem"], ["Dipakai", "Bersama membran"]],
  },
  {
    brand: "Bondall", shape: "bottle", name: "Silasec", type: "Konsentrat waterproofer campuran semen",
    desc: "Dicampur dengan semen untuk membentuk lapisan kedap permanen pada beton dan pasangan bata. Tahan tekanan air dari dua sisi dan bisa dipakai di permukaan basah.",
    specs: [["Pemakaian", "Dicampur semen"], ["Area", "Kolam ikan, tandon, septic, dinding penahan"], ["Tekanan", "Dua arah"]],
  },
  {
    brand: "Bondall", shape: "bottle", name: "Bondcrete", type: "Bonding agent & aditif semen",
    desc: "Meningkatkan daya rekat plester dan mortar tambalan ke permukaan lama. Dipakai saat persiapan sebelum lapisan kedap.",
    specs: [["Pemakaian", "Campuran / primer"], ["Area", "Tambalan, plester"], ["Tahap", "Persiapan"]],
  },
];
