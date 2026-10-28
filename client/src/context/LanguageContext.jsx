import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

const translations = {
  EN: {
    // Header & Navbar
    genuine_products: "100% Genuine Havells, Polycab & Anchor Products",
    certified_visits: "Certified Home Electrician Visits",
    nashik_location: "Manmad, Maharashtra",
    search_placeholder: "Search wires, switches, LEDs, pumps...",
    nav_home: "Home",
    nav_products: "Products",
    nav_services: "Services & Booking",
    nav_contact: "Contact",
    need_electrician: "Need Electrician?",
    book_home_service: "⚡ Book Home Service",
    sign_in: "Sign In",
    sign_in_register: "Sign In / Register",
    my_dashboard: "My Dashboard & Orders",
    admin_portal: "⚡ Admin Portal",
    sign_out: "Sign Out",
    customer_login: "Customer Sign In",
    admin_login: "⚡ Store Admin Login",
    create_account: "Create an Account",

    // Common Buttons & Labels
    add_to_cart: "Add to Cart",
    book_now: "⚡ Book Technician Now",
    view_details: "View Details",
    in_stock: "In Stock",
    out_of_stock: "Out of Stock",
    verified_testimonials: "VERIFIED TESTIMONIALS",
    what_customers_say: "What Our Customers Say",
    why_choose_us: "Why Choose New Navnath",
    our_legacy: "10+ Years of Electrical Trust in Manmad",

    // Services Page
    services_badge: "⚡ LICENSED ELECTRICIAN DISPATCH IN MANMAD",
    services_title: "Need an Electrician for Services?",
    services_subtitle: "Book licensed professional electrical services across 4 essential areas: Install, Maintain, Repair, and Test electrical systems. Once your booking is approved, the assigned technician's direct contact details will be shared with you immediately.",
    cat_all_services: "All 4 Electrical Services",
    cat_install: "⚡ Install Electrical Systems",
    cat_maintain: "🛡️ Maintain Electrical Systems",
    cat_repair: "🔧 Repair Electrical Systems",
    cat_test: "🔬 Test Electrical Systems",
    duration_label: "Estimated Duration",
    price_label: "Estimated Charge",
    features_included: "Included in this service:",

    // Booking Modal
    book_modal_title: "Book Electrician Visit",
    full_name: "Full Name *",
    mobile_number: "Mobile Number (Manmad Contact) *",
    service_address: "Service Address in Manmad *",
    preferred_date: "Preferred Service Date *",
    earliest_today: "Earliest: Today",
    time_slot: "Time Slot *",
    notes_label: "Special Notes / Issue Details (Optional)",
    notes_placeholder: "e.g. New 3-phase DB installation or tripping repair",
    booking_note: "ℹ️ Once your request is submitted, our store manager will assign a technician and their direct contact phone number will be provided on your booking status.",
    submit_booking_btn: "⚡ Request Electrician Visit",
    submitting_btn: "Submitting Request...",
    booking_success_title: "Service Request Received!",
    booking_success_desc: "Your electrical service request has been logged successfully.",
    booking_ref: "Booking Reference",
    assigned_status: "Assignment Status",
    assigned_pending: "Store Admin will assign an electrician shortly with direct phone details.",
    close_btn: "Close & View Dashboard",

    // Home Page Sections
    explore_catalog_badge: "OUR ELECTRICAL CATALOG",
    shop_by_category: "Shop by Electrical Category",
    view_full_catalog: "View Full Catalog",
    explore_products: "Explore Products",
    home_bestsellers_badge: "BESTSELLERS IN MANMAD",
    home_featured_title: "Featured Electrical Products",
    view_all_products: "View All Products",
    why_choose_badge: "WHY WE ARE #1 IN MANMAD",
    why_choose_heading: "Why Customers Choose New Navnath",
    why_choose_desc: "For over 15 years, households, farmers, and industrial contractors have relied on us for unmatched electrical safety, wholesale prices, and reliable technical service.",
    cta_badge: "NEED EMERGENCY ELECTRICIAN OR BULK WIRING?",
    cta_heading: "Get Same-Day Service & Wholesale Contractor Rates",
    cta_desc: "Have a project in Manmad? Call Mayur Dadaji Chaudhari or book a licensed technician home visit in under 60 seconds.",
    cta_book_btn: "Book Technician (₹299)",
    cta_call_btn: "Call: +91 8862004797",

    // Cart & Checkout
    cart_empty_title: "Your Cart is Empty",
    cart_empty_desc: "Looks like you haven't added any electrical wires, modular switches, or LED batten lights yet.",
    cart_explore_btn: "Explore Electrical Catalog",
    order_summary: "Order Summary",
    subtotal: "Subtotal",
    discount: "Discount",
    delivery_charge: "Delivery Charge",
    free_delivery: "FREE",
    total_amount: "Total Amount",
    apply_coupon: "Apply Coupon",
    proceed_to_checkout: "Proceed to Checkout",
    continue_shopping: "Continue Shopping",

    // Footer
    quick_links: "Quick Links",
    top_categories: "Top Categories",
    contact_shop: "Contact Shop",
    electrical_helpline: "Electrical Helpline",
    mon_sat_timing: "Mon - Sat: 9:00 AM - 9:00 PM"
  },
  MR: {
    // Header & Navbar (मराठी)
    genuine_products: "१००% अस्सल हॅवेल्स, पॉलीकॅब आणि अँकर उत्पादने",
    certified_visits: "प्रमाणित घरगुती इलेक्ट्रिशियन सेवा",
    nashik_location: "मनमाड, महाराष्ट्र",
    search_placeholder: "वायर, स्विचेस, एलईडी, पंप शोधा...",
    nav_home: "मुखपृष्ठ",
    nav_products: "उत्पादने",
    nav_services: "सेवा आणि बुकिंग",
    nav_contact: "संपर्क",
    need_electrician: "इलेक्ट्रिशियन हवे आहे का?",
    book_home_service: "⚡ घरगुती सेवा बुक करा",
    sign_in: "लॉग इन करा",
    sign_in_register: "लॉग इन / नोंदणी करा",
    my_dashboard: "माझा डॅशबोर्ड आणि ऑर्डर्स",
    admin_portal: "⚡ ॲडमिन पोर्टल",
    sign_out: "बाहेर पडा",
    customer_login: "ग्राहक लॉगिन",
    admin_login: "⚡ स्टोअर ॲडमिन लॉगिन",
    create_account: "नवीन खाते तयार करा",

    // Common Buttons & Labels
    add_to_cart: "कार्टमध्ये जोडा",
    book_now: "⚡ आताच तंत्रज्ञ बुक करा",
    view_details: "तपशील पहा",
    in_stock: "उपलब्ध आहे",
    out_of_stock: "स्टॉकमध्ये नाही",
    verified_testimonials: "सत्यापित ग्राहक अभिप्राय",
    what_customers_say: "आमचे ग्राहक काय म्हणतात",
    why_choose_us: "न्यू नवनाथ का निवडावे?",
    our_legacy: "मनमाडमध्ये १०+ वर्षांचा इलेक्ट्रिकल विश्वास",

    // Services Page
    services_badge: "⚡ मनमाडमध्ये अधिकृत परवानाधारक इलेक्ट्रिशियन सेवा",
    services_title: "इलेक्ट्रिशियन सेवेची गरज आहे का?",
    services_subtitle: "४ प्रमुख क्षेत्रांमध्ये प्रमाणित व्यावसायिक इलेक्ट्रिकल सेवा बुक करा: इन्स्टॉल, देखभाल (Maintain), दुरुस्ती (Repair) आणि तपासणी (Test). विनंती मंजूर झाल्यावर तंत्रज्ञांचा संपर्क क्रमांक थेट उपलब्ध होईल.",
    cat_all_services: "सर्व ४ इलेक्ट्रिकल सेवा",
    cat_install: "⚡ इलेक्ट्रिकल सिस्टम बसवणे (Install)",
    cat_maintain: "🛡️ इलेक्ट्रिकल सिस्टम देखभाल (Maintain)",
    cat_repair: "🔧 इलेक्ट्रिकल दुरुस्ती (Repair)",
    cat_test: "🔬 इलेक्ट्रिकल तपासणी व चाचणी (Test)",
    duration_label: "अंदाजे वेळ",
    price_label: "अंदाजे शुल्क",
    features_included: "या सेवेमध्ये समाविष्ट:",

    // Booking Modal
    book_modal_title: "इलेक्ट्रिशियन भेट बुक करा",
    full_name: "पूर्ण नाव *",
    mobile_number: "मोबाईल नंबर (मनमाड संपर्क) *",
    service_address: "मनमाडमधील पत्ता *",
    preferred_date: "सेवेची तारीख *",
    earliest_today: "लवकरात लवकर: आज",
    time_slot: "वेळेचा स्लॉट *",
    notes_label: "समस्येचा तपशील / टिपण्णी (पर्यायी)",
    notes_placeholder: "उदा. ३-फेज डीबी इन्स्टॉलेशन किंवा ट्रिपिंग दुरुस्ती",
    booking_note: "ℹ️ विनंती पाठवल्यानंतर, आमचे स्टोअर मॅनेजर तंत्रज्ञ नियुक्त करतील आणि त्यांचा थेट संपर्क फोन नंबर तुमच्या बुकिंग स्थितीवर दिसेल.",
    submit_booking_btn: "⚡ इलेक्ट्रिशियन भेट विनंती पाठवा",
    submitting_btn: "विनंती पाठवत आहे...",
    booking_success_title: "सेवा विनंती यशस्वीरीत्या प्राप्त झाली!",
    booking_success_desc: "तुमची इलेक्ट्रिकल सेवा विनंती नोंदवली गेली आहे.",
    booking_ref: "बुकिंग संदर्भ क्रमांक",
    assigned_status: "नियुक्ती स्थिती",
    assigned_pending: "स्टोअर ॲडमिन लवकरच इलेक्ट्रिशियन नियुक्त करतील आणि त्यांचा थेट फोन नंबर दिसेल.",
    close_btn: "बंद करा आणि डॅशबोर्ड पहा",

    // Home Page Sections
    explore_catalog_badge: "आमचा इलेक्ट्रिकल कॅटलॉग",
    shop_by_category: "इलेक्ट्रिकल श्रेणीनुसार खरेदी करा",
    view_full_catalog: "संपूर्ण कॅटलॉग पहा",
    explore_products: "उत्पादने एक्सप्लोर करा",
    home_bestsellers_badge: "मनमाडमधील सर्वाधिक पसंतीची उत्पादने",
    home_featured_title: "खास निवडक इलेक्ट्रिकल उत्पादने",
    view_all_products: "सर्व उत्पादने पहा",
    why_choose_badge: "आम्ही मनमाडमध्ये सर्वोत्तम का आहोत",
    why_choose_heading: "ग्राहक न्यू नवनाथला का निवडतात",
    why_choose_desc: "१५ हून अधिक वर्षांपासून, घरे, शेतकरी आणि कंत्राटदार उत्कृष्ट सुरक्षा, घाऊक दर आणि विश्वासार्ह तांत्रिक सेवेसाठी आमच्यावर विश्वास ठेवतात.",
    cta_badge: "तातडीने इलेक्ट्रिशियन किंवा घाऊक वायरिंग हवी आहे का?",
    cta_heading: "त्याच दिवशी सेवा आणि कंत्राटदारांसाठी घाऊक दर मिळवा",
    cta_desc: "मनमाडमध्ये काम आहे का? मयूर दादाजी चौधरी यांच्याशी संपर्क साधा किंवा ६० सेकंदांत तंत्रज्ञ भेट बुक करा.",
    cta_book_btn: "तंत्रज्ञ बुक करा (₹२९९)",
    cta_call_btn: "कॉल करा: +91 8862004797",

    // Cart & Checkout
    cart_empty_title: "तुमची कार्ट रिकामी आहे",
    cart_empty_desc: "तुम्ही अद्याप कोणत्याही वायर्स, मॉड्युलर स्विचेस किंवा एलईडी उत्पादने जोडलेली नाहीत.",
    cart_explore_btn: "इलेक्ट्रिकल कॅटलॉग एक्सप्लोर करा",
    order_summary: "ऑर्डर सारांश",
    subtotal: "उपएकूण (Subtotal)",
    discount: "सवलत (Discount)",
    delivery_charge: "डिलिव्हरी शुल्क",
    free_delivery: "मोफत (FREE)",
    total_amount: "एकूण रक्कम",
    apply_coupon: "कूपन लागू करा",
    proceed_to_checkout: "चेकआऊटसाठी पुढे जा",
    continue_shopping: "खरेदी सुरू ठेवा",

    // Footer
    quick_links: "महत्वाच्या लिंक्स",
    top_categories: "प्रमुख श्रेणी",
    contact_shop: "दुकानाशी संपर्क साधा",
    electrical_helpline: "इलेक्ट्रिकल हेल्पलाईन",
    mon_sat_timing: "सोम - शनि: सकाळी ९:०० ते रात्री ९:००"
  },
  HI: {
    // Header & Navbar (हिन्दी)
    genuine_products: "100% असली हैवेल्स, पॉलीकैब और एंकर उत्पाद",
    certified_visits: "प्रमाणित घरेलू इलेक्ट्रीशियन सेवा",
    nashik_location: "मनमाड, महाराष्ट्र",
    search_placeholder: "वायर, स्विच, एलईडी, पंप खोजें...",
    nav_home: "होम",
    nav_products: "उत्पाद",
    nav_services: "सेवाएं और बुकिंग",
    nav_contact: "संपर्क",
    need_electrician: "इलेक्ट्रीशियन चाहिए?",
    book_home_service: "⚡ घरेलू सेवा बुक करें",
    sign_in: "साइन इन",
    sign_in_register: "साइन इन / रजिस्टर",
    my_dashboard: "मेरा डैशबोर्ड और ऑर्डर",
    admin_portal: "⚡ एडमिन पोर्टल",
    sign_out: "साइन आउट",
    customer_login: "ग्राहक लॉगिन",
    admin_login: "⚡ स्टोर एडमिन लॉगिन",
    create_account: "नया खाता बनाएं",

    // Common Buttons & Labels
    add_to_cart: "कार्ट में जोड़ें",
    book_now: "⚡ अभी तकनीशियन बुक करें",
    view_details: "विवरण देखें",
    in_stock: "स्टॉक में उपलब्ध",
    out_of_stock: "स्टॉक में नहीं",
    verified_testimonials: "सत्यापित ग्राहक समीक्षाएं",
    what_customers_say: "हमारे ग्राहक क्या कहते हैं",
    why_choose_us: "न्यू नवनाथ को क्यों चुनें?",
    our_legacy: "मनमाड में 10+ वर्षों का इलेक्ट्रिकल विश्वास",

    // Services Page
    services_badge: "⚡ मनमाड में अधिकृत लाइसेंस प्राप्त इलेक्ट्रीशियन सेवा",
    services_title: "क्या आपको इलेक्ट्रीशियन सेवा की आवश्यकता है?",
    services_subtitle: "4 आवश्यक क्षेत्रों में प्रमाणित पेशेवर इलेक्ट्रीशियन सेवाएं बुक करें: इंस्टॉलेशन, मेंटेनेंस, रिपेयरिंग और टेस्टिंग। बुकिंग स्वीकृत होते ही तकनीशियन का संपर्क नंबर तुरंत मिल जाएगा।",
    cat_all_services: "सभी 4 इलेक्ट्रिकल सेवाएं",
    cat_install: "⚡ इलेक्ट्रिकल सिस्टम इंस्टॉलेशन (Install)",
    cat_maintain: "🛡️ इलेक्ट्रिकल सिस्टम मेंटेनेंस (Maintain)",
    cat_repair: "🔧 इलेक्ट्रिकल रिपेयरिंग (Repair)",
    cat_test: "🔬 इलेक्ट्रिकल टेस्टिंग और निरीक्षण (Test)",
    duration_label: "अनुमानित समय",
    price_label: "अनुमानित शुल्क",
    features_included: "इस सेवा में शामिल:",

    // Booking Modal
    book_modal_title: "इलेक्ट्रीशियन विज़िट बुक करें",
    full_name: "पूरा नाम *",
    mobile_number: "मोबाइल नंबर (मनमाड संपर्क) *",
    service_address: "मनमाड में सेवा पता *",
    preferred_date: "सेवा की तारीख *",
    earliest_today: "जल्द से जल्द: आज",
    time_slot: "समय स्लॉट *",
    notes_label: "समस्या का विवरण / नोट्स (वैकल्पिक)",
    notes_placeholder: "उदा. 3-फेज डीबी इंस्टॉलेशन या ट्रिपिंग रिपेयर",
    booking_note: "ℹ️ अनुरोध भेजने के बाद, हमारे स्टोर मैनेजर तकनीशियन नियुक्त करेंगे और उनका सीधा संपर्क नंबर आपकी बुकिंग स्थिति पर उपलब्ध होगा।",
    submit_booking_btn: "⚡ इलेक्ट्रीशियन विज़िट का अनुरोध करें",
    submitting_btn: "अनुरोध भेजा जा रहा है...",
    booking_success_title: "सेवा अनुरोध सफलतापूर्वक प्राप्त हुआ!",
    booking_success_desc: "आपका इलेक्ट्रिकल सेवा अनुरोध दर्ज कर लिया गया है।",
    booking_ref: "बुकिंग संदर्भ संख्या",
    assigned_status: "असाइनमेंट स्थिति",
    assigned_pending: "स्टोर एडमिन जल्द ही इलेक्ट्रीशियन नियुक्त करेंगे और उनका सीधा फोन नंबर दिखाई देगा।",
    close_btn: "बंद करें और डैशबोर्ड देखें",

    // Home Page Sections
    explore_catalog_badge: "हमारा इलेक्ट्रिकल कैटलॉग",
    shop_by_category: "इलेक्ट्रिकल श्रेणी अनुसार खरीदारी करें",
    view_full_catalog: "पूरा कैटलॉग देखें",
    explore_products: "उत्पाद एक्सप्लोर करें",
    home_bestsellers_badge: "मनमाड में सर्वाधिक बिकने वाले उत्पाद",
    home_featured_title: "विशेष चुनिंदा इलेक्ट्रिकल उत्पाद",
    view_all_products: "सभी उत्पाद देखें",
    why_choose_badge: "हम मनमाड में सर्वश्रेष्ठ क्यों हैं",
    why_choose_heading: "ग्राहक न्यू नवनाथ को क्यों चुनते हैं",
    why_choose_desc: "15 से अधिक वर्षों से, घर, किसान और ठेकेदार उत्कृष्ट सुरक्षा, थोक मूल्य और विश्वसनीय तकनीकी सेवा के लिए हम पर भरोसा करते हैं।",
    cta_badge: "आपातकालीन इलेक्ट्रीशियन या थोक वायरिंग चाहिए?",
    cta_heading: "उसी दिन सेवा और ठेकेदारों के लिए थोक दरें प्राप्त करें",
    cta_desc: "मनमाड में प्रोजेक्ट है? मयूर दादाजी चौधरी से संपर्क करें या 60 सेकंड में तकनीशियन विज़िट बुक करें।",
    cta_book_btn: "तकनीशियन बुक करें (₹299)",
    cta_call_btn: "कॉल करें: +91 8862004797",

    // Cart & Checkout
    cart_empty_title: "आपकी कार्ट खाली है",
    cart_empty_desc: "लगता है आपने अभी तक कोई वायर, मॉड्यूलर स्विच या एलईडी लाइट नहीं जोड़ी है।",
    cart_explore_btn: "इलेक्ट्रिकल कैटलॉग एक्सप्लोर करें",
    order_summary: "ऑर्डर सारांश",
    subtotal: "उप-कुल (Subtotal)",
    discount: "छूट (Discount)",
    delivery_charge: "डिलीवरी शुल्क",
    free_delivery: "मुफ़्त (FREE)",
    total_amount: "कुल राशि",
    apply_coupon: "कूपन लागू करें",
    proceed_to_checkout: "चेकआउट के लिए आगे बढ़ें",
    continue_shopping: "खरीदारी जारी रखें",

    // Footer
    quick_links: "त्वरित लिंक्स",
    top_categories: "प्रमुख श्रेणियां",
    contact_shop: "दुकान से संपर्क करें",
    electrical_helpline: "इलेक्ट्रिकल हेल्पलाइन",
    mon_sat_timing: "सोम - शनि: सुबह 9:00 से रात 9:00"
  }
};

