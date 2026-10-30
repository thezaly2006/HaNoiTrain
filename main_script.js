
// ============================================================================
// // [LINK ĐẶT VÉ MỚI] Cấu hình đường link Affiliate Booking chính xác của bạn
// ============================================================================
const AFFILIATE_URL = "https://booking.hanoitrain.vn/?refCode=quayve5cuao";

// ============================================================================
// // [GOOGLE SHEET FORM] Cấu hình URL Webhook từ Google Apps Script
// // Hãy mở file HUONG-DAN-GOOGLE-SHEET.md để xem các bước lấy URL và dán vào đây
// ============================================================================
const GOOGLE_SHEET_URL = "https://script.google.com/macros/s/AKfycbwTBlWRgamN8NQYtm37FzGL6CS45jLXl49wg2y3SDCfiGhFmzANTpSVjBv2NbUluBW5KQ/exec"; 

const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
function track(ev,data={}){ if(window.gtag) gtag('event',ev,data); }

// Xử lý sự kiện bấm các nút Đặt vé nhanh (mở link affiliate)
$$('.js-book').forEach(b=>{
  b.addEventListener('click',e=>{
    e.preventDefault();
    track('begin_checkout',{hang:b.dataset.hang||null});
    window.open(AFFILIATE_URL,'_blank','noopener');
  });
});

// Xử lý Header, Thanh tiến trình cuộn, Nút nổi
const header=$('#header'), fab=$('#fabCta'), toTop=$('#toTop');
let ticking=false;
addEventListener('scroll',()=>{
  if(ticking)return;
  ticking=true;
  requestAnimationFrame(()=>{
    const y=scrollY, h=document.documentElement.scrollHeight-innerHeight;
    header.classList.toggle('scrolled',y>10);
    $('#progress').style.width=(y/h*100)+'%';
    fab.classList.toggle('show',y>560);
    toTop.classList.toggle('show',y>800);
    ticking=false;
  });
},{passive:true});
toTop.addEventListener('click',()=>scrollTo({top:0,behavior:RM?'auto':'smooth'}));

// Xử lý đóng/mở Mobile Menu
const mm=$('#mmenu');
$('#burger').onclick=()=>{mm.classList.add('open');mm.setAttribute('aria-hidden','false')};
$('#mclose').onclick=closeMenu;
$$('#mmenu nav a').forEach(a=>a.addEventListener('click',closeMenu));
function closeMenu(){mm.classList.remove('open');mm.setAttribute('aria-hidden','true')}

// Tự động nhân đôi nội dung chạy chữ ticker
$$('[data-mq]').forEach(t=>{t.innerHTML+=t.innerHTML});

// // [TỐI ƯU HIỆU ỨNG SMOOTH] Intersection Observer siêu mượt: kích hoạt sớm 50px để xuất hiện êm ái
const io=new IntersectionObserver(es=>es.forEach(e=>{
  if(e.isIntersecting){
    e.target.classList.add('in');
    io.unobserve(e.target);
  }
}),{threshold:0.06,rootMargin:'0px 0px 50px 0px'});
$$('[data-rv], .h2, h1').forEach(el=>io.observe(el));

// // [TỐI ƯU HIỆU ỨNG SMOOTH] Cuộn trang mượt mà êm ái cho tất cả liên kết neo trong trang
$$('a[href^="#"]').forEach(a=>{
  a.addEventListener('click',e=>{
    const href=a.getAttribute('href');
    if(!href || href==='#') return;
    const target=document.querySelector(href);
    if(target){
      e.preventDefault();
      const offset=78;
      const targetPos=target.getBoundingClientRect().top+window.pageYOffset-offset;
      window.scrollTo({top:targetPos,behavior:RM?'auto':'smooth'});
    }
  });
});

// Hiệu ứng chữ scramble vui nhộn ở kicker hero
(function(){
  const el=$('#scrambleKick'); if(!el||RM)return;
  const txt=el.textContent, chars='█▓▒░/\\·—+*'; let f=0;
  const t=setInterval(()=>{
    f++; let out='';
    for(let i=0;i<txt.length;i++){ out += i<f/1.6 ? txt[i] : chars[Math.random()*chars.length|0]; }
    el.textContent=out;
    if(f/1.6>=txt.length){clearInterval(t);el.textContent=txt;}
  },28);
})();

