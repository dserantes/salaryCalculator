// ── TRAMOS FISCALES 2025 ──────────────────────────────────────────────────────

const TRAMOS_ESTATAL = [
  { hasta: 12450,    tipo: 0.095 },
  { hasta: 20200,    tipo: 0.12  },
  { hasta: 35200,    tipo: 0.15  },
  { hasta: 60000,    tipo: 0.185 },
  { hasta: 300000,   tipo: 0.225 },
  { hasta: Infinity, tipo: 0.245 }
];

const TRAMOS_CCAA = {
  andalucia:          [{ hasta:13000,tipo:0.095},{hasta:21100,tipo:0.12},{hasta:35200,tipo:0.15},{hasta:60000,tipo:0.185},{hasta:Infinity,tipo:0.225}],
  aragon:             [{ hasta:12450,tipo:0.095},{hasta:20200,tipo:0.12},{hasta:35200,tipo:0.16},{hasta:60000,tipo:0.20},{hasta:80000,tipo:0.23},{hasta:Infinity,tipo:0.255}],
  asturias:           [{ hasta:12450,tipo:0.10},{hasta:17707,tipo:0.12},{hasta:33007,tipo:0.14},{hasta:53407,tipo:0.185},{hasta:70000,tipo:0.215},{hasta:90000,tipo:0.235},{hasta:Infinity,tipo:0.255}],
  baleares:           [{ hasta:10000,tipo:0.09},{hasta:18000,tipo:0.115},{hasta:30000,tipo:0.14},{hasta:50000,tipo:0.175},{hasta:70000,tipo:0.195},{hasta:100000,tipo:0.22},{hasta:Infinity,tipo:0.245}],
  canarias:           [{ hasta:12450,tipo:0.09},{hasta:17707,tipo:0.115},{hasta:33007,tipo:0.145},{hasta:53407,tipo:0.185},{hasta:Infinity,tipo:0.235}],
  cantabria:          [{ hasta:13000,tipo:0.085},{hasta:21000,tipo:0.11},{hasta:35200,tipo:0.145},{hasta:60000,tipo:0.18},{hasta:90000,tipo:0.225},{hasta:Infinity,tipo:0.245}],
  castilla_la_mancha: [{ hasta:12450,tipo:0.095},{hasta:20200,tipo:0.12},{hasta:35200,tipo:0.15},{hasta:60000,tipo:0.185},{hasta:Infinity,tipo:0.225}],
  castilla_leon:      [{ hasta:12450,tipo:0.09},{hasta:20200,tipo:0.12},{hasta:35200,tipo:0.14},{hasta:60000,tipo:0.185},{hasta:Infinity,tipo:0.215}],
  cataluna:           [{ hasta:12450,tipo:0.105},{hasta:17707,tipo:0.12},{hasta:21000,tipo:0.14},{hasta:33007,tipo:0.155},{hasta:53407,tipo:0.185},{hasta:90000,tipo:0.215},{hasta:120000,tipo:0.235},{hasta:Infinity,tipo:0.255}],
  extremadura:        [{ hasta:12450,tipo:0.08},{hasta:20200,tipo:0.10},{hasta:24200,tipo:0.16},{hasta:35200,tipo:0.175},{hasta:60000,tipo:0.21},{hasta:80200,tipo:0.235},{hasta:99200,tipo:0.24},{hasta:120200,tipo:0.245},{hasta:Infinity,tipo:0.25}],
  galicia:            [{ hasta:12985,tipo:0.09},{hasta:21068,tipo:0.1165},{hasta:35200,tipo:0.149},{hasta:47600,tipo:0.184},{hasta:Infinity,tipo:0.225}],
  madrid:             [{ hasta:12450,tipo:0.09},{hasta:17707,tipo:0.112},{hasta:33007,tipo:0.136},{hasta:53407,tipo:0.178},{hasta:Infinity,tipo:0.205}],
  murcia:             [{ hasta:12450,tipo:0.095},{hasta:20200,tipo:0.112},{hasta:34000,tipo:0.133},{hasta:60000,tipo:0.179},{hasta:Infinity,tipo:0.225}],
  navarra:            [{ hasta:6500,tipo:0.0},{hasta:12500,tipo:0.13},{hasta:19800,tipo:0.24},{hasta:26400,tipo:0.30},{hasta:33400,tipo:0.34},{hasta:50000,tipo:0.38},{hasta:66600,tipo:0.43},{hasta:Infinity,tipo:0.52}],
  pais_vasco:         [{ hasta:17720,tipo:0.23},{hasta:35440,tipo:0.28},{hasta:53160,tipo:0.35},{hasta:75910,tipo:0.40},{hasta:105130,tipo:0.45},{hasta:Infinity,tipo:0.47}],
  la_rioja:           [{ hasta:12450,tipo:0.08},{hasta:20200,tipo:0.106},{hasta:35200,tipo:0.136},{hasta:40000,tipo:0.178},{hasta:50000,tipo:0.183},{hasta:60000,tipo:0.19},{hasta:Infinity,tipo:0.245}],
  valencia:           [{ hasta:12000,tipo:0.09},{hasta:22000,tipo:0.12},{hasta:32000,tipo:0.15},{hasta:42000,tipo:0.175},{hasta:52000,tipo:0.20},{hasta:65000,tipo:0.225},{hasta:72000,tipo:0.25},{hasta:100000,tipo:0.265},{hasta:150000,tipo:0.275},{hasta:200000,tipo:0.285},{hasta:Infinity,tipo:0.295}]
};

