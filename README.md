# PropEase CRM - Production Grade Real Estate Management System

A fully functional, production-grade Real Estate CRM built with React.js, JavaScript, TailwindCSS, and Vite.

## Features

### Core Functionality
- **Role-Based Access Control**: Admin and Employee roles with different permissions
- **Project Management**: Create, manage, and track real estate projects with multi-step registration
- **Enquiry Management**: Track client enquiries with follow-up management
- **Booking System**: Visual floor plan with unit booking and registration
- **Payment Tracking**: Disbursement management and payment recording
- **Client Management**: Comprehensive client profiles and history
- **Notifications**: Real-time notifications for follow-ups and payments
- **User Management**: Admin can manage system users and agents
- **Settings**: Configurable organization and notification settings

### Pages Implemented
1. **Dashboard** - Overview with statistics and charts
2. **Projects** - Project listing and management
3. **Project Registration** - 6-step wizard for new projects
4. **Project Details** - Comprehensive project information with tabs
5. **Enquiry Book** - Manage client enquiries
6. **Follow-Up Management** - Track and manage follow-ups
7. **Bookings** - Visual floor plan with unit booking
8. **Clients** - Client management and profiles
9. **Payments** - Disbursement and payment tracking
10. **Notifications** - Notification center
11. **Users** - User management (Admin only)
12. **Settings** - System settings (Admin only)

## Tech Stack

- **Frontend**: React.js 18+
- **Language**: JavaScript (ES6+)
- **Styling**: TailwindCSS
- **Build Tool**: Vite
- **Routing**: React Router v6
- **State Management**: React Context API
- **Charts**: Recharts
- **Icons**: Lucide React
- **Data Persistence**: localStorage

## Getting Started

### Installation

\`\`\`bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
\`\`\`

## Demo Credentials

### Admin Account
- **Email**: admin@propease.test
- **Password**: 1234
- **Role**: ADMIN (Full access to all features)

### Agent Accounts
- **Email**: agent@propease.test
- **Password**: 1234
- **Role**: EMPLOYEE (Limited access)

- **Email**: sarah@propease.test
- **Password**: 1234
- **Role**: EMPLOYEE

- **Email**: mike@propease.test
- **Password**: 1234
- **Role**: EMPLOYEE

## Project Structure

\`\`\`
src/
├── pages/              # Page components
├── components/         # Reusable UI components
│   ├── ui/            # Base UI components
│   └── layout/        # Layout components
├── contexts/          # React Context providers
├── utils/             # Helper functions and constants
├── data/              # Seed data
└── App.jsx            # Main app component
\`\`\`

## Key Features

### Authentication
- Static credential-based login
- Role-based access control
- Session persistence with localStorage

### Data Management
- All data stored in localStorage
- Automatic persistence on every CRUD operation
- Seed data with realistic test data

### UI Components
- 20+ reusable components
- Toast notifications
- Modal dialogs
- Drawers
- Tables with pagination and sorting
- Forms with validation
- Charts and visualizations

### Responsive Design
- Mobile-first approach
- Responsive grid layouts
- Collapsible sidebar
- Adaptive components

## Validation Rules

### Forms
- Email format validation
- Phone number (10 digits)
- PAN format (ABCDE1234F)
- Aadhar format (12 digits)
- Maharera number format (12 alphanumeric)
- Date range validation
- Required field validation

### Business Logic
- Disbursement percentages must total 100%
- Payment amounts cannot exceed disbursement values
- Unit status transitions (VACANT → BOOKED → REGISTERED)
- Role-based access restrictions

## Data Model

The application uses a comprehensive data model with the following entities:
- Organization
- Projects
- Users (Admin, Employee)
- Clients
- Wings & Floors
- Flats (Units)
- Enquiries
- Bookings
- Follow-ups
- Disbursements
- Payments
- Notifications
- Documents
- Bank Details

## localStorage Schema

\`\`\`javascript
{
  "propease_auth": { userId, role, email },
  "propease_data": {
    organization: {},
    projects: [],
    users: [],
    clients: [],
    enquiries: [],
    bookings: [],
    followUps: [],
    followUpNodes: [],
    wings: [],
    floors: [],
    flats: [],
    amenities: [],
    disbursements: [],
    clientDisbursements: [],
    bankDetails: [],
    documents: [],
    notifications: [],
    activityLog: []
  }
}
\`\`\`

## Seed Data

The application comes with realistic seed data including:
- 3 projects (Sunrise Apartments, Green Valley Residency, Royal Heights)
- 10 clients with complete details
- 40 units across 2 wings with various statuses
- 5 disbursements per project
- Sample enquiries, bookings, and follow-ups
- 15 notifications

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Performance Optimizations

- Memoized selectors with useMemo
- Debounced search
- Lazy loading of components
- Efficient re-renders with React.memo
- Optimized localStorage operations

## Future Enhancements

- Backend API integration
- Real authentication system
- Email notifications
- PDF generation for documents
- Advanced reporting and analytics
- Multi-language support
- Dark mode
- Mobile app

## License

Proprietary - PropEase Real Estate

## Support

For issues or questions, contact the development team.
