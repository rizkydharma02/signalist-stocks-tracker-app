/* eslint-disable @typescript-eslint/no-explicit-any */
import { Star } from 'lucide-react';
import { searchStocks } from '@/lib/actions/finnhub.actions';
import SearchCommand from '@/components/SearchCommand';
import { getWatchlistWithData } from '@/lib/actions/watchlist.actions';
import { WatchlistTable } from '@/components/WatchlistTable';
import NewsStock from '@/components/NewsStock';
import { Button } from '@/components/ui/button';

const Watchlist = async () => {
  const watchlist = await getWatchlistWithData();
  const symbols = watchlist.map((item: { symbol: any }) => item.symbol);
  const initialStocks = await searchStocks();

  // Empty state
  if (watchlist.length === 0) {
    return (
      <section className="flex watchlist-empty-container">
        <div className="watchlist-empty">
          <Star className="watchlist-star" />
          <h2 className="empty-title">Your watchlist is empty</h2>
          <p className="empty-description">Start building your watchlist by searching for stocks and clicking the star icon to add them.</p>
        </div>
        <SearchCommand initialStocks={initialStocks} />
      </section>
    );
  }

  const alerts = [
    {
      ticker: 'AAPL',
    },
  ];

  return (
    <section className="watchlist">
      <div className="flex flex-col gap-6">
        <div className="w-full">
          <div className="">
            <div className="flex justify-between items-center mb-4">
              <h2 className="watchlist-title">Watchlist</h2>
              <SearchCommand initialStocks={initialStocks} />
            </div>
            <WatchlistTable watchlist={watchlist} />
          </div>
        </div>
        <h2 className="watchlist-title">News</h2>
        <NewsStock watchlistItems={symbols} />
      </div>
    </section>
  );
};

export default Watchlist;
