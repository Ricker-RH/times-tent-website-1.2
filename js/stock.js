// stock.js

document.addEventListener("DOMContentLoaded", () => {
    const productList = document.getElementById("productList");
    const searchInput = document.getElementById("searchInput");
    const searchBtn = document.getElementById("searchBtn");
    const prevPageBtn = document.querySelector(".prev-page");
    const nextPageBtn = document.querySelector(".next-page");
    const pageInfo = document.getElementById("pageInfo");
  
    const productsPerPage = 10;
    let currentPage = 1;
    let filteredProducts = [];
  
    // 生成 50 个示例产品
    const products = Array.from({ length: 50 }, (_, i) => {
      const id = i + 1;
      return {
        name: `产品 ${id}`,
        model: `型号 X-${100 + id}`,
        price: `¥ ${(10000 + id * 100).toLocaleString()}`,
        desc: `这是产品 ${id} 的简要介绍，适合活动、仓储及多种应用场景。`,
        images: [
          "images/product-renzi.jpg",
          "images/product-hu.jpg",
          "images/product-wanqu.jpg"
        ]
      };
    });
  
    // 渲染产品列表
    function renderProducts(list, page = 1) {
      productList.innerHTML = "";
      const start = (page - 1) * productsPerPage;
      const end = page * productsPerPage;
      const pageProducts = list.slice(start, end);
  
      pageProducts.forEach((product, index) => {
        const productCard = document.createElement("div");
        productCard.className = "product-card";
  
        productCard.innerHTML = `
          <div class="product-img-wrapper">
            ${product.images
              .map(
                (img, i) =>
                  `<img src="${img}" class="${i === 0 ? "active" : ""}" alt="${product.name}图${i +
                    1}">`
              )
              .join("")}
            <button class="prev">‹</button>
            <button class="next">›</button>
          </div>
          <div class="product-info">
            <h3>${product.name}</h3>
            <p>${product.model}</p>
            <p>${product.price}</p>
            <p>${product.desc}</p>
          </div>
        `;
  
        productList.appendChild(productCard);
  
        // 初始化轮播
        initCarousel(productCard.querySelector(".product-img-wrapper"));
      });
  
      // 更新分页信息
      pageInfo.textContent = `第 ${page} 页 / 共 ${Math.ceil(
        list.length / productsPerPage
      )} 页`;
  
      // 按钮状态
      prevPageBtn.disabled = page === 1;
      nextPageBtn.disabled = page === Math.ceil(list.length / productsPerPage);
    }
  
    // 初始化轮播
    function initCarousel(wrapper) {
      const imgs = wrapper.querySelectorAll("img");
      const prev = wrapper.querySelector(".prev");
      const next = wrapper.querySelector(".next");
      let index = 0;
  
      function showImage(i) {
        imgs.forEach((img, idx) => {
          img.classList.toggle("active", idx === i);
        });
      }
  
      prev.addEventListener("click", () => {
        index = (index - 1 + imgs.length) % imgs.length;
        showImage(index);
      });
  
      next.addEventListener("click", () => {
        index = (index + 1) % imgs.length;
        showImage(index);
      });
    }
  
    // 搜索功能
    function searchProducts() {
      const keyword = searchInput.value.trim();
      if (keyword === "") {
        filteredProducts = products;
      } else {
        filteredProducts = products.filter(p =>
          p.name.includes(keyword) || p.model.includes(keyword)
        );
      }
      currentPage = 1;
      renderProducts(filteredProducts, currentPage);
    }
  
    // 事件绑定
    searchBtn.addEventListener("click", searchProducts);
    searchInput.addEventListener("keypress", e => {
      if (e.key === "Enter") searchProducts();
    });
  
    prevPageBtn.addEventListener("click", () => {
      if (currentPage > 1) {
        currentPage--;
        renderProducts(filteredProducts, currentPage);
      }
    });
  
    nextPageBtn.addEventListener("click", () => {
      if (currentPage < Math.ceil(filteredProducts.length / productsPerPage)) {
        currentPage++;
        renderProducts(filteredProducts, currentPage);
      }
    });
  
    // 初始加载
    filteredProducts = products;
    renderProducts(filteredProducts, currentPage);
  });


  // 为每个产品卡片添加轮播功能
  document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".product-card").forEach(card => {
      const imgs = card.querySelectorAll("img");
      const prevBtn = card.querySelector(".prev");
      const nextBtn = card.querySelector(".next");
      let currentIndex = 0;
  
      function showImage(index) {
        imgs.forEach((img, i) => {
          img.classList.toggle("active", i === index);
        });
      }
  
      // 默认显示第一张
      showImage(currentIndex);
  
      prevBtn.addEventListener("click", () => {
        currentIndex = (currentIndex - 1 + imgs.length) % imgs.length;
        showImage(currentIndex);
      });
  
      nextBtn.addEventListener("click", () => {
        currentIndex = (currentIndex + 1) % imgs.length;
        showImage(currentIndex);
      });
    });
  });