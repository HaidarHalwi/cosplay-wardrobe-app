"use client"; 

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, FormEvent, useEffect, useRef } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { Search, UserCircle, ChevronDown, LogOut } from 'lucide-react';
import { Product } from '@/app/data/products';
import Image from 'next/image';

const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const router = useRouter();
  const categoryRef = useRef<HTMLDivElement>(null);
  const { isAuthenticated, logout } = useAuth();

  // Memastikan URL selalu mengarah ke Production di Vercel
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    const fetchResults = async () => {
      if (searchQuery.trim() !== '' && API_URL) {
        try {
          // Menghapus penggunaan localhost agar tidak error di server online
          const res = await fetch(`${API_URL}/products?q=${searchQuery}&limit=5`);
          if (res.ok) {
            const data = await res.json();
            setFilteredProducts(data);
            setIsDropdownVisible(data.length > 0);
          }
        } catch (error) {
          console.error("Search fetch error:", error);
        }
      } else {
        setIsDropdownVisible(false);
      }
    };
    
    const debounceTimer = setTimeout(fetchResults, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchQuery, API_URL]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (categoryRef.current && !categoryRef.current.contains(event.target as Node)) {
        setIsCategoryOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    router.push(`/search?q=${searchQuery}`);
    setIsDropdownVisible(false);
  };
  
  return (
    <header className="bg-[#313131] text-white py-3 px-8 sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold tracking-wider">Cosplayer</Link>
        
        <form onSubmit={handleSearchSubmit} className="flex-1 max-w-lg mx-8 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Type Something"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onBlur={() => setTimeout(() => setIsDropdownVisible(false), 200)}
            onFocus={() => { if (searchQuery.trim() !== '') setIsDropdownVisible(true); }}
            className="w-full bg-[#4F4F4F] rounded-lg py-2 pl-12 pr-4 focus:outline-none placeholder-gray-400"
          />
          {isDropdownVisible && (
            <div className="absolute top-full mt-2 w-full bg-[#3C3C3C] rounded-lg overflow-hidden z-10 shadow-lg">
              <ul>
                {filteredProducts.map(product => (
                  <li key={product._id}>
                    <Link href={`/produk/${product._id}`} className="flex items-center p-2 hover:bg-[#4a4a4a]" onClick={() => setIsDropdownVisible(false)}>
                      <div className="relative w-10 h-10 mr-3 rounded overflow-hidden">
                        <Image src={product.imageUrl || '/placeholder.png'} alt={product.name} fill className="object-cover" />
                      </div>
                      <span>{product.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </form>
        
        <nav className="flex items-center space-x-6">
           <Link href="/" className="hover:text-[#E94A61]">Home</Link>
           <Link href="/browse" className="hover:text-[#E94A61]">Browse</Link>
           <div className="relative" ref={categoryRef}>
             <button onClick={() => setIsCategoryOpen(!isCategoryOpen)} className="flex items-center space-x-1 hover:text-[#E94A61]">
               <span>Kategori</span>
               <ChevronDown size={16} />
             </button>
             {isCategoryOpen && (
               <div className="absolute top-full right-0 mt-2 w-40 bg-[#3C3C3C] rounded-lg shadow-lg">
                 <Link href="/kategori/termurah" className="block px-4 py-2 hover:bg-[#4a4a4a]">Termurah</Link>
               </div>
             )}
           </div>
           {isAuthenticated ? (
            <button onClick={() => { logout(); router.push('/'); }} className="flex items-center space-x-2 hover:text-[#E94A61]">
              <LogOut size={24} />
              <span>Logout</span>
            </button>
           ) : (
            <Link href="/login" className="flex items-center space-x-2 hover:text-[#E94A61]">
              <UserCircle size={24} />
              <span>Login</span>
            </Link>
           )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;