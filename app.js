// ===== 渲染与交互逻辑 =====

// ----- 真实海南岛轮廓路线图 -----
// 基于海南岛真实地理轮廓简化的 SVG 路径（viewBox: 0 0 500 600）
const HAINAN_OUTLINE = "M 305,90 Q 340,85 375,105 Q 410,128 425,165 Q 440,195 432,225 Q 420,250 405,275 Q 410,305 410,340 Q 405,380 395,415 Q 385,445 365,470 Q 340,500 305,515 Q 265,525 225,518 Q 185,508 150,485 Q 115,460 95,420 Q 75,380 72,335 Q 70,290 85,250 Q 100,215 125,190 Q 150,165 175,145 Q 205,125 235,110 Q 270,92 305,90 Z";

// 内部山脉/河流装饰
const HAINAN_MOUNTAINS = [
    "M 220,260 Q 245,245 270,265 Q 285,285 260,300 Q 230,305 220,260 Z", // 五指山
    "M 170,340 Q 195,330 210,355 Q 195,380 170,365 Z",  // 霸王岭
    "M 150,400 Q 170,395 180,415 Q 160,425 150,400 Z"   // 尖峰岭
];

function renderRouteMap() {
    const container = document.getElementById('routeMapContainer');
    if (!container) return;

    // 构建平滑路径
    let routePathD = `M ${routeStops[0].x},${routeStops[0].y}`;
    for (let i = 1; i < routeStops.length; i++) {
        const prev = routeStops[i - 1];
        const curr = routeStops[i];
        // 使用二次贝塞尔曲线沿岛屿边缘走
        const midX = (prev.x + curr.x) / 2;
        const midY = (prev.y + curr.y) / 2;
        // 根据位置增加一点弧度，让线条贴合海岸
        const dx = curr.x - prev.x;
        const dy = curr.y - prev.y;
        const len = Math.sqrt(dx * dx + dy * dy);
        // 向岛屿外侧偏移（基于中心点250,300）
        const cx = 250, cy = 300;
        const vx = midX - cx;
        const vy = midY - cy;
        const vlen = Math.sqrt(vx * vx + vy * vy) || 1;
        const off = Math.min(15, len * 0.12);
        const cpx = midX + (vx / vlen) * off;
        const cpy = midY + (vy / vlen) * off;
        routePathD += ` Q ${cpx},${cpy} ${curr.x},${curr.y}`;
    }

    // 标签偏移（避免与海岸重叠）
    const labelOffsets = [
        { dx: 0, dy: 22, anchor: 'middle' },   // 三亚
        { dx: 28, dy: 6, anchor: 'start' },    // 陵水
        { dx: 30, dy: 4, anchor: 'start' },    // 万宁
        { dx: 30, dy: 4, anchor: 'start' },    // 琼海
        { dx: 28, dy: 4, anchor: 'start' },    // 文昌
        { dx: 0, dy: -22, anchor: 'middle' },  // 海口
        { dx: -28, dy: -4, anchor: 'end' },    // 儋州
        { dx: -28, dy: 4, anchor: 'end' },     // 昌江
        { dx: -28, dy: 4, anchor: 'end' },     // 乐东
        { dx: 0, dy: 22, anchor: 'middle' },   // 三亚终点（隐藏）
    ];

    // 节点 SVG
    let nodesHtml = '';
    for (let i = 0; i < routeStops.length; i++) {
        const stop = routeStops[i];
        const lbl = labelOffsets[i];
        const showLabel = i < routeStops.length - 1; // 最后一个起点重合，不重复显示
        nodesHtml += `<g class="route-svg-node" data-index="${i}">`;
        nodesHtml += `<circle cx="${stop.x}" cy="${stop.y}" r="20" fill="none" stroke="${stop.color}" stroke-width="1" opacity="0.15" class="node-outer-ring"/>`;
        nodesHtml += `<circle cx="${stop.x}" cy="${stop.y}" r="11" fill="${stop.color}" opacity="0.25" class="node-bg"/>`;
        nodesHtml += `<circle cx="${stop.x}" cy="${stop.y}" r="6.5" fill="${stop.color}" class="node-core" opacity="0.5"/>`;
        nodesHtml += `<circle cx="${stop.x}" cy="${stop.y}" r="3" fill="white" opacity="0.85" class="node-dot"/>`;
        if (showLabel) {
            nodesHtml += `<text x="${stop.x + lbl.dx}" y="${stop.y + lbl.dy}" text-anchor="${lbl.anchor}" fill="white" font-size="13" font-weight="700" class="node-label" opacity="0.5" style="pointer-events:none">${stop.name}</text>`;
            nodesHtml += `<text x="${stop.x + lbl.dx}" y="${stop.y + lbl.dy + 13}" text-anchor="${lbl.anchor}" fill="${stop.color}" font-size="9.5" font-weight="700" class="node-day-label" opacity="0.4" style="pointer-events:none">${stop.day}</text>`;
        }
        nodesHtml += `</g>`;
    }

    // 山脉装饰
    const mountainsHtml = HAINAN_MOUNTAINS.map(path =>
        `<path d="${path}" fill="rgba(34,197,94,0.06)" stroke="rgba(34,197,94,0.15)" stroke-width="0.8"/>`
    ).join('');

    // mini 列表
    const miniListHtml = routeStops.slice(0, -1).map((s, i) => `
        <div class="route-mini-item" data-index="${i}">
            <span class="dot" style="background:${s.color}"></span>
            <span class="font-semibold text-white/70">${s.day}</span>
            <span class="truncate">${s.name}</span>
        </div>
    `).join('');

    const infoPanelHtml = `
        <div class="route-info-panel" id="routeInfoPanel">
            <div class="route-info-inner">
                <div class="flex items-center gap-3 mb-3">
                    <span class="text-3xl" id="infoPanelIcon">${routeStops[0].icon}</span>
                    <div>
                        <div class="text-xs text-ocean-400 font-semibold" id="infoPanelDay">${routeStops[0].day}</div>
                        <div class="text-xl font-black text-white" id="infoPanelName" style="color:${routeStops[0].color}">${routeStops[0].name}</div>
                    </div>
                </div>
                <p class="text-sm text-white/55 leading-relaxed" id="infoPanelDesc">${routeStops[0].desc}</p>
                <div class="mt-4 pt-4 border-t border-white/10">
                    <div class="flex items-center justify-between mb-2">
                        <span class="text-xs text-white/40">环岛进度</span>
                        <span class="text-xs text-ocean-400 font-semibold" id="routeProgressPct" style="color:${routeStops[0].color}">0%</span>
                    </div>
                    <div class="h-1.5 bg-white/10 rounded-full overflow-hidden">
                        <div class="h-full rounded-full transition-all duration-700" id="routeProgressBar" style="width:0%;background:linear-gradient(90deg,${routeStops[0].color},${routeStops[0].color}aa)"></div>
                    </div>
                    <div class="flex justify-between mt-1.5">
                        <span class="text-xs text-white/30" id="routeProgressText">1 / ${routeStops.length}</span>
                        <span class="text-xs text-white/30">总 1500km · 12天</span>
                    </div>
                </div>
                <div class="route-mini-list" id="routeMiniList">${miniListHtml}</div>
            </div>
        </div>
    `;

    container.innerHTML = `
        <div class="route-map-layout">
            <div class="route-svg-wrap">
                <svg viewBox="0 0 500 600" class="route-svg" id="routeSvg" preserveAspectRatio="xMidYMid meet">
                    <defs>
                        <filter id="islandGlow" x="-10%" y="-10%" width="120%" height="120%">
                            <feGaussianBlur stdDeviation="4" result="blur"/>
                            <feFlood flood-color="#0ea5e9" flood-opacity="0.2"/>
                            <feComposite in2="blur" operator="in"/>
                            <feMerge><feMergeNode/><feMergeNode in="SourceGraphic"/></feMerge>
                        </filter>
                        <linearGradient id="islandFill" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stop-color="rgba(14,165,233,0.10)"/>
                            <stop offset="50%" stop-color="rgba(34,197,94,0.08)"/>
                            <stop offset="100%" stop-color="rgba(251,146,60,0.08)"/>
                        </linearGradient>
                        <linearGradient id="routeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stop-color="#f43f5e"/>
                            <stop offset="25%" stop-color="#eab308"/>
                            <stop offset="50%" stop-color="#22c55e"/>
                            <stop offset="75%" stop-color="#3b82f6"/>
                            <stop offset="100%" stop-color="#f43f5e"/>
                        </linearGradient>
                        <radialGradient id="seaGlow" cx="50%" cy="50%" r="50%">
                            <stop offset="0%" stop-color="rgba(14,165,233,0.08)"/>
                            <stop offset="100%" stop-color="rgba(14,165,233,0)"/>
                        </radialGradient>
                    </defs>

                    <!-- 海域背景 -->
                    <rect width="500" height="600" fill="url(#seaGlow)" opacity="0.6"/>

                    <!-- 波纹装饰 -->
                    <g opacity="0.15">
                        <path d="M 30,80 Q 60,75 90,80 T 150,80" fill="none" stroke="#38bdf8" stroke-width="1"/>
                        <path d="M 400,70 Q 430,65 460,70 T 490,72" fill="none" stroke="#38bdf8" stroke-width="1"/>
                        <path d="M 20,540 Q 50,535 80,540 T 140,542" fill="none" stroke="#38bdf8" stroke-width="1"/>
                        <path d="M 410,560 Q 440,555 470,560 T 490,562" fill="none" stroke="#38bdf8" stroke-width="1"/>
                    </g>

                    <!-- 海南岛轮廓 -->
                    <path d="${HAINAN_OUTLINE}" fill="url(#islandFill)" stroke="rgba(14,165,233,0.45)" stroke-width="1.5" filter="url(#islandGlow)"/>
                    <path d="${HAINAN_OUTLINE}" fill="none" stroke="rgba(255,255,255,0.12)" stroke-width="0.6" stroke-dasharray="2 3"/>

                    <!-- 山脉/内部地形 -->
                    ${mountainsHtml}

                    <!-- 五指山标注 -->
                    <text x="250" y="285" fill="rgba(34,197,94,0.35)" font-size="9" text-anchor="middle" style="pointer-events:none">⛰ 五指山</text>
                    <text x="180" y="355" fill="rgba(34,197,94,0.35)" font-size="8" text-anchor="middle" style="pointer-events:none">霸王岭</text>
                    <text x="162" y="422" fill="rgba(34,197,94,0.35)" font-size="8" text-anchor="middle" style="pointer-events:none">尖峰岭</text>

                    <!-- 方向标 -->
                    <g class="compass-rose" transform="translate(448, 548)">
                        <circle r="18" fill="rgba(14,165,233,0.08)" stroke="rgba(14,165,233,0.3)" stroke-width="0.8"/>
                        <path d="M 0,-13 L 3,-3 L 0,0 L -3,-3 Z" fill="#f43f5e"/>
                        <path d="M 0,13 L 3,3 L 0,0 L -3,3 Z" fill="rgba(255,255,255,0.6)"/>
                        <text y="-19" text-anchor="middle" fill="rgba(255,255,255,0.6)" font-size="7" font-weight="700">N</text>
                    </g>

                    <!-- 海域标注 -->
                    <text x="60" y="300" fill="rgba(14,165,233,0.35)" font-size="10" font-style="italic" style="pointer-events:none">北部湾</text>
                    <text x="450" y="300" fill="rgba(14,165,233,0.35)" font-size="10" font-style="italic" style="pointer-events:none">南海</text>
                    <text x="250" y="65" fill="rgba(14,165,233,0.4)" font-size="11" text-anchor="middle" font-weight="700" style="pointer-events:none">琼州海峡</text>

                    <!-- 路线底色（完整灰色） -->
                    <path d="${routePathD}" fill="none" stroke="rgba(255,255,255,0.08)" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="4 4"/>

                    <!-- 路线主线（可动画） -->
                    <path id="routeAnimPath" d="${routePathD}" fill="none" stroke="url(#routeGrad)" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round" class="route-anim-path"/>

                    <!-- 移动小车 -->
                    <g id="routeMovingDot" class="route-moving-dot" style="opacity:0">
                        <circle r="8" fill="white" opacity="0.3"/>
                        <circle r="5" fill="white"/>
                        <text y="2" text-anchor="middle" font-size="7">🚗</text>
                    </g>

                    <!-- 东西线标注 -->
                    <text x="430" y="300" fill="rgba(239,68,68,0.4)" font-size="9" text-anchor="middle" transform="rotate(90 430 300)" style="pointer-events:none">东线 · 海岸公路</text>
                    <text x="70" y="300" fill="rgba(139,92,246,0.4)" font-size="9" text-anchor="middle" transform="rotate(-90 70 300)" style="pointer-events:none">西线 · 雨林海岸</text>

                    <!-- 节点 -->
                    ${nodesHtml}
                </svg>
            </div>
            ${infoPanelHtml}
        </div>
        <div class="mt-8 flex justify-center gap-3 flex-wrap">
            <button id="routePlayBtn" class="bg-ocean-500/20 hover:bg-ocean-500/30 text-ocean-300 px-5 py-2.5 rounded-full text-sm font-semibold transition-all border border-ocean-500/30 flex items-center gap-2">
                <i class="fas fa-play text-xs"></i> 播放路线动画
            </button>
            <button id="routeResetBtn" class="bg-white/5 hover:bg-white/10 text-white/50 px-5 py-2.5 rounded-full text-sm font-semibold transition-all border border-white/10 flex items-center gap-2">
                <i class="fas fa-redo text-xs"></i> 重置
            </button>
        </div>
    `;

    // 初始化动画路径
    const animPath = document.getElementById('routeAnimPath');
    if (animPath) {
        const totalLen = animPath.getTotalLength();
        animPath.style.strokeDasharray = totalLen;
        animPath.style.strokeDashoffset = totalLen;
    }
    activateRouteUpTo(0);

    // 节点点击
    container.querySelectorAll('.route-svg-node').forEach(node => {
        node.addEventListener('click', () => {
            activateRouteUpTo(parseInt(node.dataset.index));
        });
    });
    // 迷你列表点击
    container.querySelectorAll('.route-mini-item').forEach(item => {
        item.addEventListener('click', () => {
            activateRouteUpTo(parseInt(item.dataset.index));
        });
    });

    // 播放控制
    const playBtn = document.getElementById('routePlayBtn');
    const resetBtn = document.getElementById('routeResetBtn');
    let playInterval = null;
    let currentPlayIndex = 0;

    playBtn.addEventListener('click', () => {
        if (playInterval) {
            clearInterval(playInterval);
            playInterval = null;
            playBtn.innerHTML = '<i class="fas fa-play text-xs"></i> 播放路线动画';
            return;
        }
        currentPlayIndex = 0;
        activateRouteUpTo(0);
        playBtn.innerHTML = '<i class="fas fa-pause text-xs"></i> 暂停播放';
        playInterval = setInterval(() => {
            currentPlayIndex++;
            if (currentPlayIndex >= routeStops.length) {
                clearInterval(playInterval);
                playInterval = null;
                playBtn.innerHTML = '<i class="fas fa-play text-xs"></i> 播放路线动画';
                return;
            }
            activateRouteUpTo(currentPlayIndex);
        }, 1200);
    });

    resetBtn.addEventListener('click', () => {
        if (playInterval) {
            clearInterval(playInterval);
            playInterval = null;
            playBtn.innerHTML = '<i class="fas fa-play text-xs"></i> 播放路线动画';
        }
        activateRouteUpTo(0);
    });
}

