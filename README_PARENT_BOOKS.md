# Parent Book Management System

## Overview
This feature allows parents to view and manage books assigned to their children by teachers. Parents can accept or decline book assignments with reasons, and manage accepted books through return or loss reporting.

## Features

### 1. **View Children's Books**
- Parents can see all books assigned to their children
- Books are grouped and organized by child name
- Display includes book details:
  - Title, Author, ISBN
  - Subject and Grade level
  - Book Condition (new, good, fair, damaged, lost)
  - Assignment date

### 2. **Accept/Decline Books**
- Parents can respond to pending book assignments
- **Decline reasons include:**
  - Already Have Duplicate Copy
  - Book Appears Damaged
  - Not Relevant for Child
  - Accessibility Concerns
  - Other Reason (with custom notes)

### 3. **Manage Accepted Books**
- Return books to school
- Report books as lost
- Add notes when returning or reporting

### 4. **Filter & Track Status**
- View books by status:
  - Pending (awaiting parent response)
  - Accepted (approved by parent)
  - Declined (rejected by parent)
  - Returned (returned to school)
  - Lost (reported as lost)

## File Structure

```
src/app/main/
├── models/
│   └── book-assignment.model.ts     # Book assignment interface and types
├── services/
│   └── book-assignment.ts           # Book assignment service
└── pages/parents/parent-books/
    ├── parent-books.ts              # Component logic
    ├── parent-books.html            # Template
    └── parent-books.css             # Styles
```

## Models

### BookAssignment
```typescript
interface BookAssignment {
  id: string;
  bookId: string;
  learnerId: string;
  parentId: string;
  assignedBy: string;
  assignedDate: Date;
  status: BookAssignmentStatus; // 'pending' | 'accepted' | 'declined' | 'returned' | 'lost'
  parentResponse?: BookAssignmentResponse;
  returnDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

interface BookAssignmentResponse {
  status: 'accepted' | 'declined';
  respondedAt: Date;
  respondedBy: string;
  declineReason?: string;
  notes?: string;
}
```

## Services

### BookAssignmentService Methods

| Method | Parameters | Returns | Description |
|--------|-----------|---------|-------------|
| `getByParentId(parentId)` | parentId: string | Observable<BookAssignment[]> | Get all assignments for a parent |
| `getById(id)` | id: string | Observable<BookAssignment \| undefined> | Get single assignment |
| `getByLearnerId(learnerId)` | learnerId: string | Observable<BookAssignment[]> | Get assignments for a learner |
| `getPendingByParentId(parentId)` | parentId: string | Observable<BookAssignment[]> | Get pending assignments |
| `acceptBook(assignmentId, notes?)` | assignmentId: string, notes?: string | Observable<BookAssignment> | Accept a book assignment |
| `declineBook(assignmentId, reason, notes?)` | assignmentId: string, reason: string, notes?: string | Observable<BookAssignment> | Decline a book assignment |
| `returnBook(assignmentId)` | assignmentId: string | Observable<BookAssignment> | Return an accepted book |
| `reportLost(assignmentId)` | assignmentId: string | Observable<BookAssignment> | Report an accepted book as lost |

## Component Features

### ParentBooksComponent

**Inputs:**
- None (parentId is hardcoded as 'p1' for demo, should come from auth service in production)

**Key Methods:**
- `loadBookAssignments()` - Load books for the parent
- `getFilteredAssignments()` - Filter assignments by status
- `acceptBook(assignmentId)` - Accept a pending book
- `declineBook()` - Decline a pending book with reason
- `returnBook()` - Return an accepted book
- `reportLost(assignmentId)` - Report an accepted book as lost

**Filters:**
- All Books
- Pending Responses
- Accepted Books
- Declined Books
- Returned Books

## UI Components Used

### Buttons
- `btn-accept` - Accept book (green)
- `btn-decline` - Decline book (red)
- `btn-return` - Return book (blue)
- `btn-lost` - Report lost (orange)

### Status Badges
- `badge-pending` - Yellow (awaiting response)
- `badge-accepted` - Green (approved)
- `badge-declined` - Red (rejected)
- `badge-returned` - Blue (returned)
- `badge-lost` - Orange (reported lost)

### Modals
- **Decline Modal** - Select reason and add optional notes
- **Return Modal** - Confirm return and add optional notes

## Styling

The component uses Tailwind CSS with custom classes following the project's design system:
- Responsive grid layouts
- Color-coded status indicators
- Smooth transitions and hover states
- Mobile-optimized modals
- Accessibility-friendly color contrasts

## Integration Steps

### 1. Already Completed ✓
- ✓ Created BookAssignment model
- ✓ Created BookAssignmentService
- ✓ Created ParentBooksComponent
- ✓ Added component to MainModule
- ✓ Added routes
- ✓ Added navigation link

### 2. For Production Implementation
- [ ] Update parentId from auth service instead of hardcoded 'p1'
- [ ] Connect to real API endpoint (currently using mock data)
- [ ] Add error handling and notifications
- [ ] Add loading states and spinners
- [ ] Add confirmation dialogs for actions
- [ ] Add audit logging for parent actions

### 3. Testing Checklist
- [ ] Test accepting a book assignment
- [ ] Test declining with all decline reasons
- [ ] Test returning an accepted book
- [ ] Test reporting a book as lost
- [ ] Test filtering by status
- [ ] Test responsive design on mobile
- [ ] Test modal interactions
- [ ] Test data persistence

## Mock Data
The BookAssignmentService includes mock data with 5 sample assignments showing various statuses:
- Pending book assignment
- Accepted book assignment
- Declined book with reason
- Returned book assignment
- Another pending assignment

## Accessibility Features
- Semantic HTML structure
- Icon + text labels for actions
- Color + icon status indicators (not color-dependent)
- Keyboard navigation support
- Clear form labels
- Descriptive button text

## Browser Support
- Chrome/Chromium (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Future Enhancements
- [ ] Email notifications for parent actions
- [ ] SMS reminders for pending responses
- [ ] Book image/cover display
- [ ] Teacher communication within the app
- [ ] Book condition photos
- [ ] Export/print book list
- [ ] Bulk actions for multiple children
- [ ] Book renewal requests