const serviceTranslations = {
  'Install Electrical Systems': {
    MR: {
      title: 'इलेक्ट्रिकल सिस्टम बसवणे (Install)',
      category: 'इन्स्टॉलेशन',
      priceEstimate: '₹६९९ पासून पुढे',
      duration: '२-४ तास',
      description: 'नवीन इलेक्ट्रिकल सेटअप, डिस्ट्रिब्युशन बोर्ड (DB), वायरिंग, स्विचेस, लायटिंग सिस्टीम, इन्व्हर्टर आणि उपकरणांचे व्यावसायिक इन्स्टॉलेशन.',
      features: [
        'नवीन घर व व्यावसायिक वायरिंग इन्स्टॉलेशन',
        'डिस्ट्रिब्युशन बोर्ड (DB) आणि MCB इन्स्टॉलेशन',
        'घरगुती व जड उपकरणांचे सुरक्षित कनेक्शन',
        'प्रमाणित इलेक्ट्रिशियनकडून संपूर्ण तपासणी'
      ]
    },
    HI: {
      title: 'इलेक्ट्रिकल सिस्टम इंस्टॉलेशन (Install)',
      category: 'इंस्टॉलेशन',
      priceEstimate: '₹699 से शुरू',
      duration: '2-4 घंटे',
      description: 'नए इलेक्ट्रिकल सेटअप, डिस्ट्रीब्यूशन बोर्ड (DB), वायरिंग, स्विच, लाइटिंग सिस्टम, इन्वर्टर और औद्योगिक उपकरणों का पेशेवर इंस्टॉलेशन।',
      features: [
        'नए घर और वाणिज्यिक वायरिंग इंस्टॉलेशन',
        'डिस्ट्रीब्यूशन बोर्ड (DB) और MCB इंस्टॉलेशन',
        'घरेलू और भारी उपकरणों के सुरक्षित कनेक्शन',
        'प्रमाणित इलेक्ट्रीशियन द्वारा पोस्ट-इंस्टॉलेशन चेक'
      ]
    }
  },
  'Maintain Electrical Systems': {
    MR: {
      title: 'इलेक्ट्रिकल सिस्टम देखभाल (Maintain)',
      category: 'देखभाल',
      priceEstimate: '₹४९९ पासून पुढे',
      duration: '१-३ तास',
      description: 'घरे, दुकाने आणि कारखान्यांच्या इलेक्ट्रिकल उपकरणांची नियमित देखभाल जेणेकरून आग, सैल वायर्स आणि विजेचा अपव्यय टाळता येईल.',
      features: [
        'स्विचबोर्ड व पॅनेलची सखोल तपासणी',
        'थर्मल स्पार्क चेक आणि कनेक्शन घट्ट करणे',
        'अर्थिंग आरोग्य आणि लोड वाटप तपासणी',
        'प्रतिबंधक देखभाल अहवाल व सुरक्षितता प्रमाणपत्र'
      ]
    },
    HI: {
      title: 'इलेक्ट्रिकल सिस्टम मेंटेनेंस (Maintain)',
      category: 'मेंटेनेंस',
      priceEstimate: '₹499 से शुरू',
      duration: '1-3 घंटे',
      description: 'आवासीय, वाणिज्यिक और औद्योगिक इलेक्ट्रिकल सिस्टम के लिए नियमित मेंटेनेंस ताकि शॉर्ट सर्किट और बिजली की बर्बादी से बचा जा सके।',
      features: [
        'स्विचबोर्ड और पैनल का व्यापक निरीक्षण',
        'थर्मल स्पार्क चेक और ढीले कनेक्शन ठीक करना',
        'अर्थिंग स्वास्थ्य और लोड वितरण जांच',
        'निवारक रखरखाव रिपोर्ट और सुरक्षा प्रमाणन'
      ]
    }
  },
  'Repair Electrical Systems': {
    MR: {
      title: 'इलेक्ट्रिकल दुरुस्ती (Repair)',
      category: 'दुरुस्ती',
      priceEstimate: '₹२९९ पासून पुढे',
      duration: '१-२ तास',
      description: 'शॉर्ट सर्किट, वीज ट्रिप होणे, स्पार्किंग स्विचबोर्ड, खराब केबल्स आणि बंद पडलेल्या उपकरणांची जलद आणि आपत्कालीन दुरुस्ती.',
      features: [
        'दोष शोधणे आणि तात्काळ दुरुस्त करणे',
        'जळालेले स्विच, सॉकेट व MCB बदलणे',
        'शॉर्ट सर्किट निराकरण व आपत्कालीन रिवायरिंग',
        'सर्व दुरुस्तींवर ३० दिवसांची सेवा वॉरंटी'
      ]
    },
    HI: {
      title: 'इलेक्ट्रिकल रिपेयरिंग (Repair)',
      category: 'रिपेयरिंग',
      priceEstimate: '₹299 से शुरू',
      duration: '1-2 घंटे',
      description: 'शॉर्ट सर्किट, बार-बार एमसीबी ट्रिप होना, स्पार्किंग स्विचबोर्ड और खराब वायरिंग की त्वरित आपातकालीन मरम्मत सेवा।',
      features: [
        'तेजी से फॉल्ट पहचानना और ठीक करना',
        'जले हुए स्विच, सॉकेट और MCB को बदलना',
        'शॉर्ट सर्किट समाधान और आपातकालीन रीवायरिंग',
        'सभी मरम्मत पर 30-दिन की सेवा वारंटी'
      ]
    }
  },
  'Test Electrical Systems': {
    MR: {
      title: 'इलेक्ट्रिकल तपासणी व चाचणी (Test)',
      category: 'चाचणी',
      priceEstimate: '₹३९९ पासून पुढे',
      duration: '१-२ तास',
      description: 'अर्थिंग रेझिस्टन्स, फेज व्होल्टेज बॅलन्स, इन्सुलेशन रेझिस्टन्स (मेगर टेस्ट) आणि कायदेशीर सुरक्षा नियमांची अचूक तपासणी.',
      features: [
        'अर्थिंग खड्डा रेझिस्टन्स व व्होल्टेज ड्रॉप मोजणी',
        'मेगर इन्सुलेशन रेझिस्टन्स व लिकेज करंट टेस्ट',
        'थ्री-फेज व्होल्टेज आणि लोड बॅलन्सिंग टेस्ट',
        'सविस्तर इलेक्ट्रिकल तपासणी अहवाल'
      ]
    },
    HI: {
      title: 'इलेक्ट्रिकल टेस्टिंग और निरीक्षण (Test)',
      category: 'टेस्टिंग',
      priceEstimate: '₹399 से शुरू',
      duration: '1-2 घंटे',
      description: 'अर्थिंग रेसिस्टेंस, फेज वोल्टेज बैलेंस, इंसुलेशन रेसिस्टेंस (मेगर टेस्ट) और वैधानिक सुरक्षा अनुपालन की सटीक जांच।',
      features: [
        'अर्थिंग पिट रेसिस्टेंस और वोल्टेज ड्रॉप मापन',
        'मेगर इंसुलेशन रेसिस्टेंस और लीकेज करंट टेस्ट',
        'थ्री-फेज वोल्टेज और लोड बैलेंसिंग टेस्ट',
        'विस्तृत इलेक्ट्रिकल निरीक्षण और सुरक्षा रिपोर्ट'
      ]
    }
  }
};