// Video nền tự chạy; nếu không tải được thì ẩn để lớp gradient hiện ra
(function(){
  const v=document.getElementById('heroVideo'); if(!v)return;
  const tryPlay=()=>{ const p=v.play(); if(p) p.catch(()=>{}); };
  v.addEventListener('loadedmetadata',tryPlay,{once:true});
  v.addEventListener('canplay',tryPlay,{once:true});
  setTimeout(()=>{ if(v.readyState<1) v.style.display='none'; },8000);
})();

// ============================================================================
// // [HÀNH TRÌNH TABS] CHUYỂN ĐỔI GIỮA BẢN ĐỒ MINH HỌA GỐC & TUYẾN RAY TƯƠNG TÁC
// ============================================================================
(function(){
  const tabBtns = document.querySelectorAll('.jp-tab-btn');
  const viewContents = document.querySelectorAll('.jp-view-content');
  if(!tabBtns.length) return;

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      viewContents.forEach(c => c.classList.remove('active'));
      btn.classList.add('active');
      const targetId = btn.dataset.target;
      const targetEl = document.getElementById(targetId);
      if(targetEl) {
        targetEl.classList.add('active');
      }
    });
  });
})();

// ============================================================================
// // [HÀNH TRÌNH HÀNG NGANG] TƯƠNG TÁC ĐẦU TÀU 🚂 CHẠY TRÊN RAY NGANG
// ============================================================================
(function(){
  const railContainer = document.getElementById('jpRailContainer');
  const railFill = document.getElementById('railFillH');
  const nodes = document.querySelectorAll('.jp-node-btn');
  const cards = document.querySelectorAll('.jp-card-h');
  if(!railContainer || !railFill || !nodes.length) return;

  // 4 vị trí phần trăm tương ứng với 4 trạm dừng
  const STOP_PERCENTS = [0, 33.33, 66.66, 100];

  function setActiveStop(idx) {
    if(idx < 0 || idx >= STOP_PERCENTS.length) return;
    
    // Cập nhật độ dài thanh ray màu đỏ và đầu tàu chạy đến trạm đó
    railFill.style.width = STOP_PERCENTS[idx] + '%';
    
    // Đổi active cho các nút tròn và card tương ứng
    nodes.forEach((n, i) => n.classList.toggle('active', i <= idx));
    cards.forEach((c, i) => c.classList.toggle('active', i === idx));
  }

  // Bấm vào nút trạm tròn trên thanh ray ngang
  nodes.forEach((node, idx) => {
    node.addEventListener('click', () => setActiveStop(idx));
  });

  // Bấm vào card trạm bên dưới
  cards.forEach((card, idx) => {
    card.addEventListener('click', () => setActiveStop(idx));
  });

  // Bấm trực tiếp vào đường ray để đầu tàu di chuyển tới vị trí đó
  railContainer.addEventListener('click', (e) => {
    if (e.target.closest('.jp-node-btn')) return;
    const rect = railContainer.getBoundingClientRect();
    const clickX = e.clientX - rect.left - 30; // Trừ khoảng padding 30px
    const totalW = rect.width - 60;
    if (totalW <= 0) return;
    let pct = Math.max(0, Math.min(100, (clickX / totalW) * 100));
    railFill.style.width = pct + '%';
    
    // Tìm trạm gần nhất để kích hoạt
    let closestIdx = 0;
    let minDiff = 999;
    STOP_PERCENTS.forEach((p, i) => {
      let diff = Math.abs(p - pct);
      if (diff < minDiff) { minDiff = diff; closestIdx = i; }
    });
    nodes.forEach((n, i) => n.classList.toggle('active', i <= closestIdx));
    cards.forEach((c, i) => c.classList.toggle('active', i === closestIdx));
  });

  // Khởi tạo trạm xuất phát đầu tiên
  setActiveStop(0);
})();