// ── HELPERS ───────────────────────────────────────────────────────────────────

const SS_PCT = 0.0648;
const MIN_PERSONAL = 5550;

function calcCuotaConTramos(base, tramos) {
  let cuota = 0, prev = 0;
  for (const t of tramos) {
    if (base <= prev) break;
    cuota += (Math.min(base, t.hasta) - prev) * t.tipo;
    prev = t.hasta;
  }
  return cuota;
}

function calcIRPFTotal(base, ccaa) {
  const forales = ['navarra', 'pais_vasco'];
  const aut = TRAMOS_CCAA[ccaa] || TRAMOS_CCAA['castilla_la_mancha'];
  if (forales.includes(ccaa)) return calcCuotaConTramos(base, aut);
  return calcCuotaConTramos(base, TRAMOS_ESTATAL) + calcCuotaConTramos(base, aut);
}

function tipoMarginal(base, ccaa) {
  const tramos = TRAMOS_CCAA[ccaa] || TRAMOS_CCAA['castilla_la_mancha'];
  for (const t of tramos) { if (base <= t.hasta) return t.tipo; }
  return 0.295;
}

function fmt(n)    { return n.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' €'; }
function fmtPct(n) { return (n * 100).toFixed(2) + '%'; }
function row(label, value, cls = '') {
  return `<div class="result-row ${cls}"><span>${label}</span><span>${value}</span></div>`;
}

// ── UI ────────────────────────────────────────────────────────────────────────

function switchTab(id, el) {
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
  el.classList.add('active');
  document.getElementById('panel-' + id).classList.add('active');
}

// ── NÓMINA ────────────────────────────────────────────────────────────────────

function calcNomina() {
  const brutoAnual = parseFloat(document.getElementById('n-bruto').value);
  const pagas      = parseInt(document.getElementById('n-pagas').value);
  const ccaa       = document.getElementById('n-ccaa').value;
  const ssAnual    = brutoAnual * SS_PCT;
  const baseIRPF   = Math.max(0, brutoAnual - ssAnual - MIN_PERSONAL);
  const cuotaIRPF  = calcIRPFTotal(baseIRPF, ccaa);
  const pctIRPF    = brutoAnual > 0 ? cuotaIRPF / brutoAnual : 0;
  const netoAnual  = brutoAnual - ssAnual - cuotaIRPF;

  document.getElementById('nomina-results').innerHTML =
    row('Bruto anual', fmt(brutoAnual)) +
    row(`Bruto mensual (${pagas} pagas)`, fmt(brutoAnual / pagas)) +
    row('Cotización SS trabajador/año', fmt(ssAnual), 'red') +
    row('IRPF retenido/año', fmt(cuotaIRPF), 'red') +
    row('% IRPF efectivo', fmtPct(pctIRPF), 'red') +
    row('Neto anual', fmt(netoAnual), 'green') +
    row('Neto mensual', fmt(netoAnual / pagas), 'big');
}

// ── IRPF RÁPIDO ───────────────────────────────────────────────────────────────

function calcIRPF() {
  const bruto  = parseFloat(document.getElementById('irpf-bruto').value);
  const minimo = parseFloat(document.getElementById('irpf-minimo').value);
  const ccaa   = document.getElementById('irpf-ccaa').value;
  const ss     = bruto * SS_PCT;
  const base   = Math.max(0, bruto - ss - minimo);
  const cuota  = calcIRPFTotal(base, ccaa);
  const pct    = bruto > 0 ? cuota / bruto : 0;

  document.getElementById('irpf-results').innerHTML =
    row('Base liquidable aprox.', fmt(base)) +
    row('Cuota IRPF anual', fmt(cuota), 'red') +
    row('% retención efectivo', fmtPct(pct), 'red') +
    row('Tipo marginal autonómico', fmtPct(tipoMarginal(base, ccaa)));
}

// ── JUBILACIÓN ────────────────────────────────────────────────────────────────

