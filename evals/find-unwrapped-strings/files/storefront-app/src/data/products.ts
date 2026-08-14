export interface Product {
  sku: string;
  slug: string;
  image: string;
  status: "ACTIVE" | "DRAFT";
  price: number;
  name: string;
  tagline: string;
  description: string;
  badge?: string;
}

export const products: Product[] = [
  {
    sku: "sku-1001",
    slug: "aero-press-go",
    image: "/img/aeropress-go.webp",
    status: "ACTIVE",
    price: 39,
    name: "AeroPress Go",
    tagline: "Espresso-style coffee, anywhere",
    description: "A compact press that travels in its own mug.",
    badge: "Best seller",
  },
  {
    sku: "sku-1002",
    slug: "fellow-stagg",
    image: "/img/stagg-ekg.webp",
    status: "ACTIVE",
    price: 165,
    name: "Stagg EKG Kettle",
    tagline: "Pour with a steady hand",
    description:
      "Variable temperature control with a counterbalanced spout.",
  },
  {
    sku: "sku-1003",
    slug: "comandante-c40",
    image: "/img/c40.webp",
    status: "ACTIVE",
    price: 249,
    name: "Comandante C40 Grinder",
    tagline: "Hand-ground precision",
    description: "A conical burr grinder trusted at brewing championships.",
  },
  {
    sku: "sku-1004",
    slug: "origami-dripper",
    image: "/img/origami.webp",
    status: "DRAFT",
    price: 32,
    name: "Origami Dripper",
    tagline: "One dripper, twenty ways to brew",
    description: "Works with flat and conical papers alike.",
  },
];
