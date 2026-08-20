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
    instant_demo_access: "INSTANT DEMO ACCESS:",
    demo_customer: "Demo Customer Account",
    demo_admin: "⚡ Demo Admin Login",

    // Common Buttons & Labels
    add_to_cart: "Add to Cart",
    book_now: "⚡ Book Technician Now",
    view_details: "View Details",
    in_stock: "In Stock",
    out_of_stock: "Out of Stock",
    verified_testimonials: "VERIFIED TESTIMONIALS",
    what_customers_say: "What Our Customers Say",
    why_choose_us: "Why Choose New Navnath",
    our_legacy: "10+ Years of Electrical Trust in Manmad"
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
    instant_demo_access: "तात्काळ डेमो प्रवेश:",
    demo_customer: "डेमो ग्राहक खाते",
    demo_admin: "⚡ डेमो ॲडमिन लॉगिन",

    // Common Buttons & Labels
    add_to_cart: "कार्टमध्ये जोडा",
    book_now: "⚡ आताच तंत्रज्ञ बुक करा",
    view_details: "तपशील पहा",
    in_stock: "उपलब्ध आहे",
    out_of_stock: "स्टॉकमध्ये नाही",
    verified_testimonials: "सत्यापित ग्राहक अभिप्राय",
    what_customers_say: "आमचे ग्राहक काय म्हणतात",
    why_choose_us: "न्यू नवनाथ का निवडावे?",
    our_legacy: "मनमाडमध्ये १०+ वर्षांचा इलेक्ट्रिकल विश्वास"
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
    instant_demo_access: "इंस्टेंट डेमो एक्सेस:",
    demo_customer: "डेमो ग्राहक खाता",
    demo_admin: "⚡ डेमो एडमिन लॉगिन",

    // Common Buttons & Labels
    add_to_cart: "कार्ट में जोड़ें",
    book_now: "⚡ अभी तकनीशियन बुक करें",
    view_details: "विवरण देखें",
    in_stock: "स्टॉक में उपलब्ध",
    out_of_stock: "स्टॉक में नहीं",
    verified_testimonials: "सत्यापित ग्राहक समीक्षाएं",
    what_customers_say: "हमारे ग्राहक क्या कहते हैं",
    why_choose_us: "न्यू नवनाथ को क्यों चुनें?",
    our_legacy: "मनमाड में 10+ वर्षों का इलेक्ट्रिकल विश्वास"
  }
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

  const t = (key) => {
    const dict = translations[language] || translations['EN'];
    return dict[key] || translations['EN'][key] || key;
  };

  const tProduct = (name) => {
    if (language === 'EN' || !name) return name;
    return (productTranslations[name] && productTranslations[name][language]) || name;
  };

  const tCategory = (name) => {
    if (language === 'EN' || !name) return name;
    return (categoryTranslations[name] && categoryTranslations[name][language]) || name;
  };

  const changeLanguage = (langCode) => {
    if (['EN', 'MR', 'HI'].includes(langCode)) {
      setLanguage(langCode);
    }
  };

  return (
    <LanguageContext.Provider value={{ language, changeLanguage, t, tProduct, tCategory, translations }}>
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