const heroSlideTranslations = {
  MR: [
    {
      id: 1,
      tag: '१००% अस्सल ब्रँड्स • १०-वर्षांची वॉरंटी',
      title: 'टॉप ब्रँड कॉपर वायर्स आणि मॉड्युलर स्विचगिअर',
      description: 'हॅवेल्स, पॉलीकॅब, अँकर रोमा आणि श्नायडर इलेक्ट्रिक MCB सर्वोत्तम घाऊक दरात मिळवा.',
      buttonText: 'वायर्स आणि स्विचेस खरेदी करा'
    },
    {
      id: 2,
      tag: 'प्रमाणित इलेक्ट्रिशियन आपल्या दारात',
      title: 'तज्ज्ञ घरगुती इलेक्ट्रिकल दुरुस्ती व इन्स्टॉलेशन',
      description: 'वारंवार MCB ट्रिप होणे, स्पार्किंग स्विचबोर्ड किंवा मोटर इन्स्टॉलेशन हवे आहे का? आजच आमचे प्रमाणित इलेक्ट्रिशियन बुक करा.',
      buttonText: 'आताच सेवा बुक करा (₹२९९ पासून पुढे)'
    },
    {
      id: 3,
      tag: 'विजेची ६०% बचत करणारे BLDC फॅन्स व एलईडी',
      title: 'स्मार्ट BLDC फॅन्स आणि एलईडीने विजेची बचत करा',
      description: 'क्रॉम्पटनचे रिमोट BLDC सीलिंग फॅन आणि फिलिप्सचे एलईडी दिवे आता उपलब्ध.',
      buttonText: 'फॅन्स आणि एलईडी एक्सप्लोर करा'
    }
  ],
  HI: [
    {
      id: 1,
      tag: '100% असली ब्रांड्स • 10-साल की वारंटी',
      title: 'शीर्ष ब्रांड कॉपर वायर और मॉड्यूलर स्विचगियर',
      description: 'हैवेल्स, पॉलीकैब, एंकर रोमा और श्नाइडर इलेक्ट्रिक MCB अपराजेय थोक मूल्यों पर प्राप्त करें।',
      buttonText: 'वायर और स्विच खरीदें'
    },
    {
      id: 2,
      tag: 'प्रमाणित इलेक्ट्रीशियन आपके द्वार पर',
      title: 'विशेषज्ञ घरेलू इलेक्ट्रिकल मरम्मत व इंस्टॉलेशन',
      description: 'बार-बार MCB ट्रिप होना, स्पार्किंग स्विचबोर्ड या पानी मोटर इंस्टॉलेशन? आज ही हमारे प्रमाणित इलेक्ट्रीशियन बुक करें।',
      buttonText: 'अभी सेवा बुक करें (₹299 से शुरू)'
    },
    {
      id: 3,
      tag: '60% तक बिजली बचाने वाले BLDC पंखे और एलईडी',
      title: 'स्मार्ट BLDC पंखों और एलईडी से बिजली बचाएं',
      description: 'क्रॉम्पटन के रिमोट 5-स्टार BLDC पंखे और फिलिप्स एलईडी लाइटें अब उपलब्ध।',
      buttonText: 'पंखे और एलईडी एक्सप्लोर करें'
    }
  ]
};

