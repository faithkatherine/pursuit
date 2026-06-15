# Payment Flow Implementation Summary

## Files Created

### Hooks
- **`hooks/usePayment.ts`** - Payment hook using REST API
  - Connects to `/api/payments/initiate/` and `/api/payments/status/`
  - Handles STK Push initiation, polling, and error states
  - Returns: `{ status, orderId, receipt, error, initiate, cancel, resetError }`

### Components
- **`components/Payments/TicketStepper.tsx`** - Quantity stepper for tickets
- **`components/Payments/PaymentMethodRow.tsx`** - M-Pesa/Card selection row
- **`components/Payments/TicketCard.tsx`** - Perforated ticket with QR placeholder
- **`components/Payments/index.tsx`** - Barrel export

### Screens
- **`screens/Events/Checkout.tsx`** - Main checkout flow
- **`screens/Events/Confirmation.tsx`** - Success screen with animated check

### Routes
- `app/(protected)/events/[eventId]/checkout.tsx` - Already existed
- `app/(protected)/events/[eventId]/confirmation.tsx` - Already existed
- `app/(protected)/events/[eventId]/_layout.tsx` - Already configured

## Navigation Flow

1. **Event Detail** → "Book" button → **Checkout**
2. **Checkout** → Pay button → **Waiting State** (inline overlay)
3. **Waiting State** → Success → **Confirmation**
4. **Confirmation** → "View in Plans" → **Plans Tab** (replaces checkout stack)

### Gestures
- Checkout: `gestureEnabled: false` (no swipe back during payment)
- Confirmation: `gestureEnabled: false` + Android back blocked
- Android back on Checkout: Shows confirmation dialog if payment in progress

## Color Direction Applied

All colors follow the new soft direction:

### Primary Actions
- Pay button, CTAs: **primary-container** (#7d6799) ✓
- Not using primary (#644f7f)

### Backgrounds
- **surface** (#fbf9f8) for main backgrounds ✓
- **surface-container-low** (#f5f3f3) for cards ✓
- Never white (#ffffff)

### Borders
- **outline-variant** (#ccc4cf) at 0.5 opacity ✓

### Text
- Secondary text: **on-surface-variant** (#4a454e) ✓

### Shadows
- Subtle: `shadowOpacity: 0.06`, `shadowRadius: 8` ✓

### Confirmation Screen
- Check circle background: **primary-fixed** (#eedcff) ✓
- Pulse ring: **primary-fixed-dim** (#d5bcf4) ✓
- Center dot: **primary-container** (#7d6799) ✓

## Payment API Integration

Uses **REST API** (not GraphQL):

### Initiate Payment
```
POST /api/payments/initiate/
Body: {
  event_id: string (UUID)
  phone_number: string (0712... or 254...)
  quantity: number
}
Response: {
  id, event_id, quantity, subtotal, platform_fee, total, status, checkout_request_id, resuming
}
```

### Check Status
```
GET /api/payments/status/{checkout_request_id}/
Response: {
  status: "pending" | "paid" | "failed" | "expired" | "refunded"
  order_id: string
  mpesa_receipt: string | null
}
```

## Features Implemented

✅ Checkout screen with event summary
✅ Ticket quantity stepper (0-10, min 1 to proceed)
✅ Payment method selection (M-Pesa active, Card stubbed)
✅ Phone number input with Kenyan format validation
✅ Order summary with Model B pricing (no fee to buyer)
✅ Promo code input (collapsed by default)
✅ Sticky bottom "Pay KES X" CTA
✅ Waiting overlay with pulsing spinner
✅ Polling every 3s for 90s timeout
✅ Error handling with inline error cards
✅ Cancel button during waiting
✅ Android back button interception
✅ Confirmation screen with animated check circle
✅ Perforated ticket card with category color band
✅ Reference number (PRS-XXXXXXXX)
✅ QR code placeholder
✅ Share ticket via React Native Share API
✅ PDF download stub
✅ "View in Plans" navigation

## Not Implemented (V1 Scope)

❌ Ticket tiers (backend only supports quantity)
❌ Real QR code generation
❌ PDF download
❌ Card payment (stubbed)
❌ Promo code validation
❌ "Add to calendar" feature

## Testing Checklist

- [ ] Phone number validation (07XX, 254XX)
- [ ] Quantity stepper min/max
- [ ] Payment initiation with valid phone
- [ ] STK Push prompt appears on phone
- [ ] Polling updates status correctly
- [ ] 90s timeout shows error
- [ ] Cancel during waiting works
- [ ] Success navigates to confirmation
- [ ] Confirmation shows ticket details
- [ ] Share button works
- [ ] "View in Plans" navigates correctly
- [ ] Android back button blocked on confirmation
- [ ] Error states show inline messages
- [ ] Web shows "mobile only" message

## Known Issues / Follow-ups

1. **Ticket tiers**: Backend supports simple quantity only. If tiers are added later, update:
   - `TicketStepper` to show tier-specific prices
   - `usePayment` hook to send tier array
   - Order summary to show tier breakdown

2. **Phone number**: Currently reads from `user.profile.phoneNumber`. If this field doesn't exist, user must enter manually.

3. **Environment variable**: Set `EXPO_PUBLIC_API_URL` to backend URL (defaults to http://localhost:8000).

4. **Authentication token**: Uses `accessToken` from secure storage. Ensure auth flow stores this correctly.

5. **Navigation params**: Confirmation screen expects `orderId`, `receipt`, `quantity` via route params.

## Color Tokens Reference

```typescript
colors.primaryContainer       // #7d6799 - Primary actions
colors.primaryFixed          // #eedcff - Soft backgrounds
colors.primaryFixedDim       // #d5bcf4 - Pulse rings
colors.surface               // #fbf9f8 - Main backgrounds
colors.surfaceContainerLow   // #f5f3f3 - Cards
colors.onSurface            // #1b1c1c - Primary text
colors.onSurfaceVariant     // #4a454e - Secondary text
colors.outlineVariant       // #ccc4cf - Borders at 0.5 opacity
colors.error                // #ba1a1a - Error messages
colors.errorContainer       // #ffdad6 - Error backgrounds
```

## Next Steps

1. Run `npm run codegen` if GraphQL schema changes
2. Test payment flow end-to-end
3. Verify M-Pesa sandbox integration
4. Test all error scenarios (timeout, insufficient funds, etc.)
5. Add analytics events for payment funnel
6. Consider adding "You might also like" section to confirmation (spec says to use existing RecommendationCard component)
