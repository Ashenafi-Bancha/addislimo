/**
 * Amharic (አማርኛ) for the public site, keyed by the English source text.
 *
 * How to maintain it:
 *   - The key is the English exactly as it appears in the code or in
 *     `src/data` / `features/cms/content.ts`, punctuation included. Change the
 *     English and the old entry stops matching, so update the key with it.
 *   - A missing entry is not an error: the English shows instead, and in
 *     development the console names the string (`[i18n] No Amharic for ...`).
 *   - `{name}` placeholders are filled by `tf()` and must survive translation.
 *   - Proper names of hotels, venues and businesses are left out on purpose:
 *     visitors and drivers know them by their Latin-script names.
 *   - Content an admin edits in the console replaces the English default, so
 *     it no longer matches a key here and shows as typed.
 *
 * The admin console is staff-facing and stays in English.
 */
export const am: Record<string, string> = {
  /* ── Brand, navigation and page titles ── */
  'Premium Transportation': 'ፕሪሚየም ትራንስፖርት',
  'Experience the capital city of Africa in class.': 'የአፍሪካን ዋና ከተማ በክብር ይጎብኙ።',
  'Addis Ababa': 'አዲስ አበባ',
  Ethiopia: 'ኢትዮጵያ',
  'Addis Ababa, Ethiopia': 'አዲስ አበባ፣ ኢትዮጵያ',
  '+251 (coming soon)': '+251 (በቅርቡ)',
  Home: 'መነሻ',
  Services: 'አገልግሎቶች',
  Airport: 'አውሮፕላን ማረፊያ',
  'Airport Transfer': 'የአውሮፕላን ማረፊያ ትራንስፖርት',
  Corporate: 'ለድርጅቶች',
  'Explore Addis': 'አዲስን ያስሱ',
  'About Us': 'ስለ እኛ',
  About: 'ስለ እኛ',
  Contact: 'ያግኙን',
  'Book Now': 'አሁን ይያዙ',
  'Book a Ride': 'ጉዞ ይያዙ',
  'Booking Confirmed': 'ቦታ ማስያዝ ተረጋግጧል',
  Menu: 'ማውጫ',
  Language: 'ቋንቋ',
  'Back to home page': 'ወደ መነሻ ገጽ ይመለሱ',
  'Back to Home': 'ወደ መነሻ',

  /* ── Quick links ── */
  'Quick Links': 'ፈጣን ማገናኛዎች',
  'Know what you need?': 'የሚፈልጉትን ያውቃሉ?',
  'Go straight there.': 'በቀጥታ ይሂዱ።',
  'Five steps, from service to confirmation.':
    'ከአገልግሎት ምርጫ እስከ ማረጋገጫ፣ በአምስት ደረጃዎች።',
  'Bole International to your hotel or Airbnb.':
    'ከቦሌ ዓለም አቀፍ ወደ ሆቴልዎ ወይም Airbnb።',
  'Museums, parks, markets, food and nightlife.':
    'ሙዚየሞች፣ መናፈሻዎች፣ ገበያዎች፣ ምግብና የምሽት መዝናኛ።',
  'Corporate & Summit': 'ድርጅቶችና ጉባኤዎች',
  'Delegations, embassies and conference venues.': 'ልዑካን፣ ኤምባሲዎችና የስብሰባ ማዕከላት።',
  'All Services': 'ሁሉም አገልግሎቶች',
  'The full catalogue, from hourly to weddings.': 'ሙሉ ዝርዝሩ፣ ከሰዓት ኪራይ እስከ ሠርግ።',
  'About Addis Limo': 'ስለ አዲስ ሊሞ',
  'Who we are and how the network works.': 'ማን እንደሆንንና አውታረ መረቡ እንዴት እንደሚሠራ።',

  /* ── Home: hero ── */
  'Experience\nthe Capital City\nof Africa': 'የአፍሪካን\nዋና ከተማ\nይጎብኙ',
  'in Class.': 'በክብር።',
  'Premium chauffeur and transportation services in Addis Ababa, designed for travelers, executives, businesses, events and unforgettable journeys.':
    'በአዲስ አበባ ለተጓዦች፣ ለሥራ ኃላፊዎች፣ ለድርጅቶች፣ ለዝግጅቶችና ለማይረሱ ጉዞዎች የተዘጋጀ ፕሪሚየም የሹፌር እና የትራንስፖርት አገልግሎት።',
  'Book Your Ride': 'ጉዞዎን ይያዙ',
  'Get Quote': 'ዋጋ ይጠይቁ',
  Scroll: 'ወደ ታች',
  'The Addis Ababa skyline': 'የአዲስ አበባ ሰማይ መስመር',

  /* ── Home: trust strip and reasons ── */
  'Reliable.': 'አስተማማኝ።',
  'Refined.': 'የተዋበ።',
  'Ready.': 'ዝግጁ።',
  'Airport, corporate, summit, expat, events and city transfers.':
    'የአውሮፕላን ማረፊያ፣ የድርጅት፣ የጉባኤ፣ የውጭ ዜጎች፣ የዝግጅትና የከተማ ውስጥ ትራንስፖርት።',
  'Curated Experiences': 'የተመረጡ ልምዶች',
  'Museums, parks, hiking, markets, malls and cultural dining.':
    'ሙዚየሞች፣ መናፈሻዎች፣ የእግር ጉዞ፣ ገበያዎች፣ የገበያ ማዕከላትና ባህላዊ ምግብ ቤቶች።',
  'Dispatch & Support': 'ስምሪትና ድጋፍ',
  'Reserve ahead or call on the day. Someone is always reachable.':
    'አስቀድመው ይያዙ ወይም በዕለቱ ይደውሉ። ሁልጊዜ የሚያነጋግርዎ ሰው አለ።',
  Vetted: 'የተረጋገጠ',
  'Partner Network': 'የአጋሮች አውታረ መረብ',
  'Every vehicle and chauffeur in the network is checked and approved.':
    'በአውታረ መረቡ ውስጥ ያለ እያንዳንዱ ተሽከርካሪና ሹፌር ተፈትሾ የጸደቀ ነው።',
  'Why Addis Limo': 'ለምን አዲስ ሊሞ',
  'Verified Partner Network': 'የተረጋገጠ የአጋሮች አውታረ መረብ',
  'Every vehicle and chauffeur in our network is vetted and approved.':
    'በአውታረ መረባችን ውስጥ ያለ እያንዳንዱ ተሽከርካሪና ሹፌር ተመርምሮ የጸደቀ ነው።',
  'Premium Vehicles': 'ፕሪሚየም ተሽከርካሪዎች',
  'Executive sedans, luxury SUVs and business vans, always immaculate.':
    'ኤክዚኪዩቲቭ ሴዳኖች፣ የቅንጦት SUVዎችና የሥራ ቫኖች፣ ሁልጊዜ ንጹሕ።',
  'Professional Chauffeurs': 'ሙያተኛ ሹፌሮች',
  'Trained, uniformed and dedicated to your comfort and privacy.':
    'የሠለጠኑ፣ የደንብ ልብስ የለበሱና ለምቾትዎና ለግላዊነትዎ የቆሙ።',
  'Reliable Scheduling': 'አስተማማኝ የጊዜ ሰሌዳ',
  'On-time, every time. Your schedule is our priority.':
    'ሁልጊዜ በሰዓቱ። የእርስዎ ፕሮግራም ቅድሚያችን ነው።',
  'Full Coordination': 'ሙሉ ቅንጅት',
  'We manage every detail. You simply arrive and travel in style.':
    'እያንዳንዱን ዝርዝር እኛ እናስተዳድራለን። እርስዎ በምቾት ብቻ ይጓዙ።',
  'International Standard': 'ዓለም አቀፍ ደረጃ',
  'Service quality designed for global executives and discerning travelers.':
    'ለዓለም አቀፍ የሥራ ኃላፊዎችና ጥራት ለሚመርጡ ተጓዦች የተዘጋጀ የአገልግሎት ጥራት።',

  /* ── Home: sections ── */
  'Our Services': 'አገልግሎቶቻችን',
  'Premium Transportation,': 'ፕሪሚየም ትራንስፖርት፣',
  'Every Journey.': 'ለእያንዳንዱ ጉዞ።',
  "Africa's capital city.": 'የአፍሪካ ዋና ከተማ።',
  'Explored with elegance.': 'በክብር ይጎብኙ።',
  'Discover museums, cultural restaurants, scenic parks and vibrant neighborhoods, all with a professional chauffeur and premium vehicle.':
    'ሙዚየሞችን፣ ባህላዊ ምግብ ቤቶችን፣ ውብ መናፈሻዎችንና ሕያው ሰፈሮችን ከሙያተኛ ሹፌርና ፕሪሚየም ተሽከርካሪ ጋር ያስሱ።',
  'Our Fleet': 'ተሽከርካሪዎቻችን',
  'Travel in the': 'በትክክለኛው',
  'Right Vehicle.': 'ተሽከርካሪ ይጓዙ።',
  'Our Partners': 'አጋሮቻችን',
  'Trusted by.': 'የሚያምኑን።',
  'Book Your\nPremium Journey': 'ፕሪሚየም ጉዞዎን\nይያዙ',
  'Airport transfers, corporate travel, city tours. Book now and experience Addis Ababa at its finest.':
    'የአውሮፕላን ማረፊያ ትራንስፖርት፣ የድርጅት ጉዞ፣ የከተማ ጉብኝት። አሁን ይያዙና አዲስ አበባን በምርጥ ገጽታዋ ይመልከቱ።',
  'Hotels, vehicle owners, transport companies: join our premium partner network.':
    'ሆቴሎች፣ የተሽከርካሪ ባለቤቶች፣ የትራንስፖርት ድርጅቶች፦ የፕሪሚየም አጋሮች አውታረ መረባችንን ይቀላቀሉ።',
  'Request a Vehicle': 'ተሽከርካሪ ይጠይቁ',
  'For Passengers': 'ለተሳፋሪዎች',
  'For Partners': 'ለአጋሮች',
  // 'Grow With / Addis Limo.' is one headline split over two lines; Amharic
  // puts the verb last, so the halves are rearranged rather than translated.
  'Grow With': 'ከአዲስ ሊሞ ጋር',
  'Addis Limo.': 'ያድጉ።',
  'Become a Partner': 'አጋር ይሁኑ',
  'Learn More →': 'ተጨማሪ ይወቁ →',
  Capacity: 'የመያዝ አቅም',
  pax: 'ሰው',
  Luggage: 'ሻንጣ',

  /* ── Home: service cards ── */
  'Bole International to your hotel or Airbnb, met at arrivals.':
    'ከቦሌ ዓለም አቀፍ ወደ ሆቴልዎ ወይም Airbnb፣ በመድረሻ አዳራሽ እንቀበልዎታለን።',
  'City Tour': 'የከተማ ጉብኝት',
  'Bole, Kazanchis, Piassa, Mexico: the capital, district by district.':
    'ቦሌ፣ ካዛንቺስ፣ ፒያሳ፣ ሜክሲኮ፦ ዋና ከተማዋን ሰፈር በሰፈር።',
  'Summit & Conference': 'ጉባኤና ስብሰባ',
  'African Union, ECA, AICC and UNECA delegation transfers.':
    'ወደ አፍሪካ ኅብረት፣ ECA፣ AICC እና UNECA የልዑካን ትራንስፖርት።',
  'Expat Transport': 'ለውጭ ዜጎች ትራንስፖርት',
  'Standing arrangements for residents in Bole, CMC, Sarbet and beyond.':
    'በቦሌ፣ ሲኤምሲ፣ ሳርቤትና ሌሎች አካባቢዎች ለሚኖሩ ቋሚ ዝግጅቶች።',
  'Executive & Corporate': 'ለሥራ ኃላፊዎችና ድርጅቶች',
  'Professional chauffeurs for businesses, embassies and delegations.':
    'ለድርጅቶች፣ ለኤምባሲዎችና ለልዑካን ሙያተኛ ሹፌሮች።',
  'Point-to-Point': 'ከቦታ ወደ ቦታ',
  'Direct transport from one meeting or location to the next.':
    'ከአንድ ስብሰባ ወይም ቦታ ወደ ሌላው ቀጥታ ትራንስፖርት።',
  'Hourly Service': 'የሰዓት አገልግሎት',
  'A driver at your disposal for the hours or the day you need.':
    'በሚፈልጉት ሰዓታት ወይም ቀን ሙሉ የሚያገለግልዎ ሹፌር።',
  'Weddings & Prom': 'ሠርግና የምረቃ ምሽት',
  'Elegant transport for weddings, prom and graduation nights.':
    'ለሠርግ፣ ለፕሮምና ለምረቃ ምሽቶች የተዋበ ትራንስፖርት።',

  /* ── Fleet ── */
  'Executive Sedan': 'ኤክዚኪዩቲቭ ሴዳን',
  'Premium SUV': 'ፕሪሚየም SUV',
  'Luxury SUV': 'የቅንጦት SUV',
  'Business Van': 'የሥራ ቫን',
  '2 bags': '2 ሻንጣ',
  '3 bags': '3 ሻንጣ',
  '5+ bags': '5+ ሻንጣ',
  'Premium comfort for executives and couples.': 'ለሥራ ኃላፊዎችና ለጥንዶች ፕሪሚየም ምቾት።',
  'Spacious and commanding for families and small groups.':
    'ለቤተሰቦችና ለአነስተኛ ቡድኖች ሰፊና ግርማ ያለው።',
  'Ideal for delegations, groups and conference transfers.':
    'ለልዑካን፣ ለቡድኖችና ለስብሰባ ትራንስፖርት ምቹ።',

  /* ── Partner logos ── */
  'Luxury Hotel': 'የቅንጦት ሆቴል',
  'Five-Star Resort': 'ባለ አምስት ኮከብ ሪዞርት',
  'Cultural Heritage': 'ባህላዊ ቅርስ',
  'International Institution': 'ዓለም አቀፍ ተቋም',
  'National Carrier': 'ብሔራዊ አየር መንገድ',
  'Business Hotel': 'የቢዝነስ ሆቴል',
  'Premier Hotel': 'ቀዳሚ ሆቴል',
  'United Nations': 'የተባበሩት መንግሥታት',
  'Heritage Hotel': 'ታሪካዊ ሆቴል',
  'Diplomatic District': 'የዲፕሎማቲክ አካባቢ',
  'African Union': 'የአፍሪካ ኅብረት',
  'Ethiopian Airlines': 'የኢትዮጵያ አየር መንገድ',
  'AU Headquarters': 'የአፍሪካ ኅብረት ዋና መሥሪያ ቤት',
  'Adwa Museum': 'የዓድዋ ሙዚየም',

  /* ── Services page ── */
  'From airport arrivals to diplomatic missions, corporate travel to city explorations, Addis Limo delivers international-standard chauffeur services across Addis Ababa.':
    'ከአውሮፕላን ማረፊያ አቀባበል እስከ ዲፕሎማቲክ ሚሲዮኖች፣ ከድርጅት ጉዞ እስከ ከተማ ጉብኝት፣ አዲስ ሊሞ በመላው አዲስ አበባ ዓለም አቀፍ ደረጃውን የጠበቀ የሹፌር አገልግሎት ይሰጣል።',
  'Airport Transfer: Hotel & Airbnb': 'የአውሮፕላን ማረፊያ ትራንስፖርት፦ ሆቴልና Airbnb',
  'Arrive in Addis with confidence.': 'አዲስ አበባ በልበ ሙሉነት ይድረሱ።',
  'Bole International pickup': 'ከቦሌ ዓለም አቀፍ መቀበል',
  'Meet & greet at arrivals': 'በመድረሻ አዳራሽ አቀባበል',
  'Any Airbnb or residence': 'ማንኛውም Airbnb ወይም መኖሪያ ቤት',
  'Book Airport Transfer': 'የአውሮፕላን ማረፊያ ትራንስፖርት ይያዙ',
  'See the capital, district by district.': 'ዋና ከተማዋን ሰፈር በሰፈር ይመልከቱ።',
  'Plan a City Tour': 'የከተማ ጉብኝት ያቅዱ',
  'Delegation transport, on the summit clock.': 'በጉባኤው ሰዓት የሚሠራ የልዑካን ትራንስፖርት።',
  'Multi-vehicle coordination': 'የብዙ ተሽከርካሪዎች ቅንጅት',
  'Priority scheduling': 'ቅድሚያ የሚሰጠው የጊዜ ሰሌዳ',
  'Request Summit Transport': 'የጉባኤ ትራንስፖርት ይጠይቁ',
  'A standing driver for life in Addis.': 'በአዲስ አበባ ለሚኖሩ ቋሚ ሹፌር።',
  'Standing or ad-hoc arrangements': 'ቋሚ ወይም እንደአስፈላጊነቱ የሚደረጉ ዝግጅቶች',
  'Arrange Expat Transport': 'የውጭ ዜጎች ትራንስፖርት ያመቻቹ',
  'Executive travel, without the friction.': 'ያለ ውጣ ውረድ የሥራ ኃላፊዎች ጉዞ።',
  'Account management': 'የሒሳብ አስተዳደር',
  'Monthly invoicing': 'ወርሃዊ ደረሰኝ',
  'Multi-passenger coordination': 'የብዙ ተሳፋሪዎች ቅንጅት',
  'Conference transfers': 'የስብሰባ ትራንስፖርት',
  'NGO & embassy service': 'ለመንግሥታዊ ያልሆኑ ድርጅቶችና ኤምባሲዎች አገልግሎት',
  'Request Corporate Service': 'የድርጅት አገልግሎት ይጠይቁ',
  'Tours & Experiences': 'ጉብኝቶችና ልምዶች',
  'Museums, parks, hiking, markets, food.':
    'ሙዚየሞች፣ መናፈሻዎች፣ የእግር ጉዞ፣ ገበያዎች፣ ምግብ።',
  'Museums & historical landmarks': 'ሙዚየሞችና ታሪካዊ ቦታዎች',
  'Parks & hiking': 'መናፈሻዎችና የእግር ጉዞ',
  'Authentic shopping & malls': 'ባህላዊ ግብይትና የገበያ ማዕከላት',
  'Family activities': 'የቤተሰብ መዝናኛዎች',
  'Architecture & entertainment': 'ኪነ ሕንጻና መዝናኛ',
  'Cultural restaurants, food & drink': 'ባህላዊ ምግብ ቤቶች፣ ምግብና መጠጥ',
  'Point-to-Point City Transfers': 'ከቦታ ወደ ቦታ የከተማ ትራንስፖርት',
  'Direct. Precise. Reliable.': 'ቀጥተኛ። ትክክለኛ። አስተማማኝ።',
  'Direct transport between two points': 'በሁለት ቦታዎች መካከል ቀጥታ ትራንስፖርት',
  'Meeting to meeting': 'ከስብሰባ ወደ ስብሰባ',
  'City-wide coverage': 'መላ ከተማዋን የሚሸፍን',
  'Fixed transparent pricing': 'ቋሚና ግልጽ ዋጋ',
  'On-demand or pre-booked': 'በፍላጎት ወይም አስቀድሞ የተያዘ',
  'Executive chauffeur': 'የሥራ ኃላፊዎች ሹፌር',
  'Book City Transfer': 'የከተማ ትራንስፖርት ይያዙ',
  'A driver at your disposal.': 'ለእርስዎ ብቻ የሚያገለግል ሹፌር።',
  'By the hour or the full day': 'በሰዓት ወይም ለሙሉ ቀን',
  'Driver stays with you': 'ሹፌሩ ከእርስዎ ጋር ይቆያል',
  'Multiple stops': 'ብዙ ማቆሚያዎች',
  'Dedicated vehicle': 'ለእርስዎ ብቻ የተመደበ ተሽከርካሪ',
  'Business meetings': 'የሥራ ስብሰባዎች',
  'Events & shopping': 'ዝግጅቶችና ግብይት',
  'Book Hourly Service': 'የሰዓት አገልግሎት ይያዙ',
  'Diplomatic & Embassy Transport': 'የዲፕሎማቲክና የኤምባሲ ትራንስፖርት',
  'Discreet transport for missions and delegations.':
    'ለሚሲዮኖችና ለልዑካን ምስጢር የሚጠብቅ ትራንስፖርት።',
  'Embassy and mission travel': 'የኤምባሲና የሚሲዮን ጉዞ',
  'Discreet and professional': 'ምስጢር ጠባቂና ሙያዊ',
  'Reliable scheduling': 'አስተማማኝ የጊዜ ሰሌዳ',
  'Airport transfers': 'የአውሮፕላን ማረፊያ ትራንስፖርት',
  'Delegation support': 'የልዑካን ድጋፍ',
  'Confidentiality assured': 'ምስጢራዊነት የተረጋገጠ',
  'Request Diplomatic Service': 'የዲፕሎማቲክ አገልግሎት ይጠይቁ',
  Wedding: 'ሠርግ',
  'Elegant transport for the day that matters.': 'ለልዩ ቀንዎ የተዋበ ትራንስፖርት።',
  'Bride and groom vehicle': 'የሙሽሮች መኪና',
  'Guest and family transfers': 'የእንግዶችና የቤተሰብ ትራንስፖርት',
  'Decorated premium vehicles': 'ያጌጡ ፕሪሚየም ተሽከርካሪዎች',
  'Venue-to-venue coordination': 'ከአዳራሽ ወደ አዳራሽ ቅንጅት',
  'Photography stops': 'ለፎቶግራፍ ማቆሚያዎች',
  'Group scheduling': 'የቡድን የጊዜ ሰሌዳ',
  'Plan Wedding Transport': 'የሠርግ ትራንስፖርት ያቅዱ',
  Prom: 'ፕሮም',
  'Arrive at prom in style.': 'ፕሮም ላይ በክብር ይድረሱ።',
  'Prom and graduation nights': 'የፕሮምና የምረቃ ምሽቶች',
  'Group bookings': 'የቡድን ቦታ ማስያዝ',
  'Premium vehicle classes': 'ፕሪሚየም የተሽከርካሪ ዓይነቶች',
  'Parent-arranged reservations': 'በወላጆች የሚያዙ ቦታዎች',
  'Fixed pick-up and return times': 'ቋሚ የመነሻና የመመለሻ ሰዓት',
  'Vetted chauffeurs': 'የተረጋገጡ ሹፌሮች',
  'Book Prom Transport': 'የፕሮም ትራንስፖርት ይያዙ',

  /* ── Airport Transfer page ── */
  'Bole International Airport': 'ቦሌ ዓለም አቀፍ አውሮፕላን ማረፊያ',
  'Arrive in Addis.': 'አዲስ አበባ ይድረሱ።',
  'Travel with Confidence.': 'በልበ ሙሉነት ይጓዙ።',
  'From Bole International Airport to your hotel, residence, office or destination, enjoy a seamless private chauffeur experience.':
    'ከቦሌ ዓለም አቀፍ አውሮፕላን ማረፊያ ወደ ሆቴልዎ፣ መኖሪያዎ፣ ቢሮዎ ወይም መድረሻዎ ያለ እንከን የግል ሹፌር አገልግሎት ይደሰቱ።',
  'Airport: Bole International Airport': 'አውሮፕላን ማረፊያ፦ ቦሌ ዓለም አቀፍ',
  'Book Your Airport Transfer': 'የአውሮፕላን ማረፊያ ትራንስፖርትዎን ይያዙ',
  'Flight Number': 'የበረራ ቁጥር',
  'e.g. ET 502': 'ለምሳሌ ET 502',
  'Arrival Date': 'የሚደርሱበት ቀን',
  'Arrival Time': 'የሚደርሱበት ሰዓት',
  Destination: 'መድረሻ',
  'Hotel, address...': 'ሆቴል፣ አድራሻ...',
  Passengers: 'ተሳፋሪዎች',
  Vehicle: 'ተሽከርካሪ',
  'Book Transfer': 'ትራንስፖርት ይያዙ',
  'How It Works': 'እንዴት ይሠራል',
  'Four Simple Steps': 'አራት ቀላል ደረጃዎች',
  Book: 'ይያዙ',
  'Reserve your transfer online with flight details':
    'ትራንስፖርትዎን ከበረራ ዝርዝሩ ጋር በመስመር ላይ ይያዙ',
  Coordinate: 'እናቀናጃለን',
  'We confirm your chauffeur and vehicle assignment':
    'የሹፌርዎንና የተሽከርካሪዎን ምደባ እናረጋግጣለን',
  Arrive: 'ይድረሱ',
  'Your chauffeur meets you at arrivals with your name':
    'ሹፌርዎ ስምዎን ይዞ በመድረሻ አዳራሽ ይቀበልዎታል',
  Travel: 'ይጓዙ',
  'Relax and arrive at your destination in style': 'ዘና ብለው መድረሻዎ በክብር ይድረሱ',
  'Service Features': 'የአገልግሎቱ ገጽታዎች',
  'Everything Included': 'ሁሉም ነገር የተካተተ',
  'Professional Meet & Greet': 'ሙያዊ አቀባበል',
  'Your chauffeur awaits with a name sign at the arrivals hall.':
    'ሹፌርዎ በመድረሻ አዳራሽ ስምዎ የተጻፈበት ምልክት ይዞ ይጠብቅዎታል።',
  'On-Time Coordination': 'በሰዓቱ የሚደረግ ቅንጅት',
  'We coordinate around your flight schedule and arrival time.':
    'በበረራ ፕሮግራምዎና በሚደርሱበት ሰዓት መሠረት እናቀናጃለን።',
  'Executive sedans, premium SUVs and business vans available.':
    'ኤክዚኪዩቲቭ ሴዳኖች፣ ፕሪሚየም SUVዎችና የሥራ ቫኖች ይገኛሉ።',
  'Luggage Assistance': 'የሻንጣ እገዛ',
  'Full passenger and luggage assistance from arrival to vehicle.':
    'ከመድረሻ አዳራሽ እስከ ተሽከርካሪው ድረስ ለተሳፋሪና ለሻንጣ ሙሉ እገዛ።',
  'Hotels & Airbnb': 'ሆቴሎችና Airbnb',
  'Hotels, Airbnb, residences and offices, anywhere in Addis Ababa.':
    'ሆቴሎች፣ Airbnb፣ መኖሪያ ቤቶችና ቢሮዎች፣ በአዲስ አበባ የትም ቦታ።',
  'Departure Transfers': 'የመነሻ ትራንስፖርት',
  'Return transfers to Bole International, timed perfectly.':
    'ወደ ቦሌ ዓለም አቀፍ የመመለሻ ትራንስፖርት፣ በትክክለኛው ሰዓት።',
  'Popular Destinations': 'ተወዳጅ መዳረሻዎች',
  'Where We Take You': 'የምንወስድዎ ቦታዎች',
  'Sample destinations. We serve any address in Addis Ababa.':
    'የመዳረሻ ምሳሌዎች። በአዲስ አበባ ማንኛውንም አድራሻ እናገለግላለን።',
  '+ Any Location in Addis': '+ በአዲስ አበባ ማንኛውም ቦታ',
  'Direct transfers between Bole International and your hotel or Airbnb, with meet and greet at arrivals.':
    'በቦሌ ዓለም አቀፍና በሆቴልዎ ወይም Airbnb መካከል ቀጥታ ትራንስፖርት፣ በመድረሻ አዳራሽ አቀባበል ጋር።',
  'Any Airbnb or private residence': 'ማንኛውም Airbnb ወይም የግል መኖሪያ',
  'The districts we cover on a guided city tour, each with a chauffeur who knows the route.':
    'በከተማ ጉብኝት የምንሸፍናቸው ሰፈሮች፣ መንገዱን በሚያውቅ ሹፌር።',
  Summit: 'ጉባኤ',
  'Conference and summit venues we serve daily, including multi-vehicle delegation transfers.':
    'በየቀኑ የምናገለግላቸው የስብሰባና የጉባኤ ማዕከላት፣ የብዙ ተሽከርካሪ የልዑካን ትራንስፖርትን ጨምሮ።',
  Expats: 'የውጭ ዜጎች',
  'Residential areas where our expat clients live and travel from, on standing or ad-hoc arrangements.':
    'የውጭ ዜጋ ደንበኞቻችን የሚኖሩባቸውና የሚጓዙባቸው አካባቢዎች፣ በቋሚ ወይም እንደአስፈላጊነቱ።',
  'Bole Main Road': 'ቦሌ ዋና መንገድ',
  'Bole Edna Mall Road': 'ቦሌ ኤድና ሞል መንገድ',
  Kazanchis: 'ካዛንቺስ',
  '4 Kilo Bet Mengist': '4 ኪሎ ቤተ መንግሥት',
  'Piassa & Adwa': 'ፒያሳና ዓድዋ',
  'Mexico Bank Skyscrapers': 'ሜክሲኮ የባንክ ሕንጻዎች',
  'African Union Headquarters': 'የአፍሪካ ኅብረት ዋና መሥሪያ ቤት',
  Bole: 'ቦሌ',
  'Wello Sefer': 'ወሎ ሰፈር',
  'Old Airport Sarbet': 'ኦልድ ኤርፖርት ሳርቤት',
  CMC: 'ሲኤምሲ',

  /* ── Explore Addis page ── */
  'Addis Ababa · Ethiopia': 'አዲስ አበባ · ኢትዮጵያ',
  'Explore Addis.': 'አዲስን ያስሱ።',
  'Experience More.': 'የበለጠ ይለማመዱ።',
  "Discover the culture, history, food, nature and energy of Ethiopia's capital with comfortable private transportation.":
    'የኢትዮጵያን ዋና ከተማ ባህል፣ ታሪክ፣ ምግብ፣ ተፈጥሮና ሕያውነት በምቹ የግል ትራንስፖርት ያስሱ።',
  'Plan My Tour': 'ጉብኝቴን ያቅዱ',
  '{n} experience': '{n} ልምድ',
  '{n} experiences': '{n} ልምዶች',
  '· Private chauffeur available for all destinations':
    '· ለሁሉም መዳረሻዎች የግል ሹፌር ይገኛል',
  'Custom Itinerary': 'የራስዎ የጉዞ ዕቅድ',
  'Create Your Addis Experience': 'የአዲስ አበባ ልምድዎን ይፍጠሩ',
  'Choose your museums, restaurants, parks and cultural experiences. We coordinate the chauffeur and route. You simply explore.':
    'ሙዚየሞችን፣ ምግብ ቤቶችን፣ መናፈሻዎችንና ባህላዊ ልምዶችን ይምረጡ። ሹፌሩንና መንገዱን እኛ እናቀናጃለን። እርስዎ ብቻ ያስሱ።',
  'Request Custom Experience': 'የራስዎን ልምድ ይጠይቁ',
  'All Experiences': 'ሁሉም ልምዶች',
  'Museums & Landmarks': 'ሙዚየሞችና ታሪካዊ ቦታዎች',
  Parks: 'መናፈሻዎች',
  Hiking: 'የእግር ጉዞ',
  'Authentic Shopping': 'ባህላዊ ግብይት',
  'Family Activities': 'የቤተሰብ መዝናኛዎች',
  Malls: 'የገበያ ማዕከላት',
  Architecture: 'ኪነ ሕንጻ',
  Entertainment: 'መዝናኛ',
  'Cultural Restaurants': 'ባህላዊ ምግብ ቤቶች',
  'Food & Drink': 'ምግብና መጠጥ',

  // Destination tags
  Museum: 'ሙዚየም',
  Heritage: 'ቅርስ',
  'Natural History': 'የተፈጥሮ ታሪክ',
  'City History': 'የከተማ ታሪክ',
  History: 'ታሪክ',
  Science: 'ሳይንስ',
  Landmark: 'ታሪካዊ ቦታ',
  'Art & Culture': 'ጥበብና ባህል',
  Community: 'ማኅበረሰብ',
  Library: 'ቤተ መጻሕፍት',
  Nature: 'ተፈጥሮ',
  Park: 'መናፈሻ',
  Botanical: 'የእጽዋት ማዕከል',
  'Hiking · Easy': 'የእግር ጉዞ · ቀላል',
  'Hiking · Moderate': 'የእግር ጉዞ · መካከለኛ',
  'Hiking · Hard': 'የእግር ጉዞ · ከባድ',
  'City Walk': 'የከተማ የእግር ጉዞ',
  Market: 'ገበያ',
  Textiles: 'ጨርቃ ጨርቅ',
  Souvenirs: 'የማስታወሻ ዕቃዎች',
  Leather: 'ቆዳ',
  Adventure: 'ጀብዱ',
  Sport: 'ስፖርት',
  Kids: 'ልጆች',
  'Family Fun': 'የቤተሰብ መዝናኛ',
  'Shopping & Leisure': 'ግብይትና መዝናኛ',
  Shopping: 'ግብይት',
  Modern: 'ዘመናዊ',
  'Live Music': 'የቀጥታ ሙዚቃ',
  Arts: 'ጥበብ',
  'Live Culture': 'የቀጥታ ባህላዊ ትርዒት',
  'Dinner & Show': 'እራትና ትርዒት',
  'Cultural Dining': 'ባህላዊ ምግብ',
  Traditional: 'ባህላዊ',
  Restaurant: 'ምግብ ቤት',
  'Fine Dining': 'ልዩ ምግብ ቤት',
  'Artisan Coffee': 'የእደ ጥበብ ቡና',
  Coffee: 'ቡና',
  Grill: 'ጥብስ',

  // Destination names with a well-known Amharic form
  'Holy Trinity Cathedral Museum': 'የቅድስት ሥላሴ ካቴድራል ሙዚየም',
  'Ethiopian National Museum': 'የኢትዮጵያ ብሔራዊ ሙዚየም',
  'Ethiopian Postal Museum': 'የኢትዮጵያ ፖስታ ሙዚየም',
  'Addis Ababa Museum': 'የአዲስ አበባ ሙዚየም',
  'Entoto St. Mary Church Museum': 'የእንጦጦ ቅድስት ማርያም ቤተ ክርስቲያን ሙዚየም',
  'Ethiopian Science Museum': 'የኢትዮጵያ ሳይንስ ሙዚየም',
  'Ethnological Museum': 'የኢትኖሎጂ ሙዚየም',
  'Grand Anwar Mosque': 'ታላቁ አንዋር መስጊድ',
  'Palace Museum': 'የቤተ መንግሥት ሙዚየም',
  'Greek Orthodox Church': 'የግሪክ ኦርቶዶክስ ቤተ ክርስቲያን',
  'Entoto Mountain & Entoto Park': 'የእንጦጦ ተራራና የእንጦጦ ፓርክ',
  'Friendship Park I': 'ወዳጅነት ፓርክ 1',
  'Friendship Park II': 'ወዳጅነት ፓርክ 2',
  'Gullele Botanical Garden': 'የጉለሌ የእጽዋት ማዕከል',
  'Gullele Botanic Garden': 'የጉለሌ የእጽዋት ማዕከል',
  'Unity Park': 'አንድነት ፓርክ',
  'Yeka Forest (Washa Mikael)': 'የካ ደን (ዋሻ ሚካኤል)',
  'Wochecha Mountain': 'የወጨጫ ተራራ',
  'Legahar Train Station to Mayor’s Office': 'ከለገሀር ባቡር ጣቢያ እስከ ከንቲባ ጽ/ቤት',
  'Meskel Square to 6 Kilo': 'ከመስቀል አደባባይ እስከ 6 ኪሎ',
  Merkato: 'መርካቶ',
  'Shiro Meda': 'ሽሮ ሜዳ',
  'Post Office Market': 'የፖስታ ቤት ገበያ',
  'Leather Market in Bole': 'ቦሌ የሚገኘው የቆዳ ገበያ',
  'Entoto Adventure Park': 'የእንጦጦ ጀብዱ ፓርክ',
  'Holy Trinity Cathedral': 'ቅድስት ሥላሴ ካቴድራል',
  'Abrehot Library': 'አብርሆት ቤተ መጻሕፍት',
  'Bole Medhanialem': 'ቦሌ መድኃኔዓለም',
  'Tomoca Coffee': 'ቶሞካ ቡና',

  // Destination descriptions
  'Church museum holding imperial relics and Ethiopian Orthodox treasures.':
    'የንጉሣውያን ቅርሶችንና የኢትዮጵያ ኦርቶዶክስ ውድ ንብረቶችን የያዘ የቤተ ክርስቲያን ሙዚየም።',
  'Community museum tracing the early history of Islam in Ethiopia.':
    'በኢትዮጵያ የእስልምናን የመጀመሪያ ታሪክ የሚያሳይ የማኅበረሰብ ሙዚየም።',
  'The cathedral museum beside Ethiopia’s most important Orthodox church.':
    'ከኢትዮጵያ ዋነኛው የኦርቶዶክስ ቤተ ክርስቲያን አጠገብ የሚገኝ የካቴድራል ሙዚየም።',
  'Home to Lucy, one of the oldest hominid fossils ever discovered.':
    'እስካሁን ከተገኙ እጅግ ጥንታዊ የሰው ዘር ቅሪተ አካላት አንዷ የሆነችው የድንቅነሽ (ሉሲ) መኖሪያ።',
  'A century of Ethiopian stamps, mail and communication history.':
    'የአንድ ምዕተ ዓመት የኢትዮጵያ ቴምብሮች፣ ፖስታና የመገናኛ ታሪክ።',
  'Ethiopia’s endemic wildlife and natural history collections.':
    'የኢትዮጵያ ብርቅዬ የዱር እንስሳትና የተፈጥሮ ታሪክ ስብስቦች።',
  'The story of the capital, from Menelik’s founding to the present city.':
    'ከዳግማዊ ምኒልክ ምሥረታ እስከ ዛሬዋ ከተማ ድረስ የዋና ከተማዋ ታሪክ።',
  'Commemorating the historic Ethiopian victory at the Battle of Adwa.':
    'በዓድዋ ጦርነት የተገኘውን ታሪካዊ የኢትዮጵያ ድል የሚዘክር።',
  'Pan-African history and the continent’s independence movements.':
    'የፓን አፍሪካ ታሪክና የአህጉሪቱ የነጻነት ንቅናቄዎች።',
  'Imperial artefacts on the Entoto hilltop where Addis Ababa began.':
    'አዲስ አበባ በተጀመረችበት የእንጦጦ ኮረብታ ላይ ያሉ የንጉሣውያን ቅርሶች።',
  'Modern science and technology exhibits in central Addis Ababa.':
    'በአዲስ አበባ እምብርት የዘመናዊ ሳይንስና ቴክኖሎጂ ዐውደ ርዕዮች።',
  'Inside Haile Selassie’s former palace on the university campus.':
    'በዩኒቨርሲቲው ግቢ ውስጥ በቀድሞው የቀዳማዊ ኃይለ ሥላሴ ቤተ መንግሥት ውስጥ።',
  'The largest mosque in Addis Ababa, a landmark of the Merkato quarter.':
    'በአዲስ አበባ ትልቁ መስጊድ፣ የመርካቶ አካባቢ መለያ።',
  'Contemporary African art set in remarkable earthen architecture.':
    'በአስደናቂ የጭቃ ኪነ ሕንጻ ውስጥ የሚገኝ ዘመናዊ የአፍሪካ ጥበብ።',
  'A social enterprise showcasing crafts made by Ethiopian women.':
    'በኢትዮጵያውያን ሴቶች የተሠሩ የእጅ ሥራዎችን የሚያሳይ ማኅበራዊ ድርጅት።',
  'Imperial state rooms and regalia inside the historic palace grounds.':
    'በታሪካዊው የቤተ መንግሥት ግቢ ውስጥ የንጉሣውያን አዳራሾችና ዘውዳዊ ጌጣጌጦች።',
  'A quiet landmark of the capital’s long-established Greek community.':
    'በዋና ከተማዋ ለረጅም ጊዜ የኖረው የግሪክ ማኅበረሰብ ጸጥ ያለ መለያ።',
  'Manuscripts and ecclesiastical treasures of the Ethiopian Patriarchate.':
    'የኢትዮጵያ ፓትርያርክ ጽ/ቤት የብራና መጻሕፍትና የቤተ ክርስቲያን ውድ ቅርሶች።',
  'Forested hilltops above Addis with panoramic views over the capital.':
    'ከአዲስ አበባ በላይ ያሉ፣ ዋና ከተማዋን ቁልቁል የሚያሳዩ በደን የተሸፈኑ ኮረብታዎች።',
  'Riverside city park with landscaped walkways and open lawns.':
    'የተዋቡ የእግረኛ መንገዶችና ሰፊ ሣር ያለው የወንዝ ዳር የከተማ ፓርክ።',
  'The second phase of the Friendship Park development along the river.':
    'በወንዙ ዳር የተገነባው የወዳጅነት ፓርክ ሁለተኛ ምዕራፍ።',
  'A green sanctuary of rare Ethiopian flora and quiet walking trails.':
    'ብርቅዬ የኢትዮጵያ እጽዋትና ጸጥ ያሉ የእግር መንገዶች ያሉት አረንጓዴ መጠለያ።',
  'Restored historic grounds within the National Palace compound.':
    'በብሔራዊ ቤተ መንግሥት ግቢ ውስጥ የታደሱ ታሪካዊ ቦታዎች።',
  'Gentle marked trails through indigenous highland forest.':
    'በአገር በቀል የደጋ ደን ውስጥ ምልክት የተደረገባቸው ቀላል መንገዶች።',
  'Highland ridge walk with wide views over the surrounding countryside.':
    'በዙሪያው ያለውን ገጠር በሰፊው የሚያሳይ የደጋ ሸንተረር የእግር ጉዞ።',
  'A green retreat inside the city, ending at a rock-hewn church site.':
    'በከተማዋ ውስጥ ያለ አረንጓዴ ማረፊያ፣ ከአለት በተፈለፈለ ቤተ ክርስቲያን የሚያበቃ።',
  'A challenging climb rewarded with panoramic summit views.':
    'ከጫፉ በሚታይ ሰፊ ዕይታ የሚሸለም ፈታኝ አቀበት።',
  'Historic hilltop trails through eucalyptus forest above the city.':
    'ከከተማዋ በላይ በባሕር ዛፍ ደን ውስጥ የሚያልፉ ታሪካዊ የኮረብታ መንገዶች።',
  'A walking route through the city’s civic and railway heritage.':
    'በከተማዋ የአስተዳደርና የባቡር ቅርሶች በኩል የሚያልፍ የእግር መንገድ።',
  'An urban walk past monuments, campuses and the university quarter.':
    'በሐውልቶች፣ በትምህርት ተቋማትና በዩኒቨርሲቲው አካባቢ የሚያልፍ የከተማ የእግር ጉዞ።',
  'The largest open-air market in Africa, a vivid sensory experience.':
    'በአፍሪካ ትልቁ ክፍት ገበያ፣ ሕያው ልምድ።',
  'Traditional textile market for authentic handwoven Ethiopian dress.':
    'በእጅ የተሸመኑ ባህላዊ የኢትዮጵያ አልባሳት የሚገኙበት የጨርቃ ጨርቅ ገበያ።',
  'Souvenir and craft stalls clustered around the central post office.':
    'በዋናው ፖስታ ቤት ዙሪያ የተሰባሰቡ የማስታወሻና የእደ ጥበብ መሸጫዎች።',
  'Quality Ethiopian leather goods in a curated hotel-side setting.':
    'ከሆቴሉ አጠገብ በተመረጠ ሥፍራ ጥራት ያላቸው የኢትዮጵያ የቆዳ ውጤቶች።',
  'Leather workshops and boutiques along the Bole district.':
    'በቦሌ አካባቢ የሚገኙ የቆዳ ሥራ ቤቶችና ሱቆች።',
  'Zip lines, rope courses and outdoor adventure above the city.':
    'ከከተማዋ በላይ የገመድ ላይ ተንሸራታች፣ የገመድ መሰናክሎችና የውጭ ጀብዱ።',
  'The capital’s golf course, open for a relaxed day out.':
    'የዋና ከተማዋ የጎልፍ ሜዳ፣ ዘና ላለ ቀን ክፍት።',
  'Rides and play areas built for younger children.':
    'ለትናንሽ ልጆች የተዘጋጁ መጫወቻዎችና የመጫወቻ ቦታዎች።',
  'Water park and family entertainment complex in Addis Ababa.':
    'በአዲስ አበባ የውሃ ፓርክና የቤተሰብ መዝናኛ ማዕከል።',
  'Open green space and playgrounds for an easy family afternoon.':
    'ለቤተሰብ ከሰዓት በኋላ ምቹ የሆነ ክፍት አረንጓዴ ቦታና መጫወቻ ሜዳዎች።',
  'Shopping, dining and a cinema under one roof.':
    'ግብይት፣ ምግብና ሲኒማ በአንድ ጣሪያ ሥር።',
  'Retail and entertainment in the heart of the city.':
    'በከተማዋ እምብርት ግብይትና መዝናኛ።',
  'Contemporary mall with shops, restaurants and family entertainment.':
    'ሱቆች፣ ምግብ ቤቶችና የቤተሰብ መዝናኛ ያሉት ዘመናዊ የገበያ ማዕከል።',
  'Long-established retail and leisure destination in central Addis.':
    'በአዲስ አበባ መሐል የቆየ የግብይትና የመዝናኛ ቦታ።',
  'The most significant Orthodox cathedral in Ethiopia, richly detailed.':
    'በኢትዮጵያ ዋነኛው የኦርቶዶክስ ካቴድራል፣ በጥበብ ያሸበረቀ።',
  'Award-winning earthen architecture built with traditional techniques.':
    'በባህላዊ ዘዴ የተገነባ ተሸላሚ የጭቃ ኪነ ሕንጻ።',
  'The former imperial palace, an architectural landmark in its own right.':
    'የቀድሞው ንጉሣዊ ቤተ መንግሥት፣ በራሱ የኪነ ሕንጻ መለያ።',
  'Ethiopia’s landmark national library and a striking modern build.':
    'የኢትዮጵያ መለያ የሆነ ብሔራዊ ቤተ መጻሕፍትና አስደናቂ ዘመናዊ ሕንጻ።',
  'One of the largest Orthodox churches in Africa, a Bole landmark.':
    'በአፍሪካ ካሉ ትላልቅ የኦርቶዶክስ አብያተ ክርስቲያናት አንዱ፣ የቦሌ መለያ።',
  'Live jazz and African music in a relaxed evening setting.':
    'ዘና ባለ የምሽት ድባብ የቀጥታ ጃዝና የአፍሪካ ሙዚቃ።',
  'Where tradition meets art. Ethiopian pottery you can try yourself.':
    'ባህል ከጥበብ የሚገናኝበት። እራስዎ የሚሞክሩት የኢትዮጵያ የሸክላ ሥራ።',
  'Azmari music, traditional dance and Ethiopian arts in an intimate venue.':
    'የአዝማሪ ሙዚቃ፣ ባህላዊ ጭፈራና የኢትዮጵያ ጥበብ በሞቅታ ባለ ቦታ።',
  'A venue for Ethiopian music and evening performances.':
    'የኢትዮጵያ ሙዚቃና የምሽት ትርዒቶች ቦታ።',
  'Traditional food paired with nightly music and dance.':
    'ባህላዊ ምግብ ከየምሽቱ ሙዚቃና ጭፈራ ጋር።',
  'Authentic Ethiopian cuisine with live music and traditional dance.':
    'ትክክለኛ የኢትዮጵያ ምግብ ከቀጥታ ሙዚቃና ባህላዊ ጭፈራ ጋር።',
  'A classic traditional restaurant with spectacular cultural shows.':
    'አስደናቂ ባህላዊ ትርዒቶች ያሉት የታወቀ ባህላዊ ምግብ ቤት።',
  'Generous traditional platters in a long-standing Addis institution.':
    'በአዲስ አበባ ለረጅም ዘመን በቆየ ቤት የሚቀርቡ የተትረፈረፉ ባህላዊ ገበታዎች።',
  'Warm ambiance and exquisite injera-based traditional dishes.':
    'ሞቅ ያለ ድባብና ምርጥ የእንጀራ ባህላዊ ምግቦች።',
  'Ethiopian home cooking with the spice the restaurant is named for.':
    'ምግብ ቤቱ በስሙ በተሰየመበት ቅመም የሚዘጋጅ የኢትዮጵያ የቤት ምግብ።',
  'Highland Ethiopian dishes served in a traditional setting.':
    'በባህላዊ ድባብ የሚቀርቡ የደጋ ኢትዮጵያ ምግቦች።',
  'Contemporary dining with an Ethiopian and international menu.':
    'የኢትዮጵያና የዓለም አቀፍ ምግቦች ያሉት ዘመናዊ ምግብ ቤት።',
  'A legendary Addis Italian restaurant, beloved for decades.':
    'ለአሥርት ዓመታት ተወዳጅ የሆነ ዝነኛ የአዲስ አበባ የጣሊያን ምግብ ቤት።',
  'Artisan cafe with specialty Ethiopian coffee and hillside views.':
    'ልዩ የኢትዮጵያ ቡናና የኮረብታ ዕይታ ያለው የእደ ጥበብ ካፌ።',
  'The iconic Addis Ababa coffee house, roasting since 1953.':
    'ከ1953 (እ.ኤ.አ.) ጀምሮ ቡና የሚቆላ ዝነኛው የአዲስ አበባ ቡና ቤት።',
  'Modern restaurant and bar for an elevated evening out.':
    'ለልዩ ምሽት ዘመናዊ ምግብ ቤትና ባር።',
  'Comfortable all-day dining in the capital.':
    'በዋና ከተማዋ ቀኑን ሙሉ ምቹ የምግብ አገልግሎት።',
  'Brazilian churrasco grill inside the Ramada hotel.':
    'በራማዳ ሆቴል ውስጥ የብራዚል ቹራስኮ ጥብስ።',
  'Specialty Ethiopian single-origin coffee, freshly roasted.':
    'አዲስ የተቆላ፣ ከአንድ ምንጭ የሚገኝ ልዩ የኢትዮጵያ ቡና።',
  'A relaxed specialty coffee spot for a slower morning.':
    'ለተረጋጋ ጠዋት ዘና ያለ የልዩ ቡና ቦታ።',

  /* ── Corporate page ── */
  'Corporate & Executive': 'ለድርጅቶችና ለሥራ ኃላፊዎች',
  'Executive Travel,': 'የሥራ ኃላፊዎች ጉዞ፣',
  'Without the Friction.': 'ያለ ውጣ ውረድ።',
  'Premium transportation services for companies, NGOs, embassies, diplomatic missions and international organizations operating in Addis Ababa.':
    'በአዲስ አበባ ለሚሠሩ ኩባንያዎች፣ መንግሥታዊ ያልሆኑ ድርጅቶች፣ ኤምባሲዎች፣ ዲፕሎማቲክ ሚሲዮኖችና ዓለም አቀፍ ድርጅቶች ፕሪሚየም የትራንስፖርት አገልግሎት።',
  'Contact Our Team': 'ቡድናችንን ያግኙ',
  'Who We Serve': 'የምናገለግላቸው',
  'Transportation for Every': 'ለሁሉም',
  'Professional Need': 'የሙያ ፍላጎት ትራንስፖርት',
  'From airport pickups for visiting executives to full conference transportation packages for international summits, Addis Limo serves the full spectrum of professional travel in Addis Ababa.':
    'ለጎብኚ የሥራ ኃላፊዎች ከአውሮፕላን ማረፊያ ከመቀበል እስከ ዓለም አቀፍ ጉባኤዎች ሙሉ የትራንስፖርት ጥቅል ድረስ፣ አዲስ ሊሞ በአዲስ አበባ ሁሉንም ዓይነት የሥራ ጉዞ ያገለግላል።',
  'Companies & Businesses': 'ኩባንያዎችና የንግድ ድርጅቶች',
  'NGOs & Development Organizations': 'መንግሥታዊ ያልሆኑና የልማት ድርጅቶች',
  'Diplomatic Missions': 'ዲፕሎማቲክ ሚሲዮኖች',
  'Embassies & Consulates': 'ኤምባሲዎችና ቆንስላዎች',
  'International Delegations': 'ዓለም አቀፍ ልዑካን',
  'Conference Participants': 'የስብሰባ ተሳታፊዎች',
  'Executive Travelers': 'ተጓዥ የሥራ ኃላፊዎች',
  'Government Institutions': 'የመንግሥት ተቋማት',
  'Premium Corporate Transport': 'ፕሪሚየም የድርጅት ትራንስፖርት',
  'Trained, uniformed and punctual, representing your organization with discretion.':
    'የሠለጠኑ፣ የደንብ ልብስ የለበሱና ሰዓት አክባሪ፣ ድርጅትዎን በጨዋነት የሚወክሉ።',
  'Executive Fleet': 'የሥራ ኃላፊዎች ተሽከርካሪዎች',
  'Premium sedans, luxury SUVs, and business vans for all delegation sizes.':
    'ለማንኛውም መጠን ልዑክ ፕሪሚየም ሴዳኖች፣ የቅንጦት SUVዎችና የሥራ ቫኖች።',
  'Scheduled Transport': 'በፕሮግራም የሚሰጥ ትራንስፖርት',
  'Regular daily routes, airport transfers, and ad-hoc bookings.':
    'መደበኛ የዕለት መስመሮች፣ የአውሮፕላን ማረፊያ ትራንስፖርትና ድንገተኛ ጥያቄዎች።',
  'Conference Transfers': 'የስብሰባ ትራንስፖርት',
  'Multi-passenger coordination for summits at AU, ECA, and AICC.':
    'በአፍሪካ ኅብረት፣ ECA እና AICC ለሚደረጉ ጉባኤዎች የብዙ ተሳፋሪዎች ቅንጅት።',
  'Account Management': 'የሒሳብ አስተዳደር',
  'Dedicated coordinator, monthly invoicing, and trip history reporting.':
    'የተመደበ አስተባባሪ፣ ወርሃዊ ደረሰኝና የጉዞ ታሪክ ሪፖርት።',
  'Priority Availability': 'ቅድሚያ የሚሰጥ አገልግሎት',
  'Corporate accounts receive priority scheduling and confirmed reservations.':
    'የድርጅት ደንበኞች በፕሮግራም ቅድሚያና የተረጋገጠ ቦታ ያገኛሉ።',
  'Conference & Summit Transport': 'የስብሰባና የጉባኤ ትራንስፖርት',
  'Arrive Ready for Business.': 'ለሥራ ዝግጁ ሆነው ይድረሱ።',
  'We coordinate transfers to major venues in Addis Ababa.':
    'በአዲስ አበባ ወደሚገኙ ዋና ዋና ማዕከላት ትራንስፖርት እናቀናጃለን።',
  'UN Economic Commission for Africa (UNECA)': 'የተመድ የአፍሪካ ኢኮኖሚክ ኮሚሽን (UNECA)',
  'All Major Hotels': 'ሁሉም ዋና ዋና ሆቴሎች',
  'Corporate Portal · Coming Soon': 'የድርጅት መግቢያ · በቅርቡ',
  "Manage Your Organization's Travel": 'የድርጅትዎን ጉዞ ያስተዳድሩ',
  'Monthly invoices, employee bookings, trip history and authorized users, all in one corporate dashboard.':
    'ወርሃዊ ደረሰኞች፣ የሠራተኞች ቦታ ማስያዣ፣ የጉዞ ታሪክና የተፈቀደላቸው ተጠቃሚዎች፣ ሁሉም በአንድ የድርጅት ዳሽቦርድ።',
  'Set Up Corporate Account': 'የድርጅት ሒሳብ ይክፈቱ',

  /* ── About page ── */
  "Addis Ababa's": 'የአዲስ አበባ',
  'Premium Chauffeur Platform.': 'ፕሪሚየም የሹፌር አገልግሎት መድረክ።',
  'Addis Limo is a premium transportation and chauffeur platform operating in Addis Ababa, Ethiopia. We connect customers with professional drivers and vehicles through our curated partner network.':
    'አዲስ ሊሞ በአዲስ አበባ፣ ኢትዮጵያ የሚሠራ ፕሪሚየም የትራንስፖርትና የሹፌር አገልግሎት መድረክ ነው። ደንበኞችን በተመረጠ የአጋሮች አውታረ መረባችን አማካኝነት ከሙያተኛ ሹፌሮችና ተሽከርካሪዎች ጋር እናገናኛለን።',
  'We manage the customer experience, bookings, service quality, coordination and technology, so every journey is seamless, comfortable and exactly what a premium service should be.':
    'የደንበኞችን ልምድ፣ ቦታ ማስያዝን፣ የአገልግሎት ጥራትን፣ ቅንጅትንና ቴክኖሎጂን እናስተዳድራለን፤ በዚህም እያንዳንዱ ጉዞ ያለ እንከን፣ ምቹና ፕሪሚየም አገልግሎት እንደሚገባው ይሆናል።',
  'Addis Ababa skyline': 'የአዲስ አበባ ሰማይ መስመር',
  'What We Stand For': 'የምንቆምለት',
  'Premium Service': 'ፕሪሚየም አገልግሎት',
  'International-standard chauffeur service delivered with Ethiopian hospitality.':
    'ዓለም አቀፍ ደረጃውን የጠበቀ የሹፌር አገልግሎት በኢትዮጵያዊ እንግዳ ተቀባይነት።',
  'A curated network of vetted vehicles, professional drivers and transport partners.':
    'የተረጋገጡ ተሽከርካሪዎች፣ ሙያተኛ ሹፌሮችና የትራንስፖርት አጋሮች የተመረጠ አውታረ መረብ።',
  'Technology Platform': 'የቴክኖሎጂ መድረክ',
  'Smart coordination technology connecting customers, drivers and partners seamlessly.':
    'ደንበኞችን፣ ሹፌሮችንና አጋሮችን ያለ እንከን የሚያገናኝ ዘመናዊ የቅንጅት ቴክኖሎጂ።',
  'Trust & Reliability': 'እምነትና አስተማማኝነት',
  'Every booking is managed, coordinated and followed through to completion.':
    'እያንዳንዱ ቦታ ማስያዝ እስከ መጨረሻው ይመራል፣ ይቀናጃል፣ ክትትል ይደረግበታል።',
  'Grow With Addis Limo.': 'ከአዲስ ሊሞ ጋር ያድጉ።',
  'Join our premium transportation network and connect your vehicles and chauffeur services with customers looking for reliable transportation in Addis Ababa.':
    'የፕሪሚየም ትራንስፖርት አውታረ መረባችንን ይቀላቀሉና ተሽከርካሪዎችዎንና የሹፌር አገልግሎትዎን በአዲስ አበባ አስተማማኝ ትራንስፖርት ከሚፈልጉ ደንበኞች ጋር ያገናኙ።',
  Hotels: 'ሆቴሎች',
  'Premium hotels connecting guests with reliable airport and city transfers.':
    'እንግዶቻቸውን ከአስተማማኝ የአውሮፕላን ማረፊያና የከተማ ትራንስፖርት ጋር የሚያገናኙ ፕሪሚየም ሆቴሎች።',
  'Vehicle Owners': 'የተሽከርካሪ ባለቤቶች',
  'Professional vehicle owners providing executive sedans and SUVs.':
    'ኤክዚኪዩቲቭ ሴዳኖችንና SUVዎችን የሚያቀርቡ ሙያተኛ የተሽከርካሪ ባለቤቶች።',
  'Transport Companies': 'የትራንስፖርት ድርጅቶች',
  'Established transport businesses joining our premium network.':
    'የፕሪሚየም አውታረ መረባችንን የሚቀላቀሉ የተቋቋሙ የትራንስፖርት ድርጅቶች።',
  'Trained, licensed and professional drivers serving our customers.':
    'ደንበኞቻችንን የሚያገለግሉ የሠለጠኑ፣ ፈቃድ ያላቸውና ሙያተኛ ሹፌሮች።',
  'The Addis Limo Model': 'የአዲስ ሊሞ መርሕ',
  '“Luxury without being flashy. Technology without feeling complicated. Ethiopian without looking stereotypical.”':
    '“ያለ ታይታ ቅንጦት። ያለ ውስብስብነት ቴክኖሎጂ። ያለ ተለምዷዊ ምስል ኢትዮጵያዊነት።”',

  /* ── Booking ── */
  Reservation: 'ቦታ ማስያዣ',
  'Book your journey': 'ጉዞዎን ይያዙ',
  'in five steps.': 'በአምስት ደረጃዎች።',
  'It takes about a minute. We confirm the chauffeur, the vehicle and the price before anything is charged.':
    'አንድ ደቂቃ ያህል ይወስዳል። ምንም ክፍያ ከመጠየቁ በፊት ሹፌሩን፣ ተሽከርካሪውንና ዋጋውን እናረጋግጣለን።',
  'Step {n} of 5': 'ደረጃ {n} ከ5',
  '{n}% complete': '{n}% ተጠናቋል',
  Service: 'አገልግሎት',
  Route: 'መስመር',
  Schedule: 'ጊዜ',
  Details: 'ዝርዝር',
  Confirm: 'ማረጋገጫ',
  'What do you need?': 'ምን ያስፈልግዎታል?',
  'Pick the service closest to your trip. You can tell us more at the end.':
    'ለጉዞዎ ቅርብ የሆነውን አገልግሎት ይምረጡ። ተጨማሪውን በመጨረሻ ሊነግሩን ይችላሉ።',
  'Bole International to your hotel or Airbnb':
    'ከቦሌ ዓለም አቀፍ ወደ ሆቴልዎ ወይም Airbnb',
  'Direct transfer between two points in the city':
    'በከተማዋ ውስጥ በሁለት ቦታዎች መካከል ቀጥታ ትራንስፖርት',
  'A driver at your disposal, by the hour or the day':
    'በሰዓት ወይም በቀን ለእርስዎ የሚመደብ ሹፌር',
  'Executive / Corporate': 'የሥራ ኃላፊ / ድርጅት',
  'Business and organizational travel': 'የንግድና የድርጅት ጉዞ',
  'Diplomatic & Embassy': 'ዲፕሎማቲክና ኤምባሲ',
  'Embassy, mission and delegation travel': 'የኤምባሲ፣ የሚሲዮንና የልዑካን ጉዞ',
  'Guided tour across the capital’s districts': 'በዋና ከተማዋ ሰፈሮች የሚደረግ የተመራ ጉብኝት',
  'AU, ECA, AICC and UNECA venue transfers':
    'ወደ አፍሪካ ኅብረት፣ ECA፣ AICC እና UNECA ትራንስፖርት',
  'Standing arrangements for residents in Addis': 'በአዲስ አበባ ለሚኖሩ ቋሚ ዝግጅቶች',
  'Bridal party, family and guest transport': 'ለሙሽሮች፣ ለቤተሰብና ለእንግዶች ትራንስፖርት',
  'Prom and graduation night transport': 'ለፕሮምና ለምረቃ ምሽት ትራንስፖርት',
  'Where are you going?': 'ወዴት ይሄዳሉ?',
  'A hotel name, a landmark or a full address all work.':
    'የሆቴል ስም፣ የታወቀ ቦታ ወይም ሙሉ አድራሻ ሁሉም ይሠራሉ።',
  'Pickup location': 'የመነሻ ቦታ',
  'For arrivals, Bole International Airport is the usual pickup.':
    'ለሚደርሱ መንገደኞች የተለመደው መነሻ ቦሌ ዓለም አቀፍ አውሮፕላን ማረፊያ ነው።',
  'When shall we collect you?': 'መቼ እንውሰድዎ?',
  'Give us the local time in Addis Ababa.': 'የአዲስ አበባን የአካባቢ ሰዓት ይንገሩን።',
  Date: 'ቀን',
  'Pickup time': 'የመነሻ ሰዓት',
  'Luggage pieces': 'የሻንጣ ብዛት',
  'Which vehicle class?': 'የትኛው ዓይነት ተሽከርካሪ?',
  'The exact car comes from our partner network, matched to your class.':
    'ትክክለኛው መኪና ከአጋሮቻችን አውታረ መረብ፣ ከመረጡት ዓይነት ጋር ተዛምዶ ይመደባል።',
  'Vehicle class': 'የተሽከርካሪ ዓይነት',
  'Premium comfort': 'ፕሪሚየም ምቾት',
  'Spacious & commanding': 'ሰፊና ግርማ ያለው',
  'Top-tier comfort': 'ከፍተኛ ምቾት',
  'Groups & delegations': 'ቡድኖችና ልዑካን',
  'Where do we confirm?': 'የት እናረጋግጥልዎ?',
  'We reply by email, and by WhatsApp if you leave a number. Dispatch answers {hours}.':
    'በኢሜይል፣ ቁጥር ካስቀመጡም በዋትስአፕ እንመልሳለን። ስምሪት ክፍሉ {hours} ይመልሳል።',
  'First name': 'ስም',
  'Last name': 'የአባት ስም',
  'Email address': 'የኢሜይል አድራሻ',
  'Phone or WhatsApp': 'ስልክ ወይም ዋትስአፕ',
  'Optional, but it is the fastest way to reach you.':
    'አማራጭ ነው፤ ግን እርስዎን ለማግኘት ፈጣኑ መንገድ ነው።',
  'Anything we should know?': 'ማወቅ ያለብን ነገር አለ?',
  '← Back': '← ተመለስ',
  'Continue →': 'ቀጥል →',
  'Request this booking': 'ይህን ቦታ ማስያዝ ይጠይቁ',
  'Sending this does not charge anything. Our team confirms the vehicle and the price with you first.':
    'ይህን መላክ ምንም ክፍያ አያስከትልም። ቡድናችን መጀመሪያ ተሽከርካሪውንና ዋጋውን ከእርስዎ ጋር ያረጋግጣል።',
  'Your booking': 'የእርስዎ ቦታ ማስያዣ',
  Pickup: 'መነሻ',
  'Date and time': 'ቀንና ሰዓት',
  '{date} at {time}': '{date}፣ {time}',
  Travellers: 'ተጓዦች',
  '{n} passenger': '{n} ተሳፋሪ',
  '{n} passengers': '{n} ተሳፋሪዎች',
  '{n} bag': '{n} ሻንጣ',
  '{n} bags': '{n} ሻንጣዎች',
  'Not chosen yet': 'ገና አልተመረጠም',
  'Prefer to talk? Call {phone}.': 'መነጋገር ይመርጣሉ? በ{phone} ይደውሉ።',
  'Choose the service you need.': 'የሚፈልጉትን አገልግሎት ይምረጡ።',
  'Where should the chauffeur collect you?': 'ሹፌሩ ከየት ይውሰድዎ?',
  'Choose the date of your trip.': 'የጉዞዎን ቀን ይምረጡ።',
  'That date has passed. Choose today or later.':
    'ያ ቀን አልፏል። ዛሬን ወይም ከዚያ በኋላ ይምረጡ።',
  'Choose a pickup time.': 'የመነሻ ሰዓት ይምረጡ።',
  'Choose a vehicle class.': 'የተሽከርካሪ ዓይነት ይምረጡ።',
  'Enter your first name.': 'ስምዎን ያስገቡ።',
  'Enter your last name.': 'የአባትዎን ስም ያስገቡ።',
  'Enter a valid email address.': 'ትክክለኛ የኢሜይል አድራሻ ያስገቡ።',
  'Enter a reachable phone number.': 'የሚሠራ ስልክ ቁጥር ያስገቡ።',

  /* ── Confirmation ── */
  'Booking Submitted': 'ጥያቄዎ ተልኳል',
  'Your Journey Is': 'ጉዞዎ',
  'Confirmed.': 'ተረጋግጧል።',
  'Thank you for choosing Addis Limo. Your booking request has been received and our team will confirm your chauffeur and vehicle shortly.':
    'አዲስ ሊሞን ስለመረጡ እናመሰግናለን። የቦታ ማስያዝ ጥያቄዎ ደርሶናል፤ ቡድናችን ሹፌርዎንና ተሽከርካሪዎን በቅርቡ ያረጋግጣል።',
  'Booking Reference': 'የማስያዣ ቁጥር',
  Status: 'ሁኔታ',
  'Pending Confirmation': 'ማረጋገጫ በመጠባበቅ ላይ',
  'Driver Status': 'የሹፌር ሁኔታ',
  'Being Assigned': 'በመመደብ ላይ',
  'Expected Response': 'የሚጠበቅ ምላሽ',
  'Within 2 hours': 'በ2 ሰዓት ውስጥ',
  'Contact Method': 'የመገናኛ መንገድ',
  'Email / WhatsApp': 'ኢሜይል / ዋትስአፕ',
  'Our team is reviewing your booking and will contact you shortly.':
    'ቡድናችን ቦታ ማስያዝዎን እየገመገመ ነው፤ በቅርቡ ያገኝዎታል።',
  'Return Home': 'ወደ መነሻ ይመለሱ',

  /* ── Contact ── */
  'Contact Addis Limo': 'አዲስ ሊሞን ያግኙ',
  'Talk to us': 'ያነጋግሩን',
  'Every journey starts': 'እያንዳንዱ ጉዞ',
  'with a conversation.': 'በውይይት ይጀምራል።',
  'Reserve a chauffeur, plan a delegation, or ask anything about our service in {city}. Our dispatch desk answers {hours}.':
    'ሹፌር ይያዙ፣ የልዑካን ጉዞ ያቅዱ ወይም በ{city} ስላለው አገልግሎታችን ማንኛውንም ይጠይቁ። የስምሪት ክፍላችን {hours} ይመልሳል።',
  'Call dispatch': 'ወደ ስምሪት ክፍል ይደውሉ',
  'Tap to call': 'ለመደወል ይንኩ',
  'Number coming soon': 'ቁጥሩ በቅርቡ ይገለጻል',
  Email: 'ኢሜይል',
  'We reply the same day': 'በዚያው ቀን እንመልሳለን',
  WhatsApp: 'ዋትስአፕ',
  'Coming soon': 'በቅርቡ',
  'Message us anytime': 'በማንኛውም ሰዓት ይጻፉልን',
  'Being set up': 'በመዘጋጀት ላይ',
  'Where we operate': 'የምንሠራበት',
  'Dispatch {hours}': 'ስምሪት {hours}',
  'Send a message': 'መልዕክት ይላኩ',
  'Tell us about your trip.': 'ስለ ጉዞዎ ይንገሩን።',
  'Share the date, the pickup point and how many travellers. We confirm the vehicle, the chauffeur and the price before anything is booked.':
    'ቀኑን፣ የመነሻ ቦታውንና የተጓዦችን ብዛት ይንገሩን። ምንም ነገር ከመያዙ በፊት ተሽከርካሪውን፣ ሹፌሩንና ዋጋውን እናረጋግጣለን።',
  'Or book in five steps': 'ወይም በአምስት ደረጃዎች ይያዙ',
  'Your name': 'ስምዎ',
  'Phone (optional)': 'ስልክ (አማራጭ)',
  'How can we help?': 'እንዴት ልንረዳዎ እንችላለን?',
  'Airport pickup on 12 June, two travellers, arriving from Nairobi.':
    'ሰኔ 5 ከአውሮፕላን ማረፊያ መቀበል፣ ሁለት ተጓዦች፣ ከናይሮቢ የሚመጡ።',
  'Write this message': 'ይህን መልዕክት ይጻፉ',
  'This opens your email app with the message ready, so you can see exactly what is sent. Prefer to talk? Call the dispatch desk above.':
    'ይህ መልዕክቱ የተዘጋጀበትን የኢሜይል መተግበሪያዎን ይከፍታል፤ የሚላከውን በትክክል ማየት ይችላሉ። መነጋገር ይመርጣሉ? ከላይ ወዳለው የስምሪት ክፍል ይደውሉ።',
  'Please enter your name.': 'እባክዎ ስምዎን ያስገቡ።',
  'Please enter a valid email address.': 'እባክዎ ትክክለኛ የኢሜይል አድራሻ ያስገቡ።',
  'Please tell us what you need.': 'እባክዎ የሚፈልጉትን ይንገሩን።',

  /* ── Footer ── */
  'Point-to-Point & Hourly': 'ከቦታ ወደ ቦታና የሰዓት',
  'Wedding & Prom': 'ሠርግና ፕሮም',
  Company: 'ድርጅቱ',
  'Partner With Us': 'ከእኛ ጋር ይሥሩ',
  Careers: 'የሥራ ዕድሎች',
  Support: 'ድጋፍ',
  'Booking Help': 'የቦታ ማስያዝ እገዛ',
  FAQ: 'ተደጋግመው የሚነሱ ጥያቄዎች',
  'Terms of Service': 'የአገልግሎት ውል',
  'Privacy Policy': 'የግላዊነት ፖሊሲ',
  'Cookie Policy': 'የኩኪ ፖሊሲ',
  'WhatsApp us': 'በዋትስአፕ ይጻፉልን',
  'WhatsApp (coming soon)': 'ዋትስአፕ (በቅርቡ)',
  'Follow us on': 'ይከተሉን',
  'All rights reserved.': 'መብቱ በሕግ የተጠበቀ ነው።',
}
