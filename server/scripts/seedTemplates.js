const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const Template = require('../models/Template');

// Load environment variables from server root
dotenv.config({ path: path.join(__dirname, '../.env') });

const sampleTemplates = [
  {
    name: 'Creative Portfolio',
    category: 'Portfolio',
    description:
      'A sleek, minimalist portfolio template designed for UI/UX designers, photographers, and creative artists. Features smooth micro-interactions, dark/light theme, and dynamic project showcases.',
    thumbnail_url:
      'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1200&q=80',
    price: 29,
    demo_url: '#demo',
    features: [
      'Interactive Case Studies Grid',
      'Smooth Parallax Scrolling',
      'Responsive Masonry Layout',
      'Integrated Contact Form',
      'Downloadable Resume Modal',
    ],
    tags: ['Portfolio', 'Creative', 'Minimal', 'Design', 'Dark Mode'],
    rating: 4.9,
  },
  {
    name: 'Modern Storefront',
    category: 'E-commerce',
    description:
      'High-converting online store template built for modern digital commerce. Includes product filters, slide-over cart drawer, seamless checkout layout, and customer reviews section.',
    thumbnail_url:
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80',
    price: 49,
    demo_url: '#demo',
    features: [
      'Slide-over Cart Drawer',
      'Instant Search with Autocomplete',
      'Multi-attribute Product Filters',
      'Stripe & PayPal Checkout Layout',
      'Customer Reviews & Ratings System',
    ],
    tags: ['Ecommerce', 'Shop', 'Retail', 'Cart', 'Checkout'],
    rating: 4.8,
  },
  {
    name: 'Analytics Dashboard',
    category: 'SaaS Dashboard',
    description:
      'Enterprise-ready SaaS administrative analytics suite with real-time charts, metric cards, role-based user management views, and exportable financial reports.',
    thumbnail_url:
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
    price: 59,
    demo_url: '#demo',
    features: [
      'Real-time KPI Metric Widgets',
      'Interactive Chart.js Visualizations',
      'Dark / Light Theme Switcher',
      'Role-based Access Control Views',
      'CSV, PDF & JSON Report Exporting',
    ],
    tags: ['SaaS', 'Dashboard', 'Analytics', 'Admin', 'Charts'],
    rating: 5.0,
  },
  {
    name: 'Product Launch',
    category: 'Landing Page',
    description:
      'A high-impact, conversion-focused landing page for mobile apps and tech hardware. Packed with interactive hero demos, feature breakdowns, social proof testimonials, and pricing tiers.',
    thumbnail_url:
      'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1200&q=80',
    price: 35,
    demo_url: '#demo',
    features: [
      'Sticky Header Call-to-Action',
      'Interactive Multi-tier Pricing Table',
      'Expandable FAQ Accordion',
      'Embedded Video Product Tour',
      'Lead Capture & Email Newsletter Form',
    ],
    tags: ['Landing Page', 'Product Launch', 'Marketing', 'SaaS', 'Startup'],
    rating: 4.7,
  },
  {
    name: 'Editorial Journal',
    category: 'Blog',
    description:
      'A refined publishing layout crafted for writers, journalists, and modern publications. Includes reading-time estimates, curated featured articles, newsletter subscription forms, and author bio pages.',
    thumbnail_url:
      'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1200&q=80',
    price: 25,
    demo_url: '#demo',
    features: [
      'Automated Reading-Time Estimator',
      'Distraction-free Typography Hierarchy',
      'Curated Featured Stories Banner',
      'Topic & Tag Filtering Navigation',
      'Author Spotlight Profile Pages',
    ],
    tags: ['Blog', 'Editorial', 'Journal', 'Publishing', 'Writing'],
    rating: 4.6,
  },
  {
    name: 'Restaurant Showcase',
    category: 'Restaurant',
    description:
      'Warm and inviting digital presence for gourmet restaurants, bistros, and cafés. Highlights seasonal menus, reservation bookings, interactive chef specials, and geolocation maps.',
    thumbnail_url:
      'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80',
    price: 39,
    demo_url: '#demo',
    features: [
      'Categorized Online Culinary Menu',
      'Direct Table Reservation Booking Modal',
      'Interactive Dish Gallery Grid',
      'Google Maps & Hours Display',
      'Private Events & Catering Booking',
    ],
    tags: ['Restaurant', 'Food', 'Bistro', 'Menu', 'Hospitality'],
    rating: 4.8,
  },
  {
    name: 'Online Learning Platform',
    category: 'Education',
    description:
      'Comprehensive LMS and educational platform template. Designed for course creators with video lessons preview, instructor profiles, student syllabus roadmaps, and progress trackers.',
    thumbnail_url:
      'https://images.unsplash.com/photo-1501504905252-473c47e087f8?auto=format&fit=crop&w=1200&q=80',
    price: 54,
    demo_url: '#demo',
    features: [
      'Modular Course Syllabus Explorer',
      'Preview Lesson Video Player',
      'Instructor Credentials & Bios',
      'Course Completion Certificate Preview',
      'Student Discussion Forum Section',
    ],
    tags: ['Education', 'LMS', 'Courses', 'E-learning', 'Academy'],
    rating: 4.9,
  },
  {
    name: 'Digital Agency',
    category: 'Agency',
    description:
      'Bold and dynamic website template for marketing firms, growth agencies, and design studios. Features client case study showcases, interactive service matrices, team spotlights, and project estimation calculators.',
    thumbnail_url:
      'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80',
    price: 45,
    demo_url: '#demo',
    features: [
      'Interactive Case Study Showcase',
      'Dynamic Services & Pricing Calculator',
      'Partner & Client Logo Ticker',
      'Team Member Portfolio Cards',
      'Step-by-step Project Inquiry Flow',
    ],
    tags: ['Agency', 'Business', 'Marketing', 'Consulting', 'Creative'],
    rating: 4.9,
  },
];

const seedDatabase = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      throw new Error('MONGODB_URI is not defined in server/.env');
    }

    console.log('[Seed] Connecting to MongoDB...');
    await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 5000 });
    console.log('[Seed] Connected successfully.');

    console.log(`[Seed] Upserting ${sampleTemplates.length} realistic template records...`);

    let seededCount = 0;
    for (const templateData of sampleTemplates) {
      const result = await Template.findOneAndUpdate(
        { name: templateData.name },
        { $set: templateData },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
      if (result) seededCount++;
      console.log(`  -> Seeded/Updated: "${templateData.name}" (${templateData.category})`);
    }

    console.log(`[Seed] Successfully seeded ${seededCount} templates!`);
    await mongoose.disconnect();
    console.log('[Seed] Database connection closed.');
    process.exit(0);
  } catch (error) {
    console.error(`[Seed Error] Failed to seed templates: ${error.message}`);
    process.exit(1);
  }
};

seedDatabase();
