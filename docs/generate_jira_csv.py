#!/usr/bin/env python3
"""Generate Jira-importable CSVs: parents (Stories) + consolidated tasks."""

import csv

# Parent stories with consolidated tasks
ISSUES = [
    {
        "key": "PUR-1",
        "summary": "[FE] User Registration Flow",
        "description": "As a user, I want to create an account so that I can save events and itineraries.\n\nThis ticket covers the complete user registration flow including form input, validation, backend integration, error handling, and post-registration navigation.\n\nAcceptance Criteria:\n- User can enter required registration details (name, email, password, confirm password)\n- Validation errors are shown for invalid input\n- Backend validation errors are displayed to the user (e.g., duplicate email)\n- Loading state is shown during form submission\n- Account is successfully created and auth tokens are stored securely\n- User is redirected appropriately after successful registration",
        "priority": "Medium",
        "labels": "auth registration mvp",
        "tasks": [
            {
                "summary": "Implement registration form with client-side validation",
                "description": "Build the registration form with all required fields and validation logic.\n\n- Implement form with name, email, password, confirm password fields\n- Add client-side validation: required fields, email format, password strength, password match\n- Submit with all valid fields -> Account created, user redirected\n- Submit with empty required fields -> Validation error shown for each field\n- Submit with invalid email format -> Invalid email error displayed\n- Submit with password < minimum length -> Password length validation error shown\n- Submit with mismatched passwords -> Passwords do not match error shown\n- Form shake animation triggers on validation error\n- Password visibility toggle works\n- Form is scrollable on small screens",
            },
            {
                "summary": "Integrate signUp mutation with error handling and redirect",
                "description": "Connect the registration form to the backend signUp GraphQL mutation.\n\n- Integrate with backend signUp GraphQL mutation (firstName, lastName, email, password)\n- Handle and display backend error responses (e.g., duplicate email -> 'Email already exists')\n- Show loading state during submission, prevent double-submit\n- Store auth tokens securely in expo-secure-store on success\n- Implement post-registration redirect logic\n- Network failure during submission -> User-friendly error message\n- Backend returns unexpected error -> Generic error message, no crash\n- Password is not logged to console",
            },
            {
                "summary": "Write unit and integration tests for registration flow",
                "description": "Write tests covering the registration form, validation, and mutation integration.\n\n- Unit tests for form validation logic\n- Integration tests for signUp mutation\n- Test error state rendering\n- Test loading state behavior\n- Cross-platform verification (iOS/Android)",
            },
        ],
    },
    {
        "key": "PUR-1-BE",
        "summary": "[BE] User Registration API",
        "description": "As a backend service, I need to provide a secure user registration endpoint so that the frontend can create new user accounts.\n\nThis ticket covers the backend implementation of the signUp GraphQL mutation including user creation, password hashing, token generation, and profile initialization.\n\nAcceptance Criteria:\n- signUp mutation accepts email, password, firstName, lastName\n- Password is hashed before storage\n- Duplicate email returns USER_EXISTS error\n- User profile is auto-created on registration\n- Access and refresh tokens are generated\n- Session is created and tracked\n- Response includes authPayload with user data",
        "priority": "Medium",
        "labels": "auth registration backend mvp",
        "tasks": [
            {
                "summary": "Verify signUp mutation and user creation flow",
                "description": "Verify the complete signUp mutation flow works correctly.\n\n- Verify signUp mutation arguments (email, password, firstName, lastName) and response shape\n- Verify password is hashed before storage (not plaintext)\n- Verify duplicate email returns USER_EXISTS error\n- Verify UserProfile signal creates profile with default values\n- Verify JWT access/refresh token generation with correct expiry\n- Verify RefreshToken storage and session tracking\n- Full signUp flow creates User, UserProfile, Session, RefreshToken atomically",
            },
            {
                "summary": "Write pytest unit tests for signUp mutation",
                "description": "Write comprehensive tests for the signUp resolver.\n\n- signUp with valid data -> User created, tokens returned\n- signUp with existing email -> USER_EXISTS error\n- signUp with missing required fields -> Validation error\n- signUp with invalid email format -> Validation error\n- Password stored as hash, not plaintext\n- UserProfile created with default values\n- Generated tokens are valid and can authenticate",
            },
        ],
    },
    {
        "key": "PUR-2-BE",
        "summary": "[BE] User Login/Logout API",
        "description": "As a backend service, I need to provide secure login and logout endpoints so that users can authenticate and manage their sessions.\n\nAcceptance Criteria:\n- signIn mutation validates email and password\n- Invalid credentials return INVALID_CREDENTIALS error\n- Deactivated accounts return ACCOUNT_DEACTIVATED error\n- Access and refresh tokens are generated\n- Session is created with device info\n- Existing valid refresh tokens are reused\n- signOut clears session/tokens",
        "priority": "Medium",
        "labels": "auth login logout backend mvp",
        "tasks": [
            {
                "summary": "Verify signIn/signOut mutations and session management",
                "description": "Verify the complete authentication flow.\n\n- Verify signIn mutation validates credentials correctly\n- signIn with valid credentials -> Tokens returned\n- signIn with wrong password -> INVALID_CREDENTIALS error\n- signIn with non-existent email -> INVALID_CREDENTIALS error\n- signIn with deactivated account -> ACCOUNT_DEACTIVATED error\n- Verify session creation with device_info from User-Agent and IP\n- Verify refresh token reuse for existing valid tokens\n- Verify signOut invalidates session and clears tokens\n- Access token has correct short-lived expiry\n- Refresh token has 30-day expiry",
            },
            {
                "summary": "Write pytest unit tests for signIn/signOut",
                "description": "Write comprehensive tests for authentication resolvers.\n\n- Test all signIn success and failure scenarios\n- Test signOut invalidates session\n- Test token generation and validation\n- Test multiple sessions per user\n- Test session token uniqueness",
            },
        ],
    },
    {
        "key": "PUR-2",
        "summary": "[FE] User Login/Logout Flow",
        "description": "As a user, I want to log in and log out so that I can securely access my data.\n\nAcceptance Criteria:\n- User can log in with valid credentials\n- Invalid login shows error message\n- Session persists while active (tokens stored securely)\n- User can log out successfully\n- After logout, user cannot access protected routes",
        "priority": "Medium",
        "labels": "auth login logout mvp",
        "tasks": [
            {
                "summary": "Implement login form with validation and signIn integration",
                "description": "Build the login form and connect to the signIn mutation.\n\n- Create login form with email/password fields and client-side validation\n- Integrate signIn GraphQL mutation via AuthProvider\n- Login with valid credentials -> User authenticated, redirected to home/onboarding\n- Login with invalid email format -> Validation error displayed\n- Login with wrong password -> Error message: Invalid email or password\n- Login with non-existent account -> Error message displayed\n- Email with whitespace -> Trimmed before submission\n- Empty fields -> Validation errors shown\n- Loading spinner during authentication, prevent rapid taps\n- Network failure -> User-friendly error displayed",
            },
            {
                "summary": "Implement session persistence and logout flow",
                "description": "Handle session persistence and secure logout.\n\n- Tokens stored in expo-secure-store (not AsyncStorage)\n- Close and reopen app while logged in -> Session persists\n- Close and reopen app after logout -> User remains logged out\n- signOut function clears tokens, user state, and Apollo cache\n- After logout, protected routes redirect to auth screen\n- Network failure during logout -> Still clears local state\n- Password not logged to console\n- Write unit and integration tests for login/logout flows",
            },
        ],
    },
    {
        "key": "PUR-3",
        "summary": "[FE] Browse Event Listings",
        "description": "As a user, I want to view a list of events so that I can discover activities near me.\n\nAcceptance Criteria:\n- Event list displays from GraphQL API\n- Each event shows basic info (title, date, location, image)\n- Loading state is present during data fetch\n- Empty state is handled gracefully\n- Events are browsable",
        "priority": "High",
        "labels": "events discovery mvp",
        "tasks": [
            {
                "summary": "Define Event types, GraphQL query, and hooks",
                "description": "Set up the data layer for events.\n\n- Define Event type/interface in graphql/types.ts\n- Create GET_EVENTS GraphQL query for fetching events\n- Generate types with graphql-codegen\n- Create useEvents hook in graphql/hooks.ts",
            },
            {
                "summary": "Create EventCard and EventList screen with loading and empty states",
                "description": "Build the events browsing UI.\n\n- Create EventCard component (components/Cards/EventCard.tsx) showing title, date, location, image\n- Create EventList screen (screens/Events/EventList.tsx)\n- Add Events route to navigation\n- Implement loading state with skeleton/spinner\n- Implement empty state when no events available\n- Events with missing optional fields display gracefully\n- Events with very long titles truncate properly\n- Events with no image show placeholder\n- Images load progressively (no layout shift)\n- Scrolling through long list works smoothly\n- Write unit tests for EventCard and EventList",
            },
        ],
    },
    {
        "key": "PUR-3-BE",
        "summary": "[BE] Events API - List Events",
        "description": "As a backend service, I need to provide an API endpoint to fetch events so that users can browse available activities.\n\nAcceptance Criteria:\n- Event model created with required fields\n- getEvents GraphQL query returns list of events\n- Events can be filtered by category (optional)\n- Events ordered by date (upcoming first)\n- Only active events returned\n- Response includes all event details for display",
        "priority": "High",
        "labels": "events discovery backend mvp",
        "tasks": [
            {
                "summary": "Create Event model with GraphQL query and admin registration",
                "description": "Build the Event data layer.\n\n- Create Event model (id, title, description, image, start_date, end_date, location_name, coordinates, category FK, price, is_free, is_featured, is_active, timestamps)\n- Create and run migrations\n- Register Event in Django admin for admin creation\n- Create EventType GraphQL type\n- Create getEvents query with optional category filter\n- Events ordered by start_date ascending\n- Only active (is_active=True) events returned\n- getEvents returns empty list when no events exist",
            },
            {
                "summary": "Add seed data and write pytest unit tests",
                "description": "Create test data and verify the query.\n\n- Add seed data management command for testing\n- getEvents returns list of active events\n- getEvents with category filter returns filtered results\n- Inactive events not returned\n- Category relationship resolves correctly\n- Query handles empty database gracefully",
            },
        ],
    },
    {
        "key": "PUR-4",
        "summary": "[FE] Event Detail View",
        "description": "As a user, I want to view details of an event so I can decide if I'm interested.\n\nAcceptance Criteria:\n- Clicking/tapping event card opens detail view\n- Detail view displays: title, description, date, time, location, category, image, price\n- Back navigation available and works correctly\n- Loading state while fetching event details\n- Error state if event not found or fetch fails",
        "priority": "High",
        "labels": "events detail mvp",
        "tasks": [
            {
                "summary": "Create EventDetail screen with navigation and data fetching",
                "description": "Build the event detail view.\n\n- Create EventDetail screen (screens/Events/EventDetail.tsx)\n- Add EventDetail route to navigation with event ID param\n- Create GET_EVENT query for single event fetch\n- Create useEvent hook in graphql/hooks.ts\n- Implement EventDetail UI with all event fields (title, description, date/time, location, category, image, price/'Free')\n- Implement back navigation (button and gesture)\n- Add loading state while fetching\n- Add error state if event not found or fetch fails\n- Wire up navigation from EventCard to EventDetail\n- Event with missing optional fields displays gracefully\n- Event with very long description scrolls properly\n- Event with no image shows placeholder\n- Write unit tests for EventDetail screen",
            },
        ],
    },
    {
        "key": "PUR-4-BE",
        "summary": "[BE] Event Detail API - Get Single Event",
        "description": "As a backend service, I need to provide an API endpoint to fetch a single event by ID.\n\nAcceptance Criteria:\n- getEvent query accepts event ID parameter\n- Returns complete event object with all fields\n- Includes resolved category relationship\n- Returns null/error for non-existent event ID\n- Inactive events return appropriate response",
        "priority": "High",
        "labels": "events detail backend mvp",
        "tasks": [
            {
                "summary": "Create getEvent query with resolver and edge case handling",
                "description": "Implement the single event query.\n\n- Create getEvent query in GraphQL schema accepting event ID\n- Implement getEvent resolver returning full Event object\n- Ensure category relationship resolves\n- Handle non-existent event ID -> returns null/error\n- Handle inactive event ID -> returns null/error\n- Query validates ID format and handles malformed ID\n- Write pytest unit tests for all scenarios",
            },
        ],
    },
    {
        "key": "PUR-5",
        "summary": "[FE] Save/Unsave Events",
        "description": "As a user, I want to save events so I can reference them later.\n\nAcceptance Criteria:\n- User can save an event (tap save icon/button)\n- User can unsave a previously saved event\n- Save state visually indicated on event cards\n- Saved state persists across app sessions\n- User can view list of all saved events\n- Loading state during save/unsave action",
        "priority": "High",
        "labels": "events save mvp",
        "tasks": [
            {
                "summary": "Create save/unsave mutations, hooks, and SavedEvents screen",
                "description": "Build the save events data layer and screen.\n\n- Create SAVE_EVENT and UNSAVE_EVENT GraphQL mutations\n- Create GET_SAVED_EVENTS query\n- Create useSaveEvent hook with optimistic updates\n- Create SavedEvents screen (screens/Events/SavedEvents.tsx)\n- Add SavedEvents route to navigation",
            },
            {
                "summary": "Add save button to EventCard and EventDetail with cache updates",
                "description": "Implement the save UI and state management.\n\n- Add save icon/button to EventCard component\n- Add save icon/button to EventDetail screen\n- Tap save on unsaved event -> Event saved, icon updates instantly\n- Tap save on saved event -> Event unsaved, icon updates instantly\n- Save state syncs between EventCard and EventDetail views\n- Update Apollo cache on save/unsave\n- UI reverts if mutation fails\n- Rapid save/unsave taps -> Debounced, no duplicate requests\n- Network failure during save -> Show error, revert UI state\n- Write unit tests for save functionality",
            },
        ],
    },
    {
        "key": "PUR-5-BE",
        "summary": "[BE] Save Events API",
        "description": "As a backend service, I need to provide API endpoints for saving and unsaving events.\n\nAcceptance Criteria:\n- SavedEvent model links User to Event\n- saveEvent mutation adds event to user's saved list\n- unsaveEvent mutation removes event from saved list\n- getSavedEvents query returns user's saved events\n- Duplicate save attempts handled gracefully\n- All endpoints require authentication",
        "priority": "High",
        "labels": "events save backend mvp",
        "tasks": [
            {
                "summary": "Create SavedEvent model with mutations and queries",
                "description": "Build the saved events data layer.\n\n- Create SavedEvent model (user FK, event FK, saved_at)\n- Create and run migrations\n- Add unique constraint (user + event) to prevent duplicates\n- Create saveEvent mutation -> creates SavedEvent record\n- saveEvent with already saved event -> No duplicate, success response\n- Create unsaveEvent mutation -> removes SavedEvent record\n- unsaveEvent with non-saved event -> Success (idempotent)\n- Create getSavedEvents query -> returns only user's saved events\n- Add is_saved computed field to Event type for current user\n- All endpoints require authentication\n- Cascade delete when event deleted\n- Write pytest unit tests",
            },
        ],
    },
    {
        "key": "PUR-6",
        "summary": "[FE] View Saved Events List",
        "description": "As a user, I want to see my saved events so I can plan with them.\n\nAcceptance Criteria:\n- Saved events list displays all user's saved events\n- Empty state shown when no saved events\n- Each saved event card is tappable\n- Tapping navigates to EventDetail\n- Pull-to-refresh updates the list\n- Loading state during fetch",
        "priority": "Medium",
        "labels": "events saved mvp",
        "tasks": [
            {
                "summary": "Implement SavedEvents list with navigation and loading states",
                "description": "Build the saved events browsing experience.\n\n- Implement SavedEvents list UI reusing EventCard components\n- Implement empty state with helpful message/CTA\n- Tapping event card navigates to EventDetail with correct data\n- Back from EventDetail returns to SavedEvents list\n- Implement pull-to-refresh functionality\n- Add loading skeleton/spinner\n- Handle error state with retry option\n- Unsaving from detail removes from list on return\n- User unsaves last event -> Empty state appears\n- Event deleted by admin -> Handled gracefully (filtered out)\n- Write unit tests for SavedEvents screen",
            },
        ],
    },
    {
        "key": "PUR-6-BE",
        "summary": "[BE] Saved Events Query Enhancements",
        "description": "As a backend service, I need to provide an optimized query for fetching saved events.\n\nAcceptance Criteria:\n- getSavedEvents returns full Event objects with all fields\n- Deleted/inactive events filtered out automatically\n- Results ordered by saved_at (most recent first)\n- Pagination supported for large lists\n- Query performance optimized (no N+1)",
        "priority": "Medium",
        "labels": "events saved backend mvp",
        "tasks": [
            {
                "summary": "Optimize getSavedEvents with filtering, ordering, and pagination",
                "description": "Enhance the saved events query for production use.\n\n- Optimize getSavedEvents to return full Event objects (not just IDs)\n- Filter out deleted/inactive events automatically\n- Add ordering by saved_at descending (most recent first)\n- Add pagination support (limit/offset or cursor)\n- Optimize query to prevent N+1 (select_related/prefetch)\n- Add total count field to response\n- Event deleted after being saved -> Not returned\n- Event deactivated after being saved -> Not returned\n- User with 0 saved events -> Empty array\n- Write pytest tests for edge cases",
            },
        ],
    },
    {
        "key": "PUR-7",
        "summary": "[FE] Create Itinerary",
        "description": "As a user, I want to create a travel itinerary so that I can organize my plans.\n\nAcceptance Criteria:\n- User can create a new itinerary\n- Itinerary form captures: title (required), start date, end date, description (optional)\n- Form validation for required fields and date logic (end >= start)\n- Created itinerary is stored via API\n- User can view list of their itineraries\n- Loading state during creation",
        "priority": "High",
        "labels": "itinerary planning mvp",
        "tasks": [
            {
                "summary": "Define Itinerary types, GraphQL operations, and hooks",
                "description": "Set up the itinerary data layer.\n\n- Define Itinerary type/interface in graphql/types.ts\n- Create CREATE_ITINERARY mutation\n- Create GET_ITINERARIES query\n- Generate types with graphql-codegen\n- Create useItineraries and useCreateItinerary hooks",
            },
            {
                "summary": "Create CreateItinerary form and ItineraryList screen",
                "description": "Build the itinerary creation and listing UI.\n\n- Create CreateItinerary form/modal component\n- Create ItineraryList screen (screens/Itineraries/ItineraryList.tsx)\n- Add Itineraries routes to navigation\n- Implement date picker for start/end dates\n- Add form validation (title required, end date >= start date)\n- Fill valid data and submit -> Itinerary created, appears in list\n- Submit without title -> Validation error shown\n- Submit with end date before start date -> Validation error\n- Submit with only title -> Success (dates optional)\n- Loading state shown during submission\n- Form clears after successful creation\n- Network failure -> Error message, form data preserved\n- Write unit tests",
            },
        ],
    },
    {
        "key": "PUR-7-BE",
        "summary": "[BE] Create Itinerary API",
        "description": "As a backend service, I need to provide API endpoints for creating and fetching itineraries.\n\nAcceptance Criteria:\n- Itinerary model created with required fields\n- createItinerary mutation creates new itinerary for user\n- getItineraries query returns user's itineraries\n- Validation: title required, date logic\n- All endpoints require authentication\n- Response includes full itinerary data",
        "priority": "High",
        "labels": "itinerary planning backend mvp",
        "tasks": [
            {
                "summary": "Create Itinerary model with GraphQL mutations and queries",
                "description": "Build the itinerary backend.\n\n- Create Itinerary model (id, user FK, title, description, start_date, end_date, is_active, timestamps)\n- Create and run migrations\n- Register Itinerary in Django admin\n- Create ItineraryType GraphQL type\n- Create createItinerary mutation with input validation (title required, date logic)\n- Create getItineraries query returning only user's itineraries\n- createItinerary without title -> Validation error\n- createItinerary with end_date < start_date -> Validation error\n- getItineraries returns empty list for new user\n- All endpoints require authentication\n- User cannot access other users' itineraries\n- Write pytest unit tests",
            },
        ],
    },
    {
        "key": "PUR-8",
        "summary": "[FE] Manage Itinerary Items",
        "description": "As a user, I want to add/edit itinerary entries so I can structure my trip.\n\nAcceptance Criteria:\n- User can add an item to an itinerary\n- User can edit an existing itinerary item\n- User can delete an itinerary item\n- Changes persist after app restart\n- Itinerary detail shows list of items\n- Loading states during CRUD operations",
        "priority": "High",
        "labels": "itinerary planning mvp",
        "tasks": [
            {
                "summary": "Define ItineraryItem types and create CRUD mutations/hooks",
                "description": "Set up the itinerary items data layer.\n\n- Define ItineraryItem type/interface in graphql/types.ts\n- Create ADD_ITINERARY_ITEM, UPDATE_ITINERARY_ITEM, DELETE_ITINERARY_ITEM mutations\n- Create useItineraryItems hook with CRUD operations and optimistic UI updates",
            },
            {
                "summary": "Create ItineraryDetail screen with add/edit/delete item flows",
                "description": "Build the itinerary item management UI.\n\n- Create ItineraryDetail screen (screens/Itineraries/ItineraryDetail.tsx)\n- Create AddItineraryItem form/modal\n- Create EditItineraryItem form/modal (pre-fills existing values)\n- Implement delete confirmation dialog\n- Add item with all fields -> Item appears in list\n- Add item with only title -> Success\n- Add item without title -> Validation error\n- Edit item -> Changes reflected immediately\n- Cancel edit -> No changes saved\n- Delete item -> Confirmation shown, confirm removes item\n- Delete last item -> Empty state appears\n- Changes persist after app restart\n- Rapid add/edit/delete -> Handled gracefully\n- Network failure -> Error shown, UI reverts\n- Write unit tests for CRUD operations",
            },
        ],
    },
    {
        "key": "PUR-8-BE",
        "summary": "[BE] Manage Itinerary Items API",
        "description": "As a backend service, I need to provide API endpoints for managing itinerary items.\n\nAcceptance Criteria:\n- ItineraryItem model created with required fields\n- addItineraryItem mutation creates item in user's itinerary\n- updateItineraryItem mutation updates existing item\n- deleteItineraryItem mutation removes item\n- getItinerary query includes items\n- Authorization: user can only modify own itinerary items\n- All endpoints require authentication",
        "priority": "High",
        "labels": "itinerary planning backend mvp",
        "tasks": [
            {
                "summary": "Create ItineraryItem model with CRUD mutations and authorization",
                "description": "Build the itinerary items backend.\n\n- Create ItineraryItem model (id, itinerary FK, event FK nullable, title, notes, date, start_time, end_time, location_name, order/position, timestamps)\n- Create and run migrations\n- Register ItineraryItem in Django admin (inline on Itinerary)\n- Create ItineraryItemType GraphQL type\n- Create addItineraryItem, updateItineraryItem, deleteItineraryItem mutations\n- Add items field to ItineraryType (resolve items)\n- Add authorization checks (user owns itinerary)\n- addItineraryItem to other user's itinerary -> Authorization error\n- updateItineraryItem on other user's item -> Authorization error\n- deleteItineraryItem on other user's item -> Authorization error\n- Cascade delete when itinerary deleted\n- Write pytest unit tests",
            },
        ],
    },
    {
        "key": "PUR-9",
        "summary": "[FE] Attach Events to Itinerary",
        "description": "As a user, I want to add saved events to my itinerary so I can combine discovery and planning.\n\nAcceptance Criteria:\n- User can select from saved events when adding to itinerary\n- Selected event is added to itinerary view\n- Event details (title, date, location) auto-populate\n- User can remove event from itinerary\n- Removing from itinerary does NOT unsave the event\n- Visual indication that item is linked to event",
        "priority": "High",
        "labels": "itinerary events planning mvp",
        "tasks": [
            {
                "summary": "Create event-to-itinerary attach flow with pickers",
                "description": "Build the UI for attaching saved events to itineraries.\n\n- Create SavedEventsPicker component (modal/screen)\n- Add 'Add to Itinerary' action on SavedEvents screen\n- Add 'Add from Saved Events' option in AddItineraryItem\n- Create itinerary selection modal (when adding from SavedEvents)\n- Auto-populate ItineraryItem fields from Event data (title, date, location)\n- Add visual indicator for event-linked items\n- Implement remove event from itinerary (unlink, does NOT unsave)\n- Add same event to multiple itineraries -> Allowed\n- Unsave event that's in itinerary -> Item remains with 'unavailable' indicator\n- Update Apollo cache after attach/remove\n- Write unit tests for attach flow",
            },
        ],
    },
    {
        "key": "PUR-9-BE",
        "summary": "[BE] Attach Events to Itinerary API",
        "description": "As a backend service, I need to support linking saved events to itinerary items.\n\nAcceptance Criteria:\n- addItineraryItem accepts optional event_id\n- Event relationship validated (event exists, is active)\n- getItinerary returns items with full Event data\n- Deleted/inactive events handled gracefully\n- User can add same event to multiple itineraries\n- Event data resolved efficiently (no N+1)",
        "priority": "High",
        "labels": "itinerary events planning backend mvp",
        "tasks": [
            {
                "summary": "Add event linking support with validation and optimized resolution",
                "description": "Enhance itinerary items to support event linking.\n\n- Add event_id validation in addItineraryItem mutation\n- Verify event is active before linking\n- addItineraryItem with invalid event_id -> Error\n- addItineraryItem with inactive event_id -> Error or warning\n- Resolve Event relationship in ItineraryItemType\n- Handle deleted event gracefully (null or is_event_available flag)\n- Optimize query to prevent N+1 on event resolution (select_related)\n- Same event linkable to multiple itineraries\n- User can only link events to own itineraries\n- Write pytest tests for event linking",
            },
        ],
    },
    {
        "key": "PUR-10",
        "summary": "[FE] View Itinerary Detail",
        "description": "As a user, I want to view my itinerary so I understand my schedule.\n\nAcceptance Criteria:\n- Itinerary displays as timeline or list view\n- All items/events are visible with key details\n- Items show: title, time, location, notes preview\n- User can navigate to item details\n- User can navigate to linked event details\n- Empty state when no items\n- Loading state during fetch",
        "priority": "High",
        "labels": "itinerary planning mvp",
        "tasks": [
            {
                "summary": "Enhance ItineraryDetail with timeline layout and item cards",
                "description": "Build the itinerary detail view.\n\n- Enhance ItineraryDetail screen with timeline/list layout\n- Group items by date (for multi-day itineraries)\n- Create ItineraryItemCard component showing title, time, location, notes preview\n- Event-linked items visually distinct from custom items\n- Tap item -> Navigate to edit/detail view\n- Tap linked event -> Navigate to EventDetail\n- Implement empty state for no items\n- Add pull-to-refresh functionality\n- Loading skeleton during fetch\n- Items with missing optional fields -> Graceful display\n- Linked event deleted -> Shows 'unavailable' indicator\n- Itinerary with 50+ items -> Smooth scrolling\n- Write unit tests for ItineraryDetail",
            },
        ],
    },
    {
        "key": "PUR-10-BE",
        "summary": "[BE] View Itinerary Detail API",
        "description": "As a backend service, I need to provide a comprehensive itinerary detail query.\n\nAcceptance Criteria:\n- getItinerary query accepts itinerary ID\n- Returns full itinerary with all items\n- Items ordered by date/time/position\n- Event relationships resolved for linked items\n- Authorization: user can only view own itineraries\n- Query optimized (no N+1 queries)",
        "priority": "High",
        "labels": "itinerary planning backend mvp",
        "tasks": [
            {
                "summary": "Implement getItinerary query with ordering, prefetching, and authorization",
                "description": "Build the itinerary detail backend query.\n\n- Implement getItinerary query by ID\n- Order items by date ascending, then start_time, then position\n- Prefetch Event relationships (select_related) to prevent N+1\n- Add authorization check (user owns itinerary)\n- Handle non-existent itinerary ID -> null/error\n- getItinerary for other user's itinerary -> Authorization error\n- Add computed fields (duration, is_event_available)\n- Empty items array for itinerary with no items\n- Query performs well with 50+ items\n- Write pytest tests",
            },
        ],
    },
    {
        "key": "PUR-11",
        "summary": "[FE] Add Expense Entry",
        "description": "As a user, I want to log spending so I can track my adventure budget.\n\nAcceptance Criteria:\n- User can access add expense form\n- Form captures: amount (required), description, category, date\n- Form validates required fields and amount format\n- Expense is stored via API\n- Success feedback after adding\n- Loading state during submission",
        "priority": "High",
        "labels": "budget expenses mvp",
        "tasks": [
            {
                "summary": "Define Expense types and create AddExpense form with validation",
                "description": "Build the expense entry feature.\n\n- Define Expense type/interface in graphql/types.ts\n- Create ADD_EXPENSE mutation and generate types with codegen\n- Create useAddExpense hook\n- Create AddExpense form/modal component\n- Implement amount input with currency formatting and numeric keyboard\n- Create category picker (predefined categories)\n- Add date picker for expense date (default today)\n- Add optional itinerary link selector\n- Submit with valid data -> Expense created, success feedback, form clears\n- Submit without amount -> Validation error\n- Submit with negative amount -> Validation error\n- Submit with non-numeric amount -> Validation error\n- Submit with amount only -> Success (other fields optional)\n- Very large amount -> Handled gracefully\n- Loading state during submission, prevent rapid taps\n- Network failure -> Error message, form data preserved\n- Write unit tests",
            },
        ],
    },
    {
        "key": "PUR-11-BE",
        "summary": "[BE] Add Expense Entry API",
        "description": "As a backend service, I need to provide an API endpoint for creating expense entries.\n\nAcceptance Criteria:\n- Expense model created with required fields\n- addExpense mutation creates expense for user\n- Amount validated (positive, proper format)\n- Category validated against allowed values\n- Optional itinerary link validated\n- Requires authentication",
        "priority": "High",
        "labels": "budget expenses backend mvp",
        "tasks": [
            {
                "summary": "Create Expense model with addExpense mutation and validation",
                "description": "Build the expense backend.\n\n- Create Expense model (id, user FK, itinerary FK nullable, amount DecimalField, currency default USD, description, category, date, notes, timestamps)\n- Define ExpenseCategory choices/enum (FOOD, TRANSPORTATION, LODGING, ACTIVITIES, SHOPPING, FLIGHTS, OTHER)\n- Create and run migrations\n- Register Expense in Django admin\n- Create ExpenseType GraphQL type\n- Create addExpense mutation\n- addExpense with valid data -> Expense created\n- addExpense without amount -> Validation error\n- addExpense with negative amount -> Validation error\n- addExpense with invalid category -> Validation error\n- addExpense with other user's itinerary -> Authorization error\n- addExpense without itinerary -> Success (standalone)\n- Amount stored with 2 decimal places precision\n- Requires authentication\n- Write pytest unit tests",
            },
        ],
    },
    {
        "key": "PUR-12",
        "summary": "[FE] Categorize Expenses",
        "description": "As a user, I want to categorize expenses so I can understand spending patterns.\n\nAcceptance Criteria:\n- Category is selectable when adding/editing expense\n- Category is displayed in expense list view\n- Each expense shows its category clearly\n- Category has visual indicator (icon or color)\n- Categories are consistent across the app",
        "priority": "Medium",
        "labels": "budget expenses mvp",
        "tasks": [
            {
                "summary": "Create expense category display with icons, colors, and filtering",
                "description": "Build category UI components.\n\n- Define expense category constants with icons and colors\n- Create CategoryBadge/CategoryChip component\n- Integrate category picker in AddExpense form (if not done in PUR-11)\n- Display category in ExpenseCard/ExpenseListItem\n- Add category icons/colors mapping (each category visually distinct)\n- Implement category filter in expense list (optional)\n- Add category to expense detail view\n- Expense without category -> Shows 'Uncategorized' or default\n- Long category names handled gracefully\n- Write unit tests for category display",
            },
        ],
    },
    {
        "key": "PUR-12-BE",
        "summary": "[BE] Categorize Expenses API",
        "description": "As a backend service, I need to support expense categorization.\n\nAcceptance Criteria:\n- ExpenseCategory enum defined with all values\n- Category field on Expense model uses enum\n- getExpenses query can filter by category\n- Category included in all expense responses\n- Invalid category values rejected",
        "priority": "Medium",
        "labels": "budget expenses backend mvp",
        "tasks": [
            {
                "summary": "Define ExpenseCategory enum with filter and validation support",
                "description": "Enhance expense category backend.\n\n- Define ExpenseCategory enum (if not done in PUR-11-BE)\n- Ensure category field uses enum choices\n- Add category filter to getExpenses query\n- getExpenses(category: FOOD) -> Only food expenses\n- getExpenses(category: null) -> All expenses\n- Validate category in addExpense/updateExpense\n- Include category in ExpenseType response\n- Add getExpenseCategories query (returns all options)\n- Write pytest tests for category functionality",
            },
        ],
    },
    {
        "key": "TECH-1",
        "summary": "[FE] Remove User Bucket/Event Creation Functionality",
        "description": "Technical debt ticket to remove the existing bucket and item creation functionality. Users will no longer be able to create buckets or events - these will be admin-managed with predefined categories.\n\nAcceptance Criteria:\n- AddBucket component removed\n- AddBucketItem component removed\n- UpdateBucket component removed\n- Bucket creation modals removed from UI\n- GraphQL creation mutations removed or deprecated\n- No user-facing bucket/event creation entry points remain\n- App builds and runs without errors after removal",
        "priority": "High",
        "labels": "tech-debt cleanup mvp",
        "tasks": [
            {
                "summary": "Remove bucket/event creation components and clean up imports",
                "description": "Remove all user-facing creation functionality.\n\n- Remove AddBucket.tsx and related imports\n- Remove AddBucketItem.tsx and related imports\n- Remove UpdateBucket.tsx and related imports\n- Remove bucket creation modals from Buckets.tsx\n- Clean up unused GraphQL mutations (ADD_BUCKET_CATEGORY, ADD_BUCKET_ITEM)\n- Remove unused types/interfaces related to bucket creation\n- Update navigation to remove creation routes",
            },
            {
                "summary": "Verify build and update/remove related tests",
                "description": "Ensure the app still works after removal.\n\n- Run TypeScript build and verify no broken imports\n- Run ESLint and verify no errors\n- Update/remove related unit tests\n- App launches without errors\n- Buckets/Events screen loads without creation buttons\n- No console errors related to removed components\n- Existing event browsing functionality unaffected",
            },
        ],
    },
    {
        "key": "PUR-13",
        "summary": "[FE] View Budget Summary",
        "description": "As a user, I want to see total spend so I can monitor my budget.\n\nAcceptance Criteria:\n- Total spend amount calculated and displayed\n- Summary updates when expenses are added/edited/deleted\n- Summary section is visible on expenses screen\n- Loading state while calculating\n- Handles empty state (no expenses)",
        "priority": "High",
        "labels": "budget expenses analytics mvp",
        "tasks": [
            {
                "summary": "Create BudgetSummary component with real-time updates",
                "description": "Build the budget summary feature.\n\n- Create GET_EXPENSE_SUMMARY query (or compute client-side)\n- Create useExpenseSummary hook\n- Create BudgetSummary component (components/Budget/BudgetSummary.tsx)\n- Display total spend amount with currency formatting (commas, $)\n- Display expense count\n- Add category breakdown display (optional)\n- Integrate BudgetSummary into Expenses screen\n- Ensure Apollo cache updates trigger re-render\n- Add expense -> Total updates without refresh\n- Edit expense -> Total recalculates without refresh\n- Delete expense -> Total decreases without refresh\n- No expenses -> Shows $0.00 or empty state\n- Decimal amounts handled correctly (no floating point errors)\n- Loading skeleton during calculation\n- Write unit tests for BudgetSummary",
            },
        ],
    },
    {
        "key": "PUR-13-BE",
        "summary": "[BE] Budget Summary API",
        "description": "As a backend service, I need to provide an API endpoint for expense summary/aggregation.\n\nAcceptance Criteria:\n- getExpenseSummary query returns total spend\n- Summary includes expense count\n- Summary includes breakdown by category\n- Summary updates reflect latest expense data\n- Optional date range filter supported\n- Requires authentication",
        "priority": "High",
        "labels": "budget expenses analytics backend mvp",
        "tasks": [
            {
                "summary": "Create getExpenseSummary query with aggregation and filters",
                "description": "Build the budget summary backend.\n\n- Create getExpenseSummary query in GraphQL schema\n- Create ExpenseSummaryType (total_amount, expense_count, by_category array)\n- Implement database aggregation using Sum and Count (not Python loops)\n- Add category breakdown aggregation (category, amount, count per category)\n- Add optional date range filter (start_date, end_date)\n- Add optional itinerary filter\n- getExpenseSummary with no expenses -> total: 0, count: 0\n- Category totals sum to overall total\n- Decimal precision maintained (2 decimal places)\n- Requires authentication, returns only current user's data\n- Query performs well with 1000+ expenses\n- Write pytest unit tests",
            },
        ],
    },
    {
        "key": "PUR-14",
        "summary": "[FE] App Navigation",
        "description": "As a user, I want to navigate between main sections so I can use the app effectively.\n\nAcceptance Criteria:\n- Navigation bar visible on main screens\n- User can navigate between: Events, Saved, Itinerary, Budget\n- Active tab has visible indicator (color/icon change)\n- Navigation persists across app usage\n- Smooth transitions between sections",
        "priority": "High",
        "labels": "navigation ux mvp",
        "tasks": [
            {
                "summary": "Set up bottom tab navigator with all sections and nested navigation",
                "description": "Build the main app navigation.\n\n- Set up bottom tab navigator (React Navigation)\n- Create tab bar icons for each section\n- Configure Events tab -> EventList screen\n- Configure Saved tab -> SavedEvents screen\n- Configure Itinerary tab -> ItineraryList screen\n- Configure Budget tab -> Expenses screen\n- Implement active state styling (color/icon variant)\n- Add tab bar labels\n- Handle nested navigation within each tab (detail screens)\n- Events -> EventDetail -> Back works correctly\n- Tab switch preserves nested state\n- Rapid tab switching -> No crashes or glitches\n- Touch targets adequate size (44pt minimum)\n- Tab bar doesn't overlap content, safe area respected\n- Write navigation tests",
            },
        ],
    },
    {
        "key": "PUR-15",
        "summary": "[FE] Loading & Error Handling",
        "description": "As a user, I want feedback when content loads or fails so the app feels reliable.\n\nAcceptance Criteria:\n- Loading indicators shown during data fetch\n- Error messages displayed when requests fail\n- Empty state messaging when no data exists\n- Retry option available on errors\n- Consistent styling across app",
        "priority": "High",
        "labels": "ux feedback mvp",
        "tasks": [
            {
                "summary": "Create reusable feedback components and Error Boundary",
                "description": "Build the feedback component library.\n\n- Create LoadingSpinner component (components/Feedback/LoadingSpinner.tsx)\n- Create LoadingSkeleton component for lists/cards (mimics final layout)\n- Create ErrorMessage component with retry button (user-friendly, not technical messages)\n- Create EmptyState component with icon/message/CTA\n- Implement React Error Boundary for crash handling with fallback UI\n- Loading state doesn't flash (minimum display time)\n- Error boundary catches component crashes and shows recovery option",
            },
            {
                "summary": "Integrate feedback components into all screens and write tests",
                "description": "Apply feedback patterns across the app.\n\n- Integrate loading states into existing screens (Events, Saved, Itinerary, Budget)\n- Integrate error handling into existing screens\n- Integrate empty states into existing screens\n- Network offline -> Specific message\n- Timeout -> Appropriate error message\n- Retry button triggers fresh request\n- Consistent spacing, typography, and styling\n- Loading state announced to screen reader\n- Write unit tests for all feedback components",
            },
        ],
    },
    {
        "key": "PUR-16",
        "summary": "[BE] Admin Create Event",
        "description": "As an admin, I want to create events so that users can discover activities through the app.\n\nAcceptance Criteria:\n- Admin can access event creation form (Django Admin)\n- Required fields: title, date, location, category, description\n- Validation applied (required fields, date logic)\n- Event saved to database\n- Event appears in user listings (getEvents query)\n- Only staff/admin can create events",
        "priority": "High",
        "labels": "admin events backend mvp",
        "tasks": [
            {
                "summary": "Configure Event admin with validation, display, filters, and search",
                "description": "Set up the Django Admin for event management.\n\n- Enhance Event model admin registration\n- Configure admin form with required field validation\n- Add admin list display (title, date, category, is_active)\n- Add admin filters (category, is_active, date)\n- Add admin search (title, description, location)\n- Implement image upload in admin (optional)\n- Submit with valid data -> Event created, appears in admin list\n- Submit without title -> Validation error\n- Submit without category -> Validation error\n- Submit with end_date < start_date -> Validation error\n- Created event appears in getEvents user query\n- Only staff users can access admin\n- Write pytest tests for admin event creation",
            },
        ],
    },
    {
        "key": "PUR-17",
        "summary": "[BE] Admin Edit Event",
        "description": "As an admin, I want to update event details so information stays accurate.\n\nAcceptance Criteria:\n- Admin can select event from list\n- All editable fields displayed in form\n- Changes saved successfully to database\n- Updated data reflected in getEvents query\n- Validation applied on save\n- Change history preserved",
        "priority": "High",
        "labels": "admin events backend mvp",
        "tasks": [
            {
                "summary": "Configure admin edit view with fieldsets and bulk actions",
                "description": "Set up event editing in Django Admin.\n\n- Verify admin change view configured for Event\n- Ensure all fields editable in admin form\n- Add fieldsets for organized form layout\n- Configure readonly fields (id, created_at)\n- Add admin action for bulk activate/deactivate\n- Edit title/date/category/description -> Change saved correctly\n- Toggle is_active -> Change saved correctly\n- Clear required field -> Validation error\n- Changes immediately reflected in getEvents and getEvent queries\n- Change history accessible in admin\n- Write pytest tests for event update",
            },
        ],
    },
    {
        "key": "PUR-18",
        "summary": "[BE] Admin Delete Event",
        "description": "As an admin, I want to remove events so outdated content isn't shown.\n\nAcceptance Criteria:\n- Admin can delete event from admin interface\n- Confirmation step required before deletion\n- Event removed from getEvents query (user listings)\n- Related SavedEvents/ItineraryItems handled gracefully\n- Error handling for deletion failures\n- Option for soft delete (deactivate) vs hard delete",
        "priority": "High",
        "labels": "admin events backend mvp",
        "tasks": [
            {
                "summary": "Implement event deletion with soft delete and cascade handling",
                "description": "Build event deletion functionality.\n\n- Configure Django Admin delete action with confirmation\n- Implement soft delete action (set is_active=False) as primary delete method\n- Add bulk delete/deactivate action for multiple events\n- Handle cascade for SavedEvent references (removed or set null)\n- Handle cascade for ItineraryItem references (shows 'event unavailable')\n- Ensure deleted/deactivated events excluded from getEvents\n- Add admin filter for deleted/inactive events\n- Implement restore action for soft-deleted events\n- Confirmation includes event title/identifier\n- Admin can still see deactivated events via filter\n- Restored event appears in user listings again\n- Write pytest tests for event deletion and cascade behavior",
            },
        ],
    },
    {
        "key": "PUR-19",
        "summary": "[FE] Event Recommendations",
        "description": "As a user, I want to receive event recommendations based on my saved events or categories.\n\nAcceptance Criteria:\n- Recommendations section visible on Events screen\n- Displays personalized event suggestions\n- Shows recommendation reason (e.g., 'Because you saved...')\n- User can tap to view event details\n- User can save recommended events\n- Empty state for new users (shows popular instead)\n- Loading state during fetch",
        "priority": "High",
        "labels": "recommendations events personalization mvp",
        "tasks": [
            {
                "summary": "Create recommendations data layer and hooks",
                "description": "Set up the recommendations data layer.\n\n- Create GET_RECOMMENDATIONS query in graphql/queries.ts\n- Define RecommendationType in graphql/types.ts\n- Generate types with graphql-codegen\n- Create useRecommendations hook",
            },
            {
                "summary": "Create recommendations carousel with personalized suggestions",
                "description": "Build the recommendations UI.\n\n- Create RecommendationsCarousel component (horizontal scroll)\n- Create RecommendationCard component with reason label\n- Integrate recommendations into Events/Home screen\n- Display recommendation reason ('Because you saved...', 'Popular in...', 'Trending')\n- Tap event -> Navigate to EventDetail\n- Save button works on recommendation cards\n- New user (no saves) -> Shows popular/trending events\n- Recommendations change after saving new events\n- Only 1 recommendation -> Displays correctly\n- Many recommendations (20+) -> Scrolls smoothly\n- Loading state with skeleton cards\n- Network failure -> Error state with retry\n- Write unit tests for recommendation components",
            },
        ],
    },
    {
        "key": "PUR-19-BE",
        "summary": "[BE] Event Recommendations API",
        "description": "As a backend service, I need to provide personalized event recommendations using simple ML techniques.\n\nAcceptance Criteria:\n- getRecommendations query returns personalized events\n- Recommendations based on saved events (content-based)\n- Recommendations based on similar users (collaborative)\n- Popular events included for diversity\n- Already-saved events excluded\n- Recommendation reason/source included in response\n- Cold-start handling for new users\n- Requires authentication",
        "priority": "High",
        "labels": "recommendations events personalization ml backend mvp",
        "tasks": [
            {
                "summary": "Create recommendation engine with scoring and filtering",
                "description": "Build the recommendation algorithm.\n\n- Create getRecommendations query in GraphQL schema\n- Create RecommendationType with event + reason fields\n- Implement content-based filtering (same category as saved events)\n- Implement collaborative filtering (events saved by users with similar saves)\n- Implement popularity scoring (save count)\n- Combine scores with configurable weights (category 0.4, similar users 0.3, popularity 0.2, recency 0.1)\n- Exclude already-saved events from results\n- Add recommendation reason to each result\n- Implement cold-start fallback (popular + new events for users with 0 saves)\n- Add caching layer for performance\n- Add limit parameter for pagination\n- Requires authentication\n- Query performs well with 1000+ events\n- Write pytest tests for recommendation logic",
            },
        ],
    },
    {
        "key": "PUR-20",
        "summary": "[INFRA] Continuous Integration Pipeline",
        "description": "As a developer, I want automated builds and checks on every commit.\n\nAcceptance Criteria:\n- Pipeline triggers on pull request to main\n- Pipeline triggers on push to main branch\n- Dependencies install successfully (npm/pip)\n- Lint checks run and report errors\n- Type checks run (TypeScript/Python)\n- Unit tests execute and report results\n- Build step completes successfully\n- Pipeline fails fast on any error\n- Status visible on pull request\n- Branch protection requires passing CI",
        "priority": "High",
        "labels": "ci-cd infrastructure devops mvp",
        "tasks": [
            {
                "summary": "Create GitHub Actions CI workflows with caching",
                "description": "Set up the CI pipeline infrastructure.\n\n- Create .github/workflows/ directory structure\n- Create frontend CI workflow (frontend-ci.yml)\n- Create backend CI workflow (backend-ci.yml)\n- Configure PR and push triggers for main branch\n- Add dependency caching (node_modules via package-lock.json hash, pip cache)",
            },
            {
                "summary": "Add lint, type-check, test, and build jobs",
                "description": "Configure all CI jobs.\n\n- Add ESLint job for frontend\n- Add TypeScript type-check job (tsc --noEmit)\n- Add Jest test job for frontend\n- Add flake8/ruff lint job for backend\n- Add pytest job for backend\n- Add Expo build check (dry run)\n- Failed lint/test -> Pipeline fails with clear error\n- Jobs run in parallel where possible\n- Full pipeline completes in < 10 minutes",
            },
            {
                "summary": "Configure branch protection and documentation",
                "description": "Finalize CI setup.\n\n- Configure branch protection rules (require passing CI to merge)\n- Add status badges to README\n- Document CI pipeline in DEVELOPMENT_BUILD_GUIDE.md\n- PR shows pending/green/red status\n- Click status -> View detailed logs",
            },
        ],
    },
    {
        "key": "PUR-21",
        "summary": "[INFRA] Automated Linting & Formatting",
        "description": "As a developer, I want linting and formatting checks in CI so code remains consistent.\n\nAcceptance Criteria:\n- ESLint runs in CI pipeline\n- Prettier format check runs in CI\n- Python linter (Ruff/flake8) runs in CI\n- Python formatter check (Black/Ruff) runs in CI\n- Lint/format failures block PR merge\n- Clear error messages identify violations\n- Local tooling matches CI configuration",
        "priority": "High",
        "labels": "ci-cd infrastructure devops code-quality mvp",
        "tasks": [
            {
                "summary": "Configure frontend and backend linting/formatting tools",
                "description": "Set up all linting and formatting configuration.\n\n- Configure ESLint rules (.eslintrc.js)\n- Configure Prettier (.prettierrc)\n- Add ESLint + Prettier compatibility (eslint-config-prettier)\n- Add lint/format scripts to package.json (lint, lint:fix, format, format:check)\n- Configure Ruff for Python (ruff.toml or pyproject.toml)\n- Add Python format check (ruff format --check)\n- Fix existing lint/format violations",
            },
            {
                "summary": "Update CI workflow and configure dev tooling",
                "description": "Integrate linting into CI and local development.\n\n- Update CI workflow with lint/format jobs\n- Lint/format failures block PR merge\n- Configure pre-commit hooks (optional)\n- Add VS Code settings for auto-format on save\n- Document linting standards in CONTRIBUTING.md\n- Clear error output shows violation location\n- npm run lint and ruff check work locally matching CI",
            },
        ],
    },
    {
        "key": "PUR-22",
        "summary": "[INFRA] Run Unit Tests in Pipeline",
        "description": "As a developer, I want automated tests executed in CI so regressions are caught early.\n\nAcceptance Criteria:\n- Jest tests execute on every PR\n- pytest tests execute on every PR\n- Test failures stop the pipeline\n- Test summary visible in PR checks\n- Individual test results accessible\n- Coverage report generated (optional)",
        "priority": "High",
        "labels": "ci-cd testing infrastructure devops mvp",
        "tasks": [
            {
                "summary": "Configure Jest and pytest for CI with reporting",
                "description": "Set up test execution in the pipeline.\n\n- Configure Jest for CI (jest.config.js, no watch mode)\n- Add Jest test script to package.json (test:ci)\n- Configure pytest for CI (pytest.ini)\n- Add test jobs to frontend and backend CI workflows\n- Configure test result reporting (JUnit XML)\n- Add GitHub Actions test summary\n- Configure coverage collection (optional) with thresholds\n- Handle test timeouts appropriately\n- Failed test -> Non-zero exit code, pipeline fails\n- Test summary shows pass/fail count in PR checks\n- Document test running in CONTRIBUTING.md\n- Add test status badge to README",
            },
        ],
    },
    {
        "key": "PUR-23",
        "summary": "[INFRA] Automated Deployment",
        "description": "As a developer, I want successful builds to deploy automatically.\n\nAcceptance Criteria:\n- Deployment triggered after successful CI\n- Frontend deployed via EAS Update (OTA) on main branch\n- Backend deployed to cloud hosting on main branch\n- App available and accessible in hosted environment\n- Rollback mechanism available\n- Database migrations run automatically (backend)",
        "priority": "High",
        "labels": "ci-cd deployment infrastructure devops mvp",
        "tasks": [
            {
                "summary": "Create frontend deployment workflow with EAS Update",
                "description": "Set up frontend deployment.\n\n- Create frontend deployment workflow (deploy-frontend.yml)\n- Configure EAS project for deployment (eas.json)\n- Set up EAS Update for OTA deployments\n- Deployment triggered only after CI passes\n- Update published to correct channel (staging/production)\n- Add deployment status badges to README",
            },
            {
                "summary": "Create backend deployment workflow with Docker and migrations",
                "description": "Set up backend deployment.\n\n- Create backend deployment workflow (deploy-backend.yml)\n- Configure cloud provider for backend (Railway/Render/Fly.io)\n- Create Dockerfile for backend (if not exists)\n- Configure environment variables in GitHub Secrets\n- Add deployment job dependencies (requires: [lint, test, build])\n- Add database migration step (runs before app starts)\n- Configure staging deployment (every push to main)\n- Configure production deployment (tagged releases or manual trigger)\n- Document rollback procedures\n- Health check passes after deployment",
            },
        ],
    },
    {
        "key": "PUR-24",
        "summary": "[INFRA] Environment Configuration",
        "description": "As a developer, I want environment-specific configs so deployments behave correctly across stages.\n\nAcceptance Criteria:\n- Environment variables separated by stage (dev/staging/prod)\n- Secrets stored securely (not in repository)\n- .env files gitignored with .env.example provided\n- GitHub Secrets configured for CI/CD\n- Documentation provided for all environment variables\n- Environment switching is straightforward",
        "priority": "High",
        "labels": "ci-cd configuration infrastructure devops security mvp",
        "tasks": [
            {
                "summary": "Create environment variable templates and app configuration",
                "description": "Set up environment variable structure.\n\n- Create .env.example for frontend (pursuit/) with all required vars\n- Create .env.example for backend (pursuit-backend/) with all required vars\n- Update .gitignore to exclude .env files\n- Configure Expo environment variables (app.config.js)\n- Set up EAS environment profiles (eas.json)\n- Developer can copy .env.example -> .env, fill values, and run app",
            },
            {
                "summary": "Configure Django settings modules and cloud secrets",
                "description": "Set up server-side configuration.\n\n- Configure Django settings for environment-based config\n- Create settings modules (base.py, development.py, staging.py, production.py)\n- DEBUG=True only in development\n- Set up GitHub Secrets for CI/CD workflows\n- Configure cloud provider environment variables\n- Secrets not exposed in logs\n- Missing required variable -> Clear error on startup\n- Document all environment variables in README/docs\n- Create local development setup guide",
            },
        ],
    },
    {
        "key": "PUR-25",
        "summary": "[INFRA] Basic Monitoring & Health Check",
        "description": "As a developer, I want to verify deployed service availability so I can detect failures.\n\nAcceptance Criteria:\n- Health endpoint returns 200 OK when service is healthy\n- Health endpoint returns error status when unhealthy\n- Database connectivity verified in health check\n- Sentry captures unhandled exceptions (frontend and backend)\n- Errors include context (environment, version, user)\n- Health check URL documented for uptime monitoring",
        "priority": "High",
        "labels": "monitoring infrastructure devops observability mvp",
        "tasks": [
            {
                "summary": "Create backend health endpoint with database check",
                "description": "Build the health check endpoint.\n\n- Create backend health endpoint (/health or /api/health)\n- Add database connectivity check\n- GET /health returns 200 OK with status: 'healthy' and timestamp\n- Database disconnected -> Returns 503\n- Endpoint responds quickly (<500ms)\n- Endpoint accessible without authentication\n- Add health check to deployment verification",
            },
            {
                "summary": "Install and configure Sentry for frontend and backend",
                "description": "Set up error tracking.\n\n- Install and configure sentry-sdk for Django\n- Install and configure @sentry/react-native\n- Configure Sentry DSN per environment (dev/staging/prod)\n- Add Sentry release tracking (version/commit)\n- Upload source maps to Sentry for readable stack traces\n- Add error boundary with Sentry reporting (frontend)\n- Test error capture with intentional test error\n- Errors include: stack trace, request context, user info, environment tag, app version\n- Sentry unavailable -> App continues working (non-blocking)\n- Document health check endpoints and manual verification procedures\n- Configure Sentry alerts (optional)",
            },
        ],
    },
    {
        "key": "PUR-26",
        "summary": "[FE] User Profile & Settings",
        "description": "As a user, I want to view and edit my profile so I can manage my account.\n\nAcceptance Criteria:\n- Profile screen accessible from app\n- Display name editable\n- Email displayed (read-only from OAuth)\n- Profile picture displayed (from OAuth)\n- Notification preferences toggleable\n- Logout functionality works\n- Delete account option available\n- App version displayed",
        "priority": "High",
        "labels": "profile settings account mvp",
        "tasks": [
            {
                "summary": "Create Profile screen with user info, edit, and preferences",
                "description": "Build the profile display and editing features.\n\n- Create/enhance Profile screen (screens/Profiles.tsx)\n- Display user info section (name, email, avatar from OAuth)\n- Add edit display name functionality (input field, save, cancel restores original)\n- Display notification preferences with toggles\n- Toggle push/email -> Setting saved to backend\n- Handle loading and error states\n- Network failure during save -> Error message, retry option",
            },
            {
                "summary": "Implement logout, delete account, and app info",
                "description": "Build account actions and app information.\n\n- Implement logout button with confirmation dialog\n- Confirm logout -> Clears tokens, Apollo cache, redirects to auth\n- Cancel logout -> Remains on profile\n- Implement delete account with confirmation dialog (mentions data loss)\n- Add deleteAccount mutation (or use existing)\n- Confirm delete -> Account deleted, clears storage, redirects to login\n- Deleted account cannot log back in\n- Display app version and build number\n- Add support/feedback link\n- Destructive actions (logout, delete) visually distinct\n- Write unit tests for Profile screen",
            },
        ],
    },
    {
        "key": "PUR-26-BE",
        "summary": "[BE] User Profile & Account Management API",
        "description": "As a backend service, I need to provide API endpoints for profile management and account deletion.\n\nAcceptance Criteria:\n- updateProfile mutation works for all editable fields\n- deleteAccount mutation removes/anonymizes user data\n- Cascading deletes handle related data\n- Requires authentication for all mutations",
        "priority": "High",
        "labels": "profile settings account backend mvp",
        "tasks": [
            {
                "summary": "Create deleteAccount mutation with cascade and anonymization",
                "description": "Build account deletion functionality.\n\n- Verify updateProfile handles display name and notification preferences\n- Create deleteAccount mutation\n- Implement soft delete (is_deleted flag) or hard delete\n- Handle cascade for SavedEvents\n- Handle cascade for Expenses\n- Handle cascade for Itineraries\n- Anonymize user data if soft delete (name, email)\n- Revoke OAuth tokens on delete\n- Deleted user cannot log in\n- Deleted user excluded from queries\n- Cannot delete another user's account\n- Requires authentication\n- Write pytest tests for account deletion",
            },
        ],
    },
    {
        "key": "PUR-27",
        "summary": "[FE] Offline Support & Caching",
        "description": "As a user, I want to access saved events and itinerary offline.\n\nAcceptance Criteria:\n- Saved events viewable offline\n- Itinerary viewable offline\n- Budget summary viewable offline\n- Offline indicator displayed when no connection\n- App doesn't crash when offline\n- Sync occurs when connection restored\n- Mutations queued or blocked with message",
        "priority": "Medium",
        "labels": "offline caching ux mvp",
        "tasks": [
            {
                "summary": "Configure Apollo cache persistence and offline detection",
                "description": "Set up the offline infrastructure.\n\n- Install apollo3-cache-persist\n- Configure cache persistence with AsyncStorage\n- Restore cache on app launch (fast, <2 seconds)\n- Create useNetworkStatus hook (NetInfo)\n- Create OfflineIndicator component\n- Add offline indicator to app header/layout\n- Airplane mode / Wi-Fi off -> Offline detected, indicator appears\n- Network restored -> Online detected, indicator hides",
            },
            {
                "summary": "Handle offline mutations and implement cache-first policies",
                "description": "Make the app functional offline.\n\n- Implement cache-first fetch policy for key queries (saved events, itinerary, budget)\n- Go offline -> Saved events, itinerary, budget summary still viewable from cache\n- Try to save/edit while offline -> Friendly error message suggesting reconnect\n- No data loss or corruption from offline usage\n- Connection restored -> App syncs fresh data\n- Large cache -> Performance acceptable\n- First launch (empty cache) -> Handles correctly\n- Document offline capabilities",
            },
        ],
    },
    {
        "key": "PUR-28",
        "summary": "[FE] Push Notifications",
        "description": "As a user, I want to receive reminders for upcoming itinerary items.\n\nAcceptance Criteria:\n- Notification permission requested on first use\n- Permission status saved\n- Itinerary reminders sent at scheduled time\n- Notification tapped opens relevant screen\n- Notifications respect user preferences\n- Notification settings toggleable in profile",
        "priority": "Low",
        "labels": "notifications reminders mvp",
        "tasks": [
            {
                "summary": "Set up expo-notifications with permission flow and scheduling",
                "description": "Build the notification system.\n\n- Install and configure expo-notifications\n- Create notification permission request flow (explains benefit)\n- Accept permission -> Notifications enabled\n- Deny permission -> App continues without notifications\n- Create useNotifications hook\n- Schedule local notification for itinerary items (1 hour before, day before)\n- Handle notification tap -> Deep link to relevant itinerary item\n- Respect allow_push_notifications preference\n- Add notification scheduling when itinerary item created\n- Cancel notifications when item deleted/edited\n- Edit item time -> Notification rescheduled\n- Create notification settings UI in Profile\n- Past itinerary item -> No notification scheduled\n- Test on real device (not simulator)\n- Document notification setup",
            },
        ],
    },
    {
        "key": "PUR-29",
        "summary": "[FE] Search & Filter Events",
        "description": "As a user, I want to search and filter events so I can find specific activities.\n\nAcceptance Criteria:\n- Search bar visible on Events screen\n- Keyword search filters events by title/description\n- Category filter shows only selected categories\n- Date range filter shows events in range\n- Location radius filter shows events within distance\n- Clear filters option resets all filters\n- Filter count badge shows active filters\n- Results update as filters change",
        "priority": "High",
        "labels": "search filter events mvp",
        "tasks": [
            {
                "summary": "Implement search bar and filter modal with all filter types",
                "description": "Build the search and filter UI.\n\n- Add search bar to Events screen with debounce\n- Create FilterModal/FilterSheet component\n- Implement category filter (multi-select chips)\n- Implement date range filter (presets: Upcoming, This Week, This Month + custom)\n- Implement location radius filter (slider or picker, uses searchRadiusKm from profile)\n- Implement price filter (free/paid/all)\n- Add filter icon with active count badge\n- Add 'Clear All Filters' button\n- Type in search bar -> Results filter in real-time\n- Select category + search -> Both applied (AND logic)\n- Clear All -> All filters reset, all events shown\n- No matching results -> 'No events found' with suggestion to adjust filters\n- Special characters in search -> Handled\n- Filtering is fast (instant feel)",
            },
            {
                "summary": "Update getEvents query with filter params and write tests",
                "description": "Wire up filters to the API.\n\n- Update getEvents query with filter parameters (search, categories, dates, location, isFree)\n- Persist filter preferences (optional)\n- Offline -> Filters work on cached data\n- Write unit tests for filter logic",
            },
        ],
    },
    {
        "key": "PUR-29-BE",
        "summary": "[BE] Search & Filter Events API",
        "description": "As a backend service, I need to provide search and filter capabilities for events.\n\nAcceptance Criteria:\n- getEvents accepts search parameter\n- getEvents accepts category filter (list)\n- getEvents accepts date range filter\n- getEvents accepts location + radius filter\n- getEvents accepts isFree filter\n- Filters combine correctly (AND logic)\n- Empty filters return all events\n- Only active events returned",
        "priority": "High",
        "labels": "search filter events backend mvp",
        "tasks": [
            {
                "summary": "Add search and filter parameters to getEvents query",
                "description": "Implement all filter types on the backend.\n\n- Add search parameter -> keyword match in title/description (icontains, case-insensitive)\n- Add categories filter parameter (list of IDs) -> Events in ANY selected category\n- Add startDate/endDate filter parameters -> Events in date range (inclusive)\n- Add latitude/longitude/radiusKm parameters -> Events within radius (Haversine or PostGIS)\n- Add isFree filter parameter -> Only free or only paid events\n- search='hiking' -> Events with 'hiking' in title/description\n- search='' or null -> No filter applied\n- Filters combine with AND logic (category AND date AND location)\n- Empty/null filters -> All active events returned\n- No location params -> All events (no geo filter)\n- Edge of radius -> Correctly included/excluded\n- Query performs well with 1000+ events\n- Write pytest tests for all filter combinations",
            },
        ],
    },
    {
        "key": "PUR-30",
        "summary": "[FE] Onboarding Flow",
        "description": "As a new user, I want to select my interests during onboarding so recommendations are personalized from the start.\n\nAcceptance Criteria:\n- Onboarding shown on first login\n- Onboarding not shown on subsequent logins\n- User can select multiple interests\n- User can skip onboarding\n- Location permission requested during onboarding\n- Interests saved to profile\n- Completion redirects to main app\n- Skip redirects to main app with defaults",
        "priority": "Medium",
        "labels": "onboarding personalization ux mvp",
        "tasks": [
            {
                "summary": "Create onboarding flow screens with interest selection",
                "description": "Build the onboarding UI.\n\n- Create OnboardingNavigator/flow\n- Create WelcomeScreen component (app intro)\n- Create InterestSelectionScreen component\n- Create LocationPermissionScreen component\n- Create NotificationPermissionScreen (optional)\n- Create CompletionScreen component\n- Fetch available interests from backend\n- Implement interest chip multi-select UI\n- Tap interest -> Selected (highlighted), tap again -> Deselected\n- Progress indicator shows current step\n- Can go back to previous screen\n- Screens are visually appealing with brand colors",
            },
            {
                "summary": "Integrate onboarding mutations and completion check",
                "description": "Wire up onboarding to the backend.\n\n- Call CompleteOnboarding mutation on finish (saves interests, preferences)\n- Call SkipOnboarding mutation if skipped\n- Check is_onboarding_completed on app load\n- Navigate to onboarding or main app based on status\n- First login -> Onboarding starts\n- Complete onboarding -> Main app shown, is_onboarding_completed = true\n- Second login -> Onboarding skipped, main app shown\n- Skip -> has_skipped_onboarding = true, main app with defaults\n- Network failure saving interests -> Error, retry option\n- Already onboarded user hits onboarding route -> Redirect to main app\n- Write unit tests for onboarding flow",
            },
        ],
    },
]


