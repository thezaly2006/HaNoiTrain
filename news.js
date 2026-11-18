/* ============================================================================
   TIN TỨC – dùng chung cho index.html (hiển thị) và admin.html (quản trị)
   ============================================================================ */
(function () {
  var API = String(window.NEWS_API_URL || '').trim();
  var LS_KEY = 'hanoitrain_news_demo_v2';

  // ----- Tin mẫu (chỉ dùng khi chưa có link Apps Script) -----
  var DEMO = [
    { id: 'demo1', title: '[Demo] Tiêu đề bài viết được ghim số 1', summary: 'Đây là đoạn mô tả ngắn của bài viết. Khi chạy thật, bạn nhập nội dung này trong trang quản trị admin.html. Chỉ những bài được admin ghim mới hiện ở mục Tin tức trên trang chủ', image: 'toa/o-cau-den-6.jpg', link: 'https://example.com', category: 'Cẩm nang đi tàu', author: 'Ban biên tập', date: '2026-11-18', status: 'published', pinned: true },
    { id: 'demo2', title: '[Demo] Tiêu đề bài viết được ghim số 2', summary: 'Mỗi bài có ảnh, tiêu đề, mô tả ngắn, ngày đăng, tên tác giả và đường link tới bài viết đầy đủ (nếu có). Bài mới nhất được xếp lên đầu', image: 'toa/o-cau-den-1.jpg', link: '', category: 'Sự kiện', author: '', date: '2026-11-15', status: 'published', pinned: true },
    { id: 'demo3', title: '[Demo] Bài này chưa được ghim nên không hiện ở trang chủ', summary: 'Admin bấm "Ghim" trong trang quản trị thì bài mới hiện ở mục Tin tức.', image: 'toa/o-quan-chuong-1.jpg', link: '', category: 'Khuyến mãi', author: '', date: '2026-11-10', status: 'published', pinned: false }
  ];

  // ----- Tiện ích -----
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  // Chỉ cho phép link http(s) hoặc đường dẫn tương đối (chặn javascript:)
  function safeUrl(u) {
    u = String(u || '').trim();
    if (!u) return '';
    if (/^https?:\/\//i.test(u)) return u;
    if (/^[a-z][a-z0-9+.-]*:/i.test(u) || u.indexOf('//') === 0) return '';
    return u;
  }
  function fmtDate(d) {
    var m = /^(\d{4})-(\d{2})-(\d{2})/.exec(String(d || ''));
    return m ? m[3] + '/' + m[2] + '/' + m[1] : '';
  }
  // Tiêu đề -> đường dẫn: "Tàu Hà Nội 5 Cửa Ô buổi tối" -> "tau-ha-noi-5-cua-o-buoi-toi"
  function slugify(t) {
    var s = String(t || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 90).replace(/-+$/, '');
    return s || 'bai-viet';
  }
  function assignSlugs(list) {
    var used = {};
    list.forEach(function (it) {
      var base = slugify(it.title), s = base, n = 2;
      while (used[s]) s = base + '-' + (n++);
      used[s] = 1; it.slug = s;
    });
    return list;
  }
  // Link tới trang chi tiết (xem news-config.js: NEWS_PRETTY_URL)
  function postUrl(it) {
    return window.NEWS_PRETTY_URL ? '/' + it.slug + '/' : 'bai-viet.html?bai=' + encodeURIComponent(it.slug);
  }
  function byDateDesc(a, b) {
    return String(b.date || '').localeCompare(String(a.date || ''));
  }
  function clean(it) {
    return {
      id: it.id || '',
      title: String(it.title || '').trim().slice(0, 200),
      summary: String(it.summary || '').trim().slice(0, 600),
      content: String(it.content || '').trim().slice(0, 40000),
      image: safeUrl(it.image),
      link: safeUrl(it.link),
      category: String(it.category || '').trim().slice(0, 40),
      author: String(it.author || '').trim().slice(0, 60),
      date: String(it.date || '').slice(0, 10),
      status: it.status === 'draft' ? 'draft' : 'published',
      pinned: it.pinned === true || it.pinned === 'true'
    };
  }

  // ----- Kho lưu trữ DEMO (localStorage) -----
  function demoLoad() {
    try { var r = localStorage.getItem(LS_KEY); if (r) return JSON.parse(r); } catch (e) {}
    return DEMO.slice();
  }
  function demoSave(list) { try { localStorage.setItem(LS_KEY, JSON.stringify(list)); } catch (e) {} }

  // ----- Gọi Apps Script -----
  function post(body) {
    // Không đặt header → trình duyệt gửi text/plain, tránh lỗi CORS preflight
    return fetch(API, { method: 'POST', body: JSON.stringify(body) }).then(function (r) { return r.json(); });
  }

  function published() {
    return (API
      ? fetch(API + '?action=list').then(function (r) { return r.json(); }).then(function (d) { return d.items || []; })
      : Promise.resolve(demoLoad())
    ).then(function (list) {
      return assignSlugs(list.map(clean).filter(function (x) { return x.status !== 'draft' && x.title; }).sort(byDateDesc));
    });
  }

  var HNNews = {
    hasApi: !!API,
    esc: esc, safeUrl: safeUrl, fmtDate: fmtDate,

    // Toàn bộ bài đã đăng (không cần ghim), mới nhất trước, đã có slug
    listPublished: published,
    // Danh sách công khai ở trang chủ: bài đã đăng VÀ đã được admin ghim
    list: function () {
      return published().then(function (l) { return l.filter(function (x) { return x.pinned; }); });
    },
    postUrl: postUrl, slugify: slugify,
    // Danh sách cho admin (gồm cả bản nháp)
    listAll: function (pw) {
      if (!API) return Promise.resolve(demoLoad().sort(byDateDesc));
      return post({ action: 'listAll', password: pw }).then(function (d) {
        if (!d.ok) throw new Error(d.error || 'error');
        return (d.items || []).sort(byDateDesc);
      });
    },
    auth: function (pw) {
      if (!API) return Promise.resolve(true);
      return post({ action: 'auth', password: pw }).then(function (d) { return !!d.ok; });
    },
    save: function (item, pw) {
      item = clean(item);
      if (!API) {
        var l = demoLoad(), i = -1;
        if (item.id) l.forEach(function (x, k) { if (x.id === item.id) i = k; });
        if (i >= 0) l[i] = item; else { item.id = 'n' + Date.now(); l.unshift(item); }
        demoSave(l);
        return Promise.resolve({ ok: true, id: item.id });
      }
      return post({ action: 'save', password: pw, item: item }).then(function (d) {
        if (!d.ok) throw new Error(d.error || 'error');
        return d;
      });
    },
    remove: function (id, pw) {
      if (!API) {
        demoSave(demoLoad().filter(function (x) { return x.id !== id; }));
        return Promise.resolve({ ok: true });
      }
      return post({ action: 'delete', password: pw, id: id }).then(function (d) {
        if (!d.ok) throw new Error(d.error || 'error');
        return d;
      });
    },
    resetDemo: function () { try { localStorage.removeItem(LS_KEY); } catch (e) {} }
  };
  window.HNNews = HNNews;

  // ===========================================================================
  // HIỂN THỊ TRÊN TRANG CHỦ (chỉ chạy khi có #newsGrid)
  // ===========================================================================
  var grid = document.getElementById('newsGrid');
  if (!grid) return;
  var MAX = 5; // số tin ghim tối đa hiện trên trang chủ

  function card(it, i) {
    var img = safeUrl(it.image), url = esc(postUrl(it));
    var meta = [];
    if (it.date) meta.push('<time datetime="' + esc(it.date) + '">' + fmtDate(it.date) + '</time>');
    if (it.author) meta.push('Bởi ' + esc(it.author));
    return '<article class="news-card" style="--i:' + i + '">' +
      '<span class="news-pin">📌 Tin ghim</span>' +
      '<h3 class="news-title"><a href="' + url + '">' + esc(it.title) + '</a></h3>' +
      (meta.length ? '<div class="news-meta">' + meta.join(' <i>·</i> ') + '</div>' : '') +
      (img ? '<a class="news-imglink" href="' + url + '" tabindex="-1" aria-hidden="true"><span class="news-img"><img src="' + esc(img) + '" alt="" loading="lazy" decoding="async" onerror="this.parentNode.parentNode.removeChild(this.parentNode)"></span></a>' : '') +
      '<p class="news-sum">' + esc(it.summary) + ' … <a class="news-more" href="' + url + '">Đọc tiếp</a></p>' +
      (it.category ? '<div class="news-foot">📁 <span>' + esc(it.category) + '</span></div>' : '') +
    '</article>';
  }

  function reveal() {
    var cards = [].slice.call(grid.querySelectorAll('.news-card'));
    if (!('IntersectionObserver' in window)) { cards.forEach(function (c) { c.classList.add('in'); }); return; }
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { threshold: 0.08, rootMargin: '0px 0px 40px 0px' });
    cards.forEach(function (c) { io.observe(c); });
  }

  HNNews.list().then(function (items) {
    items = items.filter(function (x) { return x.title; }).slice(0, MAX);
    grid.innerHTML = items.length
      ? items.map(card).join('')
      : '<p class="news-empty">Tin tức nổi bật đang được cập nhật. Quý khách vui lòng quay lại sau.</p>';
    reveal();
  }).catch(function () {
    grid.innerHTML = '<p class="news-empty">Chưa tải được tin tức. Quý khách vui lòng thử lại sau.</p>';
  });
})();