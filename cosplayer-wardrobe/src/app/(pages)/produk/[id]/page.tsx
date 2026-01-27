"use client";

import { useState, useEffect, use } from 'react';
import { Product } from '@/app/data/products';
import Image from 'next/image';
import { Star, ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import ProductCard from '@/app/components/ProductCard';

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  // UNWRAP params untuk Next.js terbaru
  const decodedParams = use(params);
  const id = decodedParams.id;

  const [product, setProduct] = useState<Product | null>(null);
  const [otherProducts, setOtherProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    if (id && API_URL) {
      const fetchData = async () => {
        setLoading(true);
        try {
          // Ambil Detail Produk
          const res = await fetch(`${API_URL}/products/${id}`, { cache: 'no-store' });
          if (res.ok) {
            const data = await res.json();
            setProduct(data);
          } else {
            console.error("API Response not OK");
          }

          // Ambil Saran Produk
          const resOthers = await fetch(`${API_URL}/products`);
          if (resOthers.ok) {
            const allData = await resOthers.json();
            setOtherProducts(allData.filter((p: Product) => p._id !== id).slice(0, 4));
          }
        } catch (error) {
          console.error("Fetch error:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    }
  }, [id, API_URL]);

  if (loading) return <div className="text-white text-center py-20">Memuat detail kostum...</div>;

  if (!product) {
    return (
      <div className="text-white text-center py-20">
        <h2 className="text-2xl font-bold">Yah, Produk Tidak Ditemukan</h2>
        <Link href="/browse" className="text-[#E94A61] underline mt-4 block">Kembali ke Katalog</Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 text-white pb-20">
      <Link href="/browse" className="flex items-center text-gray-400 hover:text-white mb-8">
        <ChevronLeft size={20} /> Kembali ke Browse
      </Link>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="relative aspect-square rounded-3xl overflow-hidden bg-[#3C3C3C]">
          <Image 
            src={product.imageUrl || '/images/placeholder.png'} 
            alt={product.name} 
            fill 
            className="object-cover" 
            priority
          />
        </div>
        
        <div className="space-y-6">
          <h1 className="text-4xl font-bold">{product.name}</h1>
          <p className="text-3xl text-[#E94A61] font-bold">Rp{product.price.toLocaleString('id-ID')}</p>
          <p className="text-gray-300 leading-relaxed">{product.description}</p>
          <Link href={`/pesan/${product._id}`} className="block w-full bg-[#E94A61] py-4 rounded-xl text-center font-bold">
            Pesan Sekarang
          </Link>
        </div>
      </div>

      {/* Rekomendasi */}
      <section className="mt-20">
        <h2 className="text-2xl font-bold mb-8">Saran kostum lainnya</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {otherProducts.map(p => <ProductCard key={p._id} product={p} />)}
        </div>
      </section>
    </div>
  );
}