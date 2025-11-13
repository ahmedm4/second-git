// ==========================================
// منابر الهدى - التطبيق الرئيسي
// ==========================================

// ==========================================
// 1. STATE MANAGEMENT
// ==========================================

const AppState = {
    currentTab: 'duas',
    currentAudio: null,
    currentReader: null,
    isPlaying: false,
    favorites: [],
    playHistory: [],
    statistics: {
        totalPlays: 0,
        totalListeningTime: 0
    },
    isDarkMode: false,
    isRepeat: false,
    volume: 100,
    playlist: [],
    currentPlaylistIndex: 0
};

// Chart instances
let topDuasChartInstance = null;
let topReadersChartInstance = null;

// Load state from localStorage
function loadState() {
    const savedState = localStorage.getItem('manaberAlhuda_state');
    if (savedState) {
        const parsed = JSON.parse(savedState);
        AppState.favorites = parsed.favorites || [];
        AppState.playHistory = parsed.playHistory || [];
        AppState.statistics = parsed.statistics || { totalPlays: 0, totalListeningTime: 0 };
        AppState.isDarkMode = parsed.isDarkMode || false;
        AppState.isRepeat = parsed.isRepeat || false;
        AppState.volume = parsed.volume !== undefined ? parsed.volume : 100;
    }
}

// Save state to localStorage
function saveState() {
    const stateToSave = {
        favorites: AppState.favorites,
        playHistory: AppState.playHistory,
        statistics: AppState.statistics,
        isDarkMode: AppState.isDarkMode,
        isRepeat: AppState.isRepeat,
        volume: AppState.volume
    };
    localStorage.setItem('manaberAlhuda_state', JSON.stringify(stateToSave));
}

// ==========================================
// 2. DOM ELEMENTS
// ==========================================

const DOM = {
    // Tabs
    tabs: document.querySelectorAll('.tab-card'),
    tabContents: document.querySelectorAll('.tab-content'),

    // Grids
    duasGrid: document.getElementById('duasGrid'),
    latmiyatGrid: document.getElementById('latmiyatGrid'),
    favoritesGrid: document.getElementById('favoritesGrid'),

    // Empty states
    duasEmpty: document.getElementById('duasEmpty'),
    latmiyatEmpty: document.getElementById('latmiyatEmpty'),
    favoritesEmpty: document.getElementById('favoritesEmpty'),

    // Audio Player
    audioPlayer: document.getElementById('audioPlayer'),
    audioElement: document.getElementById('audioElement'),
    playPauseBtn: document.getElementById('playPauseBtn'),
    prevBtn: document.getElementById('prevBtn'),
    nextBtn: document.getElementById('nextBtn'),
    playerTitle: document.getElementById('playerTitle'),
    playerArtist: document.getElementById('playerArtist'),
    playerImage: document.getElementById('playerImage'),
    currentTime: document.getElementById('currentTime'),
    duration: document.getElementById('duration'),
    progressBar: document.getElementById('progressBar'),
    progressFill: document.getElementById('progressFill'),
    volumeSlider: document.getElementById('volumeSlider'),
    volumeBtn: document.getElementById('volumeBtn'),
    repeatBtn: document.getElementById('repeatBtn'),
    playerFavoriteBtn: document.getElementById('playerFavoriteBtn'),
    closePlayerBtn: document.getElementById('closePlayerBtn'),

    // Header
    darkModeToggle: document.getElementById('darkModeToggle'),
    searchInput: document.getElementById('searchInput'),
    clearSearch: document.getElementById('clearSearch'),

    // Statistics
    totalPlays: document.getElementById('totalPlays'),
    totalFavorites: document.getElementById('totalFavorites'),
    totalHours: document.getElementById('totalHours'),
    totalContent: document.getElementById('totalContent'),
    statsTableBody: document.getElementById('statsTableBody'),
    statsSearch: document.getElementById('statsSearch'),

    // Favorites count badge
    favoritesCount: document.getElementById('favoritesCount'),

    // Notification container
    notificationContainer: document.getElementById('notificationContainer'),

    // Loading overlay
    loadingOverlay: document.getElementById('loadingOverlay')
};

// ==========================================
// 3. INITIALIZATION
// ==========================================

document.addEventListener('DOMContentLoaded', async () => {
    loadState();
    setupEventListeners();
    applyDarkMode();

    // جلب البيانات أولاً
    await initializeApp();
});

