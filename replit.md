# DOB Performance Tracker

## Overview

The DOB Performance Tracker is an internal productivity application designed for tracking team member performance across multiple content roles (voice artists, script writers, video editors, topic selectors, reporters, SEO specialists). It enables data entry for performance metrics (views, reach, engagement), automatic YouTube video information fetching, monthly ranking calculations, voice artist billing management, daily attendance tracking, and administrative controls for system configuration.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework Stack**
- **React 18** with TypeScript
- **Vite** for fast HMR and optimized builds
- **Wouter** for lightweight client-side routing

**UI Component System**
- **shadcn/ui** built on Radix UI with Tailwind CSS
- Design inspired by Material Design + Carbon Design principles for data-heavy applications
- Typography: Inter (UI), JetBrains Mono (numerical data)
- Custom design tokens in `tailwind.config.ts`

**State Management**
- **TanStack Query (React Query)** for server state management and caching
- **React Context API** for authentication state (`AuthContext`)
- **localStorage** for client-side data persistence (performance entries, admin settings)
- **sessionStorage** for authentication session management

**Key Design Patterns**
- Editable table interface with inline editing
- Automatic YouTube video metadata fetching
- Real-time ranking calculations
- Export to Excel functionality
- Persistent login system
- Role-Based Access Control (Admin and Moderator roles)
- Advanced filtering and search panel for performance data
- Employee Data and Jela Reporter Data management with inline editing and time format support

### Backend Architecture

**Server Framework**
- **Express.js** with TypeScript
- **tsx** for development, **esbuild** for production
- RESTful endpoint for YouTube video info (`POST /api/youtube/video-info`)

### Data Storage Solutions

**Current Implementation**
- **In-Memory Storage** (`MemStorage`) for user management
- **localStorage** for persistent performance entries and admin settings
- **sessionStorage** for authentication state

**Database Configuration (Prepared)**
- **Drizzle ORM** configured for PostgreSQL with schema defined in `shared/schema.ts`
- **Neon Database** serverless driver ready for integration
- Migration system configured via `drizzle.config.ts`
- Schema uses Zod for runtime validation

**Data Models**
- **PerformanceEntry**: Content metadata, role assignments, production status.
- **Employee**: Employee details, work schedule, administrative notes.
- **AdminSettings**: Current month, employee recognition messages.
- **User**: Basic user entity (id, username).

### Authentication & Authorization

**Authentication Mechanism**
- Role-based authentication (Admin, Moderator)
- Session-based authentication using `sessionStorage`
- Protected route wrapper for access control

**User Accounts**
1. **Admin Account**: User ID: `MDBD51724`, Password: `shuvo@282##` (Full access)
2. **Moderator Account**: User ID: `DOB`, Password: `dob2.0` (Limited access)

**Authorization Model - Role-Based Access Control**
- **Admin Role**: Full CRUD on all data, access to all reports and settings.
- **Moderator Role**: Can add/edit performance entries, but cannot delete, access sensitive reports, or admin settings.

## External Dependencies

- **YouTube Data API v3**: Via `googleapis` package for video metadata (title, views). Integrated via Replit Connectors for OAuth.
- **Radix UI**: Primitives for accessible UI components.
- **Tailwind CSS**: Utility-first styling framework.
- **date-fns**: Date manipulation and formatting.
- **XLSX (SheetJS)**: Excel export functionality.
- **react-hook-form** with **Zod resolvers**: Form validation.
- **Lucide React**: Icon system.
- **Replit**: Hosting platform, utilizing Replit-specific environment variables and plugins.

## Recent Changes

### October 28, 2025 - Fresh GitHub Import to Replit
**Complete Project Setup from Scratch:**
- Successfully imported GitHub project to Replit (fresh clone without config files)
- Created all missing configuration files:
  - `package.json` with all dependencies and scripts
  - `tsconfig.json` and `tsconfig.server.json` for TypeScript configuration
  - `vite.config.ts` with proper ESM support and path aliases
  - `tailwind.config.ts` with shadcn/ui theme tokens
  - `postcss.config.js` for Tailwind processing
  - `.gitignore` for version control
- Installed 448 npm packages successfully
- Fixed dependency conflicts (date-fns downgraded to v3.6.0 for compatibility)
- Configured Vite to bind to `0.0.0.0:5000` for Replit proxy compatibility
- Set up "Server" workflow running `npm run dev` on port 5000
- Configured autoscale deployment with build and preview scripts
- Application running successfully with Vite HMR enabled
- Login page rendering correctly with DOB branding
- All React components loading properly
- Currently using localStorage for data persistence (no database migration needed yet)

**Technical Details:**
- Node.js 20 installed and configured
- ESM module system with proper `__dirname` polyfills
- TypeScript paths configured: `@/*` → `client/src/*`, `@shared/*` → `shared/*`
- Frontend port: 5000 (webview), Backend: integrated Express server
- Deployment ready: autoscale configuration set for production

