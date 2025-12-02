import Link from "next/link"
import { Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Instagram, Youtube, Send } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-primary text-primary-foreground">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Column 1: Mission & Contact */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <img src="/logo.png" alt="Idrisa Foundation" className="w-12 h-12 object-contain" />
              <div>
                <div className="font-bold text-lg">The Idrisa Foundation</div>
                <div className="text-xs text-primary-foreground/70">(U) LTD</div>
              </div>
            </div>
            <p className="text-sm text-primary-foreground/80 leading-relaxed">
              Empowering the next generation of scientists and innovators to solve global challenges through STEM
              education, scholarships, and mentorship.
            </p>
            <div className="space-y-3">
              <a
                href="https://maps.google.com"
                target="_blank"
                rel="noreferrer noopener"
                className="flex items-start gap-3 text-sm text-primary-foreground/80 hover:text-primary-foreground transition"
              >
                <MapPin className="w-5 h-5 shrink-0 mt-0.5" />
                <span>
                  Wakiso, Entebbe, Div (A), Katabi-Busambaga
                  <br />
                  P.O.Box 118175 Wakiso (U)
                </span>
              </a>
              <a
                href="mailto:theidrisafoundation@gmail.com"
                className="flex items-center gap-3 text-sm text-primary-foreground/80 hover:text-primary-foreground transition"
              >
                <Mail className="w-5 h-5 shrink-0" />
                <span>theidrisafoundation@gmail.com</span>
              </a>
              <a
                href="tel:+256787867309"
                className="flex items-center gap-3 text-sm text-primary-foreground/80 hover:text-primary-foreground transition"
              >
                <Phone className="w-5 h-5 shrink-0" />
                <span>+256 787 867 309</span>
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="font-bold text-lg mb-6">Explore</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/" className="text-sm text-primary-foreground/80 hover:text-primary-foreground transition">
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-sm text-primary-foreground/80 hover:text-primary-foreground transition"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/programs"
                  className="text-sm text-primary-foreground/80 hover:text-primary-foreground transition"
                >
                  Our Programs
                </Link>
              </li>
              <li>
                <Link
                  href="/impact"
                  className="text-sm text-primary-foreground/80 hover:text-primary-foreground transition"
                >
                  Impact
                </Link>
              </li>
              <li>
                <Link
                  href="/get-involved"
                  className="text-sm text-primary-foreground/80 hover:text-primary-foreground transition"
                >
                  Get Involved
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-sm text-primary-foreground/80 hover:text-primary-foreground transition"
                >
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Get Involved */}
          <div>
            <h3 className="font-bold text-lg mb-6">Get Involved</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/get-involved/donate"
                  className="text-sm text-primary-foreground/80 hover:text-primary-foreground transition"
                >
                  Donate
                </Link>
              </li>
              <li>
                <Link
                  href="/get-involved/partner"
                  className="text-sm text-primary-foreground/80 hover:text-primary-foreground transition"
                >
                  Become a Partner
                </Link>
              </li>
              <li>
                <Link
                  href="/get-involved/volunteer"
                  className="text-sm text-primary-foreground/80 hover:text-primary-foreground transition"
                >
                  Volunteer
                </Link>
              </li>
              <li>
                <Link
                  href="/scholars/apply"
                  className="text-sm text-primary-foreground/80 hover:text-primary-foreground transition"
                >
                  Apply for a Grant
                </Link>
              </li>
              <li>
                <Link
                  href="/programs/olympiad"
                  className="text-sm text-primary-foreground/80 hover:text-primary-foreground transition"
                >
                  Join the Olympiad
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Stay Connected */}
          <div>
            <h3 className="font-bold text-lg mb-6">Stay Connected</h3>

            {/* Social Media Icons */}
            <div className="flex gap-3 mb-8">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer noopener"
                className="w-10 h-10 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-primary-foreground/20 transition"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer noopener"
                className="w-10 h-10 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-primary-foreground/20 transition"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer noopener"
                className="w-10 h-10 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-primary-foreground/20 transition"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer noopener"
                className="w-10 h-10 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-primary-foreground/20 transition"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer noopener"
                className="w-10 h-10 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-primary-foreground/20 transition"
              >
                <Youtube className="w-5 h-5" />
              </a>
            </div>

            {/* Newsletter Signup */}
            <div>
              <p className="text-sm text-primary-foreground/80 mb-3">Get the latest news in your inbox.</p>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-2 rounded-lg bg-primary-foreground/10 border border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/50 text-sm focus:outline-none focus:border-accent"
                />
                <Button size="sm" className="bg-accent hover:bg-accent/90 text-accent-foreground px-4">
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-primary-foreground/20">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-primary-foreground/70">
              © {currentYear} The Idrisa Foundation (U) Limited. All Rights Reserved.
            </p>
            <div className="flex items-center gap-6 text-sm text-primary-foreground/70">
              <Link href="/privacy" className="hover:text-primary-foreground transition">
                Privacy Policy
              </Link>
              <Link href="/terms" className="hover:text-primary-foreground transition">
                Terms of Use
              </Link>
              <Link href="/sitemap" className="hover:text-primary-foreground transition">
                Sitemap
              </Link>
              <Link href="/accessibility" className="hover:text-primary-foreground transition">
                Accessibility
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