const whyChooseUsTranslations = {
  MR: [
    {
      title: '१००% अस्सल ब्रँड्स',
      description: 'आम्ही हॅवेल्स, पॉलीकॅब, अँकर रोमा, क्रॉम्पटन आणि श्नायडरचे अधिकृत वितरक आहोत. प्रत्येक उत्पादनावर अस्सल वॉरंटी मिळते.'
    },
    {
      title: 'प्रमाणित इलेक्ट्रिशियन',
      description: 'आमचे परवानाधारक इलेक्ट्रिशियन घरगुती वायरिंग, मोटर बसवणे आणि सुरक्षिततेची खात्री देतात.'
    },
    {
      title: 'त्याच दिवशी स्थानिक डिलिव्हरी',
      description: 'दुपारी २:०० पूर्वी ऑर्डर केल्यास मनमाड आणि आसपासच्या परिसरात त्याच दिवशी जलद डिलिव्हरी.'
    },
    {
      title: 'सुलभ रिप्लेसमेंट सपोर्ट',
      description: 'आमच्या मनमाड दुकानातून सुलभ आणि थेट वॉरंटी रिप्लेसमेंट.'
    },
    {
      title: 'आपत्कालीन ब्रेकडाऊन सेवा',
      description: 'मुख्य डीबी बोर्ड स्पार्क किंवा वॉटर पंप बिघाड झाल्यास प्राधान्याने आपत्कालीन तंत्रज्ञ पाठवले जातात.'
    },
    {
      title: 'कंत्राटदारांसाठी घाऊक दर',
      description: 'बिल्डर्स, इलेक्ट्रिकल कंत्राटदार आणि सोसायट्यांसाठी विशेष घाऊक सवलत.'
    }
  ],
  HI: [
    {
      title: '100% असली ब्रांड्स',
      description: 'हम हैवेल्स, पॉलीकैब, एंकर रोमा, क्रॉम्पटन और श्नाइडर के अधिकृत वितरक हैं। प्रत्येक उत्पाद पर प्रामाणिक वारंटी मिलती है।'
    },
    {
      title: 'प्रमाणित इलेक्ट्रीशियन',
      description: 'हमारे लाइसेंस प्राप्त इलेक्ट्रीशियन घरेलू हाउस वायरिंग, मोटर इंस्टॉलेशन और सुरक्षा की गारंटी देते हैं।'
    },
    {
      title: 'उसी दिन स्थानीय डिलीवरी',
      description: 'दोपहर 2:00 बजे से पहले ऑर्डर करने पर मनमाड और नजदीकी क्षेत्रों में उसी दिन तेज़ डिलीवरी।'
    },
    {
      title: 'ब्रांड रिप्लेसमेंट सपोर्ट',
      description: 'हमारी मनमाड दुकान से आसान और सीधी वारंटी रिप्लेसमेंट।'
    },
    {
      title: 'आपातकालीन ब्रेकडाउन सेवा',
      description: 'मेन डीबी बोर्ड स्पार्क या मोटर ब्रेकडाउन होने पर प्राथमिकता से आपातकालीन तकनीशियन उपलब्ध।'
    },
    {
      title: 'ठेकेदारों के लिए थोक दरें',
      description: 'बिल्डरों, इलेक्ट्रिकल ठेकेदारों और हाउसिंग सोसाइटियों के लिए विशेष थोक छूट।'
    }
  ]
};