async function initializeApp() {
    console.log('🌙 منابر الهدى - بدء التطبيق...');

    // Show loading overlay
    if (DOM.loadingOverlay) {
        DOM.loadingOverlay.classList.add('active');
    }

    // جلب البيانات من API
    const dataLoaded = await fetchSoundsData();

    if (dataLoaded) {
        console.log('✅ تم جلب البيانات بنجاح');
    } else {
        console.warn('⚠️ تم استخدام البيانات الاحتياطية');
    }

    // Set initial volume
    if (DOM.audioElement && DOM.volumeSlider) {
        DOM.audioElement.volume = AppState.volume / 100;
        DOM.volumeSlider.value = AppState.volume;
    }

    // Update repeat button state
    if (AppState.isRepeat && DOM.repeatBtn) {
        DOM.repeatBtn.classList.add('active');
    }

    // تحديث مدة الأصوات عند تحميل الميتاداتا
    setupAudioDurationTracking();

    // عرض المحتوى
    renderContent();
    updateFavoritesCount();
    updateStatistics();

    // Hide loading overlay
    setTimeout(() => {
        if (DOM.loadingOverlay) {
            DOM.loadingOverlay.classList.remove('active');
        }
    }, 500);

    console.log('🌙 منابر الهدى - التطبيق جاهز!');
}

// دالة لتتبع وتحديث مدة الأصوات
function setupAudioDurationTracking() {
    if (!DOM.audioElement) return;

    DOM.audioElement.addEventListener('loadedmetadata', () => {
        // تحديث مدة الصوت الحالي
        if (AppState.currentAudio && AppState.currentAudio.reader) {
            const duration = DOM.audioElement.duration;
            AppState.currentAudio.reader.duration = formatTime(duration);

            // حفظ في البيانات الأصلية
            const category = AppState.currentAudio.category === 'duas' ? duasData : latmiyatData;
            const content = category.find(item => item.id === AppState.currentAudio.content.id);

            if (content) {
                const reader = content.readers.find(r => r.id === AppState.currentAudio.reader.id);
                if (reader) {
                    reader.duration = formatTime(duration);
                }
            }
        }
    });
}

// ==========================================
// 4. EVENT LISTENERS
// ==========================================

function setupEventListeners() {
    // Tab switching
    DOM.tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const tabName = tab.dataset.tab;
            switchTab(tabName);
        });
    });

    // Dark mode toggle
    if (DOM.darkModeToggle) {
        DOM.darkModeToggle.addEventListener('click', toggleDarkMode);
    }

    // Search
    if (DOM.searchInput) {
        DOM.searchInput.addEventListener('input', handleSearch);
    }

    if (DOM.clearSearch) {
        DOM.clearSearch.addEventListener('click', clearSearch);
    }

    // Audio Player Controls
    if (DOM.playPauseBtn) {
        DOM.playPauseBtn.addEventListener('click', togglePlayPause);
    }

    if (DOM.prevBtn) {
        DOM.prevBtn.addEventListener('click', playPrevious);
    }

    if (DOM.nextBtn) {
        DOM.nextBtn.addEventListener('click', playNext);
    }

    if (DOM.closePlayerBtn) {
        DOM.closePlayerBtn.addEventListener('click', closePlayer);
    }

    if (DOM.repeatBtn) {
        DOM.repeatBtn.addEventListener('click', toggleRepeat);
    }

    if (DOM.playerFavoriteBtn) {
        DOM.playerFavoriteBtn.addEventListener('click', toggleCurrentFavorite);
    }

    // Volume control
    if (DOM.volumeSlider) {
        DOM.volumeSlider.addEventListener('input', handleVolumeChange);
    }

    if (DOM.volumeBtn) {
        DOM.volumeBtn.addEventListener('click', toggleMute);
    }

    // Progress bar
    if (DOM.progressBar) {
        DOM.progressBar.addEventListener('input', handleProgressChange);
        console.log('✅ Progress bar event listener attached');
    } else {
        console.error('❌ Progress bar element not found!');
    }

    // Audio element events
    if (DOM.audioElement) {
        DOM.audioElement.addEventListener('timeupdate', updateProgress);
        DOM.audioElement.addEventListener('loadedmetadata', updateDuration);
        DOM.audioElement.addEventListener('ended', handleAudioEnded);
        console.log('✅ Audio element event listeners attached');
        DOM.audioElement.addEventListener('play', () => {
            AppState.isPlaying = true;
            DOM.audioPlayer.classList.add('playing');
        });
        DOM.audioElement.addEventListener('pause', () => {
            AppState.isPlaying = false;
            DOM.audioPlayer.classList.remove('playing');
        });
        DOM.audioElement.addEventListener('error', (e) => {
            console.error('❌ خطأ في تحميل الصوت:', e);
            showNotification('error', 'خطأ', 'تعذر تحميل الملف الصوتي. يرجى المحاولة مرة أخرى.');

            // محاولة تشغيل الصوت التالي
            setTimeout(() => {
                playNext();
            }, 2000);
        });
        DOM.audioElement.addEventListener('stalled', () => {
            console.warn('⚠️ تباطؤ في تحميل الصوت');
            showNotification('warning', 'تحميل بطيء', 'يتم تحميل الصوت... يرجى الانتظار.');
        });
    }

    // Statistics search
    if (DOM.statsSearch) {
        DOM.statsSearch.addEventListener('input', handleStatsSearch);
    }

    // Keyboard shortcuts
    document.addEventListener('keydown', handleKeyboardShortcuts);
}

