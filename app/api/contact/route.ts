import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { name, email, message } = await request.json()

    if (!name || !email || !message) {
      return NextResponse.json({ error: "Name, email, and message are required." }, { status: 400 })
    }

    // In a real application, you would integrate with an email sending service here.
    // Examples: Resend, SendGrid, Nodemailer, Mailgun, etc.
    // This is a placeholder to simulate sending the email.
    console.log("--- New Contact Form Submission ---")
    console.log(`From: ${name} <${email}>`)
    console.log("Subject: New Contact Message from CourseLogic Website")
    console.log("Message:")
    console.log(message)
    console.log("-----------------------------------")
    console.log("NOTE: This is a simulated email. For actual email delivery, integrate with an email service.")

    return NextResponse.json({ success: true, message: "Your message has been sent successfully!" })
  } catch (error) {
    console.error("Error handling contact form submission:", error)
    return NextResponse.json({ error: "Failed to send message." }, { status: 500 })
  }
}