function calcJubilacion() {
  const edadActual    = parseInt(document.getElementById('j-edad').value);
  const bruto         = parseFloat(document.getElementById('j-bruto').value);
  const cotizadosHoy  = parseInt(document.getElementById('j-cotizados').value);
  const crecimiento   = parseFloat(document.getElementById('j-crecimiento').value) / 100;
  const edadJub       = parseInt(document.getElementById('j-edad-jub').value);
  const aniosFaltantes = edadJub - edadActual;
  const aniosTotales  = cotizadosHoy + aniosFaltantes;
  const meses         = aniosTotales * 12;
  let pctPension = meses <= 180 ? (meses / 180) * 0.5 : 0.5 + (meses - 180) * 0.0019;
  pctPension = Math.min(pctPension, 1.0);
  const salarioFinal    = bruto * Math.pow(1 + crecimiento, aniosFaltantes);
  const baseReguladora  = salarioFinal * 0.9;
  const pension         = Math.min(baseReguladora * pctPension / 12, 3267);

  document.getElementById('jub-results').innerHTML =
    row('Años restantes para jubilarte', aniosFaltantes + ' años') +
    row('Total años cotizados estimados', aniosTotales + ' años') +
    row('Salario estimado en jubilación', fmt(salarioFinal)) +
    row('% pensión aplicado', fmtPct(pctPension)) +
    row('Base reguladora aprox.', fmt(baseReguladora)) +
    row('Pensión mensual bruta estimada', fmt(pension), 'big') +
    `<div class="info-box">⚠️ Estimación orientativa. El cálculo real depende de lagunas, coeficientes y normativa vigente al jubilarte.</div>`;
}

// ── FINIQUITO ─────────────────────────────────────────────────────────────────

function calcFiniquito() {
  const mensual    = parseFloat(document.getElementById('f-mensual').value);
  const diasTrab   = parseInt(document.getElementById('f-dias').value);
  const vacaciones = parseInt(document.getElementById('f-vacaciones').value);
  const pagas      = parseInt(document.getElementById('f-pagas').value);
  const meses      = parseInt(document.getElementById('f-meses').value);
  const diasIndem  = parseInt(document.getElementById('f-tipo').value);
  const anios      = parseInt(document.getElementById('f-anios').value);
  const irpfPct    = parseFloat(document.getElementById('f-irpf').value) / 100;
  const diario     = mensual / 30;
  const salPendiente  = diario * diasTrab;
  const vacPendientes = diario * vacaciones;
  const pagasExtra    = (mensual * pagas) / 12 * meses;
  const indemnizacion = diasIndem > 0 ? diario * diasIndem * anios : 0;
  const totalBruto    = salPendiente + vacPendientes + pagasExtra + indemnizacion;
  const baseIRPF      = totalBruto - (diasIndem >= 20 ? indemnizacion : 0);
  const irpfTotal     = baseIRPF * irpfPct;
  const ss            = (salPendiente + vacPendientes + pagasExtra) * SS_PCT;

  document.getElementById('fin-results').innerHTML =
    row('Salario días pendientes', fmt(salPendiente)) +
    row('Vacaciones no disfrutadas', fmt(vacPendientes)) +
    row('Prorrata pagas extra', fmt(pagasExtra)) +
    row('Indemnización', fmt(indemnizacion), diasIndem > 0 ? 'green' : '') +
    row('Total bruto finiquito', fmt(totalBruto)) +
    row('IRPF retenido', fmt(irpfTotal), 'red') +
    row('Cotización SS', fmt(ss), 'red') +
    row('Total neto a cobrar', fmt(totalBruto - irpfTotal - ss), 'big') +
    `<div class="info-box">💡 La indemnización por despido improcedente está <b>exenta de IRPF</b> hasta el límite legal.</div>`;
}

// ── BONUS ─────────────────────────────────────────────────────────────────────

function calcBonus() {
  const bruto       = parseFloat(document.getElementById('b-bruto').value);
  const pct         = parseFloat(document.getElementById('b-pct').value) / 100;
  const consecucion = parseFloat(document.getElementById('b-consecucion').value) / 100;
  const irpfPct     = parseFloat(document.getElementById('b-irpf').value) / 100;
  const acumulado   = document.getElementById('b-acumulado').value === 'yes';
  const bonusBruto  = bruto * pct * consecucion;
  let irpfAplicado  = irpfPct;
  if (acumulado) {
    const baseConBonus  = Math.max(0, (bruto + bonusBruto) * (1 - SS_PCT) - MIN_PERSONAL);
    const baseSinBonus  = Math.max(0, bruto * (1 - SS_PCT) - MIN_PERSONAL);
    const ccaa = document.getElementById('n-ccaa')?.value || 'castilla_la_mancha';
    irpfAplicado = bonusBruto > 0
      ? (calcIRPFTotal(baseConBonus, ccaa) - calcIRPFTotal(baseSinBonus, ccaa)) / bonusBruto
      : 0;
  }
  const ssBonus   = bonusBruto * SS_PCT;
  const irpfBonus = bonusBruto * irpfAplicado;

  document.getElementById('bonus-results').innerHTML =
    row('Bonus bruto objetivo', fmt(bruto * pct)) +
    row('% consecución aplicado', (consecucion * 100).toFixed(0) + '%') +
    row('Bonus bruto real', fmt(bonusBruto)) +
    row('SS trabajador sobre bonus', fmt(ssBonus), 'red') +
    row(`IRPF sobre bonus (${fmtPct(irpfAplicado)})`, fmt(irpfBonus), 'red') +
    row('Bonus neto a cobrar', fmt(bonusBruto - irpfBonus - ssBonus), 'big');
}

