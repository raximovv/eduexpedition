/**
 * Naseeb Expedition registration -> Google Sheets
 * Target spreadsheet:
 * https://docs.google.com/spreadsheets/d/122cukOMkN-0LARNjvEJlfZNQkCy-W2enMpXD_Bv8T_I/edit
 */
const SPREADSHEET_ID = '122cukOMkN-0LARNjvEJlfZNQkCy-W2enMpXD_Bv8T_I';
const SHEET_NAME = 'Registrations';
const TZ = 'Asia/Tashkent';

const HEADERS = [
  'Submitted at (Tashkent)',
  'Name',
  'Phone',
  'Age',
  'Gender',
  'Plan',
  'Students',
  'Telegram',
  'Referral',
  'Language',
  'Source'
];

function doGet() {
  return json_({ ok: true, service: 'Naseeb Expedition registrations' });
}

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);

  try {
    const payload = parsePayload_(e);
    validate_(payload);

    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    let sheet = ss.getSheetByName(SHEET_NAME);
    if (!sheet) sheet = ss.insertSheet(SHEET_NAME);

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
      safe_(payload.lang || ''),
      safe_(payload.source || '')
    ];

    const nextRow = sheet.getLastRow() + 1;
    sheet.getRange(nextRow, 1, 1, row.length).setValues([row]);

    return json_({ ok: true });
  } catch (err) {
    console.error(err);
    return json_({ ok: false, error: String(err && err.message ? err.message : err) });
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

function json_(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
