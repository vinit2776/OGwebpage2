# onegrid.in analytics: setup and how to use it

## What is set up (13 Oct 2026)

- **GA4 property** (account "heyguru", property id 296128894), web stream **OneGrid**, `https://onegrid.in`, Measurement ID **G-32NS9EMXF7**, matching the tag in `index.html`. Receiving traffic.
- **Event data retention: 14 months** (was the 2-month default).
- **Custom dimensions (event scope):** `cta_location`, `annual_bill_range`, `tier`.
- **Enhanced measurement** on (page views, scrolls, outbound clicks, site search, video, file downloads). Form interactions is off, so the site's own `generate_lead` / `form_submit` are not double-counted.

## Events the site sends

| Event | When | Key parameters |
|---|---|---|
| `bill_email_click` | Visitor clicks any "Email bills" button (the main conversion besides the form) | `cta_location`: hero, sticky_bar, contact_section |
| `generate_lead` | Contact form submitted successfully | `annual_bill_range`, UTM fields |
| `form_submit` | Same moment as `generate_lead` (kept for older reports) | `annual_bill_range` |
| `hero_check_used` | First use of the hero 60-second check | `hero_state`, `hero_connection`, `annual_bill_range` |
| `pricing_calculator_used` | First move of the pricing slider | `annual_spend_lakhs` |
| `pricing_cta_click` | A pricing plan button | `tier` |
| `cta_click` | Any button that scrolls to the contact form | `event_label` |
| `email_click` | Click on a plain hello@onegrid.in link | |
| `outbound_click` | Medium or LinkedIn links | `destination` |
| `insight_click` | "Read on Medium" on an article card | `event_label` |
| `section_viewed` | A section scrolls into view | `section` |
| `phone_click`, `whatsapp_click` | Only once a phone / WhatsApp number is configured | |

## Do this once real traffic has fired the events

GA only lets you star an event after it has been received at least once.

1. Admin, Data display, Events, **Recent events**: star **`bill_email_click`** and **`generate_lead`** as key events. Optionally also `hero_check_used`.
2. Check Reports, Engagement, Events a day after the first campaign click to confirm both appear.

## Campaign links: naming rule

Use UTM parameters on every promotional link so each channel shows up separately in GA. The site also saves them with each form enquiry.

```
https://onegrid.in/?utm_source=<where>&utm_medium=<type>&utm_campaign=<name>&utm_content=<variant>
```

| Channel | utm_source | utm_medium | Example campaign |
|---|---|---|---|
| LinkedIn post / message | linkedin | social | `oct26-bill-analysis` |
| LinkedIn ads | linkedin | paid_social | `oct26-bill-analysis` |
| Google Ads | google | cpc | `oct26-power-factor` |
| Email outreach | email | email | `oct26-pilot-outreach` |
| WhatsApp share | whatsapp | social | `oct26-founder-network` |
| Medium article | medium | referral | `tariff-rate-illusion` |
| Partner / event | the partner or event name | referral | `event-name-2026` |

Rules: lowercase only, hyphens not spaces, one naming style per campaign, never change a live campaign's name (create a new one).

## Reading the results

- **Where do visitors come from:** Reports, Acquisition, Traffic acquisition (set the dimension to Session source / medium or Session campaign).
- **What did each campaign produce:** Explore a free-form report with Session campaign by `bill_email_click` and `generate_lead` counts.
- **Which button works:** `bill_email_click` by `cta_location`.
- **Lead quality:** `generate_lead` by `annual_bill_range`.
- **Where visitors drop off:** `section_viewed` by `section`.

## Still to do (needs you)

1. **Fix the deploy.** The "Deploy to Vercel" job fails with an invalid token, so site changes (including this tracking) are not live. Create a new Vercel token and replace the GitHub Actions secret.
2. **Internal traffic filter.** Admin, Data collection and modification, Data streams, Configure tag settings, Define internal traffic: add your office and home IPs, then activate the filter under Data filters. Otherwise your own testing counts as visitors.
3. **Link Search Console** (Admin, Product links) for organic search queries, and **link Google Ads** when ads start.
4. **Cookie consent.** The site loads GA with no consent banner while the privacy policy says one is still to be described, and the site describes itself as DPDP-compliant. Decide on a banner before large-scale promotion.
5. Account name is "heyguru". Rename it or move the property if you want OneGrid kept separate.
