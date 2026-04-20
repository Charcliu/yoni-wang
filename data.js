// ===== 数据定义模块 =====

const weatherData = [
    { date: '4月25日', weekday: '周六', icon: '☀️', desc: '晴间多云', high: 32, low: 25, humidity: '72%', wind: '东南风2级' },
    { date: '4月26日', weekday: '周日', icon: '⛅', desc: '多云', high: 31, low: 25, humidity: '76%', wind: '东风3级' },
    { date: '4月27日', weekday: '周一', icon: '⛅', desc: '多云', high: 30, low: 24, humidity: '78%', wind: '东北风2级' },
    { date: '4月28日', weekday: '周二', icon: '🌦️', desc: '多云转小雨', high: 29, low: 24, humidity: '85%', wind: '东风3级' },
    { date: '4月29日', weekday: '周三', icon: '🌦️', desc: '阵雨转多云', high: 28, low: 23, humidity: '88%', wind: '北风3级' },
    { date: '4月30日', weekday: '周四', icon: '⛅', desc: '多云', high: 30, low: 24, humidity: '80%', wind: '东南风2级' },
    { date: '5月1日', weekday: '周五', icon: '🌦️', desc: '多云转小雨', high: 30, low: 25, humidity: '92%', wind: '东北风3级' },
    { date: '5月2日', weekday: '周六', icon: '🌦️', desc: '多云转小雨', high: 29, low: 24, humidity: '90%', wind: '北风3级' },
    { date: '5月3日', weekday: '周日', icon: '⛅', desc: '多云', high: 30, low: 24, humidity: '85%', wind: '东南风2级' },
    { date: '5月4日', weekday: '周一', icon: '☀️', desc: '晴间多云', high: 31, low: 25, humidity: '78%', wind: '东南风2级' },
    { date: '5月5日', weekday: '周二', icon: '☀️', desc: '晴', high: 32, low: 25, humidity: '75%', wind: '南风2级' },
    { date: '5月6日', weekday: '周三', icon: '⛅', desc: '多云', high: 31, low: 25, humidity: '77%', wind: '东南风3级' },
];

// 路线节点 - 包含基于海南岛真实地理的viewBox坐标 (viewBox: 0 0 500 600)
// 海南岛实际经纬度大致范围：经度 108.6°-111.1°(东西2.5°), 纬度 18.1°-20.2°(南北2.1°)
// 以下坐标根据真实地理位置等比例映射到 SVG
const routeStops = [
    { name: '三亚', icon: '🏖️', day: 'D1', desc: '出发地 · 椰梦长廊 · 第一市场海鲜大排档，沉浸式感受热带都市风情。', color: '#f43f5e', x: 235, y: 490, lng: 109.51, lat: 18.25 },
    { name: '陵水', icon: '🏝️', day: 'D2', desc: '分界洲岛 · 清水湾，海南气候南北分界线，会唱歌的沙滩。', color: '#f97316', x: 320, y: 430, lng: 109.99, lat: 18.50 },
    { name: '万宁', icon: '🏄', day: 'D3', desc: '日月湾冲浪 · 石梅湾 · 南湾猴岛，中国冲浪之都，活力满满。', color: '#eab308', x: 365, y: 355, lng: 110.39, lat: 18.80 },
    { name: '琼海', icon: '🌊', day: 'D4', desc: '博鳌亚洲论坛永久会址 · 玉带滩 · 万泉河，东方达沃斯风情。', color: '#22c55e', x: 380, y: 280, lng: 110.47, lat: 19.26 },
    { name: '文昌', icon: '🚀', day: 'D5', desc: '文昌航天发射场 · 东郊椰林 · 铜鼓岭，航天圣地与椰乡魅力。', color: '#06b6d4', x: 390, y: 195, lng: 110.80, lat: 19.54 },
    { name: '海口', icon: '🏙️', day: 'D6-7', desc: '骑楼老街 · 火山口公园 · 海口湾云洞图书馆，省会深度游。', color: '#3b82f6', x: 310, y: 120, lng: 110.33, lat: 20.03 },
    { name: '儋州', icon: '📚', day: 'D8', desc: '千年古盐田 · 东坡书院 · 海花岛，千年盐田与人工岛奇观。', color: '#8b5cf6', x: 170, y: 170, lng: 109.58, lat: 19.52 },
    { name: '昌江', icon: '🏜️', day: 'D9', desc: '棋子湾 · 霸王岭，黑白鹅卵石奇观与长臂猿栖息地。', color: '#a855f7', x: 100, y: 270, lng: 108.87, lat: 19.30 },
    { name: '乐东', icon: '🌲', day: 'D10', desc: '莺歌海盐场 · 尖峰岭国家森林公园，热带雨林和星空秘境。', color: '#ec4899', x: 130, y: 390, lng: 109.17, lat: 18.74 },
    { name: '三亚', icon: '🌅', day: 'D11-12', desc: '大小洞天 · 南山 · 天涯海角 · 蜈支洲岛，经典回归完美收官。', color: '#f43f5e', x: 235, y: 490, lng: 109.51, lat: 18.25 },
];

