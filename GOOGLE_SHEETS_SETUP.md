# Google Sheets setup — Naseeb Expedition

## 1. Apps Script kodini yangilang
Google Sheet → **Extensions → Apps Script** → `Code.gs` faylini shu ZIP ichidagi `google-apps-script/Code.gs` bilan to'liq almashtiring.

## 2. Web App deploymentni yangilang
**Deploy → Manage deployments → Edit → New version → Deploy**.

Sozlamalar:
- **Execute as:** Me
- **Who has access:** Anyone

Web App URL allaqachon `config.js` ichida:
`https://script.google.com/macros/s/AKfycbxfrv6tiBUYf1DGfIV-PYKeZKL3piL56UqqreIUAJZc9WZGr7vCoDLTob9PmJ0UUaGh/exec`

## 3. Library URL haqida
`https://script.google.com/macros/library/d/12uWQuWOycItqSmUWyf7ZFFr4xrngLScFYFaRwHoMGNUFh24TIzBWkJ9m/1`

Bu URL frontend uchun kerak emas. U boshqa Apps Script projectlarida scriptni library sifatida ulash uchun ishlatiladi. Reference sifatida `config.js`da saqlangan.

## 4. Nima yaxshilandi
Oldingi versiyada `fetch(..., {mode: "no-cors"})` 401 qaytarsa ham browser response statusini ko'ra olmagani uchun sayt success ko'rsatishi mumkin edi. Bu patch `requestId` + JSONP confirmation ishlatadi. Endi Sheetga yozilganini Apps Script tasdiqlamaguncha **“Arizangiz qabul qilindi!”** chiqmaydi.
