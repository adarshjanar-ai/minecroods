import { useState, useEffect, createContext, useContext, ReactNode } from "react";

// ─── Types ──────────────────────────────────────────────
interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  originalPrice?: number;
  image: string;
  description: string;
  longDescription: string;
  materials: string[];
  features: string[];
  colors: string[];
  rating: number;
  reviews: number;
  badge?: string;
  inStock: boolean;
}

interface CartItem {
  product: Product;
  quantity: number;
  color: string;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, color: string) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  cartCount: number;
  cartTotal: number;
  clearCart: () => void;
}

// ─── Cart Context ───────────────────────────────────────
const CartContext = createContext<CartContextType | null>(null);
const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be inside CartProvider");
  return ctx;
};

const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const addToCart = (product: Product, color: string) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.product.id === product.id && i.color === color);
      if (existing) return prev.map((i) => (i.product.id === product.id && i.color === color ? { ...i, quantity: i.quantity + 1 } : i));
      return [...prev, { product, quantity: 1, color }];
    });
  };
  const removeFromCart = (id: number) => setCart((p) => p.filter((i) => i.product.id !== id));
  const updateQuantity = (id: number, qty: number) => {
    if (qty <= 0) return removeFromCart(id);
    setCart((p) => p.map((i) => (i.product.id === id ? { ...i, quantity: qty } : i)));
  };
  const clearCart = () => setCart([]);
  const cartCount = cart.reduce((s, i) => s + i.quantity, 0);
  const cartTotal = cart.reduce((s, i) => s + i.product.price * i.quantity, 0);
  return <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, cartCount, cartTotal, clearCart }}>{children}</CartContext.Provider>;
};

// ─── Global Styles ──────────────────────────────────────
const GlobalStyles = () => (
  <style>{`
    @keyframes gradient-x {
      0%, 100% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
    }
    @keyframes float {
      0%, 100% { transform: translateY(0px) rotate(0deg); }
      50% { transform: translateY(-20px) rotate(3deg); }
    }
    @keyframes float-reverse {
      0%, 100% { transform: translateY(0px) rotate(0deg); }
      50% { transform: translateY(15px) rotate(-2deg); }
    }
    @keyframes pulse-glow {
      0%, 100% { box-shadow: 0 0 20px rgba(16,185,129,0.2); }
      50% { box-shadow: 0 0 40px rgba(16,185,129,0.4); }
    }
    @keyframes marquee {
      0% { transform: translateX(0); }
      100% { transform: translateX(-50%); }
    }
    @keyframes fade-in-up {
      from { opacity: 0; transform: translateY(30px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes shimmer {
      0% { background-position: -200% 0; }
      100% { background-position: 200% 0; }
    }
    @keyframes spin-slow {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
    .animate-gradient-x {
      background-size: 200% 200%;
      animation: gradient-x 8s ease infinite;
    }
    .animate-float { animation: float 6s ease-in-out infinite; }
    .animate-float-reverse { animation: float-reverse 5s ease-in-out infinite; }
    .animate-pulse-glow { animation: pulse-glow 3s ease-in-out infinite; }
    .animate-marquee { animation: marquee 30s linear infinite; }
    .animate-fade-in-up { animation: fade-in-up 0.8s ease-out forwards; }
    .animate-shimmer {
      background: linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent);
      background-size: 200% 100%;
      animation: shimmer 3s infinite;
    }
    .animate-spin-slow { animation: spin-slow 20s linear infinite; }
    .glass {
      background: rgba(255,255,255,0.05);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border: 1px solid rgba(255,255,255,0.1);
    }
    .glass-light {
      background: rgba(255,255,255,0.7);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border: 1px solid rgba(255,255,255,0.3);
    }
    .glass-dark {
      background: rgba(0,0,0,0.4);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border: 1px solid rgba(255,255,255,0.08);
    }
    .text-gradient {
      background: linear-gradient(135deg, #10b981, #06b6d4, #8b5cf6);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    .text-gradient-gold {
      background: linear-gradient(135deg, #f59e0b, #ef4444, #f59e0b);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    .hover-lift {
      transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.4s ease;
    }
    .hover-lift:hover {
      transform: translateY(-8px);
      box-shadow: 0 20px 60px rgba(0,0,0,0.15);
    }
    .img-zoom { transition: transform 0.7s cubic-bezier(0.4, 0, 0.2, 1); }
    .group:hover .img-zoom { transform: scale(1.1); }
    .line-clamp-2 {
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
    * { scroll-behavior: smooth; }
    body { 
      font-family: 'Inter', system-ui, -apple-system, sans-serif; 
      -webkit-font-smoothing: antialiased;
    }
  `}</style>
);