// ==========================================
// 5. TAB SWITCHING
// ==========================================

function switchTab(tabName) {
    AppState.currentTab = tabName;

    // Update tab buttons
    DOM.tabs.forEach(tab => {
        if (tab.dataset.tab === tabName) {
            tab.classList.add('active');
            tab.setAttribute('aria-selected', 'true');
        } else {
            tab.classList.remove('active');
            tab.setAttribute('aria-selected', 'false');
        }
    });

    // Update tab contents
    DOM.tabContents.forEach(content => {
        if (content.id === `${tabName}-content`) {
            content.classList.add('active');
            content.style.display = 'block';
        } else {
            content.classList.remove('active');
            content.style.display = 'none';
        }
    });

    // Render content for the active tab
    if (tabName === 'statistics') {
        updateStatistics();
        renderStatisticsCharts();
    } else if (tabName === 'favorites') {
        renderFavorites();
    }
}

// ==========================================
// 6. CONTENT RENDERING
// ==========================================

function renderContent() {
    renderDuas();
    renderLatmiyat();
}

function renderDuas() {
    if (!DOM.duasGrid) return;

    DOM.duasGrid.innerHTML = '';

    duasData.forEach((dua, index) => {
        const card = createDuaCard(dua, index);
        DOM.duasGrid.appendChild(card);
    });
}

function renderLatmiyat() {
    if (!DOM.latmiyatGrid) return;

    DOM.latmiyatGrid.innerHTML = '';

    latmiyatData.forEach((latmiya, index) => {
        const card = createLatmiyaCard(latmiya, index);
        DOM.latmiyatGrid.appendChild(card);
    });
}

function createDuaCard(dua, index) {
    const card = document.createElement('div');
    card.className = 'dua-card';
    card.style.animationDelay = `${index * 0.1}s`;

    const isFavorite = AppState.favorites.some(fav => fav.id === dua.id);

    card.innerHTML = `
        <div class="card-image-wrapper">
            <img src="${dua.image}" alt="${dua.title}" class="card-image" loading="lazy">
            <div class="card-image-overlay">
                <h3 class="card-title">${dua.title}</h3>
                <span class="card-readers-count">
                    <i class="fas fa-user-tie"></i>
                    ${dua.readers.length} قارئ
                </span>
            </div>
        </div>
        <button class="card-favorite ${isFavorite ? 'active' : ''}" data-id="${dua.id}" data-category="duas">
            <i class="${isFavorite ? 'fas' : 'far'} fa-heart"></i>
        </button>
        <div class="card-body">
            <div class="card-body-header">
                <button class="card-expand-btn" data-id="${dua.id}">
                    <i class="fas fa-chevron-down"></i>
                    عرض القراء
                </button>
            </div>
            <div class="readers-dropdown" id="readers-${dua.id}">
                ${dua.readers.map(reader => `
                    <div class="reader-item" data-dua-id="${dua.id}" data-reader-id="${reader.id}">
                        <button class="reader-play-btn" data-dua-id="${dua.id}" data-reader-id="${reader.id}">
                            <i class="fas fa-play"></i>
                        </button>
                        <div class="reader-info">
                            <h4 class="reader-name">${reader.name}</h4>
                            <div class="reader-meta">
                                <span>
                                    <i class="fas fa-clock"></i>
                                    ${reader.duration}
                                </span>
                                <span>
                                    <i class="fas fa-headphones"></i>
                                    ${formatNumber(reader.plays)} استماع
                                </span>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;

    // Add event listeners
    const favoriteBtn = card.querySelector('.card-favorite');
    favoriteBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleFavorite(dua.id, 'duas');
    });

    const expandBtn = card.querySelector('.card-expand-btn');
    expandBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleReadersDropdown(dua.id);
    });

    const playBtns = card.querySelectorAll('.reader-play-btn');
    playBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const duaId = parseInt(btn.dataset.duaId);
            const readerId = parseInt(btn.dataset.readerId);
            playAudio(duaId, readerId, 'duas');
        });
    });

    return card;
}

