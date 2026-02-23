import { useState, useEffect, createContext, useContext, ReactNode } from "react";

// Types
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

// Cart Context
const CartContext = createContext<CartContextType | null>(null);

const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
};

const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);

  const addToCart = (product: Product, color: string) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id && item.color === color);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id && item.color === color
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1, color }];
    });
  };

  const removeFromCart = (productId: number) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => setCart([]);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, cartCount, cartTotal, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

// Product Data
const products: Product[] = [
  {
    id: 1,
    name: "EcoFlex Gym Bag",
    category: "Gym Bags",
    price: 79.99,
    originalPrice: 99.99,
    image: "🎒",
    description: "Spacious gym bag made from 100% recycled ocean plastic.",
    longDescription: "Our EcoFlex Gym Bag is crafted from 100% recycled ocean plastic, diverted from our coastlines. Featuring a spacious main compartment, ventilated shoe pocket, and water-resistant lining made from plant-based materials. Every bag removes 2kg of ocean plastic.",
    materials: ["Recycled Ocean Plastic", "Plant-based Lining", "Organic Cotton Straps", "Bamboo Zippers"],
    features: ["Ventilated shoe compartment", "Water-resistant", "Laptop sleeve (fits 15\")", "Multiple pockets", "Adjustable shoulder strap"],
    colors: ["Forest Green", "Ocean Blue", "Charcoal"],
    rating: 4.8,
    reviews: 234,
    badge: "Best Seller",
    inStock: true,
  },
  {
    id: 2,
    name: "ZenCarry Pilates Bag",
    category: "Pilates Bags",
    price: 64.99,
    image: "👜",
    description: "Elegant pilates bag with mat carrier, made from organic hemp.",
    longDescription: "The ZenCarry is designed specifically for pilates enthusiasts. Made from organic hemp and natural dyes, it features an external mat carrier, internal compartments for your essentials, and a removable pouch for personal items. Lightweight yet incredibly durable.",
    materials: ["Organic Hemp", "Natural Dyes", "Cork Accents", "Recycled Polyester Lining"],
    features: ["External mat carrier straps", "Removable inner pouch", "Cork detail accents", "Magnetic closure", "Lightweight design"],
    colors: ["Natural Tan", "Sage Green", "Dusty Rose"],
    rating: 4.9,
    reviews: 189,
    badge: "New",
    inStock: true,
  },
  {
    id: 3,
    name: "TideWave Beach Bag",
    category: "Beach Bags",
    price: 54.99,
    image: "🏖️",
    description: "Oversized beach bag woven from recycled fishing nets.",
    longDescription: "The TideWave Beach Bag transforms discarded fishing nets into a stunning, oversized beach companion. Sand-resistant mesh bottom lets sand fall through, while the spacious interior fits towels, sunscreen, and everything you need for a perfect beach day.",
    materials: ["Recycled Fishing Nets", "Sand-resistant Mesh", "Coconut Shell Buttons", "Organic Cotton Lining"],
    features: ["Sand-resistant mesh bottom", "Oversized capacity", "Waterproof inner pocket", "Coconut shell closures", "Foldable design"],
    colors: ["Sandy Beige", "Ocean Teal", "Coral"],
    rating: 4.7,
    reviews: 156,
    inStock: true,
  },
  {
    id: 4,
    name: "PureShake Protein Bottle",
    category: "Shaker Bottles",
    price: 29.99,
    originalPrice: 34.99,
    image: "🫗",
    description: "BPA-free shaker made from plant-based bioplastic.",
    longDescription: "The PureShake is the world's first protein shaker made entirely from plant-based bioplastic derived from sugarcane. Features a leak-proof design, integrated mixing ball made from recycled stainless steel, and measurement markings. 100% compostable at end of life.",
    materials: ["Plant-based Bioplastic", "Recycled Stainless Steel", "Silicone Seal (medical grade)", "Soy-based Ink"],
    features: ["700ml capacity", "Leak-proof guarantee", "Integrated mixing ball", "Measurement markings", "Dishwasher safe", "Compostable"],
    colors: ["Clear Green", "Frosted White", "Earth Brown"],
    rating: 4.6,
    reviews: 312,
    badge: "Eco Choice",
    inStock: true,
  },
  {
    id: 5,
    name: "PureShake Pro Bottle",
    category: "Shaker Bottles",
    price: 39.99,
    image: "🥤",
    description: "Premium dual-chamber shaker with supplement storage.",
    longDescription: "The PureShake Pro takes sustainable hydration to the next level. Dual-chamber design lets you store supplements separately. Made from the same plant-based bioplastic as our classic, with added features like a twist-lock supplement compartment and insulated walls.",
    materials: ["Plant-based Bioplastic", "Recycled Steel Mixing Ball", "Natural Rubber Seal", "Cork Grip Band"],
    features: ["900ml capacity", "Dual chamber design", "Twist-lock supplement storage", "Insulated walls", "Cork grip band", "Compostable"],
    colors: ["Midnight Black", "Forest Green", "Arctic White"],
    rating: 4.8,
    reviews: 198,
    inStock: true,
  },
  {
    id: 6,
    name: "CloudDry Gym Towel",
    category: "Gym Towels",
    price: 24.99,
    image: "🧖",
    description: "Quick-dry microfiber towel from recycled plastic bottles.",
    longDescription: "The CloudDry Gym Towel is made from microfiber derived from recycled plastic bottles — each towel repurposes 12 bottles. Ultra-absorbent, quick-drying, and antimicrobial without chemicals. Comes in a recycled cotton drawstring bag.",
    materials: ["Recycled PET Microfiber", "Natural Antimicrobial Treatment", "Recycled Cotton Bag"],
    features: ["Ultra-absorbent", "Quick-dry technology", "Naturally antimicrobial", "Compact & lightweight", "Includes carry bag", "Machine washable"],
    colors: ["Steel Gray", "Deep Teal", "Warm Terracotta"],
    rating: 4.7,
    reviews: 267,
    badge: "Popular",
    inStock: true,
  },
  {
    id: 7,
    name: "CloudDry XL Sport Towel",
    category: "Gym Towels",
    price: 34.99,
    image: "🏋️",
    description: "Extra-large sport towel with magnetic clip attachment.",
    longDescription: "Our XL Sport Towel is perfect for the gym floor, yoga, or outdoor workouts. Features a magnetic clip to attach to equipment, a zippered pocket for your phone or keys, and the same recycled PET microfiber technology. Each towel repurposes 20 plastic bottles.",
    materials: ["Recycled PET Microfiber", "Recycled Aluminum Clip", "YKK Recycled Zipper"],
    features: ["Extra-large size (60x120cm)", "Magnetic equipment clip", "Zippered valuables pocket", "Quick-dry", "20 bottles recycled per towel"],
    colors: ["Charcoal", "Navy", "Olive"],
    rating: 4.5,
    reviews: 143,
    inStock: true,
  },
  {
    id: 8,
    name: "GripFlow Pilates Socks",
    category: "Pilates Socks",
    price: 18.99,
    image: "🧦",
    description: "Non-slip pilates socks from organic bamboo fiber.",
    longDescription: "GripFlow Pilates Socks are crafted from organic bamboo fiber — naturally antibacterial, moisture-wicking, and incredibly soft. The natural rubber grip dots on the sole provide excellent traction on any surface. Seamless toe design prevents irritation.",
    materials: ["Organic Bamboo Fiber", "Natural Rubber Grips", "Organic Cotton Blend", "Natural Elastane"],
    features: ["Non-slip natural rubber grips", "Seamless toe design", "Moisture-wicking", "Naturally antibacterial", "Open-toe design", "One size fits most"],
    colors: ["Blush Pink", "Slate Gray", "Black"],
    rating: 4.9,
    reviews: 445,
    badge: "Top Rated",
    inStock: true,
  },
  {
    id: 9,
    name: "GripFlow Pro Socks (3-Pack)",
    category: "Pilates Socks",
    price: 44.99,
    originalPrice: 56.97,
    image: "👟",
    description: "Premium 3-pack with enhanced arch support and full grip.",
    longDescription: "The GripFlow Pro 3-Pack offers our premium pilates socks with enhanced arch support and full-sole grip coverage. Made with a higher percentage of organic bamboo for ultimate softness. Each pack includes three complementary colors in a reusable organic cotton pouch.",
    materials: ["Premium Organic Bamboo", "Natural Rubber Full-Sole Grips", "Organic Elastic", "Organic Cotton Pouch"],
    features: ["3 pairs included", "Enhanced arch support", "Full-sole grip coverage", "Extra cushioning", "Reusable cotton pouch", "Available in S/M/L"],
    colors: ["Earth Tones Set", "Neutral Set", "Bold Set"],
    rating: 4.8,
    reviews: 287,
    badge: "Value Pack",
    inStock: true,
  },
  {
    id: 10,
    name: "Voyager Gym Duffel",
    category: "Gym Bags",
    price: 109.99,
    image: "💼",
    description: "Premium gym duffel made from upcycled military canvas.",
    longDescription: "The Voyager is our premium gym duffel, handcrafted from upcycled military canvas and finished with vegetable-tanned leather accents. Each bag is unique due to the nature of upcycled materials. Features a wet/dry separator and expandable design.",
    materials: ["Upcycled Military Canvas", "Vegetable-tanned Leather", "Recycled Brass Hardware", "Organic Cotton Lining"],
    features: ["Wet/dry separator", "Expandable design", "Leather accent details", "Brass hardware", "Lifetime warranty", "Each bag unique"],
    colors: ["Army Green", "Desert Tan", "Washed Black"],
    rating: 4.9,
    reviews: 98,
    badge: "Premium",
    inStock: true,
  },
  {
    id: 11,
    name: "Coastal Beach Tote",
    category: "Beach Bags",
    price: 44.99,
    image: "🌊",
    description: "Lightweight beach tote from organic jute and cotton.",
    longDescription: "The Coastal Beach Tote combines organic jute and fair-trade cotton in a beautiful, lightweight design. Features waterproof lining made from recycled materials, an interior zip pocket, and hand-braided jute handles. Perfect for beach days or farmers market trips.",
    materials: ["Organic Jute", "Fair-trade Cotton", "Recycled Waterproof Lining", "Natural Dyes"],
    features: ["Waterproof lining", "Interior zip pocket", "Hand-braided handles", "Reinforced bottom", "Foldable for storage"],
    colors: ["Natural/White", "Natural/Navy", "Natural/Terracotta"],
    rating: 4.6,
    reviews: 176,
    inStock: true,
  },
  {
    id: 12,
    name: "ActiveCool Gym Towel Set",
    category: "Gym Towels",
    price: 39.99,
    originalPrice: 49.98,
    image: "✨",
    description: "Set of 2 cooling gym towels with instant cool technology.",
    longDescription: "The ActiveCool set includes two innovative cooling towels that activate with water. Made from recycled polyester fibers, simply wet, wring, and snap for instant cooling. Perfect for intense workouts, hot yoga, or outdoor exercise. Each set prevents 24 bottles from reaching landfill.",
    materials: ["Recycled Polyester Cooling Fibers", "Plant-based Cooling Agents", "Recycled Mesh Carry Case"],
    features: ["Instant cooling technology", "Set of 2 towels", "UV protection UPF 50+", "Reusable mesh case", "Lasts 2+ hours cool", "Machine washable"],
    colors: ["Ice Blue/Gray", "Mint/White", "Coral/Peach"],
    rating: 4.7,
    reviews: 321,
    badge: "Bundle Deal",
    inStock: true,
  },
];