// ============================================================================
// // [LỊCH KHỞI HÀNH & CA CHẠY TÀU ĐỘNG]
// // Cập nhật linh hoạt theo từng tháng, dữ liệu chuẩn xác Tháng 10/2026 theo poster
// ============================================================================
const SCHEDULE_CONFIG = {
  "2026-10": {
    title: "Tháng 10 / 2026",
    days: {
      1: { sang: false, chieu: true },
      2: { sang: true,  chieu: false },
      3: { sang: true,  chieu: true },
      4: { sang: true,  chieu: true },
      6: { sang: false, chieu: true },
      7: { sang: true,  chieu: false },
      8: { sang: false, chieu: true },
      9: { sang: true,  chieu: false },
      10: { sang: true,  chieu: true, note: "Giải phóng Thủ đô" },
      11: { sang: true,  chieu: true },
      13: { sang: false, chieu: true },
      14: { sang: true,  chieu: false },
      15: { sang: false, chieu: true },
      16: { sang: true,  chieu: true },
      17: { sang: true,  chieu: true },
      18: { sang: true,  chieu: true },
      19: { sang: true,  chieu: true },
      20: { sang: true,  chieu: true, note: "Phụ Nữ VN 20/10" },
      21: { sang: true,  chieu: false },
      22: { sang: false, chieu: true },
      23: { sang: true,  chieu: false },
      24: { sang: true,  chieu: true },
      25: { sang: true,  chieu: true },
      27: { sang: false, chieu: true },
      28: { sang: true,  chieu: false },
      29: { sang: false, chieu: true },
      30: { sang: true,  chieu: false },
      31: { sang: true,  chieu: true }
    }
  }
};