// ─── Product Data ───────────────────────────────────────
const products: Product[] = [
  {
    id: 1, name: "EcoFlex Gym Bag", category: "Gym Bags", price: 79.99, originalPrice: 99.99,
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&h=800&fit=crop&q=80",
    description: "Spacious gym bag made from 100% recycled ocean plastic.",
    longDescription: "Our EcoFlex Gym Bag is crafted from 100% recycled ocean plastic, diverted from coastlines across Southeast Asia. Featuring a spacious main compartment, ventilated shoe pocket, and water-resistant lining made from plant-based materials. Every bag removes 2kg of ocean plastic from our waterways.",
    materials: ["Recycled Ocean Plastic", "Plant-based Lining", "Organic Cotton Straps", "Bamboo Zippers"],
    features: ["Ventilated shoe compartment", "Water-resistant coating", "Laptop sleeve (fits 15\")", "Multiple organizer pockets", "Adjustable shoulder strap"],
    colors: ["Forest Green", "Ocean Blue", "Charcoal"], rating: 4.8, reviews: 234, badge: "Best Seller", inStock: true,
  },
  {
    id: 2, name: "ZenCarry Pilates Bag", category: "Pilates Bags", price: 64.99,
    image: "https://images.unsplash.com/photo-1544816155-12df9643f363?w=800&h=800&fit=crop&q=80",
    description: "Elegant pilates bag with mat carrier, made from organic hemp.",
    longDescription: "The ZenCarry is designed specifically for pilates enthusiasts. Made from organic hemp and natural dyes, it features an external mat carrier, internal compartments for your essentials, and a removable pouch for personal items. Lightweight yet incredibly durable — this bag gets softer and more beautiful with age.",
    materials: ["Organic Hemp", "Natural Dyes", "Cork Accents", "Recycled Polyester Lining"],
    features: ["External mat carrier straps", "Removable inner pouch", "Cork detail accents", "Magnetic closure", "Ultralight design"],
    colors: ["Natural Tan", "Sage Green", "Dusty Rose"], rating: 4.9, reviews: 189, badge: "New Arrival", inStock: true,
  },
  {
    id: 3, name: "TideWave Beach Bag", category: "Beach Bags", price: 54.99,
    image: "https://images.unsplash.com/photo-1523380677598-64b7b3a0561e?w=800&h=800&fit=crop&q=80",
    description: "Oversized beach bag woven from recycled fishing nets.",
    longDescription: "The TideWave Beach Bag transforms discarded fishing nets — collected from the Mediterranean coast — into a stunning, oversized beach companion. The sand-resistant mesh bottom lets sand fall through, while the spacious interior fits towels, sunscreen, books, and everything you need.",
    materials: ["Recycled Fishing Nets", "Sand-resistant Mesh", "Coconut Shell Buttons", "Organic Cotton Lining"],
    features: ["Sand-resistant mesh bottom", "Oversized capacity", "Waterproof inner pocket", "Coconut shell closures", "Foldable design"],
    colors: ["Sandy Beige", "Ocean Teal", "Coral"], rating: 4.7, reviews: 156, inStock: true,
  },
  {
    id: 4, name: "PureShake Protein Bottle", category: "Shaker Bottles", price: 29.99, originalPrice: 34.99,
    image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800&h=800&fit=crop&q=80",
    description: "BPA-free shaker made from plant-based bioplastic.",
    longDescription: "The PureShake is the world's first protein shaker made entirely from plant-based bioplastic derived from sugarcane. Features a leak-proof design, integrated mixing ball made from recycled stainless steel, and measurement markings. 100% industrially compostable at end of life.",
    materials: ["Plant-based Bioplastic", "Recycled Stainless Steel", "Medical-grade Silicone Seal", "Soy-based Ink"],
    features: ["700ml capacity", "Leak-proof guarantee", "Integrated mixing ball", "Measurement markings", "Dishwasher safe", "Industrially compostable"],
    colors: ["Clear Green", "Frosted White", "Earth Brown"], rating: 4.6, reviews: 312, badge: "Eco Choice", inStock: true,
  },
  {
    id: 5, name: "PureShake Pro Bottle", category: "Shaker Bottles", price: 39.99,
    image: "https://images.unsplash.com/photo-1570831739435-6601aa3fa4fb?w=800&h=800&fit=crop&q=80",
    description: "Premium dual-chamber shaker with supplement storage.",
    longDescription: "The PureShake Pro takes sustainable hydration to the next level. Dual-chamber design lets you store supplements separately. Made from the same plant-based bioplastic as our classic, with added features like a twist-lock supplement compartment and vacuum-insulated walls to keep drinks cold.",
    materials: ["Plant-based Bioplastic", "Recycled Steel Mixing Ball", "Natural Rubber Seal", "Cork Grip Band"],
    features: ["900ml capacity", "Dual chamber design", "Twist-lock supplement storage", "Insulated walls", "Cork grip band", "Compostable"],
    colors: ["Midnight Black", "Forest Green", "Arctic White"], rating: 4.8, reviews: 198, inStock: true,
  },
  {
    id: 6, name: "CloudDry Gym Towel", category: "Gym Towels", price: 24.99,
    image: "https://images.unsplash.com/photo-1600881333168-2ef49b341f30?w=800&h=800&fit=crop&q=80",
    description: "Quick-dry microfiber towel from recycled plastic bottles.",
    longDescription: "The CloudDry Gym Towel is made from microfiber derived from recycled plastic bottles — each towel repurposes 12 bottles that would otherwise end up in landfill. Ultra-absorbent, quick-drying, and naturally antimicrobial without chemical treatments. Comes in a recycled cotton drawstring carry bag.",
    materials: ["Recycled PET Microfiber", "Natural Antimicrobial Treatment", "Recycled Cotton Bag"],
    features: ["Ultra-absorbent", "Quick-dry technology", "Naturally antimicrobial", "Compact & lightweight", "Includes carry bag", "Machine washable"],
    colors: ["Steel Gray", "Deep Teal", "Warm Terracotta"], rating: 4.7, reviews: 267, badge: "Popular", inStock: true,
  },
  {
    id: 7, name: "CloudDry XL Sport Towel", category: "Gym Towels", price: 34.99,
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=800&fit=crop&q=80",
    description: "Extra-large sport towel with magnetic clip attachment.",
    longDescription: "Our XL Sport Towel is perfect for the gym floor, yoga, or outdoor workouts. Features a magnetic clip to attach to any equipment, a zippered pocket for your phone or keys, and the same recycled PET microfiber technology. Each towel repurposes 20 plastic bottles from ocean-bound waste streams.",
    materials: ["Recycled PET Microfiber", "Recycled Aluminum Clip", "YKK Recycled Zipper"],
    features: ["Extra-large (60×120cm)", "Magnetic equipment clip", "Zippered valuables pocket", "Quick-dry", "20 bottles recycled per towel"],
    colors: ["Charcoal", "Navy", "Olive"], rating: 4.5, reviews: 143, inStock: true,
  },
  {
    id: 8, name: "GripFlow Pilates Socks", category: "Pilates Socks", price: 18.99,
    image: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&h=800&fit=crop&q=80",
    description: "Non-slip pilates socks from organic bamboo fiber.",
    longDescription: "GripFlow Pilates Socks are crafted from organic bamboo fiber — naturally antibacterial, moisture-wicking, and incredibly soft against your skin. The natural rubber grip dots on the sole provide excellent traction on any studio surface. Seamless toe construction prevents irritation during long sessions.",
    materials: ["Organic Bamboo Fiber", "Natural Rubber Grips", "Organic Cotton Blend", "Natural Elastane"],
    features: ["Non-slip natural rubber grips", "Seamless toe design", "Moisture-wicking", "Naturally antibacterial", "Open-toe design", "One size fits most"],
    colors: ["Blush Pink", "Slate Gray", "Black"], rating: 4.9, reviews: 445, badge: "Top Rated", inStock: true,
  },
  {
    id: 9, name: "GripFlow Pro 3-Pack", category: "Pilates Socks", price: 44.99, originalPrice: 56.97,
    image: "https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=800&h=800&fit=crop&q=80",
    description: "Premium 3-pack with enhanced arch support and full grip.",
    longDescription: "The GripFlow Pro 3-Pack offers our premium pilates socks with enhanced arch support and full-sole grip coverage. Made with a higher percentage of organic bamboo for ultimate softness. Each pack includes three complementary colors in a reusable organic cotton pouch — beautiful enough to gift.",
    materials: ["Premium Organic Bamboo", "Natural Rubber Full-Sole Grips", "Organic Elastic", "Organic Cotton Pouch"],
    features: ["3 pairs included", "Enhanced arch support", "Full-sole grip coverage", "Extra cushioning", "Reusable cotton pouch", "Available in S/M/L"],
    colors: ["Earth Tones Set", "Neutral Set", "Bold Set"], rating: 4.8, reviews: 287, badge: "Value Pack", inStock: true,
  },
  {
    id: 10, name: "Voyager Gym Duffel", category: "Gym Bags", price: 109.99,
    image: "https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?w=800&h=800&fit=crop&q=80",
    description: "Premium duffel handcrafted from upcycled military canvas.",
    longDescription: "The Voyager is our premium gym duffel, handcrafted from upcycled military canvas and finished with vegetable-tanned leather accents. Each bag is unique due to the nature of upcycled materials — no two are alike. Features a wet/dry separator, expandable design, and comes with a lifetime warranty.",
    materials: ["Upcycled Military Canvas", "Vegetable-tanned Leather", "Recycled Brass Hardware", "Organic Cotton Lining"],
    features: ["Wet/dry separator", "Expandable design", "Leather accent details", "Solid brass hardware", "Lifetime warranty", "Each bag unique"],
    colors: ["Army Green", "Desert Tan", "Washed Black"], rating: 4.9, reviews: 98, badge: "Premium", inStock: true,
  },
  {
    id: 11, name: "Coastal Beach Tote", category: "Beach Bags", price: 44.99,
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=800&fit=crop&q=80",
    description: "Lightweight beach tote from organic jute and cotton.",
    longDescription: "The Coastal Beach Tote combines organic jute and fair-trade cotton in a beautiful, lightweight design perfect for beach days and beyond. Features waterproof lining made from recycled materials, an interior zip pocket for valuables, and hand-braided jute handles that are as comfortable as they are beautiful.",
    materials: ["Organic Jute", "Fair-trade Cotton", "Recycled Waterproof Lining", "Natural Plant Dyes"],
    features: ["Waterproof lining", "Interior zip pocket", "Hand-braided handles", "Reinforced bottom", "Foldable for storage"],
    colors: ["Natural/White", "Natural/Navy", "Natural/Terracotta"], rating: 4.6, reviews: 176, inStock: true,
  },
  {
    id: 12, name: "ActiveCool Towel Set", category: "Gym Towels", price: 39.99, originalPrice: 49.98,
    image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&h=800&fit=crop&q=80",
    description: "Set of 2 instant-cooling gym towels with UV protection.",
    longDescription: "The ActiveCool set includes two innovative cooling towels that activate with water. Made from recycled polyester fibers, simply wet, wring, and snap for instant cooling that lasts over 2 hours. Perfect for intense workouts, hot yoga, or outdoor exercise. Each set prevents 24 plastic bottles from reaching landfill.",
    materials: ["Recycled Polyester Cooling Fibers", "Plant-based Cooling Agents", "Recycled Mesh Carry Case"],
    features: ["Instant cooling technology", "Set of 2 towels", "UV protection UPF 50+", "Reusable mesh case", "Lasts 2+ hours cool", "Machine washable"],
    colors: ["Ice Blue/Gray", "Mint/White", "Coral/Peach"], rating: 4.7, reviews: 321, badge: "Bundle", inStock: true,
  },
];

const categories = ["All", "Gym Bags", "Pilates Bags", "Beach Bags", "Shaker Bottles", "Gym Towels", "Pilates Socks"];

// ─── Utility Components ─────────────────────────────────
const Stars = ({ rating, size = "sm" }: { rating: number; size?: string }) => (
  <div className={`flex gap-0.5 ${size === "lg" ? "text-lg" : "text-xs"}`}>
    {[1, 2, 3, 4, 5].map((s) => (
      <span key={s} className={s <= Math.round(rating) ? "text-amber-400" : "text-gray-600"}>★</span>
    ))}
  </div>
);

const ProductImage = ({ src, alt, className = "" }: { src: string; alt: string; className?: string }) => {
  const [error, setError] = useState(false);
  if (error) {
    return (
      <div className={`bg-gradient-to-br from-emerald-900/40 to-cyan-900/40 flex items-center justify-center ${className}`}>
        <span className="text-6xl opacity-50">🌿</span>
      </div>
    );
  }
  return <img src={src} alt={alt} className={`object-cover ${className}`} onError={() => setError(true)} loading="lazy" />;
};

