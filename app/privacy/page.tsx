import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground text-3xl text-center">Privacy Policy</CardTitle>
            <p className="text-muted-foreground text-center mt-2">Effective Date: July 12, 2024</p>
          </CardHeader>
          <CardContent className="prose prose-invert max-w-none text-muted-foreground space-y-6 p-6">
            <section>
              <h2 className="text-xl font-semibold text-foreground mb-2">1. Introduction</h2>
              <p>
                Welcome to CourseLogic. We are committed to protecting your privacy. This Privacy Policy explains how we
                collect, use, disclose, and safeguard your information when you use our website.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-2">2. Information We Collect</h2>
              <p>
                We may collect information about you in a variety of ways. The information we may collect on the Site
                includes:
              </p>
              <ul className="list-disc list-inside space-y-1">
                <li>
                  <strong>Personal Data:</strong> Personally identifiable information, such as your name and email
                  address, that you voluntarily give to us when you register with the Site.
                </li>
                <li>
                  <strong>Course Progress Data:</strong> We collect data on your progress through courses, including
                  completed lessons and quiz scores, to provide a personalized learning experience.
                </li>
                <li>
                  <strong>Derivative Data:</strong> Information our servers automatically collect when you access the
                  Site, such as your IP address, your browser type, your operating system, your access times, and the
                  pages you have viewed directly before and after accessing the Site.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-2">3. Use of Your Information</h2>
              <p>
                Having accurate information about you permits us to provide you with a smooth, efficient, and customized
                experience. Specifically, we may use information collected about you via the Site to:
              </p>
              <ul className="list-disc list-inside space-y-1">
                <li>Create and manage your account.</li>
                <li>Deliver courses and track your progress.</li>
                <li>Email you regarding your account or order.</li>
                <li>Monitor and analyze usage and trends to improve your experience with the Site.</li>
                <li>Protect against fraudulent transactions and ensure the security of our platform.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-2">4. Disclosure of Your Information</h2>
              <p>
                We do not sell, trade, or otherwise transfer to outside parties your Personally Identifiable
                Information. This does not include trusted third parties who assist us in operating our website,
                conducting our business, or servicing you, so long as those parties agree to keep this information
                confidential.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-2">5. Security of Your Information</h2>
              <p>
                We use administrative, technical, and physical security measures to help protect your personal
                information. While we have taken reasonable steps to secure the personal information you provide to us,
                please be aware that despite our efforts, no security measures are perfect or impenetrable, and no
                method of data transmission can be guaranteed against any interception or other type of misuse.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-2">6. Policy for Children</h2>
              <p>
                We do not knowingly solicit information from or market to children under the age of 13. If you become
                aware of any data we have collected from children under age 13, please contact us using the contact
                information provided below.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-2">7. Contact Us</h2>
              <p>
                If you have questions or comments about this Privacy Policy, please contact us at:{" "}
                <a href="mailto:IronLogic.contact@gmail.com" className="text-primary hover:underline">
                  IronLogic.contact@gmail.com
                </a>
                .
              </p>
            </section>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
