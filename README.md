# Al Furqan Engineer's website

Six static pages, hosted free on the existing GitHub Pages repository. No npm dependencies, paid hosting, database or form service required.

## Edit the website
1. Edit `site-config.json` for company details, navigation, page copy, services, projects, image sources, colors and the organization chart.
2. Run `python3 build.py` from this directory. This regenerates the six HTML pages, site-config.js, brand.css, logos, sitemap and robots file.
3. Preview with `python3 -m http.server 8765` and open http://localhost:8765.
4. Upload all generated files, styles.css and app.js to the root of the existing GitHub repository on main. Keep CNAME set to alfurqanengineers.com. GitHub Pages deploys automatically.

Layout/templates live in build.py; responsive styles in styles.css; navigation, filtering, galleries and enquiry draft interactions in app.js. Text in the config is escaped. The static HTML remains readable without JavaScript.

## Replace placeholders
- company.established, statistics marked XX+, project locations/details/dates, credentials and PEC category.
- company.email: replace info@yourdomain.com and set emailIsPlaceholder to false. Update the contact placeholder notice accordingly.
- company.whatsapp: an international mobile number, not the office landline. Empty disables the WhatsApp button.
- company.hours: confirmed office hours.
- Original project photographs should replace representative stock images in images; update their alt text/source/credit and photo labels.

The contact form validates required fields and builds a mailto draft with a copy fallback. It does not send or store enquiries. The visitor must open their email app and send. A configured email app and real recipient are needed. Phone and directions links are live. No email mailbox is created by GitHub Pages.

## Organization chart
The organogram object in site-config.json controls both the desktop chart and mobile expandable tree. showNames can hide personal names while retaining roles. The top two managers are peers. Solid blue means in-house; dashed gold means outsourced.

## Branding and images
The supplied original logo is retained as logo-original.png. logo-clean.png is the transparent background-cleanup output; SVG files embed/crop that bitmap, rather than redraw the logo. Cleanup used imagegen edit mode with the supplied logo: remove the scanned paper background, preserve original emblem, wording, typography, colors and proportions; do not redesign. If a vector master becomes available, replace the logo assets.

Sampled colors: #495FB1 globe blue, #98BBE9 wordmark blue, #D3A55D gold; navy and darker text shades support readable contrast. All palette values are configurable.

Stock photographs are representative and are not claimed as photographs of named company projects. Each image's original Pexels source and photographer credit is recorded under images in site-config.json. License: https://www.pexels.com/license/ (free personal/commercial use under its terms). Photographs currently load from Pexels; Google Maps is an external embedded service.

## Pages
Home: index.html; About and team: about.html; Services: services.html; Projects: projects.html; Clients & Credentials: credentials.html; Contact: contact.html.

Each page has unique SEO metadata and GeneralContractor structured data, along with address and phone in header/footer. robots.txt and sitemap.xml are included. Actual company registrations, client approvals, project scope and certifications must be confirmed before replacing placeholders.

## Company project photos (September 2026)
Five supplied photos are hosted locally as project-*.jpg/webp/jpeg. The roads gallery contains both carpeting photos; the sports complex, LDA office and sewerage galleries use the corresponding supplied image. Jubilee Heights is in Jubilee Town, Lahore. Photo badges and captions distinguish company photos from remaining representative stock.

Latest update: Jubilee Heights uses the company-supplied architectural rendering. Confirmed homepage figures: 1056+ projects and 7+ government departments. Email is alfurqaneng@yahoo.com; mailto enquiries now target this address. The crane image no longer has a logo overlay.

Client logo sources: LDA and Punjab emblem via Wikimedia Commons; WASA Lahore and PHA Lahore via Seeklogo; NHA via Wikipedia; C&W via cnw.punjab.gov.pk/system/files/cwd_lgo.png. Official organization links are recorded in site-config.json.
Hero edit: built-in imagegen; prompt: Blur only the small VISION sign on the crane, preserving the photograph. Output: hero-crane-blurred.jpg.