const productTranslations = {
  "Havells Life Line Plus 90m Copper Wire (1.5 sq mm)": {
    MR: "हॅवेल्स लाईफ लाईन प्लस ९०मी कॉपर वायर (१.५ चौ.मिमी)",
    HI: "हैवेल्स लाइफ लाइन प्लस 90मी कॉपर वायर (1.5 वर्ग मिमी)"
  },
  "Polycab Green Wire 90m FR PVC (2.5 sq mm)": {
    MR: "पॉलीकॅब ग्रीन वायर ९०मी FR PVC (२.५ चौ.मिमी)",
    HI: "पॉलीकैब ग्रीन वायर 90मी FR PVC (2.5 वर्ग मिमी)"
  },
  "Anchor Roma Modular 10A Switch (White, Pack of 10)": {
    MR: "अँकर रोमा मॉड्युलर १०A स्विच (पांढरा, १० चा पॅक)",
    HI: "एंकर रोमा मॉड्यूलर 10A स्विच (सफेद, 10 का पैक)"
  },
  "Schneider Electric Acti9 32A Double Pole MCB": {
    MR: "श्नायडर इलेक्ट्रिक Acti9 ३२A डबल पोल MCB",
    HI: "श्नाइडर इलेक्ट्रिक Acti9 32A डबल पोल MCB"
  },
  "Philips Stellar Bright 20W LED Tube Light (Cool Day)": {
    MR: "फिलिप्स स्टेलर ब्राईट २०W एलईडी ट्यूब लाईट (कूल डे)",
    HI: "फिलिप्स स्टेलर ब्राइट 20W एलईडी ट्यूब लाइट (कूल डे)"
  },
  "Crompton Energion HS 1200mm BLDC Ceiling Fan": {
    MR: "क्रॉम्पटन एनर्जीऑन HS १२००मीमी BLDC सीलिंग फॅन",
    HI: "क्रॉम्पटन एनर्जीऑन HS 1200मिमी BLDC सीलिंग फैन"
  },
  "Kirloskar Chotu 0.5 HP Domestic Water Motor Pump": {
    MR: "किर्लोस्कर छोटू ०.५ HP घरगुती वॉटर मोटर पंप",
    HI: "किर्लोस्कर छोटू 0.5 HP घरेलू वाटर मोटर पंप"
  },
  "Havells Reo 6A Modular Socket (White, Pack of 5)": {
    MR: "हॅवेल्स रिओ ६A मॉड्युलर सॉकेट (पांढरा, ५ चा पॅक)",
    HI: "हैवेल्स रियो 6A मॉड्यूलर सॉकेट (सफेद, 5 का पैक)"
  },
  "Anchor 6-Way Metal Double Door Distribution Board (DB)": {
    MR: "अँकर ६-वे मेटल डबल डोर डिस्ट्रिब्युशन बोर्ड (DB)",
    HI: "एंकर 6-वे मेटल डबल डोर डिस्ट्रीब्यूशन बोर्ड (DB)"
  },
  "Philips 9W B22 LED Bulb (Cool Day Light, Pack of 4)": {
    MR: "फिलिप्स ९W B22 एलईडी बल्ब (कूल डे लाईट, ४ चा पॅक)",
    HI: "फिलिप्स 9W B22 एलईडी बल्ब (कूल डे लाइट, 4 का पैक)"
  },
  "Crompton InstaGlide 1000W Dry Iron": {
    MR: "क्रॉम्पटन इंस्टाग्लाईड १०००W ड्राय इस्त्री",
    HI: "क्रॉम्पटन इंस्टाग्लाइड 1000W ड्राई आयरन"
  },
  "Havells Euro II 25A 4-Way SPN Distribution Board": {
    MR: "हॅवेल्स युरो II २५A ४-वे SPN डिस्ट्रिब्युशन बोर्ड",
    HI: "हैवेल्स यूरो II 25A 4-वे SPN डिस्ट्रीब्यूशन बोर्ड"
  }
};

