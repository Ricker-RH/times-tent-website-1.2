// script.js — 完整交互（mega menu / 轮播 / Sidebar 独立 / Tab / 回到顶部 / 动画）
document.addEventListener('DOMContentLoaded', () => {

  /* ---------- 轮播（如果页面有） ---------- */
  const slides = document.querySelectorAll('.carousel .slide');
  const dotsContainer = document.querySelector('.caro-dots');
  const leftBtn = document.querySelector('.caro-arrow.left');
  const rightBtn = document.querySelector('.caro-arrow.right');
  let idx = 0, interval, delay = 4000;
  if (slides.length) {
    slides.forEach((_, i) => {
      const btn = document.createElement('button');
      btn.dataset.index = i;
      if (i === 0) btn.classList.add('active');
      dotsContainer.appendChild(btn);
    });
    const dots = dotsContainer.querySelectorAll('button');
    const show = (i) => {
      slides.forEach((s,k)=>{ 
        s.classList.toggle('active', k===i); 
        s.setAttribute('aria-hidden', k===i ? 'false' : 'true'); 
      });
      dots.forEach((d,k)=> d.classList.toggle('active', k===i));
      idx = i;
    };
    const next = ()=> show((idx+1)%slides.length);
    const prev = ()=> show((idx-1+slides.length)%slides.length);
    const start = ()=> { interval = setInterval(next, delay); };
    const stop = ()=> { clearInterval(interval); };
    rightBtn?.addEventListener('click', ()=>{ next(); stop(); start(); });
    leftBtn?.addEventListener('click', ()=>{ prev(); stop(); start(); });
    dots.forEach(d => d.addEventListener('click', ()=> { show(+d.dataset.index); stop(); start(); }));
    const viewport = document.querySelector('.caro-viewport');
    viewport?.addEventListener('mouseenter', stop);
    viewport?.addEventListener('mouseleave', start);
    show(0); start();
  }

  /* ---------- mega menu 行为（案例 & 产品） ---------- */
  const header = document.getElementById('siteHeader');
  const dropdowns = document.querySelectorAll('.dropdown');
  dropdowns.forEach(dd => {
    const menu = dd.dataset.menu;
    dd.addEventListener('mouseenter', () => {
      if (window.innerWidth > 900) {
        header.classList.add('expanded');
        header.setAttribute('data-active', menu);
      }
    });
  });
  header?.addEventListener('mouseleave', () => {
    if (window.innerWidth > 900) {
      header.classList.remove('expanded');
      header.removeAttribute('data-active');
    }
  });
  // mobile: 点击切换
  document.querySelectorAll('.dropdown .dropdown-toggle').forEach(toggle => {
    toggle.addEventListener('click', (e) => {
      if (window.innerWidth <= 900) {
        e.preventDefault();
        const parent = toggle.closest('.dropdown');
        const menu = parent?.dataset.menu || '';
        const isOpen = header.classList.toggle('expanded');
        if (isOpen) header.setAttribute('data-active', menu);
        else header.removeAttribute('data-active');
      }
    });
  });

  /* ---------- 回到顶部 ---------- */
  const backBtn = document.getElementById('backToTop');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) backBtn?.classList.add('show'); 
    else backBtn?.classList.remove('show');
  });
  backBtn?.addEventListener('click', ()=> window.scrollTo({ top: 0, behavior: 'smooth' }));

  /* ---------- 表单提交 ---------- */
  const form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      alert('已提交，感谢您的留言！我们会尽快与您联系。');
      form.reset();
    });
  }

  /* ---------- 进场/滚动进入动画（区分 sports 页面） ---------- */
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('animate-show');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