function activateRouteUpTo(targetIndex) {
    const nodes = document.querySelectorAll('.route-svg-node');
    const animPath = document.getElementById('routeAnimPath');
    const movingDot = document.getElementById('routeMovingDot');

    if (animPath) {
        const totalLen = animPath.getTotalLength();
        const progress = targetIndex / (routeStops.length - 1);
        const offset = totalLen * (1 - progress);
        animPath.style.transition = 'stroke-dashoffset 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
        animPath.style.strokeDashoffset = offset;

        // 移动小车到当前点
        if (movingDot && targetIndex > 0) {
            const point = animPath.getPointAtLength(totalLen * progress);
            movingDot.setAttribute('transform', `translate(${point.x}, ${point.y})`);
            movingDot.style.opacity = '1';
            movingDot.style.transition = 'opacity 0.4s ease';
        } else if (movingDot) {
            movingDot.style.opacity = '0';
        }
    }

    nodes.forEach((node, i) => {
        const isActive = i <= targetIndex;
        const isCurrent = i === targetIndex;
        const bg = node.querySelector('.node-bg');
        const core = node.querySelector('.node-core');
        const dot = node.querySelector('.node-dot');
        const outer = node.querySelector('.node-outer-ring');
        const label = node.querySelector('.node-label');
        const dayLabel = node.querySelector('.node-day-label');

        if (bg) { bg.setAttribute('opacity', isActive ? '0.55' : '0.2'); bg.setAttribute('r', isCurrent ? '15' : '11'); }
        if (core) { core.setAttribute('opacity', isActive ? '0.95' : '0.5'); core.setAttribute('r', isCurrent ? '8.5' : '6.5'); }
        if (dot) { dot.setAttribute('opacity', '1'); dot.setAttribute('r', isCurrent ? '4' : '3'); }
        if (outer) {
            outer.setAttribute('opacity', isCurrent ? '0.6' : (isActive ? '0.3' : '0.15'));
            outer.setAttribute('r', isCurrent ? '26' : '20');
            outer.setAttribute('stroke-width', isCurrent ? '2' : '1');
        }
        if (label) { label.setAttribute('opacity', isActive ? '1' : '0.4'); label.setAttribute('font-size', isCurrent ? '14' : '13'); }
        if (dayLabel) { dayLabel.setAttribute('opacity', isActive ? '0.85' : '0.4'); }

        [bg, core, dot, outer, label, dayLabel].forEach(el => {
            if (el) el.style.transition = 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
        });
    });

    // mini列表高亮
    document.querySelectorAll('.route-mini-item').forEach((el, i) => {
        el.classList.toggle('active', i === targetIndex);
    });

    // 更新信息面板
    const stop = routeStops[targetIndex];
    const panelIcon = document.getElementById('infoPanelIcon');
    const panelDay = document.getElementById('infoPanelDay');
    const panelName = document.getElementById('infoPanelName');
    const panelDesc = document.getElementById('infoPanelDesc');
    const progressBar = document.getElementById('routeProgressBar');
    const progressText = document.getElementById('routeProgressText');
    const progressPct = document.getElementById('routeProgressPct');

    if (panelIcon) panelIcon.textContent = stop.icon;
    if (panelDay) panelDay.textContent = stop.day;
    if (panelName) { panelName.textContent = stop.name; panelName.style.color = stop.color; }
    if (panelDesc) panelDesc.textContent = stop.desc;
    const pct = Math.round((targetIndex / (routeStops.length - 1)) * 100);
    if (progressBar) {
        progressBar.style.width = pct + '%';
        progressBar.style.background = `linear-gradient(90deg, ${stop.color}, ${stop.color}aa)`;
    }
    if (progressText) progressText.textContent = (targetIndex + 1) + ' / ' + routeStops.length;
    if (progressPct) { progressPct.textContent = pct + '%'; progressPct.style.color = stop.color; }
}