function createLatmiyaCard(latmiya, index) {
    const card = document.createElement('div');
    card.className = 'latmiya-card';
    card.style.animationDelay = `${index * 0.1}s`;

    const isFavorite = AppState.favorites.some(fav => fav.id === latmiya.id);

    card.innerHTML = `
        <div class="card-image-wrapper">
            <img src="${latmiya.image}" alt="${latmiya.title}" class="card-image" loading="lazy">
            <div class="card-image-overlay">
                <h3 class="card-title">${latmiya.title}</h3>
                <span class="card-readers-count">
                    <i class="fas fa-user-tie"></i>
                    ${latmiya.readers.length} رادود
                </span>
            </div>
        </div>
        <button class="card-favorite ${isFavorite ? 'active' : ''}" data-id="${latmiya.id}" data-category="latmiyat">
            <i class="${isFavorite ? 'fas' : 'far'} fa-heart"></i>
        </button>
        <span class="latmiya-badge">🎭 لطمية</span>
        <div class="card-body">
            <div class="card-body-header">
                <button class="card-expand-btn" data-id="${latmiya.id}">
                    <i class="fas fa-chevron-down"></i>
                    عرض الرواديد
                </button>
            </div>
            <div class="readers-dropdown" id="readers-${latmiya.id}">
                ${latmiya.readers.map(reader => `
                    <div class="reader-item" data-latmiya-id="${latmiya.id}" data-reader-id="${reader.id}">
                        <button class="reader-play-btn" data-latmiya-id="${latmiya.id}" data-reader-id="${reader.id}">
                            <i class="fas fa-play"></i>
                        </button>
                        <div class="reader-info">
                            <h4 class="reader-name">${reader.name}</h4>
                            <div class="reader-meta">
                                <span>
                                    <i class="fas fa-clock"></i>
                                    ${reader.duration}
                                </span>
                                <span>
                                    <i class="fas fa-headphones"></i>
                                    ${formatNumber(reader.plays)} استماع
                                </span>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;

    // Add event listeners
    const favoriteBtn = card.querySelector('.card-favorite');
    favoriteBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleFavorite(latmiya.id, 'latmiyat');
    });

    const expandBtn = card.querySelector('.card-expand-btn');
    expandBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleReadersDropdown(latmiya.id);
    });

    const playBtns = card.querySelectorAll('.reader-play-btn');
    playBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const latmiyaId = parseInt(btn.dataset.latmiyaId);
            const readerId = parseInt(btn.dataset.readerId);
            playAudio(latmiyaId, readerId, 'latmiyat');
        });
    });

    return card;
}

// ==========================================
// 7. AUDIO PLAYER FUNCTIONALITY
// ==========================================

function playAudio(contentId, readerId, category) {
    const data = category === 'duas' ? duasData : latmiyatData;
    const content = data.find(item => item.id === contentId);

    if (!content) return;

    const reader = content.readers.find(r => r.id === readerId);

    if (!reader) return;

    // Create playlist from current content's readers
    AppState.playlist = content.readers;
    AppState.currentPlaylistIndex = content.readers.findIndex(r => r.id === readerId);

    // Set current audio info
    AppState.currentAudio = {
        content: content,
        reader: reader,
        category: category
    };

    // Update UI
    DOM.playerTitle.textContent = content.title;
    DOM.playerArtist.textContent = reader.name;
    DOM.playerImage.src = content.image;

    // Reset progress bar
    DOM.progressBar.value = 0;
    DOM.progressFill.style.width = '0%';
    DOM.currentTime.textContent = '0:00';
    DOM.duration.textContent = '0:00';

    // Load and play audio
    DOM.audioElement.src = reader.audioUrl;
    DOM.audioElement.play();

    // Show player
    DOM.audioPlayer.classList.add('active');
    DOM.audioPlayer.style.display = 'block';

    console.log('🎵 Audio loaded:', reader.audioUrl);

    // Update favorite button
    updatePlayerFavoriteButton();

    // Update statistics
    AppState.statistics.totalPlays++;
    reader.plays++;

    // Add to play history
    addToPlayHistory(content, reader, category);

    // Save state
    saveState();

    // Show notification
    showNotification('success', 'جاري التشغيل', `${content.title} - ${reader.name}`);
}

function togglePlayPause() {
    if (!DOM.audioElement.src) return;

    if (AppState.isPlaying) {
        DOM.audioElement.pause();
    } else {
        DOM.audioElement.play();
    }
}

