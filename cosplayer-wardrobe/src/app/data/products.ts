export type Product = {
  _id: string; 
  name: string;
  series: string;
  price: number;
  rating: number;
  imageUrl: string; // REVISI: Sekarang menggunakan String tunggal sesuai Atlas
  description: string;
  reviews?: { name: string; rating: number; comment: string }[];
};

// Data lokal untuk cadangan (fallback) atau pengembangan
export const products: Product[] = [
  {
    _id: "697779a3efbc97de43f1d4b1", // ID sesuai MongoDB Atlas kamu
    name: "Kostum Naruto Shippuden",
    series: "Naruto",
    price: 250000,
    rating: 4.8,
    imageUrl: "https://down-id.img.susercontent.com/file/id-11134207-7r98r-lktp8h68m2...",
    description: "Kostum Naruto Shippuden kualitas premium, lengkap dengan aksesoris.",
    reviews: [],
  },
  {
    _id: "64b1f2a3c9e8d7f6a5b4c3d3",
    name: "Kostum Sasuke Uchiha (Hebi)",
    series: "Naruto",
    price: 275000,
    rating: 4.9,
    imageUrl: "https://down-id.img.susercontent.com/file/id-11134207-7r98r-lktp8h68m2...",
    description: "Kostum Sasuke Uchiha saat berada di tim Hebi, sangat detail.",
    reviews: [],
  },
  {
    _id: "64b1f2a3c9e8d7f6a5b4c3d4",
    name: "Jubah Akatsuki Itachi",
    series: "Naruto",
    price: 185000,
    rating: 4.7,
    imageUrl: "https://down-id.img.susercontent.com/file/id-11134207-7r98r-lktp8h68m2...",
    description: "Jubah Akatsuki dengan bordir awan merah berkualitas tinggi.",
    reviews: [],
  },
  {
    _id: "64b1f2a3c9e8d7f6a5b4c3d5",
    name: "Kostum Kakashi Hatake (Jounin)",
    series: "Naruto",
    price: 320000,
    rating: 4.8,
    imageUrl: "https://down-id.img.susercontent.com/file/id-11134207-7r98r-lktp8h68m2...",
    description: "Kostum Jounin Konoha lengkap dengan rompi hijau legendaris.",
    reviews: [],
  }
];