(function(){
  let curYear = 2026, curMonth = 9;
  const DOW_FULL = ['Chủ Nhật','Thứ Hai','Thứ Ba','Thứ Tư','Thứ Năm','Thứ Sáu','Thứ Bảy'];
  let selectedDate = { y: 2026, m: 9, d: 20 };

  const calMonthTitle = document.getElementById('calCurrentMonth');
  const calGridDays = document.getElementById('calGridDays');
  const calTableWrapper = document.getElementById('calTableWrapper');
  const btnPrev = document.getElementById('calPrevBtn');
  const btnNext = document.getElementById('calNextBtn');
  const btnGrid = document.getElementById('btnViewGrid');
  const btnTable = document.getElementById('btnViewTable');
  const viewGrid = document.getElementById('calGridView');
  const viewTable = document.getElementById('calTableView');

  function getMonthSchedule(y, m) {
    const key = `${y}-${String(m + 1).padStart(2, '0')}`;
    if (SCHEDULE_CONFIG[key]) return SCHEDULE_CONFIG[key].days;
    const days = {};
    const totalDays = new Date(y, m + 1, 0).getDate();
    for (let d = 1; d <= totalDays; d++) {
      const dow = new Date(y, m, d).getDay();
      if (dow === 5) days[d] = { sang: true, chieu: false };
      else if (dow === 6 || dow === 0) days[d] = { sang: true, chieu: true };
      else if (dow === 2 || dow === 4) days[d] = { sang: false, chieu: true };
      else if (dow === 3) days[d] = { sang: true, chieu: false };
    }
    return days;
  }

  function render() {
    if (!calMonthTitle || !calGridDays) return;
    calMonthTitle.textContent = `Tháng ${curMonth + 1} / ${curYear}`;
    const monthData = getMonthSchedule(curYear, curMonth);
    const today = new Date();
    const firstDow = (new Date(curYear, curMonth, 1).getDay() + 6) % 7;
    const totalDays = new Date(curYear, curMonth + 1, 0).getDate();
    const prevMonthTotal = new Date(curYear, curMonth, 0).getDate();

    calGridDays.innerHTML = '';
    for (let i = 0; i < firstDow; i++) {
      const dayNum = prevMonthTotal - firstDow + 1 + i;
      const cell = document.createElement('div');
      cell.className = 'cal-day-cell other-month';
      cell.innerHTML = `<div class="cdc-top"><span class="cdc-num">${dayNum}</span></div><div class="cdc-empty">—</div>`;
      calGridDays.appendChild(cell);
    }

    for (let d = 1; d <= totalDays; d++) {
      const cell = document.createElement('div');
      const dt = new Date(curYear, curMonth, d);
      const isToday = dt.toDateString() === today.toDateString();
      const isSelected = selectedDate.y === curYear && selectedDate.m === curMonth && selectedDate.d === d;
      cell.className = `cal-day-cell${isToday ? ' is-today' : ''}${isSelected ? ' selected' : ''}`;
      
      const dayInfo = monthData[d];
      let badgeHtml = '';
      if (dayInfo && dayInfo.note) {
        badgeHtml = `<span class="cdc-badge">${dayInfo.note}</span>`;
      }

      let shiftsHtml = '';
      const dateCellStr = `${curYear}-${String(curMonth+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
      if (dayInfo && (dayInfo.sang || dayInfo.chieu)) {
        if (dayInfo.sang) shiftsHtml += `<div class="cdc-shift-tag run-sang" onclick="event.stopPropagation();window.selectAndBook('${dateCellStr}','sang')" title="Bấm đặt nhanh Ca sáng"><span>🌅 Sáng</span><b>08:00</b></div>`;
        if (dayInfo.chieu) shiftsHtml += `<div class="cdc-shift-tag run-chieu" onclick="event.stopPropagation();window.selectAndBook('${dateCellStr}','chieu')" title="Bấm đặt nhanh Ca chiều"><span>🌇 Chiều</span><b>13:30</b></div>`;
      } else {
        shiftsHtml = `<div class="cdc-empty">☕ Nghỉ định kỳ</div>`;
      }

      cell.innerHTML = `
        <div class="cdc-top">
          <span class="cdc-num">${d}</span>
          ${badgeHtml}
        </div>
        <div class="cdc-shifts">
          ${shiftsHtml}
        </div>
      `;

      cell.addEventListener('click', () => {
        selectDate(curYear, curMonth, d);
      });

      calGridDays.appendChild(cell);
    }

    const totalRendered = firstDow + totalDays;
    const remaining = totalRendered % 7 === 0 ? 0 : 7 - (totalRendered % 7);
    for (let j = 1; j <= remaining; j++) {
      const cell = document.createElement('div');
      cell.className = 'cal-day-cell other-month';
      cell.innerHTML = `<div class="cdc-top"><span class="cdc-num">${j}</span></div><div class="cdc-empty">—</div>`;
      calGridDays.appendChild(cell);
    }

    renderTable(curYear, curMonth, monthData);
    updateSelectionCard();
  }

  function renderTable(y, m, monthData) {
    if (!calTableWrapper) return;
    const totalDays = new Date(y, m + 1, 0).getDate();
    const firstDow = (new Date(y, m, 1).getDay() + 6) % 7;
    
    let html = `
      <table class="cal-matrix-table">
        <thead>
          <tr>
            <th style="width:110px">CHUYẾN</th>
            <th>THỨ 2</th><th>THỨ 3</th><th>THỨ 4</th><th>THỨ 5</th><th>THỨ 6</th><th>THỨ 7</th><th>CHỦ NHẬT</th>
          </tr>
        </thead>
        <tbody>
    `;

    let dayCounter = 1;
    let weekIndex = 0;
    while (dayCounter <= totalDays) {
      weekIndex++;
      const weekDays = [];
      for (let dow = 0; dow < 7; dow++) {
        if (weekIndex === 1 && dow < firstDow) {
          weekDays.push(null);
        } else if (dayCounter <= totalDays) {
          weekDays.push(dayCounter);
          dayCounter++;
        } else {
          weekDays.push(null);
        }
      }

      html += `<tr class="cmt-row-day"><td><b>NGÀY</b></td>`;
      weekDays.forEach(d => {
        html += `<td>${d ? `<b>${d}/${m+1}</b>` : ''}</td>`;
      });
      html += `</tr>`;

      html += `<tr class="cmt-row-shift"><td><b>08:00 Sáng</b></td>`;
      weekDays.forEach(d => {
        if (!d) {
          html += `<td></td>`;
        } else {
          const info = monthData[d];
          if (info && info.sang) {
            html += `<td><span class="cmt-chay-badge" onclick="window.selectAndBook('${y}-${String(m+1).padStart(2,'0')}-${String(d).padStart(2,'0')}', 'sang')">CHẠY</span></td>`;
          } else {
            html += `<td><span class="cmt-none">—</span></td>`;
          }
        }
      });
      html += `</tr>`;

      html += `<tr class="cmt-row-shift" style="border-bottom:2px solid rgba(201,162,53,.4)"><td><b>13:30 Chiều</b></td>`;
      weekDays.forEach(d => {
        if (!d) {
          html += `<td></td>`;
        } else {
          const info = monthData[d];
          if (info && info.chieu) {
            html += `<td><span class="cmt-chay-badge" onclick="window.selectAndBook('${y}-${String(m+1).padStart(2,'0')}-${String(d).padStart(2,'0')}', 'chieu')">CHẠY</span></td>`;
          } else {
            html += `<td><span class="cmt-none">—</span></td>`;
          }
        }
      });
      html += `</tr>`;
    }

    html += `</tbody></table>`;
    calTableWrapper.innerHTML = html;
  }

  function selectDate(y, m, d) {
    selectedDate = { y, m, d };
    $$('.cal-day-cell').forEach(c => c.classList.remove('selected'));
    render();
  }

  function updateSelectionCard() {
    const { y, m, d } = selectedDate;
    const dateObj = new Date(y, m, d);
    const dowStr = DOW_FULL[dateObj.getDay()];
    const dateFormatted = `${dowStr}, ngày ${d}/${m + 1}/${y}`;
    const dateStr = `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    
    const monthData = getMonthSchedule(y, m);
    const dayInfo = monthData[d] || { sang: false, chieu: false };

    const cscDateText = document.getElementById('cscDateText');
    const cscNoteText = document.getElementById('cscNoteText');
    const cscShifts = document.getElementById('cscShifts');

    if (cscDateText) cscDateText.textContent = dateFormatted;
    
    let note = '';
    if (dayInfo.note) note += `✨ ${dayInfo.note} · `;
    if (dayInfo.sang && dayInfo.chieu) {
      note += 'Có cả 2 ca khởi hành sáng (08:00) và chiều (13:30). Đang mở bán vé trực tuyến.';
    } else if (dayInfo.sang) {
      note += 'Khởi hành Ca sáng (08:00 – 11:30). Thăm quan Đền Đô, biểu diễn hát chèo, hát xẩm.';
    } else if (dayInfo.chieu) {
      note += 'Khởi hành Ca chiều (13:30 – 17:00). Ngắm hoàng hôn cầu Long Biên, biểu diễn nghệ thuật.';
    } else {
      note += 'Ngày nghỉ bảo dưỡng đoàn tàu định kỳ. Quý khách vui lòng chọn các ngày có ca chạy.';
    }
    if (cscNoteText) cscNoteText.textContent = note;

    if (cscShifts) {
      let btns = '';
      if (dayInfo.sang) {
        btns += `<button class="csc-btn sang" onclick="window.selectAndBook('${dateStr}', 'sang')">🌅 Đặt vé Ca sáng 08:00</button>`;
      }
      if (dayInfo.chieu) {
        btns += `<button class="csc-btn chieu" onclick="window.selectAndBook('${dateStr}', 'chieu')">🌇 Đặt vé Ca chiều 13:30</button>`;
      }
      btns += `<button class="csc-btn form" onclick="window.selectAndBook('${dateStr}', '')">📝 Giữ chỗ ngày này qua Form</button>`;
      cscShifts.innerHTML = btns;
    }
  }

  window.selectAndBook = function(dateStr, shiftVal) {
    const inputDate = document.getElementById('bfDate');
    const selectShift = document.getElementById('bfShift');
    if (inputDate && dateStr) inputDate.value = dateStr;
    if (selectShift && shiftVal) {
      const targetVal = shiftVal === 'sang' ? 'Ca Sáng (08:00 – 11:30)' : 'Ca Chiều (13:30 – 17:00)';
      selectShift.value = targetVal;
      // Fallback nếu có sai khác chữ hoa/thường
      if (selectShift.value !== targetVal) {
        for (let opt of selectShift.options) {
          if ((shiftVal === 'sang' && opt.value.toLowerCase().includes('sáng')) ||
              (shiftVal === 'chieu' && opt.value.toLowerCase().includes('chiều'))) {
            opt.selected = true;
            break;
          }
        }
      }
    }
    const formSec = document.getElementById('form-dat-ve');
    if (formSec) {
      formSec.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    if (typeof showToast === 'function') {
      const shiftName = shiftVal === 'sang' ? 'Ca Sáng (08:00)' : shiftVal === 'chieu' ? 'Ca Chiều (13:30)' : 'ngày';
      showToast(`🎉 Đã chọn ${dateStr} (${shiftName})! Mời quý khách điền thông tin để giữ vé.`);
    }
  };

  if (btnPrev) {
    btnPrev.onclick = () => {
      curMonth--;
      if (curMonth < 0) { curMonth = 11; curYear--; }
      render();
    };
  }
  if (btnNext) {
    btnNext.onclick = () => {
      curMonth++;
      if (curMonth > 11) { curMonth = 0; curYear++; }
      render();
    };
  }

  if (btnGrid && btnTable && viewGrid && viewTable) {
    btnGrid.onclick = () => {
      btnGrid.classList.add('active');
      btnTable.classList.remove('active');
      viewGrid.classList.add('active');
      viewTable.classList.remove('active');
    };
    btnTable.onclick = () => {
      btnTable.classList.add('active');
      btnGrid.classList.remove('active');
      viewTable.classList.add('active');
      viewGrid.classList.remove('active');
    };
  }

  render();
})();

// ============================================================================
// // [TÍNH TOÁN CA TÀU CHẠY & ĐẾM NGƯỢC]
// ============================================================================
const DOW=['Chủ Nhật','Thứ Hai','Thứ Ba','Thứ Tư','Thứ Năm','Thứ Sáu','Thứ Bảy'];
const pad=n=>String(n).padStart(2,'0');

function nextTrainOccurrence(h, m){
  const now = new Date();
  for(let d=0; d<14; d++){
    const day = new Date(now);
    day.setDate(now.getDate() + d);
    const y = day.getFullYear(), mon = day.getMonth(), dateNum = day.getDate();
    const key = `${y}-${String(mon+1).padStart(2,'0')}`;
    let isRun = false;
    if (SCHEDULE_CONFIG[key] && SCHEDULE_CONFIG[key].days[dateNum]) {
      const info = SCHEDULE_CONFIG[key].days[dateNum];
      isRun = (h === 8 ? info.sang : info.chieu);
    } else {
      const dow = day.getDay();
      isRun = (h === 8 && [3,5,6,0].includes(dow)) || (h === 13 && [2,4,6,0].includes(dow));
    }
    if (isRun) {
      const t = new Date(day);
      t.setHours(h, m, 0, 0);
      if (t > now) return t;
    }
  }
}

function fmtCD(ms){
  let s=Math.max(0,Math.round(ms/1000));
  const days=Math.floor(s/86400); s%=86400;
  const hh=Math.floor(s/3600), mm2=Math.floor(s%3600/60), ss=s%60;
  return (days>0?days+' ngày ':'')+pad(hh)+':'+pad(mm2)+':'+pad(ss);
}
function fmtDate(t){ return DOW[t.getDay()]+', ngày '+pad(t.getDate())+' tháng '+pad(t.getMonth()+1); }

function tickBoard(){
  const tS=nextTrainOccurrence(8,0), tC=nextTrainOccurrence(13,30);
  const dS=$('#dSang'), cdS=$('#cdSang');
  const dC=$('#dChieu'), cdC=$('#cdChieu');
  if(tS){ if(dS) dS.textContent=fmtDate(tS); if(cdS) cdS.textContent=fmtCD(tS-new Date()); }
  if(tC){ if(dC) dC.textContent=fmtDate(tC); if(cdC) cdC.textContent=fmtCD(tC-new Date()); }
}
tickBoard(); setInterval(tickBoard,1000);


// ============================================================================
// // [FORM ĐẶT VÉ GOOGLE SHEET] XỬ LÝ GỬI DỮ LIỆU VỀ GOOGLE SHEETS
// ============================================================================
(function(){
  const bookingForm = document.getElementById('bookingForm');
  const btnSubmit = document.getElementById('btnSubmitForm');
  const inputDate = document.getElementById('bfDate');

  // Đặt ngày tối thiểu là ngày hôm nay
  if (inputDate) {
    const todayStr = new Date().toISOString().split('T')[0];
    inputDate.min = todayStr;
    inputDate.value = todayStr;
  }

  // Khi bấm "📝 Điền form giữ chỗ" trên từng thẻ vé, tự động chọn hạng vé tương ứng
  $$('.js-choose-tier').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const hang = btn.dataset.hang;
      const sel = document.getElementById('bfTicketType');
      if (sel && hang) {
        if (hang === 'toa-1') sel.value = "Toa 1 · Nghệ Thuật (459.000đ/người)";
        else if (hang === 'toa-xep') sel.value = "Toa Xếp · Phổ Thông (459.000đ/người)";
        else if (hang === 'toa-2') sel.value = "Toa 2 · Ẩm Thực (659.000đ/người)";
        else if (hang === 'toa-vip') sel.value = "Toa VIP · Cao Cấp (959.000đ/người)";
      }
      const formSection = document.getElementById('form-dat-ve');
      if (formSection) {
        formSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });
  });

  if (bookingForm) {
    bookingForm.addEventListener('submit', async function(e) {
      e.preventDefault();

      const name = $('#bfName').value.trim();
      const phone = $('#bfPhone').value.trim();
      const email = $('#bfEmail').value.trim();
      const date = $('#bfDate').value;
      const shift = $('#bfShift').value;
      const ticketType = $('#bfTicketType').value;
      const quantity = $('#bfQuantity').value;
      const note = $('#bfNote').value.trim();

      // Kiểm tra dữ liệu bắt buộc
      let hasError = false;
      if (!name) { $('#errName').classList.add('show'); hasError = true; } else { $('#errName').classList.remove('show'); }
      
      const phoneRegex = /^[0-9+() -]{9,15}$/;
      if (!phone || !phoneRegex.test(phone)) { $('#errPhone').classList.add('show'); hasError = true; } else { $('#errPhone').classList.remove('show'); }
      
      if (!date) { $('#errDate').classList.add('show'); hasError = true; } else { $('#errDate').classList.remove('show'); }

      if (hasError) return;

      // Trạng thái đang gửi (loading)
      btnSubmit.classList.add('loading');
      btnSubmit.disabled = true;

      const payload = {
        name: name,
        phone: phone,
        email: email,
        date: date,
        shift: shift,
        ticketType: ticketType,
        quantity: quantity,
        note: note
      };

      // Nếu chưa điền link GOOGLE_SHEET_URL, lưu tạm vào LocalStorage và thông báo
      if (!GOOGLE_SHEET_URL || GOOGLE_SHEET_URL === "" || GOOGLE_SHEET_URL.includes("DÁN_URL")) {
        try {
          const savedBookings = JSON.parse(localStorage.getItem('hanoitrain_bookings') || '[]');
          savedBookings.push({ ...payload, submittedAt: new Date().toLocaleString('vi-VN') });
          localStorage.setItem('hanoitrain_bookings', JSON.stringify(savedBookings));
        } catch(err) {}

        setTimeout(() => {
          btnSubmit.classList.remove('loading');
          btnSubmit.disabled = false;
          showToast("🎉 Đặt vé thành công! Vui lòng mở file HUONG-DAN-GOOGLE-SHEET.md để dán link Apps Script kết nối Google Sheet.");
          bookingForm.reset();
          if (inputDate) inputDate.value = new Date().toISOString().split('T')[0];
        }, 800);
        return;
      }

      // Đã có GOOGLE_SHEET_URL: Gửi thẳng tới Google Sheet bằng fetch POST
      try {
        await fetch(GOOGLE_SHEET_URL, {
          method: 'POST',
          mode: 'no-cors', // no-cors giúp gửi thông suốt đến Google Apps Script
          headers: { 'Content-Type': 'text/plain;charset=utf-8' },
          body: JSON.stringify(payload)
        });

        btnSubmit.classList.remove('loading');
        btnSubmit.disabled = false;
        showToast("🎉 Đặt vé thành công! Thông tin đã được lưu vào Google Sheet và nhân viên sẽ liên hệ xác nhận.");
        bookingForm.reset();
        if (inputDate) inputDate.value = new Date().toISOString().split('T')[0];

      } catch (error) {
        console.error("Lỗi khi gửi form:", error);
        btnSubmit.classList.remove('loading');
        btnSubmit.disabled = false;
        showToast("⚠️ Có lỗi khi gửi. Quý khách vui lòng thử lại hoặc liên hệ Hotline!");
      }
    });
  }
})();

