document.addEventListener('DOMContentLoaded', () => {

    /* --- 1. ヘッダーのスクロール制御 --- */
    let lastScrollY = window.scrollY;
    const header = document.getElementById('main-header');

    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;

        if (currentScrollY <= 0) {
            // 最上部は常に表示
            header.classList.remove('hidden');
        } else if (currentScrollY > lastScrollY) {
            // 下にスクロール -> 隠す
            header.classList.add('hidden');
        } else {
            // 上にスクロール -> 表示
            header.classList.remove('hidden');
        }
        lastScrollY = currentScrollY;
    });

    /* --- 2. メインビジュアルのスライダー --- */
    const slides = document.querySelectorAll('.slide');
    const navItems = document.querySelectorAll('.mv-nav-item');
    let currentIndex = 0;
    const slideIntervalTime = 5000;
    let slideInterval;

    function showSlide(index) {
        // すべて非アクティブ化
        slides.forEach(slide => slide.classList.remove('active'));
        navItems.forEach(item => item.classList.remove('active'));

        // 対象をアクティブ化
        slides[index].classList.add('active');
        navItems[index].classList.add('active');
        
        currentIndex = index;
    }

    function nextSlide() {
        let nextIndex = (currentIndex + 1) % slides.length;
        showSlide(nextIndex);
    }

    // 自動再生開始
    function startSlideShow() {
        slideInterval = setInterval(nextSlide, slideIntervalTime);
    }

    // 自動再生停止（操作時用）
    function resetSlideShow() {
        clearInterval(slideInterval);
        startSlideShow();
    }

    // ナビゲーションクリックイベント
    navItems.forEach((item, index) => {
        item.addEventListener('click', () => {
            showSlide(index);
            resetSlideShow();
        });
    });

    // 初期起動
    startSlideShow();

    /* --- 3. ランダムコンテンツ表示 (チャレベをもっと知る) --- */
    const contentData = [
        { title: "これまでの活動記録", img: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=500&q=60" },
        { title: "まちの部活動", img: "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=500&q=60" },
        { title: "イベントアーカイブ", img: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=500&q=60" },
        { title: "施設の使い方", img: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=500&q=60" },
        { title: "ボランティア募集", img: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&w=500&q=60" }
    ];

    const randomArea = document.getElementById('random-content-area');

    // 配列をシャッフルする関数
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    // 3つ選んで表示
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

    /* --- 4. お気に入り機能 (Local Storage) --- */
    const heartBtns = document.querySelectorAll('.heart-btn');

    // ページ読み込み時に状態復元 (今回は簡易的にインデックスで管理)
    heartBtns.forEach((btn, index) => {
        const isLiked = localStorage.getItem(`liked_news_${index}`);
        if (isLiked === 'true') {
            btn.classList.add('active');
            btn.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="#E91E63" stroke="#E91E63" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>`;
        }

        btn.addEventListener('click', () => {
            btn.classList.toggle('active');
            const isActive = btn.classList.contains('active');
            
            // アイコン切り替え
            if(isActive){
                btn.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="#E91E63" stroke="#E91E63" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>`;
            } else {
                btn.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>`;
            }

            // 保存
            localStorage.setItem(`liked_news_${index}`, isActive);
        });
    });

    /* --- 5. ハンバーガーメニュー --- */
    const menuToggle = document.getElementById('menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');

    menuToggle.addEventListener('click', () => {
        mobileMenu.classList.toggle('open');
    });

    /* --- 6. スクロールでふわっと表示 --- */
    const revealCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                // 一度表示されたら監視を終了する場合（1回きりの演出）
                observer.unobserve(entry.target);
            }
        });
    };

    const revealObserver = new IntersectionObserver(revealCallback, {
        threshold: 0.25 // 10%見えたら実行
    });

    const revealElements = document.querySelectorAll('.reveal');
    revealElements.forEach(el => revealObserver.observe(el));
});