// ── TICKET RESTAURANTE ────────────────────────────────────────────────────────

function calcTicket() {
  const dias         = parseInt(document.getElementById('t-dias').value);
  const importe      = Math.min(parseFloat(document.getElementById('t-importe').value), 11);
  const bruto        = parseFloat(document.getElementById('t-bruto').value);
  const irpfMarginal = parseFloat(document.getElementById('t-irpf').value) / 100;
  const ticketAnual  = dias * importe * 11;
  const ahorroIRPF   = ticketAnual * irpfMarginal;
  const ahorroSS     = ticketAnual * SS_PCT;

  document.getElementById('ticket-results').innerHTML =
    row('Ticket/día (máx. 11€ exento)', fmt(importe)) +
    row('Ticket mensual', fmt(dias * importe)) +
    row('Ticket anual estimado (11 meses)', fmt(ticketAnual), 'green') +
    row('Ahorro IRPF anual', fmt(ahorroIRPF), 'green') +
    row('Ahorro SS anual', fmt(ahorroSS), 'green') +
    row('Ahorro fiscal total anual', fmt(ahorroIRPF + ahorroSS), 'big') +
    row('Salario real equivalente', fmt(bruto + ticketAnual)) +
    `<div class="info-box">💡 Exento de IRPF y SS hasta <b>11€/día laborable</b>. Equivale a salario bruto sin tributar.</div>`;
}

// ── MULTI-EMPRESA ─────────────────────────────────────────────────────────────

let numEmpresas = 2;

function addEmpresa() {
  numEmpresas++;
  const div = document.createElement('div');
  div.className = 'empresa-bloque';
  div.innerHTML = `
    <label>Empresa ${numEmpresas} — Bruto percibido (€)</label>
    <input type="number" class="emp-bruto" placeholder="10000">
    <label>IRPF retenido por esa empresa (%)</label>
    <input type="number" class="emp-irpf" placeholder="10">`;
  document.getElementById('empresas-container').appendChild(div);
}

function calcMultiEmpresa() {
  const brutos       = [...document.querySelectorAll('.emp-bruto')].map(e => parseFloat(e.value) || 0);
  const irpfs        = [...document.querySelectorAll('.emp-irpf')].map(e => parseFloat(e.value) / 100 || 0);
  const minimo       = parseFloat(document.getElementById('me-minimo').value);
  const ccaa         = document.getElementById('me-ccaa').value;
  const brutoTotal   = brutos.reduce((a, b) => a + b, 0);
  const yaRetenido   = brutos.reduce((sum, b, i) => sum + b * irpfs[i], 0);
  const base         = Math.max(0, brutoTotal * (1 - SS_PCT) - minimo);
  const cuotaDebida  = calcIRPFTotal(base, ccaa);
  const diferencia   = cuotaDebida - yaRetenido;
  const pctOptimo    = brutoTotal > 0 ? cuotaDebida / brutoTotal : 0;
  const estadoHtml   = Math.abs(diferencia) < 50
    ? row('Estado', '✅ Saldrás a 0 (±50€)', 'green')
    : diferencia > 0
      ? row('Estado', `⚠️ Saldrás a PAGAR ${fmt(diferencia)}`, 'red')
      : row('Estado', `💰 Te devolverán ${fmt(Math.abs(diferencia))}`, 'green');

  document.getElementById('me-results').innerHTML =
    row('Bruto total percibido', fmt(brutoTotal)) +
    row('IRPF ya retenido', fmt(yaRetenido)) +
    row('IRPF que debería retener Hacienda', fmt(cuotaDebida)) +
    row('Diferencia', fmt(diferencia), diferencia > 0 ? 'red' : 'green') +
    estadoHtml +
    row('% retención correcto sobre total', fmtPct(pctOptimo)) +
    `<div class="info-box">💡 Solicita a tu empresa principal el <b>${fmtPct(pctOptimo)} de IRPF</b> comunicando tus otros ingresos en el <b>Modelo 145</b>.</div>`;
}