// ============================================================================
// // [THÔNG BÁO TOAST]
// ============================================================================
function showToast(msg){
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 5000);
}

// ============================================================================
// // [LIGHTBOX XEM ẢNH PHÓNG TO]
// ============================================================================
(function(){
  const lb=$('#lb'), img=$('#lbImg'), cap=$('#lbCap');
  if(!lb || !img) return;
  let groups={}, cur=[], idx=0;

  // Gom các phần tử theo data-lb
  $$('[data-lb]').forEach(el=>{
    const g = el.dataset.lb;
    if(!groups[g]) groups[g]=[];
    groups[g].push(el);
    el.addEventListener('click', (e)=>{
      e.stopPropagation();
      open(g, groups[g].indexOf(el));
    });
  });

  function open(g, i){
    cur = groups[g] || [];
    idx = i;
    if(!cur.length) return;
    show();
    lb.classList.add('open');
    document.body.style.overflow='hidden';
  }

  function show(){
    const el = cur[idx];
    if(!el) return;
    const im = el.querySelector('img') || el;
    let src = im.currentSrc || im.src || '';
    if(src.includes('picsum.photos')){
      src = src.replace(/\/\d+\/\d+$/,'/1400/900');
    }
    img.src = src;
    img.alt = el.dataset.cap || im.alt || 'The Hanoi Train';
    const title = el.dataset.cap || im.alt || 'Ảnh The Hanoi Train';
    cap.innerHTML = `<span>${title}</span> <small style="display:inline-block;margin-left:8px;opacity:.7">(${idx+1}/${cur.length})</small>`;
  }

  function close(){
    lb.classList.remove('open');
    document.body.style.overflow='';
  }

  const btnX = $('.lb-x'), btnP = $('.lb-p'), btnN = $('.lb-n');
  if(btnX) btnX.onclick = close;
  if(btnP) btnP.onclick = (e)=>{ e.stopPropagation(); idx=(idx-1+cur.length)%cur.length; show(); };
  if(btnN) btnN.onclick = (e)=>{ e.stopPropagation(); idx=(idx+1)%cur.length; show(); };
  lb.addEventListener('click', e => { if(e.target===lb || e.target.classList.contains('open')) close(); });

  addEventListener('keydown', e => {
    if(!lb.classList.contains('open')) return;
    if(e.key==='Escape') close();
    if(e.key==='ArrowLeft' && btnP) btnP.click();
    if(e.key==='ArrowRight' && btnN) btnN.click();
  });
})();

// ============================================================================
// // [MENU ĐIỀU HƯỚNG TỰ ACTIVE THEO VỊ TRÍ CUỘN]
// ============================================================================
(function(){
  const obs=new IntersectionObserver(es=>es.forEach(e=>{
    if(e.isIntersecting){
      $$('#nav a').forEach(a=>a.classList.toggle('active',a.getAttribute('href')==='#'+e.target.id));
    }
  }),{rootMargin:'-35% 0px -55% 0px'});
  ['hanh-trinh','lich','toa','gia-ve','dich-vu'].forEach(id=>{const s=document.getElementById(id); if(s)obs.observe(s)});
})();

$('#year').textContent=new Date().getFullYear();
