# LOGOPRAX — web sajt

Statički sajt (HTML + CSS + JS). **Nema build koraka, nema `npm install`, nema Next.js-a**, pa nema ni grešaka pri buildu. Šta je u folderu, to se objavljuje.

```
index.html                 ← početna (MORA biti u korijenu repozitorija)
tomatis.html               ← stranica usluge (šablon za ostale usluge)
politika-privatnosti.html
404.html
assets/css/style.css
assets/js/main.js          ← ovdje se podešava forma (CONFIG na vrhu)
assets/img/…               ← sve slike, imena malim slovima, bez razmaka
favicon.png, apple-touch-icon.png
robots.txt, sitemap.xml
.nojekyll                  ← isključuje Jekyll na GitHub Pages (ne brisati)
```

Sve putanje su **relativne** (`assets/...`, ne `/assets/...`), pa sajt radi i na
`korisnik.github.io/ime-repoa/` i na vlastitom domenu.

---

## Objava na GitHub Pages (bez problema)

1. Napravi novi **public** repozitorij na GitHub-u (npr. `logoprax`).
2. **Raspakuj ZIP na računaru.** Ne uploaduj sam ZIP, nego njegov sadržaj.
3. U repozitoriju klikni **Add file → Upload files** i prevuci **sadržaj foldera
   `logoprax-site`** (fajlove i folder `assets`), **ne sam folder**.
   `index.html` mora biti odmah na prvom nivou repozitorija.
   > Fajl `.nojekyll` je skriven na Windowsu/macOS-u. Ako ga ne vidiš: u repou
   > klikni *Add file → Create new file*, nazovi ga `.nojekyll`, ostavi prazan, *Commit*.
4. **Commit changes**.
5. **Settings → Pages → Build and deployment → Source: Deploy from a branch →
   Branch: `main` / `(root)` → Save.**
6. Sačekaj 1–2 minuta i otvori link koji GitHub prikaže.

### Najčešći problemi i rješenja
| Problem | Uzrok | Rješenje |
|---|---|---|
| 404 na glavnom linku | `index.html` je u podfolderu | premjesti sadržaj u korijen repoa |
| Stranica bez stila/slika | uploadovan folder umjesto sadržaja, ili pogrešna velika/mala slova | sadržaj u korijen; imena ne mijenjati |
| Ništa se ne mijenja | keš | Ctrl+F5, ili sačekaj 1–2 min nakon commita |
| Pages traži „workflow" | izabran *GitHub Actions* | izaberi *Deploy from a branch* |

> Alternativa bez Git-a: **Netlify Drop** (app.netlify.com/drop) — samo prevuci
> folder `logoprax-site` u prozor i sajt je online za par sekundi.

---

## Prije objave — 3 stvari

### 1) Domen
U fajlovima `index.html`, `tomatis.html`, `politika-privatnosti.html`, `robots.txt`
i `sitemap.xml` zamijeni **`https://www.vas-domen.ba`** pravim domenom
(Find & Replace u cijelom folderu). Ako koristite vlastiti domen na GitHub Pages:
Settings → Pages → Custom domain.

### 2) Forma za zakazivanje (da upiti stižu na email)
Statički hosting ne može sam slati email, pa se koristi besplatni servis **Formspree**:
1. Registracija na formspree.io emailom centra → *New form* → kopiraj adresu,
   npr. `https://formspree.io/f/abcdwxyz`.
2. U `assets/js/main.js`, na vrhu: `formEndpoint: 'https://formspree.io/f/abcdwxyz'`.
3. Pošalji probni upit sa sajta i potvrdi email koji Formspree pošalje.

Dok `formEndpoint` nije podešen, forma provjerava polja, ali umjesto slanja
prikazuje poruku da nas posjetilac pozove telefonom. Ništa se ne gubi tiho.

### 3) Sadržaj za dopuniti (označen sa `[ … — dopuniti]`)
- biografije: Dajana Andrić, Sara Trišić, Đorđe Gospavić
- raspored Tomatis ciklusa (tomatis.html)
- email centra i rok čuvanja podataka (politika-privatnosti.html, preporuka: da pregleda pravnik)
- Google recenzije u `main.js` (niz `T`) zamijeniti originalnim tekstovima roditelja

---

## Izmjene kasnije
- Tekst: otvori `.html` u bilo kom editoru (npr. VS Code) i izmijeni.
- Slika: zamijeni fajl u `assets/img/` **istim imenom**.
- Nova usluga: kopiraj `tomatis.html`, preimenuj (npr. `senzorna-soba.html`),
  izmijeni tekst i dodaj link u `index.html` i `sitemap.xml`.