function playPrevious() {
    if (AppState.playlist.length === 0) return;

    AppState.currentPlaylistIndex--;

    if (AppState.currentPlaylistIndex < 0) {
        AppState.currentPlaylistIndex = AppState.playlist.length - 1;
    }

    const reader = AppState.playlist[AppState.currentPlaylistIndex];
    playAudio(AppState.currentAudio.content.id, reader.id, AppState.currentAudio.category);
}

function playNext() {
    if (AppState.playlist.length === 0) return;

    AppState.currentPlaylistIndex++;

    if (AppState.currentPlaylistIndex >= AppState.playlist.length) {
        AppState.currentPlaylistIndex = 0;
    }

    const reader = AppState.playlist[AppState.currentPlaylistIndex];
    playAudio(AppState.currentAudio.content.id, reader.id, AppState.currentAudio.category);
}

function handleAudioEnded() {
    if (AppState.isRepeat) {
        DOM.audioElement.currentTime = 0;
        DOM.audioElement.play();
    } else {
        playNext();
    }
}

function closePlayer() {
    DOM.audioElement.pause();
    DOM.audioElement.src = '';
    DOM.audioPlayer.classList.remove('active');
    setTimeout(() => {
        DOM.audioPlayer.style.display = 'none';
    }, 300);
}

function updateProgress() {
    if (!DOM.audioElement.duration) {
        console.log('⚠️ No duration yet');
        return;
    }

    const percent = (DOM.audioElement.currentTime / DOM.audioElement.duration) * 100;
    DOM.progressBar.value = percent;
    DOM.progressFill.style.width = `${percent}%`;

    DOM.currentTime.textContent = formatTime(DOM.audioElement.currentTime);

    // Update listening time
    AppState.statistics.totalListeningTime = (AppState.statistics.totalListeningTime || 0) + 1;

    // Debug log every 5 seconds
    if (Math.floor(DOM.audioElement.currentTime) % 5 === 0 && Math.floor(DOM.audioElement.currentTime) !== 0) {
        console.log(`📊 Progress: ${percent.toFixed(1)}% - ${formatTime(DOM.audioElement.currentTime)} / ${formatTime(DOM.audioElement.duration)}`);
    }
}

function updateDuration() {
    DOM.duration.textContent = formatTime(DOM.audioElement.duration);
    console.log('⏱️ Duration loaded:', formatTime(DOM.audioElement.duration));
}

function handleProgressChange(e) {
    if (!DOM.audioElement.duration) return;

    const time = (e.target.value / 100) * DOM.audioElement.duration;
    DOM.audioElement.currentTime = time;
    console.log('🎚️ Progress changed to:', formatTime(time));
}

function handleVolumeChange(e) {
    const volume = e.target.value;
    DOM.audioElement.volume = volume / 100;
    AppState.volume = parseInt(volume);

    // Update volume icon
    updateVolumeIcon(volume);

    saveState();
}

function updateVolumeIcon(volume) {
    const icon = DOM.volumeBtn.querySelector('i');

    if (volume == 0) {
        icon.className = 'fas fa-volume-mute';
    } else if (volume < 50) {
        icon.className = 'fas fa-volume-down';
    } else {
        icon.className = 'fas fa-volume-up';
    }
}

function toggleMute() {
    if (DOM.audioElement.volume > 0) {
        AppState.previousVolume = AppState.volume;
        DOM.audioElement.volume = 0;
        DOM.volumeSlider.value = 0;
        updateVolumeIcon(0);
    } else {
        const volume = AppState.previousVolume || 100;
        DOM.audioElement.volume = volume / 100;
        DOM.volumeSlider.value = volume;
        AppState.volume = volume;
        updateVolumeIcon(volume);
    }
}

function toggleRepeat() {
    AppState.isRepeat = !AppState.isRepeat;

    if (AppState.isRepeat) {
        DOM.repeatBtn.classList.add('active');
        showNotification('info', 'التكرار', 'تم تفعيل التكرار');
    } else {
        DOM.repeatBtn.classList.remove('active');
        showNotification('info', 'التكرار', 'تم إيقاف التكرار');
    }

    saveState();
}

// ==========================================
// 8. FAVORITES FUNCTIONALITY
// ==========================================

