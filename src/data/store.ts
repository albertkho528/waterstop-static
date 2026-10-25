// Data toko — ubah di sini, semua halaman ikut berubah.
export const STORE = {
  name: "Toko Waterstop",
  company: "PT JMA",
  wa: "628117702170", // format internasional tanpa + dan spasi
  phoneDisplay: "+62 811-7702-170",
  address: "Ruko Accelence Blk. A No. 12, Teluk Tering, Batam Centre, Batam 29432",
  street: "Ruko Accelence Blk. A No. 12, Teluk Tering",
  locality: "Batam",
  region: "Kepulauan Riau",
  postalCode: "29432",
  hours: "Buka mulai 08.00 WIB", // lengkapi: hari & jam tutup
  googleRating: "★ 5.0 Google · 3 ulasan",
  maps:
    "https://www.google.com/maps/search/?api=1&query=" +
    encodeURIComponent("Toko Waterstop PT JMA, Ruko Accelence Blk A No 12, Teluk Tering, Batam Centre"),
  facebook: "https://www.facebook.com/jma.batam",
  instagram: "", // isi URL lengkap bila ada
  tiktok: "",
};

export function waLink(text?: string): string {
  if (!STORE.wa) return "#kontak";
  return "https://wa.me/" + STORE.wa + (text ? "?text=" + encodeURIComponent(text) : "");
}

export const DEFAULT_WA_TEXT = "Halo Waterstop, saya mau tanya soal waterproofing.";
