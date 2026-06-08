"use server"

// ============================================================================
// Stub booking actions for library consumers.
//
// This file ships with the codebase atom library so that atoms importing
// `@/lib/actions/booking-actions` (e.g. `property-reserve`) compile out of the
// box. The real behavior must be wired up by the consuming application — these
// stubs intentionally return safe defaults / clear errors.
// ============================================================================

export async function getBlockedDates(
  listingId: number
): Promise<Array<{ startDate: Date; endDate: Date }>> {
  return []
}

export async function checkAvailability(input: {
  listingId: number
  checkIn: Date
  checkOut: Date
}): Promise<{
  available: boolean
  conflictingBookings?: unknown[]
  blockedDates?: unknown[]
}> {
  return { available: true }
}

export async function createBooking(input: {
  listingId: number
  checkIn: Date
  checkOut: Date
  guestCount: number
  specialRequests?: string
}): Promise<{ success: boolean; error?: string; booking?: { id: number } }> {
  return {
    success: false,
    error: "Stub: wire up @/lib/actions/booking-actions to a real backend",
  }
}
