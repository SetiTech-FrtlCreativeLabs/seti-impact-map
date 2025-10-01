import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { MapIcon, ShieldCheckIcon, GlobeAltIcon } from '@heroicons/react/24/outline'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900">SETI.Impact MAP</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/auth/signin">
                <Button variant="outline">Sign In</Button>
              </Link>
              <Link href="/auth/signup">
                <Button>Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Track Your Impact with
            <span className="text-primary-600"> Blockchain</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Connect your purchases to real-world initiatives. Every purchase generates a unique blockchain token 
            that tracks your contribution to global causes and environmental projects.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/signup">
              <Button size="lg" className="w-full sm:w-auto">
                Start Tracking Impact
              </Button>
            </Link>
            <Link href="/initiatives">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                Explore Initiatives
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            How It Works
          </h2>
          <p className="text-lg text-gray-600">
            Simple, transparent, and impactful
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <Card className="text-center p-8">
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <ShieldCheckIcon className="w-6 h-6 text-primary-600" />
            </div>
            <h3 className="text-xl font-semibold mb-4">Purchase & Mint</h3>
            <p className="text-gray-600">
              When you make a purchase, we automatically mint a unique blockchain token 
              that represents your contribution to a specific initiative.
            </p>
          </Card>

          <Card className="text-center p-8">
            <div className="w-12 h-12 bg-secondary-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <MapIcon className="w-6 h-6 text-secondary-600" />
            </div>
            <h3 className="text-xl font-semibold mb-4">Track Progress</h3>
            <p className="text-gray-600">
              Follow your initiative's progress on our interactive map with real-time updates, 
              photos, and impact metrics.
            </p>
          </Card>

          <Card className="text-center p-8">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <GlobeAltIcon className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold mb-4">Make Impact</h3>
            <p className="text-gray-600">
              See the real-world impact of your purchases through verified progress reports 
              and environmental data.
            </p>
          </Card>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-primary-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Make a Difference?
          </h2>
          <p className="text-xl mb-8 mb-8">
            Join thousands of people already tracking their impact through blockchain technology.
          </p>
          <Link href="/auth/signup">
            <Button size="lg" variant="secondary">
              Get Started Today
            </Button>
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-gray-400">
              © 2024 Initiative Tracker. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
