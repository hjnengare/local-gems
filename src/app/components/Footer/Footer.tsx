import Link from 'next/link';

interface FooterProps {
  variant?: 'default' | 'bottom-nav';
}

export default function Footer({ variant = 'default' }: FooterProps) {
  if (variant === 'bottom-nav') {
    return (
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-light-gray px-4 py-2 z-40">
        <div className="flex items-center justify-center max-w-6xl mx-auto">
          <div className="flex items-center space-x-8">
            <Link href="/" className="flex flex-col items-center space-y-1 p-2 text-hoockers-green">
              <ion-icon name="home" size="small"></ion-icon>
              <span className="font-urbanist text-9 font-500">Home</span>
            </Link>
            <Link href="/leaderboard" className="flex flex-col items-center space-y-1 p-2 text-gray-web hover:text-hoockers-green transition-colors duration-1">
              <ion-icon name="trophy-outline" size="small"></ion-icon>
              <span className="font-urbanist text-9 font-500">Leaderboard</span>
            </Link>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <footer className="bg-cultured-2 py-section mt-section">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-urbanist text-5 font-700 text-hoockers-green mb-4">Local Gems</h3>
            <p className="font-urbanist text-6 font-400 text-gray-web">
              Discover trusted local gems near you
            </p>
          </div>

          <div>
            <h4 className="font-urbanist text-6 font-600 text-black mb-4">Explore</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/restaurants" className="font-urbanist text-7 font-400 text-gray-web hover:text-hoockers-green transition-colors duration-1">
                  Restaurants
                </Link>
              </li>
              <li>
                <Link href="/cafes" className="font-urbanist text-7 font-400 text-gray-web hover:text-hoockers-green transition-colors duration-1">
                  Cafes
                </Link>
              </li>
              <li>
                <Link href="/entertainment" className="font-urbanist text-7 font-400 text-gray-web hover:text-hoockers-green transition-colors duration-1">
                  Entertainment
                </Link>
              </li>
              <li>
                <Link href="/shopping" className="font-urbanist text-7 font-400 text-gray-web hover:text-hoockers-green transition-colors duration-1">
                  Shopping
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-urbanist text-6 font-600 text-black mb-4">Company</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="font-urbanist text-7 font-400 text-gray-web hover:text-hoockers-green transition-colors duration-1">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="font-urbanist text-7 font-400 text-gray-web hover:text-hoockers-green transition-colors duration-1">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="font-urbanist text-7 font-400 text-gray-web hover:text-hoockers-green transition-colors duration-1">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="font-urbanist text-7 font-400 text-gray-web hover:text-hoockers-green transition-colors duration-1">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-light-gray mt-8 pt-8">
          <p className="font-urbanist text-8 font-400 text-gray-web text-center">
            &copy; 2024 Local Gems. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}