// ─── Announcement Bar ───────────────────────────────────
const AnnouncementBar = () => (
  <div className="bg-gradient-to-r from-emerald-600 via-teal-500 to-cyan-500 animate-gradient-x text-white overflow-hidden">
    <div className="animate-marquee whitespace-nowrap py-2.5">
      <span className="inline-block mx-8 text-sm font-medium">🌿 Free carbon-neutral shipping on orders over $75</span>
      <span className="inline-block mx-8 text-sm font-medium">🌳 Every purchase plants a tree</span>
      <span className="inline-block mx-8 text-sm font-medium">♻️ Made from 100% sustainable materials</span>
      <span className="inline-block mx-8 text-sm font-medium">🌊 50,000+ ocean plastic bottles recycled</span>
      <span className="inline-block mx-8 text-sm font-medium">🌿 Free carbon-neutral shipping on orders over $75</span>
      <span className="inline-block mx-8 text-sm font-medium">🌳 Every purchase plants a tree</span>
      <span className="inline-block mx-8 text-sm font-medium">♻️ Made from 100% sustainable materials</span>
      <span className="inline-block mx-8 text-sm font-medium">🌊 50,000+ ocean plastic bottles recycled</span>
    </div>
  </div>
);

// ─── Header ─────────────────────────────────────────────
const Header = ({ currentPage, setCurrentPage, setSelectedProduct }: {
  currentPage: string; setCurrentPage: (p: string) => void; setSelectedProduct: (p: Product | null) => void;
}) => {
  const { cartCount } = useCart();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const nav = [
    { label: "Home", page: "home" }, { label: "Shop", page: "shop" },
    { label: "About", page: "about" }, { label: "Sustainability", page: "sustainability" },
    { label: "Contact", page: "contact" },
  ];

  return (
    <header className={`sticky top-0 z-50 transition-all duration-500 ${scrolled ? "bg-white/80 backdrop-blur-2xl shadow-lg shadow-black/5 border-b border-gray-200/50" : "bg-white/95 backdrop-blur-md"}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          <button className="lg:hidden p-2 rounded-xl hover:bg-gray-100 transition-colors" onClick={() => setOpen(!open)}>
            <div className="space-y-1.5">
              <span className={`block w-5 h-0.5 bg-gray-800 transition-all duration-300 ${open ? "rotate-45 translate-y-2" : ""}`} />
              <span className={`block w-5 h-0.5 bg-gray-800 transition-all duration-300 ${open ? "opacity-0" : ""}`} />
              <span className={`block w-5 h-0.5 bg-gray-800 transition-all duration-300 ${open ? "-rotate-45 -translate-y-2" : ""}`} />
            </div>
          </button>

          <button onClick={() => { setCurrentPage("home"); setSelectedProduct(null); }} className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-lg flex items-center justify-center text-white text-sm font-black group-hover:scale-110 transition-transform">M</div>
            <span className="text-xl font-black tracking-tight text-gray-900">mine<span className="text-gradient">croods</span></span>
          </button>

          <nav className="hidden lg:flex items-center gap-1">
            {nav.map((item) => (
              <button key={item.page} onClick={() => { setCurrentPage(item.page); setSelectedProduct(null); }}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${currentPage === item.page ? "bg-emerald-50 text-emerald-700" : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"}`}>
                {item.label}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <button className="hidden sm:flex w-10 h-10 items-center justify-center rounded-full hover:bg-gray-100 transition-colors text-gray-600 hover:text-gray-900">
              <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </button>
            <button className="hidden sm:flex w-10 h-10 items-center justify-center rounded-full hover:bg-gray-100 transition-colors text-gray-600 hover:text-gray-900">
              <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
            </button>
            <button onClick={() => setCurrentPage("cart")}
              className="relative w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors text-gray-600 hover:text-gray-900">
              <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse-glow">{cartCount}</span>
              )}
            </button>
          </div>
        </div>

        {open && (
          <div className="lg:hidden border-t border-gray-100 py-4 space-y-1 animate-fade-in-up">
            {nav.map((item) => (
              <button key={item.page} onClick={() => { setCurrentPage(item.page); setSelectedProduct(null); setOpen(false); }}
                className={`block w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all ${currentPage === item.page ? "bg-emerald-50 text-emerald-700" : "text-gray-600 hover:bg-gray-50"}`}>
                {item.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </header>
  );
};

// ─── Product Card ───────────────────────────────────────
const ProductCard = ({ product, onClick }: { product: Product; onClick: () => void }) => {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);
  return (
    <div className="group bg-white rounded-3xl overflow-hidden hover-lift cursor-pointer border border-gray-100" onClick={onClick}>
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        <ProductImage src={product.image} alt={product.name} className="w-full h-full img-zoom" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        {product.badge && (
          <span className="absolute top-4 left-4 px-3 py-1.5 bg-black/80 backdrop-blur-sm text-white text-[11px] font-bold uppercase tracking-wider rounded-full">{product.badge}</span>
        )}
        {product.originalPrice && (
          <span className="absolute top-4 right-4 px-3 py-1.5 bg-red-500 text-white text-[11px] font-bold rounded-full">-{Math.round((1 - product.price / product.originalPrice) * 100)}%</span>
        )}
        <button
          onClick={(e) => { e.stopPropagation(); addToCart(product, product.colors[0]); setAdded(true); setTimeout(() => setAdded(false), 1500); }}
          className={`absolute bottom-4 right-4 px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-500 ${added ? "bg-emerald-500 text-white scale-110" : "bg-white/90 backdrop-blur-sm text-gray-900 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 hover:bg-white"}`}>
          {added ? "✓ Added" : "Quick Add"}
        </button>
      </div>
      <div className="p-5">
        <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-emerald-600 mb-1.5">{product.category}</p>
        <h3 className="font-bold text-gray-900 mb-1.5 group-hover:text-emerald-700 transition-colors">{product.name}</h3>
        <p className="text-sm text-gray-500 line-clamp-2 mb-3 leading-relaxed">{product.description}</p>
        <div className="flex items-center gap-2 mb-3">
          <Stars rating={product.rating} />
          <span className="text-[11px] text-gray-400">({product.reviews})</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-lg font-black text-gray-900">${product.price}</span>
          {product.originalPrice && <span className="text-sm text-gray-400 line-through">${product.originalPrice}</span>}
        </div>
      </div>
    </div>
  );
};

// ─── Home Page ──────────────────────────────────────────
const HomePage = ({ setCurrentPage, setSelectedProduct }: { setCurrentPage: (p: string) => void; setSelectedProduct: (p: Product) => void }) => {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const featured = products.filter((p) => p.badge);

  return (
    <div>
      {/* ── Hero ── */}
      <section className="relative min-h-[90vh] flex items-center bg-[#0a0f0d] overflow-hidden">
        <div className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1920&h=1080&fit=crop&q=80" alt="" className="w-full h-full object-cover opacity-30" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0a0f0d] via-[#0a0f0d]/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f0d] via-transparent to-transparent" />
        </div>
        {/* Floating orbs */}
        <div className="absolute top-20 right-20 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-40 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl animate-float-reverse" />
        <div className="absolute top-40 left-[60%] w-4 h-4 bg-emerald-400 rounded-full animate-float opacity-60" />
        <div className="absolute top-60 left-[70%] w-2 h-2 bg-cyan-400 rounded-full animate-float-reverse opacity-40" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="max-w-3xl animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 glass rounded-full mb-8">
              <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
              <span className="text-emerald-300 text-sm font-medium">Sustainable Fitness Revolution</span>
            </div>
            <h1 className="text-5xl sm:text-6xl lg:text-8xl font-black text-white leading-[0.9] mb-6 tracking-tight">
              Sweat<br />
              <span className="text-gradient">Sustainably.</span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-400 mb-10 max-w-xl leading-relaxed">
              Premium fitness gear crafted from recycled ocean plastic, organic fibers, and plant-based materials. Perform better. Waste nothing.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button onClick={() => setCurrentPage("shop")}
                className="group px-8 py-4 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white rounded-full font-bold text-lg hover:shadow-xl hover:shadow-emerald-500/25 transition-all duration-500 hover:-translate-y-0.5">
                Shop Collection <span className="inline-block group-hover:translate-x-1 transition-transform">→</span>
              </button>
              <button onClick={() => setCurrentPage("sustainability")}
                className="px-8 py-4 glass text-white rounded-full font-semibold text-lg hover:bg-white/10 transition-all duration-300">
                Our Mission
              </button>
            </div>
            <div className="flex items-center gap-6 mt-12 pt-8 border-t border-white/10">
              {[{ n: "50K+", l: "Bottles Recycled" }, { n: "25K+", l: "Trees Planted" }, { n: "100%", l: "Carbon Neutral" }].map((s, i) => (
                <div key={i}>
                  <p className="text-2xl font-black text-white">{s.n}</p>
                  <p className="text-xs text-gray-500 font-medium">{s.l}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Trusted By ── */}
      <section className="bg-[#f8faf9] border-y border-gray-200/50 py-8">
        <div className="max-w-7xl mx-auto px-4 flex flex-wrap items-center justify-center gap-8 lg:gap-16 opacity-40">
          {["VOGUE", "GQ", "Forbes", "Elle", "Wired", "TechCrunch"].map((b) => (
            <span key={b} className="text-lg lg:text-xl font-black tracking-widest text-gray-900">{b}</span>
          ))}
        </div>
      </section>

      {/* ── Categories ── */}
      <section className="py-20 lg:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-600 mb-3">Collections</p>
            <h2 className="text-4xl lg:text-5xl font-black text-gray-900">Shop by Category</h2>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
            {[
              { name: "Gym Bags", img: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&h=400&fit=crop&q=80", count: 2 },
              { name: "Pilates Bags", img: "https://images.unsplash.com/photo-1544816155-12df9643f363?w=600&h=400&fit=crop&q=80", count: 1 },
              { name: "Beach Bags", img: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&h=400&fit=crop&q=80", count: 2 },
              { name: "Shaker Bottles", img: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=600&h=400&fit=crop&q=80", count: 2 },
              { name: "Gym Towels", img: "https://images.unsplash.com/photo-1600881333168-2ef49b341f30?w=600&h=400&fit=crop&q=80", count: 3 },
              { name: "Pilates Socks", img: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=600&h=400&fit=crop&q=80", count: 2 },
            ].map((cat) => (
              <button key={cat.name} onClick={() => setCurrentPage("shop")}
                className="group relative aspect-[4/3] rounded-2xl lg:rounded-3xl overflow-hidden hover-lift">
                <ProductImage src={cat.img} alt={cat.name} className="w-full h-full img-zoom" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4 lg:p-6">
                  <h3 className="text-white font-bold text-lg lg:text-xl">{cat.name}</h3>
                  <p className="text-white/60 text-sm">{cat.count} products</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured Products ── */}
      <section className="py-20 lg:py-28 bg-[#f8faf9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-12 gap-4">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-600 mb-3">Curated</p>
              <h2 className="text-4xl lg:text-5xl font-black text-gray-900">Featured Products</h2>
            </div>
            <button onClick={() => setCurrentPage("shop")} className="text-emerald-600 font-semibold hover:text-emerald-700 transition-colors group">
              View All <span className="inline-block group-hover:translate-x-1 transition-transform">→</span>
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featured.slice(0, 4).map((p) => (
              <ProductCard key={p.id} product={p} onClick={() => { setSelectedProduct(p); setCurrentPage("product"); }} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Mission Banner ── */}
      <section className="relative py-24 lg:py-32 overflow-hidden">
        <div className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1920&h=800&fit=crop&q=80" alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/60" />
        </div>
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl lg:text-6xl font-black text-white mb-6 leading-tight">
            Every Product Has a <span className="text-gradient">Purpose</span>
          </h2>
          <p className="text-lg text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed">
            From ocean plastic recovery to tree planting, every Minecroods product contributes to a measurable environmental impact. This isn't greenwashing — it's our entire business model.
          </p>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: "🌊", n: "50K+", l: "Ocean Bottles" }, { icon: "🌳", n: "25K+", l: "Trees Planted" },
              { icon: "📦", n: "100%", l: "Carbon Neutral" }, { icon: "♻️", n: "Zero", l: "Landfill Waste" },
            ].map((s, i) => (
              <div key={i} className="glass rounded-2xl p-6 text-center">
                <span className="text-3xl block mb-2">{s.icon}</span>
                <p className="text-2xl font-black text-white">{s.n}</p>
                <p className="text-xs text-gray-400 mt-1">{s.l}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Why Minecroods ── */}
      <section className="py-20 lg:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-600 mb-3">Why Us</p>
            <h2 className="text-4xl lg:text-5xl font-black text-gray-900">The Minecroods Difference</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: "🌊", title: "Ocean Positive", desc: "Every product removes plastic from our oceans. We partner with 12 coastal communities across the globe to collect and transform ocean waste." },
              { icon: "🧬", title: "Bio-Innovation", desc: "Our R&D team develops plant-based alternatives to conventional plastics. From sugarcane bioplastic to bamboo fiber — nature-powered performance." },
              { icon: "🤝", title: "Radically Fair", desc: "Fair Trade certified across our entire supply chain. Living wages, safe conditions, and community investment — for every single worker." },
            ].map((item, i) => (
              <div key={i} className="group p-8 rounded-3xl border border-gray-100 hover:border-emerald-200 hover-lift bg-white text-center">
                <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-emerald-50 to-cyan-50 rounded-2xl flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">{item.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                <p className="text-gray-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="py-20 lg:py-28 bg-[#0a0f0d] text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-16">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-400 mb-3">Community</p>
            <h2 className="text-4xl lg:text-5xl font-black">What People Say</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { name: "Sarah K.", role: "Yoga Instructor", text: "The GripFlow socks are the best I've ever worn. The grip is incredible and they're so soft. My students constantly ask where I got them.", img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&q=80" },
              { name: "Marcus T.", role: "CrossFit Athlete", text: "Was skeptical about a 'sustainable' gym bag being tough enough. The EcoFlex has survived 8 months of daily abuse. Better than any big brand bag I've owned.", img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&q=80" },
              { name: "Priya M.", role: "Pilates Studio Owner", text: "We switched our entire studio to Minecroods products. Our clients love them, and it aligns perfectly with our wellness-focused brand values.", img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&q=80" },
            ].map((r, i) => (
              <div key={i} className="glass rounded-3xl p-8 hover-lift">
                <div className="flex gap-1 mb-4">{[1,2,3,4,5].map(s => <span key={s} className="text-amber-400 text-sm">★</span>)}</div>
                <p className="text-gray-300 leading-relaxed mb-6 italic">"{r.text}"</p>
                <div className="flex items-center gap-3">
                  <img src={r.img} alt={r.name} className="w-10 h-10 rounded-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                  <div>
                    <p className="font-semibold text-white text-sm">{r.name}</p>
                    <p className="text-emerald-400 text-xs">{r.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Newsletter ── */}
      <section className="py-20 lg:py-28 bg-gradient-to-br from-emerald-50 via-white to-cyan-50">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-2xl flex items-center justify-center text-white text-2xl animate-float">📧</div>
          <h2 className="text-3xl lg:text-4xl font-black text-gray-900 mb-4">Join the Movement</h2>
          <p className="text-gray-500 mb-8">Get 10% off your first order, plus sustainability tips and early access to drops.</p>
          {subscribed ? (
            <div className="bg-emerald-100 text-emerald-800 rounded-2xl p-6 font-medium">✅ Welcome to the Minecroods family! Check your inbox for your code.</div>
          ) : (
            <div className="flex flex-col sm:flex-row gap-3">
              <input type="email" placeholder="your@email.com" value={email} onChange={(e) => setEmail(e.target.value)}
                className="flex-1 px-6 py-4 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white text-gray-900" />
              <button onClick={() => { if (email) setSubscribed(true); }}
                className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white rounded-full font-bold hover:shadow-lg hover:shadow-emerald-500/25 transition-all whitespace-nowrap">
                Subscribe
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ── Instagram ── */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 text-center mb-8">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-600 mb-2">@minecroods</p>
          <h2 className="text-2xl font-black text-gray-900">Follow the Journey</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 max-w-7xl mx-auto px-4">
          {[
            "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400&h=400&fit=crop&q=80",
            "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400&h=400&fit=crop&q=80",
            "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=400&fit=crop&q=80",
            "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=400&fit=crop&q=80",
          ].map((img, i) => (
            <div key={i} className="group relative aspect-square rounded-2xl overflow-hidden cursor-pointer">
              <ProductImage src={img} alt="" className="w-full h-full img-zoom" />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                <span className="text-white text-2xl opacity-0 group-hover:opacity-100 transition-opacity">♡</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

// ─── Shop Page ──────────────────────────────────────────
const ShopPage = ({ setCurrentPage, setSelectedProduct }: { setCurrentPage: (p: string) => void; setSelectedProduct: (p: Product) => void }) => {
  const [cat, setCat] = useState("All");
  const [sort, setSort] = useState("featured");
  const [search, setSearch] = useState("");

  let filtered = cat === "All" ? products : products.filter((p) => p.category === cat);
  if (search) filtered = filtered.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()) || p.description.toLowerCase().includes(search.toLowerCase()));
  if (sort === "price-low") filtered = [...filtered].sort((a, b) => a.price - b.price);
  if (sort === "price-high") filtered = [...filtered].sort((a, b) => b.price - a.price);
  if (sort === "rating") filtered = [...filtered].sort((a, b) => b.rating - a.rating);

  return (
    <div className="min-h-screen bg-[#f8faf9]">
      {/* Hero */}
      <div className="relative bg-[#0a0f0d] text-white py-16 lg:py-24 overflow-hidden">
        <div className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1920&h=600&fit=crop&q=80" alt="" className="w-full h-full object-cover opacity-20" />
        </div>
        <div className="absolute top-10 right-20 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl animate-float" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-400 mb-3">Collection</p>
          <h1 className="text-4xl lg:text-6xl font-black mb-4">Shop All Products</h1>
          <p className="text-gray-400 text-lg max-w-xl">Sustainable fitness gear that performs as good as it feels. Every item, every material — planet-first.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="flex flex-col lg:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            <input type="text" placeholder="Search products..." value={search} onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white" />
          </div>
          <select value={sort} onChange={(e) => setSort(e.target.value)}
            className="px-5 py-3.5 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white font-medium text-sm">
            <option value="featured">Featured</option>
            <option value="price-low">Price: Low → High</option>
            <option value="price-high">Price: High → Low</option>
            <option value="rating">Highest Rated</option>
          </select>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map((c) => (
            <button key={c} onClick={() => setCat(c)}
              className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${cat === c ? "bg-gradient-to-r from-emerald-500 to-cyan-500 text-white shadow-lg shadow-emerald-500/25" : "bg-white text-gray-600 border border-gray-200 hover:border-emerald-300 hover:text-emerald-600"}`}>
              {c}
            </button>
          ))}
        </div>

        <p className="text-sm text-gray-400 mb-6 font-medium">{filtered.length} product{filtered.length !== 1 ? "s" : ""}</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map((p) => (
            <ProductCard key={p.id} product={p} onClick={() => { setSelectedProduct(p); setCurrentPage("product"); }} />
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-24">
            <span className="text-6xl block mb-4 opacity-30">🔍</span>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-500">Try adjusting your search or filters.</p>
          </div>
        )}
      </div>
    </div>
  );
};

// ─── Product Detail Page ────────────────────────────────
const ProductPage = ({ product, setCurrentPage, setSelectedProduct }: {
  product: Product; setCurrentPage: (p: string) => void; setSelectedProduct: (p: Product) => void;
}) => {
  const { addToCart } = useCart();
  const [color, setColor] = useState(product.colors[0]);
  const [qty, setQty] = useState(1);
  const [tab, setTab] = useState("description");
  const [added, setAdded] = useState(false);
  const related = products.filter((p) => p.category === product.category && p.id !== product.id);

  const handleAdd = () => { for (let i = 0; i < qty; i++) addToCart(product, color); setAdded(true); setTimeout(() => setAdded(false), 2000); };

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <button onClick={() => setCurrentPage("home")} className="hover:text-emerald-600 transition-colors">Home</button>
          <span>/</span>
          <button onClick={() => setCurrentPage("shop")} className="hover:text-emerald-600 transition-colors">Shop</button>
          <span>/</span>
          <span className="text-gray-900 font-medium">{product.name}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 lg:py-8">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16">
          {/* Image */}
          <div className="relative aspect-square rounded-3xl overflow-hidden bg-gray-100">
            <ProductImage src={product.image} alt={product.name} className="w-full h-full" />
            {product.badge && (
              <span className="absolute top-6 left-6 px-4 py-2 bg-black/80 backdrop-blur-sm text-white text-xs font-bold uppercase tracking-wider rounded-full">{product.badge}</span>
            )}
          </div>

          {/* Info */}
          <div className="space-y-6 lg:py-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-600 mb-2">{product.category}</p>
              <h1 className="text-3xl lg:text-4xl font-black text-gray-900 mb-3">{product.name}</h1>
              <div className="flex items-center gap-3">
                <Stars rating={product.rating} size="lg" />
                <span className="text-sm text-gray-400">({product.reviews} reviews)</span>
              </div>
            </div>

            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-black text-gray-900">${product.price}</span>
              {product.originalPrice && (
                <>
                  <span className="text-xl text-gray-300 line-through">${product.originalPrice}</span>
                  <span className="text-sm font-bold text-red-500 bg-red-50 px-3 py-1 rounded-full">Save ${(product.originalPrice - product.price).toFixed(2)}</span>
                </>
              )}
            </div>

            <p className="text-gray-500 text-lg leading-relaxed">{product.description}</p>

            {/* Colors */}
            <div>
              <p className="font-bold text-gray-900 mb-3 text-sm">Color — <span className="font-normal text-gray-500">{color}</span></p>
              <div className="flex gap-2">
                {product.colors.map((c) => (
                  <button key={c} onClick={() => setColor(c)}
                    className={`px-4 py-2 rounded-full text-sm transition-all duration-300 ${color === c ? "bg-gray-900 text-white font-semibold" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>{c}</button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div>
              <p className="font-bold text-gray-900 mb-3 text-sm">Quantity</p>
              <div className="inline-flex items-center gap-0 bg-gray-100 rounded-full">
                <button onClick={() => setQty(Math.max(1, qty - 1))} className="w-12 h-12 flex items-center justify-center text-gray-600 hover:text-gray-900 text-lg font-medium">−</button>
                <span className="w-12 text-center font-bold text-gray-900">{qty}</span>
                <button onClick={() => setQty(qty + 1)} className="w-12 h-12 flex items-center justify-center text-gray-600 hover:text-gray-900 text-lg font-medium">+</button>
              </div>
            </div>

            {/* Add to Cart */}
            <div className="flex gap-3 pt-2">
              <button onClick={handleAdd}
                className={`flex-1 py-4 rounded-full font-bold text-lg transition-all duration-500 ${added ? "bg-emerald-500 text-white scale-[1.02]" : "bg-gradient-to-r from-emerald-500 to-cyan-500 text-white hover:shadow-xl hover:shadow-emerald-500/25 hover:-translate-y-0.5"}`}>
                {added ? "✓ Added to Cart!" : `Add to Cart — $${(product.price * qty).toFixed(2)}`}
              </button>
              <button className="w-14 h-14 rounded-full border-2 border-gray-200 flex items-center justify-center hover:border-red-300 hover:text-red-500 transition-colors text-gray-400">♡</button>
            </div>

            {/* Trust */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-gray-100">
              {[{ icon: "🚚", t: "Free Shipping $75+" }, { icon: "↩️", t: "30-Day Returns" }, { icon: "🌿", t: "Eco Certified" }].map((b, i) => (
                <div key={i} className="text-center p-3 bg-gray-50 rounded-2xl">
                  <span className="text-xl block mb-1">{b.icon}</span>
                  <p className="text-[11px] text-gray-500 font-medium">{b.t}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-16 lg:mt-24">
          <div className="flex gap-0 border-b border-gray-200">
            {["description", "materials", "features", "reviews"].map((t) => (
              <button key={t} onClick={() => setTab(t)}
                className={`px-6 py-4 text-sm font-semibold capitalize transition-all relative ${tab === t ? "text-emerald-600" : "text-gray-400 hover:text-gray-600"}`}>
                {t}
                {tab === t && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full" />}
              </button>
            ))}
          </div>
          <div className="py-8 max-w-3xl">
            {tab === "description" && <p className="text-gray-600 leading-relaxed text-lg">{product.longDescription}</p>}
            {tab === "materials" && (
              <ul className="space-y-4">{product.materials.map((m, i) => (
                <li key={i} className="flex items-center gap-3"><span className="w-2 h-2 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full" /><span className="text-gray-600">{m}</span></li>
              ))}</ul>
            )}
            {tab === "features" && (
              <ul className="space-y-4">{product.features.map((f, i) => (
                <li key={i} className="flex items-center gap-3"><span className="text-emerald-500 font-bold">✓</span><span className="text-gray-600">{f}</span></li>
              ))}</ul>
            )}
            {tab === "reviews" && (
              <div className="space-y-6">
                {[
                  { name: "Alex R.", date: "2 weeks ago", r: 5, text: "Absolutely love this product! The quality is amazing and knowing it's sustainable makes it even better." },
                  { name: "Jordan L.", date: "1 month ago", r: 5, text: "Exceeded my expectations. The materials feel premium and it's held up great through daily use." },
                  { name: "Casey W.", date: "2 months ago", r: 4, text: "Great product overall. Love the sustainable approach. Would love more color options!" },
                ].map((rev, i) => (
                  <div key={i} className="border-b border-gray-100 pb-6">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-emerald-100 to-cyan-100 rounded-full flex items-center justify-center font-bold text-emerald-600">{rev.name[0]}</div>
                        <div><p className="font-semibold text-gray-900 text-sm">{rev.name}</p><p className="text-xs text-gray-400">{rev.date}</p></div>
                      </div>
                      <Stars rating={rev.r} />
                    </div>
                    <p className="text-gray-600">{rev.text}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <div className="mt-16 lg:mt-24 pb-8">
            <h2 className="text-2xl font-black text-gray-900 mb-8">You Might Also Like</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} onClick={() => { setSelectedProduct(p); window.scrollTo(0, 0); }} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// ─── Cart Page ──────────────────────────────────────────
const CartPage = ({ setCurrentPage }: { setCurrentPage: (p: string) => void }) => {
  const { cart, removeFromCart, updateQuantity, cartTotal, clearCart } = useCart();
  const [checkout, setCheckout] = useState(false);
  const [ordered, setOrdered] = useState(false);
  const shipping = cartTotal >= 75 ? 0 : 9.99;
  const tax = cartTotal * 0.08;

  if (ordered) return (
    <div className="min-h-screen bg-[#f8faf9] flex items-center justify-center">
      <div className="text-center max-w-lg mx-auto px-4 animate-fade-in-up">
        <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-full flex items-center justify-center text-white text-3xl">✓</div>
        <h1 className="text-3xl font-black text-gray-900 mb-3">Order Confirmed!</h1>
        <p className="text-gray-500 mb-2">Thank you for shopping sustainably.</p>
        <p className="text-emerald-600 font-semibold mb-8">🌳 A tree has been planted in your name!</p>
        <div className="bg-white rounded-2xl p-6 mb-8 text-left border border-gray-100">
          <p className="text-xs text-gray-400 font-medium mb-1">Order Number</p>
          <p className="font-black text-gray-900 mb-3">#MC-{Math.random().toString(36).substring(2, 10).toUpperCase()}</p>
          <p className="text-sm text-gray-500">Confirmation email sent. Arriving in 3-5 business days via carbon-neutral shipping.</p>
        </div>
        <button onClick={() => { setCurrentPage("shop"); setOrdered(false); }}
          className="px-8 py-3 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white rounded-full font-bold hover:shadow-lg hover:shadow-emerald-500/25 transition-all">
          Continue Shopping
        </button>
      </div>
    </div>
  );

  if (cart.length === 0) return (
    <div className="min-h-screen bg-[#f8faf9] flex items-center justify-center">
      <div className="text-center px-4 animate-fade-in-up">
        <div className="w-20 h-20 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center text-3xl">🛒</div>
        <h1 className="text-3xl font-black text-gray-900 mb-3">Your Cart is Empty</h1>
        <p className="text-gray-500 mb-8">Time to add some sustainable goodies!</p>
        <button onClick={() => setCurrentPage("shop")}
          className="px-8 py-3 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white rounded-full font-bold hover:shadow-lg hover:shadow-emerald-500/25 transition-all">
          Start Shopping →
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f8faf9]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <h1 className="text-3xl font-black text-gray-900 mb-8">Shopping Cart <span className="text-gray-400 font-medium text-lg">({cart.length})</span></h1>
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item) => (
              <div key={item.product.id} className="bg-white rounded-2xl p-4 sm:p-6 flex gap-4 sm:gap-6 items-center border border-gray-100 hover-lift">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100">
                  <ProductImage src={item.product.image} alt={item.product.name} className="w-full h-full" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-gray-900 text-sm sm:text-base">{item.product.name}</h3>
                  <p className="text-xs text-gray-400 mt-0.5">{item.color}</p>
                  <p className="text-emerald-600 font-bold mt-1">${item.product.price}</p>
                </div>
                <div className="flex items-center gap-2 bg-gray-100 rounded-full">
                  <button onClick={() => updateQuantity(item.product.id, item.quantity - 1)} className="w-8 h-8 flex items-center justify-center text-gray-600 hover:text-gray-900">−</button>
                  <span className="w-6 text-center font-bold text-sm">{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.product.id, item.quantity + 1)} className="w-8 h-8 flex items-center justify-center text-gray-600 hover:text-gray-900">+</button>
                </div>
                <div className="text-right hidden sm:block">
                  <p className="font-black text-gray-900">${(item.product.price * item.quantity).toFixed(2)}</p>
                  <button onClick={() => removeFromCart(item.product.id)} className="text-xs text-gray-400 hover:text-red-500 mt-1 transition-colors">Remove</button>
                </div>
              </div>
            ))}
            <button onClick={clearCart} className="text-xs text-gray-400 hover:text-red-500 transition-colors font-medium">Clear all items</button>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl p-6 lg:p-8 border border-gray-100 sticky top-24">
              <h2 className="text-lg font-black text-gray-900 mb-6">Order Summary</h2>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between"><span className="text-gray-500">Subtotal</span><span className="font-semibold">${cartTotal.toFixed(2)}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Shipping</span><span className={`font-semibold ${shipping === 0 ? "text-emerald-600" : ""}`}>{shipping === 0 ? "FREE" : `$${shipping.toFixed(2)}`}</span></div>
                {shipping > 0 && <p className="text-xs text-emerald-600 bg-emerald-50 p-2 rounded-lg">Add ${(75 - cartTotal).toFixed(2)} more for free shipping!</p>}
                <div className="flex justify-between"><span className="text-gray-500">Tax</span><span className="font-semibold">${tax.toFixed(2)}</span></div>
                <div className="border-t border-gray-100 pt-3 flex justify-between"><span className="font-black text-gray-900 text-lg">Total</span><span className="font-black text-gray-900 text-lg">${(cartTotal + shipping + tax).toFixed(2)}</span></div>
              </div>
              <div className="mt-4 p-3 bg-emerald-50 rounded-xl text-sm text-emerald-700 flex items-center gap-2 font-medium">
                <span>🌳</span> This order plants {cart.reduce((s, i) => s + i.quantity, 0)} tree{cart.reduce((s, i) => s + i.quantity, 0) > 1 ? "s" : ""}!
              </div>
              {!checkout ? (
                <button onClick={() => setCheckout(true)}
                  className="w-full mt-6 py-4 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white rounded-full font-bold text-lg hover:shadow-xl hover:shadow-emerald-500/25 transition-all">
                  Checkout
                </button>
              ) : (
                <div className="mt-6 space-y-3 animate-fade-in-up">
                  <input type="email" placeholder="Email" className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                  <input type="text" placeholder="Full name" className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                  <input type="text" placeholder="Address" className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                  <div className="grid grid-cols-2 gap-3">
                    <input type="text" placeholder="City" className="px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                    <input type="text" placeholder="ZIP" className="px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                  </div>
                  <input type="text" placeholder="Card number" className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                  <div className="grid grid-cols-2 gap-3">
                    <input type="text" placeholder="MM/YY" className="px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                    <input type="text" placeholder="CVC" className="px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                  </div>
                  <button onClick={() => { setOrdered(true); clearCart(); }}
                    className="w-full py-4 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white rounded-full font-bold hover:shadow-xl hover:shadow-emerald-500/25 transition-all">
                    Place Order — ${(cartTotal + shipping + tax).toFixed(2)}
                  </button>
                </div>
              )}
              <p className="text-center text-[11px] text-gray-400 mt-4">🔒 256-bit SSL Encrypted · Secure Checkout</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── About Page ─────────────────────────────────────────
const AboutPage = () => (
  <div className="min-h-screen">
    {/* Hero */}
    <section className="relative py-24 lg:py-36 bg-[#0a0f0d] text-white overflow-hidden">
      <div className="absolute inset-0">
        <img src="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1920&h=1080&fit=crop&q=80" alt="" className="w-full h-full object-cover opacity-25" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f0d] via-[#0a0f0d]/60 to-transparent" />
      </div>
      <div className="relative max-w-4xl mx-auto px-4 text-center">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-400 mb-4">Our Story</p>
        <h1 className="text-4xl lg:text-7xl font-black mb-6 leading-tight">Built for the Planet,<br /><span className="text-gradient">Designed for You.</span></h1>
        <p className="text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">Born from a belief that your fitness journey shouldn't cost the earth.</p>
      </div>
    </section>

    {/* Story */}
    <section className="py-20 lg:py-28">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center mb-24">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-600 mb-4">Founded 2021</p>
            <h2 className="text-3xl lg:text-4xl font-black text-gray-900 mb-6">How It Started</h2>
            <p className="text-gray-500 leading-relaxed mb-4">Minecroods was founded by a group of fitness enthusiasts who saw the irony: an industry focused on health was creating massive environmental waste.</p>
            <p className="text-gray-500 leading-relaxed">From single-use plastic bottles to synthetic gear destined for landfill, we knew there had to be a better way. So we built it.</p>
          </div>
          <div className="aspect-[4/3] rounded-3xl overflow-hidden">
            <img src="https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&h=600&fit=crop&q=80" alt="Nature" className="w-full h-full object-cover" />
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div className="aspect-[4/3] rounded-3xl overflow-hidden order-2 md:order-1">
            <img src="https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=800&h=600&fit=crop&q=80" alt="Ocean" className="w-full h-full object-cover" />
          </div>
          <div className="order-1 md:order-2">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-600 mb-4">Our Mission</p>
            <h2 className="text-3xl lg:text-4xl font-black text-gray-900 mb-6">Performance Meets Purpose</h2>
            <p className="text-gray-500 leading-relaxed mb-4">We prove daily that sustainability and performance aren't trade-offs — they're multipliers.</p>
            <p className="text-gray-500 leading-relaxed">By partnering with ocean cleanup crews, fair-trade cooperatives, and material scientists, we create products you're proud to own.</p>
          </div>
        </div>
      </div>
    </section>

    {/* Values */}
    <section className="py-20 lg:py-28 bg-[#f8faf9]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-600 mb-3">Values</p>
          <h2 className="text-4xl lg:text-5xl font-black text-gray-900">What We Stand For</h2>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: "🌊", title: "Ocean First", desc: "Active ocean plastic removal programs across 12 countries." },
            { icon: "🔬", title: "Transparency", desc: "Full supply chain visibility. Track every material's origin." },
            { icon: "💪", title: "No Compromise", desc: "Sustainable doesn't mean subpar. Our gear outperforms." },
            { icon: "❤️", title: "Community", desc: "Our 15K+ community shapes every product decision." },
          ].map((v, i) => (
            <div key={i} className="bg-white rounded-3xl p-8 text-center hover-lift border border-gray-100">
              <span className="text-4xl block mb-4">{v.icon}</span>
              <h3 className="text-lg font-bold text-gray-900 mb-2">{v.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{v.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* Team */}
    <section className="py-20 lg:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-600 mb-3">People</p>
          <h2 className="text-4xl lg:text-5xl font-black text-gray-900">Meet the Team</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { name: "Emma Chen", role: "Founder & CEO", img: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop&q=80", bio: "Former marine biologist. Emma's passion for ocean conservation drives everything we do." },
            { name: "Raj Patel", role: "Head of Sustainability", img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&q=80", bio: "Materials scientist with 15 years in sustainable textiles. Ensures every product meets our eco standards." },
            { name: "Sofia Martinez", role: "Creative Director", img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop&q=80", bio: "Award-winning designer who believes beauty and sustainability are inseparable." },
          ].map((m, i) => (
            <div key={i} className="text-center group">
              <div className="w-40 h-40 mx-auto mb-6 rounded-full overflow-hidden border-4 border-gray-100 group-hover:border-emerald-200 transition-colors">
                <img src={m.img} alt={m.name} className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).src = ''; }} />
              </div>
              <h3 className="text-xl font-bold text-gray-900">{m.name}</h3>
              <p className="text-emerald-600 font-medium text-sm mb-3">{m.role}</p>
              <p className="text-gray-500 text-sm max-w-xs mx-auto">{m.bio}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* Certifications */}
    <section className="py-16 bg-[#0a0f0d] text-white">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-400 mb-6">Certified & Trusted</p>
        <div className="flex flex-wrap justify-center gap-4">
          {["🏅 B Corp", "♻️ Climate Neutral", "🌿 GOTS Organic", "🤝 Fair Trade", "🌊 Ocean Positive", "🐰 Cruelty Free"].map((c, i) => (
            <span key={i} className="glass px-5 py-2.5 rounded-full text-sm font-medium">{c}</span>
          ))}
        </div>
      </div>
    </section>
  </div>
);

// ─── Sustainability Page ────────────────────────────────
const SustainabilityPage = () => (
  <div className="min-h-screen">
    {/* Hero */}
    <section className="relative py-24 lg:py-36 bg-[#0a0f0d] text-white overflow-hidden">
      <div className="absolute inset-0">
        <img src="https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=1920&h=1080&fit=crop&q=80" alt="" className="w-full h-full object-cover opacity-25" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f0d] via-[#0a0f0d]/50 to-transparent" />
      </div>
      <div className="absolute top-20 right-20 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl animate-float" />
      <div className="relative max-w-4xl mx-auto px-4 text-center">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-400 mb-4">Sustainability</p>
        <h1 className="text-4xl lg:text-7xl font-black mb-6">Every Decision.<br /><span className="text-gradient">Planet First.</span></h1>
        <p className="text-lg text-gray-400 max-w-2xl mx-auto">Every product, every partner, every package — filtered through one question: Is this good for the Earth?</p>
      </div>
    </section>

    {/* Pillars */}
    <section className="py-20 lg:py-28">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-600 mb-3">Framework</p>
          <h2 className="text-4xl lg:text-5xl font-black text-gray-900">5 Sustainability Pillars</h2>
        </div>
        <div className="space-y-8">
          {[
            { n: "01", icon: "🌊", title: "Ocean Plastic Recovery", desc: "We partner with coastal organizations in 12 countries to collect ocean-bound plastic. This plastic is cleaned, processed, and woven into our bags and towels. 50,000+ bottles recovered.", tag: "50,000+ bottles" },
            { n: "02", icon: "🌱", title: "Plant-Based Innovation", desc: "From sugarcane bioplastic shakers to organic bamboo socks, we prioritize renewable materials. Our R&D team continuously explores new plant-based alternatives.", tag: "85% plant-based" },
            { n: "03", icon: "♻️", title: "Circular Design", desc: "Every product designed with end-of-life in mind. Compostable shakers, recyclable bags, and our take-back program gives worn products new life.", tag: "100% recyclable" },
            { n: "04", icon: "📦", title: "Carbon Neutral Ops", desc: "Solar-powered warehouse, electric delivery vehicles, recycled packaging with soy-based inks. Every aspect of our operations is carbon neutral.", tag: "Net zero since 2022" },
            { n: "05", icon: "🤝", title: "Fair & Ethical", desc: "Living wages, safe conditions, community investment. We prioritize women-owned cooperatives and marginalized communities.", tag: "100% fair trade" },
          ].map((p, i) => (
            <div key={i} className="group bg-white rounded-3xl p-8 lg:p-10 border border-gray-100 hover:border-emerald-200 hover-lift flex flex-col md:flex-row gap-6 items-start">
              <div className="flex items-center gap-4 md:w-48 flex-shrink-0">
                <span className="text-4xl font-black text-gradient">{p.n}</span>
                <span className="text-3xl">{p.icon}</span>
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{p.title}</h3>
                <p className="text-gray-500 leading-relaxed mb-3">{p.desc}</p>
                <span className="inline-block bg-emerald-50 text-emerald-700 px-4 py-1.5 rounded-full text-sm font-semibold">{p.tag}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* Impact Numbers */}
    <section className="py-20 lg:py-28 bg-[#0a0f0d] text-white relative overflow-hidden">
      <div className="absolute inset-0 animate-shimmer opacity-30" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-400 mb-3">Impact</p>
          <h2 className="text-4xl lg:text-5xl font-black">Numbers Don't Lie</h2>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { n: "50K+", l: "Bottles Recycled", icon: "🌊" }, { n: "25K+", l: "Trees Planted", icon: "🌳" },
            { n: "500+", l: "Tons CO₂ Offset", icon: "💨" }, { n: "100%", l: "Renewable Energy", icon: "⚡" },
            { n: "12", l: "Cleanup Partners", icon: "🏖️" }, { n: "35+", l: "Countries Served", icon: "🌍" },
            { n: "Zero", l: "Landfill Waste Goal", icon: "🎯" }, { n: "15K+", l: "Community Members", icon: "❤️" },
          ].map((s, i) => (
            <div key={i} className="glass rounded-2xl p-6 text-center hover-lift">
              <span className="text-3xl block mb-3">{s.icon}</span>
              <p className="text-2xl lg:text-3xl font-black">{s.n}</p>
              <p className="text-xs text-gray-400 mt-1 font-medium">{s.l}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* Materials */}
    <section className="py-20 lg:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-600 mb-3">Materials</p>
          <h2 className="text-4xl lg:text-5xl font-black text-gray-900">What We're Made Of</h2>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { icon: "🌊", name: "Recycled Ocean Plastic", desc: "Collected from coastlines and transformed into durable yarn." },
            { icon: "🎋", name: "Organic Bamboo", desc: "Grown without pesticides, naturally antibacterial and incredibly soft." },
            { icon: "🌿", name: "Plant-based Bioplastic", desc: "Derived from sugarcane, 100% compostable at end of life." },
            { icon: "🌾", name: "Organic Hemp", desc: "One of Earth's most sustainable crops, used in our pilates bags." },
            { icon: "🐟", name: "Recycled Fishing Nets", desc: "Ghost nets recovered from oceans, woven into beach bags." },
            { icon: "♻️", name: "Upcycled Canvas", desc: "Surplus military canvas given new life in our premium duffels." },
          ].map((m, i) => (
            <div key={i} className="bg-[#f8faf9] rounded-3xl p-8 hover:bg-emerald-50 transition-colors border border-gray-100 hover-lift">
              <span className="text-3xl block mb-4">{m.icon}</span>
              <h3 className="font-bold text-gray-900 mb-2">{m.name}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{m.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* 2030 Pledge */}
    <section className="py-20 lg:py-28 bg-gradient-to-br from-emerald-50 via-white to-cyan-50">
      <div className="max-w-3xl mx-auto px-4 text-center">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-600 mb-3">2030 Pledge</p>
        <h2 className="text-4xl lg:text-5xl font-black text-gray-900 mb-10">Our Commitment</h2>
        <div className="space-y-4 text-left">
          {[
            "Remove 1 million plastic bottles from our oceans",
            "Plant 500,000 trees worldwide",
            "Achieve 100% circular product lifecycle",
            "Carbon negative operations",
            "Zero waste to landfill across all operations",
            "Transition to 100% regenerative materials",
          ].map((p, i) => (
            <div key={i} className="flex items-center gap-4 bg-white rounded-2xl p-5 border border-gray-100 hover-lift">
              <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0">✓</div>
              <span className="text-gray-700 font-medium">{p}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  </div>
);

// ─── Contact Page ───────────────────────────────────────
const ContactPage = () => {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [sent, setSent] = useState(false);

  return (
    <div className="min-h-screen">
      <section className="relative py-16 lg:py-24 bg-[#0a0f0d] text-white overflow-hidden">
        <div className="absolute top-10 right-20 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl animate-float" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-400 mb-3">Contact</p>
          <h1 className="text-4xl lg:text-6xl font-black mb-4">Let's Talk</h1>
          <p className="text-gray-400 text-lg">Questions, feedback, or partnership ideas — we're all ears.</p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
        <div className="grid lg:grid-cols-3 gap-12">
          <div className="lg:col-span-1 space-y-8">
            <div className="space-y-6">
              {[
                { icon: "📧", label: "Email", value: "hello@minecroods.com" },
                { icon: "📞", label: "Phone", value: "+1 (555) 123-4567" },
                { icon: "📍", label: "HQ", value: "123 Green St, Portland, OR 97201" },
                { icon: "🕐", label: "Hours", value: "Mon-Fri: 9AM-6PM PST" },
              ].map((info, i) => (
                <div key={i} className="flex items-start gap-4">
                  <span className="text-2xl">{info.icon}</span>
                  <div><p className="text-xs text-gray-400 font-bold uppercase tracking-wider">{info.label}</p><p className="text-gray-900 font-medium">{info.value}</p></div>
                </div>
              ))}
            </div>
            <div className="bg-[#f8faf9] rounded-3xl p-6 border border-gray-100">
              <h3 className="font-bold text-gray-900 mb-4 text-sm">Quick FAQ</h3>
              {[
                { q: "Return policy?", a: "30-day hassle-free returns." },
                { q: "Shipping time?", a: "3-5 days, carbon neutral." },
                { q: "Truly sustainable?", a: "Independently certified." },
              ].map((f, i) => (
                <div key={i} className="mb-3 last:mb-0"><p className="text-sm font-semibold text-gray-900">{f.q}</p><p className="text-xs text-gray-500">{f.a}</p></div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-2">
            {sent ? (
              <div className="bg-emerald-50 rounded-3xl p-12 text-center animate-fade-in-up border border-emerald-100">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-full flex items-center justify-center text-white text-2xl">✓</div>
                <h3 className="text-2xl font-black text-gray-900 mb-2">Message Sent!</h3>
                <p className="text-gray-500 mb-6">We'll get back to you within 24 hours.</p>
                <button onClick={() => { setSent(false); setForm({ name: "", email: "", subject: "", message: "" }); }}
                  className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white rounded-full font-bold transition-all">Send Another</button>
              </div>
            ) : (
              <form onSubmit={(e) => { e.preventDefault(); setSent(true); }} className="bg-white rounded-3xl p-8 lg:p-10 border border-gray-100">
                <h2 className="text-2xl font-black text-gray-900 mb-8">Send a Message</h2>
                <div className="space-y-5">
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Name *</label>
                      <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                        className="w-full px-4 py-3.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all" placeholder="Your name" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Email *</label>
                      <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                        className="w-full px-4 py-3.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all" placeholder="you@email.com" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Subject *</label>
                    <select required value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })}
                      className="w-full px-4 py-3.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all">
                      <option value="">Select...</option>
                      <option>Order Inquiry</option><option>Product Question</option><option>Returns</option><option>Wholesale</option><option>Press</option><option>Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Message *</label>
                    <textarea required rows={5} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })}
                      className="w-full px-4 py-3.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none transition-all" placeholder="How can we help?" />
                  </div>
                  <button type="submit"
                    className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white rounded-full font-bold text-lg hover:shadow-xl hover:shadow-emerald-500/25 transition-all hover:-translate-y-0.5">
                    Send Message →
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Footer ─────────────────────────────────────────────
const Footer = ({ setCurrentPage }: { setCurrentPage: (p: string) => void }) => (
  <footer className="bg-[#0a0f0d] text-white relative overflow-hidden">
    <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent" />
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
        <div className="col-span-2 lg:col-span-1">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-lg flex items-center justify-center text-white text-sm font-black">M</div>
            <span className="text-xl font-black">mine<span className="text-gradient">croods</span></span>
          </div>
          <p className="text-gray-500 text-sm leading-relaxed mb-6">Sustainable fitness gear for a healthier you and a healthier planet.</p>
          <div className="flex gap-2">
            {["IG", "TW", "FB", "TT", "YT"].map((s) => (
              <button key={s} className="w-9 h-9 glass rounded-full flex items-center justify-center text-[10px] font-bold text-gray-400 hover:text-white hover:bg-emerald-500/20 transition-all">{s}</button>
            ))}
          </div>
        </div>
        <div>
          <h3 className="font-bold text-white mb-4 text-sm">Shop</h3>
          <ul className="space-y-2.5 text-sm">
            {categories.slice(1).map((c) => (
              <li key={c}><button onClick={() => setCurrentPage("shop")} className="text-gray-500 hover:text-emerald-400 transition-colors">{c}</button></li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="font-bold text-white mb-4 text-sm">Company</h3>
          <ul className="space-y-2.5 text-sm">
            {[["About", "about"], ["Sustainability", "sustainability"], ["Contact", "contact"], ["Careers", "about"], ["Press", "contact"]].map(([l, p]) => (
              <li key={l}><button onClick={() => setCurrentPage(p)} className="text-gray-500 hover:text-emerald-400 transition-colors">{l}</button></li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="font-bold text-white mb-4 text-sm">Support</h3>
          <ul className="space-y-2.5 text-sm">
            {["Shipping Info", "Returns", "Size Guide", "FAQ", "Track Order"].map((i) => (
              <li key={i}><button className="text-gray-500 hover:text-emerald-400 transition-colors">{i}</button></li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t border-white/5 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-gray-600 text-sm">© 2024 Minecroods. All rights reserved.</p>
        <div className="flex gap-6 text-sm text-gray-600">
          <button className="hover:text-gray-300 transition-colors">Privacy</button>
          <button className="hover:text-gray-300 transition-colors">Terms</button>
          <button className="hover:text-gray-300 transition-colors">Cookies</button>
        </div>
      </div>
    </div>
  </footer>
);

// ─── Main App ───────────────────────────────────────────
export default function App() {
  const [currentPage, setCurrentPage] = useState("home");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  useEffect(() => { window.scrollTo({ top: 0, behavior: "smooth" }); }, [currentPage, selectedProduct]);

  const goTo = (page: string) => { setCurrentPage(page); if (page !== "product") setSelectedProduct(null); };
  const viewProduct = (p: Product) => { setSelectedProduct(p); setCurrentPage("product"); };

  const renderPage = () => {
    if (currentPage === "product" && selectedProduct) return <ProductPage product={selectedProduct} setCurrentPage={goTo} setSelectedProduct={viewProduct} />;
    switch (currentPage) {
      case "shop": return <ShopPage setCurrentPage={goTo} setSelectedProduct={viewProduct} />;
      case "about": return <AboutPage />;
      case "sustainability": return <SustainabilityPage />;
      case "contact": return <ContactPage />;
      case "cart": return <CartPage setCurrentPage={goTo} />;
      default: return <HomePage setCurrentPage={goTo} setSelectedProduct={viewProduct} />;
    }
  };

  return (
    <CartProvider>
      <GlobalStyles />
      <div className="min-h-screen bg-white">
        <AnnouncementBar />
        <Header currentPage={currentPage} setCurrentPage={goTo} setSelectedProduct={setSelectedProduct} />
        <main>{renderPage()}</main>
        <Footer setCurrentPage={goTo} />
      </div>
    </CartProvider>
  );
}