const categories = ["All", "Gym Bags", "Pilates Bags", "Beach Bags", "Shaker Bottles", "Gym Towels", "Pilates Socks"];

// Star Rating Component
const StarRating = ({ rating, size = "sm" }: { rating: number; size?: string }) => {
  const sizeClass = size === "lg" ? "text-xl" : "text-sm";
  return (
    <div className={`flex items-center gap-0.5 ${sizeClass}`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <span key={star} className={star <= rating ? "text-yellow-400" : "text-gray-300"}>
          ★
        </span>
      ))}
    </div>
  );
};

// Announcement Bar
const AnnouncementBar = () => (
  <div className="bg-emerald-800 text-white text-center py-2 px-4 text-sm font-medium">
    🌿 Free shipping on orders over $75 | Every purchase plants a tree 🌳
  </div>
);

// Header / Navbar
const Header = ({ currentPage, setCurrentPage, setSelectedProduct }: {
  currentPage: string;
  setCurrentPage: (page: string) => void;
  setSelectedProduct: (product: Product | null) => void;
}) => {
  const { cartCount } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { label: "Home", page: "home" },
    { label: "Shop", page: "shop" },
    { label: "About", page: "about" },
    { label: "Sustainability", page: "sustainability" },
    { label: "Contact", page: "contact" },
  ];

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? "bg-white/95 backdrop-blur-md shadow-md" : "bg-white"}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <div className="space-y-1.5">
              <span className={`block w-6 h-0.5 bg-gray-800 transition-all ${mobileMenuOpen ? "rotate-45 translate-y-2" : ""}`} />
              <span className={`block w-6 h-0.5 bg-gray-800 transition-all ${mobileMenuOpen ? "opacity-0" : ""}`} />
              <span className={`block w-6 h-0.5 bg-gray-800 transition-all ${mobileMenuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
            </div>
          </button>

          {/* Logo */}
          <button
            onClick={() => { setCurrentPage("home"); setSelectedProduct(null); }}
            className="flex items-center gap-2"
          >
            <span className="text-2xl">🌿</span>
            <span className="text-xl lg:text-2xl font-bold tracking-tight text-gray-900">
              mine<span className="text-emerald-600">croods</span>
            </span>
          </button>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-8">
            {navItems.map((item) => (
              <button
                key={item.page}
                onClick={() => { setCurrentPage(item.page); setSelectedProduct(null); }}
                className={`text-sm font-medium transition-colors relative ${
                  currentPage === item.page
                    ? "text-emerald-600"
                    : "text-gray-700 hover:text-emerald-600"
                }`}
              >
                {item.label}
                {currentPage === item.page && (
                  <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-emerald-600 rounded-full" />
                )}
              </button>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-4">
            <button className="hidden sm:block text-gray-700 hover:text-emerald-600 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
            <button className="hidden sm:block text-gray-700 hover:text-emerald-600 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </button>
            <button
              onClick={() => setCurrentPage("cart")}
              className="relative text-gray-700 hover:text-emerald-600 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-emerald-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-gray-100 py-4 space-y-2">
            {navItems.map((item) => (
              <button
                key={item.page}
                onClick={() => {
                  setCurrentPage(item.page);
                  setSelectedProduct(null);
                  setMobileMenuOpen(false);
                }}
                className={`block w-full text-left px-4 py-2 rounded-lg text-sm font-medium ${
                  currentPage === item.page
                    ? "bg-emerald-50 text-emerald-600"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </header>
  );
};

