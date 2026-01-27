"use client";

import ProductCard from '@/app/components/ProductCard';
import { products, Product } from '@/app/data/products';
import { useParams } from 'next/navigation';

// Menghindari error prerendering dengan memaksa halaman menjadi dinamis
export const dynamic = 'force-dynamic';

export default function KategoriPage() {
  const params = useParams();
  const slug = params?.slug as string;

  let sortedProducts: Product[] = [...products];
  let title = "Kategori";

  if (slug === 'termurah') {
    title = 'Termurah';
    sortedProducts.sort((a, b) => a.price - b.price);
  } else if (slug === 'up-rating') {
    title = 'Up-Rating';
    sortedProducts.sort((a, b) => b.rating - a.rating);
  }

  return (
    <div className="bg-[#2D2D2D] p-8 rounded-2xl text-white">
      <h1 className="text-4xl font-bold mb-8 capitalize">{title}</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {sortedProducts.length > 0 ? (
          sortedProducts.map(product => (
            <ProductCard key={product._id} product={product} />
          ))
        ) : (
          <p className="text-gray-400">Tidak ada produk di kategori ini.</p>
        )}
      </div>
    </div>
  );
}