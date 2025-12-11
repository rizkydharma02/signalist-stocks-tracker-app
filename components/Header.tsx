import Link from 'next/link';
import Image from 'next/image';

import UserDropdown from '@/components/UserDropdown';
import NavItems from '@/components/NavItems';
import { searchStocks } from '@/lib/actions/finnhub.actions';

const Header = async ({ user }: { user: User }) => {
  const initialStocks = await searchStocks();

  return (
    <header className="top-0 sticky header">
      <div className="container header-wrapper">
        <Link href="/">
          <Image src="/assets/icons/logo.svg" alt="Signalist logo" width={140} height={32} className="w-auto h-8 cursor-pointer" />
        </Link>
        <nav className="hidden sm:block">
          <NavItems initialStocks={initialStocks} />
        </nav>

        <UserDropdown user={user} initialStocks={initialStocks} />
      </div>
    </header>
  );
};
export default Header;
