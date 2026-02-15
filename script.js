document.addEventListener('DOMContentLoaded', () => {
    document.documentElement.classList.add('js');

    let lastScrollY = window.scrollY;
    const header = document.getElementById('main-header');

    if (header) {
        window.addEventListener('scroll', () => {
            const currentScrollY = window.scrollY;

            if (currentScrollY <= 0) {
                header.classList.remove('hidden');
            } else if (currentScrollY > lastScrollY) {
                header.classList.add('hidden');
            } else {
                header.classList.remove('hidden');
            }
            lastScrollY = currentScrollY;
        });
    }

    const contentData = [
        { title: '施設案内', img: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=500&q=60' },
        { title: '地域のイベント', img: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=500&q=60' },
        { title: 'イベント情報', img: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=500&q=60' },
        { title: 'レンタルスペース', img: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=500&q=60' },
        { title: 'ギャラリー', img: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&w=500&q=60' }
    ];

    const randomArea = document.getElementById('random-content-area');

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i -= 1) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    if (randomArea) {
        const selectedContents = shuffleArray([...contentData]).slice(0, 3);
        selectedContents.forEach((content) => {
            const cardHTML = `
                <div class="nav-card">
                    <img src="${content.img}" alt="${content.title}" class="nav-card-img">
                    <div class="nav-card-title">${content.title}</div>
                </div>
            `;
            randomArea.insertAdjacentHTML('beforeend', cardHTML);
        });
    }

    const heartBtns = document.querySelectorAll('.heart-btn');
    heartBtns.forEach((btn, index) => {
        const isLiked = localStorage.getItem(`liked_news_${index}`);
        if (isLiked === 'true') {
            btn.classList.add('active');
            btn.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="#E91E63" stroke="#E91E63" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>';
        }

        btn.addEventListener('click', () => {
            btn.classList.toggle('active');
            const isActive = btn.classList.contains('active');

            if (isActive) {
                btn.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="#E91E63" stroke="#E91E63" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>';
            } else {
                btn.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>';
            }

            localStorage.setItem(`liked_news_${index}`, isActive);
        });
    });

    const menuToggle = document.getElementById('menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');

    if (menuToggle && mobileMenu) {
        menuToggle.addEventListener('click', () => {
            mobileMenu.classList.toggle('open');
        });
    }

    const dropdownToggles = document.querySelectorAll('.dropdown-toggle');
    dropdownToggles.forEach((toggle) => {
        toggle.addEventListener('click', (e) => {
            e.preventDefault();
            const mobileNavItem = toggle.closest('.mobile-nav-item');
            if (!mobileNavItem) return;

            const isOpen = mobileNavItem.classList.contains('open');

            document.querySelectorAll('.mobile-nav-item.open').forEach((item) => {
                if (item !== mobileNavItem) {
                    item.classList.remove('open');
                    const itemToggle = item.querySelector('.dropdown-toggle');
                    if (itemToggle) itemToggle.setAttribute('aria-expanded', 'false');
                }
            });

            mobileNavItem.classList.toggle('open');
            toggle.setAttribute('aria-expanded', String(!isOpen));
        });
    });

    const revealElements = document.querySelectorAll('.reveal');
    if (!('IntersectionObserver' in window)) {
        revealElements.forEach((el) => el.classList.add('active'));
    } else {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.25 });

        revealElements.forEach((el) => revealObserver.observe(el));
    }

    const mvSlides = Array.from(document.querySelectorAll('.mv-container .slide'));
    const dots = Array.from(document.querySelectorAll('.vertical-bar .vertical-dot'));
    const navItems = Array.from(document.querySelectorAll('.mv-nav-item'));

    if (mvSlides.length) {
        let index = mvSlides.findIndex((s) => s.classList.contains('active'));
        if (index === -1) index = 0;

        let timer = null;
        const INTERVAL = 4000;

        const show = (i, userAction = false) => {
            index = ((i % mvSlides.length) + mvSlides.length) % mvSlides.length;
            mvSlides.forEach((s, idx) => s.classList.toggle('active', idx === index));
            dots.forEach((d, idx) => d.classList.toggle('active', idx === index));
            navItems.forEach((n, idx) => n.classList.toggle('active', idx === index));
            if (userAction) restartTimer();
        };

        const next = () => show(index + 1);
        const startTimer = () => { stopTimer(); timer = setInterval(next, INTERVAL); };
        const stopTimer = () => { if (timer) { clearInterval(timer); timer = null; } };
        const restartTimer = () => { stopTimer(); startTimer(); };

        dots.forEach((dot, i) => {
            dot.addEventListener('click', (e) => { e.preventDefault(); show(i, true); });
            dot.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); show(i, true); }
            });
        });

        navItems.forEach((item, i) => {
            item.addEventListener('click', (e) => { e.preventDefault(); show(i, true); });
        });

        const container = document.querySelector('.mv-container');
        if (container) {
            container.addEventListener('mouseenter', stopTimer);
            container.addEventListener('mouseleave', startTimer);
        }

        show(index);
        startTimer();
    }

    function getScheduleDataPath() {
        return window.location.pathname.includes('/pages/')
            ? '../../assets/data/schedule.json'
            : 'assets/data/schedule.json';
    }

    function getDateKeyInTimeZone(timeZone) {
        const parts = new Intl.DateTimeFormat('en-CA', {
            timeZone,
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        }).formatToParts(new Date());

        const year = parts.find((p) => p.type === 'year')?.value;
        const month = parts.find((p) => p.type === 'month')?.value;
        const day = parts.find((p) => p.type === 'day')?.value;

        return `${year}-${month}-${day}`;
    }

    function toMonthKey(dateKey) {
        return dateKey.slice(0, 7);
    }

    function nextMonthKey(monthKey) {
        const [y, m] = monthKey.split('-').map(Number);
        const nextY = m === 12 ? y + 1 : y;
        const nextM = m === 12 ? 1 : m + 1;
        return `${nextY}-${String(nextM).padStart(2, '0')}`;
    }

    function sortEvents(events) {
        return [...events].sort((a, b) => `${a.date} ${a.start}`.localeCompare(`${b.date} ${b.start}`));
    }

    function formatDateJa(dateKey, timeZone = 'Asia/Tokyo') {
        const date = new Date(`${dateKey}T00:00:00+09:00`);
        return new Intl.DateTimeFormat('ja-JP', {
            timeZone,
            month: 'numeric',
            day: 'numeric',
            weekday: 'short'
        }).format(date);
    }

    function formatDateSlash(dateKey) {
        return dateKey.replace(/-/g, '/');
    }

    function monthLabelShort(label, fallbackMonthKey) {
        if (typeof label === 'string') {
            const match = label.match(/(\d{1,2})月/);
            if (match) return `${match[1]}月`;
        }
        return `${Number(fallbackMonthKey.slice(5, 7))}月`;
    }

    function getAllEvents(months) {
        return Object.values(months || {}).flatMap((m) => Array.isArray(m.events) ? m.events : []);
    }

    function resolveDetailPath(path) {
        if (!path) {
            return window.location.pathname.includes('/pages/')
                ? '../../pages/events/month.html'
                : 'pages/events/month.html';
        }

        if (/^https?:\/\//.test(path) || path.startsWith('/')) return path;

        // If sample detail page is not prepared yet, keep links valid by falling back to month page anchor.
        if (path.includes('detail-sample.html')) {
            const fallback = window.location.pathname.includes('/pages/')
                ? '../../pages/events/month.html'
                : 'pages/events/month.html';
            const id = path.includes('?event=') ? path.split('?event=')[1] : '';
            return id ? `${fallback}#${id}` : fallback;
        }

        return window.location.pathname.includes('/pages/') ? `../../${path}` : path;
    }

    function renderEmptyList(container, message) {
        if (!container) return;
        container.innerHTML = `<li class="event-item">${message}</li>`;
    }

    function buildHeaderNotifications(scheduleData, todayKey) {
        const months = scheduleData?.months || {};
        const recommendedEvents = sortEvents(getAllEvents(months))
            .filter((event) => event.date >= todayKey)
            .slice(0, 3)
            .map((event) => ({
                type: 'event',
                title: event.title || 'イベント',
                meta: `${formatDateJa(event.date)} ${event.start}-${event.end}`,
                href: resolveDetailPath(event.detailPath)
            }));

        const latestNoticesRaw = Array.isArray(scheduleData?.notices?.latest)
            ? scheduleData.notices.latest
            : [];
        const latestNotices = latestNoticesRaw
            .filter((item) => item && item.title)
            .sort((a, b) => String(b.publishedAt || '').localeCompare(String(a.publishedAt || '')))
            .map((item) => ({
                type: 'notice',
                title: item.title,
                meta: item.publishedAt ? `${item.publishedAt} 公開` : 'お知らせ',
                href: resolveDetailPath(item.path || 'pages/facility/news.html')
            }));

        const fallbackNotice = {
            type: 'notice',
            title: '最新のお知らせを確認',
            meta: '最新情報',
            href: resolveDetailPath('pages/facility/news.html')
        };

        const selected = [];
        if (latestNotices.length) selected.push(latestNotices[0]);
        else selected.push(fallbackNotice);

        recommendedEvents.slice(0, 2).forEach((event) => selected.push(event));
        while (selected.length < 3 && latestNotices[selected.length - 2]) {
            selected.push(latestNotices[selected.length - 2]);
        }
        while (selected.length < 3 && recommendedEvents[selected.length - 1]) {
            selected.push(recommendedEvents[selected.length - 1]);
        }

        return selected.slice(0, 3);
    }

    function initHeaderNotifications(scheduleData, todayKey) {
        const notifyButtons = Array.from(document.querySelectorAll('.icon-btn[aria-label="通知"]'));
        if (!notifyButtons.length) return;

        const items = buildHeaderNotifications(scheduleData, todayKey);
        const notifySignature = items.map((item) => `${item.type}|${item.title}|${item.href}`).join('||');
        const seenSignature = localStorage.getItem('seen_notify_signature') || '';
        const isUnread = notifySignature && notifySignature !== seenSignature;
        const panelHtml = `
            <div class="notify-panel-head">
                <p>通知</p>
                <span>最大3件</span>
            </div>
            <ul class="notify-list">
                ${items.map((item) => `
                    <li class="notify-item ${item.type}">
                        <a href="${item.href}">
                            <span class="notify-type">${item.type === 'notice' ? 'お知らせ' : 'おすすめイベント'}</span>
                            <strong>${item.title}</strong>
                            <small>${item.meta}</small>
                        </a>
                    </li>
                `).join('')}
            </ul>
        `;

        notifyButtons.forEach((button) => {
            if (button.dataset.notifyReady === 'true') return;
            button.dataset.notifyReady = 'true';
            button.classList.add('has-notification');
            button.setAttribute('aria-expanded', 'false');

            const dot = document.createElement('span');
            dot.className = 'notify-dot';
            dot.textContent = String(items.length);
            if (!isUnread) dot.classList.add('is-hidden');
            dot.setAttribute('aria-hidden', 'true');
            button.appendChild(dot);

            const panel = document.createElement('section');
            panel.className = 'notify-panel';
            panel.hidden = true;
            panel.innerHTML = panelHtml;

            const anchor = button.parentElement || button;
            anchor.classList.add('notify-anchor');
            anchor.appendChild(panel);

            button.addEventListener('click', (e) => {
                e.preventDefault();
                const isOpen = !panel.hidden;
                document.querySelectorAll('.notify-panel').forEach((el) => { el.hidden = true; });
                document.querySelectorAll('.icon-btn[aria-label="通知"]').forEach((el) => el.setAttribute('aria-expanded', 'false'));
                panel.hidden = isOpen;
                button.setAttribute('aria-expanded', String(!isOpen));

                // Mark as read when the panel is opened.
                if (!isOpen && notifySignature) {
                    localStorage.setItem('seen_notify_signature', notifySignature);
                    const buttonDot = button.querySelector('.notify-dot');
                    if (buttonDot) buttonDot.classList.add('is-hidden');
                }
            });
        });

        document.addEventListener('click', (e) => {
            const target = e.target;
            if (!(target instanceof Node)) return;
            const inNotify = notifyButtons.some((btn) => btn.contains(target) || (btn.parentElement && btn.parentElement.contains(target) && btn.parentElement.querySelector('.notify-panel')?.contains(target)));
            if (inNotify) return;
            document.querySelectorAll('.notify-panel').forEach((el) => { el.hidden = true; });
            document.querySelectorAll('.icon-btn[aria-label="通知"]').forEach((el) => el.setAttribute('aria-expanded', 'false'));
        });
    }

    function renderHomeScheduleCard(scheduleData, todayKey, monthKey) {
        const card = document.querySelector('.dashboard .schedule-card');
        if (!card) return;

        const todayDateEl = card.querySelector('.today-date');
        const statusBadgeEl = card.querySelector('.status-badge');
        const eventListEl = card.querySelector('.event-list');

        if (todayDateEl) {
            todayDateEl.textContent = formatDateSlash(todayKey);
        }

        const month = scheduleData.months?.[monthKey];
        const todayStatus = month?.openingStatus?.find((item) => item.date === todayKey);
        if (statusBadgeEl) {
            const isOpen = Boolean(todayStatus?.isOpen);
            statusBadgeEl.textContent = isOpen ? 'OPEN' : 'CLOSED';
            statusBadgeEl.classList.toggle('open', isOpen);
            statusBadgeEl.classList.toggle('closed', !isOpen);
        }

        if (!eventListEl) return;

        const todayEvents = sortEvents(month?.events || []).filter((event) => event.date === todayKey);
        if (!todayEvents.length) {
            renderEmptyList(eventListEl, '本日のイベントはありません');
            return;
        }

        const colorClasses = ['color-1', 'color-2', 'color-3'];
        eventListEl.innerHTML = todayEvents.map((event, idx) => {
            const colorClass = colorClasses[idx % colorClasses.length];
            return `<li class="event-item ${colorClass}">${event.start}〜 ${event.title}</li>`;
        }).join('');
    }

    function renderEventsIndexPage(scheduleData, todayKey, monthKey, nextKey) {
        if (!document.body.classList.contains('page-events-index')) return;

        const weekGrid = document.querySelector('.page-events-index .event-week-grid');
        if (weekGrid) {
            const allEvents = sortEvents(getAllEvents(scheduleData.months || {}));
            const withinWeek = allEvents.filter((event) => event.date >= todayKey).slice(0, 9);

            const grouped = new Map();
            withinWeek.forEach((event) => {
                if (!grouped.has(event.date)) grouped.set(event.date, []);
                grouped.get(event.date).push(event);
            });

            const groups = Array.from(grouped.entries()).slice(0, 3);
            if (!groups.length) {
                weekGrid.innerHTML = '<article class="event-day"><div class="event-day-header"><span>予定</span><span>-</span></div><ul class="event-day-list"><li>直近の予定はありません</li></ul></article>';
            } else {
                weekGrid.innerHTML = groups.map(([date, events]) => {
                    const headerTime = events[0]?.start || '--:--';
                    return `
                        <article class="event-day">
                            <div class="event-day-header"><span>${formatDateJa(date)}</span><span>${headerTime}</span></div>
                            <ul class="event-day-list">
                                ${events.map((event) => `<li><a href="${resolveDetailPath(event.detailPath)}">${event.title}</a></li>`).join('')}
                            </ul>
                        </article>
                    `;
                }).join('');
            }
        }

        const currentMonth = scheduleData.months?.[monthKey];
        const nextMonth = scheduleData.months?.[nextKey];

        let summarySection = document.getElementById('js-events-summary-section');
        if (!summarySection) {
            const insertBefore = document.querySelector('.page-events-index #events-policy-title')?.closest('.page-section');
            if (!insertBefore || !insertBefore.parentElement) return;

            summarySection = document.createElement('section');
            summarySection.id = 'js-events-summary-section';
            summarySection.className = 'page-section alt';
            summarySection.innerHTML = `
                <div class="page-shell split-grid split-grid--equal">
                    <article class="info-panel panel-card">
                        <div class="section-header"><span class="section-eyebrow">Monthly</span><h2 id="js-events-current-month-title">今月のイベント</h2></div>
                        <div id="js-events-current-month-list" class="event-card-grid"></div>
                    </article>
                    <article class="info-panel panel-card">
                        <div class="section-header"><span class="section-eyebrow">Next</span><h2 id="js-events-next-month-title">来月の予定</h2></div>
                        <ul id="js-events-next-month-list" class="notice-list"></ul>
                    </article>
                </div>
            `;
            insertBefore.parentElement.insertBefore(summarySection, insertBefore);
        }

        const shortCurrent = monthLabelShort(currentMonth?.label, monthKey);
        const shortNext = monthLabelShort(nextMonth?.label, nextKey);

        const currentTitle = document.getElementById('js-events-current-month-title');
        const nextTitle = document.getElementById('js-events-next-month-title');
        if (currentTitle) currentTitle.textContent = `${shortCurrent}のイベント`;
        if (nextTitle) nextTitle.textContent = `${shortNext}の予定`;

        const currentList = document.getElementById('js-events-current-month-list');
        const nextList = document.getElementById('js-events-next-month-list');

        if (currentList) {
            const items = sortEvents(currentMonth?.events || []).filter((event) => event.date >= todayKey).slice(0, 4);
            currentList.innerHTML = items.length
                ? items.map((event) => `
                    <article class="event-card" id="${event.id}">
                        <span class="pill">${event.category || 'イベント'}</span>
                        <h3>${event.title}</h3>
                        <div class="event-card-meta"><span>${formatDateJa(event.date)}</span><span>${event.start}-${event.end}</span></div>
                        <p>${event.summary || ''}</p>
                        <div class="event-card-footer"><a class="link-text" href="${resolveDetailPath(event.detailPath)}">詳細を見る</a></div>
                    </article>
                `).join('')
                : '<article class="event-card"><h3>今月の追加予定はありません</h3></article>';
        }

        if (nextList) {
            const items = sortEvents(nextMonth?.events || []).slice(0, 5);
            nextList.innerHTML = items.length
                ? items.map((event) => `
                    <li class="notice-item">
                        <div class="notice-date">${formatDateJa(event.date)}</div>
                        <div>
                            <p class="notice-title"><a href="${resolveDetailPath(event.detailPath)}">${event.title}</a></p>
                            <p>${event.start}-${event.end}</p>
                        </div>
                    </li>
                `).join('')
                : '<li class="notice-item"><div class="notice-date">予定</div><div><p class="notice-title">来月の予定は準備中です</p></div></li>';
        }
    }

    function renderEventsMonthPage(scheduleData, todayKey, monthKey, nextKey) {
        if (!document.body.classList.contains('page-events-month')) return;

        const currentMonth = scheduleData.months?.[monthKey];
        const nextMonth = scheduleData.months?.[nextKey];
        const shortCurrent = monthLabelShort(currentMonth?.label, monthKey);
        const shortNext = monthLabelShort(nextMonth?.label, nextKey);

        const h1 = document.getElementById('events-month-title');
        const h2 = document.getElementById('month-summary-title');
        if (h1) h1.textContent = `${shortCurrent}のイベント`;
        if (h2) h2.textContent = `${shortCurrent}の注目プログラム`;

        const eventGrid = document.querySelector('.page-events-month .event-card-grid');
        if (eventGrid) {
            const items = sortEvents(currentMonth?.events || []);
            eventGrid.innerHTML = items.length
                ? items.map((event) => `
                    <article class="event-card" id="${event.id}">
                        <span class="pill">${event.category || 'イベント'}</span>
                        <h3>${event.title}</h3>
                        <div class="event-card-meta"><span>${formatDateJa(event.date)}</span><span>${event.start}-${event.end}</span></div>
                        <p>${event.summary || ''}</p>
                        <div class="event-card-footer"><a class="link-text" href="${resolveDetailPath(event.detailPath)}">詳細を見る</a></div>
                    </article>
                `).join('')
                : '<article class="event-card"><h3>今月の登録イベントはありません</h3></article>';
        }

        let openSection = document.getElementById('js-month-opening-section');
        if (!openSection) {
            const target = document.querySelector('.page-events-month .page-main .page-section:nth-of-type(2)');
            if (target && target.parentElement) {
                openSection = document.createElement('section');
                openSection.id = 'js-month-opening-section';
                openSection.className = 'page-section';
                openSection.innerHTML = `
                    <div class="page-shell split-grid split-grid--equal">
                        <article class="info-panel panel-card">
                            <div class="section-header"><span class="section-eyebrow">Open Status</span><h2 id="js-month-opening-title">今月の開館状況</h2></div>
                            <ul id="js-month-opening-list" class="meta-list"></ul>
                        </article>
                        <article class="info-panel panel-card">
                            <div class="section-header"><span class="section-eyebrow">Next Month</span><h2 id="js-month-next-title">来月の予定</h2></div>
                            <ul id="js-month-next-list" class="notice-list"></ul>
                            <a class="primary-btn" href="../../pages/events/calendar.html">カレンダーを見る</a>
                        </article>
                    </div>
                `;
                target.parentElement.insertBefore(openSection, target.nextSibling);
            }
        }

        const openingTitle = document.getElementById('js-month-opening-title');
        const nextTitle = document.getElementById('js-month-next-title');
        if (openingTitle) openingTitle.textContent = `${shortCurrent}の開館状況`;
        if (nextTitle) nextTitle.textContent = `${shortNext}の予定`;

        const openingList = document.getElementById('js-month-opening-list');
        if (openingList) {
            const openingItems = currentMonth?.openingStatus || [];
            openingList.innerHTML = openingItems.length
                ? openingItems.map((item) => {
                    const isOpen = Boolean(item.isOpen);
                    const hours = item.hours || '休館';
                    const note = item.note ? ` / ${item.note}` : '';
                    const badge = isOpen ? 'badge badge--info' : 'badge badge--alert';
                    return `<li class="meta-item"><span>${formatDateJa(item.date)}</span><span><span class="${badge}">${isOpen ? '開館' : '休館'}</span> ${hours}${note}</span></li>`;
                }).join('')
                : '<li class="meta-item"><span>開館情報がありません</span></li>';
        }

        const nextList = document.getElementById('js-month-next-list');
        if (nextList) {
            const items = sortEvents(nextMonth?.events || []).slice(0, 6);
            nextList.innerHTML = items.length
                ? items.map((event) => `
                    <li class="notice-item">
                        <div class="notice-date">${formatDateJa(event.date)}</div>
                        <div>
                            <p class="notice-title"><a href="${resolveDetailPath(event.detailPath)}">${event.title}</a></p>
                            <p>${event.start}-${event.end}</p>
                        </div>
                    </li>
                `).join('')
                : '<li class="notice-item"><div class="notice-date">予定</div><div><p class="notice-title">来月の予定は準備中です</p></div></li>';
        }
    }

    function renderEventsWeekPage(scheduleData, todayKey) {
        if (!document.body.classList.contains('page-events-week')) return;

        const grid = document.querySelector('.page-events-week .info-tile-grid');
        if (!grid) return;

        const allEvents = sortEvents(getAllEvents(scheduleData.months || {}));
        const withinWeek = allEvents.filter((event) => event.date >= todayKey).slice(0, 14);

        const grouped = new Map();
        withinWeek.forEach((event) => {
            if (!grouped.has(event.date)) grouped.set(event.date, []);
            grouped.get(event.date).push(event);
        });

        const entries = Array.from(grouped.entries()).slice(0, 7);
        grid.innerHTML = entries.length
            ? entries.map(([date, events]) => `
                <article class="info-tile">
                    <h3>${formatDateJa(date)}</h3>
                    <ul class="event-day-list">
                        ${events.map((event) => `<li><a href="${resolveDetailPath(event.detailPath)}">${event.start} ${event.title}</a></li>`).join('')}
                    </ul>
                </article>
            `).join('')
            : '<article class="info-tile"><h3>今週の予定はありません</h3></article>';
    }

    function renderEventsCalendarPage(scheduleData, todayKey, monthKey, nextKey) {
        if (!document.body.classList.contains('page-events-calendar')) return;

        const months = scheduleData.months || {};
        const monthKeys = [monthKey, nextKey].filter((k, i, arr) => months[k] && arr.indexOf(k) === i);
        if (!monthKeys.length) return;

        const grid = document.querySelector('.page-events-calendar .page-section.alt .info-tile-grid');
        const title = document.querySelector('.page-events-calendar .section-header h2');
        if (!grid || !title) return;

        const monthLabel = (key) => {
            const m = months[key];
            return m?.label || `${key.slice(0, 4)}年${Number(key.slice(5, 7))}月`;
        };

        const toDateAtJst = (dateKey) => new Date(`${dateKey}T00:00:00+09:00`);
        const getDayJst = (dateKey) => toDateAtJst(dateKey).getDay();

        const buildMonthView = (key) => {
            const month = months[key];
            const [y, m] = key.split('-').map(Number);
            const firstDay = new Date(y, m - 1, 1).getDay();
            const daysInMonth = new Date(y, m, 0).getDate();
            const daysInPrevMonth = new Date(y, m - 1, 0).getDate();

            const eventsByDate = (month.events || []).reduce((acc, event) => {
                if (!acc[event.date]) acc[event.date] = [];
                acc[event.date].push(event);
                return acc;
            }, {});
            Object.keys(eventsByDate).forEach((date) => {
                eventsByDate[date] = sortEvents(eventsByDate[date]);
            });

            const openingByDate = (month.openingStatus || []).reduce((acc, item) => {
                acc[item.date] = item;
                return acc;
            }, {});

            const cells = [];

            for (let i = 0; i < firstDay; i += 1) {
                const day = daysInPrevMonth - firstDay + i + 1;
                cells.push(`<div class="month-calendar__cell is-out" aria-hidden="true"><span class="month-calendar__date">${day}</span></div>`);
            }

            for (let day = 1; day <= daysInMonth; day += 1) {
                const dateKey = `${key}-${String(day).padStart(2, '0')}`;
                const openInfo = openingByDate[dateKey];
                const hasOpenInfo = Boolean(openInfo);
                const isOpen = Boolean(openInfo?.isOpen);
                const events = eventsByDate[dateKey] || [];
                const statusText = hasOpenInfo ? (isOpen ? '開館' : '休館') : '未設定';
                const statusClass = hasOpenInfo ? (isOpen ? 'is-open' : 'is-closed') : 'is-unknown';
                const countClass = events.length ? '' : 'is-empty';
                const dayOfWeek = getDayJst(dateKey);
                const weekendClass = (dayOfWeek === 0 || dayOfWeek === 6) ? 'is-weekend' : '';
                const todayClass = dateKey === todayKey ? 'is-today' : '';
                const pastClass = dateKey < todayKey ? 'is-past' : '';

                cells.push(`
                    <button type="button" class="month-calendar__cell is-day ${statusClass} ${weekendClass} ${todayClass} ${pastClass}" data-date="${dateKey}" aria-label="${formatDateJa(dateKey)} ${statusText} ${events.length}件のイベント">
                        <span class="month-calendar__date">${day}</span>
                        <span class="month-calendar__status">${statusText}</span>
                        <span class="month-calendar__count ${countClass}">${events.length ? `${events.length}件` : '予定なし'}</span>
                    </button>
                `);
            }

            while (cells.length % 7 !== 0) {
                const day = cells.length - (firstDay + daysInMonth) + 1;
                cells.push(`<div class="month-calendar__cell is-out" aria-hidden="true"><span class="month-calendar__date">${day}</span></div>`);
            }

            return { key, month, eventsByDate, openingByDate, cells };
        };

        const views = monthKeys.map((k) => buildMonthView(k));
        const weekdays = ['日', '月', '火', '水', '木', '金', '土'];

        const closedFuture = views.flatMap((v) => (v.month.openingStatus || []).filter((d) => d.date >= todayKey && d.isOpen === false));
        const eventsFuture = views.flatMap((v) => (v.month.events || []).filter((e) => e.date >= todayKey));
        closedFuture.sort((a, b) => a.date.localeCompare(b.date));
        const sortedEventsFuture = sortEvents(eventsFuture);

        const closedListHtml = closedFuture.length
            ? closedFuture.map((item) => `<li class="calendar-mobile-list__item"><div><p class="calendar-mobile-list__date">${formatDateJa(item.date)}</p><p class="calendar-mobile-list__meta">${item.note || '休館日'}</p></div><span class="badge badge--alert">休館</span></li>`).join('')
            : '<li class="calendar-mobile-list__empty">これからの閉館日はありません。</li>';

        const eventListHtml = sortedEventsFuture.length
            ? sortedEventsFuture.map((event) => `<li class="calendar-mobile-list__item"><div><p class="calendar-mobile-list__date">${formatDateJa(event.date)} ${event.start}-${event.end}</p><p class="calendar-mobile-list__title">${event.title}</p><p class="calendar-mobile-list__meta">${event.summary || ''}</p></div><a class="link-text" href="${resolveDetailPath(event.detailPath)}">詳細</a></li>`).join('')
            : '<li class="calendar-mobile-list__empty">これからのイベント予定はありません。</li>';

        grid.innerHTML = `
            <div class="calendar-desktop">
                <div class="calendar-switch-controls" aria-label="月切り替え">
                    <button type="button" class="calendar-switch-btn" id="calendar-switch-prev" aria-label="前の月">◀</button>
                    <p class="calendar-switch-label" id="calendar-switch-label"></p>
                    <button type="button" class="calendar-switch-btn" id="calendar-switch-next" aria-label="次の月">▶</button>
                </div>
                <div class="calendar-panels">
                    ${views.map((v, idx) => `
                        <section class="calendar-panel ${idx === 0 ? 'is-active' : ''}" data-month="${v.key}">
                            <div class="month-calendar-wrap">
                                <div class="month-calendar-legend" aria-label="開館ステータス凡例">
                                    <span class="legend-chip open">開館</span>
                                    <span class="legend-chip closed">休館</span>
                                    <span class="legend-chip event">イベント件数</span>
                                    <span class="legend-chip today">今日</span>
                                </div>
                                <div class="month-calendar" role="grid" aria-label="${monthLabel(v.key)}のイベントカレンダー">
                                    <div class="month-calendar__weekdays">${weekdays.map((d) => `<span>${d}</span>`).join('')}</div>
                                    <div class="month-calendar__grid">${v.cells.join('')}</div>
                                </div>
                                <aside class="calendar-day-popover" hidden>
                                    <h3 class="calendar-day-popover-title">日付詳細</h3>
                                    <p class="calendar-day-popover-status"></p>
                                    <ul class="calendar-day-popover-events"></ul>
                                </aside>
                            </div>
                        </section>
                    `).join('')}
                </div>
            </div>
            <div class="calendar-mobile-list" aria-label="スマホ用イベント一覧">
                <section class="calendar-mobile-list__block">
                    <h3>これからの閉館日</h3>
                    <ul>${closedListHtml}</ul>
                </section>
                <section class="calendar-mobile-list__block">
                    <h3>これからのイベント予定（今月・来月）</h3>
                    <ul>${eventListHtml}</ul>
                </section>
            </div>
        `;

        const isMobileListView = window.matchMedia('(max-width: 760px)').matches;
        if (isMobileListView) {
            title.textContent = `これからの予定（${monthLabel(monthKey)} / ${months[nextKey] ? monthLabel(nextKey) : ''}）`;
            return;
        }

        let activePanelIndex = 0;
        const panels = Array.from(grid.querySelectorAll('.calendar-panel'));
        const prevBtn = grid.querySelector('#calendar-switch-prev');
        const nextBtn = grid.querySelector('#calendar-switch-next');
        const switchLabel = grid.querySelector('#calendar-switch-label');

        const setPanel = (index) => {
            activePanelIndex = Math.max(0, Math.min(index, panels.length - 1));
            panels.forEach((panel, idx) => panel.classList.toggle('is-active', idx === activePanelIndex));
            if (switchLabel) switchLabel.textContent = monthLabel(views[activePanelIndex].key);
            if (prevBtn) prevBtn.disabled = activePanelIndex === 0;
            if (nextBtn) nextBtn.disabled = activePanelIndex === panels.length - 1;
            title.textContent = `${monthLabel(views[activePanelIndex].key)} カレンダー`;
        };

        if (prevBtn) prevBtn.addEventListener('click', () => setPanel(activePanelIndex - 1));
        if (nextBtn) nextBtn.addEventListener('click', () => setPanel(activePanelIndex + 1));
        setPanel(0);

        panels.forEach((panel) => {
            const monthKeyOfPanel = panel.getAttribute('data-month') || monthKey;
            const view = views.find((v) => v.key === monthKeyOfPanel);
            if (!view) return;

            const wrap = panel.querySelector('.month-calendar-wrap');
            const monthCalendar = panel.querySelector('.month-calendar');
            const popover = panel.querySelector('.calendar-day-popover');
            const popoverTitle = panel.querySelector('.calendar-day-popover-title');
            const popoverStatus = panel.querySelector('.calendar-day-popover-status');
            const popoverEvents = panel.querySelector('.calendar-day-popover-events');
            if (!wrap || !monthCalendar || !popover || !popoverTitle || !popoverStatus || !popoverEvents) return;

            let activeDateKey = '';
            let pinnedDateKey = '';
            let hoverInsidePopover = false;

            const clearActive = () => {
                panel.querySelectorAll('.month-calendar__cell.is-day.is-active').forEach((cell) => cell.classList.remove('is-active'));
            };

            const positionPopover = (button) => {
                const wrapRect = wrap.getBoundingClientRect();
                const btnRect = button.getBoundingClientRect();

                const popWidth = popover.offsetWidth || 340;
                const rawCenter = btnRect.left - wrapRect.left + (btnRect.width / 2);
                const minCenter = (popWidth / 2) + 8;
                const maxCenter = wrapRect.width - (popWidth / 2) - 8;
                const center = Math.min(Math.max(rawCenter, minCenter), Math.max(minCenter, maxCenter));
                const popLeft = center - (popWidth / 2);

                const belowTop = btnRect.bottom - wrapRect.top + 10;
                const popHeight = popover.offsetHeight || 180;
                const aboveTop = btnRect.top - wrapRect.top - popHeight - 12;
                const useAbove = aboveTop > 8;

                popover.classList.toggle('is-above', useAbove);
                popover.style.left = `${popLeft}px`;
                popover.style.top = `${useAbove ? aboveTop : belowTop}px`;
                popover.style.setProperty('--arrow-x', `${center - popLeft}px`);
            };

            const fillPopover = (dateKey) => {
                const openInfo = view.openingByDate[dateKey];
                const hasOpenInfo = Boolean(openInfo);
                const isOpen = Boolean(openInfo?.isOpen);
                const hours = hasOpenInfo ? (openInfo?.hours || '休館日') : '未設定';
                const note = openInfo?.note ? `（${openInfo.note}）` : '';
                const events = view.eventsByDate[dateKey] || [];

                popoverTitle.textContent = `${formatDateJa(dateKey)} の詳細`;
                popoverStatus.textContent = `${hasOpenInfo ? (isOpen ? '開館' : '休館') : '未設定'} / ${hours} ${note}`.trim();
                popoverEvents.innerHTML = events.length
                    ? events.map((event) => `<li><a href="${resolveDetailPath(event.detailPath)}">${event.start}-${event.end} ${event.title}</a><p>${event.summary || ''}</p></li>`).join('')
                    : '<li>この日のイベント予定はありません。</li>';
            };

            const showPopover = (dateKey, button) => {
                activeDateKey = dateKey;
                clearActive();
                button.classList.add('is-active');
                fillPopover(dateKey);
                popover.hidden = false;
                positionPopover(button);
            };

            const hidePopover = (force = false) => {
                if (!force && pinnedDateKey) return;
                popover.hidden = true;
                activeDateKey = '';
                clearActive();
            };

            popover.addEventListener('mouseenter', () => { hoverInsidePopover = true; });
            popover.addEventListener('mouseleave', () => {
                hoverInsidePopover = false;
                if (!pinnedDateKey) hidePopover(true);
            });

            panel.querySelectorAll('.month-calendar__cell.is-day').forEach((button) => {
                button.addEventListener('click', () => {
                    const dateKey = button.getAttribute('data-date');
                    if (!dateKey) return;

                    if (pinnedDateKey === dateKey) {
                        pinnedDateKey = '';
                        hidePopover(true);
                        return;
                    }

                    pinnedDateKey = dateKey;
                    showPopover(dateKey, button);
                });

                button.addEventListener('mouseenter', () => {
                    const dateKey = button.getAttribute('data-date');
                    if (!dateKey) return;
                    showPopover(dateKey, button);
                });

                button.addEventListener('mouseleave', () => {
                    setTimeout(() => {
                        if (!pinnedDateKey && !hoverInsidePopover) hidePopover(true);
                    }, 40);
                });
            });

            document.addEventListener('click', (e) => {
                if (popover.hidden) return;
                const target = e.target;
                if (!(target instanceof Node)) return;
                if (!wrap.contains(target) || (!popover.contains(target) && !(target instanceof HTMLElement && target.closest('.month-calendar__cell.is-day')))) {
                    pinnedDateKey = '';
                    hidePopover(true);
                }
            });

            monthCalendar.addEventListener('scroll', () => {
                if (popover.hidden || !activeDateKey) return;
                const activeButton = panel.querySelector(`.month-calendar__cell.is-day[data-date="${activeDateKey}"]`);
                if (activeButton instanceof HTMLElement) positionPopover(activeButton);
            }, { passive: true });

            window.addEventListener('resize', () => {
                if (popover.hidden || !activeDateKey) return;
                const activeButton = panel.querySelector(`.month-calendar__cell.is-day[data-date="${activeDateKey}"]`);
                if (activeButton instanceof HTMLElement) positionPopover(activeButton);
            });
        });
    }

    async function initScheduleFromJson() {
        try {
            const response = await fetch(getScheduleDataPath(), { cache: 'no-store' });
            if (!response.ok) throw new Error(`Failed to load schedule.json: ${response.status}`);

            const scheduleData = await response.json();
            const timeZone = scheduleData.meta?.timezone || 'Asia/Tokyo';
            const todayKey = getDateKeyInTimeZone(timeZone);
            const monthKey = toMonthKey(todayKey);
            const nextKey = nextMonthKey(monthKey);

            renderHomeScheduleCard(scheduleData, todayKey, monthKey);
            renderEventsIndexPage(scheduleData, todayKey, monthKey, nextKey);
            renderEventsMonthPage(scheduleData, todayKey, monthKey, nextKey);
            renderEventsWeekPage(scheduleData, todayKey);
            renderEventsCalendarPage(scheduleData, todayKey, monthKey, nextKey);
            initHeaderNotifications(scheduleData, todayKey);
        } catch (error) {
            // Keep static fallback content if JSON loading fails.
            console.warn('[schedule]', error);
            initHeaderNotifications({}, getDateKeyInTimeZone('Asia/Tokyo'));
        }
    }

    initScheduleFromJson();
});