const cinemaFrames = [
    {
        id: 'dawn', title: '晨光初照', subtitle: 'SCENE 01 · 破晓',
        desc: '清晨六点，三亚湾的第一缕阳光穿透薄雾，椰林在晨风中轻轻摇曳。你启动引擎，环岛之旅从这一刻开始。',
        meta: 'Day 1 · 三亚 → 陵水 · 120km',
        img: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=2400&q=90&auto=format&fit=crop',
        overlay: 'bg-gradient-to-r from-black/70 via-black/40 to-transparent', align: 'align-left', accent: '#fbbf24', mood: '温暖 · 期待'
    },
    {
        id: 'surf', title: '浪尖起舞', subtitle: 'SCENE 02 · 冲浪',
        desc: '万宁日月湾，中国冲浪之都。海浪一波接一波涌来，你踩上冲浪板，在蓝色的浪花中找到自由的感觉。',
        meta: 'Day 3 · 万宁日月湾 · 冲浪体验',
        img: 'https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=2400&q=90&auto=format&fit=crop',
        overlay: 'bg-gradient-to-l from-black/70 via-black/40 to-transparent', align: 'align-right', accent: '#38bdf8', mood: '自由 · 激情'
    },
    {
        id: 'coconut', title: '椰林深处', subtitle: 'SCENE 03 · 穿行',
        desc: '文昌东郊椰林，绵延数十公里的椰子树迎风挺立。海风拂过椰叶沙沙作响，金色夕阳为椰影镀上一层暖光，这是海南最经典的画面。',
        meta: 'Day 5 · 文昌 · 东郊椰林',
        img: 'https://zhiyan-ai-agent-with-1258344702.cos.ap-guangzhou.tencentcos.cn/with/125fbd42-6111-4661-8492-48e53a880d9e/image_1776677937_4_1.jpg',
        overlay: 'bg-gradient-to-r from-black/70 via-black/40 to-transparent', align: 'align-left', accent: '#fbbf24', mood: '宁静 · 惬意'
    },
    {
        id: 'market', title: '烟火人间', subtitle: 'SCENE 04 · 夜市',
        desc: '海口的夜晚属于美食。骑楼老街的灯火通明，老爸茶的香气弥漫街巷，清补凉、文昌鸡、海南粉……每一口都是海南的味道。',
        meta: 'Day 6 · 海口 · 骑楼老街夜市',
        img: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=2400&q=90&auto=format&fit=crop',
        overlay: 'bg-gradient-to-l from-black/80 via-black/50 to-black/30', align: 'align-right', accent: '#fb923c', mood: '热闹 · 烟火'
    },
    {
        id: 'rainforest', title: '雨林秘境', subtitle: 'SCENE 05 · 探索',
        desc: '尖峰岭的热带雨林，云雾缭绕如入仙境。古木参天，藤蔓缠绕，负氧离子含量全国之最。你深吸一口气，感受大自然最纯粹的馈赠。',
        meta: 'Day 10 · 乐东 · 尖峰岭国家森林公园',
        img: 'https://images.unsplash.com/photo-1516214104703-d870798883c5?w=2400&q=90&auto=format&fit=crop',
        overlay: 'bg-gradient-to-r from-black/70 via-black/40 to-transparent', align: 'align-left', accent: '#34d399', mood: '神秘 · 敬畏'
    },
    {
        id: 'sunset', title: '落日归途', subtitle: 'SCENE 06 · 尾声',
        desc: '最后一个傍晚，你停在棋子湾的礁石上。金色的夕阳缓缓沉入南海，1500公里的环岛之旅在这一刻画上最美的句号。',
        meta: 'Day 11 · 三亚 · 天涯海角日落',
        img: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=2400&q=90&auto=format&fit=crop',
        overlay: 'bg-gradient-to-l from-black/70 via-black/40 to-transparent', align: 'align-center', accent: '#f97316', mood: '感动 · 不舍'
    },
];

