export const dynamic = 'force-dynamic';

import ProductCard from '@/app/components/ProductCard';
import { Product } from '@/app/data/products';
import Image from 'next/image';
import { Star } from 'lucide-react';

async function getProducts() {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
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
  const bestSellers = [...allProducts].sort(() => 0.5 - Math.random()).slice(0, 3);
  const series = ["Naruto", "One Piece", "Genshin Impact", "Pokemon"];

  return (
    <div className="space-y-12">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Kolom Kiri: Terlaris & Daftar Semua */}
        <div className="lg:col-span-2 space-y-12">
          <section className="bg-[#2D2D2D] p-6 rounded-2xl">
            <h2 className="text-2xl font-bold mb-4">Kostum terlaris bulan ini</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {bestSellers.map(product => (
                 <div key={product._id} className="bg-[#3C3C3C] rounded-xl overflow-hidden group">
                    <div className="relative w-full h-48">
                        <Image src={product.imageUrl} alt={product.name} layout="fill" objectFit="cover" className="group-hover:scale-105 transition-transform duration-300"/>
                    </div>
                    <div className="p-3">
                        <h3 className="font-semibold text-white truncate">{product.name}</h3>
                        <div className="flex justify-between items-center text-sm mt-1">
                            <p className="text-gray-300">Rp{product.price.toLocaleString('id-ID')}</p>
                            <div className="flex items-center space-x-1">
                                <Star className="text-yellow-400 fill-current" size={14} />
                                <span className="text-gray-300">{product.rating}</span>
                            </div>
                        </div>
                    </div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-3xl font-bold mb-6">Banyak pilihan kostum nih!</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {allProducts.map(product => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          </section>
        </div>

        {/* Kolom Kanan: Sesuai Series */}
        <aside className="lg:col-span-1 sticky top-24">
          <div className="bg-[#2D2D2D] p-6 rounded-2xl">
            <h3 className="text-xl font-bold mb-4">Kostum sesuai series</h3>
            <div className="space-y-3">
              {series.map(s => (
                <div key={s} className="flex items-center space-x-4 bg-[#3C3C3C] p-4 rounded-lg hover:bg-[#4a4a4a] transition-colors cursor-pointer">
                    <div className="w-12 h-12 bg-[#4F4F4F] rounded-lg"></div>
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