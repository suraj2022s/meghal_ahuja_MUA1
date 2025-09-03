# Meghal Ahuja • MUA — CMS Site

Fully responsive static site with **Decap CMS** for no-code editing.

## Edit without code
- Go to: `/admin` (e.g., https://YOUR-SITE.netlify.app/admin)
- Login via Netlify Identity (email link). Then you can:
  - Upload gallery images and videos
  - Edit services & prices
  - Add tutorials (YouTube or upload MP4)
  - Update products, testimonials, FAQ, press logos
  - Change business info & WhatsApp number

## One-time Netlify setup
1) Deploy the site on Netlify (from GitHub).
2) **Enable Identity:** Site Settings → Identity → Enable.
3) **Invite user(s):** Identity → Invite users (email of admin/editor).
4) **Enable Git Gateway:** Identity → Services → Git Gateway → Enable.
5) Visit `/admin` and log in with the invited email.

## Where uploads go
- Media uploads are stored under `assets/uploads/` and linked inside JSON in `content/`.

## No-code content structure (all edited from Admin)
- `content/settings.json` — Business name, WhatsApp, email, tagline, hours, hero image
- `content/services.json` — Services & pricing
- `content/gallery.json` — Portfolio images
- `content/students.json` — Student work cards
- `content/tutorials.json` — Tutorials (YouTube URL OR uploaded MP4)
- `content/tips.json` — Tips list
- `content/products.json` — Products you use (+ buy links)
- `content/testimonials.json` — Client Love
- `content/faq.json` — FAQ
- `content/press.json` — Press logos
