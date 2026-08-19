import Link from "next/link";
import { MapPin, Phone, Mail } from "lucide-react";
import { FaFacebook, FaInstagram, FaWhatsapp, FaTiktok, FaApple, FaGooglePlay } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

const shopLinks = [
  { label: "All Products",    href: "/products" },
  { label: "New Arrivals",    href: "/products?sort=newest" },
  { label: "Deals & Offers",  href: "/deals" },
  { label: "Electronics",     href: "/products?category=electronics" },
  { label: "Fashion",         href: "/products?category=fashion" },
  { label: "Home & Living",   href: "/products?category=home" },
];

const helpLinks = [
  { label: "My Account",         href: "/account" },
  { label: "Track My Order",     href: "/account/orders" },
  { label: "Returns & Refunds",  href: "#" },
  { label: "FAQs",               href: "#" },
  { label: "Contact Us",         href: "#" },
  { label: "Seller Center",      href: "#" },
];

const paymentIcons = ["Visa", "MasterCard", "Paystack", "MTN MoMo", "AirtelTigo"];

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 mt-auto">

      {/* Top CTA strip */}
      <div className="bg-primary-600 py-4">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-white font-semibold text-sm">
            Download the Doonnia App — Shop anywhere, anytime
          </p>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-black text-white rounded-lg px-4 py-2 text-xs font-medium cursor-pointer hover:bg-gray-800 transition-colors">
              <FaApple size={16} /> App Store
            </div>
            <div className="flex items-center gap-2 bg-black text-white rounded-lg px-4 py-2 text-xs font-medium cursor-pointer hover:bg-gray-800 transition-colors">
              <FaGooglePlay size={14} /> Google Play
            </div>
          </div>
        </div>
      </div>

      {/* Main columns */}
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">

          {/* Brand */}
          <div className="space-y-4">
            <span className="text-2xl font-extrabold text-white tracking-tight">Doonnia</span>
            <p className="text-sm leading-relaxed text-gray-500">
              Your trusted online marketplace for quality products delivered across Ghana. Fast, secure, and affordable.
            </p>
            <div className="flex items-center gap-3 pt-1">
              <a href="#" aria-label="WhatsApp" className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-[#25D366] hover:text-white transition-colors">
                <FaWhatsapp size={15} />
              </a>
              <a href="#" aria-label="Facebook" className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-[#1877F2] hover:text-white transition-colors">
                <FaFacebook size={15} />
              </a>
              <a href="#" aria-label="Instagram" className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-[#E1306C] hover:text-white transition-colors">
                <FaInstagram size={15} />
              </a>
              <a href="#" aria-label="X" className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-black hover:text-white transition-colors">
                <FaXTwitter size={15} />
              </a>
              <a href="#" aria-label="TikTok" className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-black hover:text-white transition-colors">
                <FaTiktok size={15} />
              </a>
            </div>
          </div>

          {/* Shop links */}
          <div className="space-y-4">
            <h4 className="text-white font-bold text-sm uppercase tracking-wider">Shop</h4>
            <ul className="space-y-2.5">
              {shopLinks.map((l) => (
                <li key={l.label}>
                  <Link href={l.href} className="text-sm hover:text-primary-400 transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Help links */}
          <div className="space-y-4">
            <h4 className="text-white font-bold text-sm uppercase tracking-wider">Help Center</h4>
            <ul className="space-y-2.5">
              {helpLinks.map((l) => (
                <li key={l.label}>
                  <Link href={l.href} className="text-sm hover:text-primary-400 transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h4 className="text-white font-bold text-sm uppercase tracking-wider">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2.5 text-sm">
                <MapPin size={15} className="shrink-0 mt-0.5 text-primary-500" />
                Accra, Ghana
              </li>
              <li className="flex items-center gap-2.5 text-sm">
                <Phone size={15} className="shrink-0 text-primary-500" />
                +233 20 000 0000
              </li>
              <li className="flex items-center gap-2.5 text-sm">
                <Mail size={15} className="shrink-0 text-primary-500" />
                hello@doonia.com
              </li>
            </ul>

            {/* Payment methods */}
            <div className="pt-2">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">We Accept</p>
              <div className="flex flex-wrap gap-1.5">
                {paymentIcons.map((p) => (
                  <span
                    key={p}
                    className="bg-gray-800 text-gray-300 text-[10px] font-medium px-2 py-1 rounded border border-gray-700"
                  >
                    {p}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-gray-600">
          <p>&copy; {new Date().getFullYear()} Doonnia. All rights reserved.</p>
          <div className="flex gap-5">
            <Link href="#" className="hover:text-gray-400 transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-gray-400 transition-colors">Terms of Service</Link>
            <Link href="#" className="hover:text-gray-400 transition-colors">Cookie Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
