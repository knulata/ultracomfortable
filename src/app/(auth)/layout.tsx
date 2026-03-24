import Link from 'next/link'

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-secondary relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-primary/10" />

        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          <Link href="/" className="text-3xl font-bold">
            <span className="text-primary">UC</span>
          </Link>

          <div className="max-w-md">
            <h1 className="text-4xl font-bold mb-4">
              Comfort Meets Style
            </h1>
            <p className="text-lg text-muted-foreground">
              Join thousands of fashion lovers who shop with UC.
              Get exclusive deals, earn points, and enjoy a personalized shopping experience.
            </p>

            <div className="flex gap-8 mt-8">
              <div>
                <p className="text-3xl font-bold text-primary">500K+</p>
                <p className="text-sm text-muted-foreground">Happy Customers</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-primary">10K+</p>
                <p className="text-sm text-muted-foreground">Products</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-primary">4.8</p>
                <p className="text-sm text-muted-foreground">App Rating</p>
              </div>
            </div>
          </div>

          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Alyanoor. All rights reserved.
          </p>
        </div>
      </div>

      {/* Right Side - Auth Form */}
      <div className="flex-1 flex items-center justify-center p-6 bg-background">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-8">
            <Link href="/" className="text-3xl font-bold">
              <span className="text-primary">UC</span>
            </Link>
          </div>

          {children}
        </div>
      </div>
    </div>
  )
}