**UI/UX Updates:**
- Fixed layout width issues on all data pages (Dashboard, Employee Data, Jela Reporter Data, Admin Settings, Monthly Rankings)
- Changed from constrained width (max-w-screen-2xl) to full-width layout for better space utilization
- Content now properly spans the entire viewport with consistent padding

**Admin Settings Page - Major Update:**
- Added "Change Admin Login Details" section with secure credential management:
  - Current credential verification before allowing changes
  - New admin ID and password fields with confirmation
  - Password strength validation (minimum 6 characters)
  - Credentials stored in localStorage and immediately active
  
- Added "Moderator Management" section with full CRUD operations:
  - Add new moderators with name, user ID, and password
  - Edit existing moderator credentials
  - Delete moderators with confirmation dialog
  - View all moderators in organized cards showing masked passwords
  - Moderator data persists in localStorage
  
- Updated authentication system:
  - Dynamic login support for admin and moderators from localStorage
  - Default admin credentials: MDBD51724 / shuvo@282##
  - Default moderator: DOB / dob2.0
  - All new moderators can log in immediately after creation
  - Moderators have limited permissions (add/edit only, no delete or admin access)
  
**Security Features:**
- Admin Settings page is restricted to admin role only
- Moderators are automatically redirected if they try to access admin settings
- All credential changes require current password verification
- Confirmation dialogs for all destructive actions

### October 28, 2025 - Voice Artist & Daily Attendance Modules
**Two Major New Modules Added:**

**🎙️ Voice Artist Module** (Three-Tab Interface):
1. **Artist Setup Tab:**
   - Admin-only: Add, edit, and delete voice artists
   - Fields: Name, phone number, per-minute rate, notes
   - Rate field visible only to admins
   - Full CRUD operations with confirmation dialogs
   
2. **Voice Work Entry Tab:**
   - Record work entries with title, date, artist selection
   - Duration input: minutes and seconds
   - Automatic calculations: total minutes and estimated bill
   - Real-time preview of duration and cost
   - Full work history table with delete functionality
   
3. **Voice Artist Bill Tab (Admin Only):**
   - Month-based filtering for bill generation
   - Automatic grouping by artist
   - Calculates total minutes and total bill per artist
   - Grand total at bottom
   - Print-ready format with "Daily Our Bangladesh" header
   - Professional table layout for billing purposes

**📅 Daily Attendance Module:**
- Automatically pulls all employees from Employee Data
- Mark attendance for each employee with:
  - In Time / Out Time input
  - Automatic working hours calculation
  - Status dropdown (Present, Absent, Late, Half-day, Leave)
- Attendance History:
  - Month-based filtering
  - Complete attendance records table
  - Color-coded status badges
  - Export to Excel functionality
  - Print support for physical records
- Auto-status assignment based on working hours
- Data persists in localStorage under `dob_attendance`

### October 28, 2025 - Work Flow & Video Upload Time Modules
**Two Major New Modules Added:**

### October 28, 2025 - Work Flow Module Complete Redesign (MODERN UI/UX)
**Complete UI/UX overhaul with modern webapp design:**

