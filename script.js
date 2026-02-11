document.addEventListener('DOMContentLoaded', () => {
    document.documentElement.classList.add('js');

    /* --- 1. 繝倥ャ繝繝ｼ縺ｮ繧ｹ繧ｯ繝ｭ繝ｼ繝ｫ蛻ｶ蠕｡ --- */
    let lastScrollY = window.scrollY;
    const header = document.getElementById('main-header');

    if (header) {
        window.addEventListener('scroll', () => {
            const currentScrollY = window.scrollY;

            if (currentScrollY <= 0) {
                // 譛荳企Κ縺ｯ蟶ｸ縺ｫ陦ｨ遉ｺ
                header.classList.remove('hidden');
            } else if (currentScrollY > lastScrollY) {
                // 荳九↓繧ｹ繧ｯ繝ｭ繝ｼ繝ｫ -> 髫縺・
                header.classList.add('hidden');
            } else {
                // 荳翫↓繧ｹ繧ｯ繝ｭ繝ｼ繝ｫ -> 陦ｨ遉ｺ
                header.classList.remove('hidden');
            }
            lastScrollY = currentScrollY;
        });
    }

    /* --- 3. 繝ｩ繝ｳ繝繝繧ｳ繝ｳ繝・Φ繝・｡ｨ遉ｺ (繝√Ε繝ｬ繝吶ｒ繧ゅ▲縺ｨ遏･繧・ --- */
    const contentData = [
        { title: "施設案内", img: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=500&q=60" },
        { title: "地域のイベント", img: "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=500&q=60" },
        { title: "イベント情報", img: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=500&q=60" },
        { title: "レンタルスペース", img: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=500&q=60" },
        { title: "ギャラリー", img: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&w=500&q=60" }
    ];

    const randomArea = document.getElementById('random-content-area');

    // 驟榊・繧偵す繝｣繝・ヵ繝ｫ縺吶ｋ髢｢謨ｰ
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    // 3縺､驕ｸ繧薙〒陦ｨ遉ｺ
    if (randomArea) {
        const selectedContents = shuffleArray([...contentData]).slice(0, 3);

        selectedContents.forEach(content => {
            const cardHTML = `
            <div class="nav-card">
                <img src="${content.img}" alt="${content.title}" class="nav-card-img">
                <div class="nav-card-title">${content.title}</div>
            </div>
        `;
            randomArea.insertAdjacentHTML('beforeend', cardHTML);
        });
    }

    /* --- 4. 縺頑ｰ励↓蜈･繧頑ｩ溯・ (Local Storage) --- */
    const heartBtns = document.querySelectorAll('.heart-btn');

    // 繝壹・繧ｸ隱ｭ縺ｿ霎ｼ縺ｿ譎ゅ↓迥ｶ諷句ｾｩ蜈・(莉雁屓縺ｯ邁｡譏鍋噪縺ｫ繧､繝ｳ繝・ャ繧ｯ繧ｹ縺ｧ邂｡逅・
    heartBtns.forEach((btn, index) => {
        const isLiked = localStorage.getItem(`liked_news_${index}`);
        if (isLiked === 'true') {
            btn.classList.add('active');
            btn.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="#E91E63" stroke="#E91E63" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>`;
        }

        btn.addEventListener('click', () => {
            btn.classList.toggle('active');
            const isActive = btn.classList.contains('active');
            
            // 繧｢繧､繧ｳ繝ｳ蛻・ｊ譖ｿ縺・
            if(isActive){
                btn.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="#E91E63" stroke="#E91E63" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>`;
            } else {
                btn.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>`;
            }

            // 菫晏ｭ・
            localStorage.setItem(`liked_news_${index}`, isActive);
        });
    });

    /* --- 5. 繝上Φ繝舌・繧ｬ繝ｼ繝｡繝九Η繝ｼ --- */
    const menuToggle = document.getElementById('menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');

    if (menuToggle && mobileMenu) {
        menuToggle.addEventListener('click', () => {
            mobileMenu.classList.toggle('open');
        });
    }

    /* --- 5-1. 繝｢繝舌う繝ｫ繝｡繝九Η繝ｼ 繝峨Ο繝・・繝繧ｦ繝ｳ讖溯・ --- */
    const dropdownToggles = document.querySelectorAll('.dropdown-toggle');
    
    dropdownToggles.forEach(toggle => {
        toggle.addEventListener('click', (e) => {
            e.preventDefault();
            const mobileNavItem = toggle.closest('.mobile-nav-item');
            const isOpen = mobileNavItem.classList.contains('open');
            
            // 蜷後§繝ｬ繝吶Ν縺ｮ莉悶・繧ｪ繝ｼ繝励Φ繧｢繧､繝・Β繧帝哩縺倥ｋ
            document.querySelectorAll('.mobile-nav-item.open').forEach(item => {
                if (item !== mobileNavItem) {
                    item.classList.remove('open');
                    item.querySelector('.dropdown-toggle').setAttribute('aria-expanded', 'false');
                }
            });
            
            // 迴ｾ蝨ｨ縺ｮ繧｢繧､繝・Β繧帝幕縺・髢峨§繧・
            mobileNavItem.classList.toggle('open');
            toggle.setAttribute('aria-expanded', !isOpen);
        });
    });

    /* --- 6. 繧ｹ繧ｯ繝ｭ繝ｼ繝ｫ縺ｧ縺ｵ繧上▲縺ｨ陦ｨ遉ｺ --- */
    const revealCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                // 荳蠎ｦ陦ｨ遉ｺ縺輔ｌ縺溘ｉ逶｣隕悶ｒ邨ゆｺ・☆繧句ｴ蜷茨ｼ・蝗槭″繧翫・貍泌・・・
                observer.unobserve(entry.target);
            }
        });
    };

    const revealElements = document.querySelectorAll('.reveal');
    if (!('IntersectionObserver' in window)) {
        revealElements.forEach(el => el.classList.add('active'));
    } else {
        const revealObserver = new IntersectionObserver(revealCallback, {
            threshold: 0.25 // 10%隕九∴縺溘ｉ螳溯｡・
        });
        revealElements.forEach(el => revealObserver.observe(el));
    }

    /* --- 7. 繧ｹ繝ｩ繧､繝芽・蜍募・逕滂ｼ医Ν繝ｼ繝暦ｼ峨∫ｸｦ繝峨ャ繝医・繧ｯ繝ｪ繝・け縺ｧ縺ｮ蛻・崛縲√・繝舌・縺ｧ荳譎ょ●豁｢縲√ラ繝・ヨ繝ｻ繝翫ン縺ｮ蜷梧悄 --- */
    // 繧ｹ繝ｩ繧､繝峨→繧､繝ｳ繧ｸ繧ｱ繝ｼ繧ｿ繝ｼ繧貞叙蠕・
    const mvSlides = Array.from(document.querySelectorAll('.mv-container .slide'));
    const dots = Array.from(document.querySelectorAll('.vertical-bar .vertical-dot'));
    // optional: 蟾ｦ蛛ｴ縺ｮ nav・医≠繧句ｴ蜷医・縺ｿ蜷梧悄・・
    const navItems = Array.from(document.querySelectorAll('.mv-nav-item'));

    if (mvSlides.length) {
        // 蛻晄悄繧､繝ｳ繝・ャ繧ｯ繧ｹ・・ctive 縺後≠繧後・縺昴ｌ繧貞━蜈茨ｼ・
        let index = mvSlides.findIndex(s => s.classList.contains('active'));
        if (index === -1) index = 0;

        let timer = null;
        const INTERVAL = 4000;

        const show = (i, userAction = false) => {
            index = ((i % mvSlides.length) + mvSlides.length) % mvSlides.length;
            mvSlides.forEach((s, idx) => s.classList.toggle('active', idx === index));
            if (dots.length) dots.forEach((d, idx) => d.classList.toggle('active', idx === index));
            if (navItems.length) navItems.forEach((n, idx) => n.classList.toggle('active', idx === index));
            if (userAction) restartTimer();
        };

        const next = () => show(index + 1);
        const startTimer = () => { stopTimer(); timer = setInterval(next, INTERVAL); };
        const stopTimer = () => { if (timer) { clearInterval(timer); timer = null; } };
        const restartTimer = () => { stopTimer(); startTimer(); };

        // 繝峨ャ繝域桃菴・
        if (dots.length) {
            dots.forEach((dot, i) => {
                dot.addEventListener('click', (e) => { e.preventDefault(); show(i, true); });
                dot.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); show(i, true); }
                });
            });
        }

        // 繝翫ン・亥ｷｦ蛛ｴ・峨′縺ゅｌ縺ｰ繧ｯ繝ｪ繝・け縺ｧ蜷梧悄
        if (navItems.length) {
            navItems.forEach((item, i) => {
                item.addEventListener('click', (e) => { e.preventDefault(); show(i, true); });
            });
        }

        // 繝帙ヰ繝ｼ縺ｧ荳譎ょ●豁｢・医い繧ｯ繧ｻ繧ｷ繝薙Μ繝・ぅ縺ｮ縺溘ａ・・
        const container = document.querySelector('.mv-container');
        if (container) {
            container.addEventListener('mouseenter', stopTimer);
            container.addEventListener('mouseleave', startTimer);
        }

        // 蛻晄悄陦ｨ遉ｺ縺ｨ閾ｪ蜍募・逕滄幕蟋・
        show(index);
        startTimer();
    }
});

