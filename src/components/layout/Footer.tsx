import { Link } from 'react-router-dom'
import { LogoWithText } from '@/components/ui/logo'

const footerLinks = {
  seekers: [
    { href: '/jobs', label: 'Browse Jobs' },
    { href: '/profile', label: 'My Profile' },
    { href: '/applications', label: 'My Applications' },
    { href: '/dashboard', label: 'Dashboard' },
  ],
  employers: [
    { href: '/employer/dashboard', label: 'Employer Dashboard' },
    { href: '/jobs/create', label: 'Post a Job' },
    { href: '/hiring-workflow', label: 'Hiring Pipeline' },
  ],
  support: [
    { href: '/contact', label: 'Contact Us' },
    { href: '/faq', label: 'FAQ' },
    { href: '/privacy', label: 'Privacy Policy' },
    { href: '/terms', label: 'Terms of Service' },
  ],
}





export default function Footer() {
  return (
    <footer className="w-full border-t border-white/[0.05] bg-neutral-950">
      <div className="container px-4 md:px-6 py-12 md:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
          <div className="space-y-4">
            <LogoWithText />
            <p className="text-sm text-neutral-400 leading-relaxed">
              Your trusted platform for finding your dream job and connecting with top employers.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-sm text-white">For Job Seekers</h3>
            <ul className="space-y-2.5">
              {footerLinks.seekers.map((link) => (
                <li key={link.href}>
                  <Link to={link.href} className="text-sm text-neutral-400 hover:text-emerald-400 transition-colors py-1 block">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-sm text-white">For Employers</h3>
            <ul className="space-y-2.5">
              {footerLinks.employers.map((link) => (
                <li key={link.href}>
                  <Link to={link.href} className="text-sm text-neutral-400 hover:text-emerald-400 transition-colors py-1 block">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-sm text-white">Support</h3>
            <ul className="space-y-2.5">
              {footerLinks.support.map((link) => (
                <li key={link.href}>
                  <Link to={link.href} className="text-sm text-neutral-400 hover:text-emerald-400 transition-colors py-1 block">
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/[0.05] mt-10 md:mt-14 pt-6 md:pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs sm:text-sm text-neutral-500">
            &copy; {new Date().getFullYear()} LoftCommunity. All rights reserved.
          </p>
          <div className="flex gap-4 sm:gap-6">
            <Link to="/privacy" className="text-xs sm:text-sm text-neutral-500 hover:text-emerald-400 transition-colors">Privacy</Link>
            <Link to="/terms" className="text-xs sm:text-sm text-neutral-500 hover:text-emerald-400 transition-colors">Terms</Link>
            <Link to="/privacy" className="text-xs sm:text-sm text-neutral-500 hover:text-emerald-400 transition-colors">Privacy</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
