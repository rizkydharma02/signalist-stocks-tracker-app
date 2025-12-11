import Link from 'next/link';
import Image from 'next/image';

import NavItems from './NavItems';
import UserDropdown from './UserDropdown';
import { searchStocks } from '@/lib/actions/finnhub.actions';

const Header = async ({ user }: { user: User }) => {
  const initialStocks = await searchStocks();

  return (
    <header className="top-0 sticky header">
      <div className="container header-wrapper">
        <Link href="/">
          <Image src="/assets/icons/logo.svg" alt="signalist-logo" width={140} height={32} className="w-auto h-8 cursor-pointer" />
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
