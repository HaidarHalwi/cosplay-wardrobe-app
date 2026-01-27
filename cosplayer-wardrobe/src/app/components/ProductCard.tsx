'use client';
import Link from 'next/link';
import { Star } from 'lucide-react';
import type { Product } from '@/app/data/products';

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  console.log('IMAGE URL FROM DB:', product.imageUrl);

  const formatPrice = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(product.price);

  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || 'https://cosplay-wardrobe-app-w2mh.vercel.app';

  const imageUrl = product.imageUrl?.startsWith('http')
    ? product.imageUrl
    : `${baseUrl}${product.imageUrl}`;

  console.log('BASE URL:', baseUrl);
  console.log('FINAL IMAGE URL:', imageUrl);

  return (
    <Link href={`/produk/${product._id}`} className="block bg-[#3C3C3C] rounded-2xl overflow-hidden group shadow-lg">
      <div className="relative w-full h-48 overflow-hidden">
        <img
          src={imageUrl}
          alt={product.name}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="p-4">
        <h3 className="font-bold text-lg text-white truncate">{product.name}</h3>
        <p className="text-sm text-gray-400 mb-2">{product.series}</p>
        <div className="flex justify-between items-center mt-2">
          <p className="text-[#E94A61] font-bold text-lg">{formatPrice}</p>
          <div className="flex items-center space-x-1 bg-[#4F4F4F] px-2 py-1 rounded-md">
            <Star className="text-yellow-400 fill-current" size={14} />
            <span className="text-sm text-white font-medium">{product.rating}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
