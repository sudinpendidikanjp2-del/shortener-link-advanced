import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Link2, Zap, Shield, BarChart3, QrCode, Clock } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Link2 className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-semibold text-lg">Linkly</span>
          </Link>
          <div className="flex items-center gap-4">
            <Button variant="ghost" asChild>
              <Link href="/login">Sign in</Link>
            </Button>
            <Button asChild>
              <Link href="/register">Get Started</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="container mx-auto px-4 py-24 text-center">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-balance max-w-3xl mx-auto">
          Shorten Links, Amplify Your Reach
        </h1>
        <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
          Create short, memorable links with powerful analytics, QR codes, and password protection. Track every click and optimize your marketing campaigns.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" asChild>
            <Link href="/register">Start for Free</Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/login">Sign in</Link>
          </Button>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-24">
        <h2 className="text-3xl font-bold text-center mb-12">
          Everything You Need
        </h2>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <FeatureCard
            icon={<Zap className="w-6 h-6" />}
            title="Custom Slugs"
            description="Create memorable short links with custom slugs or let us generate them automatically."
          />
          <FeatureCard
            icon={<BarChart3 className="w-6 h-6" />}
            title="Detailed Analytics"
            description="Track clicks, locations, devices, browsers, and more with real-time analytics."
          />
          <FeatureCard
            icon={<Shield className="w-6 h-6" />}
            title="Password Protection"
            description="Secure your links with passwords to control who can access them."
          />
          <FeatureCard
            icon={<Clock className="w-6 h-6" />}
            title="Expiration Dates"
            description="Set expiration dates for time-sensitive links and campaigns."
          />
          <FeatureCard
            icon={<QrCode className="w-6 h-6" />}
            title="QR Code Generation"
            description="Generate beautiful QR codes with your logo for any short link."
          />
          <FeatureCard
            icon={<Link2 className="w-6 h-6" />}
            title="Link Management"
            description="Organize, search, filter, and manage all your links in one place."
          />
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-4 py-24">
        <div className="bg-muted rounded-2xl p-12 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
            Join thousands of users who trust Linkly for their link shortening needs.
          </p>
          <Button size="lg" asChild>
            <Link href="/register">Create Your Free Account</Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Linkly. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode
  title: string
  description: string
}) {
  return (
    <div className="p-6 rounded-xl border border-border bg-card">
      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-4">
        {icon}
      </div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  )
}
