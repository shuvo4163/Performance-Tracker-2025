# DOB Performance Tracker - Design Guidelines

## Design Approach
**System**: Material Design + Carbon Design System (Enterprise Data Application)
**Rationale**: Internal productivity tool requiring clear data visualization, efficient workflows, and professional aesthetics. Emphasizes information hierarchy, scannable tables, and quick data entry over visual flourish.

## Core Design Principles
1. **Data Clarity First**: Every design decision prioritizes readability and quick data scanning
2. **Efficient Workflows**: Minimize clicks and cognitive load for frequent tasks
3. **Professional Restraint**: Clean, focused interface without distracting elements
4. **Contextual Actions**: Tools and controls appear where users need them

---

## Typography System

**Font Family**: 
- Primary: Inter (Google Fonts) - exceptional readability in tables and forms
- Monospace: JetBrains Mono - for numerical data and IDs

**Hierarchy**:
- Page Titles: text-2xl font-semibold (Login, Dashboard, Rankings, Admin)
- Section Headers: text-lg font-medium (Monthly Rankings, Top Performers)
- Table Headers: text-sm font-semibold uppercase tracking-wide
- Table Data: text-sm font-normal
- Labels/Metadata: text-xs font-medium
- Button Text: text-sm font-medium

---

## Layout System

**Spacing Primitives**: Tailwind units of **2, 4, 6, 8, 12, 16**
- Micro spacing (gaps, padding): 2, 4
- Component spacing: 6, 8
- Section spacing: 12, 16

**Container Strategy**:
- Login Screen: max-w-md centered
- Dashboard: max-w-screen-2xl (accommodate 12-column table)
- Modal Dialogs: max-w-2xl
- Side Panels (Admin Settings): w-96

**Grid System**:
- Main Layout: Full-width application shell with fixed header
- Table Layout: Horizontal scroll for 12 columns on smaller screens, full display on large
- Ranking Cards: grid-cols-1 md:grid-cols-2 lg:grid-cols-4

---

## Component Library

### 1. Authentication
**Login Screen**:
- Centered card (p-8, rounded-lg, shadow-xl)
- App logo/title at top (mb-8)
- Form fields stacked vertically (space-y-4)
- Input fields: h-12, px-4, rounded-md, border
- Login button: w-full, h-12, rounded-md, font-medium
- Error messages: text-sm below inputs, red treatment

### 2. Application Shell
**Header** (h-16, fixed top, shadow-sm):
- Left: App title and breadcrumb
- Right: Current user display, month selector, logout button
- Horizontal padding: px-6

**Navigation Tabs** (below header):
- Horizontal tab bar (border-b)
- Tab items: px-6 py-3, hover and active states with bottom border indicator
- Tabs: Dashboard | Monthly Rankings | Admin Settings

### 3. Dashboard - Data Table
**Table Container**:
- Outer wrapper: rounded-lg border, shadow-sm
- Table: w-full with overflow-x-auto
- Sticky header row with shadow on scroll

**Table Structure**:
- Header cells: px-4 py-3, border-b-2
- Data cells: px-4 py-3, border-b, editable cells have subtle hover indicator
- Row height: h-14 for comfortable editing
- Zebra striping: alternate row background treatment
- SL column: w-16 (fixed narrow)
- Link column: w-64 (wider for URLs)
- Other columns: flex-1 min-w-32

**Editable Cell Pattern**:
- Default state: appears as static text
- Hover: cursor-pointer with subtle background change
- Active/Editing: inline input field, border highlight, auto-focus
- Save indicator: checkmark animation on blur

### 4. Action Buttons
**Primary Actions** (top-right of table):
- Add New Entry: px-6 py-2.5, rounded-md, font-medium, with "+" icon
- Export to Excel: px-6 py-2.5, rounded-md, with download icon
- Spacing: gap-3 in flex container

**Row Actions** (per table row):
- Delete icon button: w-8 h-8, rounded hover state, appears on row hover

### 5. Monthly Rankings
**Month Selector**:
- Dropdown: h-12, px-4, rounded-md, border, positioned at top of section

**Category Sections** (Script Writer, Video Editor, Mojo Reporter, Jela Reporter):
- Each category in grid layout
- Section header: text-lg font-medium, mb-4
- Top 2 performers displayed as cards

**Ranking Cards**:
- Card: p-6, rounded-lg, shadow-md
- Badge position: top-right corner for 1st/2nd place
- Employee name: text-xl font-semibold
- Stats: text-sm with label/value pairs (space-y-2)
- Entry count or score: large prominent number

**Employee of the Month Badge**:
- 1st place: Gold badge treatment, larger card
- 2nd place: Silver badge treatment
- Badge: Circular or shield icon with "1st" or "2nd" text

### 6. Printable Report
**Print Layout**:
- Clean white background, remove shadows
- Logo/header at top
- Month/year prominently displayed
- Rankings presented in clean table format
- Summary statistics in grid
- Print button: fixed position bottom-right with print icon

### 7. Admin Settings Panel
**Settings Container**: p-8, space-y-8

**Setting Sections**:
- Section title: text-lg font-medium, mb-4
- Reset Data: Danger zone with red accent, confirmation modal required
- Set Current Month: Dropdown selector + Save button
- Customize Message: Textarea (h-32), character counter, Save button

**Confirmation Modal**:
- Backdrop: semi-transparent overlay
- Modal: max-w-md, p-6, rounded-lg, shadow-2xl
- Title: text-xl font-semibold
- Message: text-sm, mb-6
- Actions: Cancel (secondary) + Confirm (danger) buttons, gap-3

### 8. Empty States
**No Data State** (empty table):
- Centered container in table area
- Icon: Large illustrative icon (mb-4)
- Heading: "No entries yet"
- Description: "Click Add New Entry to get started"
- CTA: Add New Entry button

### 9. Loading & Feedback
**Loading States**:
- Fetching YouTube data: Inline spinner in Link column
- Saving data: Subtle checkmark animation
- Loading table: Skeleton rows (h-14, animated pulse)

**Toast Notifications** (fixed bottom-right):
- Success: Checkmark icon, "Data saved"
- Error: Alert icon, error message
- Info: Info icon, status updates
- Size: px-4 py-3, rounded-md, shadow-lg
- Auto-dismiss: 3 seconds

---

## Interaction Patterns

**Data Entry Flow**:
1. Click "Add New Entry" → New row appears at top
2. Click Link cell → Paste YouTube/Facebook URL → Auto-fetch triggers
3. Click other cells → Inline edit mode → Click outside or press Enter to save
4. Auto-save: 500ms debounce after editing stops

**Keyboard Navigation**:
- Tab: Move between editable cells
- Enter: Save current cell, move to next row same column
- Escape: Cancel editing, revert changes

**YouTube Data Fetch**:
- Loading indicator in Link cell during fetch
- Success: Title and Views populate automatically, subtle highlight animation
- Error: Red border on Link cell, tooltip with error message

---

## Responsive Behavior

**Desktop (≥1024px)**: Full 12-column table visible, no scrolling
**Tablet (768-1023px)**: Horizontal scroll for table, sticky first column
**Mobile (<768px)**: Card-based view instead of table, stackable entries

---

## Accessibility
- All interactive elements keyboard accessible
- Focus indicators: 2px offset ring on all focusable elements
- ARIA labels on icon buttons
- Table headers properly associated with data cells
- Form labels explicitly linked to inputs
- Contrast ratios meeting WCAG AA standards

---

## Images
**Login Screen**: Background pattern or subtle gradient (optional decorative element)
**No hero images required** - This is a functional dashboard application, not a marketing site