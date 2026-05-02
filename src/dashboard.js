/**
 * @fileoverview Dashboard de gráficos con Apache ECharts
 * Renderiza: Radar (ADN), Termómetros, Treemap, Timeline, Scatter, Recomendador
 */

const Dashboard = {
    charts: {},
    currentPerfume: null,

    /**
     * Inicializa todas las instancias de ECharts
     */
    init() {
        this.charts.radar = echarts.init(document.getElementById('chart-radar'), 'dark');
        this.charts.thermo = echarts.init(document.getElementById('chart-thermo'), 'dark');
        this.charts.treemap = echarts.init(document.getElementById('chart-treemap'), 'dark');
        this.charts.timeline = echarts.init(document.getElementById('chart-timeline'), 'dark');
        this.charts.scatter = echarts.init(document.getElementById('chart-scatter'), 'dark');
        this.charts.recommender = echarts.init(document.getElementById('chart-recommender'), 'dark');

        window.addEventListener('resize', () => {
            Object.values(this.charts).forEach(c => c.resize());
        });
    },

    /**
     * Actualiza todos los gráficos con datos del perfume seleccionado
     * @param {Object} perfume - Perfume con métricas completas
     */
    update(perfume) {
        this.currentPerfume = perfume;
        this.updateRadar(perfume);
        this.updateThermo(perfume);
        this.updateTreemap(perfume);
        this.updateTimeline(perfume);
        this.updateScatter(perfume);
        this.updateRecommender(perfume);
    },

    /**
     * Gráfico 1: Radar emocional (ADN del perfume)
     */
    updateRadar(perfume) {
        const s = perfume.sensaciones;
        this.charts.radar.setOption({
            backgroundColor: 'transparent',
            tooltip: { trigger: 'item' },
            radar: {
                indicator: [
                    { name: 'Frescura', max: 100 },
                    { name: 'Dulzura', max: 100 },
                    { name: 'Calidez', max: 100 },
                    { name: 'Intensidad', max: 100 },
                    { name: 'Elegancia', max: 100 },
                    { name: 'Sensualidad', max: 100 }
                ],
                radius: '65%',
                axisName: { color: '#8888aa', fontSize: 10 },
                splitArea: { areaStyle: { color: ['rgba(108,92,231,0.05)', 'rgba(108,92,231,0.1)'] } },
                axisLine: { lineStyle: { color: '#2a2a3e' } },
                splitLine: { lineStyle: { color: '#2a2a3e' } }
            },
            series: [{
                type: 'radar',
                data: [{
                    value: [s.frescura, s.dulzura, s.calidez, s.intensidad, s.elegancia, s.sensualidad],
                    name: perfume.nombre,
                    areaStyle: { color: 'rgba(108, 92, 231, 0.3)' },
                    lineStyle: { color: '#6c5ce7', width: 2 },
                    itemStyle: { color: '#6c5ce7' },
                    label: { show: true, fontSize: 9, color: '#ccc' }
                }]
            }]
        }, true);
    },

    /**
     * Gráfico 2: Termómetros emocionales (barras horizontales)
     */
    updateThermo(perfume) {
        const s = perfume.sensaciones;
        const emojis = { frescura: '❄️', dulzura: '🍬', calidez: '🔥', intensidad: '💥', elegancia: '👑', sensualidad: '💋' };
        const colors = { frescura: '#4DA8DA', dulzura: '#E8A87C', calidez: '#C1440E', intensidad: '#FF6B6B', elegancia: '#FFD700', sensualidad: '#FF85A2' };

        this.charts.thermo.setOption({
            backgroundColor: 'transparent',
            grid: { top: 5, bottom: 5, left: 70, right: 20 },
            xAxis: { type: 'value', max: 100, show: false },
            yAxis: {
                type: 'category',
                data: ['frescura', 'dulzura', 'calidez', 'intensidad', 'elegancia', 'sensualidad'].reverse(),
                axisLabel: {
                    formatter: (val) => `${emojis[val]}  ${val.charAt(0).toUpperCase() + val.slice(1)}`,
                    color: '#8888aa', fontSize: 10
                },
                axisLine: { show: false }, axisTick: { show: false }
            },
            series: [{
                type: 'bar',
                data: ['frescura', 'dulzura', 'calidez', 'intensidad', 'elegancia', 'sensualidad'].reverse().map(k => ({
                    value: s[k],
                    itemStyle: { color: colors[k], borderRadius: [0, 3, 3, 0] }
                })),
                barWidth: 14,
                label: {
                    show: true, position: 'right', color: '#ccc', fontSize: 10,
                    formatter: '{c}%'
                }
            }]
        }, true);
    },

    /**
     * Gráfico 3: Treemap de composición por nota
     */
    updateTreemap(perfume) {
        const colorMap = NOTE_COLORS;
        this.charts.treemap.setOption({
            backgroundColor: 'transparent',
            series: [{
                type: 'treemap',
                data: perfume.notas.map(n => ({
                    name: n.nombre,
                    value: n.porcentaje,
                    itemStyle: { color: colorMap[n.subtipo] || '#6c5ce7' }
                })),
                roam: false,
                nodeClick: false,
                breadcrumb: { show: false },
                label: {
                    show: true, color: '#fff', fontSize: 11,
                    formatter: '{b}\n{d}%'
                },
                itemStyle: { borderColor: '#12121a', borderWidth: 2, gapWidth: 2 },
                levels: [{
                    itemStyle: { gapWidth: 2, borderColorSaturation: 0.6 }
                }]
            }]
        }, true);
    },

    /**
     * Gráfico 4: Timeline de evolución temporal del perfume
     */
    updateTimeline(perfume) {
        const levelMap = { top: 0, middle: 1, base: 2 };
        const levelNames = { top: 'Salida', middle: 'Corazón', base: 'Fondo' };
        const durMap = { top: [0, 2], middle: [1, 6], base: [3, 12] };
        const colorMap = NOTE_COLORS;

        // Generar puntos de intensidad por hora (0-12h)
        const hours = [];
        for (let h = 0; h <= 12; h += 0.5) hours.push(h);

        const seriesData = [];
        ['top', 'middle', 'base'].forEach(level => {
            const levelNotes = perfume.notas.filter(n => n.nivel === level);
            if (levelNotes.length === 0) return;
            const avgPct = levelNotes.reduce((s, n) => s + n.porcentaje, 0) / levelNotes.length;
            const [start, end] = durMap[level];
            const peak = (start + end) / 2;

            const data = hours.map(h => {
                if (h < start) return 0;
                if (h > end) return 0;
                if (h <= peak) return avgPct * (h - start) / (peak - start);
                return avgPct * (end - h) / (end - peak);
            });

            seriesData.push({
                name: levelNames[level],
                type: 'line',
                smooth: true,
                data: data,
                lineStyle: { width: 2.5 },
                areaStyle: { opacity: 0.15 },
                symbol: 'none'
            });
        });

        const levelColors = { top: '#6c5ce7', middle: '#4DA8DA', base: '#8B5E3C' };
        const areaColors = { top: 'rgba(108,92,231,0.3)', middle: 'rgba(77,168,218,0.3)', base: 'rgba(139,94,60,0.3)' };

        seriesData.forEach((s, i) => {
            const level = ['top', 'middle', 'base'][i];
            s.itemStyle = { color: levelColors[level] };
            s.areaStyle = { color: areaColors[level] };
        });

        this.charts.timeline.setOption({
            backgroundColor: 'transparent',
            tooltip: { trigger: 'axis', formatter: (params) => {
                let txt = `<b>${params[0].name}h</b><br/>`;
                params.forEach(p => { if (p.value > 0) txt += `${p.marker} ${p.seriesName}: ${p.value.toFixed(0)}%<br/>`; });
                return txt;
            }},
            grid: { top: 20, bottom: 25, left: 35, right: 15 },
            xAxis: {
                type: 'value', name: 'Horas', nameTextStyle: { color: '#666', fontSize: 9 },
                min: 0, max: 12, axisLabel: { color: '#666', fontSize: 9 },
                splitLine: { lineStyle: { color: '#1a1a2e' } }
            },
            yAxis: {
                type: 'value', name: 'Intensidad %', nameTextStyle: { color: '#666', fontSize: 9 },
                axisLabel: { color: '#666', fontSize: 9, formatter: '{value}%' },
                splitLine: { lineStyle: { color: '#1a1a2e' } }
            },
            series: seriesData,
            legend: { data: seriesData.map(s => s.name), textStyle: { color: '#8888aa', fontSize: 9 }, top: 0, right: 0, itemWidth: 12, itemHeight: 8 }
        }, true);
    },

    /**
     * Gráfico 5: Scatter/Galaxia de todos los perfumes
     * Eje X = frescura, Eje Y = calidez, Tamaño = rating, Color = familia
     */
    updateScatter(perfume) {
        const familyColors = {
            calido: '#FF8C00', fresco: '#4DA8DA', oriental: '#8B6914',
            amaderado: '#8B5E3C', floral: '#FF85A2', citrico: '#FFD700',
            gourmand: '#E8A87C', acuatico: '#4DA8DA', verde: '#4ECB71'
        };

        const scatterData = PERFUMES.map(p => ({
            value: [p.vectorPerfil.frescura, p.vectorPerfil.calidez, p.rating],
            name: p.nombre,
            itemStyle: { color: familyColors[p.familia] || '#6c5ce7' }
        }));

        this.charts.scatter.setOption({
            backgroundColor: 'transparent',
            tooltip: {
                trigger: 'item',
                formatter: (p) => {
                    const pf = PERFUMES.find(x => x.nombre === p.name);
                    return pf ? `<b>${pf.nombre}</b><br/>${pf.marca} · ${pf.rating}★<br/>Frescura: ${pf.vectorPerfil.frescura}%<br/>Calidez: ${pf.vectorPerfil.calidez}%` : p.name;
                }
            },
            grid: { top: 15, bottom: 25, left: 40, right: 15 },
            xAxis: {
                name: 'Frescura', nameTextStyle: { color: '#666' },
                axisLabel: { color: '#666', formatter: '{value}%' },
                splitLine: { lineStyle: { color: '#1a1a2e' } }
            },
            yAxis: {
                name: 'Calidez', nameTextStyle: { color: '#666' },
                axisLabel: { color: '#666', formatter: '{value}%' },
                splitLine: { lineStyle: { color: '#1a1a2e' } }
            },
            series: [{
                type: 'scatter',
                data: scatterData,
                symbolSize: (data) => data[2] * 8,
                emphasis: {
                    focus: 'series',
                    itemStyle: { shadowBlur: 10, shadowColor: 'rgba(255,255,255,0.5)' }
                },
                label: {
                    show: true, position: 'top', color: '#aaa', fontSize: 8,
                    formatter: (p) => p.data.name
                }
            }]
        }, true);
    },

    /**
     * Gráfico 6: Recomendador visual
     * Calcula similitud de coseno entre vectores de perfil
     * Muestra los perfumes más similares al seleccionado
     */
    updateRecommender(perfume) {
        const v1 = perfume.vectorPerfil;
        const similarity = (a, b) => {
            const dot = a.frescura * b.frescura + a.dulzura * b.dulzura + a.calidez * b.calidez + a.intensidad * b.intensidad;
            const magA = Math.sqrt(a.frescura ** 2 + a.dulzura ** 2 + a.calidez ** 2 + a.intensidad ** 2);
            const magB = Math.sqrt(b.frescura ** 2 + b.dulzura ** 2 + b.calidez ** 2 + b.intensidad ** 2);
            return magA * magB === 0 ? 0 : dot / (magA * magB);
        };

        const scores = PERFUMES
            .filter(p => p.id !== perfume.id)
            .map(p => ({ ...p, simScore: similarity(v1, p.vectorPerfil) }))
            .sort((a, b) => b.simScore - a.simScore)
            .slice(0, 8);

        const names = scores.map(p => p.nombre);
        const simValues = scores.map(p => Math.round(p.simScore * 100));
        const ratingColors = scores.map(p => {
            if (p.simScore > 0.9) return '#4ECB71';
            if (p.simScore > 0.8) return '#FFD700';
            if (p.simScore > 0.7) return '#FF8C00';
            return '#FF6B6B';
        });

        // Bar chart horizontal con detalles
        const barSeriesData = scores.map((p, i) => ({
            value: simValues[i],
            itemStyle: {
                color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                    { offset: 0, color: ratingColors[i] },
                    { offset: 1, color: ratingColors[i] + '88' }
                ])
            }
        }));

        this.charts.recommender.setOption({
            backgroundColor: 'transparent',
            tooltip: {
                trigger: 'axis', axisPointer: { type: 'shadow' },
                formatter: (params) => {
                    const idx = params[0].dataIndex;
                    const p = scores[idx];
                    return `<b>${p.nombre}</b> (${p.marca})<br/>Similitud: ${simValues[idx]}%<br/>Rating: ${p.rating}★<br/>Familia: ${p.familia}<br/>Género: ${p.genero}`;
                }
            },
            grid: { top: 10, bottom: 10, left: 110, right: 40 },
            xAxis: { type: 'value', max: 100, axisLabel: { color: '#666', formatter: '{value}%' }, splitLine: { lineStyle: { color: '#1a1a2e' } } },
            yAxis: {
                type: 'category', data: names.reverse(),
                axisLabel: { color: '#ccc', fontSize: 10 },
                axisLine: { show: false }, axisTick: { show: false }
            },
            series: [{
                type: 'bar', data: barSeriesData.reverse(), barWidth: 16,
                label: {
                    show: true, position: 'right', color: '#ccc', fontSize: 10,
                    formatter: '{c}%'
                },
                itemStyle: { borderRadius: [0, 4, 4, 0] }
            }],
            graphic: scores.map((p, i) => ({
                type: 'text',
                left: names.length > 0 ? undefined : 0,
                right: 8,
                top: 15 + i * 32,
                style: { text: `${p.rating}★`, fill: '#8888aa', fontSize: 10 }
            }))
        }, true);

        // Click en barra para cambiar perfume
        this.charts.recommender.off('click');
        this.charts.recommender.on('click', (params) => {
            const idx = names.length - 1 - params.dataIndex;
            const recommended = scores[idx];
            if (recommended) {
                window.selectPerfume && window.selectPerfume(recommended.id);
            }
        });
    },

    /**
     * Redimensiona todos los gráficos
     */
    resize() {
        Object.values(this.charts).forEach(c => c.resize());
    }
};