// ----- 电影分镜 -----
function renderCinemaFrames() {
    const container = document.getElementById('cinemaFramesContainer');
    if (!container) return;
    container.innerHTML = cinemaFrames.map((frame, i) => `
        <div class="cinema-frame" data-frame="${frame.id}" id="frame-${frame.id}">
            <div class="cinema-frame-bg">
                <img src="${frame.img}" alt="${frame.title}" loading="lazy">
            </div>
            <div class="cinema-frame-overlay ${frame.overlay}"></div>
            <div class="frame-number">${String(i + 1).padStart(2, '0')}</div>
            <div class="cinema-frame-content ${frame.align}">
                <div class="frame-subtitle">
                    <span class="text-xs tracking-[0.3em] uppercase font-medium" style="color: ${frame.accent}">${frame.subtitle}</span>
                </div>
                <div class="frame-divider" style="color: ${frame.accent}"></div>
                <h2 class="frame-title text-4xl sm:text-5xl md:text-6xl font-black text-white mb-4 leading-tight">${frame.title}</h2>
                <p class="frame-desc text-base sm:text-lg text-white/75 leading-relaxed mb-6 max-w-md">${frame.desc}</p>
                <div class="frame-meta flex flex-wrap items-center gap-3">
                    <span class="text-xs bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full text-white/70 border border-white/10"><i class="fas fa-route mr-1"></i>${frame.meta}</span>
                    <span class="text-xs px-3 py-1.5 rounded-full border" style="color: ${frame.accent}; border-color: ${frame.accent}44; background: ${frame.accent}15">${frame.mood}</span>
                </div>
            </div>
        </div>
    `).join('');
}

