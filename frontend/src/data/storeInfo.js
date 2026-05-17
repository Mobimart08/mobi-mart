export const storeAddressLines = [
  "Opp. Zudio, Near Bus Stand, Junction",
  "Hanumangarh, Rajasthan 335512",
];

export const storeAddress = storeAddressLines.join(", ");

export const storePhone = "+91 76653 62197";
export const storePhoneHref = "tel:+917665362197";
export const whatsappNumber = import.meta.env.VITE_WHATSAPP_NUMBER || "917665362197";
export const businessPhone = "+91 63774 37785";
export const businessPhoneHref = "tel:+916377437785";
export const businessWhatsappNumber = "916377437785";

export const googleMapsHref = "https://maps.app.goo.gl/c1YYn9MJqk3XKjTj7";

export function buildWhatsAppHref(message) {
  return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
}

export function buildBusinessWhatsAppHref(message) {
  return `https://wa.me/${businessWhatsappNumber}?text=${encodeURIComponent(message)}`;
}

export function buildProductInquiryMessage(productName, extras = []) {
  return [
    `Hi, I am interested in ${productName}.`,
    ...extras.filter(Boolean),
    "Please share availability and best price.",
  ].join("\n");
}
