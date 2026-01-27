export const dynamic = 'force-dynamic';

import ProductCard from '@/app/components/ProductCard';
import { Product } from '@/app/data/products';
import Image from 'next/image';
import { Star } from 'lucide-react';

async function getProducts() {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    // Mengambil data produk terbaru langsung dari MongoDB Atlas
    const res = await fetch(`${apiUrl}/products`, { cache: 'no-store' });
    
    if (!res.ok) throw new Error('Failed to fetch data');
    return res.json();
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
}

export default async function BrowsePage() {
  const allProducts: Product[] = await getProducts();
  
  // Ambil 3 produk secara acak untuk bagian "terlaris"
  // Pastikan data di Atlas sudah menggunakan path /images/ agar gambar muncul
  const bestSellers = [...allProducts].sort(() => 0.5 - Math.random()).slice(0, 3);
  const series = ["Naruto", "One Piece", "Genshin Impact", "Pokemon"];

  return (
    <div className="space-y-12 text-white">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Kolom Kiri: Terlaris & Daftar Semua */}
        <div className="lg:col-span-2 space-y-12">
          
          {/* BAGIAN TERLARIS (Sudah Direvisi Menggunakan ProductCard) */}
          <section className="bg-[#2D2D2D] p-6 rounded-2xl">
            <h2 className="text-2xl font-bold mb-4">Kostum terlaris bulan ini</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {bestSellers.length > 0 ? bestSellers.map(product => (
                <ProductCard key={`best-${product._id}`} product={product} />
              )) : (
                <p className="text-gray-400">Belum ada data produk terlaris.</p>
              )}
            </div>
          </section>

          {/* DAFTAR SEMUA PRODUK */}
          <section>
            <h2 className="text-3xl font-bold mb-6">Banyak pilihan kostum nih!</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {allProducts.length > 0 ? allProducts.map(product => (
                <ProductCard key={product._id} product={product} />
              )) : (
                <p className="text-gray-400">Memuat koleksi kostum...</p>
              )}
            </div>
          </section>
        </div>

        {/* Kolom Kanan: Sesuai Series */}
        <aside className="lg:col-span-1 lg:sticky lg:top-24">
          <div className="bg-[#2D2D2D] p-6 rounded-2xl">
            <h3 className="text-xl font-bold mb-4">Kostum sesuai series</h3>
            <div className="space-y-3">
              {series.map(s => (
                <div key={s} className="flex items-center space-x-4 bg-[#3C3C3C] p-4 rounded-lg hover:bg-[#4a4a4a] transition-colors cursor-pointer">
                    <div className="w-12 h-12 bg-[#4F4F4F] rounded-lg flex items-center justify-center text-xs text-gray-400 font-bold">
                      {s.substring(0, 3).toUpperCase()}
                    </div>
                    <span className="font-semibold">{s}</span>
                </div>
              ))}
            </div>
          </div>
        </aside>

      </div>
    </div>
  );
}