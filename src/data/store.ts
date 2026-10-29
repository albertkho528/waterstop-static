// Store data — edit here, every language follows.
// Opening hours and rating text per language are in src/i18n/{id,en,zh}.ts → contact.hoursValue / hero.rating.
export const STORE = {
  name: "Toko Waterstop",
  company: "PT JMA",
  wa: "6285837512484", // international format, no + or spaces
  phoneDisplay: "+62 858-3751-2484",
  address:
    "Ruko Accelence Blk. A No. 12, Teluk Tering, Batam Centre, Batam 29432",
  street: "Ruko Accelence Blk. A No. 12, Teluk Tering",
  locality: "Batam",
  region: "Kepulauan Riau",
  postalCode: "29432",
  maps:
    "https://www.google.com/maps/search/?api=1&query=" +
    encodeURIComponent(
      "Toko Waterstop PT JMA, Ruko Accelence Blk A No 12, Teluk Tering, Batam Centre",
    ),
  facebook: "https://www.facebook.com/jma.batam",
  instagram: "", // fill in the full URL if available
  tiktok: "",
};

export function waLink(text?: string): string {
  if (!STORE.wa) return "#kontak";
  return (
    "https://wa.me/" +
    STORE.wa +
    (text ? "?text=" + encodeURIComponent(text) : "")
  );
}

/** Attributes for the WhatsApp link: open in a new tab when a number is set. */
export const waExt = () =>
  STORE.wa ? { target: "_blank", rel: "noopener" } : {};