function toggleFavorite(contentId, category) {
    const data = category === 'duas' ? duasData : latmiyatData;
    const content = data.find(item => item.id === contentId);

    if (!content) return;

    const existingIndex = AppState.favorites.findIndex(fav => fav.id === contentId);

    if (existingIndex >= 0) {
        // Remove from favorites
        AppState.favorites.splice(existingIndex, 1);
        showNotification('info', 'تمت الإزالة', `تم إزالة "${content.title}" من المفضلة`);
    } else {
        // Add to favorites
        AppState.favorites.push({
            id: content.id,
            category: category,
            addedAt: new Date().toISOString()
        });
        showNotification('success', 'تمت الإضافة', `تم إضافة "${content.title}" إلى المفضلة`);
    }

    // Update UI
    updateFavoriteButtons(contentId, category);
    updateFavoritesCount();

    // Re-render favorites if on favorites tab
    if (AppState.currentTab === 'favorites') {
        renderFavorites();
    }

    // Update player favorite button if current audio
    if (AppState.currentAudio && AppState.currentAudio.content.id === contentId) {
        updatePlayerFavoriteButton();
    }

    saveState();
}

function updateFavoriteButtons(contentId, category) {
    const isFavorite = AppState.favorites.some(fav => fav.id === contentId);
    const buttons = document.querySelectorAll(`[data-id="${contentId}"][data-category="${category}"]`);

    buttons.forEach(btn => {
        if (isFavorite) {
            btn.classList.add('active');
            btn.querySelector('i').className = 'fas fa-heart';
        } else {
            btn.classList.remove('active');
            btn.querySelector('i').className = 'far fa-heart';
        }
    });
}

function toggleCurrentFavorite() {
    if (!AppState.currentAudio) return;

    toggleFavorite(AppState.currentAudio.content.id, AppState.currentAudio.category);
}

function updatePlayerFavoriteButton() {
    if (!AppState.currentAudio) return;

    const isFavorite = AppState.favorites.some(
        fav => fav.id === AppState.currentAudio.content.id
    );

    if (isFavorite) {
        DOM.playerFavoriteBtn.classList.add('active');
        DOM.playerFavoriteBtn.querySelector('i').className = 'fas fa-heart';
    } else {
        DOM.playerFavoriteBtn.classList.remove('active');
        DOM.playerFavoriteBtn.querySelector('i').className = 'far fa-heart';
    }
}

function updateFavoritesCount() {
    if (DOM.favoritesCount) {
        DOM.favoritesCount.textContent = AppState.favorites.length;
    }
}

function renderFavorites() {
    if (!DOM.favoritesGrid || !DOM.favoritesEmpty) return;

    DOM.favoritesGrid.innerHTML = '';

    if (AppState.favorites.length === 0) {
        DOM.favoritesEmpty.style.display = 'block';
        DOM.favoritesGrid.style.display = 'none';
        return;
    }

    DOM.favoritesEmpty.style.display = 'none';
    DOM.favoritesGrid.style.display = 'grid';

    AppState.favorites.forEach((fav, index) => {
        const data = fav.category === 'duas' ? duasData : latmiyatData;
        const content = data.find(item => item.id === fav.id);

        if (!content) return;

        const card = fav.category === 'duas'
            ? createDuaCard(content, index)
            : createLatmiyaCard(content, index);

        DOM.favoritesGrid.appendChild(card);
    });
}

// ==========================================
// 9. SEARCH FUNCTIONALITY
// ==========================================

function handleSearch(e) {
    const query = e.target.value.trim();

    if (!query) {
        renderContent();
        hideEmptyStates();
        return;
    }

    // استخدام دالة البحث المتقدمة التي تدعم المرادفات
    const results = searchInData(query);

    // Render filtered results
    renderFilteredDuas(results.duas);
    renderFilteredLatmiyat(results.latmiyat);

    // عرض رسالة إذا لم تكن هناك نتائج في كلا القسمين
    if (results.duas.length === 0 && results.latmiyat.length === 0) {
        showNotification('info', 'البحث', `لم يتم العثور على نتائج لـ "${query}"`);
    }
}

function renderFilteredDuas(filteredDuas) {
    if (!DOM.duasGrid || !DOM.duasEmpty) return;

    DOM.duasGrid.innerHTML = '';

    if (filteredDuas.length === 0) {
        DOM.duasEmpty.style.display = 'block';
        return;
    }

    DOM.duasEmpty.style.display = 'none';

    filteredDuas.forEach((dua, index) => {
        const card = createDuaCard(dua, index);
        DOM.duasGrid.appendChild(card);
    });
}

function renderFilteredLatmiyat(filteredLatmiyat) {
    if (!DOM.latmiyatGrid || !DOM.latmiyatEmpty) return;

    DOM.latmiyatGrid.innerHTML = '';

    if (filteredLatmiyat.length === 0) {
        DOM.latmiyatEmpty.style.display = 'block';
        return;
    }

    DOM.latmiyatEmpty.style.display = 'none';

    filteredLatmiyat.forEach((latmiya, index) => {
        const card = createLatmiyaCard(latmiya, index);
        DOM.latmiyatGrid.appendChild(card);
    });
}

