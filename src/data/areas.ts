export type Pressure = "positif" | "negatif" | "detail";

export interface Area {
  id: "dak" | "km" | "kolam" | "tandon" | "basement" | "retak";
  name: string;
  title: string;
  pressure: Pressure[];
  why: string;
  sys: [string, string][]; // [nama produk persis seperti di products.ts, peran]
  steps: string[];
}

export const AREAS: Area[] = [
  {
    id: "dak", name: "Dak & atap", title: "Dak beton & atap", pressure: ["positif"],
    why: "Dak terkena panas dan hujan bergantian, jadi membran harus elastis dan tahan UV. Retak dan sudut ditangani dulu sebelum dilapis.",
    sys: [["Aquaflex Roof", "membran siap pakai"], ["Mapeband", "sudut & sambungan"], ["Mapelastic Smart", "alternatif, area detail"]],
    steps: ["Bersihkan dan buang lapisan lama yang lepas", "Tambal retak, bulatkan sudut", "Mapeband di sudut dan pipa", "Dua lapis membran bersilangan", "Uji genang"],
  },
  {
    id: "km", name: "Kamar mandi", title: "Kamar mandi & balkon", pressure: ["positif"],
    why: "Lapisan dipasang di bawah keramik, jadi harus benar sekali jalan. Titik paling sering gagal: sudut, floor drain dan pipa.",
    sys: [["Mapelastic", "membran 2 komponen"], ["Mapeband", "sudut & drain"]],
    steps: ["Bongkar sampai beton, cek kemiringan", "Primer dan detail sudut serta drain", "Membran naik ke dinding area shower", "Uji genang", "Pasang keramik"],
  },
  {
    id: "kolam", name: "Kolam", title: "Kolam renang & kolam ikan", pressure: ["positif", "negatif"],
    why: "Air menekan terus-menerus dari dalam, dan kadang dari tanah di luar. Untuk kolam ikan, Silasec dicampur ke semen sebagai lapisan kedap.",
    sys: [["Mapelastic", "kolam renang, di bawah keramik"], ["Silasec", "kolam ikan, campuran semen"]],
    steps: ["Kuras dan bersihkan dinding kolam", "Perbaiki retak dan sambungan", "Aplikasi sistem sesuai jenis kolam", "Isi bertahap dan cek rembesan"],
  },
  {
    id: "tandon", name: "Tandon & septic", title: "Tandon air & septic tank", pressure: ["positif", "negatif"],
    why: "Beton bawah tanah menahan air dari dua arah. Sistem harus kuat terhadap tekanan hidrostatik dan bisa dikerjakan di permukaan lembap.",
    sys: [["Silasec", "tekanan dua arah"], ["Mapelastic Foundation", "beton bawah tanah"]],
    steps: ["Kosongkan dan bersihkan", "Tutup kebocoran aktif dan retak", "Aplikasi lapisan kedap", "Isi kembali dan pantau"],
  },
  {
    id: "basement", name: "Basement", title: "Basement & dinding penahan", pressure: ["negatif"],
    why: "Sering kali sisi luar tidak bisa digali, jadi lapisan dipasang dari dalam melawan tekanan air dari tanah.",
    sys: [["Planiseal 88", "semen osmotik"], ["Silasec", "dinding penahan"], ["Mapelastic Foundation", "beton bawah tanah"]],
    steps: ["Kupas cat dan plester rapuh", "Bersihkan sampai pori beton terbuka", "Aplikasi lapisan kedap dari dalam", "Finishing setelah kering"],
  },
  {
    id: "retak", name: "Retak dinding", title: "Retak & sambungan", pressure: ["detail"],
    why: "Sebagian besar kebocoran mulai dari detail kecil. Retak dan sambungan diperbaiki dulu supaya membran tidak ikut sobek.",
    sys: [["Mapeband", "tape sambungan"], ["Bondcrete", "daya rekat mortar tambal"]],
    steps: ["Bobok dan bersihkan jalur retak", "Tambal dengan mortar + bonding agent", "Pasang tape di sambungan", "Lanjut ke lapisan membran"],
  },
];

export const BUILD_STEPS = [
  { title: "Survei", text: "Kami cari sumber air yang sebenarnya, cek retakan dan kondisi beton, lalu ukur area.", meta: "Hasil: rekomendasi sistem + penawaran tertulis", status: "rawan bocor" },
  { title: "Persiapan", text: "Lapisan lama yang lepas dikupas, permukaan dibersihkan, retak dibobok dan ditambal.", meta: "Bondcrete untuk daya rekat mortar tambalan", status: "rawan bocor" },
  { title: "Primer", text: "Primer mengikat membran ke beton dan menutup pori permukaan.", meta: "Permukaan harus bersih dan bebas debu", status: "dilindungi sebagian" },
  { title: "Detail sudut", text: "Sudut, sambungan dan tembusan pipa diberi tape atau mesh. Di titik inilah kebocoran paling sering terjadi.", meta: "Mapeband di sudut dan floor drain", status: "dilindungi sebagian" },
  { title: "Membran", text: "Dua lapis bersilangan sampai ketebalan sesuai lembar data teknis.", meta: "Mapelastic · Aquaflex Roof · Silasec", status: "hampir kedap" },
  { title: "Uji genang", text: "Area digenangi air dan dicek dari bawah sebelum ditutup keramik atau screed. Kering di bawah, baru serah terima.", meta: "Status akhir: kedap air", status: "kedap air" },
];
