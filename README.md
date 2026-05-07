# Phase Ternary Stack

Static website for the XRD phase workbook.

Open `index.html` in a browser. The page renders five rotatable 3D total-concentration ternary layers, with 36 clickable samples per layer and a right-side phase detail panel. Use the PNG button to export the current rotated view at 4x resolution.

For sharing with other people, upload the whole `phase-ternary-site` folder to a static host such as GitHub Pages, Netlify, Vercel, or an institutional web server. Do not send only `index.html`; the page also needs `styles.css`, `app.js`, and `data/phase-data.js`. Static hosts will provide an `https://` URL automatically.

To refresh the data after editing the workbook:

```powershell
powershell -ExecutionPolicy Bypass -File .\tools\export-phase-data.ps1
```