const itineraryData = [
    { day: 1, date: '4月25日（周六）', theme: '抵达三亚 · 开启环岛之旅', weather: '☀️ 晴间多云 25~32℃', route: '三亚凤凰机场 → 三亚湾 → 大东海', mileage: '约30km', img: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1600&q=85', highlights: ['取车自驾', '椰梦长廊', '第一市场海鲜'], items: [
        { time: '上午', icon: '✈️', title: '抵达三亚', desc: '乘坐上午航班抵达，机场附近取车，推荐SUV车型。' },
        { time: '下午', icon: '🏖️', title: '三亚湾椰梦长廊', desc: '沿海滨大道散步，感受椰风海韵，熟悉自驾路线。' },
        { time: '傍晚', icon: '🌅', title: '三亚湾日落', desc: '金色余晖洒满海面，拍照绝美。' },
        { time: '晚上', icon: '🦞', title: '第一市场海鲜', desc: '自选海鲜加工，和乐蟹、基围虾，人均100-150元。' },
    ]},
    { day: 2, date: '4月26日（周日）', theme: '三亚 → 陵水 · 海岛探秘', weather: '⛅ 多云 25~31℃', route: '三亚 → 分界洲岛 → 清水湾 → 陵水', mileage: '约120km', img: 'https://images.unsplash.com/photo-1559628233-100c798642d4?w=1600&q=85', highlights: ['分界洲岛', '会唱歌的沙滩', '陵水酸粉'], items: [
        { time: '上午', icon: '🏝️', title: '分界洲岛', desc: '5A级景区，海水清澈见底，可体验潜水、海豚表演。' },
        { time: '下午', icon: '🏖️', title: '清水湾', desc: '脚踩细沙会发出银铃般声响，国内罕见的"会唱歌的沙滩"。' },
        { time: '晚上', icon: '🍲', title: '陵水酸粉', desc: '海南四大名粉之一，酸辣鲜香。' },
    ]},
    { day: 3, date: '4月27日（周一）', theme: '陵水 → 万宁 · 冲浪天堂', weather: '⛅ 多云 24~30℃', route: '陵水 → 南湾猴岛 → 日月湾 → 石梅湾', mileage: '约100km', img: 'https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=1600&q=85', highlights: ['南湾猴岛', '日月湾冲浪', '东山羊'], items: [
        { time: '上午', icon: '🐒', title: '南湾猴岛', desc: '跨海缆车前往，2500多只猕猴，风景壮观。' },
        { time: '下午', icon: '🏄', title: '日月湾冲浪', desc: '中国冲浪之都，初学者可报名课程约200-300元/人。' },
        { time: '傍晚', icon: '🌴', title: '石梅湾', desc: '被誉为"海南最美海湾"，青皮林保护区绵延海岸。' },
    ]},
    { day: 4, date: '4月28日（周二）', theme: '万宁 → 琼海 · 博鳌风情', weather: '🌦️ 多云转小雨 24~29℃', route: '万宁 → 兴隆 → 博鳌 → 琼海', mileage: '约110km', img: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1600&q=85', highlights: ['兴隆咖啡', '博鳌论坛', '玉带滩'], items: [
        { time: '上午', icon: '🌿', title: '兴隆热带植物园', desc: '品尝正宗兴隆咖啡，参观千种热带植物。' },
        { time: '下午', icon: '🏛️', title: '博鳌亚洲论坛', desc: '参观永久会址，游览玉带滩奇观。' },
        { time: '晚上', icon: '🍲', title: '琼海杂粮小吃', desc: '鸡屎藤粑仔、薏粑、清补凉等特色小吃。' },
    ]},
    { day: 5, date: '4月29日（周三）', theme: '琼海 → 文昌 · 航天椰乡', weather: '🌦️ 阵雨转多云 23~28℃', route: '琼海 → 文昌航天城 → 东郊椰林 → 铜鼓岭', mileage: '约130km', img: 'https://zhiyan-ai-agent-with-1258344702.cos.ap-guangzhou.tencentcos.cn/with/125fbd42-6111-4661-8492-48e53a880d9e/image_1776677937_4_1.jpg', highlights: ['航天发射场', '文昌鸡', '东郊椰林'], items: [
        { time: '上午', icon: '🚀', title: '文昌航天发射场', desc: '中国最年轻的航天发射场，科普馆内容丰富。' },
        { time: '中午', icon: '🐔', title: '文昌鸡', desc: '海南四大名菜之首，皮脆肉嫩。' },
        { time: '下午', icon: '🌴', title: '东郊椰林', desc: '海南最大椰子种植区，绵延数十公里椰林海岸线。' },
    ]},
    { day: 6, date: '4月30日（周四）', theme: '文昌 → 海口 · 省会风情', weather: '⛅ 多云 24~30℃', route: '文昌 → 海口骑楼老街 → 火山口公园', mileage: '约100km', img: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1600&q=85', highlights: ['骑楼老街', '老爸茶', '火山口'], items: [
        { time: '上午', icon: '🏘️', title: '骑楼老街', desc: '700多栋南洋风格骑楼，中国历史文化名街。' },
        { time: '下午', icon: '🌋', title: '火山口地质公园', desc: '万年火山口，直径300米，植被茂密。' },
        { time: '晚上', icon: '🌃', title: '海口湾夜景', desc: '世纪大桥、云洞图书馆，海口夜色迷人。' },
    ]},
    { day: 7, date: '5月1日（周五）', theme: '海口深度游 · 五一假期', weather: '🌦️ 多云转小雨 25~30℃', route: '海口市区一日游', mileage: '约40km', img: 'https://images.unsplash.com/photo-1470004914212-05527e49370b?w=1600&q=85', highlights: ['省博物馆', '电影公社', '免税购物'], items: [
        { time: '上午', icon: '🏛️', title: '海南省博物馆', desc: '南海水下考古展和黎族文化展，免费参观。' },
        { time: '下午', icon: '🛍️', title: '免税店购物', desc: '海口国际免税城，五一促销活动。' },
        { time: '晚上', icon: '🌊', title: '假日海滩', desc: '海口市民最爱的休闲去处，沙滩烧烤。' },
    ]},
    { day: 8, date: '5月2日（周六）', theme: '海口 → 儋州 · 东坡文化', weather: '🌦️ 多云转小雨 24~29℃', route: '海口 → 千年古盐田 → 东坡书院 → 海花岛', mileage: '约180km', img: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=1600&q=85', highlights: ['千年古盐田', '东坡书院', '海花岛'], items: [
        { time: '上午', icon: '🧂', title: '千年古盐田', desc: '1200多年历史，上千个晒盐石槽散布海滩。' },
        { time: '下午', icon: '📚', title: '东坡书院', desc: '苏东坡被贬海南时的讲学之地，古木参天。' },
        { time: '傍晚', icon: '🏝️', title: '海花岛', desc: '全球最大花型人工岛，海洋乐园、博物馆群。' },
    ]},
    { day: 9, date: '5月3日（周日）', theme: '儋州 → 昌江 · 奇石海湾', weather: '⛅ 多云 24~30℃', route: '儋州 → 棋子湾 → 霸王岭 → 昌江', mileage: '约120km', img: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=1600&q=85', highlights: ['棋子湾', '霸王岭', '西海岸日落'], items: [
        { time: '上午', icon: '🏖️', title: '棋子湾', desc: '黑白鹅卵石如棋子散落，大角小角礁石奇观。' },
        { time: '下午', icon: '🌳', title: '霸王岭', desc: '海南长臂猿栖息地，负氧离子含量极高。' },
        { time: '傍晚', icon: '🌅', title: '棋子湾日落', desc: '海南观赏日落最佳地点之一。' },
    ]},
    { day: 10, date: '5月4日（周一）', theme: '昌江 → 乐东 · 雨林秘境', weather: '☀️ 晴间多云 25~31℃', route: '昌江 → 莺歌海盐场 → 尖峰岭 → 乐东', mileage: '约160km', img: 'https://images.unsplash.com/photo-1516214104703-d870798883c5?w=1600&q=85', highlights: ['莺歌海盐场', '尖峰岭天池', '星空'], items: [
        { time: '上午', icon: '🧂', title: '莺歌海盐场', desc: '中国三大盐场之一，盐田在阳光下闪耀如镜。' },
        { time: '下午', icon: '🌲', title: '尖峰岭', desc: '中国最大热带原始雨林，天池海拔800米。' },
        { time: '晚上', icon: '🌌', title: '尖峰岭星空', desc: '远离城市喧嚣，夜晚星空璀璨。' },
    ]},
    { day: 11, date: '5月5日（周二）', theme: '乐东 → 三亚 · 经典回归', weather: '☀️ 晴 25~32℃', route: '乐东 → 大小洞天 → 南山 → 天涯海角 → 三亚', mileage: '约130km', img: 'https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=1600&q=85', highlights: ['南山观音', '天涯海角', '鹿回头夜景'], items: [
        { time: '上午', icon: '🏔️', title: '大小洞天', desc: '800多年历史的道家文化旅游胜地。' },
        { time: '下午', icon: '🙏', title: '南山文化旅游区', desc: '108米海上观音像，南山素斋。' },
        { time: '傍晚', icon: '🪨', title: '天涯海角', desc: '已免门票，海景壮阔，浪漫至极。' },
    ]},
    { day: 12, date: '5月6日（周三）', theme: '三亚深度游 · 圆满收官', weather: '⛅ 多云 25~31℃', route: '蜈支洲岛/亚龙湾 → 免税购物 → 机场还车', mileage: '约80km', img: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1600&q=85', highlights: ['蜈支洲岛', '免税购物', '告别三亚'], items: [
        { time: '上午', icon: '🏝️', title: '蜈支洲岛/亚龙湾', desc: '中国马尔代夫，浮潜、海上摩托等水上项目。' },
        { time: '下午', icon: '🛍️', title: '免税购物 & 还车', desc: 'cdf三亚国际免税城，最后的购物时光。' },
        { time: '傍晚', icon: '✈️', title: '返程', desc: '带上满满回忆，结束12天环岛之旅！' },
    ]},
];

