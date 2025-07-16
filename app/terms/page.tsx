import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function TermsAndConditionsPage() {
  return (
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground text-3xl text-center">Terms and Conditions</CardTitle>
            <p className="text-muted-foreground text-center mt-2">Effective Date: July 12, 2024</p>
          </CardHeader>
          <CardContent className="prose prose-invert max-w-none text-muted-foreground space-y-6 p-6">
            <section>
              <h2 className="text-xl font-semibold text-foreground mb-2">1. Agreement to Terms</h2>
              <p>
                By using our website, CourseLogic, you agree to be bound by these Terms and Conditions. If you do not
                agree, do not use the site.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-2">2. User Accounts</h2>
              <p>
                When you create an account with us, you must provide us with information that is accurate, complete, and
                current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate
                termination of your account on our Service. You are responsible for safeguarding the password that you
                use to access the Service and for any activities or actions under your password.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-2">3. Intellectual Property</h2>
              <p>
                The Service and its original content (excluding Content provided by users), features, and functionality
                are and will remain the exclusive property of CourseLogic and its licensors. The content is protected by
                copyright. You may not distribute, modify, transmit, reuse, download, repost, copy, or use said Content,
                whether in whole or in part, for commercial purposes or for personal gain, without express advance
                written permission from us.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-2">4. User Conduct</h2>
              <p>You agree not to use the Service to:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>
                  Post any content that is unlawful, harmful, threatening, abusive, harassing, defamatory, vulgar,
                  obscene, or otherwise objectionable.
                </li>
                <li>Impersonate any person or entity.</li>
                <li>Violate any applicable local, state, national, or international law.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-2">5. Termination</h2>
              <p>
                We may terminate or suspend your account immediately, without prior notice or liability, for any reason
                whatsoever, including without limitation if you breach the Terms and Conditions.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-2">6. Limitation of Liability</h2>
              <p>
                In no event shall CourseLogic, nor its directors, employees, partners, agents, suppliers, or affiliates,
                be liable for any indirect, incidental, special, consequential or punitive damages, including without
                limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access
                to or use of or inability to access or use the Service.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-2">7. Changes to Terms</h2>
              <p>
                We reserve the right, at our sole discretion, to modify or replace these Terms at any time. We will
                provide at least 30 days' notice prior to any new terms taking effect. By continuing to access or use
                our Service after those revisions become effective, you agree to be bound by the revised terms.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-2">8. Contact Us</h2>
              <p>
                If you have any questions about these Terms, please contact us at{" "}
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
