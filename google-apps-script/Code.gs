/**
 * Naseeb Expedition registration -> Google Sheets
 * Target spreadsheet:
 * https://docs.google.com/spreadsheets/d/1oYMmhJp1YqpAKUK60VvgIWFEiWYhn4MnH09O5iIt5Zk/edit
 */
const SPREADSHEET_ID = '1oYMmhJp1YqpAKUK60VvgIWFEiWYhn4MnH09O5iIt5Zk';
const SHEET_GID = 0; // first tab: .../edit#gid=0
const TZ = 'Asia/Tashkent';

// Same as the sheet's header row. Holat and Izoh are left empty for curators.
const HEADERS = [
  'Sana va vaqt',
  'Ism Familiya',
  'Telefon',
  'Yoshi',
  'Jinsi',
  'Reja',
  'Bolalar soni',
  'Telegram',
  'Kim tavsiya qildi',
  'Sayt tili',
  'Holat',
  'Izoh'
];

function doGet(e) {
  const p = (e && e.parameter) || {};
  if (p.action === 'status') {
    const requestId = String(p.requestId || '').trim();
    const status = requestId ? CacheService.getScriptCache().get('reg:' + requestId) : null;
    return respond_({ ok: status === 'ok', status: status || 'pending' }, p.callback);
  }
  return respond_({ ok: true, service: 'Naseeb Expedition registrations' }, p.callback);
}

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);

  try {
    const payload = parsePayload_(e);
    validate_(payload);

    const requestId = String(payload.requestId || '').trim();
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = ss.getSheets().find(s => s.getSheetId() === SHEET_GID);
    if (!sheet) throw new Error('Sheet tab gid=' + SHEET_GID + ' not found');

    ensureHeaders_(sheet);

    const row = [
      Utilities.formatDate(new Date(), TZ, 'yyyy-MM-dd HH:mm:ss'),
      safe_(payload.name),
      safe_(payload.phone),
      safe_(payload.age),
      safe_(payload.gender),
      safe_(payload.plan),
      safe_(payload.kids),
      safe_(payload.telegram || ''),
      safe_(payload.referral || ''),
      safe_(payload.lang || '')
    ];

    const nextRow = sheet.getLastRow() + 1;
    sheet.getRange(nextRow, 1, 1, row.length).setValues([row]);
    // Commit inside try: otherwise the write lands after it, so errors escape as HTML
    // and 'ok' is cached for a row that was never saved.
    SpreadsheetApp.flush();

    if (requestId) CacheService.getScriptCache().put('reg:' + requestId, 'ok', 600);
    return respond_({ ok: true, requestId: requestId });
  } catch (err) {
    console.error(err);
    return respond_({ ok: false, error: String(err && err.message ? err.message : err) });
  } finally {
    lock.releaseLock();
  }
}

function parsePayload_(e) {
  if (!e || !e.postData || !e.postData.contents) {
    throw new Error('Empty request body');
  }

  try {
    return JSON.parse(e.postData.contents);
  } catch (_) {
    return e.parameter || {};
  }
}

function validate_(p) {
  if (!p || String(p.name || '').trim().length < 3) throw new Error('Invalid name');
  if (!String(p.phone || '').trim()) throw new Error('Invalid phone');
  if (!String(p.age || '').trim()) throw new Error('Invalid age');
  if (!String(p.gender || '').trim()) throw new Error('Invalid gender');
  if (!String(p.plan || '').trim()) throw new Error('Invalid plan');
}

function ensureHeaders_(sheet) {
  const current = sheet.getRange(1, 1, 1, HEADERS.length).getDisplayValues()[0];
  const empty = current.every(v => !v);
  if (empty) {
    sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]);
    sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold');
    sheet.setFrozenRows(1);
    sheet.autoResizeColumns(1, HEADERS.length);
  }
}

// Prevent values beginning with formula-control characters from being evaluated as formulas.
function safe_(value) {
  const s = String(value == null ? '' : value).trim();
  return /^[=+\-@]/.test(s) ? "'" + s : s;
}

function respond_(obj, callback) {
  const json = JSON.stringify(obj);
  const cb = String(callback || '').trim();
  if (cb && /^[A-Za-z_$][0-9A-Za-z_$]*$/.test(cb)) {
    return ContentService.createTextOutput(cb + '(' + json + ');')
      .setMimeType(ContentService.MimeType.JAVASCRIPT);
  }
  return ContentService.createTextOutput(json)
    .setMimeType(ContentService.MimeType.JSON);
}