const spotsData = [
    { name: '蜈支洲岛', img: 'https://images.unsplash.com/photo-1559628233-100c798642d4?w=800&q=85', rating: 4.8, level: '5A', tags: [{ text: '海岛', color: 'bg-blue-500/20 text-blue-300' }, { text: '潜水', color: 'bg-cyan-500/20 text-cyan-300' }], address: '三亚·海棠湾', price: '¥136', desc: '被誉为"中国马尔代夫"，海水能见度极高，是国内顶级潜水胜地。', tips: '建议早上8点前到达码头排队。' },
    { name: '分界洲岛', img: 'https://images.unsplash.com/photo-1468413253725-0d5181091126?w=800&q=85', rating: 4.7, level: '5A', tags: [{ text: '海岛', color: 'bg-blue-500/20 text-blue-300' }, { text: '气候分界', color: 'bg-teal-500/20 text-teal-300' }], address: '陵水·牛岭', price: '¥132', desc: '海南南北气候分界线，中国首个海岛型5A景区。', tips: '常出现一边晴天一边下雨的奇观。' },
    { name: '日月湾', img: 'https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=800&q=85', rating: 4.6, level: '冲浪胜地', tags: [{ text: '冲浪', color: 'bg-orange-500/20 text-orange-300' }, { text: '海滩', color: 'bg-yellow-500/20 text-yellow-300' }], address: '万宁', price: '免费', desc: '中国冲浪之都，全年都有适合冲浪的浪。', tips: '初学者建议报名冲浪课程。' },
    { name: '博鳌亚洲论坛', img: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=85', rating: 4.5, level: '5A', tags: [{ text: '文化', color: 'bg-purple-500/20 text-purple-300' }, { text: '地标', color: 'bg-emerald-500/20 text-emerald-300' }], address: '琼海·博鳌', price: '¥125', desc: '博鳌亚洲论坛永久会址，国际政治经济交流平台。', tips: '论坛年会期间可能限制参观。' },
    { name: '文昌航天城', img: 'https://images.unsplash.com/photo-1457364559154-aa2644600ebb?w=800&q=85', rating: 4.7, level: '科普基地', tags: [{ text: '航天', color: 'bg-indigo-500/20 text-indigo-300' }, { text: '科技', color: 'bg-gray-500/20 text-gray-300' }], address: '文昌·龙楼', price: '免费', desc: '中国最年轻的航天发射场，长征五号从这里启航。', tips: '如遇火箭发射，可在附近海滩观看。' },
    { name: '骑楼老街', img: 'https://images.unsplash.com/photo-1470004914212-05527e49370b?w=800&q=85', rating: 4.5, level: '4A', tags: [{ text: '历史', color: 'bg-amber-500/20 text-amber-300' }, { text: '南洋', color: 'bg-rose-500/20 text-rose-300' }], address: '海口·龙华区', price: '免费', desc: '中国历史文化名街，700多栋南洋风格骑楼建筑。', tips: '傍晚前往更有氛围，别忘了喝老爸茶。' },
    { name: '棋子湾', img: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=800&q=85', rating: 4.4, level: '4A', tags: [{ text: '奇石', color: 'bg-gray-500/20 text-gray-300' }, { text: '日落', color: 'bg-orange-500/20 text-orange-300' }], address: '昌江', price: '免费', desc: '海南西海岸最美海湾，黑白鹅卵石如棋子散落。', tips: '傍晚日落时分最美，注意礁石湿滑。' },
    { name: '尖峰岭', img: 'https://images.unsplash.com/photo-1516214104703-d870798883c5?w=800&q=85', rating: 4.6, level: '4A', tags: [{ text: '雨林', color: 'bg-green-500/20 text-green-300' }, { text: '天池', color: 'bg-teal-500/20 text-teal-300' }], address: '乐东', price: '¥40', desc: '中国最大热带原始雨林，天池海拔800米，云雾缭绕。', tips: '山上温度低5-8℃，建议带薄外套。' },
    { name: '南山文化区', img: 'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=800&q=85', rating: 4.6, level: '5A', tags: [{ text: '文化', color: 'bg-purple-500/20 text-purple-300' }, { text: '祈福', color: 'bg-red-500/20 text-red-300' }], address: '三亚·崖州', price: '¥129', desc: '108米海上观音像举世闻名，南山寺香火鼎盛。', tips: '园区很大，建议乘坐电瓶车，预留3小时。' },
    { name: '天涯海角', img: 'https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=800&q=85', rating: 4.3, level: '4A', tags: [{ text: '地标', color: 'bg-emerald-500/20 text-emerald-300' }, { text: '免费', color: 'bg-green-500/20 text-green-300' }], address: '三亚·天涯区', price: '免费', desc: '海南标志性景点，"天涯""海角"石刻闻名遐迩。', tips: '已免门票，建议傍晚前往。' },
    { name: '亚龙湾', img: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=85', rating: 4.7, level: '5A', tags: [{ text: '海滩', color: 'bg-yellow-500/20 text-yellow-300' }, { text: '度假', color: 'bg-orange-500/20 text-orange-300' }], address: '三亚·吉阳区', price: '免费', desc: '"天下第一湾"，7.5公里半月形海湾，沙白海蓝。', tips: '公共沙滩免费，酒店沙滩需入住使用。' },
    { name: '火山口公园', img: 'https://images.unsplash.com/photo-1462332420958-a05d1e002413?w=800&q=85', rating: 4.4, level: '4A', tags: [{ text: '地质', color: 'bg-red-500/20 text-red-300' }, { text: '科普', color: 'bg-blue-500/20 text-blue-300' }], address: '海口·秀英区', price: '¥60', desc: '万年火山口，直径约300米，深约90米。', tips: '穿运动鞋，台阶较多。山顶可俯瞰海口。' },
];

const tipsData = [
    { icon: '🚗', title: '自驾租车', desc: '提前在神州、一嗨预订SUV。取车时检查车况并拍照。海南环岛高速免费通行。' },
    { icon: '⛽', title: '加油补给', desc: '东线加油站密集，西线较少。昌江-乐东段山路多，提前加满油。' },
    { icon: '☀️', title: '防晒必备', desc: 'SPF50+防晒霜必备，每2小时补涂。遮阳帽、墨镜、防晒衣标配。' },
    { icon: '🗺️', title: '导航路线', desc: '推荐高德地图，提前下载海南离线地图。西线部分路段信号弱。' },
    { icon: '🌧️', title: '雨季应对', desc: '4-5月偶有阵雨，随身带折叠伞。雨天山路注意减速，开启雾灯。' },
    { icon: '💰', title: '消费提醒', desc: '五一旺季酒店价格高，西线性价比更高。环岛总预算约8000-15000元/人。' },
    { icon: '🏥', title: '健康安全', desc: '携带常用药品。海上项目注意安全。自驾避免疲劳驾驶。' },
    { icon: '🛒', title: '免税购物', desc: '离岛免税每人每年10万额度。海口和三亚都有免税店。' },
    { icon: '📸', title: '拍照攻略', desc: '黄金时间：日出6-7点、日落18-19点。西线棋子湾日落是出片圣地。' },
];

const checklistData = [
    { category: '证件财物', icon: '💳', items: ['身份证/驾驶证', '机票信息', '酒店预订', '租车订单', '银行卡/现金', '手机充电器'] },
    { category: '防晒装备', icon: '🧴', items: ['SPF50+防晒霜', '遮阳帽', '太阳镜', '防晒衣', '晒后修复', '车用遮阳板'] },
    { category: '衣物鞋帽', icon: '👕', items: ['夏装5-6套', '泳衣泳裤', '沙滩鞋', '运动鞋', '薄外套', '速干毛巾'] },
    { category: '自驾必备', icon: '🚗', items: ['车载手机架', '充电线/车充', '折叠雨伞', '常用药品', '驱蚊液', '防水手机袋'] },
];

// ===== 费用预算数据（2人12天自驾，单位：元） =====
const budgetData = {
    totalMin: 10500,
    totalMax: 16500,
    people: 2,
    days: 12,
    categories: [
        {
            key: 'transport', name: '交通', icon: '✈️', color: '#38bdf8',
            percent: 28, min: 3000, max: 4600,
            details: [
                { label: '往返机票（2人·淡季特价~五一旺季）', value: '2000~3200' },
                { label: 'SUV租车（12天·日均280~380）', value: '3360~4560' },
                { label: '机场接送/市区打车', value: '150~300' },
                { label: '高速费', value: '免费（海南环岛高速全程免费）' }
            ]
        },
        {
            key: 'hotel', name: '住宿', icon: '🏨', color: '#a855f7',
            percent: 30, min: 3300, max: 5500,
            details: [
                { label: '三亚海景酒店×3晚（旺季~五一）', value: '1200~2400' },
                { label: '海口市区舒适酒店×2晚', value: '600~1000' },
                { label: '沿途精品民宿×7晚', value: '1500~2100' },
                { label: '西线性价比酒店（儋州/昌江/乐东）', value: '较东线便宜30%' }
            ]
        },
        {
            key: 'food', name: '餐饮', icon: '🍜', color: '#f59e0b',
            percent: 18, min: 2000, max: 3000,
            details: [
                { label: '第一市场海鲜大餐（人均150）', value: '300~400' },
                { label: '文昌鸡/加积鸭/东山羊/和乐蟹（四大名菜）', value: '400~600' },
                { label: '老爸茶/清补凉/海南粉/陵水酸粉', value: '200~300' },
                { label: '日常正餐（人均60~100·12天）', value: '1100~1700' }
            ]
        },
        {
            key: 'ticket', name: '门票', icon: '🎫', color: '#22c55e',
            percent: 12, min: 1200, max: 1800,
            details: [
                { label: '蜈支洲岛（含船票/电瓶车）', value: '320/人' },
                { label: '分界洲岛（含船票）', value: '168/人' },
                { label: '南山文化旅游区', value: '129/人' },
                { label: '博鳌/尖峰岭/火山口/南湾猴岛等', value: '350~500/人' }
            ]
        },
        {
            key: 'fuel', name: '油费', icon: '⛽', color: '#ef4444',
            percent: 7, min: 800, max: 1200,
            details: [
                { label: '环岛约1500km · SUV百公里8L', value: '约120L' },
                { label: '92号汽油参考价7.3~7.8元/L', value: '约900~1200' },
                { label: '省钱Tips：使用加油站App优惠', value: '可省8~15%' }
            ]
        },
        {
            key: 'extra', name: '其他', icon: '🛍️', color: '#ec4899',
            percent: 5, min: 400, max: 1400,
            details: [
                { label: '冲浪体验/潜水/游艇（可选）', value: '200~800/人' },
                { label: '特产（椰子糖/椰子油/咖啡）', value: '200~500' },
                { label: '免税购物（额外预算，不计入基础）', value: '按需' },
                { label: '保险（旅游意外险）', value: '50~100/人' }
            ]
        }
    ],
    tiers: [
        { name: '经济型', badge: '背包客', price: '约 7,500', sub: '/人', desc: '青旅民宿+简餐+必打卡景点', highlight: false },
        { name: '舒适型', badge: '推荐', price: '约 10,500', sub: '/人', desc: '商务酒店+当地特色餐+大部分景点', highlight: true },
        { name: '品质型', badge: '度假', price: '约 16,500', sub: '/人', desc: '海景度假酒店+海鲜大餐+全部项目', highlight: false }
    ]
};
