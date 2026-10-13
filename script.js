const FALLBACK_PRODUCTS = [
    {
        id: 1,
        name: "Kaos Free Fire Size M",
        category: "T-Shirt",
        price: 89000,
        tag: "BEST SELLER",
        rating: "4.9",
        image: "./assets/kaos_ff.jpg",
        description: "Kaos Free Fire dengan desain gaming yang keren."
    },
    {
        id: 2,
        name: "Kaos Mobile Legend Size L",
        category: "T-Shirt",
        price: 149000,
        tag: "NEW",
        rating: "4.8",
        image: "./assets/kaos_ml.jpg",
        description: "Kaos Mobile Legends untuk penggemar game MOBA."
    },
    {
        id: 3,
        name: "Kaos Pubg Size M",
        category: "T-Shirt",
        price: 169000,
        tag: "POPULAR",
        rating: "4.9",
        image: "./assets/kaos_pubg.jpg",
        description: "Kaos PUBG dengan desain khas pecinta battle royale."
    },
    {
        id: 4,
        name: "Hoodie Wibu Size M",
        category: "Hoodie",
        price: 179000,
        tag: "NEW",
        rating: "4.8",
        image: "./assets/hoodie_wibu.jpg",
        description: "Hoodie bergaya anime untuk tampilan kasual."
    },
    {
        id: 5,
        name: "Jam Ben10 Limited Edition",
        category: "Jam Tangan",
        price: 119000,
        tag: "LIMITED",
        rating: "4.7",
        image: "./assets/jam_ben10.jpg",
        description: "Jam tangan Ben 10 dengan desain unik dan ikonik."
    },
    {
        id: 6,
        name: "Jam Power Ranger Asli",
        category: "Jam Tangan",
        price: 199000,
        tag: "BEST SELLER",
        rating: "4.9",
        image: "./assets/jam_powerranger.jpg",
        description: "Jam tangan Power Rangers untuk penggemar superhero."
    },
    {
        id: 7,
        name: "Sepatu Jordan Free Fire Uk 40",
        category: "Sepatu",
        price: 219000,
        tag: "LIMITED",
        rating: "4.8",
        image: "./assets/sepatu_jordan.jpg",
        description: "Sepatu bergaya sporty dengan tema Free Fire."
    },
    {
        id: 8,
        name: "Sepatu Mobile Legend Asli",
        category: "Sepatu",
        price: 79000,
        tag: "EASY PICK",
        rating: "4.7",
        image: "./assets/sepatu_ml.jpg",
        description: "Sepatu bertema Mobile Legends untuk gaya gaming."
    }
];

const state = { products: [], category: "Semua", query: "", cart: [], showAll: false };
const $ = (selector) => document.querySelector(selector);
const rupiah = (number) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(number);

// FUNCTION: ambil katalog dari API Python. Jika API belum tersedia, situs tetap bisa dipakai.
async function loadProducts() {
  try {
    const response = await fetch("/api/products");
    if (!response.ok) throw new Error("API belum tersedia");
    const data = await response.json();
    state.products = Array.isArray(data.products) && data.products.length ? data.products : FALLBACK_PRODUCTS;
  } catch (error) {
    state.products = FALLBACK_PRODUCTS;
    console.info("Menggunakan katalog cadangan:", error.message);
  }
  renderProducts();
}

// KONDISI LOGIKA + LIST: filter kategori dan kata pencarian.
function getVisibleProducts() {
  return state.products.filter((product) => {
    const matchCategory = state.category === "Semua" || product.category === state.category;
    const searchable = `${product.name} ${product.category} ${product.description || ""}`.toLowerCase();
    const matchQuery = searchable.includes(state.query.toLowerCase());
    return matchCategory && matchQuery;
  });
}

// LOOPING: forEach menggambar setiap produk dari list.
function renderProducts() {
  const grid = $("#productGrid");
  const products = getVisibleProducts();
  const shown = state.showAll ? products : products.slice(0, 4);
  if (!shown.length) {
    grid.innerHTML = '<div class="empty-products">Produk tidak ditemukan. Coba kata kunci lain, ya.</div>';
    return;
  }
  grid.innerHTML = shown.map((product) => `
    <article class="product-card">
      <div class="product-image">
        <img src="${escapeHTML(product.image)}" alt="${escapeHTML(product.name)}" loading="lazy" onerror="this.src='https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=700&q=80'">
        <span class="product-tag">${escapeHTML(product.tag || "LerauWear PICK")}</span>
        <button class="quick-add" data-add="${product.id}" aria-label="Tambah ${escapeHTML(product.name)} ke tas">+</button>
      </div>
      <div class="product-meta"><div><h3>${escapeHTML(product.name)}</h3><span class="product-category">${escapeHTML(product.category)}</span></div><span class="product-price">${rupiah(Number(product.price))}</span></div>
      <div class="product-rating">★ ${escapeHTML(product.rating || "4.8")} <span>· Pilihan LerauWear</span></div>
    </article>`).join("");
}

// Mencegah teks katalog dimasukkan sebagai HTML tanpa disaring.
function escapeHTML(value) {
  return String(value ?? "").replace(/[&<>"']/g, (char) => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;" }[char]));
}

// FUNCTION + KONDISI: validasi produk dan perbarui jumlah pada keranjang.
function addToCart(productId) {
  const product = state.products.find((item) => Number(item.id) === Number(productId));
  if (!product) return showToast("Produk tidak ditemukan.");
  const existing = state.cart.find((item) => item.id === product.id);
  if (existing) existing.quantity += 1;
  else state.cart.push({ ...product, quantity: 1 });
  renderCart();
  showToast(`${product.name} ditambahkan ke tas.`);
}
function changeQuantity(productId, delta) {
  const item = state.cart.find((product) => product.id === Number(productId));
  if (!item) return;
  item.quantity += delta;
  if (item.quantity <= 0) state.cart = state.cart.filter((product) => product.id !== Number(productId));
  renderCart();
}
function removeFromCart(productId) {
  state.cart = state.cart.filter((product) => product.id !== Number(productId));
  renderCart();
}