const categoryTranslations = {
  "Wires & Cables": {
    MR: "वायर्स आणि केबल्स",
    HI: "वायर्स और केबल्स"
  },
  "Switches & Sockets": {
    MR: "स्विचेस आणि सॉकेट्स",
    HI: "स्विच और सॉकेट"
  },
  "MCBs & Distribution Boards": {
    MR: "MCB आणि डिस्ट्रिब्युशन बोर्ड",
    HI: "MCB और डिस्ट्रीब्यूशन बोर्ड"
  },
  "Lighting & LEDs": {
    MR: "लाईटिंग आणि एलईडी",
    HI: "लाइटिंग और एलईडी"
  },
  "Fans & Ventilation": {
    MR: "फॅन्स आणि व्हेंटिलेशन",
    HI: "पंखे और वेंटिलेशन"
  },
  "Water Pumps & Motors": {
    MR: "वॉटर पंप आणि मोटर्स",
    HI: "वाटर पंप और मोटर्स"
  },
  "Home Appliances": {
    MR: "घरगुती उपकरणे",
    HI: "घरेलू उपकरण"
  }
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('navnath_lang') || 'EN';
  });

  useEffect(() => {
    localStorage.setItem('navnath_lang', language);
  }, [language]);

  const t = (key, fallback = '') => {
    const dict = translations[language] || translations['EN'];
    return dict[key] || translations['EN'][key] || fallback || key;
  };

  const tProduct = (name) => {
    if (language === 'EN' || !name) return name;
    return (productTranslations[name] && productTranslations[name][language]) || name;
  };

  const tCategory = (name) => {
    if (language === 'EN' || !name) return name;
    return (categoryTranslations[name] && categoryTranslations[name][language]) || name;
  };

  const tService = (service) => {
    if (!service) return service;
    const title = typeof service === 'string' ? service : service.title;
    if (language === 'EN' || !serviceTranslations[title] || !serviceTranslations[title][language]) {
      return service;
    }
    const localized = serviceTranslations[title][language];
    if (typeof service === 'string') {
      return localized.title;
    }
    return {
      ...service,
      title: localized.title,
      category: localized.category || service.category,
      priceEstimate: localized.priceEstimate || service.priceEstimate,
      duration: localized.duration || service.duration,
      description: localized.description || service.description,
      features: localized.features || service.features
    };
  };

  const tHeroSlide = (slideIndex, defaultSlide) => {
    if (language === 'EN' || !heroSlideTranslations[language] || !heroSlideTranslations[language][slideIndex]) {
      return defaultSlide;
    }
    const loc = heroSlideTranslations[language][slideIndex];
    return {
      ...defaultSlide,
      tag: loc.tag,
      title: loc.title,
      description: loc.description,
      buttonText: loc.buttonText
    };
  };

  const tWhyChooseUsItem = (index, defaultItem) => {
    if (language === 'EN' || !whyChooseUsTranslations[language] || !whyChooseUsTranslations[language][index]) {
      return defaultItem;
    }
    const loc = whyChooseUsTranslations[language][index];
    return {
      ...defaultItem,
      title: loc.title,
      description: loc.description
    };
  };

  const changeLanguage = (langCode) => {
    if (['EN', 'MR', 'HI'].includes(langCode)) {
      setLanguage(langCode);
    }
  };

  return (
    <LanguageContext.Provider value={{ 
      language, 
      changeLanguage, 
      t, 
      tProduct, 
      tCategory, 
      tService,
      tHeroSlide,
      tWhyChooseUsItem,
      translations 
    }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export default LanguageContext;