if (document.body.classList.contains('sports-page')) {
  // sports.html → 案例卡片直接显示，不用 observer
  document.querySelectorAll('.sports-page .cases-grid .case-card').forEach(card => {
    card.classList.add('animate-show');
    card.style.opacity = '1';
    card.style.transform = 'translateY(0)';
  });

  // 仍然观察其他需要动画的元素（非案例卡）
  document.querySelectorAll('.product-card, .section-title, .stat-card')
    .forEach(el => observer.observe(el));
} else {
  // 其他页面（例如 cases/index.html） → 正常观察所有元素
  document.querySelectorAll('.case-card, .case-item, .product-card, .section-title, .stat-card')
  .forEach(el => observer.observe(el));
}

  /* ---------- 移动端主菜单 ---------- */
  const mobileBtn = document.getElementById('mobileMenuBtn');
  const nav = document.querySelector('.main-nav');
  mobileBtn?.addEventListener('click', () => {
    nav.classList.toggle('open');
    mobileBtn.classList.toggle('open');
    if (!nav.classList.contains('open')) header.classList.remove('expanded');
  });

  /* ---------- Sidebar 树形（完全独立、只由用户控制） ---------- */
  const sidebarToggles = document.querySelectorAll('.sidebar-toggle');
  const storageKey = 'site_sidebar_open_v1';

  function saveSidebarState() {
    try {
      const state = {};
      sidebarToggles.forEach((btn, i) => {
        const li = btn.parentElement;
        const key = btn.dataset.tab || `__idx_${i}`;
        state[key] = !!(li && li.classList.contains('open'));
      });
      localStorage.setItem(storageKey, JSON.stringify(state));
    } catch (e) {}
  }

  function restoreSidebarState() {
    try {
      const raw = localStorage.getItem(storageKey);
      if (!raw) return;
      const state = JSON.parse(raw);
      sidebarToggles.forEach((btn, i) => {
        const li = btn.parentElement;
        const key = btn.dataset.tab || `__idx_${i}`;
        if (!li) return;
        if (state[key]) li.classList.add('open');
        else li.classList.remove('open');
      });
    } catch (e) {}
  }

  // 恢复上次用户的手动状态
  restoreSidebarState();

  // 点击分组按钮：只切换当前分组，不影响其他分组
  sidebarToggles.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopImmediatePropagation();
      const li = btn.parentElement;
      if (!li) return;
      li.classList.toggle('open');
      saveSidebarState();
    });
  });

  // 子菜单链接：跳转或滚动，不保存状态（避免闪烁）
  document.querySelectorAll('.sub-list a').forEach(link => {
    link.addEventListener('click', (e) => {
      e.stopImmediatePropagation();
      e.stopPropagation();

      const href = link.getAttribute('href') || '';

      if (href.startsWith('#')) {
        // 页面内锚点：平滑滚动
        e.preventDefault();
        const id = href.slice(1);
        setTimeout(() => {
          const target = document.getElementById(id);
          if (target) {
            const rect = target.getBoundingClientRect();
            const offsetTop = rect.top + window.scrollY - (window.innerWidth > 900 ? 100 : 80);
            window.scrollTo({ top: offsetTop, behavior: 'smooth' });
            target.setAttribute('tabindex', '-1');
            target.focus({ preventScroll: true });
            setTimeout(()=> target.removeAttribute('tabindex'), 1500);
          }
        }, 200);
      }
      // 普通链接直接跳转，不触发 saveSidebarState()
    }, { passive: false });
  });

  /* ---------- Tab 切换（仅右侧内容，不影响 Sidebar） ---------- */
  const tabButtons = document.querySelectorAll('.tab-btn');
  const tabPanels = document.querySelectorAll('.tab-panel');

  function activateTab(tabName) {
    if (!tabName) return;
    tabButtons.forEach(b => b.classList.toggle('active', b.dataset.tab === tabName));
    tabPanels.forEach(p => p.classList.toggle('active', p.id === tabName));
  }

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const tabName = btn.dataset.tab;
      activateTab(tabName);
      const y = (document.querySelector('.cases-content')?.getBoundingClientRect().top || 200) + window.scrollY - 90;
      window.scrollTo({ top: y, behavior: 'smooth' });
    });
  });

});

