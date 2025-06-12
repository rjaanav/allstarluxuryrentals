"use client"

import { motion } from "framer-motion"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

// Mock FAQ data
const faqData = [
  {
    category: "Booking Process",
    items: [
      {
        question: "How do I make a reservation?",
        answer:
          "You can make a reservation online through our website, by calling our customer service, or by visiting one of our locations. Online booking is the fastest way to secure your vehicle.",
      },
      {
        question: "What information do I need to make a booking?",
        answer:
          "To make a booking, you'll need your driver's license information, credit card details, and the dates you wish to rent the vehicle. You'll also need to specify your preferred pickup and drop-off locations.",
      },
      {
        question: "Can I modify or cancel my reservation?",
        answer:
          "Yes, you can modify or cancel your reservation up to 48 hours before your scheduled pickup time without any penalty. Changes made within 48 hours may incur a fee depending on the vehicle type.",
      },
      {
        question: "Is there a minimum rental period?",
        answer:
          "Yes, most of our luxury vehicles have a minimum rental period of 24 hours. Some high-end supercars may have a minimum rental period of 2-3 days.",
      },
    ],
  },
  {
    category: "Rental Requirements",
    items: [
      {
        question: "What is the minimum age to rent a car?",
        answer:
          "The minimum age to rent a standard luxury car is 25 years. For high-performance vehicles and supercars, the minimum age is 30 years with at least 5 years of driving experience.",
      },
      {
        question: "What documents do I need to rent a car?",
        answer:
          "You'll need a valid driver's license (held for at least 1 year), a major credit card in your name, and a valid ID or passport. International customers will need an International Driving Permit along with their original license.",
      },
      {
        question: "Do I need insurance to rent a car?",
        answer:
          "Yes, insurance is required for all rentals. We offer comprehensive insurance packages, or you can provide proof of your own coverage if it extends to rental vehicles.",
      },
      {
        question: "Is a security deposit required?",
        answer:
          "Yes, a security deposit is required for all rentals. The amount varies depending on the vehicle type, ranging from $1,000 for standard luxury cars to $10,000 for exotic supercars.",
      },
    ],
  },
  {
    category: "Pickup & Return",
    items: [
      {
        question: "Where can I pick up and return my rental car?",
        answer:
          "You can pick up and return your rental car at any of our designated locations. We also offer delivery and collection services for an additional fee within a 50-mile radius of our locations.",
      },
      {
        question: "What happens if I return the car late?",
        answer:
          "Late returns are charged at an hourly rate of the daily rental price. Returns more than 3 hours late will be charged for a full additional day.",
      },
      {
        question: "Do you offer airport pickup and drop-off?",
        answer:
          "Yes, we offer airport pickup and drop-off services at major airports. Please specify your flight details when making your reservation so we can coordinate accordingly.",
      },
      {
        question: "What is the fuel policy?",
        answer:
          "Our vehicles are provided with a full tank of fuel, and we expect them to be returned with a full tank. If the vehicle is not returned with a full tank, a refueling fee plus the cost of fuel will be charged.",
      },
    ],
  },
  {
    category: "Payments & Fees",
    items: [
      {
        question: "What payment methods do you accept?",
        answer:
          "We accept all major credit cards including Visa, MasterCard, American Express, and Discover. We do not accept cash, debit cards, or prepaid cards for reservations or security deposits.",
      },
      {
        question: "Are there any additional fees I should be aware of?",
        answer:
          "Additional fees may include insurance, additional driver fees, young driver surcharges, delivery/collection fees, and late return fees. All applicable fees will be disclosed during the booking process.",
      },
      {
        question: "Do you offer any discounts or promotions?",
        answer:
          "Yes, we regularly offer seasonal promotions and discounts for longer rental periods. We also have a loyalty program that provides benefits to frequent customers. Check our Promotions page for current offers.",
      },
      {
        question: "What is your refund policy?",
        answer:
          "Cancellations made more than 48 hours before the scheduled pickup time are eligible for a full refund. Cancellations made within 48 hours may be subject to a cancellation fee of up to one day's rental charge.",
      },
    ],
  },
  {
    category: "Vehicle Information",
    items: [
      {
        question: "What types of vehicles do you offer?",
        answer:
          "We offer a wide range of luxury vehicles including sedans, SUVs, convertibles, sports cars, and exotic supercars from premium brands such as Mercedes-Benz, BMW, Audi, Porsche, Ferrari, Lamborghini, and more.",
      },
      {
        question: "Are there mileage restrictions?",
        answer:
          "Yes, most of our rentals include 150 miles per day. Additional miles can be purchased at the time of booking or upon return. Some high-performance vehicles may have lower mileage allowances.",
      },
      {
        question: "Can I take the rental car out of state?",
        answer:
          "Yes, you can take our rental cars to neighboring states. However, some exotic vehicles may have geographic restrictions. Please inform us of your travel plans when making your reservation.",
      },
      {
        question: "Do your vehicles come with GPS navigation?",
        answer:
          "Yes, all our vehicles are equipped with GPS navigation systems. Many also feature Apple CarPlay and Android Auto for seamless integration with your smartphone.",
      },
    ],
  },
]

export default function FAQPage() {
  return (
    <div className="container mx-auto px-4 py-12 md:py-24 lg:py-32">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mx-auto max-w-3xl"
      >
        <h1 className="mb-6 md:mb-12 text-center text-2xl sm:text-3xl md:text-4xl font-bold">Frequently Asked Questions</h1>

        {/* Display all FAQs grouped by category */}
        {faqData.map((category, categoryIndex) => (
          <div key={categoryIndex} className="mb-10">
            <h2 className="mb-4 text-2xl font-semibold">{category.category}</h2>
            <Accordion type="single" collapsible className="w-full mb-6">
              {category.items.map((item, itemIndex) => (
                <AccordionItem key={itemIndex} value={`item-${categoryIndex}-${itemIndex}`}>
                  <AccordionTrigger className="text-left">{item.question}</AccordionTrigger>
                  <AccordionContent>
                    <p className="text-muted-foreground">{item.answer}</p>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        ))}

        {/* Contact Section */}
        <div className="mt-16 rounded-lg border border-gray-200 p-6 text-center dark:border-gray-700">
          <h2 className="mb-4 text-lg sm:text-xl md:text-2xl font-semibold">Still have questions?</h2>
          <p className="mb-4 md:mb-6 text-muted-foreground">
            If you couldn't find the answer to your question, please feel free to contact our customer support team.
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a
              href="tel:+1234567890"
              className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              Call Us
            </a>
            <a
              href="mailto:support@allstarluxury.com"
              className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
            >
              Email Support
            </a>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
