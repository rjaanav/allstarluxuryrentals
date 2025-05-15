import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Privacy Policy - Allstar Luxury Car Rentals",
  description: "Privacy Policy for Allstar Luxury Car Rentals",
}

export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="mb-8 text-center text-4xl font-bold">Privacy Policy</h1>

      <div className="mx-auto max-w-3xl space-y-6">
        <section>
          <h2 className="mb-4 text-2xl font-semibold">1. Information We Collect</h2>
          <p>
            We collect personal information such as your name, email address, phone number, and payment information when
            you create an account or make a reservation. We also collect information about your vehicle preferences and
            rental history.
          </p>
        </section>

        <section>
          <h2 className="mb-4 text-2xl font-semibold">2. How We Use Your Information</h2>
          <p>
            We use your information to process reservations, provide customer support, improve our services, and send
            you promotional offers. We may also use your information for fraud prevention and legal compliance.
          </p>
        </section>

        <section>
          <h2 className="mb-4 text-2xl font-semibold">3. Information Sharing</h2>
          <p>
            We do not sell your personal information to third parties. We may share your information with service
            providers who help us operate our business, such as payment processors and insurance providers.
          </p>
        </section>

        <section>
          <h2 className="mb-4 text-2xl font-semibold">4. Cookies and Tracking</h2>
          <p>
            We use cookies and similar technologies to enhance your browsing experience, analyze website traffic, and
            personalize content. You can manage your cookie preferences through your browser settings.
          </p>
        </section>

        <section>
          <h2 className="mb-4 text-2xl font-semibold">5. Data Security</h2>
          <p>
            We implement appropriate security measures to protect your personal information from unauthorized access,
            alteration, or disclosure. However, no method of transmission over the internet is 100% secure.
          </p>
        </section>

        <section>
          <h2 className="mb-4 text-2xl font-semibold">6. Your Rights</h2>
          <p>
            You have the right to access, correct, or delete your personal information. You may also have the right to
            restrict or object to certain processing activities. To exercise these rights, please contact us at
            privacy@allstarluxurycars.com.
          </p>
        </section>

        <section>
          <h2 className="mb-4 text-2xl font-semibold">7. Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. We will notify you of any significant changes by
            posting the new policy on our website or by email.
          </p>
        </section>

        <section>
          <h2 className="mb-4 text-2xl font-semibold">8. Contact Information</h2>
          <p>
            If you have any questions about this Privacy Policy, please contact us at privacy@allstarluxurycars.com.
          </p>
        </section>
      </div>
    </div>
  )
}
