import React from 'react';
import { useGetUpcomingFixtures, useGetRecentFixtures } from '@workspace/api-client-react';

export function LiveTicker() {
  const { data: upcoming } = useGetUpcomingFixtures({ limit: 5 });
  const { data: recent } = useGetRecentFixtures({ limit: 5 });

  const upcomingArr = Array.isArray(upcoming) ? upcoming : [];
  const recentArr = Array.isArray(recent) ? recent : [];

  const liveMatches = recentArr.filter(f => f.statusShort === '1H' || f.statusShort === '2H' || f.statusShort === 'HT' || f.statusShort === 'ET' || f.statusShort === 'P');
  const finishedMatches = recentArr.filter(f => f.statusShort === 'FT' || f.statusShort === 'AET' || f.statusShort === 'PEN').slice(0, 2);
  
  // Combine to create ticker items
  const items = [...liveMatches, ...upcomingArr, ...finishedMatches].slice(0, 5);

  if (items.length === 0) {
    return (
      <div className="live-ticker">
        <div className="ticker-track">
          {Array.from({ length: 4 }).map((_, i) => (
            <React.Fragment key={i}>
              <div className="ticker-live-item text-muted-foreground">
                AWAITING FIXTURES
              </div>
              <span className="ticker-sep">★</span>
            </React.Fragment>
          ))}
        </div>
      </div>
    );
  }

  const formatTime = (dateString: string) => {
    const d = new Date(dateString);
    return `${d.toLocaleString('en-US', { month: 'short', day: 'numeric' })} ${d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })}`;
  };

  return (
    <div className="live-ticker">
      <div className="ticker-track">
        {/* Repeat content to create seamless infinite scroll */}
        {Array.from({ length: 4 }).map((_, repeatIndex) => (
          <React.Fragment key={repeatIndex}>
            {items.map((fixture, i) => {
              const isLive = fixture.statusShort === '1H' || fixture.statusShort === '2H' || fixture.statusShort === 'HT' || fixture.statusShort === 'ET' || fixture.statusShort === 'P';
              const isFinished = fixture.statusShort === 'FT' || fixture.statusShort === 'AET' || fixture.statusShort === 'PEN';
              
              const homeCode = fixture.homeTeam.code || fixture.homeTeam.name.substring(0, 3).toUpperCase();
              const awayCode = fixture.awayTeam.code || fixture.awayTeam.name.substring(0, 3).toUpperCase();

              return (
                <React.Fragment key={`${fixture.id}-${i}`}>
                  <div className="ticker-live-item">
                    {isLive ? (
                      <>
                        <span className="live-marker">🔴 LIVE</span> · {homeCode} <span className="score">{fixture.homeScore}–{fixture.awayScore}</span> {awayCode} · <span className="minute-flip"><span className="minute-flip-inner">{fixture.elapsed}'</span></span>
                      </>
                    ) : isFinished ? (
                      <>
                        <span className="text-muted-foreground">FT</span> · {homeCode} <span className="score">{fixture.homeScore}–{fixture.awayScore}</span> {awayCode}
                      </>
                    ) : (
                      <>
                        UPCOMING · {homeCode} vs {awayCode} · {formatTime(fixture.date)}
                      </>
                    )}
                  </div>
                  <span className="ticker-sep">★</span>
                </React.Fragment>
              );
            })}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
