import Link from 'next/link'
import Galaxy from '@/components/Galaxy'

const FEATURES = [
  {
    icon: '👥',
    title: 'Contact Tracker',
    description: 'Organize every recruiter, referral, and networking contact in one place with status tracking.',
  },
  {
    icon: '🔔',
    title: 'Smart Reminders',
    description: 'Never forget a follow-up. Get daily digests and in-app alerts for overdue contacts.',
  },
  {
    icon: '📝',
    title: 'Message Templates',
    description: 'Pre-built templates with auto-filled variables for thank-yous, reconnects, and referrals.',
  },
  {
    icon: '📊',
    title: 'Interaction History',
    description: 'Log every touchpoint — email, LinkedIn, phone, in-person — with full timeline views.',
  },
  {
    icon: '✨',
    title: 'AI Suggestions',
    description: 'Pro users get AI-powered follow-up drafts personalized to each contact\'s context.',
  },
  {
    icon: '🔒',
    title: 'Private & Secure',
    description: 'Row-level security ensures your data is completely isolated and private.',
  },
]

const PRICING = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    features: ['Up to 15 contacts', '3 custom templates', 'Daily digest reminders', 'Full interaction history', 'Status tracking'],
    cta: 'Get Started Free',
    highlighted: false,
  },
  {
    name: 'Pro',
    price: '$9',
    period: '/month',
    features: ['Unlimited contacts', 'Unlimited templates', 'AI-generated suggestions', 'Priority email reminders', 'Advanced analytics', 'Everything in Free'],
    cta: 'Upgrade to Pro',
    highlighted: true,
  },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-dark-bg">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-dark-border bg-dark-bg/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center text-white font-bold text-sm">
              L
            </div>
            <span className="text-xl font-bold text-gray-100">Loopify</span>
          </Link>
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm text-gray-400 hover:text-gray-200 transition-colors">Features</a>
            <a href="#pricing" className="text-sm text-gray-400 hover:text-gray-200 transition-colors">Pricing</a>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm text-gray-400 hover:text-gray-200 transition-colors">
              Sign In
            </Link>
            <Link
              href="/login"
              className="bg-brand-600 hover:bg-brand-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all shadow-lg shadow-brand-600/25"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pb-20 px-4 sm:px-6 lg:px-8">
        {/* Galaxy Effect — above content */}
        <div className="max-w-4xl mx-auto pt-20">
          <Galaxy />
        </div>

        <div className="max-w-4xl mx-auto text-center -mt-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-brand-600/20 bg-brand-600/5 text-brand-400 text-sm mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-400 animate-pulse-soft" />
            Built for the 48-Hour Vibe Coding Hackathon
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-100 tracking-tight mb-6">
            Stop Losing Opportunities.
            <br />
            <span className="gradient-text">Start Following Up.</span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Loopify is your personal memory and timing system for professional relationships.
            Track contacts, log interactions, and get nudged at exactly the right moment — before the opportunity goes cold.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/login"
              className="bg-brand-600 hover:bg-brand-700 text-white px-8 py-3.5 rounded-xl text-base font-semibold transition-all shadow-lg shadow-brand-600/25 w-full sm:w-auto"
            >
              Launch Dashboard →
            </Link>
            <a
              href="#features"
              className="border border-dark-border hover:border-dark-border-hover text-gray-300 px-8 py-3.5 rounded-xl text-base font-semibold transition-all w-full sm:w-auto text-center"
            >
              See How It Works
            </a>
          </div>
        </div>

        {/* Dashboard Preview */}
        <div className="max-w-5xl mx-auto mt-16">
          <div className="glass-card p-6 sm:p-8">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
              {[
                { label: 'Active Contacts', value: '12', trend: '+3 this week' },
                { label: 'Due Today', value: '3', trend: 'Follow up now' },
                { label: 'Overdue', value: '1', trend: 'Action needed' },
                { label: 'Interviews', value: '2', trend: 'In progress' },
              ].map((stat) => (
                <div key={stat.label} className="p-4 rounded-lg bg-dark-surface border border-dark-border">
                  <p className="text-xs text-gray-500 uppercase tracking-wider">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-100 mt-1">{stat.value}</p>
                  <p className="text-xs text-brand-400 mt-1">{stat.trend}</p>
                </div>
              ))}
            </div>
            <div className="space-y-3">
              {[
                { name: 'Sarah Chen', company: 'TechCorp', status: 'Interviewing', due: 'Due today', statusColor: 'text-amber-400 bg-amber-400/10' },
                { name: 'James Rodriguez', company: 'Innovate.io', status: 'Applied', due: 'Due tomorrow', statusColor: 'text-violet-400 bg-violet-400/10' },
                { name: 'Priya Patel', company: 'StartupXYZ', status: 'Networking', due: 'Overdue', statusColor: 'text-cyan-400 bg-cyan-400/10' },
              ].map((contact) => (
                <div key={contact.name} className="flex items-center justify-between p-3 rounded-lg bg-dark-surface/50 border border-dark-border">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-brand-600/20 flex items-center justify-center text-brand-400 text-sm font-medium">
                      {contact.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-200">{contact.name}</p>
                      <p className="text-xs text-gray-500">{contact.company}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${contact.statusColor}`}>
                      {contact.status}
                    </span>
                    <span className={`text-xs ${contact.due === 'Overdue' ? 'text-red-400' : 'text-gray-500'}`}>
                      {contact.due}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 border-t border-dark-border">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-100 mb-4">
              Everything You Need to <span className="gradient-text">Stay in the Loop</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Purpose-built for the rhythm of a job search: reach out, wait, follow up, repeat.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((feature) => (
              <div
                key={feature.title}
                className="glass-card p-6 hover:border-dark-border-hover transition-all duration-300 group"
              >
                <div className="text-3xl mb-4">{feature.icon}</div>
                <h3 className="text-lg font-semibold text-gray-100 mb-2 group-hover:text-brand-400 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-400 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8 border-t border-dark-border">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-100 mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-gray-400">Start free. Upgrade when you need more power.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            {PRICING.map((plan) => (
              <div
                key={plan.name}
                className={`glass-card p-8 relative ${plan.highlighted ? 'border-brand-600/40 shadow-lg shadow-brand-600/10' : ''}`}
              >
                {plan.highlighted && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-brand-600 text-white text-xs font-medium px-3 py-1 rounded-full">
                    Most Popular
                  </div>
                )}
                <h3 className="text-xl font-bold text-gray-100">{plan.name}</h3>
                <div className="mt-4 mb-6">
                  <span className="text-4xl font-extrabold text-gray-100">{plan.price}</span>
                  <span className="text-gray-500 ml-1">{plan.period}</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm text-gray-300">
                      <span className="text-brand-400">✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/login"
                  className={`block w-full text-center py-3 rounded-lg font-medium transition-all ${
                    plan.highlighted
                      ? 'bg-brand-600 hover:bg-brand-700 text-white shadow-lg shadow-brand-600/25'
                      : 'border border-dark-border hover:border-dark-border-hover text-gray-300'
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 border-t border-dark-border">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-brand-600 flex items-center justify-center text-white font-bold text-xs">
              L
            </div>
            <span className="text-sm font-semibold text-gray-300">Loopify</span>
          </div>
          <p className="text-xs text-gray-500">
            Built by Prasanthi Vanga · 48-Hour Vibe Coding Hackathon · February 2026
          </p>
          <a href="mailto:pvanga2206@gmail.com" className="text-xs text-gray-500 hover:text-gray-300 transition-colors">
            pvanga2206@gmail.com
          </a>
        </div>
      </footer>
    </div>
  )
}