// ----- 时间轴 -----
function renderTimeline() {
    const ticks = document.getElementById('timelineTicks');
    const labels = document.getElementById('timelineLabels');
    if (!ticks || !labels) return;
    ticks.innerHTML = itineraryData.map((d, i) => `<div class="timeline-tick ${i === 0 ? 'passed' : ''}" data-index="${i}"></div>`).join('');
    labels.innerHTML = itineraryData.map((d, i) => `<div class="timeline-label ${i === 0 ? 'active' : ''}" data-index="${i}">D${d.day}</div>`).join('');
    renderTimelineContent(0);
    initTimelineInteraction();
}

function renderTimelineContent(dayIndex) {
    const container = document.getElementById('timelineContent');
    if (!container) return;
    const day = itineraryData[dayIndex];
    container.innerHTML = `
        <div class="timeline-card">
            <div class="grid grid-cols-1 lg:grid-cols-2">
                <div class="timeline-card-img relative">
                    <img src="${day.img}" alt="${day.theme}" loading="lazy">
                    <div class="absolute bottom-4 left-4 z-10">
                        <div class="text-xs text-white/60 mb-1">${day.weather}</div>
                        <div class="text-2xl font-black text-white">Day ${day.day}</div>
                    </div>
                </div>
                <div class="p-5 sm:p-6 lg:p-8 flex flex-col justify-center">
                    <div class="flex items-center gap-2 mb-4 flex-wrap">
                        <span class="text-xs bg-ocean-500/20 text-ocean-300 px-3 py-1 rounded-full font-semibold">${day.date}</span>
                        <span class="text-xs bg-white/5 text-white/40 px-3 py-1 rounded-full">${day.mileage}</span>
                    </div>
                    <h3 class="text-xl sm:text-2xl font-bold text-white mb-2">${day.theme}</h3>
                    <p class="text-sm text-white/40 mb-4"><i class="fas fa-route mr-1"></i>${day.route}</p>
                    <div class="flex flex-wrap gap-2 mb-5">
                        ${day.highlights.map(h => `<span class="text-xs bg-white/5 text-white/60 px-3 py-1.5 rounded-full border border-white/10">${h}</span>`).join('')}
                    </div>
                    <div class="space-y-2.5">
                        ${day.items.map(item => `
                            <div class="flex items-start gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
                                <span class="text-xl flex-shrink-0">${item.icon}</span>
                                <div class="min-w-0">
                                    <div class="flex items-center gap-2 mb-0.5">
                                        <span class="text-xs text-ocean-400 font-semibold">${item.time}</span>
                                        <span class="text-sm font-bold text-white">${item.title}</span>
                                    </div>
                                    <p class="text-xs text-white/50 leading-relaxed">${item.desc}</p>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        </div>
    `;
}

function initTimelineInteraction() {
    const track = document.getElementById('timelineTrack');
    const progress = document.getElementById('timelineProgress');
    const thumb = document.getElementById('timelineThumb');
    const ticks = document.querySelectorAll('.timeline-tick');
    const labels = document.querySelectorAll('.timeline-label');
    if (!track || !thumb) return;

    const totalDays = itineraryData.length;
    let currentDay = 0;
    let isDragging = false;

    function updateToDay(dayIndex) {
        dayIndex = Math.max(0, Math.min(totalDays - 1, dayIndex));
        if (dayIndex === currentDay) return;
        currentDay = dayIndex;
        const pct = (dayIndex / (totalDays - 1)) * 100;
        progress.style.width = pct + '%';
        thumb.style.left = pct + '%';
        ticks.forEach((t, i) => t.classList.toggle('passed', i <= dayIndex));
        labels.forEach((l, i) => l.classList.toggle('active', i === dayIndex));
        renderTimelineContent(dayIndex);
    }

    function getIndexFromX(clientX) {
        const rect = track.getBoundingClientRect();
        const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
        return Math.round(ratio * (totalDays - 1));
    }

    track.addEventListener('click', e => {
        if (isDragging) return;
        updateToDay(getIndexFromX(e.clientX));
    });
    thumb.addEventListener('mousedown', e => { isDragging = true; e.preventDefault(); });
    thumb.addEventListener('touchstart', () => { isDragging = true; }, { passive: true });

    const onMove = clientX => {
        if (!isDragging) return;
        const idx = getIndexFromX(clientX);
        const pct = (idx / (totalDays - 1)) * 100;
        progress.style.width = pct + '%';
        thumb.style.left = pct + '%';
        progress.style.transition = 'none';
        thumb.style.transition = 'none';
        ticks.forEach((t, i) => t.classList.toggle('passed', i <= idx));
        labels.forEach((l, i) => l.classList.toggle('active', i === idx));
        if (idx !== currentDay) { currentDay = idx; renderTimelineContent(idx); }
    };

    document.addEventListener('mousemove', e => onMove(e.clientX));
    document.addEventListener('touchmove', e => onMove(e.touches[0].clientX), { passive: true });

    const onEnd = () => {
        if (!isDragging) return;
        isDragging = false;
        progress.style.transition = '';
        thumb.style.transition = '';
    };
    document.addEventListener('mouseup', onEnd);
    document.addEventListener('touchend', onEnd);

    labels.forEach(label => {
        label.addEventListener('click', () => updateToDay(parseInt(label.dataset.index)));
    });
}

// ----- 天气 / 景点 / 贴士 / 清单 -----
function renderWeather() {
    const c = document.getElementById('weatherCards');
    if (!c) return;
    c.innerHTML = weatherData.map((w, i) => `
        <div class="weather-card fade-in" style="animation-delay:${i * 0.05}s">
            <div class="text-xs font-semibold text-ocean-400 mb-1">${w.date}</div>
            <div class="text-xs text-white/30 mb-2">${w.weekday}</div>
            <span class="weather-icon">${w.icon}</span>
            <div class="text-xs text-white/50 mb-2">${w.desc}</div>
            <div class="temp-high">${w.high}℃</div>
            <div class="temp-low">${w.low}℃</div>
            <div class="mt-2 pt-2 border-t border-white/5 text-xs text-white/25 space-y-0.5">
                <div><i class="fas fa-tint mr-1 text-blue-400/50"></i>${w.humidity}</div>
                <div><i class="fas fa-wind mr-1 text-white/20"></i>${w.wind}</div>
            </div>
        </div>
    `).join('');
}

function renderSpots() {
    const c = document.getElementById('spotsGrid');
    if (!c) return;
    c.innerHTML = spotsData.map((spot, i) => `
        <div class="spot-card fade-in" data-spot="${i}" style="animation-delay:${i * 0.05}s">
            <div class="spot-img relative">
                <img src="${spot.img}" alt="${spot.name}" loading="lazy">
                <div class="absolute top-3 left-3 bg-black/60 backdrop-blur-sm text-xs font-bold px-2.5 py-1 rounded-full text-ocean-300">${spot.level}</div>
                <div class="absolute top-3 right-3 bg-black/60 backdrop-blur-sm text-white text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1"><i class="fas fa-star text-yellow-400"></i> ${spot.rating}</div>
            </div>
            <div class="spot-info">
                <h3 class="font-bold text-white text-lg mb-1">${spot.name}</h3>
                <p class="text-xs text-white/30 mb-2"><i class="fas fa-map-marker-alt mr-1"></i>${spot.address}</p>
                <div class="flex flex-wrap mb-2">${spot.tags.map(t => `<span class="spot-tag ${t.color}">${t.text}</span>`).join('')}</div>
                <div class="flex items-center justify-between">
                    <span class="text-sm font-semibold text-orange-400">${spot.price}</span>
                    <span class="text-xs text-ocean-400 font-semibold">详情 <i class="fas fa-arrow-right ml-1"></i></span>
                </div>
            </div>
        </div>
    `).join('');
    c.querySelectorAll('.spot-card').forEach(card => {
        card.addEventListener('click', () => showSpotModal(parseInt(card.dataset.spot)));
    });
}

function showSpotModal(index) {
    const spot = spotsData[index];
    if (!spot) return;
    const overlay = document.createElement('div');
    overlay.className = 'spot-modal-overlay';
    overlay.innerHTML = `
        <div class="spot-modal">
            <div class="relative">
                <img src="${spot.img}" alt="${spot.name}" class="w-full h-56 object-cover rounded-t-xl">
                <button class="absolute top-3 right-3 bg-black/60 text-white w-8 h-8 rounded-full flex items-center justify-center hover:bg-black/80 transition-colors" id="closeModal"><i class="fas fa-times"></i></button>
                <div class="absolute bottom-3 left-3 flex gap-2">
                    <span class="bg-black/60 backdrop-blur-sm text-xs font-bold px-2.5 py-1 rounded-full text-ocean-300">${spot.level}</span>
                    <span class="bg-black/60 backdrop-blur-sm text-white text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1"><i class="fas fa-star text-yellow-400"></i> ${spot.rating}</span>
                </div>
            </div>
            <div class="p-6">
                <h3 class="text-2xl font-bold text-white mb-2">${spot.name}</h3>
                <p class="text-sm text-white/30 mb-3"><i class="fas fa-map-marker-alt mr-1"></i>${spot.address}</p>
                <div class="flex flex-wrap mb-4">${spot.tags.map(t => `<span class="spot-tag ${t.color} text-xs">${t.text}</span>`).join('')}</div>
                <div class="bg-white/5 rounded-xl p-4 mb-4"><p class="text-sm text-white/60 leading-relaxed">${spot.desc}</p></div>
                <div class="flex items-center justify-between mb-4"><span class="text-lg font-bold text-orange-400">${spot.price}</span></div>
                <div class="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4">
                    <div class="flex items-start gap-2"><span class="text-lg">💡</span>
                        <div><h5 class="font-semibold text-amber-300 text-sm mb-1">游玩贴士</h5>
                            <p class="text-xs text-amber-200/60">${spot.tips}</p></div></div>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(overlay);
    document.body.style.overflow = 'hidden';
    requestAnimationFrame(() => overlay.classList.add('show'));
    const close = () => {
        overlay.classList.remove('show');
        document.body.style.overflow = '';
        setTimeout(() => overlay.remove(), 300);
    };
    overlay.querySelector('#closeModal').addEventListener('click', close);
    overlay.addEventListener('click', e => { if (e.target === overlay) close(); });
    document.addEventListener('keydown', function h(e) {
        if (e.key === 'Escape') { close(); document.removeEventListener('keydown', h); }
    });
}