def main():
    docs = "/Users/faithcatherine/dev/pursuit-project/pursuit/docs"
    parents_path = f"{docs}/jira-import-parents.csv"
    tasks_path = f"{docs}/jira-import-tasks.csv"

    # --- File 1: Parent Stories (import first, set Issue Type = Story in Jira) ---
    with open(parents_path, "w", newline="", encoding="utf-8") as f:
        writer = csv.writer(f, quoting=csv.QUOTE_ALL)
        writer.writerow(["Summary", "Description", "Priority", "Labels"])

        for issue in ISSUES:
            writer.writerow([
                issue["summary"],
                issue["description"],
                issue["priority"],
                issue["labels"],
            ])

    print(f"Parents: {len(ISSUES)} stories -> {parents_path}")

    # --- File 2: Consolidated Tasks (import second, set Issue Type = Task in Jira) ---
    task_count = 0
    with open(tasks_path, "w", newline="", encoding="utf-8") as f:
        writer = csv.writer(f, quoting=csv.QUOTE_ALL)
        writer.writerow(["Summary", "Description", "Priority", "Labels"])

        for issue in ISSUES:
            for task in issue["tasks"]:
                labels = f"{issue['labels']} {issue['key']}"
                writer.writerow([
                    f"[{issue['key']}] {task['summary']}",
                    f"Parent Story: {issue['summary']}\n\n{task['description']}",
                    issue["priority"],
                    labels,
                ])
                task_count += 1

    print(f"Tasks:   {task_count} consolidated tasks -> {tasks_path}")
    print(f"\nImport order:")
    print(f"  1. Import {parents_path} -- set Issue Type to 'Story' in Jira")
    print(f"  2. Import {tasks_path} -- set Issue Type to 'Task' in Jira")


if __name__ == "__main__":
    main()