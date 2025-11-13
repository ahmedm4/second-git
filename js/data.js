// ==========================================
// منابر الهدى - بيانات الأدعية واللطميات
// ==========================================

// بيانات الأدعية
const duasData = [
    {
        id: 1,
        title: "دعاء كميل",
        category: "duas",
        description: "دعاء مبارك من أدعية أمير المؤمنين علي بن أبي طالب عليه السلام",
        image: "https://images.unsplash.com/photo-1591604466107-ec97de577aff?w=800&q=80",
        readers: [
            {
                id: 1,
                name: "الشيخ باسم الكربلائي",
                duration: "25:30",
                audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
                plays: 15420
            },
            {
                id: 2,
                name: "الشيخ أحمد الوائلي",
                duration: "28:15",
                audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
                plays: 12350
            },
            {
                id: 3,
                name: "السيد محمد الصافي",
                duration: "23:45",
                audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
                plays: 9870
            }
        ]
    },
    {
        id: 2,
        title: "دعاء الفرج",
        category: "duas",
        description: "دعاء الفرج المبارك لتعجيل ظهور الإمام المهدي عليه السلام",
        image: "https://images.unsplash.com/photo-1542816417-0983c9c9ad53?w=800&q=80",
        readers: [
            {
                id: 4,
                name: "الشيخ حسين الأكرف",
                duration: "12:20",
                audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
                plays: 18500
            },
            {
                id: 5,
                name: "الشيخ كاظم الدوخي",
                duration: "11:45",
                audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
                plays: 14230
            }
        ]
    },
    {
        id: 3,
        title: "دعاء التوسل",
        category: "duas",
        description: "التوسل بأهل البيت عليهم السلام",
        image: "https://images.unsplash.com/photo-1584286592573-7c7ae15803c8?w=800&q=80",
        readers: [
            {
                id: 6,
                name: "الحاج أحمد الساعدي",
                duration: "15:30",
                audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3",
                plays: 22100
            },
            {
                id: 7,
                name: "الشيخ علي الحمادي",
                duration: "14:55",
                audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3",
                plays: 16780
            },
            {
                id: 8,
                name: "السيد عمار الحكيم",
                duration: "16:10",
                audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3",
                plays: 13450
            }
        ]
    },
    {
        id: 4,
        title: "دعاء الصباح",
        category: "duas",
        description: "دعاء الصباح المبارك من أدعية أمير المؤمنين عليه السلام",
        image: "https://images.unsplash.com/photo-1495616811223-4d98c6e9c869?w=800&q=80",
        readers: [
            {
                id: 9,
                name: "الشيخ جعفر الطالقاني",
                duration: "32:40",
                audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
                plays: 19870
            },
            {
                id: 10,
                name: "السيد مرتضى القزويني",
                duration: "35:15",
                audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
                plays: 11200
            }
        ]
    },
    {
        id: 5,
        title: "دعاء عرفة",
        category: "duas",
        description: "دعاء يوم عرفة للإمام الحسين عليه السلام",
        image: "https://images.unsplash.com/photo-1591604466107-ec97de577aff?w=800&q=80",
        readers: [
            {
                id: 11,
                name: "الشيخ باسم الكربلائي",
                duration: "42:30",
                audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
                plays: 25600
            },
            {
                id: 12,
                name: "الشيخ عبد المهدي الكربلائي",
                duration: "45:20",
                audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
                plays: 21300
            }
        ]
    },
    {
        id: 6,
        title: "زيارة عاشوراء",
        category: "duas",
        description: "زيارة الإمام الحسين عليه السلام في يوم عاشوراء",
        image: "https://images.unsplash.com/photo-1542816417-0983c9c9ad53?w=800&q=80",
        readers: [
            {
                id: 13,
                name: "الشيخ حسين الأكرف",
                duration: "38:15",
                audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
                plays: 28900
            },
            {
                id: 14,
                name: "السيد منير الخباز",
                duration: "40:30",
                audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3",
                plays: 19500
            }
        ]
    }
];