function renderTips() {
    const c = document.getElementById('tipsGrid');
    if (!c) return;
    c.innerHTML = tipsData.map((tip, i) => `
        <div class="tip-card fade-in" style="animation-delay:${i * 0.06}s">
            <div class="tip-icon"><span class="text-xl">${tip.icon}</span></div>
            <h4 class="font-bold text-white mb-2">${tip.title}</h4>
            <p class="text-sm text-white/40 leading-relaxed">${tip.desc}</p>
        </div>
    `).join('');
}

function renderChecklist() {
    const c = document.getElementById('checklistGrid');
    if (!c) return;
    c.innerHTML = checklistData.map((cat, ci) => `
        <div class="checklist-card">
            <div class="flex items-center gap-2 mb-3 pb-2 border-b border-white/15">
                <span class="text-xl">${cat.icon}</span>
                <h4 class="font-bold text-white">${cat.category}</h4>
            </div>
            <div class="space-y-1">
                ${cat.items.map((item, ii) => `<label class="checklist-item" data-cat="${ci}" data-item="${ii}"><input type="checkbox"><span>${item}</span></label>`).join('')}
            </div>
        </div>
    `).join('');
    c.querySelectorAll('.checklist-item').forEach(label => {
        const cb = label.querySelector('input[type="checkbox"]');
        cb.addEventListener('change', () => label.classList.toggle('checked', cb.checked));
    });
}

