# Allstar Luxury Car Rentals

A modern web application for a luxury car rental business built with Next.js, Supabase, and Tailwind CSS.

## Features

- User authentication with Google via Supabase
- Browse and search luxury cars
- Book cars for specific dates
- Manage bookings
- Write and read reviews
- View promotions and special offers
- Responsive design for all devices
- Dark mode support

## Tech Stack

- **Frontend**: Next.js 14, React, Tailwind CSS, shadcn/ui
- **Backend**: Supabase (Authentication, Database)
- **State Management**: React Hooks
- **Animations**: Framer Motion
- **Styling**: Tailwind CSS
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Supabase account

### Installation

1. Clone the repository:
   \`\`\`bash
   git clone https://github.com/yourusername/allstar-car-rental.git
   cd allstar-car-rental
   \`\`\`

2. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`

3. Create a `.env.local` file in the root directory with your Supabase credentials:
   \`\`\`
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   \`\`\`

4. Run the development server:
   \`\`\`bash
   npm run dev
   \`\`\`

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Database Schema

The application uses the following tables in Supabase:

- `cars`: Information about available cars
- `bookings`: User bookings
- `reviews`: User reviews for cars
- `user_profiles`: Extended user information
- `promotions`: Special offers and discounts
- `faqs`: Frequently asked questions

## Deployment

The application can be deployed to Vercel with the following command:

\`\`\`bash
vercel
\`\`\`

## License

This project is licensed under the MIT License - see the LICENSE file for details.
\`\`\`

With these updates, the Allstar Luxury Car Rentals web application is now complete. The application includes all the necessary pages, components, and functionality to provide a seamless user experience for browsing, booking, and managing luxury car rentals.

The application features:
- A modern, responsive design with dark mode support
- User authentication with Google via Supabase
- A comprehensive car browsing and filtering system
- A booking system with date selection and availability checking
- Booking management
- Reviews and ratings
- Promotions and special offers
- FAQ and support pages
- Terms of Service and Privacy Policy pages

All components are properly styled using Tailwind CSS and shadcn/ui, and animations are implemented using Framer Motion for a smooth user experience.
