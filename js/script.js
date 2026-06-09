/**
 * cacticacti Website Interactive Features
 * Handcrafted for cactus shop experience
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Cart counter
  initCart();
  
  // Initialize Back to Top Button
  initBackToTop();
  
  // Initialize Toast Notification system
  initToast();

  // Initialize Search bar handling
  initSearchBar();

  // Page Specific: Product Detail Page Logic
  if (document.querySelector('.product-gallery')) {
    initProductPage();
  }
});

/**
 * 1. Shopping Cart System (persisted via localStorage)
 */
function initCart() {
  const cartBadge = document.querySelector('.badge-cart');
  if (!cartBadge) return;

  // Read count from localStorage
  let cartCount = parseInt(localStorage.getItem('cacticacti_cart_count')) || 0;
  updateCartBadge(cartCount);

  // Bind all "Add to Cart" buttons
  const addCartBtns = document.querySelectorAll('.js-add-to-cart');
  addCartBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();

      // Retrieve quantity (if on product detail page, read quantity input, else default to 1)
      let quantity = 1;
      const qtyInput = document.querySelector('.qty-input');
      if (qtyInput && e.currentTarget.classList.contains('btn-cart')) {
        quantity = parseInt(qtyInput.value) || 1;
      }

      cartCount += quantity;
      localStorage.setItem('cacticacti_cart_count', cartCount);
      updateCartBadge(cartCount);

      // Trigger Toast notification
      const productName = e.currentTarget.getAttribute('data-product-name') || '商品';
      showToast(`已將 ${quantity} 件「${productName}」加入購物車！`);
    });
  });
}

function updateCartBadge(count) {
  const cartBadge = document.querySelector('.badge-cart');
  if (!cartBadge) return;
  
  cartBadge.textContent = count;
  cartBadge.style.display = 'block';
}

/**
 * 2. Custom Toast System
 */
let toastTimeout;
function initToast() {
  // Create toast container if it doesn't exist
  if (!document.querySelector('.toast-container-custom')) {
    const container = document.createElement('div');
    container.className = 'toast-container-custom';
    container.innerHTML = `
      <div class="toast-custom" id="cartToast">
        <span class="toast-icon">🛒</span>
        <span class="toast-message">商品已加入購物車</span>
      </div>
    `;
    document.body.appendChild(container);
  }
}

function showToast(message) {
  const toast = document.getElementById('cartToast');
  if (!toast) return;

  const msgSpan = toast.querySelector('.toast-message');
  msgSpan.textContent = message;

  toast.classList.add('show');

  // Clear previous timer if active
  if (toastTimeout) {
    clearTimeout(toastTimeout);
  }

  // Dismiss toast after 3 seconds
  toastTimeout = setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
}

/**
 * 3. Search Bar Interaction
 */
function initSearchBar() {
  const searchForm = document.querySelector('.bw-search-group');
  if (!searchForm) return;

  const searchInput = searchForm.querySelector('.bw-search-input');
  const searchSelect = searchForm.querySelector('.bw-search-select');
  const searchBtn = searchForm.querySelector('.bw-search-btn');

  const executeSearch = () => {
    const query = searchInput.value.trim();
    const category = searchSelect.value;
    
    if (query) {
      showToast(`正在搜尋「${category}」分類中的：${query}...`);
    } else {
      showToast(`正在為您載入「${category}」的所有精選仙人掌！`);
    }
  };

  searchBtn.addEventListener('click', (e) => {
    e.preventDefault();
    executeSearch();
  });

  searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      executeSearch();
    }
  });
}

/**
 * 4. Product Details Page Interactivity
 * (Quantity selectors, gallery switching, tabs)
 */
function initProductPage() {
  // Gallery Thumbnail Switcher
  const mainImg = document.querySelector('.product-main-img');
  const thumbs = document.querySelectorAll('.thumb-item');

  thumbs.forEach(thumb => {
    thumb.addEventListener('click', function() {
      // Deactivate other thumbs
      thumbs.forEach(t => t.classList.remove('active'));
      
      // Activate clicked thumb
      this.classList.add('active');
      
      // Change main image source with smooth transition
      mainImg.style.opacity = 0.3;
      setTimeout(() => {
        mainImg.src = this.src;
        mainImg.style.opacity = 1;
      }, 150);
    });
  });

  // Quantity Incrementor / Decrementor
  const qtyInput = document.querySelector('.qty-input');
  const btnMinus = document.querySelector('.qty-btn.minus');
  const btnPlus = document.querySelector('.qty-btn.plus');

  if (qtyInput && btnMinus && btnPlus) {
    btnMinus.addEventListener('click', () => {
      let val = parseInt(qtyInput.value) || 1;
      if (val > 1) {
        qtyInput.value = val - 1;
      }
    });

    btnPlus.addEventListener('click', () => {
      let val = parseInt(qtyInput.value) || 1;
      if (val < 99) {
        qtyInput.value = val + 1;
      }
    });

    qtyInput.addEventListener('change', () => {
      let val = parseInt(qtyInput.value) || 1;
      if (val < 1) qtyInput.value = 1;
      if (val > 99) qtyInput.value = 99;
    });
  }

  // Custom Detail Tabs Switching (in case bootstrap native triggers aren't loaded or need overrides)
  const tabLinks = document.querySelectorAll('.product-tabs .nav-link');
  const tabPanes = document.querySelectorAll('.tab-content-custom .tab-pane');

  tabLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      
      // Remove active from all tabs
      tabLinks.forEach(l => l.classList.remove('active'));
      tabPanes.forEach(p => {
        p.classList.remove('show', 'active');
        p.style.display = 'none';
      });

      // Add active to current
      this.classList.add('active');
      const targetId = this.getAttribute('href');
      const targetPane = document.querySelector(targetId);
      if (targetPane) {
        targetPane.style.display = 'block';
        setTimeout(() => {
          targetPane.classList.add('show', 'active');
        }, 50);
      }
    });
  });
}

/**
 * 5. Back to Top Button
 */
function initBackToTop() {
  const backBtn = document.createElement('button');
  backBtn.innerHTML = '▲';
  backBtn.style.cssText = `
    position: fixed;
    bottom: 25px;
    left: 25px;
    width: 45px;
    height: 45px;
    border-radius: 50%;
    background-color: var(--primary-green);
    color: var(--white);
    border: none;
    font-size: 1.2rem;
    cursor: pointer;
    box-shadow: var(--box-shadow-md);
    opacity: 0;
    visibility: hidden;
    transition: all var(--transition-speed);
    z-index: 1000;
  `;
  document.body.appendChild(backBtn);

  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
      backBtn.style.opacity = '1';
      backBtn.style.visibility = 'visible';
    } else {
      backBtn.style.opacity = '0';
      backBtn.style.visibility = 'hidden';
    }
  });

  backBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });

  // Hover styles
  backBtn.addEventListener('mouseenter', () => {
    backBtn.style.backgroundColor = 'var(--medium-green)';
    backBtn.style.transform = 'translateY(-3px)';
  });
  backBtn.addEventListener('mouseleave', () => {
    backBtn.style.backgroundColor = 'var(--primary-green)';
    backBtn.style.transform = 'translateY(0)';
  });
}