// ----- 费用预算 -----
function renderBudget() {
    const c = document.getElementById('budgetContainer');
    if (!c) return;

    // 计算甜甜圈的 stroke-dasharray
    const radius = 85;
    const circumference = 2 * Math.PI * radius;
    let cumulativePct = 0;
    const donutSegments = budgetData.categories.map(cat => {
        const dashLen = (cat.percent / 100) * circumference;
        const offset = -((cumulativePct / 100) * circumference);
        const seg = { color: cat.color, dashLen, dashOffset: offset, cumulativePct };
        cumulativePct += cat.percent;
        return seg;
    });

    const donutHtml = `
        <div class="budget-donut-wrap">
            <svg viewBox="0 0 200 200" class="budget-donut">
                <circle cx="100" cy="100" r="${radius}" stroke="rgba(255,255,255,0.04)"/>
                ${donutSegments.map(s => `
                    <circle cx="100" cy="100" r="${radius}" stroke="${s.color}"
                        stroke-dasharray="${s.dashLen} ${circumference - s.dashLen}"
                        stroke-dashoffset="${s.dashOffset}"
                        stroke-linecap="round"/>
                `).join('')}
            </svg>
            <div class="budget-donut-center">
                <div class="text-xs text-white/40 mb-1">人均预算</div>
                <div class="text-3xl font-black text-white">¥10.5K</div>
                <div class="text-xs text-ocean-400">舒适型 · 推荐</div>
            </div>
        </div>
    `;

    const categoriesHtml = budgetData.categories.map(cat => `
        <div class="budget-item" style="--bar-color:${cat.color}" data-cat="${cat.key}">
            <div class="budget-item-head">
                <div class="flex items-center gap-2">
                    <span class="text-xl">${cat.icon}</span>
                    <span class="font-bold text-white">${cat.name}</span>
                    <span class="text-xs px-2 py-0.5 rounded-full" style="color:${cat.color};background:${cat.color}20">${cat.percent}%</span>
                </div>
                <div class="text-right">
                    <div class="text-sm font-bold" style="color:${cat.color}">¥${cat.min}~${cat.max}</div>
                </div>
            </div>
            <div class="budget-item-bar">
                <div class="budget-item-bar-fill" style="width:${cat.percent * 3}%;background:linear-gradient(90deg,${cat.color},${cat.color}88)"></div>
            </div>
            <div>
                ${cat.details.map(d => `
                    <div class="budget-price-row">
                        <span class="truncate pr-2">${d.label}</span>
                        <span class="text-white/70 font-semibold flex-shrink-0">${d.value}</span>
                    </div>
                `).join('')}
            </div>
        </div>
    `).join('');

    const tiersHtml = budgetData.tiers.map(t => `
        <div class="tier-card ${t.highlight ? 'highlight' : ''}">
            <span class="tier-badge" style="${t.highlight ? 'background:rgba(251,191,36,0.2);color:#fbbf24' : ''}">${t.badge}</span>
            <div class="text-sm text-white/60 mb-1">${t.name}</div>
            <div class="text-2xl font-black text-white mb-1">¥${t.price.replace('约 ', '')}<span class="text-sm text-white/40 font-normal">${t.sub}</span></div>
            <div class="text-xs text-white/40 leading-relaxed">${t.desc}</div>
        </div>
    `).join('');

    c.innerHTML = `
        <div class="budget-hero">
            ${donutHtml}
            <div>
                <div class="text-xs tracking-[0.2em] uppercase text-ocean-400 mb-2">2人 · 12天 · 自驾</div>
                <h3 class="text-2xl sm:text-3xl font-black text-white mb-2">总预算参考</h3>
                <div class="budget-total-num">¥${(budgetData.totalMin * budgetData.people).toLocaleString()}~${(budgetData.totalMax * budgetData.people).toLocaleString()}</div>
                <p class="text-sm text-white/50 leading-relaxed mt-2">
                    基于2人舒适型配置，人均 <span class="text-amber-300 font-bold">¥${budgetData.totalMin.toLocaleString()}~${budgetData.totalMax.toLocaleString()}</span>。
                    含交通、住宿、餐饮、门票、油费等全部开销。实际费用受季节/住宿档次影响较大。
                </p>
                <div class="flex flex-wrap gap-2 mt-4">
                    <span class="text-xs bg-green-500/20 text-green-300 px-3 py-1 rounded-full"><i class="fas fa-check mr-1"></i>环岛高速免费</span>
                    <span class="text-xs bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full"><i class="fas fa-gift mr-1"></i>离岛免税额度10万</span>
                    <span class="text-xs bg-amber-500/20 text-amber-300 px-3 py-1 rounded-full"><i class="fas fa-exclamation-triangle mr-1"></i>五一旺季房价翻倍</span>
                </div>
            </div>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">${categoriesHtml}</div>
        <div class="mt-8">
            <h4 class="text-center text-lg font-bold text-white/80 mb-4">三档预算对比 <span class="text-xs text-white/40 font-normal">（人均/12天）</span></h4>
            <div class="budget-tier">${tiersHtml}</div>
        </div>
        <div class="mt-6 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-5">
            <div class="flex items-start gap-3">
                <span class="text-2xl">💡</span>
                <div>
                    <h4 class="font-bold text-emerald-300 mb-2">省钱小贴士</h4>
                    <ul class="text-sm text-emerald-200/70 leading-relaxed space-y-1.5">
                        <li>• <b>机票</b>：避开五一假期前后3天，价格可降低40%～60%</li>
                        <li>• <b>住宿</b>：西线城市（儋州/昌江/乐东）酒店价格比东线便宜30%左右</li>
                        <li>• <b>用餐</b>：海鲜市场自购加工比酒店点单省50%</li>
                        <li>• <b>门票</b>：关注景区官方公众号，常有工作日优惠；天涯海角、东郊椰林已免门票</li>
                        <li>• <b>免税</b>：先确定必买再下单，避免因凑单超支</li>
                    </ul>
                </div>
            </div>
        </div>
    `;
}

// ----- 通用交互 -----
function initCinemaFrameObserver() {
    const observer = new IntersectionObserver(entries => {
        entries.forEach(e => {
            if (e.isIntersecting) e.target.classList.add('in-view');
            else e.target.classList.remove('in-view');
        });
    }, { threshold: 0.3, rootMargin: '0px 0px -10% 0px' });
    document.querySelectorAll('.cinema-frame').forEach(f => observer.observe(f));
}

function initFadeInObserver() {
    const observer = new IntersectionObserver(entries => {
        entries.forEach(e => {
            if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target); }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
    document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));
}

function initBackToTop() {
    const btn = document.getElementById('backToTop');
    if (!btn) return;
    window.addEventListener('scroll', () => btn.classList.toggle('visible', window.scrollY > 500));
    btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

// ===== 初始化 =====
document.addEventListener('DOMContentLoaded', () => {
    renderRouteMap();
    renderCinemaFrames();
    renderTimeline();
    renderWeather();
    renderSpots();
    renderTips();
    renderChecklist();
    renderBudget();
    initBackToTop();
    setTimeout(() => {
        initCinemaFrameObserver();
        initFadeInObserver();
    }, 100);
});
