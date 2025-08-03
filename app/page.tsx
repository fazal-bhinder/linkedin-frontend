import { Card } from '@radix-ui/themes'
import AuthLandingClient from './auth/page'


export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-linkedin-50 via-white to-blue-50">
      <div className="container mx-auto px-4 py-8">
        <AuthLandingClient />
        {/* Demo Credentials */}
        <div className="mt-6 text-center">
          <Card className="bg-blue-50 border-blue-200">
            <div className="pt-4">
              <h3 className="text-sm font-semibold text-blue-900 mb-2">
                Demo Credentials
              </h3>
              <div className="text-xs text-blue-700 space-y-1">
                <p>Admin: admin@demo.com / password123</p>
                <p>User: user@demo.com / password123</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
} 