function clearSearch() {
    DOM.searchInput.value = '';
    renderContent();
    hideEmptyStates();
}

function hideEmptyStates() {
    if (DOM.duasEmpty) DOM.duasEmpty.style.display = 'none';
    if (DOM.latmiyatEmpty) DOM.latmiyatEmpty.style.display = 'none';
}

// ==========================================
// 10. DARK MODE
// ==========================================

function toggleDarkMode() {
    AppState.isDarkMode = !AppState.isDarkMode;
    applyDarkMode();
    saveState();

    const message = AppState.isDarkMode ? 'تم تفعيل الوضع الليلي' : 'تم تفعيل الوضع النهاري';
    showNotification('info', 'الوضع', message);
}

function applyDarkMode() {
    if (AppState.isDarkMode) {
        document.body.classList.add('dark-mode');
    } else {
        document.body.classList.remove('dark-mode');
    }
}

// ==========================================
// 11. STATISTICS
// ==========================================

function updateStatistics() {
    // Update summary cards
    if (DOM.totalPlays) {
        DOM.totalPlays.textContent = formatNumber(AppState.statistics.totalPlays);
    }

    if (DOM.totalFavorites) {
        DOM.totalFavorites.textContent = formatNumber(AppState.favorites.length);
    }

    if (DOM.totalHours) {
        const hours = Math.floor((AppState.statistics.totalListeningTime || 0) / 3600);
        DOM.totalHours.textContent = formatNumber(hours);
    }

    if (DOM.totalContent) {
        DOM.totalContent.textContent = formatNumber(duasData.length + latmiyatData.length);
    }

    // Update table
    updateStatisticsTable();
}