// بيانات اللطميات
const latmiyatData = [
    {
        id: 101,
        title: "يا حسين",
        category: "latmiyat",
        description: "لطمية حسينية مؤثرة",
        image: "https://images.unsplash.com/photo-1584286592573-7c7ae15803c8?w=800&q=80",
        readers: [
            {
                id: 101,
                name: "الرادود باسم الكربلائي",
                duration: "5:30",
                audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3",
                plays: 45200
            },
            {
                id: 102,
                name: "الرادود محمد الحجيرات",
                duration: "6:15",
                audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3",
                plays: 38900
            }
        ]
    },
    {
        id: 102,
        title: "يا زهراء",
        category: "latmiyat",
        description: "لطمية في رثاء الصديقة الزهراء عليها السلام",
        image: "https://images.unsplash.com/photo-1495616811223-4d98c6e9c869?w=800&q=80",
        readers: [
            {
                id: 103,
                name: "الرادود علي الدلفي",
                duration: "7:20",
                audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
                plays: 52300
            },
            {
                id: 104,
                name: "الرادود حسين الأكرف",
                duration: "6:45",
                audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
                plays: 41700
            }
        ]
    },
    {
        id: 103,
        title: "أمير المؤمنين",
        category: "latmiyat",
        description: "لطمية في ذكرى استشهاد الإمام علي عليه السلام",
        image: "https://images.unsplash.com/photo-1591604466107-ec97de577aff?w=800&q=80",
        readers: [
            {
                id: 105,
                name: "الرادود كاظم الساهر",
                duration: "8:10",
                audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
                plays: 36500
            }
        ]
    },
    {
        id: 104,
        title: "الطف الطف",
        category: "latmiyat",
        description: "لطمية عن واقعة الطف",
        image: "https://images.unsplash.com/photo-1542816417-0983c9c9ad53?w=800&q=80",
        readers: [
            {
                id: 106,
                name: "الرادود مهدي الخفاجي",
                duration: "9:30",
                audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
                plays: 48700
            },
            {
                id: 107,
                name: "الرادود نزار القطري",
                duration: "8:55",
                audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
                plays: 42100
            }
        ]
    },
    {
        id: 105,
        title: "يا مهدي",
        category: "latmiyat",
        description: "لطمية في انتظار الإمام المهدي عليه السلام",
        image: "https://images.unsplash.com/photo-1584286592573-7c7ae15803c8?w=800&q=80",
        readers: [
            {
                id: 108,
                name: "الرادود باسم الكربلائي",
                duration: "6:40",
                audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3",
                plays: 55800
            },
            {
                id: 109,
                name: "الرادود صباح النجار",
                duration: "7:15",
                audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3",
                plays: 39200
            }
        ]
    },
    {
        id: 106,
        title: "العباس",
        category: "latmiyat",
        description: "لطمية في ذكرى أبي الفضل العباس عليه السلام",
        image: "https://images.unsplash.com/photo-1495616811223-4d98c6e9c869?w=800&q=80",
        readers: [
            {
                id: 110,
                name: "الرادود علي الدلفي",
                duration: "7:50",
                audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3",
                plays: 44900
            }
        ]
    },
    {
        id: 107,
        title: "الحوراء زينب",
        category: "latmiyat",
        description: "لطمية في مدح السيدة زينب عليها السلام",
        image: "https://images.unsplash.com/photo-1591604466107-ec97de577aff?w=800&q=80",
        readers: [
            {
                id: 111,
                name: "الرادود محمد الحجيرات",
                duration: "6:30",
                audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
                plays: 37800
            },
            {
                id: 112,
                name: "الرادود حسين الأكرف",
                duration: "7:05",
                audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
                plays: 33400
            }
        ]
    },
    {
        id: 108,
        title: "يا علي يا حسين",
        category: "latmiyat",
        description: "لطمية جماعية مؤثرة",
        image: "https://images.unsplash.com/photo-1542816417-0983c9c9ad53?w=800&q=80",
        readers: [
            {
                id: 113,
                name: "الرادود مهدي الخفاجي",
                duration: "8:20",
                audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
                plays: 51200
            }
        ]
    }
];

// دمج كل البيانات
const allContent = [...duasData, ...latmiyatData];

// صور افتراضية للأغلفة
const defaultImages = {
    duas: [
        "https://images.unsplash.com/photo-1591604466107-ec97de577aff?w=800&q=80",
        "https://images.unsplash.com/photo-1542816417-0983c9c9ad53?w=800&q=80",
        "https://images.unsplash.com/photo-1584286592573-7c7ae15803c8?w=800&q=80",
        "https://images.unsplash.com/photo-1495616811223-4d98c6e9c869?w=800&q=80"
    ],
    latmiyat: [
        "https://images.unsplash.com/photo-1584286592573-7c7ae15803c8?w=800&q=80",
        "https://images.unsplash.com/photo-1495616811223-4d98c6e9c869?w=800&q=80",
        "https://images.unsplash.com/photo-1591604466107-ec97de577aff?w=800&q=80",
        "https://images.unsplash.com/photo-1542816417-0983c9c9ad53?w=800&q=80"
    ]
};

// تصدير البيانات
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        duasData,
        latmiyatData,
        allContent,
        defaultImages
    };
}