// Home Page
const HomePage = ({ setCurrentPage, setSelectedProduct }: {
  setCurrentPage: (page: string) => void;
  setSelectedProduct: (product: Product) => void;
}) => {
  const { addToCart } = useCart();
  const featuredProducts = products.filter((p) => p.badge);
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-900 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 text-9xl">🌿</div>
          <div className="absolute bottom-10 right-20 text-8xl">🌍</div>
          <div className="absolute top-40 right-40 text-7xl">♻️</div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32 relative">
          <div className="max-w-3xl">
            <span className="inline-block px-4 py-1.5 bg-emerald-700/50 rounded-full text-sm font-medium mb-6 border border-emerald-600/30">
              ♻️ Sustainable Fitness Gear
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold leading-tight mb-6">
              Sweat
              <span className="text-emerald-300"> Sustainably</span>,
              <br />
              Train Responsibly
            </h1>
            <p className="text-lg sm:text-xl text-emerald-100 mb-8 max-w-2xl leading-relaxed">
              Premium fitness accessories crafted from recycled, organic, and
              plant-based materials. Every product you buy helps clean our oceans
              and plant trees around the world.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => setCurrentPage("shop")}
                className="px-8 py-4 bg-white text-emerald-900 rounded-full font-semibold text-lg hover:bg-emerald-50 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-0.5"
              >
                Shop Collection →
              </button>
              <button
                onClick={() => setCurrentPage("sustainability")}
                className="px-8 py-4 border-2 border-white/30 rounded-full font-semibold text-lg hover:bg-white/10 transition-all"
              >
                Our Mission
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Stats */}
      <section className="bg-emerald-50 border-b border-emerald-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            {[
              { number: "50K+", label: "Ocean Plastic Bottles Recycled", icon: "🌊" },
              { number: "25K+", label: "Trees Planted Worldwide", icon: "🌳" },
              { number: "100%", label: "Carbon Neutral Shipping", icon: "📦" },
              { number: "0", label: "Single-Use Plastics Used", icon: "♻️" },
            ].map((stat, i) => (
              <div key={i} className="space-y-2">
                <div className="text-3xl mb-2">{stat.icon}</div>
                <div className="text-2xl lg:text-3xl font-bold text-emerald-800">{stat.number}</div>
                <div className="text-sm text-emerald-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Shop by Category</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Every category, every product — designed with the planet in mind.</p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
            {[
              { name: "Gym Bags", emoji: "🎒", color: "from-emerald-500 to-teal-600", count: 2 },
              { name: "Pilates Bags", emoji: "👜", color: "from-rose-400 to-pink-600", count: 1 },
              { name: "Beach Bags", emoji: "🏖️", color: "from-cyan-400 to-blue-500", count: 2 },
              { name: "Shaker Bottles", emoji: "🫗", color: "from-lime-400 to-emerald-500", count: 2 },
              { name: "Gym Towels", emoji: "🧖", color: "from-amber-400 to-orange-500", count: 3 },
              { name: "Pilates Socks", emoji: "🧦", color: "from-violet-400 to-purple-600", count: 2 },
            ].map((cat) => (
              <button
                key={cat.name}
                onClick={() => setCurrentPage("shop")}
                className={`bg-gradient-to-br ${cat.color} rounded-2xl p-6 lg:p-8 text-white text-left hover:scale-105 transition-transform shadow-lg group`}
              >
                <div className="text-4xl lg:text-5xl mb-4 group-hover:scale-110 transition-transform">{cat.emoji}</div>
                <h3 className="text-lg lg:text-xl font-bold">{cat.name}</h3>
                <p className="text-white/80 text-sm mt-1">{cat.count} products</p>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 lg:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Featured Products</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Our most loved sustainable fitness essentials, chosen by our community.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.slice(0, 4).map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all group cursor-pointer"
                onClick={() => { setSelectedProduct(product); setCurrentPage("product"); }}
              >
                <div className="relative bg-gradient-to-br from-gray-50 to-gray-100 p-8 text-center">
                  <span className="text-6xl group-hover:scale-110 transition-transform inline-block">{product.image}</span>
                  {product.badge && (
                    <span className="absolute top-3 left-3 bg-emerald-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                      {product.badge}
                    </span>
                  )}
                  {product.originalPrice && (
                    <span className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                      Save ${(product.originalPrice - product.price).toFixed(0)}
                    </span>
                  )}
                </div>
                <div className="p-5">
                  <p className="text-xs text-emerald-600 font-semibold uppercase tracking-wider mb-1">{product.category}</p>
                  <h3 className="font-bold text-gray-900 mb-2 group-hover:text-emerald-600 transition-colors">{product.name}</h3>
                  <div className="flex items-center gap-2 mb-3">
                    <StarRating rating={product.rating} />
                    <span className="text-xs text-gray-500">({product.reviews})</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold text-gray-900">${product.price}</span>
                      {product.originalPrice && (
                        <span className="text-sm text-gray-400 line-through">${product.originalPrice}</span>
                      )}
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        addToCart(product, product.colors[0]);
                      }}
                      className="p-2 bg-emerald-600 text-white rounded-full hover:bg-emerald-700 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <button
              onClick={() => setCurrentPage("shop")}
              className="px-8 py-3 bg-emerald-600 text-white rounded-full font-semibold hover:bg-emerald-700 transition-colors"
            >
              View All Products →
            </button>
          </div>
        </div>
      </section>

      {/* Why Minecroods */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Why Minecroods?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">We're not just selling fitness gear — we're building a movement.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: "🌊",
                title: "Ocean Cleanup",
                description: "Every product removes plastic from our oceans. We partner with coastal communities to collect and transform ocean waste into premium materials.",
              },
              {
                icon: "🌱",
                title: "Plant-Based Materials",
                description: "From bioplastic shakers to organic bamboo socks, we prioritize renewable, plant-based materials that perform just as well as conventional alternatives.",
              },
              {
                icon: "🤝",
                title: "Fair Trade Certified",
                description: "Every artisan and worker in our supply chain receives fair wages and works in safe conditions. We believe sustainability includes people.",
              },
            ].map((item, i) => (
              <div key={i} className="text-center p-8 rounded-2xl bg-white border border-gray-100 hover:border-emerald-200 hover:shadow-lg transition-all">
                <div className="text-5xl mb-6">{item.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                <p className="text-gray-600 leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 lg:py-24 bg-emerald-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl lg:text-4xl font-bold text-center mb-12">What Our Community Says</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Sarah K.",
                role: "Yoga Instructor",
                text: "The GripFlow socks are incredible — best grip I've ever had, and knowing they're made from bamboo makes them even better. My students always ask about them!",
                avatar: "👩‍🦰",
              },
              {
                name: "Marcus T.",
                role: "CrossFit Athlete",
                text: "I was skeptical about a 'sustainable' gym bag being tough enough, but the EcoFlex has survived 6 months of daily abuse. Better than my old Nike bag honestly.",
                avatar: "👨‍🦱",
              },
              {
                name: "Priya M.",
                role: "Pilates Enthusiast",
                text: "The ZenCarry bag is absolutely beautiful. The hemp material gets softer over time and the mat straps are genius. I get compliments every single class.",
                avatar: "👩",
              },
            ].map((review, i) => (
              <div key={i} className="bg-emerald-800/50 rounded-2xl p-8 border border-emerald-700/30">
                <div className="flex items-center gap-1 mb-4">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <span key={s} className="text-yellow-400">★</span>
                  ))}
                </div>
                <p className="text-emerald-100 mb-6 leading-relaxed italic">"{review.text}"</p>
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{review.avatar}</span>
                  <div>
                    <p className="font-semibold">{review.name}</p>
                    <p className="text-emerald-300 text-sm">{review.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16 lg:py-24 bg-gradient-to-r from-emerald-50 to-teal-50">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Join the Green Movement</h2>
          <p className="text-gray-600 mb-8">Subscribe for 10% off your first order, plus sustainability tips and early access to new products.</p>
          {subscribed ? (
            <div className="bg-emerald-100 text-emerald-800 rounded-xl p-6 font-medium">
              ✅ Welcome to the Minecroods family! Check your email for your 10% discount code.
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 px-6 py-4 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-gray-900"
              />
              <button
                onClick={() => { if (email) setSubscribed(true); }}
                className="px-8 py-4 bg-emerald-600 text-white rounded-full font-semibold hover:bg-emerald-700 transition-colors whitespace-nowrap"
              >
                Subscribe
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Instagram / Social */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">@minecroods</h2>
          <p className="text-gray-600 mb-8">Follow us on Instagram for daily eco-inspo</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {["🏋️‍♀️", "🧘‍♂️", "🏖️", "🌿"].map((emoji, i) => (
              <div
                key={i}
                className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl aspect-square flex items-center justify-center text-6xl hover:scale-105 transition-transform cursor-pointer"
              >
                {emoji}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

// Shop Page
const ShopPage = ({ setCurrentPage, setSelectedProduct }: {
  setCurrentPage: (page: string) => void;
  setSelectedProduct: (product: Product) => void;
}) => {
  const { addToCart } = useCart();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("featured");
  const [searchQuery, setSearchQuery] = useState("");

  let filtered = selectedCategory === "All"
    ? products
    : products.filter((p) => p.category === selectedCategory);

  if (searchQuery) {
    filtered = filtered.filter(
      (p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  if (sortBy === "price-low") filtered = [...filtered].sort((a, b) => a.price - b.price);
  if (sortBy === "price-high") filtered = [...filtered].sort((a, b) => b.price - a.price);
  if (sortBy === "rating") filtered = [...filtered].sort((a, b) => b.rating - a.rating);
  if (sortBy === "reviews") filtered = [...filtered].sort((a, b) => b.reviews - a.reviews);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-gradient-to-r from-emerald-800 to-teal-800 text-white py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl lg:text-5xl font-bold mb-3">Shop All Products</h1>
          <p className="text-emerald-200 text-lg">Sustainable fitness gear that performs as good as it feels.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="flex flex-col lg:flex-row gap-4 mb-8">
          {/* Search */}
          <div className="relative flex-1">
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
            />
          </div>
          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
          >
            <option value="featured">Featured</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Highest Rated</option>
            <option value="reviews">Most Reviewed</option>
          </select>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                selectedCategory === cat
                  ? "bg-emerald-600 text-white shadow-md"
                  : "bg-white text-gray-600 border border-gray-200 hover:border-emerald-300 hover:text-emerald-600"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Results count */}
        <p className="text-sm text-gray-500 mb-6">{filtered.length} product{filtered.length !== 1 ? "s" : ""} found</p>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all group cursor-pointer"
              onClick={() => { setSelectedProduct(product); setCurrentPage("product"); }}
            >
              <div className="relative bg-gradient-to-br from-gray-50 to-gray-100 p-8 text-center">
                <span className="text-6xl group-hover:scale-110 transition-transform inline-block">{product.image}</span>
                {product.badge && (
                  <span className="absolute top-3 left-3 bg-emerald-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                    {product.badge}
                  </span>
                )}
                {product.originalPrice && (
                  <span className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                    -{Math.round((1 - product.price / product.originalPrice) * 100)}%
                  </span>
                )}
              </div>
              <div className="p-5">
                <p className="text-xs text-emerald-600 font-semibold uppercase tracking-wider mb-1">{product.category}</p>
                <h3 className="font-bold text-gray-900 mb-2 group-hover:text-emerald-600 transition-colors">{product.name}</h3>
                <p className="text-sm text-gray-500 mb-3 line-clamp-2">{product.description}</p>
                <div className="flex items-center gap-2 mb-4">
                  <StarRating rating={product.rating} />
                  <span className="text-xs text-gray-500">({product.reviews})</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-gray-900">${product.price}</span>
                    {product.originalPrice && (
                      <span className="text-sm text-gray-400 line-through">${product.originalPrice}</span>
                    )}
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      addToCart(product, product.colors[0]);
                    }}
                    className="px-4 py-2 bg-emerald-600 text-white text-sm rounded-full font-medium hover:bg-emerald-700 transition-colors"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20">
            <span className="text-6xl block mb-4">🔍</span>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-500">Try adjusting your search or filter criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

// Product Detail Page
const ProductPage = ({ product, setCurrentPage, setSelectedProduct }: {
  product: Product;
  setCurrentPage: (page: string) => void;
  setSelectedProduct: (product: Product) => void;
}) => {
  const { addToCart } = useCart();
  const [selectedColor, setSelectedColor] = useState(product.colors[0]);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");
  const [added, setAdded] = useState(false);

  const relatedProducts = products.filter((p) => p.category === product.category && p.id !== product.id);

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product, selectedColor);
    }
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <button onClick={() => setCurrentPage("home")} className="hover:text-emerald-600">Home</button>
          <span>/</span>
          <button onClick={() => setCurrentPage("shop")} className="hover:text-emerald-600">Shop</button>
          <span>/</span>
          <span className="text-gray-900">{product.name}</span>
        </div>
      </div>

      {/* Product Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Product Image */}
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl p-16 flex items-center justify-center relative">
            <span className="text-[10rem] lg:text-[14rem]">{product.image}</span>
            {product.badge && (
              <span className="absolute top-6 left-6 bg-emerald-600 text-white text-sm font-bold px-4 py-2 rounded-full">
                {product.badge}
              </span>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <p className="text-sm text-emerald-600 font-semibold uppercase tracking-wider mb-2">{product.category}</p>
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-3">{product.name}</h1>
              <div className="flex items-center gap-3">
                <StarRating rating={product.rating} size="lg" />
                <span className="text-gray-500">({product.reviews} reviews)</span>
              </div>
            </div>

            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-bold text-gray-900">${product.price}</span>
              {product.originalPrice && (
                <>
                  <span className="text-xl text-gray-400 line-through">${product.originalPrice}</span>
                  <span className="text-sm font-semibold text-red-500 bg-red-50 px-3 py-1 rounded-full">
                    Save ${(product.originalPrice - product.price).toFixed(2)}
                  </span>
                </>
              )}
            </div>

            <p className="text-gray-600 text-lg leading-relaxed">{product.description}</p>

            {/* Color Selection */}
            <div>
              <p className="font-semibold text-gray-900 mb-3">Color: <span className="font-normal text-gray-600">{selectedColor}</span></p>
              <div className="flex gap-3">
                {product.colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`px-4 py-2 rounded-full text-sm border-2 transition-all ${
                      selectedColor === color
                        ? "border-emerald-600 bg-emerald-50 text-emerald-700 font-medium"
                        : "border-gray-200 text-gray-600 hover:border-gray-300"
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div>
              <p className="font-semibold text-gray-900 mb-3">Quantity</p>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50"
                >
                  −
                </button>
                <span className="w-12 text-center font-semibold text-lg">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50"
                >
                  +
                </button>
              </div>
            </div>

            {/* Add to Cart */}
            <div className="flex gap-4">
              <button
                onClick={handleAddToCart}
                className={`flex-1 py-4 rounded-full font-semibold text-lg transition-all ${
                  added
                    ? "bg-green-500 text-white"
                    : "bg-emerald-600 text-white hover:bg-emerald-700 shadow-lg hover:shadow-xl"
                }`}
              >
                {added ? "✓ Added to Cart!" : "Add to Cart"}
              </button>
              <button className="px-6 py-4 border-2 border-gray-200 rounded-full hover:bg-gray-50 transition-colors">
                ♡
              </button>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-100">
              {[
                { icon: "🚚", text: "Free Shipping 75+" },
                { icon: "↩️", text: "30-Day Returns" },
                { icon: "🌿", text: "Eco Certified" },
              ].map((badge, i) => (
                <div key={i} className="text-center">
                  <div className="text-2xl mb-1">{badge.icon}</div>
                  <p className="text-xs text-gray-500 font-medium">{badge.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-16">
          <div className="flex border-b border-gray-200 gap-8">
            {["description", "materials", "features", "reviews"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-4 text-sm font-semibold capitalize transition-colors ${
                  activeTab === tab
                    ? "text-emerald-600 border-b-2 border-emerald-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
          <div className="py-8">
            {activeTab === "description" && (
              <div className="max-w-3xl">
                <p className="text-gray-600 leading-relaxed text-lg">{product.longDescription}</p>
              </div>
            )}
            {activeTab === "materials" && (
              <div className="max-w-3xl">
                <h3 className="font-bold text-gray-900 mb-4 text-lg">Sustainable Materials Used</h3>
                <ul className="space-y-3">
                  {product.materials.map((material, i) => (
                    <li key={i} className="flex items-center gap-3">
                      <span className="w-2 h-2 bg-emerald-500 rounded-full" />
                      <span className="text-gray-600">{material}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {activeTab === "features" && (
              <div className="max-w-3xl">
                <h3 className="font-bold text-gray-900 mb-4 text-lg">Product Features</h3>
                <ul className="space-y-3">
                  {product.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-3">
                      <span className="text-emerald-500">✓</span>
                      <span className="text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {activeTab === "reviews" && (
              <div className="max-w-3xl space-y-6">
                {[
                  { name: "Alex R.", date: "2 weeks ago", rating: 5, text: "Absolutely love this product! The quality is amazing and knowing it's sustainable makes it even better." },
                  { name: "Jordan L.", date: "1 month ago", rating: 5, text: "Exceeded my expectations. The materials feel premium and it's held up great through daily use." },
                  { name: "Casey W.", date: "2 months ago", rating: 4, text: "Great product overall. Love the sustainable approach. Would love to see more color options!" },
                ].map((review, i) => (
                  <div key={i} className="border-b border-gray-100 pb-6">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center font-bold text-emerald-600">
                          {review.name[0]}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{review.name}</p>
                          <p className="text-xs text-gray-400">{review.date}</p>
                        </div>
                      </div>
                      <StarRating rating={review.rating} />
                    </div>
                    <p className="text-gray-600 ml-13">{review.text}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">You Might Also Like</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedProducts.map((p) => (
                <div
                  key={p.id}
                  className="bg-gray-50 rounded-2xl overflow-hidden hover:shadow-lg transition-all cursor-pointer group"
                  onClick={() => { setSelectedProduct(p); window.scrollTo(0, 0); }}
                >
                  <div className="p-8 text-center">
                    <span className="text-5xl group-hover:scale-110 transition-transform inline-block">{p.image}</span>
                  </div>
                  <div className="p-5 bg-white">
                    <h3 className="font-bold text-gray-900 group-hover:text-emerald-600">{p.name}</h3>
                    <p className="text-emerald-600 font-semibold mt-1">${p.price}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Cart Page
const CartPage = ({ setCurrentPage }: { setCurrentPage: (page: string) => void }) => {
  const { cart, removeFromCart, updateQuantity, cartTotal, clearCart } = useCart();
  const [showCheckout, setShowCheckout] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const shipping = cartTotal >= 75 ? 0 : 9.99;
  const tax = cartTotal * 0.08;

  if (orderPlaced) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-lg mx-auto px-4">
          <div className="text-7xl mb-6">🎉</div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Order Confirmed!</h1>
          <p className="text-gray-600 mb-2">Thank you for shopping sustainably with Minecroods.</p>
          <p className="text-emerald-600 font-medium mb-8">🌳 A tree has been planted in your name!</p>
          <div className="bg-white rounded-2xl p-6 mb-8 text-left">
            <p className="text-sm text-gray-500 mb-1">Order Number</p>
            <p className="font-bold text-gray-900 mb-4">#MC-{Math.random().toString(36).substring(2, 10).toUpperCase()}</p>
            <p className="text-sm text-gray-500">A confirmation email has been sent to your inbox. Your order will arrive in 3-5 business days with carbon-neutral shipping.</p>
          </div>
          <button
            onClick={() => { setCurrentPage("shop"); setOrderPlaced(false); }}
            className="px-8 py-3 bg-emerald-600 text-white rounded-full font-semibold hover:bg-emerald-700 transition-colors"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center px-4">
          <div className="text-7xl mb-6">🛒</div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Your Cart is Empty</h1>
          <p className="text-gray-600 mb-8">Looks like you haven't added any sustainable goodies yet!</p>
          <button
            onClick={() => setCurrentPage("shop")}
            className="px-8 py-3 bg-emerald-600 text-white rounded-full font-semibold hover:bg-emerald-700 transition-colors"
          >
            Start Shopping →
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart ({cart.length} item{cart.length !== 1 ? "s" : ""})</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item) => (
              <div key={item.product.id} className="bg-white rounded-2xl p-6 flex gap-6 items-center shadow-sm">
                <div className="w-20 h-20 bg-gray-50 rounded-xl flex items-center justify-center text-4xl flex-shrink-0">
                  {item.product.image}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-gray-900">{item.product.name}</h3>
                  <p className="text-sm text-gray-500">{item.color}</p>
                  <p className="text-emerald-600 font-semibold mt-1">${item.product.price}</p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                    className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-sm hover:bg-gray-50"
                  >
                    −
                  </button>
                  <span className="w-8 text-center font-semibold">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                    className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-sm hover:bg-gray-50"
                  >
                    +
                  </button>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-900">${(item.product.price * item.quantity).toFixed(2)}</p>
                  <button
                    onClick={() => removeFromCart(item.product.id)}
                    className="text-sm text-red-500 hover:text-red-700 mt-1"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
            <button onClick={clearCart} className="text-sm text-gray-500 hover:text-red-500 transition-colors">
              Clear Cart
            </button>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 shadow-sm sticky top-24">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">${cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className={`font-medium ${shipping === 0 ? "text-emerald-600" : ""}`}>
                    {shipping === 0 ? "FREE" : `$${shipping.toFixed(2)}`}
                  </span>
                </div>
                {shipping > 0 && (
                  <p className="text-xs text-emerald-600">Add ${(75 - cartTotal).toFixed(2)} more for free shipping!</p>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-600">Estimated Tax</span>
                  <span className="font-medium">${tax.toFixed(2)}</span>
                </div>
                <div className="border-t border-gray-100 pt-3 flex justify-between text-lg">
                  <span className="font-bold text-gray-900">Total</span>
                  <span className="font-bold text-gray-900">${(cartTotal + shipping + tax).toFixed(2)}</span>
                </div>
              </div>

              <div className="mt-6 p-3 bg-emerald-50 rounded-xl text-sm text-emerald-700 flex items-center gap-2">
                <span>🌳</span>
                <span>This order plants {cart.reduce((s, i) => s + i.quantity, 0)} tree{cart.reduce((s, i) => s + i.quantity, 0) > 1 ? "s" : ""}!</span>
              </div>

              {!showCheckout ? (
                <button
                  onClick={() => setShowCheckout(true)}
                  className="w-full mt-6 py-4 bg-emerald-600 text-white rounded-full font-semibold text-lg hover:bg-emerald-700 transition-colors"
                >
                  Proceed to Checkout
                </button>
              ) : (
                <div className="mt-6 space-y-4">
                  <h3 className="font-bold text-gray-900">Checkout</h3>
                  <input type="email" placeholder="Email address" className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                  <input type="text" placeholder="Full name" className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                  <input type="text" placeholder="Shipping address" className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                  <div className="grid grid-cols-2 gap-3">
                    <input type="text" placeholder="City" className="px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                    <input type="text" placeholder="ZIP code" className="px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                  </div>
                  <input type="text" placeholder="Card number" className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                  <div className="grid grid-cols-2 gap-3">
                    <input type="text" placeholder="MM/YY" className="px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                    <input type="text" placeholder="CVC" className="px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                  </div>
                  <button
                    onClick={() => { setOrderPlaced(true); clearCart(); }}
                    className="w-full py-4 bg-emerald-600 text-white rounded-full font-semibold hover:bg-emerald-700 transition-colors"
                  >
                    Place Order — ${(cartTotal + shipping + tax).toFixed(2)}
                  </button>
                </div>
              )}

              <div className="mt-4 flex items-center justify-center gap-4 text-gray-400 text-xs">
                <span>🔒 Secure Checkout</span>
                <span>•</span>
                <span>SSL Encrypted</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// About Page
const AboutPage = () => (
  <div className="min-h-screen">
    {/* Hero */}
    <section className="bg-gradient-to-br from-emerald-900 to-teal-900 text-white py-20 lg:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-4xl lg:text-6xl font-bold mb-6">Our Story</h1>
        <p className="text-xl text-emerald-200 max-w-3xl mx-auto leading-relaxed">
          Born from a simple belief: your fitness journey shouldn't cost the earth.
        </p>
      </div>
    </section>

    {/* Story */}
    <section className="py-16 lg:py-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="prose prose-lg max-w-none">
          <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">How It All Started</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Minecroods was founded in 2021 by a group of fitness enthusiasts who were frustrated by the
                environmental impact of the fitness industry. From single-use plastic water bottles littering
                gym floors to synthetic gym bags that would take centuries to decompose, we knew there had to
                be a better way.
              </p>
              <p className="text-gray-600 leading-relaxed">
                We set out to create a line of fitness accessories that perform just as well — if not better —
                than conventional products, while being made entirely from sustainable, recycled, and
                plant-based materials.
              </p>
            </div>
            <div className="bg-gradient-to-br from-emerald-100 to-teal-100 rounded-3xl p-12 text-center">
              <span className="text-8xl block mb-4">🌱</span>
              <p className="text-emerald-800 font-semibold text-lg">Founded 2021</p>
              <p className="text-emerald-600">With a mission to change fitness</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
            <div className="bg-gradient-to-br from-blue-100 to-cyan-100 rounded-3xl p-12 text-center order-2 md:order-1">
              <span className="text-8xl block mb-4">🌍</span>
              <p className="text-blue-800 font-semibold text-lg">Global Impact</p>
              <p className="text-blue-600">35+ countries served</p>
            </div>
            <div className="order-1 md:order-2">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                We believe that every workout should leave the world better than we found it. Our mission is
                to prove that sustainability and performance aren't mutually exclusive — they're complementary.
              </p>
              <p className="text-gray-600 leading-relaxed">
                By partnering with ocean cleanup organizations, fair-trade cooperatives, and innovative
                material scientists, we've created products that you can feel proud to use, knowing that
                every purchase contributes to a healthier planet.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    {/* Team Values */}
    <section className="py-16 lg:py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 text-center mb-12">Our Values</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: "🌊", title: "Ocean First", desc: "We actively remove ocean plastic and transform it into premium products." },
            { icon: "🤲", title: "Radical Transparency", desc: "Full supply chain visibility. Know exactly where your products come from." },
            { icon: "💪", title: "No Compromises", desc: "Sustainable doesn't mean sacrificing quality. Our gear performs at the highest level." },
            { icon: "❤️", title: "Community Driven", desc: "Our community shapes our products. Every decision starts with you." },
          ].map((value, i) => (
            <div key={i} className="bg-white rounded-2xl p-8 text-center hover:shadow-lg transition-shadow">
              <div className="text-4xl mb-4">{value.icon}</div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">{value.title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{value.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* Team */}
    <section className="py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 text-center mb-12">Meet the Team</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { name: "Emma Chen", role: "Founder & CEO", emoji: "👩‍💼", bio: "Former marine biologist turned entrepreneur. Emma's passion for ocean conservation drives everything we do." },
            { name: "Raj Patel", role: "Head of Sustainability", emoji: "👨‍🔬", bio: "Materials scientist with 15 years in sustainable textiles. Raj ensures every product meets our eco standards." },
            { name: "Sofia Martinez", role: "Creative Director", emoji: "👩‍🎨", bio: "Award-winning designer who believes beautiful products and sustainability go hand in hand." },
          ].map((member, i) => (
            <div key={i} className="text-center">
              <div className="w-32 h-32 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-full flex items-center justify-center text-5xl mx-auto mb-6">
                {member.emoji}
              </div>
              <h3 className="text-xl font-bold text-gray-900">{member.name}</h3>
              <p className="text-emerald-600 font-medium mb-3">{member.role}</p>
              <p className="text-gray-600 text-sm max-w-xs mx-auto">{member.bio}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* Certifications */}
    <section className="py-16 lg:py-20 bg-emerald-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">Certified & Trusted</h2>
        <div className="flex flex-wrap justify-center gap-8">
          {["🏅 B Corp Certified", "♻️ Climate Neutral", "🌿 GOTS Organic", "🤝 Fair Trade", "🌊 Ocean Positive", "🐰 Cruelty Free"].map((cert, i) => (
            <div key={i} className="bg-white px-6 py-3 rounded-full shadow-sm text-sm font-medium text-gray-700">
              {cert}
            </div>
          ))}
        </div>
      </div>
    </section>
  </div>
);

// Sustainability Page
const SustainabilityPage = () => (
  <div className="min-h-screen">
    {/* Hero */}
    <section className="bg-gradient-to-br from-green-900 via-emerald-800 to-teal-900 text-white py-20 lg:py-28 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 right-20 text-9xl">🌍</div>
        <div className="absolute bottom-10 left-10 text-8xl">🌿</div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
        <h1 className="text-4xl lg:text-6xl font-bold mb-6">Sustainability at Our Core</h1>
        <p className="text-xl text-emerald-200 max-w-3xl mx-auto leading-relaxed">
          Every decision we make is filtered through one question: Is this good for the planet?
        </p>
      </div>
    </section>

    {/* Pillars */}
    <section className="py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 text-center mb-4">Our 5 Sustainability Pillars</h2>
        <p className="text-gray-600 text-center mb-16 max-w-2xl mx-auto">These pillars guide every product we design, every partner we choose, and every business decision we make.</p>
        <div className="space-y-12">
          {[
            {
              icon: "🌊",
              number: "01",
              title: "Ocean Plastic Recovery",
              description: "We partner with coastal cleanup organizations in 12 countries to collect ocean-bound plastic before it reaches the sea. This plastic is cleaned, processed, and woven into our bags and towels. To date, we've removed over 50,000 plastic bottles from waterways.",
              stat: "50,000+ bottles recovered",
            },
            {
              icon: "🌱",
              number: "02",
              title: "Plant-Based Innovation",
              description: "Our shaker bottles are made from sugarcane-derived bioplastic — a world first. Our socks use organic bamboo that grows without pesticides or excessive water. We're constantly researching new plant-based materials to replace conventional plastics.",
              stat: "85% plant-based materials",
            },
            {
              icon: "♻️",
              number: "03",
              title: "Circular Design",
              description: "Every product is designed with its end of life in mind. Our bioplastic shakers are compostable. Our bags can be returned to us for recycling. We offer a take-back program where customers can return worn products for 15% off their next purchase.",
              stat: "100% recyclable or compostable",
            },
            {
              icon: "📦",
              number: "04",
              title: "Carbon Neutral Operations",
              description: "From our solar-powered warehouse to our carbon-offset shipping, every aspect of our operations is carbon neutral. We use recycled cardboard packaging, soy-based inks, and plastic-free tape. Our shipping partner uses electric vehicles for last-mile delivery.",
              stat: "Net zero since 2022",
            },
            {
              icon: "🤝",
              number: "05",
              title: "Fair & Ethical Production",
              description: "We pay living wages to every person in our supply chain. Our factories are regularly audited by independent organizations. We prioritize working with women-owned cooperatives and marginalized communities, providing stable employment and skills training.",
              stat: "100% fair trade certified",
            },
          ].map((pillar, i) => (
            <div key={i} className="grid md:grid-cols-12 gap-8 items-start">
              <div className="md:col-span-1 text-4xl font-bold text-emerald-200">{pillar.number}</div>
              <div className="md:col-span-1 text-4xl">{pillar.icon}</div>
              <div className="md:col-span-10">
                <h3 className="text-2xl font-bold text-gray-900 mb-3">{pillar.title}</h3>
                <p className="text-gray-600 leading-relaxed mb-3">{pillar.description}</p>
                <span className="inline-block bg-emerald-100 text-emerald-700 px-4 py-1.5 rounded-full text-sm font-semibold">
                  {pillar.stat}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* Impact Numbers */}
    <section className="py-16 lg:py-24 bg-emerald-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl lg:text-4xl font-bold text-center mb-16">Our Impact in Numbers</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { number: "50,000+", label: "Plastic Bottles Recycled", icon: "🌊" },
            { number: "25,000+", label: "Trees Planted", icon: "🌳" },
            { number: "12", label: "Coastal Cleanup Partners", icon: "🏖️" },
            { number: "500+", label: "Tons CO₂ Offset", icon: "💨" },
            { number: "0", label: "Landfill Waste (goal 2025)", icon: "🎯" },
            { number: "100%", label: "Renewable Energy Used", icon: "⚡" },
            { number: "35+", label: "Countries Served", icon: "🌍" },
            { number: "15,000+", label: "Community Members", icon: "❤️" },
          ].map((stat, i) => (
            <div key={i} className="text-center p-6 bg-emerald-800/50 rounded-2xl">
              <div className="text-3xl mb-3">{stat.icon}</div>
              <div className="text-2xl lg:text-3xl font-bold mb-1">{stat.number}</div>
              <div className="text-emerald-300 text-sm">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* Materials */}
    <section className="py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 text-center mb-12">Our Materials</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { name: "Recycled Ocean Plastic", desc: "Collected from coastal areas and transformed into durable yarn for our bags and towels.", icon: "🌊" },
            { name: "Organic Bamboo", desc: "Grown without pesticides, naturally antibacterial and incredibly soft for our socks.", icon: "🎋" },
            { name: "Plant-based Bioplastic", desc: "Derived from sugarcane, our shaker bottles are 100% compostable at end of life.", icon: "🌿" },
            { name: "Organic Hemp", desc: "One of the most sustainable crops on earth, used in our pilates bags.", icon: "🌾" },
            { name: "Recycled Fishing Nets", desc: "Ghost nets recovered from the ocean, cleaned and woven into our beach bags.", icon: "🐟" },
            { name: "Upcycled Canvas", desc: "Surplus military canvas given new life in our premium duffel bags.", icon: "♻️" },
          ].map((material, i) => (
            <div key={i} className="bg-gray-50 rounded-2xl p-6 hover:bg-emerald-50 transition-colors">
              <div className="text-3xl mb-3">{material.icon}</div>
              <h3 className="font-bold text-gray-900 mb-2">{material.name}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{material.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* Pledge */}
    <section className="py-16 lg:py-24 bg-gradient-to-br from-emerald-50 to-teal-50">
      <div className="max-w-3xl mx-auto px-4 text-center">
        <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">Our 2030 Pledge</h2>
        <div className="space-y-4 text-left">
          {[
            "Remove 1 million plastic bottles from our oceans",
            "Plant 500,000 trees worldwide",
            "Achieve 100% circular product lifecycle",
            "Transition to 100% renewable energy across all operations",
            "Zero waste to landfill",
            "Carbon negative operations (removing more CO₂ than we produce)",
          ].map((pledge, i) => (
            <div key={i} className="flex items-start gap-3 bg-white rounded-xl p-4">
              <span className="text-emerald-500 mt-0.5">✓</span>
              <span className="text-gray-700">{pledge}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  </div>
);

// Contact Page
const ContactPage = () => {
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-r from-emerald-800 to-teal-800 text-white py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl lg:text-5xl font-bold mb-4">Get in Touch</h1>
          <p className="text-emerald-200 text-lg">We'd love to hear from you. Our team is always here to help.</p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Contact Info */}
          <div className="lg:col-span-1 space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Contact Information</h2>
              <div className="space-y-6">
                {[
                  { icon: "📧", label: "Email", value: "hello@minecroods.com", link: "mailto:hello@minecroods.com" },
                  { icon: "📞", label: "Phone", value: "+1 (555) 123-4567", link: "tel:+15551234567" },
                  { icon: "📍", label: "Address", value: "123 Green Street, Portland, OR 97201" },
                  { icon: "🕐", label: "Hours", value: "Mon-Fri: 9AM-6PM PST" },
                ].map((info, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <span className="text-2xl">{info.icon}</span>
                    <div>
                      <p className="text-sm text-gray-500 font-medium">{info.label}</p>
                      {info.link ? (
                        <a href={info.link} className="text-gray-900 hover:text-emerald-600 transition-colors font-medium">
                          {info.value}
                        </a>
                      ) : (
                        <p className="text-gray-900 font-medium">{info.value}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-emerald-50 rounded-2xl p-6">
              <h3 className="font-bold text-gray-900 mb-3">💬 FAQ</h3>
              <div className="space-y-3 text-sm">
                {[
                  { q: "What's your return policy?", a: "30-day hassle-free returns on all products." },
                  { q: "How long does shipping take?", a: "3-5 business days (carbon neutral)." },
                  { q: "Are products truly sustainable?", a: "Yes! All certified by independent auditors." },
                ].map((faq, i) => (
                  <div key={i}>
                    <p className="font-semibold text-gray-900">{faq.q}</p>
                    <p className="text-gray-600">{faq.a}</p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-bold text-gray-900 mb-3">Follow Us</h3>
              <div className="flex gap-3">
                {["Instagram", "Twitter", "Facebook", "TikTok"].map((social) => (
                  <button
                    key={social}
                    className="px-4 py-2 bg-gray-100 rounded-full text-sm font-medium text-gray-700 hover:bg-emerald-100 hover:text-emerald-700 transition-colors"
                  >
                    {social}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            {submitted ? (
              <div className="bg-emerald-50 rounded-2xl p-12 text-center">
                <span className="text-6xl block mb-4">✅</span>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Message Sent!</h3>
                <p className="text-gray-600 mb-6">Thanks for reaching out! We'll get back to you within 24 hours.</p>
                <button
                  onClick={() => { setSubmitted(false); setFormData({ name: "", email: "", subject: "", message: "" }); }}
                  className="px-6 py-3 bg-emerald-600 text-white rounded-full font-medium hover:bg-emerald-700 transition-colors"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Send Us a Message</h2>
                <div className="space-y-5">
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        placeholder="Your name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        placeholder="you@email.com"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Subject *</label>
                    <select
                      required
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="">Select a subject</option>
                      <option value="order">Order Inquiry</option>
                      <option value="product">Product Question</option>
                      <option value="returns">Returns & Exchanges</option>
                      <option value="wholesale">Wholesale Inquiry</option>
                      <option value="press">Press & Media</option>
                      <option value="partnership">Partnership Opportunity</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Message *</label>
                    <textarea
                      required
                      rows={6}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
                      placeholder="How can we help you?"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full sm:w-auto px-8 py-4 bg-emerald-600 text-white rounded-full font-semibold text-lg hover:bg-emerald-700 transition-colors"
                  >
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

// Footer
const Footer = ({ setCurrentPage }: { setCurrentPage: (page: string) => void }) => (
  <footer className="bg-gray-900 text-white">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
        {/* Brand */}
        <div className="col-span-2 lg:col-span-1">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-2xl">🌿</span>
            <span className="text-xl font-bold">mine<span className="text-emerald-400">croods</span></span>
          </div>
          <p className="text-gray-400 text-sm leading-relaxed mb-6">
            Sustainable fitness gear for a healthier you and a healthier planet. Every purchase makes a difference.
          </p>
          <div className="flex gap-3">
            {["IG", "TW", "FB", "TT"].map((social) => (
              <button key={social} className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center text-xs font-bold text-gray-400 hover:bg-emerald-600 hover:text-white transition-colors">
                {social}
              </button>
            ))}
          </div>
        </div>

        {/* Shop */}
        <div>
          <h3 className="font-bold text-white mb-4">Shop</h3>
          <ul className="space-y-2 text-sm">
            {categories.slice(1).map((cat) => (
              <li key={cat}>
                <button onClick={() => setCurrentPage("shop")} className="text-gray-400 hover:text-emerald-400 transition-colors">
                  {cat}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Company */}
        <div>
          <h3 className="font-bold text-white mb-4">Company</h3>
          <ul className="space-y-2 text-sm">
            {[
              { label: "About Us", page: "about" },
              { label: "Sustainability", page: "sustainability" },
              { label: "Contact", page: "contact" },
              { label: "Careers", page: "about" },
              { label: "Press Kit", page: "contact" },
            ].map((item) => (
              <li key={item.label}>
                <button onClick={() => setCurrentPage(item.page)} className="text-gray-400 hover:text-emerald-400 transition-colors">
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Support */}
        <div>
          <h3 className="font-bold text-white mb-4">Support</h3>
          <ul className="space-y-2 text-sm">
            {["Shipping Info", "Returns & Exchanges", "Size Guide", "FAQ", "Track Order"].map((item) => (
              <li key={item}>
                <button className="text-gray-400 hover:text-emerald-400 transition-colors">{item}</button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-gray-500 text-sm">© 2024 Minecroods. All rights reserved. Made with 💚 for the planet.</p>
        <div className="flex gap-6 text-sm text-gray-500">
          <button className="hover:text-gray-300 transition-colors">Privacy Policy</button>
          <button className="hover:text-gray-300 transition-colors">Terms of Service</button>
          <button className="hover:text-gray-300 transition-colors">Cookie Policy</button>
        </div>
      </div>
    </div>
  </footer>
);

// Main App
export default function App() {
  const [currentPage, setCurrentPage] = useState("home");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPage, selectedProduct]);

  const handleSetPage = (page: string) => {
    setCurrentPage(page);
    if (page !== "product") setSelectedProduct(null);
  };

  const renderPage = () => {
    if (currentPage === "product" && selectedProduct) {
      return <ProductPage product={selectedProduct} setCurrentPage={handleSetPage} setSelectedProduct={(p: Product) => { setSelectedProduct(p); setCurrentPage("product"); }} />;
    }
    switch (currentPage) {
      case "shop":
        return <ShopPage setCurrentPage={handleSetPage} setSelectedProduct={(p: Product) => { setSelectedProduct(p); setCurrentPage("product"); }} />;
      case "about":
        return <AboutPage />;
      case "sustainability":
        return <SustainabilityPage />;
      case "contact":
        return <ContactPage />;
      case "cart":
        return <CartPage setCurrentPage={handleSetPage} />;
      default:
        return <HomePage setCurrentPage={handleSetPage} setSelectedProduct={(p: Product) => { setSelectedProduct(p); setCurrentPage("product"); }} />;
    }
  };

  return (
    <CartProvider>
      <div className="min-h-screen bg-white font-sans">
        <AnnouncementBar />
        <Header currentPage={currentPage} setCurrentPage={handleSetPage} setSelectedProduct={setSelectedProduct} />
        <main>{renderPage()}</main>
        <Footer setCurrentPage={handleSetPage} />
      </div>
    </CartProvider>
  );
}
