import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Terms of Service - Allstar Luxury Car Rentals",
  description: "Terms of Service for Allstar Luxury Car Rentals",
}

export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="mb-8 text-center text-4xl font-bold">Terms of Service</h1>

      <div className="mx-auto max-w-3xl space-y-6">
        <section>
          <h2 className="mb-4 text-2xl font-semibold">1. Acceptance of Terms</h2>
          <p>
            By accessing or using the Allstar Luxury Car Rentals website and services, you agree to be bound by these
            Terms of Service. If you do not agree to these terms, please do not use our services.
          </p>
        </section>

        <section>
          <h2 className="mb-4 text-2xl font-semibold">2. Eligibility</h2>
          <p>
            To use our services, you must be at least 25 years old and possess a valid driver's license. Additional
            eligibility requirements may apply depending on the vehicle type and rental duration.
          </p>
        </section>

        <section>
          <h2 className="mb-4 text-2xl font-semibold">3. Booking and Reservations</h2>
          <p>
            All bookings are subject to vehicle availability. A valid credit card is required to secure a reservation.
            Cancellation policies vary based on the vehicle type and rental duration.
          </p>
        </section>

        <section>
          <h2 className="mb-4 text-2xl font-semibold">4. Vehicle Use</h2>
          <p>
            Vehicles may only be driven by authorized drivers listed on the rental agreement. Vehicles must be used in
            accordance with all applicable laws and regulations. Off-road driving is strictly prohibited.
          </p>
        </section>

        <section>
          <h2 className="mb-4 text-2xl font-semibold">5. Insurance and Liability</h2>
          <p>
            Basic insurance coverage is included with all rentals. Additional coverage options are available for
            purchase. The renter is responsible for any damage not covered by the selected insurance plan.
          </p>
        </section>

        <section>
          <h2 className="mb-4 text-2xl font-semibold">6. Fees and Charges</h2>
          <p>
            All fees and charges are clearly displayed during the booking process. Additional charges may apply for late
            returns, excessive mileage, or damage to the vehicle.
          </p>
        </section>

        <section>
          <h2 className="mb-4 text-2xl font-semibold">7. Modifications to Terms</h2>
          <p>
            Allstar Luxury Car Rentals reserves the right to modify these Terms of Service at any time. Changes will be
            effective immediately upon posting on our website.
          </p>
        </section>

        <section>
          <h2 className="mb-4 text-2xl font-semibold">8. Contact Information</h2>
          <p>
            If you have any questions about these Terms of Service, please contact us at support@allstarluxurycars.com.
          </p>
        </section>
      </div>
    </div>
  )
}
