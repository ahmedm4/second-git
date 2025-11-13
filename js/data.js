// ==========================================
// منابر الهدى - جلب البيانات من API
// ==========================================

// رابط ملف JSON
const SOUNDS_JSON_URL = 'https://daniapp.org/alexa/sounds2.json';

// CORS Proxy - لحل مشكلة CORS عند التطوير المحلي
// إذا كنت تستخدم localhost، استخدم CORS_PROXY
// إذا كان التطبيق منشور على نفس النطاق، اجعلها فارغة
const CORS_PROXY = 'https://api.allorigins.win/raw?url=';
// بدائل أخرى:
// const CORS_PROXY = 'https://corsproxy.io/?';
// const CORS_PROXY = '';  // لا تستخدم proxy

// متغيرات عامة للبيانات
let rawData = null;
let duasData = [];
let latmiyatData = [];
let allContent = [];

// صور افتراضية للأغلفة
const defaultImages = {
    duas: "https://daniapp.org/sawt_alhuda3.png",
    latmiyat: "https://daniapp.org/sawt_alhuda3.png"
};

// دالة جلب البيانات من الـ API
async function fetchSoundsData() {
    try {
        console.log('🔄 جاري جلب البيانات من API...');

        // استخدام CORS Proxy إذا كان محدداً
        const url = CORS_PROXY ? CORS_PROXY + encodeURIComponent(SOUNDS_JSON_URL) : SOUNDS_JSON_URL;
        console.log('📡 الرابط:', url);

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        rawData = await response.json();
        console.log('✅ تم جلب البيانات بنجاح!', rawData);

        // معالجة البيانات
        processData();

        return true;
    } catch (error) {
        console.error('❌ خطأ في جلب البيانات:', error);
        console.log('💡 تلميح: إذا كنت تستخدم localhost، تأكد من تفعيل CORS_PROXY في js/data.js');

        // استخدام بيانات تجريبية في حالة الفشل
        useFallbackData();

        return false;
    }
}

// دالة معالجة البيانات وتحويلها للصيغة المطلوبة
function processData() {
    if (!rawData) {
        console.error('❌ لا توجد بيانات للمعالجة');
        return;
    }

    duasData = [];
    latmiyatData = [];

    let duaId = 1;
    let latmiyaId = 101;

    // معالجة كل قسم
    Object.keys(rawData).forEach(categoryKey => {
        const category = rawData[categoryKey];

        // تحقق من أن القسم يحتوي على بيانات صحيحة
        if (!category || !category.sounds || !Array.isArray(category.sounds)) {
            console.warn(`⚠️ القسم ${categoryKey} لا يحتوي على بيانات صحيحة`);
            return;
        }

        // التعامل مع اللطميات بشكل مختلف
        if (categoryKey === 'latmiyat') {
            category.sounds.forEach(sound => {
                // كل صوت في اللطميات هو عنصر منفصل
                latmiyatData.push({
                    id: latmiyaId++,
                    title: sound.title || 'لطمية',
                    titleSynonyms: sound.titleSynonyms || [],
                    category: 'latmiyat',
                    categoryKey: categoryKey,
                    description: category.name || 'لطمية حسينية',
                    image: sound.image || defaultImages.latmiyat,
                    readers: [
                        {
                            id: latmiyaId * 100,
                            name: sound.reader || 'غير معروف',
                            readerSynonyms: sound.readerSynonyms || [],
                            duration: '0:00', // سيتم حسابها عند التشغيل
                            audioUrl: sound.url,
                            plays: 0
                        }
                    ]
                });
            });
        } else {
            // الأدعية والأذان والزيارات (كل قسم له عدة قراء)
            const readers = category.sounds.map((sound, index) => ({
                id: duaId * 100 + index + 1,
                name: sound.reader || 'غير معروف',
                readerSynonyms: sound.readerSynonyms || [],
                duration: '0:00', // سيتم حسابها عند التشغيل
                audioUrl: sound.url,
                plays: 0,
                image: sound.image || defaultImages.duas
            }));

            duasData.push({
                id: duaId++,
                title: category.name || categoryKey,
                synonyms: category.synonyms || [],
                category: 'duas',
                categoryKey: categoryKey,
                description: category.name || '',
                image: (category.sounds[0] && category.sounds[0].image) || defaultImages.duas,
                readers: readers
            });
        }
    });

    // دمج كل البيانات
    allContent = [...duasData, ...latmiyatData];

    console.log('✅ تمت معالجة البيانات:');
    console.log(`   📚 الأدعية: ${duasData.length}`);
    console.log(`   🎭 اللطميات: ${latmiyatData.length}`);
    console.log(`   📊 المجموع: ${allContent.length}`);
}

