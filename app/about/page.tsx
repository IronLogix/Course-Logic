import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Zap, Target, Heart, Lightbulb } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">About CourseLogic</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            We're building the future of online education with AI-powered course creation and personalized learning
            experiences.
          </p>
        </div>

        {/* Mission Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          <Card className="bg-card border-border">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-primary rounded-lg">
                  <Target className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-foreground">Our Mission</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                To democratize education by making high-quality learning accessible to everyone. We believe that
                knowledge should have no boundaries, and we're committed to creating an inclusive platform where
                learners can grow and thrive.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-accent rounded-lg">
                  <Heart className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-foreground">Our Vision</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                To become the world's leading platform for AI-enhanced learning, where every student receives
                personalized education tailored to their unique learning style and goals.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* What Makes Us Different */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-foreground text-center mb-12">What Makes Us Different</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="flex items-center justify-center w-16 h-16 bg-primary rounded-full mx-auto mb-4">
                <Zap className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">AI-Powered Creation</h3>
              <p className="text-muted-foreground">
                Our advanced AI helps instructors create comprehensive, engaging courses in minutes, not months.
              </p>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center w-16 h-16 bg-secondary rounded-full mx-auto mb-4">
                <Users className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Community-Driven</h3>
              <p className="text-muted-foreground">
                Built by educators, for educators. Every feature is designed based on real classroom needs and feedback.
              </p>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center w-16 h-16 bg-accent rounded-full mx-auto mb-4">
                <Lightbulb className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Innovation First</h3>
              <p className="text-muted-foreground">
                We're constantly pushing the boundaries of what's possible in online education with cutting-edge
                technology.
              </p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <Card className="bg-gradient-to-r from-primary to-accent border-0">
            <CardContent className="p-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">Join Our Learning Revolution</h2>
              <p className="text-primary-foreground text-lg mb-8 max-w-2xl mx-auto">
                Be part of the future of education. Whether you're here to learn or teach, CourseLogic provides the
                tools and community to help you succeed.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="/auth/signup"
                  className="bg-white text-primary px-8 py-3 rounded-lg font-semibold hover:bg-accent transition-colors"
                >
                  Start Learning Today
                </a>
                <a
                  href="/admin"
                  className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-primary transition-colors"
                >
                  Become an Instructor
                </a>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
