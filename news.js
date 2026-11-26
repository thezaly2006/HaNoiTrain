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
  // Link bất kỳ (trang web, email, điện thoại, #mục, đường dẫn nội bộ...). Chỉ chặn loại nguy hiểm (javascript:, data:...)
  function linkUrl(u) {
    u = String(u || '').replace(/[\u0000-\u001f\u007f]/g, '').trim();
    if (!u) return '';
    if (/^(javascript|data|vbscript|file|blob|about):/i.test(u.replace(/\s/g, ''))) return '';
    if (/^[^\s@\/:]+@[^\s@\/:]+\.[a-z]{2,}$/i.test(u)) return 'mailto:' + u;
    if (/^\+?[0-9][0-9 .()\-]{6,}$/.test(u)) return 'tel:' + u.replace(/[^\d+]/g, '');
    u = u.replace(/\s+/g, '%20');
    if (/^(#|\/|\.\/|\.\.\/)/.test(u)) return u.indexOf('//') === 0 ? 'https:' + u : u;
    if (/^[a-z][a-z0-9+.-]*:/i.test(u)) return u;
    if (/\.(html?|php|pdf|png|jpe?g|webp|gif|svg|docx?|xlsx?|pptx?|zip|mp[34])([?#].*)?$/i.test(u) && !/^www\./i.test(u)) return u;
    if (/^www\./i.test(u) || /^[a-z0-9-]+(\.[a-z0-9-]+)+([\/?#:]|$)/i.test(u)) return 'https://' + u;
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
      link: linkUrl(it.link),
      category: String(it.category || '').trim().slice(0, 40),
      author: String(it.author || '').trim().slice(0, 60),
      date: String(it.date || '').slice(0, 10),
      status: it.status === 'draft' ? 'draft' : 'published',
      pinned: it.pinned === true || it.pinned === 'true'
    };
  }

  // ----- Nội dung bài viết: bài mới lưu dạng HTML (có dấu hiệu đầu), bài cũ dạng chữ thường -----
  var HTML_MARK = '<!--html-->';
  var SKIP = { script:1, style:1, iframe:1, object:1, embed:1, noscript:1, template:1, svg:1, math:1, form:1, input:1, button:1, textarea:1, select:1, link:1, meta:1, head:1, title:1 };
  var FS_KEY = { 'x-small':1, 'small':2, 'medium':3, 'large':4, 'x-large':5, 'xx-large':6, 'xxx-large':7 };

  function cssColor(v) {
    v = String(v || '').trim().toLowerCase();
    if (/^#([0-9a-f]{3}|[0-9a-f]{6})$/.test(v)) return v;
    var m = /^rgba?\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*(?:,\s*([\d.]+)\s*)?\)$/.exec(v);
    if (!m || (m[4] !== undefined && parseFloat(m[4]) === 0)) return '';
    return '#' + [m[1], m[2], m[3]].map(function (n) { return ('0' + Math.min(255, +n).toString(16)).slice(-2); }).join('');
  }
  function oldClass(el, re) {
    var c = String(el.getAttribute('class') || '').split(/\s+/);
    for (var i = 0; i < c.length; i++) if (re.test(c[i])) return c[i];
    return '';
  }

  // Lọc HTML: chỉ giữ các thẻ/thuộc tính an toàn (chặn script, onerror, javascript: ...)
  function sanitize(html) {
    var doc = new DOMParser().parseFromString('<!doctype html><body>' + String(html || ''), 'text/html');
    function kids(node) {
      var o = '';
      for (var i = 0; i < node.childNodes.length; i++) o += one(node.childNodes[i]);
      return o;
    }
    function plain(h) { return h.replace(/<(?!img)[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim(); }
    function one(c) {
      if (c.nodeType === 3) return esc(c.nodeValue);
      if (c.nodeType !== 1) return '';
      var t = c.tagName.toLowerCase();
      if (SKIP[t]) return '';
      if (t === 'br') return '<br>';
      if (t === 'img') {
        var src = c.getAttribute('src') || '', u = safeUrl(src);
        // Chế độ demo (chưa có Apps Script): cho phép ảnh nhúng sẵn dạng data:image để thử
        if (!u && !API && /^data:image\/(png|jpe?g|webp|gif);base64,[a-z0-9+\/=]+$/i.test(src)) u = src;
        return u ? '<img src="' + esc(u) + '" alt="' + esc(c.getAttribute('alt') || '') + '" loading="lazy">' : '';
      }
      if (t === 'div') t = 'p';
      if (t === 'h1') t = 'h2';
      if (t === 'h4' || t === 'h5' || t === 'h6') t = 'h3';
      var inner = kids(c);
      if (t === 'strong') t = 'b';
      if (t === 'em') t = 'i';
      // màu chữ / nền / cỡ chữ có thể nằm ở span, font, hoặc ngay trên b/i/u/a
      if (t === 'span' || t === 'font' || t === 'b' || t === 'i' || t === 'u' || t === 'a') {
        var st = c.style || {}, n = parseInt(c.getAttribute('size'), 10);
        var f = FS_KEY[st.fontSize] || (n >= 1 && n <= 7 ? n : 0);
        var k = f ? 'fs' + f : oldClass(c, /^fs[1-7]$/);
        var col = cssColor(st.color || c.getAttribute('color')), bg = cssColor(st.backgroundColor);
        var style = (col ? 'color:' + col + ';' : '') + (bg ? 'background-color:' + bg + ';' : '');
        if (k || style) inner = '<span' + (k ? ' class="' + k + '"' : '') + (style ? ' style="' + style + '"' : '') + '>' + inner + '</span>';
        if (t === 'span' || t === 'font') return inner;
        if (t !== 'a') return plain(inner) || inner.indexOf('<img') >= 0 ? '<' + t + '>' + inner + '</' + t + '>' : '';
      }
      if (t === 'p' || t === 'h2' || t === 'h3' || t === 'li' || t === 'blockquote') {
        if (!plain(inner)) return '';
        var al = String((c.style && c.style.textAlign) || c.getAttribute('align') || '').toLowerCase();
        var ac = al === 'center' || al === 'right' ? 'ta-' + al : al === 'justify' ? 'ta-justify' : al ? '' : oldClass(c, /^ta-(center|right|justify)$/);
        return '<' + t + (ac ? ' class="' + ac + '"' : '') + '>' + inner + '</' + t + '>';
      }
      if (t === 'ul' || t === 'ol') return inner ? '<' + t + '>' + inner + '</' + t + '>' : '';
      if (t === 'a') {
        var h = linkUrl(c.getAttribute('href'));
        if (!h) return inner;
        return '<a href="' + esc(h) + '"' + (/^https?:/i.test(h) ? ' target="_blank" rel="noopener noreferrer"' : '') + '>' + inner + '</a>';
      }
      if (t === 'figure') return inner.indexOf('<img') >= 0 ? '<figure>' + inner + '</figure>' : '';
      if (t === 'figcaption') return plain(inner) ? '<figcaption>' + inner + '</figcaption>' : '';
      return inner;
    }
    return kids(doc.body);
  }

  // Cách viết cũ: dòng trống = đoạn mới; ## tiêu đề; ### tiêu đề nhỏ; ![mô tả](link ảnh); **đậm**
  function legacyToHtml(t) {
    function inl(s) { return esc(s).replace(/\*\*(.+?)\*\*/g, '<b>$1</b>'); }
    return String(t).replace(/\r/g, '').split(/\n{2,}/).map(function (b) {
      b = b.trim(); if (!b) return '';
      var m = /^!\[(.*?)\]\((.+?)\)$/.exec(b);
      if (m) {
        var u = safeUrl(m[2]); if (!u) return '';
        return '<figure><img src="' + esc(u) + '" alt="' + esc(m[1]) + '" loading="lazy">' + (m[1] ? '<figcaption>' + esc(m[1]) + '</figcaption>' : '') + '</figure>';
      }
      if (/^###\s+/.test(b)) return '<h3>' + inl(b.replace(/^###\s+/, '')) + '</h3>';
      if (/^##\s+/.test(b)) return '<h2>' + inl(b.replace(/^##\s+/, '')) + '</h2>';
      return '<p>' + inl(b).replace(/\n/g, '<br>') + '</p>';
    }).join('');
  }
  function renderContent(t) {
    t = String(t || '');
    return t.indexOf(HTML_MARK) === 0 ? sanitize(t.slice(HTML_MARK.length)) : legacyToHtml(t);
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
    esc: esc, safeUrl: safeUrl, linkUrl: linkUrl, fmtDate: fmtDate,
    renderContent: renderContent, sanitize: sanitize, HTML_MARK: HTML_MARK,

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
    // Tải ảnh lên: có Apps Script -> lưu vào Google Drive và trả về link; demo -> giữ nguyên ảnh trong trình duyệt
    upload: function (dataUrl, pw) {
      if (!API) return Promise.resolve(dataUrl);
      return post({ action: 'upload', password: pw, data: dataUrl }).then(function (d) {
        if (!d.ok) throw new Error(d.error || 'error');
        return d.url;
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