import ProductCard from '@/app/components/ProductCard';

type SearchPageProps = {
  searchParams: { q: string };
};

async function getProducts() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/products`,
    { cache: 'no-store' }
  );

  if (!res.ok) {
    throw new Error('Gagal mengambil produk');
  }

  return res.json();
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const query = searchParams.q || '';
  const products = await getProducts();

  const filteredProducts = products.filter((product: any) =>
    product.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="bg-[#2D2D2D] p-8 rounded-2xl">
      <h1 className="text-4xl font-bold mb-8">
        Ini kostum sesuai pencarian mu
      </h1>

      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product: any) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-400 text-lg">
          Kostum untuk "{query}" tidak ditemukan.
        </p>
      )}
    </div>
  );
}
