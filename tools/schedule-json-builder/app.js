(() => {
    'use strict';

    const DAY_NAMES = ['日', '月', '火', '水', '木', '金', '土'];
    const CATEGORY_OPTIONS = [
        { value: '相談', code: 'consult' },
        { value: '交流', code: 'exchange' },
        { value: '学び', code: 'learn' },
        { value: '地域', code: 'local' },
        { value: '講座', code: 'course' },
        { value: '運営', code: 'operation' },
        { value: 'イベント', code: 'event' },
        { value: 'その他', code: 'other' }
    ];

    const refs = {
        metaName: document.getElementById('meta-name'),
        metaTimezone: document.getElementById('meta-timezone'),
        metaUpdatedAt: document.getElementById('meta-updated-at'),
        monthA: document.getElementById('month-a'),
        monthB: document.getElementById('month-b'),
        monthError: document.getElementById('month-error'),
        buildMonths: document.getElementById('build-months'),
        builderPanel: document.getElementById('builder-panel'),
        monthTabs: document.getElementById('month-tabs'),
        monthEditor: document.getElementById('month-editor'),
        generateJson: document.getElementById('generate-json'),
        copyJson: document.getElementById('copy-json'),
        downloadJson: document.getElementById('download-json'),
        copyStatus: document.getElementById('copy-status'),
        output: document.getElementById('json-output')
    };

    const state = {
        monthsOrder: [],
        activeMonthKey: '',
        months: {},
        openEventUid: {}
    };

    const toDateKey = (year, month, day) => `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

    const monthLabel = (monthKey) => {
        const [year, month] = monthKey.split('-').map(Number);
        return `${year}年${month}月`;
    };

    const getDaysInMonth = (monthKey) => {
        const [year, month] = monthKey.split('-').map(Number);
        return new Date(year, month, 0).getDate();
    };

    const dayOfWeek = (dateKey) => {
        const [y, m, d] = dateKey.split('-').map(Number);
        return new Date(y, m - 1, d).getDay();
    };

    const defaultHoursForDow = (dow) => {
        if (dow === 6) return '10:00-19:00';
        if (dow === 0) return null;
        return '10:00-21:00';
    };

    const isThirdMonday = (dateKey) => {
        const [year, month, day] = dateKey.split('-').map(Number);
        const date = new Date(year, month - 1, day);
        return date.getDay() === 1 && day >= 15 && day <= 21;
    };

    const buildDefaultOpeningStatus = (monthKey) => {
        const [year, month] = monthKey.split('-').map(Number);
        const days = getDaysInMonth(monthKey);
        const rows = [];

        for (let day = 1; day <= days; day += 1) {
            const date = toDateKey(year, month, day);
            const dow = dayOfWeek(date);
            const closeBySunday = dow === 0;
            const closeByThirdMonday = isThirdMonday(date);
            const isOpen = !(closeBySunday || closeByThirdMonday);
            let note = '';

            if (!isOpen) {
                note = closeByThirdMonday ? '休館日（第3月曜）' : '定休日';
            }

            rows.push({
                date,
                day: DAY_NAMES[dow],
                isOpen,
                status: isOpen ? '営業' : '休館',
                hours: isOpen ? defaultHoursForDow(dow) : null,
                note
            });
        }

        return rows;
    };

    const categoryCode = (category) => {
        const hit = CATEGORY_OPTIONS.find((item) => item.value === category);
        return hit ? hit.code : 'event';
    };

    const slugifyTitle = (title) => {
        const slug = String(title || '')
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '');
        return slug;
    };

    const generateEventId = (monthKey, event, index = 0) => {
        const datePart = (event.date || `${monthKey}-01`).replace(/-/g, '');
        const cat = categoryCode(event.category);
        const titleSlug = slugifyTitle(event.title);
        const suffix = titleSlug || `item${String(index + 1).padStart(2, '0')}`;
        return `evt-${datePart}-${cat}-${suffix}`;
    };

    const newEvent = (monthKey, index = 0) => {
        const temp = {
            date: `${monthKey}-01`,
            category: 'イベント',
            title: ''
        };
        const id = generateEventId(monthKey, temp, index);

        return {
            uid: `event-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
            id,
            date: `${monthKey}-01`,
            start: '19:00',
            end: '20:30',
            title: '',
            category: 'イベント',
            summary: '',
            detailPath: `pages/events/detail-sample.html?event=${id}`
        };
    };

    const initDefaultMonths = () => {
        const now = new Date();
        const y = now.getFullYear();
        const m = now.getMonth() + 1;
        const nextY = m === 12 ? y + 1 : y;
        const nextM = m === 12 ? 1 : m + 1;

        refs.monthA.value = `${y}-${String(m).padStart(2, '0')}`;
        refs.monthB.value = `${nextY}-${String(nextM).padStart(2, '0')}`;
        refs.metaUpdatedAt.value = new Date().toISOString().slice(0, 10);
    };

    const ensureMonthData = (monthKey) => {
        if (state.months[monthKey]) return;
        state.months[monthKey] = {
            label: monthLabel(monthKey),
            openingStatus: buildDefaultOpeningStatus(monthKey),
            events: []
        };
    };

    const applyOpeningPattern = (monthKey, pattern) => {
        const month = state.months[monthKey];
        if (!month) return;

        month.openingStatus = month.openingStatus.map((row) => {
            const dow = dayOfWeek(row.date);
            if (pattern === 'all-open') {
                return {
                    ...row,
                    isOpen: true,
                    status: '営業',
                    hours: defaultHoursForDow(dow) || '10:00-21:00',
                    note: ''
                };
            }
            if (pattern === 'all-closed') {
                return {
                    ...row,
                    isOpen: false,
                    status: '休館',
                    hours: null,
                    note: '休館日'
                };
            }

            const closeBySunday = dow === 0;
            const closeByThirdMonday = isThirdMonday(row.date);
            const isOpen = !(closeBySunday || closeByThirdMonday);
            return {
                ...row,
                isOpen,
                status: isOpen ? '営業' : '休館',
                hours: isOpen ? defaultHoursForDow(dow) : null,
                note: isOpen ? '' : (closeByThirdMonday ? '休館日（第3月曜）' : '定休日')
            };
        });

        renderMonthEditor();
    };

    const renderTabs = () => {
        refs.monthTabs.innerHTML = state.monthsOrder.map((monthKey) => {
            const isActive = monthKey === state.activeMonthKey;
            const count = state.months[monthKey]?.events?.length || 0;
            return `
                <button
                    type="button"
                    class="month-tab"
                    role="tab"
                    aria-selected="${isActive ? 'true' : 'false'}"
                    data-month-tab="${monthKey}"
                >${monthLabel(monthKey)}（イベント${count}件）</button>
            `;
        }).join('');

        refs.monthTabs.querySelectorAll('[data-month-tab]').forEach((btn) => {
            btn.addEventListener('click', () => {
                state.activeMonthKey = btn.getAttribute('data-month-tab') || state.activeMonthKey;
                renderTabs();
                renderMonthEditor();
            });
        });
    };

    const openingRowHtml = (row, idx) => {
        const statusClass = row.isOpen ? 'badge badge-open' : 'badge badge-closed';
        return `
            <tr>
                <td>${row.date}</td>
                <td>${row.day}</td>
                <td>
                    <label class="opening-status">
                        <input type="checkbox" data-open-toggle="${idx}" ${row.isOpen ? 'checked' : ''}>
                        <span class="${statusClass}">${row.isOpen ? '開館' : '休館'}</span>
                    </label>
                </td>
                <td>
                    <input
                        type="text"
                        data-open-hours="${idx}"
                        value="${row.hours || ''}"
                        ${row.isOpen ? '' : 'disabled'}
                        placeholder="10:00-21:00"
                    >
                </td>
                <td>
                    <input type="text" data-open-note="${idx}" value="${row.note || ''}" placeholder="補足メモ">
                </td>
            </tr>
        `;
    };

    const eventCategoryOptionsHtml = (currentCategory) => {
        return CATEGORY_OPTIONS.map((opt) => `<option value="${opt.value}" ${opt.value === currentCategory ? 'selected' : ''}>${opt.value}</option>`).join('');
    };

    const eventCardHtml = (monthKey, event, idx, isCollapsed) => {
        const openLabel = isCollapsed ? '展開' : '最小化';
        const summaryTitle = event.title?.trim() ? event.title.trim() : 'タイトル未入力';

        return `
            <article class="event-item ${isCollapsed ? 'is-collapsed' : ''}" data-event-uid="${event.uid}">
                <header>
                    <h4>イベント ${idx + 1}：${summaryTitle}</h4>
                    <div class="event-actions">
                        <button type="button" class="btn btn-small" data-toggle-event="${event.uid}">${openLabel}</button>
                        <button type="button" class="btn btn-small" data-remove-event="${event.uid}">削除</button>
                    </div>
                </header>
                <div class="event-body">
                    <div class="event-grid">
                        <label class="full">
                            <span>イベントID（id） <small>未入力なら自動生成</small></span>
                            <div class="inline-input">
                                <input
                                    type="text"
                                    data-event-field="id"
                                    data-event-uid="${event.uid}"
                                    value="${event.id}"
                                    placeholder="例: evt-20260314-consult-item01"
                                >
                                <button type="button" class="btn btn-small" data-auto-id="${event.uid}">自動生成</button>
                            </div>
                            <p class="helper-text">形式の目安: <code>evt-YYYYMMDD-ジャンル-識別子</code>（重複しない値）</p>
                        </label>

                        <label>
                            <span>開催日（date）</span>
                            <input type="date" data-event-field="date" data-event-uid="${event.uid}" value="${event.date}">
                        </label>

                        <label>
                            <span>ジャンル（category）</span>
                            <select data-event-field="category" data-event-uid="${event.uid}">
                                ${eventCategoryOptionsHtml(event.category)}
                            </select>
                        </label>

                        <label>
                            <span>開始時刻（start）</span>
                            <input type="time" data-event-field="start" data-event-uid="${event.uid}" value="${event.start}">
                        </label>

                        <label>
                            <span>終了時刻（end）</span>
                            <input type="time" data-event-field="end" data-event-uid="${event.uid}" value="${event.end}">
                        </label>

                        <label class="full">
                            <span>イベント名（title）</span>
                            <input
                                type="text"
                                data-event-field="title"
                                data-event-uid="${event.uid}"
                                value="${event.title}"
                                placeholder="例: 春のチャレンジ相談会"
                            >
                        </label>

                        <label class="full">
                            <span>概要（summary）</span>
                            <textarea data-event-field="summary" data-event-uid="${event.uid}" placeholder="例: 新年度に向けた相談会。">${event.summary}</textarea>
                        </label>

                        <label class="full">
                            <span>詳細リンク（detailPath） <small>未入力ならサンプルリンク自動補完</small></span>
                            <input
                                type="text"
                                data-event-field="detailPath"
                                data-event-uid="${event.uid}"
                                value="${event.detailPath}"
                                placeholder="例: pages/events/detail-sample.html?event=evt-20260314-consult-item01"
                            >
                        </label>
                    </div>
                </div>
            </article>
        `;
    };

    const findEventByUid = (month, uid) => month.events.find((item) => item.uid === uid);

    const renderMonthEditor = () => {
        const monthKey = state.activeMonthKey;
        const month = state.months[monthKey];
        if (!month) {
            refs.monthEditor.innerHTML = '';
            return;
        }

        const openUid = state.openEventUid[monthKey] || (month.events[0]?.uid || '');
        state.openEventUid[monthKey] = openUid;

        refs.monthEditor.innerHTML = `
            <div class="month-layout">
                <section class="subpanel">
                    <h3>${month.label} の開館情報</h3>
                    <div class="row-actions">
                        <button type="button" class="btn" data-pattern="standard">標準パターン適用</button>
                        <button type="button" class="btn" data-pattern="all-open">全日開館</button>
                        <button type="button" class="btn" data-pattern="all-closed">全日休館</button>
                    </div>
                    <div class="opening-scroll">
                        <table class="opening-table">
                            <thead>
                                <tr>
                                    <th>date</th>
                                    <th>day</th>
                                    <th>isOpen/status</th>
                                    <th>hours</th>
                                    <th>note</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${month.openingStatus.map(openingRowHtml).join('')}
                            </tbody>
                        </table>
                    </div>
                </section>

                <section class="subpanel">
                    <div class="events-head">
                        <h3>${month.label} のイベント情報</h3>
                        <button type="button" class="btn btn-primary" id="add-event-btn">イベント追加</button>
                    </div>
                    <p class="hint">イベントを追加すると、既存イベントは自動で最小化されます。</p>
                    <div class="events-list">
                        ${month.events.length
                ? month.events.map((event, idx) => eventCardHtml(monthKey, event, idx, event.uid !== openUid)).join('')
                : '<p class="hint">イベントがありません。追加ボタンで入力欄を作成してください。</p>'}
                    </div>
                </section>
            </div>
        `;

        refs.monthEditor.querySelectorAll('[data-pattern]').forEach((btn) => {
            btn.addEventListener('click', () => {
                const pattern = btn.getAttribute('data-pattern') || 'standard';
                applyOpeningPattern(monthKey, pattern);
            });
        });

        refs.monthEditor.querySelectorAll('[data-open-toggle]').forEach((el) => {
            el.addEventListener('change', () => {
                const index = Number(el.getAttribute('data-open-toggle'));
                const row = month.openingStatus[index];
                if (!row) return;
                row.isOpen = el.checked;
                row.status = row.isOpen ? '営業' : '休館';
                if (!row.isOpen) {
                    row.hours = null;
                    if (!row.note) row.note = '休館日';
                } else if (!row.hours) {
                    row.hours = defaultHoursForDow(dayOfWeek(row.date)) || '10:00-21:00';
                    if (row.note === '休館日') row.note = '';
                }
                renderMonthEditor();
            });
        });

        refs.monthEditor.querySelectorAll('[data-open-hours]').forEach((el) => {
            el.addEventListener('input', () => {
                const index = Number(el.getAttribute('data-open-hours'));
                const row = month.openingStatus[index];
                if (!row || !row.isOpen) return;
                row.hours = el.value.trim();
            });
        });

        refs.monthEditor.querySelectorAll('[data-open-note]').forEach((el) => {
            el.addEventListener('input', () => {
                const index = Number(el.getAttribute('data-open-note'));
                const row = month.openingStatus[index];
                if (!row) return;
                row.note = el.value;
            });
        });

        const addEventBtn = document.getElementById('add-event-btn');
        if (addEventBtn) {
            addEventBtn.addEventListener('click', () => {
                const event = newEvent(monthKey, month.events.length);
                month.events.push(event);
                state.openEventUid[monthKey] = event.uid;
                renderTabs();
                renderMonthEditor();
            });
        }

        refs.monthEditor.querySelectorAll('[data-toggle-event]').forEach((btn) => {
            btn.addEventListener('click', () => {
                const uid = btn.getAttribute('data-toggle-event');
                if (!uid) return;
                state.openEventUid[monthKey] = (state.openEventUid[monthKey] === uid) ? '' : uid;
                renderMonthEditor();
            });
        });

        refs.monthEditor.querySelectorAll('[data-auto-id]').forEach((btn) => {
            btn.addEventListener('click', () => {
                const uid = btn.getAttribute('data-auto-id');
                if (!uid) return;
                const event = findEventByUid(month, uid);
                if (!event) return;
                const index = month.events.findIndex((item) => item.uid === uid);
                event.id = generateEventId(monthKey, event, index);
                if (!event.detailPath || event.detailPath.includes('detail-sample.html?event=')) {
                    event.detailPath = `pages/events/detail-sample.html?event=${event.id}`;
                }
                state.openEventUid[monthKey] = uid;
                renderMonthEditor();
            });
        });

        refs.monthEditor.querySelectorAll('[data-remove-event]').forEach((btn) => {
            btn.addEventListener('click', () => {
                const uid = btn.getAttribute('data-remove-event');
                month.events = month.events.filter((event) => event.uid !== uid);
                if (state.openEventUid[monthKey] === uid) {
                    state.openEventUid[monthKey] = month.events[0]?.uid || '';
                }
                renderTabs();
                renderMonthEditor();
            });
        });

        refs.monthEditor.querySelectorAll('[data-event-field]').forEach((input) => {
            const handler = () => {
                const uid = input.getAttribute('data-event-uid');
                const field = input.getAttribute('data-event-field');
                const event = findEventByUid(month, uid);
                if (!event || !field) return;
                event[field] = input.value;
            };
            input.addEventListener('input', handler);
            input.addEventListener('change', handler);
        });
    };

    const sortEvents = (events) => {
        return [...events].sort((a, b) => `${a.date} ${a.start}`.localeCompare(`${b.date} ${b.start}`));
    };

    const cleanEvent = (monthKey, event, index) => {
        const id = event.id.trim() || generateEventId(monthKey, event, index);
        const detailPath = event.detailPath.trim() || `pages/events/detail-sample.html?event=${id}`;
        return {
            id,
            date: event.date,
            start: event.start,
            end: event.end,
            title: event.title.trim(),
            category: event.category.trim() || 'イベント',
            summary: event.summary.trim(),
            detailPath
        };
    };

    const buildJsonObject = () => {
        const months = {};

        state.monthsOrder.forEach((monthKey) => {
            const month = state.months[monthKey];
            if (!month) return;

            const openingStatus = month.openingStatus
                .map((row) => {
                    const open = Boolean(row.isOpen);
                    const dow = dayOfWeek(row.date);
                    return {
                        date: row.date,
                        day: row.day,
                        isOpen: open,
                        status: open ? '営業' : '休館',
                        hours: open ? (row.hours || defaultHoursForDow(dow) || '10:00-21:00') : null,
                        note: row.note || ''
                    };
                })
                .sort((a, b) => a.date.localeCompare(b.date));

            const events = sortEvents(month.events)
                .map((event, idx) => cleanEvent(monthKey, event, idx))
                .filter((event) => event.date && event.start && event.end && event.title);

            months[monthKey] = {
                label: month.label,
                openingStatus,
                events
            };
        });

        return {
            meta: {
                name: refs.metaName.value.trim() || 'スケジュールデータ',
                timezone: refs.metaTimezone.value.trim() || 'Asia/Tokyo',
                updatedAt: refs.metaUpdatedAt.value || new Date().toISOString().slice(0, 10)
            },
            months
        };
    };

    const generateJson = () => {
        if (!state.monthsOrder.length) {
            refs.copyStatus.textContent = '先に2か月分のフォームを作成してください。';
            return;
        }
        const jsonObj = buildJsonObject();
        refs.output.value = JSON.stringify(jsonObj, null, 4);
        refs.copyStatus.textContent = 'JSONを生成しました。';
    };

    const copyJson = async () => {
        if (!refs.output.value.trim()) {
            refs.copyStatus.textContent = '先にJSONを生成してください。';
            return;
        }

        try {
            await navigator.clipboard.writeText(refs.output.value);
            refs.copyStatus.textContent = 'コピーしました。';
        } catch (error) {
            refs.output.focus();
            refs.output.select();
            const ok = document.execCommand('copy');
            refs.copyStatus.textContent = ok ? 'コピーしました。' : 'コピーに失敗しました。';
        }
    };

    const downloadJson = () => {
        if (!refs.output.value.trim()) {
            refs.copyStatus.textContent = '先にJSONを生成してください。';
            return;
        }

        const blob = new Blob([refs.output.value], { type: 'application/json;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        const suffix = (refs.metaUpdatedAt.value || new Date().toISOString().slice(0, 10)).replace(/-/g, '');
        a.href = url;
        a.download = `schedule.generated.${suffix}.json`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
        refs.copyStatus.textContent = 'JSONファイルをダウンロードしました。';
    };

    const buildMonths = () => {
        const monthA = refs.monthA.value;
        const monthB = refs.monthB.value;

        refs.monthError.textContent = '';

        if (!monthA || !monthB) {
            refs.monthError.textContent = '月Aと月Bの両方を選択してください。';
            return;
        }

        if (monthA === monthB) {
            refs.monthError.textContent = '同じ月は選べません。別々の2か月を選択してください。';
            return;
        }

        state.monthsOrder = [monthA, monthB].sort();
        state.monthsOrder.forEach(ensureMonthData);
        state.activeMonthKey = state.monthsOrder[0];

        refs.builderPanel.hidden = false;
        renderTabs();
        renderMonthEditor();
        refs.copyStatus.textContent = '2か月分のフォームを準備しました。';
    };

    refs.buildMonths.addEventListener('click', buildMonths);
    refs.generateJson.addEventListener('click', generateJson);
    refs.copyJson.addEventListener('click', copyJson);
    refs.downloadJson.addEventListener('click', downloadJson);

    initDefaultMonths();
})();
