import ProductCard from '@/app/components/ProductCard';
import TermsAndConditions from '@/app/components/TermsAndConditions';
import { Product } from '@/app/data/products';
import Image from 'next/image';

// WAJIB: Paksa halaman ini menjadi dinamis agar selalu mengambil data terbaru dari API
export const dynamic = 'force-dynamic';

async function getProducts() {
  try {
    // PERBAIKAN: Gunakan NEXT_PUBLIC_API_URL yang sudah kita set di dashboard Vercel
    // Karena value di Vercel sudah termasuk '/api', maka cukup tambahkan '/products'
    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/products`;
    
    const res = await fetch(apiUrl, { cache: 'no-store' });
    
    if (!res.ok) {
      throw new Error('Gagal mengambil data produk');
    }
    
    const products = await res.json();
    return products.slice(0, 8);
  } catch (error) {
    console.error("Error saat mengambil produk:", error);
    return []; 
  }
}

export default async function HomePage() {
  const recommendedProducts: Product[] = await getProducts();

  return (
    <div className="space-y-12">
      {/* Bagian Hero Banner */}
      <section className="relative h-100 rounded-2xl overflow-hidden flex items-center p-12">
        <Image 
          src="/images/home-banner.png" 
          alt="Welcome banner" 
          fill // PERBAIKAN: Next.js 15 menyarankan 'fill' daripada 'layout="fill"'
          style={{ objectFit: 'cover' }}
          className="z-0" 
          priority
        />
        <div className="absolute inset-0 bg-black/50 z-10"></div>
        <div className="relative z-20">
          <p className="text-lg text-white">Welcome to Cosplayer Wardrobe</p>
          <h1 className="text-5xl font-extrabold mt-2 text-white">MAU COSPLAY</h1>
          <h1 className="text-5xl font-extrabold text-white">APA HARI INI?</h1>
        </div>
      </section>

      {/* Bagian Saran Kostum */}
      <section>
        <div className="bg-[#2D2D2D] p-8 rounded-2xl">
          <h2 className="text-3xl font-bold mb-6 text-white">Saran kostum untuk kamu</h2>
          {recommendedProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {recommendedProducts.map(product => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          ) : (
            <p className="text-gray-400">Gagal memuat produk. Pastikan koneksi API berjalan.</p>
          )}
        </div>
      </section>

      <TermsAndConditions />
    </div>
  );
}