// LOOPING + OPERASI: hitung jumlah barang dan total harga.
function renderCart() {
  const count = state.cart.reduce((sum, item) => sum + item.quantity, 0);
  const total = state.cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  $("#cartCount").textContent = count;
  $("#drawerCount").textContent = `(${count})`;
  $("#cartTotal").textContent = rupiah(total);
  if (!state.cart.length) {
    $("#cartItems").innerHTML = '<p class="empty-cart">Tas belanjamu masih kosong. Yuk cari outfit favorit!</p>';
    return;
  }
  $("#cartItems").innerHTML = state.cart.map((item) => `
    <div class="cart-item">
      <img src="${escapeHTML(item.image)}" alt="${escapeHTML(item.name)}">
      <div><h4>${escapeHTML(item.name)}</h4><small>${rupiah(item.price)}</small>
        <div class="quantity-control"><button data-quantity="-1" data-id="${item.id}" aria-label="Kurangi jumlah">−</button><span>${item.quantity}</span><button data-quantity="1" data-id="${item.id}" aria-label="Tambah jumlah">+</button></div>
      </div><button class="remove-item" data-remove="${item.id}" aria-label="Hapus ${escapeHTML(item.name)}">×</button>
    </div>`).join("");
}
function openCart() { $("#cartOverlay").classList.add("open"); $("#cartOverlay").setAttribute("aria-hidden", "false"); document.body.style.overflow = "hidden"; }
function closeCart() { $("#cartOverlay").classList.remove("open"); $("#cartOverlay").setAttribute("aria-hidden", "true"); document.body.style.overflow = ""; }
let toastTimer;
function showToast(message) {
  const toast = $("#toast"); toast.textContent = message; toast.classList.add("show");
  clearTimeout(toastTimer); toastTimer = setTimeout(() => toast.classList.remove("show"), 2400);
}

// Checkout membentuk ringkasan dan membuka WhatsApp; ganti nomor di bawah dengan nomor admin toko.
function checkout() {
  if (!state.cart.length) return showToast("Tas belanjamu masih kosong.");
  const adminWhatsApp = "6281234567890"; // GANTI dengan nomor WhatsApp admin, gunakan kode negara tanpa tanda +
  const lines = state.cart.map((item) => `• ${item.name} x${item.quantity} — ${rupiah(item.price * item.quantity)}`);
  const total = state.cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const message = `Halo LerauWear, saya ingin memesan:%0A${encodeURIComponent(lines.join("\n"))}%0A%0ATotal: ${encodeURIComponent(rupiah(total))}%0A%0AMohon info ukuran, stok, dan ongkir.`;
  window.open(`https://wa.me/${adminWhatsApp}?text=${message}`, "_blank", "noopener,noreferrer");
}

// EVENT HANDLERS: interaksi pengguna pada filter, produk, keranjang, dan formulir.
$("#filterList").addEventListener("click", (event) => {
  const button = event.target.closest("[data-category]");
  if (!button) return;
  state.category = button.dataset.category;
  document.querySelectorAll(".filter-chip").forEach((chip) => chip.classList.toggle("active", chip === button));
  renderProducts();
});
$("#productGrid").addEventListener("click", (event) => {
  const button = event.target.closest("[data-add]");
  if (button) addToCart(Number(button.dataset.add));
});
$("#cartItems").addEventListener("click", (event) => {
  const quantityButton = event.target.closest("[data-quantity]");
  const removeButton = event.target.closest("[data-remove]");
  if (quantityButton) changeQuantity(Number(quantityButton.dataset.id), Number(quantityButton.dataset.quantity));
  if (removeButton) removeFromCart(Number(removeButton.dataset.remove));
});
$("#searchInput").addEventListener("input", (event) => { state.query = event.target.value; state.showAll = true; renderProducts(); });
$("#searchToggle").addEventListener("click", () => { $("#searchBox").scrollIntoView({ behavior: "smooth", block: "center" }); $("#searchInput").focus(); });
$("#showAll").addEventListener("click", () => { state.showAll = !state.showAll; $("#showAll").innerHTML = state.showAll ? 'Tampilkan lebih sedikit <span>↑</span>' : 'Lihat semua koleksi <span>↓</span>'; renderProducts(); });
$("#cartOpen").addEventListener("click", openCart);
$("#cartClose").addEventListener("click", closeCart);
$("#cartCloseX").addEventListener("click", closeCart);
$("#checkoutButton").addEventListener("click", checkout);
$("#menuToggle").addEventListener("click", () => $("#navLinks").classList.toggle("open"));
document.querySelectorAll("#navLinks a").forEach((link) => link.addEventListener("click", () => $("#navLinks").classList.remove("open")));
$("#newsletterForm").addEventListener("submit", (event) => {
  event.preventDefault();
  const email = $("#emailInput").value.trim();
  if (!email.includes("@")) return showToast("Masukkan alamat email yang valid.");
  $("#newsletterMessage").textContent = "Terima kasih! Email kamu sudah tercatat di demo ini.";
  $("#emailInput").value = "";
});
$("#year").textContent = new Date().getFullYear();
document.addEventListener("keydown", (event) => { if (event.key === "Escape") closeCart(); });
loadProducts();