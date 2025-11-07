import Link from "next/link"

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-primary text-primary-foreground py-12 mt-20">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="font-bold text-lg mb-4">About Us</h3>
            <p className="text-sm text-primary-foreground/80">
              The Idrisa Foundation is dedicated to empowering Uganda's youth through STEM education and career
              guidance.
            </p>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/our-story" className="hover:underline">
                  Our Story
                </Link>
              </li>
              <li>
                <Link href="/our-programs" className="hover:underline">
                  Our Programs
                </Link>
              </li>
              <li>
                <Link href="/olympiad" className="hover:underline">
                  The Olympiad
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4">Programs</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/programs/olympiad" className="hover:underline">
                  STEM Olympiad
                </Link>
              </li>
              <li>
                <Link href="/programs/career-guidance" className="hover:underline">
                  Career Guidance
                </Link>
              </li>
              <li>
                <Link href="/programs/internships" className="hover:underline">
                  Internships
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4">Get Started</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/participant/signup" className="hover:underline">
                  Register as Participant
                </Link>
              </li>
              <li>
                <Link href="/participant/login" className="hover:underline">
                  Participant Login
                </Link>
              </li>
              <li>
                <Link href="/admin/login" className="hover:underline">
                  Admin Portal
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 pt-8">
          <p className="text-center text-sm text-primary-foreground/80">
            © {currentYear} The Idrisa Foundation (U) Limited. All rights reserved. | Founded by Idrisa Kiryowa
          </p>
        </div>
      </div>
    </footer>
  )
}
