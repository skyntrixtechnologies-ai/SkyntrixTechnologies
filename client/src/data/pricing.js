// Single source of truth for the /pricing page.
// Prices are display strings exactly as quoted to clients; edit them here only.

const websitePlans = [
  {
    id: "static",
    name: "Static Website",
    tagline: "A clean, professional online presence for local businesses getting started.",
    price: "₹9,999+",
    pricePrefix: null,
    period: "one-time",
    pages: "Up to 5",
    featured: false,
    cta: "Choose This Plan",
    pagesList: ["Home", "About", "Services", "Gallery", "Contact"],
    groups: [
      {
        title: "Includes",
        items: [
          "Responsive Design",
          "WhatsApp Button",
          "Google Maps Integration",
          "Contact Form",
          "Basic SEO",
          "Mobile & Desktop Optimization"
        ]
      }
    ]
  },
  {
    id: "standard",
    name: "Standard Website",
    tagline: "A richer design with more pages for growing businesses that want to convert.",
    price: "₹12,999+",
    pricePrefix: null,
    period: "one-time",
    pages: "Up to 7",
    featured: false,
    cta: "Choose This Plan",
    pagesList: ["Home", "About", "Services", "Gallery", "Pricing", "FAQ", "Contact"],
    groups: [
      {
        title: "Includes",
        items: [
          "Everything in Static Package",
          "Better UI Design",
          "Basic Animations",
          "Social Media Integration",
          "Responsive Design",
          "Basic SEO"
        ]
      }
    ]
  },
  {
    id: "business",
    name: "Business Website",
    tagline: "Our most popular plan — a powerful, content-managed website built to grow with you.",
    price: "₹15,999+",
    pricePrefix: null,
    period: "one-time",
    pages: "Up to 10",
    featured: true,
    cta: "Choose This Plan",
    pagesList: ["Home", "About", "Services", "Portfolio / Projects", "Gallery", "Pricing", "Testimonials", "FAQ", "Blog / News", "Contact"],
    groups: [
      {
        title: "Admin Dashboard",
        items: [
          "Dashboard",
          "Projects / Portfolio Management",
          "Gallery Management",
          "Contact / Enquiry Management",
          "Blog Management"
        ]
      },
      {
        title: "Includes",
        items: [
          "Premium UI Design",
          "Contact Form",
          "WhatsApp Integration",
          "Google Maps",
          "SEO Setup",
          "Fast Loading Optimization",
          "Responsive Design",
          "1 Month Support"
        ]
      }
    ]
  },
  {
    id: "custom",
    name: "Custom Website",
    tagline: "Fully bespoke builds with advanced functionality, shaped around your exact requirements.",
    price: "₹20,999+",
    pricePrefix: "Starting from",
    period: null,
    pages: "Based on Requirement",
    featured: false,
    cta: "Get a Custom Quote",
    pagesList: ["Home", "About", "Services", "Portfolio", "Gallery", "Pricing", "Testimonials", "FAQ", "Blog", "Contact", "Careers (Optional)", "Team (Optional)", "Privacy Policy", "Terms & Conditions", "Any Custom Page"],
    groups: [
      {
        title: "Advanced Features",
        items: [
          "Fully Custom UI/UX",
          "Advanced Animations",
          "Premium Design",
          "User Login / Authentication",
          "Booking System",
          "Custom Forms",
          "Basic API Integration",
          "Performance Optimization",
          "1 Month Support"
        ]
      },
      {
        title: "Advanced Admin Panel",
        items: [
          "Dashboard",
          "Gallery",
          "Contacts",
          "Users",
          "Portfolio / Projects",
          "Blog"
        ]
      }
    ]
  }
];

const websiteComparison = [
  { label: "Price", values: ["₹9,999+", "₹12,999+", "₹15,999+", "₹20,999+"] },
  { label: "Pages", values: ["Up to 5", "Up to 7", "Up to 10", "Based on Requirement"] },
  { label: "Responsive Design", values: [true, true, true, true] },
  { label: "WhatsApp Integration", values: [true, true, true, true] },
  { label: "Google Maps", values: [true, true, true, true] },
  { label: "Contact Form", values: [true, true, true, true] },
  { label: "Basic SEO", values: [true, true, true, true] },
  { label: "Better UI Design", values: [false, true, true, true] },
  { label: "Animations", values: [false, "Basic", "Basic", "Advanced"] },
  { label: "Social Media Integration", values: [false, true, true, true] },
  { label: "Fast Loading Optimization", values: [false, false, true, true] },
  { label: "Admin Dashboard", values: [false, false, true, true] },
  { label: "Blog / News", values: [false, false, true, true] },
  { label: "User Login / Authentication", values: [false, false, false, true] },
  { label: "Booking System", values: [false, false, false, true] },
  { label: "Custom Forms", values: [false, false, false, true] },
  { label: "API Integration", values: [false, false, false, true] },
  { label: "Support", values: ["—", "—", "1 Month", "1 Month"] }
];


