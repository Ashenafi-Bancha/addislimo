# Client brief → site mapping

Source: **"Addis limo service"**, 5-page Canva PDF supplied by the client
(created 14 Aug 2026). Every heading and list item in that document is
accounted for below, with the file that now owns it.

## Page 1 — Cover

| Document | Where it lives |
| --- | --- |
| "Addis limo service" | Brand name, `frontend/src/config/site.ts` |
| "Experince the capital city of africa in class" | `site.slogan` — spelling corrected to "Experience the capital city of Africa in class." Used as the home hero headline and in the footer |

## Page 2 — Airport transfer, City tour, Summit, Expats

All four lists are rendered as **tabs** (as the document asks: "list … with tab")
in the "Where We Take You" section of the Airport Transfer page. Data:
`frontend/src/data/airport.ts` → `airportDestinationGroups`.

| Document heading | Items | Tab |
| --- | --- | --- |
| Airport transfer hotel/Airbnb | Sheraton, Hilton, Hyatt, Continental, Skylight, Ramada, Best Western | Hotels & Airbnb |
| City tour | Bole Main Road, Bole Edna Mall Road, Kazanchis, 4 Kilo Bet Mengist, Piassa Adwa, Mexico Bank Skyscrapers | City Tour |
| Summit | African Union HQ, ECA Conference Center, Addis International Convention Center, UNECA Conference Center | Summit |
| EXpats | Bole, Wello Sefer, Old Airport Sarbet, Kazanchis, CMC | Expats |

The same four also appear as service cards on the Services page
(`frontend/src/data/service-catalog.ts`) and in the booking wizard
(`frontend/src/features/booking/booking.data.ts`).

## Page 3 — Executive & Corporate, Museums, Parks

| Document heading | Where it lives |
| --- | --- |
| Executive & Corporate Services / Corporate & Executive Travel | The Corporate page, plus a Services card. Summit venues in `data/corporate.ts` already match the document's list |
| Museum & Historical Landmark Tours — 18 entries | Explore Addis, "Museums & Landmarks" tab |
| Park — 5 entries | Explore Addis, "Parks" tab |

## Pages 4–5 — Tour categories

All ten categories are tabs on the Explore Addis page. Data:
`frontend/src/data/destinations.ts`.

| Document heading | Entries | Tab label |
| --- | --- | --- |
| Museum & Historical Landmark Tours | 18 | Museums & Landmarks |
| Park | 5 | Parks |
| Hiking | 7 | Hiking |
| Authentic Shopping | 5 | Authentic Shopping |
| Family activities | 5 | Family Activities |
| Malls | 4 | Malls |
| Architecture | 5 | Architecture |
| Entertaiment | 5 | Entertainment |
| cultural restaurant | 6 | Cultural Restaurants |
| Food and drink | 9 | Food & Drink |

**69 destinations total.**

## Page 5 — "other service"

Each is its own card on the Services page and its own option in the booking
wizard. The document lists Wedding and prom separately, so they are two
services, not one "Weddings & Events" entry.

| Document | Service card |
| --- | --- |
| Point-to-Point City Transfers — "direct transport from one specific meeting or location to another within the city" | Point-to-Point City Transfers |
| Hourly Service — "driver at their disposal for an entire day or specific hours" | Hourly Service |
| Diplomatic & Embassy Transport | Diplomatic & Embassy Transport |
| Wedding | Wedding |
| prom | Prom |

## Judgement calls

Things the document did not settle, decided here and easy to change:

- **Spelling and capitalisation** are normalised for display ("Experince" →
  "Experience", "continetal" → "Continental Hotel", "Entertaiment" →
  "Entertainment", "triniy church" → "Holy Trinity Cathedral", "abrhot
  library" → "Abrehot Library"). The raw text is preserved in this document.
- **Descriptions** for the 69 destinations were written for the site — the
  client supplied names only. Worth a review pass with them.
- **Photography** is still placeholder Unsplash imagery, assigned per category
  via `imagePool` in `data/destinations.ts`. Real photos should be keyed by
  destination name.
- **"Gullele Botanical Garden"** appears under both Park and Hiking in the
  document, and **"Entoto Mountain & Entoto Park"** under both Park and
  Hiking. Both are listed in both tabs, as the document has them.
- **"totot cultural resturant"** appears under both Entertainment and cultural
  restaurant; kept in both.
- **Museum and Architecture overlap** — Holy Trinity, ZOMA and the
  Ethnological Museum appear in both lists in the document, and in both tabs
  here.
