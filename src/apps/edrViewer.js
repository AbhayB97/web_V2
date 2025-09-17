import { iconChart } from '../icons.js';

const edrData = {
  summary: {
    endpoints: 1284,
    covered: 1211,
    lastSweep: '3 minutes ago',
    anomalies: 2,
  },
  riskTrend: [
    { label: 'Jan', value: 18 },
    { label: 'Feb', value: 26 },
    { label: 'Mar', value: 22 },
    { label: 'Apr', value: 31 },
    { label: 'May', value: 27 },
    { label: 'Jun', value: 19 },
  ],
  coverage: [
    { name: 'Workstations', value: 92 },
    { name: 'Servers', value: 88 },
    { name: 'Cloud Agents', value: 95 },
  ],
  categories: [
    { name: 'Phishing & Social', value: 42 },
    { name: 'Privilege Abuse', value: 28 },
    { name: 'Lateral Movement', value: 21 },
    { name: 'Data Exfiltration', value: 18 },
  ],
};

const formatNumber = (value) => value.toLocaleString();

const createLineChart = (points) => {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('viewBox', '0 0 320 160');
  svg.setAttribute('class', 'edr-chart');

  const max = Math.max(...points.map((p) => p.value));
  const min = Math.min(...points.map((p) => p.value));
  const range = Math.max(max - min, 1);

  const pathPoints = points
    .map((p, idx) => {
      const x = (idx / (points.length - 1 || 1)) * 300 + 10;
      const y = 140 - ((p.value - min) / range) * 120;
      return `${x},${y}`;
    })
    .join(' ');

  const area = document.createElementNS('http://www.w3.org/2000/svg', 'polyline');
  area.setAttribute('points', `10,140 ${pathPoints} 310,140`);
  area.setAttribute('class', 'area');

  const line = document.createElementNS('http://www.w3.org/2000/svg', 'polyline');
  line.setAttribute('points', pathPoints);
  line.setAttribute('class', 'line');

  svg.append(area, line);
  return svg;
};

const createBar = (label, value) => {
  const wrapper = document.createElement('div');
  wrapper.className = 'edr-bar';

  const title = document.createElement('div');
  title.className = 'label';
  title.textContent = label;

  const meter = document.createElement('div');
  meter.className = 'meter';

  const fill = document.createElement('div');
  fill.className = 'fill';
  fill.style.width = `${Math.min(value, 100)}%`;
  fill.textContent = `${value}%`;

  meter.append(fill);
  wrapper.append(title, meter);
  return wrapper;
};

const EdrViewerApp = {
  id: 'edr-viewer',
  title: 'EDR Viewer',
  icon: iconChart,
  render() {
    const root = document.createElement('div');
    root.className = 'edr-viewer';

    const header = document.createElement('header');
    header.innerHTML = '<h1>Endpoint Detection Overview</h1><p>Mock telemetry from the in-house SOC pipeline.</p>';

    const summary = document.createElement('section');
    summary.className = 'edr-summary';
    summary.innerHTML = `
      <div>
        <span class="value">${formatNumber(edrData.summary.covered)}</span>
        <span class="label">Protected endpoints</span>
      </div>
      <div>
        <span class="value">${formatNumber(edrData.summary.endpoints)}</span>
        <span class="label">Known assets</span>
      </div>
      <div>
        <span class="value">${edrData.summary.anomalies}</span>
        <span class="label">Active anomalies</span>
      </div>
      <div>
        <span class="value">${edrData.summary.lastSweep}</span>
        <span class="label">Last sweep</span>
      </div>
    `;

    const trend = document.createElement('section');
    trend.className = 'edr-trend';
    const chart = createLineChart(edrData.riskTrend);
    trend.append(chart);

    const trendLabels = document.createElement('div');
    trendLabels.className = 'edr-trend-labels';
    edrData.riskTrend.forEach((point) => {
      const span = document.createElement('span');
      span.textContent = point.label;
      trendLabels.append(span);
    });
    trend.append(trendLabels);

    const coverage = document.createElement('section');
    coverage.className = 'edr-coverage';
    coverage.innerHTML = '<h2>Coverage Levels</h2>';
    edrData.coverage.forEach((item) => coverage.append(createBar(item.name, item.value)));

    const categories = document.createElement('section');
    categories.className = 'edr-categories';
    categories.innerHTML = '<h2>Top Alert Categories</h2>';
    edrData.categories.forEach((item) => {
      const card = document.createElement('div');
      card.className = 'edr-card';
      card.innerHTML = `<strong>${item.name}</strong><span>${item.value} detections</span>`;
      categories.append(card);
    });

    root.append(header, summary, trend, coverage, categories);
    return root;
  },
};

export default EdrViewerApp;
