import { getNews } from '@/lib/actions/finnhub.actions';
import { formatTimeAgo } from '@/lib/utils';
import Link from 'next/link';

const NewsStock = async ({ watchlistItems }: { watchlistItems: string[] }) => {
  const data = await getNews(watchlistItems, 6);
  console.log(data);
  return (
    <div className="watchlist-news">
      {data.map((article, index) => (
        <div className="news-item" key={index}>
          <p className="bg-[#72EEA2]/20 text-[#72EEA2] news-tag">{article.related}</p>
          <h3 className="news-title">{article.headline}</h3>
          <div className="flex flex-row justify-between w-full">
            <p className="news-meta">{article.source}</p>
            <p className="news-meta">{formatTimeAgo(article.datetime)}</p>
          </div>
          <p className="news-summary">{article.summary}</p>
          <Link href={article.url} className="news-cta" target="_blank">
            Read More &#8594;
          </Link>
        </div>
      ))}
    </div>
  );
};

export default NewsStock;
