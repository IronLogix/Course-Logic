# CourseLogic - Course Platform

## Environment Variables Setup

You'll need to add these environment variables to your project:

### Supabase (Required)
\`\`\`
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
\`\`\`

### Google Gemini API (Required for AI Course Generation)
\`\`\`
GOOGLE_GENERATIVE_AI_API_KEY=your_gemini_api_key
\`\`\`

## Getting Your Gemini API Key (FREE!)

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the key and add it to your environment variables

### Gemini API Free Tier:
- **15 requests per minute**
- **1 million tokens per minute**
- **1,500 requests per day**
- **Completely FREE** (no credit card required)

This is perfect for course generation since you won't be making many requests!

## Setup Instructions

1. **Set up Supabase project**
2. **Get your Gemini API key** (free from Google AI Studio)
3. **Add environment variables**
4. **Run the database scripts**
5. **Sign up with your admin email**
6. **Run the admin setup script**

## Features

- ✅ **AI Course Generation** with Google Gemini
- ✅ **Rich Text Editor** with formatting
- ✅ **Module & Lesson Organization**
- ✅ **Real-time Database** with Supabase
- ✅ **User Authentication & Roles**
- ✅ **Progress Tracking**
- ✅ **Dark Theme UI**

## AI Course Generation

The AI can generate:
- Course titles
- Course descriptions
- Categories and levels
- Price and free status
- Module structures
- Detailed lesson content
- Duration estimates
- Rich formatted content (bold, italic, code blocks, bullet points)

All powered by Google's Gemini AI - completely free!
