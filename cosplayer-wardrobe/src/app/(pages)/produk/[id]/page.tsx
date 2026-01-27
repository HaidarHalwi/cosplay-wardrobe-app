"use client";

import { useState, useEffect, use } from 'react'; // Tambahkan 'use' untuk params di Next.js terbaru
import { Product } from '@/app/data/products';
import Image from 'next/image';
import { Star, ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import ProductCard from '@/app/components/ProductCard';

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  // Di Next.js terbaru, params harus di-unwrap menggunakan 'use'
  const decodedParams = use(params);
  const id = decodedParams.id;

  const [product, setProduct] = useState<Product | null>(null);
  const [otherProducts, setOtherProducts] = useState<Product[]>([]);
  const [activeTab, setActiveTab] = useState('deskripsi');
  const [loading, setLoading] = useState(true);

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    if (id && API_URL) {
      const fetchData = async () => {
        setLoading(true);
        try {
          // 1. Ambil Detail Produk
          const res = await fetch(`${API_URL}/products/${id}`);
          if (res.ok) {
            const data: Product = await res.json();
            setProduct(data);
          }

          // 2. Ambil Saran Produk Lainnya
          const resOthers = await fetch(`${API_URL}/products`);
          if (resOthers.ok) {
            const allData = await resOthers.json();
            // Filter agar produk yang sedang dilihat tidak muncul di saran
            setOtherProducts(allData.filter((p: Product) => p._id !== id).slice(0, 4));
          }
        } catch (error) {
          console.error("Error fetching data:", error);
        } finally {
          setLoading(false);
        }
      };
      
      fetchData();
    }
  }, [id, API_URL]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#E94A61] mb-4"></div>
        <p>Sedang memuat kostum...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-20 text-white">
        <h2 className="text-2xl font-bold">Yah, Produk Tidak Ditemukan</h2>
        <Link href="/browse" className="text-[#E94A61] mt-4 block underline">Kembali ke Katalog</Link>
      </div>
    );
  }

  const formatPrice = new Intl.NumberFormat('id-ID', { 
    style: 'currency', 
    currency: 'IDR', 
    minimumFractionDigits: 0 
  }).format(product.price);

  return (
    <div className="space-y-12 text-white pb-20">
      <Link href="/browse" className="flex items-center text-gray-400 hover:text-white transition-colors">
        <ChevronLeft size={20} /> Kembali ke Browse
      </Link>

      <div className="bg-[#2D2D2D] p-6 md:p-10 rounded-3xl shadow-2xl">
        <div className="grid md:grid-cols-2 gap-12">
          {/* Sisi Kiri: Gambar Produk */}
          <div className="relative aspect-[3/4] md:aspect-square rounded-2xl overflow-hidden bg-[#3C3C3C]">
            <Image 
              src={product.imageUrl || '/images/placeholder.png'} 
              alt={product.name} 
              fill 
              style={{ objectFit: 'cover' }}
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
          </div>
          
          {/* Sisi Kanan: Informasi */}
          <div className="flex flex-col">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[#E94A61] font-semibold text-sm tracking-widest uppercase">{product.series}</span>
                <h1 className="text-4xl font-bold mt-1">{product.name}</h1>
              </div>
              <div className="flex items-center space-x-1 bg-[#3C3C3C] px-3 py-1 rounded-lg">
                <Star className="text-yellow-400 fill-current" size={18} />
                <span className="font-bold">{product.rating}</span>
              </div>
            </div>

            <p className="text-3xl font-bold text-[#E94A61] my-6">{formatPrice}</p>

            <div className="space-y-6">
              <div className="flex space-x-2 border-b border-gray-700">
                <button 
                  onClick={() => setActiveTab('deskripsi')} 
                  className={`py-3 px-6 font-bold transition-all ${activeTab === 'deskripsi' ? 'text-white border-b-2 border-[#E94A61]' : 'text-gray-500'}`}
                >
                  Deskripsi
                </button>
                <button 
                  onClick={() => setActiveTab('ulasan')} 
                  className={`py-3 px-6 font-bold transition-all ${activeTab === 'ulasan' ? 'text-white border-b-2 border-[#E94A61]' : 'text-gray-500'}`}
                >
                  Ulasan
                </button>
              </div>

              <div className="text-gray-300 leading-relaxed min-h-[100px]">
                {activeTab === 'deskripsi' ? (
                  <p>{product.description}</p>
                ) : (
                  <p className="italic text-gray-500 text-sm">Belum ada ulasan untuk kostum ini.</p>
                )}
              </div>

              <Link href={`/pesan/${product._id}`} className="block w-full bg-[#E94A61] hover:bg-[#c83d52] text-white text-center font-bold py-4 rounded-xl shadow-lg transition-all transform hover:scale-[1.02]">
                Pesan Sekarang
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      {/* Rekomendasi Kostum Lain */}
      {otherProducts.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold mb-8 flex items-center gap-2">
            <span className="w-2 h-8 bg-[#E94A61] rounded-full"></span>
            Saran kostum lainnya
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {otherProducts.map(p => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}