// بيانات احتياطية في حالة فشل جلب البيانات
function useFallbackData() {
    console.log('⚠️ استخدام البيانات الاحتياطية...');

    rawData = {
        "kumail": {
            "name": "دعاء كُميل",
            "synonyms": ["كميل", "دعاء كميل"],
            "sounds": [
                {
                    "url": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
                    "reader": "باسم الكربلائي",
                    "readerSynonyms": ["باسم", "الكربلائي"],
                    "image": "https://daniapp.org/sawt_alhuda3.png"
                },
                {
                    "url": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
                    "reader": "الشيخ باقر المقدسي",
                    "readerSynonyms": ["المقدسي", "باقر المقدسي"],
                    "image": "https://daniapp.org/sawt_alhuda3.png"
                }
            ]
        },
        "adhan": {
            "name": "الأذان",
            "synonyms": ["الأذان", "اذان", "أذان"],
            "sounds": [
                {
                    "url": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
                    "reader": "أباذر الحلواجي",
                    "readerSynonyms": ["الحلواجي", "اباذر"],
                    "image": "https://daniapp.org/sawt_alhuda3.png"
                }
            ]
        },
        "latmiyat": {
            "name": "اللطميات",
            "synonyms": ["لطمية", "لطميات"],
            "sounds": [
                {
                    "title": "رسول الله قد مات",
                    "titleSynonyms": ["رسول الله", "النبي"],
                    "url": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
                    "reader": "حسين الأكرف",
                    "readerSynonyms": ["الأكرف", "حسين الأكرف"],
                    "image": "https://daniapp.org/sawt_alhuda3.png"
                },
                {
                    "title": "عباس يعيوني",
                    "titleSynonyms": ["عباس", "يعيوني"],
                    "url": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
                    "reader": "باسم الكربلائي",
                    "readerSynonyms": ["باسم", "الكربلائي"],
                    "image": "https://daniapp.org/sawt_alhuda3.png"
                }
            ]
        }
    };

    processData();
}

// دالة للبحث في البيانات (تدعم المرادفات)
function searchInData(query) {
    if (!query || query.trim() === '') {
        return { duas: duasData, latmiyat: latmiyatData };
    }

    const searchTerm = query.toLowerCase().trim();

    // البحث في الأدعية
    const filteredDuas = duasData.filter(dua => {
        // البحث في العنوان
        if (dua.title.toLowerCase().includes(searchTerm)) return true;

        // البحث في المرادفات
        if (dua.synonyms && dua.synonyms.some(syn => syn.toLowerCase().includes(searchTerm))) return true;

        // البحث في الوصف
        if (dua.description && dua.description.toLowerCase().includes(searchTerm)) return true;

        // البحث في أسماء القراء
        if (dua.readers && dua.readers.some(reader => {
            if (reader.name.toLowerCase().includes(searchTerm)) return true;
            if (reader.readerSynonyms && reader.readerSynonyms.some(syn => syn.toLowerCase().includes(searchTerm))) return true;
            return false;
        })) return true;

        return false;
    });

    // البحث في اللطميات
    const filteredLatmiyat = latmiyatData.filter(latmiya => {
        // البحث في العنوان
        if (latmiya.title.toLowerCase().includes(searchTerm)) return true;

        // البحث في مرادفات العنوان
        if (latmiya.titleSynonyms && latmiya.titleSynonyms.some(syn => syn.toLowerCase().includes(searchTerm))) return true;

        // البحث في الوصف
        if (latmiya.description && latmiya.description.toLowerCase().includes(searchTerm)) return true;

        // البحث في أسماء الرواديد
        if (latmiya.readers && latmiya.readers.some(reader => {
            if (reader.name.toLowerCase().includes(searchTerm)) return true;
            if (reader.readerSynonyms && reader.readerSynonyms.some(syn => syn.toLowerCase().includes(searchTerm))) return true;
            return false;
        })) return true;

        return false;
    });

    return { duas: filteredDuas, latmiyat: filteredLatmiyat };
}

// تصدير البيانات والدوال
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        fetchSoundsData,
        duasData,
        latmiyatData,
        allContent,
        defaultImages,
        searchInData
    };
}