function updateStatisticsTable() {
    if (!DOM.statsTableBody) return;

    DOM.statsTableBody.innerHTML = '';

    const allData = [...duasData, ...latmiyatData];

    // Flatten all readers with their content
    const allReaders = [];

    allData.forEach(content => {
        content.readers.forEach(reader => {
            allReaders.push({
                title: content.title,
                type: content.category === 'duas' ? 'دعاء' : 'لطمية',
                reader: reader.name,
                plays: reader.plays,
                lastPlayed: new Date().toLocaleDateString('ar-SA')
            });
        });
    });

    // Sort by plays
    allReaders.sort((a, b) => b.plays - a.plays);

    // Render top 20
    allReaders.slice(0, 20).forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.title}</td>
            <td><span class="badge ${item.type === 'دعاء' ? 'badge-primary' : 'badge-secondary'}">${item.type}</span></td>
            <td>${item.reader}</td>
            <td><strong>${formatNumber(item.plays)}</strong></td>
            <td>${item.lastPlayed}</td>
        `;
        DOM.statsTableBody.appendChild(row);
    });
}

function renderStatisticsCharts() {
    console.log('📊 Rendering statistics charts...');

    // Use setTimeout to ensure DOM is ready and prevent animation issues
    setTimeout(() => {
        renderTopDuasChart();
        renderTopReadersChart();
    }, 100);
}

function renderTopDuasChart() {
    const canvas = document.getElementById('topDuasChart');
    if (!canvas) {
        console.error('❌ topDuasChart canvas not found');
        return;
    }

    // Destroy existing chart instance to prevent infinite expansion
    if (topDuasChartInstance) {
        console.log('🔄 Destroying existing duas chart...');
        topDuasChartInstance.destroy();
        topDuasChartInstance = null;
    }

    // Get top 5 duas by total plays
    const duaStats = duasData.map(dua => {
        const totalPlays = dua.readers.reduce((sum, reader) => sum + reader.plays, 0);
        return {
            title: dua.title,
            plays: totalPlays
        };
    }).sort((a, b) => b.plays - a.plays).slice(0, 5);

    console.log('📈 Creating duas chart with data:', duaStats);

    topDuasChartInstance = new Chart(canvas, {
        type: 'bar',
        data: {
            labels: duaStats.map(d => d.title),
            datasets: [{
                label: 'عدد مرات الاستماع',
                data: duaStats.map(d => d.plays),
                backgroundColor: 'rgba(59, 130, 246, 0.6)',
                borderColor: 'rgba(59, 130, 246, 1)',
                borderWidth: 2,
                borderRadius: 8
            }]
        },
        options: {
            indexAxis: 'y',
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    rtl: true,
                    textDirection: 'rtl'
                }
            },
            scales: {
                x: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    }
                },
                y: {
                    grid: {
                        display: false
                    }
                }
            }
        }
    });
}

function renderTopReadersChart() {
    const canvas = document.getElementById('topReadersChart');
    if (!canvas) {
        console.error('❌ topReadersChart canvas not found');
        return;
    }

    // Destroy existing chart instance to prevent infinite expansion
    if (topReadersChartInstance) {
        console.log('🔄 Destroying existing readers chart...');
        topReadersChartInstance.destroy();
        topReadersChartInstance = null;
    }

    // Get all readers with their plays
    const readerStats = {};

    [...duasData, ...latmiyatData].forEach(content => {
        content.readers.forEach(reader => {
            if (!readerStats[reader.name]) {
                readerStats[reader.name] = 0;
            }
            readerStats[reader.name] += reader.plays;
        });
    });

    // Convert to array and sort
    const topReaders = Object.entries(readerStats)
        .map(([name, plays]) => ({ name, plays }))
        .sort((a, b) => b.plays - a.plays)
        .slice(0, 5);

    console.log('📈 Creating readers chart with data:', topReaders);

    topReadersChartInstance = new Chart(canvas, {
        type: 'bar',
        data: {
            labels: topReaders.map(r => r.name),
            datasets: [{
                label: 'عدد مرات الاستماع',
                data: topReaders.map(r => r.plays),
                backgroundColor: 'rgba(124, 58, 237, 0.6)',
                borderColor: 'rgba(124, 58, 237, 1)',
                borderWidth: 2,
                borderRadius: 8
            }]
        },
        options: {
            indexAxis: 'y',
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    rtl: true,
                    textDirection: 'rtl'
                }
            },
            scales: {
                x: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    }
                },
                y: {
                    grid: {
                        display: false
                    }
                }
            }
        }
    });
}

function handleStatsSearch(e) {
    const query = e.target.value.toLowerCase().trim();
    const rows = DOM.statsTableBody.querySelectorAll('tr');

    rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        if (text.includes(query)) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
}

// ==========================================
// 12. NOTIFICATIONS
// ==========================================

function showNotification(type, title, message) {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;

    const icons = {
        success: 'fa-check-circle',
        error: 'fa-times-circle',
        warning: 'fa-exclamation-triangle',
        info: 'fa-info-circle'
    };

    notification.innerHTML = `
        <div class="notification-icon">
            <i class="fas ${icons[type]}"></i>
        </div>
        <div class="notification-content">
            <h4 class="notification-title">${title}</h4>
            <p class="notification-message">${message}</p>
        </div>
    `;

    DOM.notificationContainer.appendChild(notification);

    // Auto remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease-out forwards';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// ==========================================
// 13. UTILITY FUNCTIONS
// ==========================================

function formatTime(seconds) {
    if (!seconds || isNaN(seconds)) return '0:00';

    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

function formatNumber(num) {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
}

function toggleReadersDropdown(id) {
    const dropdown = document.getElementById(`readers-${id}`);
    const btn = document.querySelector(`[data-id="${id}"].card-expand-btn`);

    if (!dropdown || !btn) return;

    if (dropdown.classList.contains('show')) {
        dropdown.classList.remove('show');
        btn.classList.remove('expanded');
    } else {
        dropdown.classList.add('show');
        btn.classList.add('expanded');
    }
}

function addToPlayHistory(content, reader, category) {
    AppState.playHistory.unshift({
        contentId: content.id,
        readerId: reader.id,
        category: category,
        playedAt: new Date().toISOString()
    });

    // Keep only last 100 items
    if (AppState.playHistory.length > 100) {
        AppState.playHistory = AppState.playHistory.slice(0, 100);
    }
}

function handleKeyboardShortcuts(e) {
    // Space: Play/Pause
    if (e.code === 'Space' && e.target.tagName !== 'INPUT') {
        e.preventDefault();
        togglePlayPause();
    }

    // Arrow Right: Previous
    if (e.code === 'ArrowRight' && e.ctrlKey) {
        e.preventDefault();
        playPrevious();
    }

    // Arrow Left: Next
    if (e.code === 'ArrowLeft' && e.ctrlKey) {
        e.preventDefault();
        playNext();
    }

    // Ctrl/Cmd + K: Focus search
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        DOM.searchInput.focus();
    }

    // Ctrl/Cmd + D: Toggle favorite
    if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
        e.preventDefault();
        toggleCurrentFavorite();
    }
}

// ==========================================
// 14. SCROLL EFFECTS
// ==========================================

let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    const header = document.getElementById('header');

    if (currentScroll > 100) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }

    lastScroll = currentScroll;
});

// ==========================================
// 15. EXPORT FUNCTIONS
// ==========================================

// Make switchTab available globally for onclick handlers
window.switchTab = switchTab;

console.log('🌙 منابر الهدى - جميع الأنظمة جاهزة!');