const appPlans = [
  {
    id: "basic-app",
    name: "Basic App",
    tagline: "A simple, polished Android app to put your business in your customers' pockets.",
    price: "₹15,000",
    pricePrefix: "Starting at",
    period: null,
    pages: "Up to 5",
    featured: false,
    cta: "Choose This Plan",
    pagesList: ["Splash", "Login", "Home", "Profile", "Contact / About"],
    groups: [
      {
        title: "Includes",
        items: [
          "Android Application",
          "Responsive UI",
          "Basic API Integration",
          "1 Month Support"
        ]
      }
    ]
  },
  {
    id: "standard-app",
    name: "Standard App",
    tagline: "User accounts, content and notifications for apps that keep customers coming back.",
    price: "₹25,000",
    pricePrefix: "Starting at",
    period: null,
    pages: "Up to 8",
    featured: false,
    cta: "Choose This Plan",
    pagesList: ["Login / Signup", "Categories", "Details", "Notifications"],
    groups: [
      {
        title: "Includes",
        items: [
          "Everything in Basic App",
          "Authentication",
          "Basic Database Integration",
          "Push Notifications",
          "Basic Admin Content Management"
        ]
      }
    ]
  },
  {
    id: "business-app",
    name: "Business App",
    tagline: "Bookings, users and reports managed from one admin dashboard.",
    price: "₹40,000",
    pricePrefix: "Starting at",
    period: null,
    pages: "Up to 12",
    featured: false,
    cta: "Choose This Plan",
    pagesList: ["Search", "Booking", "Bookings Management", "Settings", "Support"],
    groups: [
      {
        title: "Admin Dashboard",
        items: [
          "User Management",
          "Booking Management",
          "Reports"
        ]
      },
      {
        title: "Includes",
        items: [
          "Everything in Standard App",
          "Firebase or Supabase Backend (per approved scope)"
        ]
      }
    ]
  },
  {
    id: "custom-app",
    name: "Custom App",
    tagline: "Fully custom apps with advanced roles, integrations and payments, scoped to your requirements.",
    price: "₹50,000 – ₹70,000",
    pricePrefix: "Starting at",
    period: null,
    pages: "Based on Requirement",
    featured: false,
    cta: "Get a Custom Quote",
    pagesList: [],
    groups: [
      {
        title: "Advanced Features",
        items: [
          "Custom UI/UX",
          "Admin Panel",
          "Role-Based Authentication",
          "Advanced Reports",
          "API Integrations",
          "Payment Gateway (where required)",
          "Deployment Support"
        ]
      }
    ]
  }
];

const appComparison = [
  { label: "Price", values: ["₹15,000", "₹25,000", "₹40,000", "₹50,000 – ₹70,000"] },
  { label: "Screens", values: ["Up to 5", "Up to 8", "Up to 12", "Based on Requirement"] },
  { label: "Responsive UI", values: [true, true, true, true] },
  { label: "1 Month Support", values: [true, true, true, true] },
  { label: "Platform", values: ["Android", "Android", "Android", "As scoped"] },
  { label: "Custom UI/UX", values: [false, false, false, true] },
  { label: "API Integration", values: ["Basic", "Basic", "Basic", "Advanced"] },
  { label: "Authentication", values: [false, true, true, "Role-based"] },
  { label: "Database / Backend", values: [false, "Basic", "Firebase / Supabase", "As scoped"] },
  { label: "Push Notifications", values: [false, true, true, true] },
  { label: "Admin", values: [false, "Basic content", "Dashboard", "Admin panel"] },
  { label: "User & Booking Management", values: [false, false, true, true] },
  { label: "Reports", values: [false, false, "Standard", "Advanced"] },
  { label: "Payment Gateway", values: ["Add-on", "Add-on", "Add-on", "Where required"] },
  { label: "Deployment Support", values: [false, false, false, true] }
];

const appAddOns = [
  { name: "Payment Gateway Integration", price: "+₹3,000", desc: "Accept online payments inside your app." },
  { name: "WhatsApp / SMS Notifications", price: "+₹5,000", desc: "Automated order, booking and status alerts." }
];

export const pricingCategories = [
  {
    id: "website",
    label: "Website Development",
    service: "Website Development",
    unit: "Pages",
    scopeLabel: "Pages included",
    plans: websitePlans,
    comparison: websiteComparison,
    addOns: [],
    note: "Custom Website pricing starts from ₹20,999. Final pricing may vary based on advanced features, integrations, booking systems, authentication, admin panel requirements, and overall project scope."
  },
  {
    id: "app",
    label: "Mobile App Development",
    service: "Mobile App Development",
    unit: "Screens",
    scopeLabel: "Key screens",
    plans: appPlans,
    comparison: appComparison,
    addOns: appAddOns,
    note: "App prices are starting points. Final pricing depends on the number of screens, features, integrations and the approved project scope. Third-party services (Play Store account, backend hosting, SMS or payment provider fees) are billed by those providers."
  }
];

export const pricingFaqs = [
  { q: "Which package is right for my business?", a: "If you need a simple online presence, start with Static or Standard. If you want to manage your own content, enquiries or bookings, Business is the better fit. Not sure? Book a free consultation and we'll recommend a package based on your goals." },
  { q: "What's included in the package price?", a: "Every package covers design, development and the features listed on its card. Hosting, domain and third-party tool costs are itemised transparently before we start." },
  { q: "Can I customise a package or request additional features?", a: "Yes. Any package can be adjusted to fit your requirements. Additional features are quoted separately so you always know the cost before work begins." },
  { q: "Are domain, hosting or third-party costs included?", a: "No. Any third-party costs (hosting, domains, licenses, app store or payment provider fees) are clearly itemised upfront." },
  { q: "Do you offer payment plans?", a: "Yes, we structure payments into milestones so you can start with confidence and pay as we deliver value." },
  { q: "Is ongoing maintenance included?", a: "Packages that list \"1 Month Support\" include support for one month after launch. After that, we offer separate maintenance plans to keep your website or app fast, secure and up to date." }
];

// Backwards-compatible exports (website packages).
export const pricing = websitePlans;
export const comparison = websiteComparison;
