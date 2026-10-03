# Google Sheets ulash — Naseeb Expedition

Bu patch quyidagi Google Sheet'ga yozish uchun tayyorlangan:

`https://docs.google.com/spreadsheets/d/122cukOMkN-0LARNjvEJlfZNQkCy-W2enMpXD_Bv8T_I/edit`

Ma'lumotlar shu workbook ichida avtomatik yaratiladigan **Registrations** tabiga tushadi.

## 1. Apps Script oching

Google Sheet'ni oching → **Extensions → Apps Script**.

## 2. Backend kodini qo'ying

Apps Script ichidagi eski kodni o'chirib, ushbu ZIP ichidagi:

`google-apps-script/Code.gs`

faylini to'liq copy-paste qiling va Save bosing.

## 3. Web App qilib deploy qiling

**Deploy → New deployment → Web app**

- Execute as: **Me**
- Who has access: **Anyone**

Deploy qiling va berilgan URL'ni nusxalang. URL odatda `/exec` bilan tugaydi.

## 4. URL'ni saytga qo'ying

Root'dagi `config.js` ni oching:

```js
window.NASEEB_SHEETS_ENDPOINT = "";
```

ichiga `/exec` URL'ni qo'ying, masalan:

```js
window.NASEEB_SHEETS_ENDPOINT = "https://script.google.com/macros/s/XXXXX/exec";
```

Shundan keyin saytni deploy qiling.

## Sheet ustunlari

Patch quyidagilarni saqlaydi:

- Submitted at (Tashkent)
- Name
- Phone
- Age
- Gender
- Plan
- Students
- Telegram
- Referral
- Language
- Source

`Registrations` tab mavjud bo'lmasa, birinchi arizada avtomatik yaratiladi.


## Current deployment
The project is already configured to use:

`https://script.google.com/macros/s/AKfycbxfrv6tiBUYf1DGfIV-PYKeZKL3piL56UqqreIUAJZc9WZGr7vCoDLTob9PmJ0UUaGh/exec`