**🔄 Work Flow Module - Modern Professional Dashboard:**
1. **Interactive Visual Task Management:**
   - Post Types (e.g., Desk Reporter, Video Editor, Mojo Reporter) displayed as bright red (#FF0000) rounded buttons
   - Click any Post Type to expand - all other Post Types fade out smoothly
   - Selected Post Type centers on screen with all related Jobs appearing radially around it
   - Jobs connected to center Post Type with animated yellow lines (#FCA311)
   - Smooth CSS animations for all transitions (fade, scale, radial expansion)
   - Close button (❌) appears on active Post Type to return to all Post Types view
   
2. **User Interaction Flow:**
   - Initial State: All Post Types shown in grid layout
   - Clicked State: Active Post Type centered, jobs spread in circular pattern
   - Jobs appear sequentially with staggered animation (0.1s delay each)
   - Connection lines animate from center outward
   - Hover effects on jobs reveal edit/delete controls (Admin only)
   
3. **Admin Controls:**
   - Add/Edit/Delete Post Types (categories)
   - Add/Edit/Delete Jobs under each Post Type
   - Inline editing with dialog modals
   - Edit and delete buttons appear on hover for better UX
   - Color-coded buttons: Blue (edit), Red (delete), Green (add job)
   
4. **Moderator & User Access:**
   - Can view and interact (click to expand/collapse Post Types)
   - Cannot add, edit, or delete any Post Types or Jobs
   - Full interaction with Notes section
   
5. **Notes Section:**
   - All users (Admin, Moderator, General) can add/edit/delete notes
   - Notes styled as yellow sticky notes with border
   - "To: [Person Name]" field and message area
   - Notes auto-save to localStorage
   - Displayed in responsive grid (1-3 columns)
   - Shows creator and timestamp
   
6. **Data Storage:**
   - `dob_work_categories`: Post Types and their Jobs
   - `dob_work_notes`: Team notes and messages
   
7. **Modern UI/UX Design:**
   - **Card-Based Layout**: Professional white cards with rounded corners (rounded-2xl)
   - **Gradient Backgrounds**: Subtle gray gradient background (from-gray-50 to-gray-100)
   - **Color Scheme**: Red gradient accents (from-red-600 to-red-500) for primary actions
   - **Shadows & Depth**: Multi-layer shadows (shadow-lg, shadow-xl, shadow-2xl) with hover effects
   - **Typography**: Clean, modern hierarchy with gradient text for headings
   - **Icons**: Lucide icons (Briefcase, Plus, Edit2, Trash2, X) for visual clarity
   - **Responsive Grid**: 1-4 columns adaptive layout (sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4)
   - **Smooth Animations**: CSS keyframe animations (fadeInUp, slideIn) with staggered delays
   - **Hover Effects**: Scale transforms, shadow transitions, opacity changes
   - **Professional Spacing**: Consistent padding (p-4, p-6, p-8) and gaps (gap-4, gap-6)
   
8. **Jobs Display - FIXED:**
   - Jobs now properly visible in responsive grid layout
   - Each job displays in modern card with gradient background
   - Clear visual hierarchy with job indicator dot
   - Edit/delete controls appear on hover (admin only)
   - Empty state messaging when no jobs exist
   
9. **Notes Section Redesign:**
   - Yellow gradient cards (from-yellow-50 to-yellow-100) for sticky note aesthetic
   - Clean creation form with labeled inputs
   - Grid layout (1-3 columns) for optimal display
   - Professional typography and spacing
   - Creator and timestamp metadata displayed
   - Smooth hover animations and transitions
   
10. **Responsive Design:**
    - Mobile: Single column, touch-friendly buttons
    - Tablet: 2-column grid for cards
    - Desktop: 3-4 column grid for optimal space usage
    - Adaptive text sizes (text-4xl lg:text-5xl)
    - Flexible padding and margins for all screen sizes

**📹 Video Upload Time Module:**
1. **Upload Schedule Management:**
   - Table with columns: Video Category, Channel (YT), Page (FB), Script/Footage Deliver Time, Upload Time
   - Admin can Add/Edit/Delete schedule rows
   - Moderators can only view
   - Auto-save data to localStorage
   
2. **Print/Export Functionality:**
   - Print-ready format with "Daily Our Bangladesh" header
   - Professional table layout for scheduling
   - Print button for physical records
   
3. **Data Storage:**
   - `dob_upload_schedules`: Video upload schedule data

**⚙️ Feature Toggle System:**
- New "Feature Control" section in Admin Settings
- Toggle switches to enable/disable:
  - Voice Artist Module
  - Daily Attendance Module
  - Work Flow Module ✨ NEW
  - Video Upload Time Module ✨ NEW
- When disabled:
  - Menu items automatically hidden from navigation
  - All data remains intact in localStorage
  - Re-enabling restores full functionality
- Purple-themed control card with clear descriptions

**Access Control:**
- Voice Artist: Admin sees rates and can manage artists; Moderator can only add work entries
- Daily Attendance: Both admin and moderator can mark attendance
- Work Flow: Admin can manage categories/jobs; All users can manage notes
- Video Upload Time: Admin can manage schedules; Moderator can view only
- Feature Toggles: Admin-only control

**Data Storage:**
- `dob_voice_artists`: Voice artist profiles
- `dob_voice_work`: Work entry records
- `dob_attendance`: Daily attendance records
- `dob_work_categories`: Work flow categories and jobs
- `dob_work_notes`: Work flow notes
- `dob_upload_schedules`: Video upload schedules
- `dob_feature_toggles`: Module enable/disable state

**UI Integration:**
- All modules added to main navigation after Performance Dashboard
- Consistent UI design with existing pages
- Full-width layout for optimal space usage
- Professional tables with borders and hover effects
- Print styles included for applicable modules
- Visual node diagrams for Work Flow module

## Setup Instructions

### Development Mode
1. Run `npm install` to install dependencies
2. Run `npm run dev` to start the development server
3. Access the app at the provided Replit URL

### Production Deployment
1. Click the "Publish" button in Replit
2. The app will build and deploy automatically using the configured autoscale deployment

### YouTube API Setup (Optional)
To enable YouTube video metadata fetching:
1. Use Replit's YouTube connector integration
2. Authenticate with your YouTube account
3. The app will automatically fetch video titles and view counts from YouTube URLs

### Database Migration (Future)
The app currently uses localStorage for data persistence. To migrate to PostgreSQL:
1. Create Drizzle ORM schema in `shared/schema.ts`
2. Run `npm run db:push` to push schema to database
3. Implement API endpoints for database operations
4. Update frontend to use API endpoints instead of localStorage