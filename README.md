# TradeHub.lk - Vehicle Leasing & Sales Platform 🚗

![TradeHub.lk](https://img.shields.io/badge/TradeHub-Vehicle%20Leasing%20Platform-blue)
![React](https://img.shields.io/badge/React-18.3.1-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-3178C6?logo=typescript)
![Vite](https://img.shields.io/badge/Vite-5.4.19-646CFF?logo=vite)

> **A comprehensive vehicle marketplace and leasing management platform for Sri Lanka.**

## 🚀 Overview

TradeHub.lk is a specialized platform for buying, selling, and leasing vehicles in Sri Lanka. It features a robust location-based filtering system (Province → District → Town), a complete leasing application workflow, AI-powered vehicle search assistant, comprehensive analytics dashboard, and a powerful responsive admin dashboard for managing operations.

## ✨ Key Features

### 🚗 Vehicle-Centric Marketplace
- **Vehicle-Only Listings**: Specialized fields for Make, Model, Year, Mileage, Fuel, Transmission, etc.
- **Advanced Filtering**: Filter by Vehicle Type (Car, SUV, Bike, etc.), Price, Year, Mileage, and more.
- **Location Intelligence**: Filter vehicles by **Province, District, and Town** with proximity sorting.
- **Real Images**: Integrated high-quality demo images for a realistic experience.
- **Popular Vehicle Brands**: Browse vehicles by brand with visual brand cards.
- **Vehicle Types**: Explore vehicles by type (Car, SUV, Van, Bike, Three-Wheeler, Truck, Bus, Heavy).

### 📝 Leasing System
- **Lease Calculator**: Real-time monthly payment calculation with adjustable down payment and interest rates.
- **Online Application**: Complete leasing application form with personal and employment details.
- **Application Management**: Track and manage lease applications with status updates.
- **PDF Export**: Download lease applications as PDF documents.
- **Smart Application Flow**: Choose between "Contact Lease Officer" or "Fill Lease Form" when applying.
- **Nearest Branch Detection**: Automatically finds and connects users to the nearest branch based on location.
- **Call Request System**: Request calls from lease officers at nearest branches.

### 🤖 AI Assistant
- **AI-Powered Chat Bot**: Intelligent vehicle search assistant on the home screen.
- **Natural Language Processing**: Understands user requirements in plain language.
- **Smart Vehicle Matching**: Finds relevant vehicles based on user queries (e.g., "Toyota car under 5 million").
- **Interactive Results**: Displays matching vehicles directly in chat with clickable cards.
- **Real-time Search**: Instant vehicle search and filtering based on natural language input.

### 📢 Advertisement System
- **Ad Banner Management**: Complete admin system for managing advertisement banners.
- **Multiple Ad Placements**: Strategic ad positions throughout the website (hero, between sections, before footer).
- **Ad Types**: Support for Banner, Rectangle, Square, and Skyscraper ad formats.
- **User-Friendly**: Users can close/dismiss ads they don't want to see.
- **Google Ads Ready**: Structure supports Google AdSense integration.
- **Demo Ads**: Pre-configured demo advertisements for testing.

### 🛡️ Admin Dashboard
- **Responsive Design**: Fully responsive admin dashboard with mobile menu support.
- **Vehicle Management**: Approve, reject, and manage vehicle listings with detailed views.
- **Application Management**: View and process lease applications with **location-based filtering**.
- **User Management**: Manage users, roles, and permissions (Super Admin, Admin, Branch Manager).
- **Branch Management**: Create and manage leasing branches across Sri Lanka with coordinates for proximity calculations.
- **Comprehensive Analytics**: Advanced analytics dashboard with detailed insights:
  - Search analytics (most searched vehicles, searches by region)
  - Vehicle view analytics (most viewed vehicles, views by region)
  - Lease application analytics (by status, region, employment, vehicle, loan duration)
  - Ad click analytics (most clicked ads, clicks by position, advertiser, region, type)
  - Traffic analytics (page views, traffic by region)
  - Regional data (popular vehicles by region)
  - Interactive data exploration with detailed modals
  - **Advanced Filtering System**: Comprehensive multi-dimensional filtering:
    - Date range filtering (preset ranges: 7d, 30d, 90d, all time + custom date range picker)
    - Location filters (Province and District with multi-level filtering)
    - User and Session filters (filter by specific user ID or session ID)
    - Vehicle filters (Type and Make for search analytics)
    - Ad filters (Ad Type and Advertiser for ad click analytics)
    - Employment status filter (for lease application analytics)
    - Loan amount range filter (Min/Max for lease applications)
    - Active filter badges with quick removal
    - Real-time chart updates based on filter combinations
    - Collapsible advanced filters section for better UX
- **Ad Management**: Complete CRUD system for managing advertisement banners:
  - Create, edit, delete ads
  - Enable/disable ads
  - Assign ads to specific positions
  - Preview ad images
  - Track ad performance
- **Mobile Menu**: Burger menu navigation for mobile devices with all admin sections accessible.

### 👤 User Features
- **User Dashboard**: Personal dashboard to manage ads, favorites, and messages.
- **Post Ad**: Easy-to-use form to post vehicle listings with **OTP verification**.
- **Mobile Verification**: OTP sent to registered mobile number for ad posting security.
- **Favorites**: Save favorite vehicles for quick access.
- **Messaging**: Communicate with sellers directly through the platform.
- **Profile Management**: Edit profile information and settings.
- **Automatic Location Detection**: Browser automatically detects user location for proximity-based sorting.

### 📱 Responsive Design
- **Mobile-First**: Fully responsive design that works seamlessly on all devices.
- **Mobile Navigation**: Hamburger menu for mobile screens with all features accessible.
- **Adaptive Layouts**: Tables convert to card layouts on mobile for better UX.
- **Touch-Friendly**: Optimized for touch interactions on mobile devices.

### 📍 Location Features
- **Automatic Location Detection**: Browser geolocation API integration for automatic user location detection.
- **Proximity Sorting**: Sort vehicle listings by distance from user location (nearest first).
- **Location-Based Branch Finding**: Automatically finds nearest branch when applying for leasing.
- **Location Analytics**: Track user locations and regional traffic patterns.

## 🔐 Login Credentials

### 👨‍💼 Admin Dashboard
To access the Admin Dashboard and manage the platform:
- **URL**: `/admin/login` (Dedicated Admin Portal)

#### Super Admin
- **Email**: `admin@tradehub.lk`
- **Password**: `admin123`
- **Role**: Super Administrator (Full Access)
- **Access**: All admin features including Users and Branches management

#### Branch Managers
Branch managers can access the Admin Portal with limited permissions:
- **Colombo Branch Manager**:
  - Email: `saman.perera@tradehub.lk`
  - Password: `branch123`
- **Gampaha Branch Manager**:
  - Email: `kamal.gunaratne@tradehub.lk`
  - Password: `branch123`
- **Kandy Branch Manager**:
  - Email: `nimal.bandara@tradehub.lk`
  - Password: `branch123`
- **Galle Branch Manager**:
  - Email: `sunil.silva@tradehub.lk`
  - Password: `branch123`
- **Kurunegala Branch Manager**:
  - Email: `chathura.liyanage@tradehub.lk`
  - Password: `branch123`

*Note: Branch managers have access to Overview, Vehicles, and Lease Applications only. Users and Branches sections are hidden.*

### 👤 Demo User
To test the "Post Ad" and "Apply for Lease" features:
- **Sign Up**: You can sign up with **ANY** email and password on the `/auth` page.
- **Recommended Demo Login**:
  - **Email**: `demo@user.com`
  - **Password**: `password123`
  *(Note: If this user doesn't exist, simply click "Sign Up" and create it instantly)*

## 📦 Installation & Setup

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd Ads_Website-
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   Navigate to `http://localhost:8080`

5. **Build for production**
   ```bash
   npm run build
   ```

## 🛠️ Tech Stack

### Frontend
- **React 18.3.1** - UI library
- **TypeScript 5.8.3** - Type safety
- **Vite 5.4.19** - Build tool and dev server
- **React Router DOM 6.30.1** - Client-side routing

### UI Framework
- **shadcn/ui** - Component library
- **Tailwind CSS 3.4.17** - Utility-first CSS
- **Radix UI** - Accessible component primitives
- **Lucide React** - Icon library

### Additional Libraries
- **React Hook Form** - Form management
- **Zod** - Schema validation
- **jsPDF** - PDF generation
- **Embla Carousel** - Carousel component with autoplay
- **TanStack Query** - Data fetching and caching
- **date-fns** - Date utilities
- **Recharts** - Advanced charting library for analytics visualizations

### State Management
- **LocalStorage** - Client-side data persistence (ready for backend integration)

## 📄 Available Routes

### Public Routes
- `/` - Homepage with hero, categories, and featured listings
- `/listings` - Browse all vehicles with advanced filters
- `/listing/:id` - Vehicle detail page
- `/auth` - Sign in / Sign up page

### Protected User Routes
- `/dashboard` - User dashboard (My Ads, Favorites, Messages, Statistics)
- `/post-ad` - Post a new vehicle listing
- `/lease-application/:vehicleId` - Apply for vehicle leasing
- `/edit-profile` - Edit user profile

### Admin Routes
- `/admin/login` - Admin login page
- `/admin` - Admin overview dashboard
- `/admin/vehicles` - Vehicle management (Approve/Reject listings)
- `/admin/applications` - Lease application management
- `/admin/users` - User management (Super Admin/Admin only)
- `/admin/branches` - Branch management (Super Admin/Admin only)
- `/admin/analytics` - Comprehensive analytics dashboard with detailed insights
- `/admin/ads` - Advertisement banner management system

## 🎨 Features Breakdown

### Homepage Features
- **Hero Section**: Eye-catching carousel with vehicle images
- **AI Assistant Chat Bot**: Intelligent vehicle search assistant accessible from home screen
- **Ad Banners**: Strategic advertisement placements throughout the page
- **Vehicle Categories**: Browse by vehicle type (Car, SUV, Van, Bike, etc.)
- **Popular Brands**: Visual brand cards with vehicle images
- **Popular Models**: Quick access to popular car models (Desktop only)
- **Featured Listings**: Highlighted vehicle listings sorted by proximity
- **Search Functionality**: Search vehicles by make, model, or type

### Listing Features
- **Advanced Filters**: 
  - Location (Province, District, Town)
  - Vehicle Type, Make/Brand, Transmission, Fuel Type
  - Condition, Year Range, Price Range, Mileage
  - Leasing Available filter
- **Sorting Options**: 
  - Most Recent
  - Price: Low to High / High to Low
  - Year: Newest First
  - Mileage: Low to High
  - Proximity (with location permission)
- **Pagination**: Navigate through large result sets
- **Responsive Cards**: Mobile-optimized vehicle cards

### Vehicle Detail Page
- **Image Gallery**: Multiple images with thumbnail navigation
- **Detailed Specifications**: Complete vehicle information
- **Lease Calculator**: Calculate monthly payments
- **Contact Seller**: Multiple contact methods (Chat, WhatsApp, Phone)
- **Smart Lease Application**: Choose between "Contact Lease Officer" or "Fill Lease Form"
  - **Contact Officer**: Automatically finds nearest branch and enables call request
  - **Fill Form**: Direct navigation to lease application form
- **Similar Vehicles**: Recommendations based on type or make

### Admin Dashboard Features
- **Overview Dashboard**: 
  - Total vehicles, applications, users statistics
  - Recent applications and vehicle postings
  - Approval rates and pending items
- **Vehicle Management**:
  - View all listings and pending approvals
  - Approve or reject vehicles with reasons
  - Search and filter vehicles
  - View vehicle details
- **Lease Application Management**:
  - View all applications with filters
  - Filter by status, location, and search
  - Approve, reject, or mark as in-review
  - Download applications as PDF
  - View detailed application information
- **Comprehensive Analytics Dashboard**:
  - **Search Analytics**: Most searched vehicles, searches by region with interactive drill-down
  - **View Analytics**: Most viewed vehicles, views by region with detailed tracking
  - **Lease Application Analytics**: 
    - Applications by status, region, employment status
    - Most applied vehicles with loan details
    - Loan duration distribution
    - Interactive data exploration with detailed modals
  - **Ad Click Analytics**:
    - Most clicked ads
    - Clicks by position, advertiser, region, and type
    - Detailed click history with user information
    - Link tracking to see where users are directed
  - **Traffic Analytics**: Page views, traffic by region
  - **Regional Data**: Popular vehicles by region
  - **Advanced Filtering System**:
    - **Date Range Filtering**: 
      - Preset ranges: Last 7 days, 30 days, 90 days, All time
      - Custom date range: Calendar picker for "From" and "To" dates
      - Real-time updates when dates change
    - **Location Filters**: 
      - Province filter (all Sri Lankan provinces)
      - District filter (enabled after selecting province)
      - Multi-level filtering with automatic updates
    - **User & Session Filters**: 
      - Filter by specific User ID
      - Filter by specific Session ID
      - Dropdowns showing up to 50 unique IDs
    - **Advanced Filters** (Collapsible Section):
      - Vehicle Type filter (for search analytics)
      - Vehicle Make filter (for search analytics)
      - Ad Type filter (banner, rectangle, square, skyscraper)
      - Advertiser filter (for ad click analytics)
      - Employment Status filter (for lease applications)
      - Loan Amount Range (Min/Max for lease applications)
    - **Active Filters Display**:
      - Visual badges showing all active filters
      - Individual remove buttons on each badge
      - "Clear All Filters" button for quick reset
    - **Filter Behavior**:
      - All filters work together (AND logic)
      - Real-time chart and metric updates
      - Filters apply to all data types (searches, views, page views, lease applications, ad clicks)
      - Preserves all interactive features and modal dialogs
  - Export and clear data options
- **Ad Management**:
  - Create, edit, delete advertisement banners
  - Enable/disable ads
  - Assign ads to specific positions (after-hero, before-featured, etc.)
  - Support for multiple ad types (Banner, Rectangle, Square, Skyscraper)
  - Image preview and validation
  - Track ad performance through analytics
- **User Management** (Super Admin/Admin only):
  - View all users
  - Create new users with roles
  - Activate or suspend users
  - Assign users to branches
- **Branch Management** (Super Admin/Admin only):
  - Create and manage branches with coordinates
  - Assign users to branches
  - View branch details and assigned users
  - Location-based branch finding for lease applications

## 📱 Mobile Features

### Responsive Admin Dashboard
- **Mobile Menu**: Burger icon menu on mobile with all admin sections
- **Card Layouts**: Tables automatically convert to cards on mobile
- **Touch-Optimized**: All buttons and interactions optimized for touch
- **Responsive Forms**: All forms adapt to mobile screen sizes

### Mobile Navigation
- **Language Selector**: Mobile language switcher in header
- **User Profile**: Quick access to user profile on mobile
- **Mobile Menu**: Full navigation menu accessible via burger icon

## 🔒 Security Features

- **Password Hashing**: Secure password storage using bcrypt-like hashing
- **OTP Verification**: Mobile number verification via OTP when posting ads
- **Rate Limiting**: Login rate limiting to prevent brute force attacks
- **Role-Based Access Control**: Different permissions for different user roles
- **Admin Protection**: Admin routes protected with authentication checks
- **Input Validation**: Form validation on all user inputs
- **XSS Protection**: Sanitized user inputs
- **Session Management**: Secure session handling with session IDs

## 📊 Demo Data

The application comes pre-seeded with realistic demo data:
- **16+ Demo Vehicles**: Including Toyota, Honda, Suzuki, Nissan, and more
- **Demo Users**: Pre-configured admin and branch manager accounts
- **Demo Applications**: Sample lease applications with various statuses
- **Demo Branches**: 5 branches across Sri Lanka with coordinates for proximity calculations
- **Demo Analytics Data**: 
  - 500+ search events
  - 800+ vehicle view events
  - 1200+ page view events
  - 300+ location events
  - 200+ lease application events
  - 150+ ad click events
- **Demo Ad Banners**: 10 pre-configured advertisement banners across different positions

*Demo data is automatically seeded on first load. You can also manually seed data from the Admin Analytics dashboard.*

## 🚀 Development

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run build:dev` - Build in development mode
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

### Project Structure
```
src/
├── components/       # Reusable UI components
│   ├── admin/       # Admin-specific components
│   └── ui/          # shadcn/ui components
├── pages/           # Page components
├── hooks/           # Custom React hooks
├── lib/             # Utility functions
├── types/           # TypeScript type definitions
└── data/            # Demo data files
```

## 📝 Notes

- **Status Capitalization**: All status values (Active, Suspended, Pending, Approved, etc.) are displayed with proper capitalization throughout the application.
- **Admin Restrictions**: Admins cannot apply for leasing when viewing vehicle ads.
- **Scroll Restoration**: Pages automatically scroll to top on navigation.
- **Responsive Design**: All pages are fully responsive and optimized for mobile, tablet, and desktop.
- **Location Services**: Users are prompted to share location for proximity-based features. Location is stored in sessionStorage.
- **Ad Dismissal**: Users can close/dismiss ads, and their preferences are saved in localStorage.
- **Analytics Tracking**: All user interactions (searches, views, clicks, applications) are tracked and stored in localStorage for analytics.
- **Advanced Analytics Filtering**: The analytics dashboard supports comprehensive multi-dimensional filtering with 10+ filter options, allowing detailed analysis of user behavior, traffic patterns, and business metrics. All filters work in combination and update charts in real-time.
- **OTP System**: OTP verification is required when posting ads. OTPs are stored in sessionStorage and expire after 5 minutes.
- **Proximity Sorting**: Vehicle listings are automatically sorted by proximity when user location is available.

## 📄 License

This project is private and proprietary.

---

**TradeHub.lk** - Sri Lanka's Premier Vehicle Leasing Platform 🇱🇰