/* ---------- 案例轮播（修复 5->1 卡住 的稳定实现） ---------- */
document.addEventListener('DOMContentLoaded', () => {
  const carousel = document.querySelector('.case-carousel');
  if (!carousel) return;

  const track = carousel.querySelector('.case-track');
  if (!track) return;

  // 取当前卡片（真实 DOM 子项）
  const initialCards = Array.from(track.querySelectorAll('.case-card'));
  if (initialCards.length === 0) return;

  // 克隆首尾并标记（保留 dataset.clone，避免之后被误删时丢失判断）
  const firstClone = initialCards[0].cloneNode(true);
  const lastClone = initialCards[initialCards.length - 1].cloneNode(true);
  firstClone.classList.add('clone');
  lastClone.classList.add('clone');
  firstClone.dataset.clone = 'true';
  lastClone.dataset.clone = 'true';

  // 把 lastClone 放到最前，把 firstClone 放到最后
  track.insertBefore(lastClone, track.firstElementChild);
  track.appendChild(firstClone);

  const allCards = Array.from(track.children); // 包含 clone
  const total = allCards.length;

  // 初始 current 指向第一个真实项（注意：插入 lastClone 后，真实第一项索引为 1）
  let current = 1;
  let isTransitioning = false;
  let fallbackTimer = null;
  const TRANS_MS = 620; // 与 CSS 动画时间保持一致（ms）

  // 辅助：清除超时备援
  function clearFallback() {
    if (fallbackTimer) {
      clearTimeout(fallbackTimer);
      fallbackTimer = null;
    }
  }

  // 给每张卡片移除状态类（但**不要**覆盖其它 class，如 clone）
  function setActiveClasses() {
    allCards.forEach((card, i) => {
      card.classList.remove('active', 'prev', 'prev2', 'next', 'next2');
    });

    // 计算相对位置（取模）
    allCards.forEach((card, i) => {
      const rel = ((i - current) % total + total) % total;
      if (rel === 0) card.classList.add('active');
      else if (rel === 1) card.classList.add('next');
      else if (rel === 2) card.classList.add('next2');
      else if (rel === total - 1) card.classList.add('prev');
      else if (rel === total - 2) card.classList.add('prev2');
    });
  }

  // 让当前 active 居中
  function updateCarousel(animate = true) {
    const active = allCards[current];
    if (!active) return;

    const carouselWidth = carousel.clientWidth;
    const cardCenter = active.offsetLeft + active.offsetWidth / 2;
    const translateX = Math.round(carouselWidth / 2 - cardCenter);

    // 控制动画（临时覆盖 inline style）
    track.style.transition = animate ? '' : 'none'; // '' 让 CSS 的 transition 生效
    // 触发布局并设置 transform
    requestAnimationFrame(() => {
      track.style.transform = `translateX(${translateX}px)`;
    });

    setActiveClasses();
  }

  // 移动与锁定（并加超时备援）
  function startTransitionLock() {
    isTransitioning = true;
    clearFallback();
    fallbackTimer = setTimeout(() => {
      // 过长时间未收到 transitionend 时强制解锁并尝试瞬移到真实项（保险）
      isTransitioning = false;
      fallbackTimer = null;
      // 如果当前是 clone，尝试瞬移回真实 index（安全检测）
      const cur = allCards[current];
      if (cur && cur.dataset && cur.dataset.clone === 'true') {
        // 寻找与 clone 对应的真实项（比对 innerHTML 或者其它唯一标识）
        const logicalHTML = cur.innerHTML;
        const realIndex = allCards.findIndex((s, idx) => s.dataset.clone !== 'true' && s.innerHTML === logicalHTML);
        if (realIndex > -1) {
          current = realIndex;
          updateCarousel(false);
        }
      }
    }, TRANS_MS + 200);
  }

  function moveNext() {
    if (isTransitioning) return;
    startTransitionLock();
    current = (current + 1);
    updateCarousel(true);
  }

  function movePrev() {
    if (isTransitioning) return;
    startTransitionLock();
    current = (current - 1);
    updateCarousel(true);
  }

  // transitionend：关键处理 clone -> 真实项 的瞬移
  track.addEventListener('transitionend', (e) => {
    if (e.propertyName !== 'transform') return;

    clearFallback();

    const curSlide = allCards[current];
    if (curSlide && curSlide.dataset && curSlide.dataset.clone === 'true') {
      // 如果当前是尾部 clone（index = last），跳到真实第一张（index = 1）
      if (current === allCards.length - 1) {
        current = 1;
      }
      // 如果当前是头部 clone（index = 0），跳到真实最后一张（index = allCards.length - 2）
      else if (current === 0) {
        current = allCards.length - 2;
      }
      // 瞬移到真实索引（不带动画）
      updateCarousel(false);
    }

    // 解锁
    isTransitioning = false;
  });

  // 绑定按钮
  const prevBtn = carousel.querySelector('.case-arrow.left');
  const nextBtn = carousel.querySelector('.case-arrow.right');
  nextBtn?.addEventListener('click', moveNext);
  prevBtn?.addEventListener('click', movePrev);

  // 触摸支持
  let startX = 0;
  track.addEventListener('touchstart', (e) => { startX = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend', (e) => {
    if (isTransitioning) return;
    const dx = e.changedTouches[0].clientX - startX;
    if (dx > 40) movePrev();
    else if (dx < -40) moveNext();
  }, { passive: true });

  // resize 重新居中（无动画）
  window.addEventListener('resize', () => { setTimeout(() => updateCarousel(false), 90); });

  // 初始定位（无动画）
  updateCarousel(false);
});

document.querySelectorAll(".toggle-btn").forEach(btn => {
  btn.addEventListener("click", (e) => {
    e.preventDefault();
    btn.closest("li").classList.toggle("open");
  });
});

