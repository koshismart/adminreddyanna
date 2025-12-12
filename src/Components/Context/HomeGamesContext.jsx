// Context/HomeGamesContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import Dexie from "dexie";

// IndexedDB Setup
const db = new Dexie("BettingGameListDB");
db.version(1).stores({
  gameData: "key, data, timestamp" // key = sport name (string)
});

// Context
const GameListUseContext = createContext();

// All supported sports (exact keys used in your app)
const ALL_SPORTS = [
  "Cricket",
  "Football",
  "Tennis",
  "Politics",
  "Table Tennis",
  "Kabaddi",
  "Horse Racing",
  "Greyhound Racing",
  "Basketball",
  "Volleyball",
  "Wrestling",
  "Badminton",
  "Snooker",
  "Darts",
  "Boxing",
  "Mixed Martial Arts",
  "American Football",
  "E Games",
  "Ice Hockey",
  "Futsal",
  "Motor Sports",
  "Int. Casino",
  "Slots",
  "Fantasy",
  "Crash",
  "Shooting",
  "TableGames",
  "Casino"
];

const GameListContext = ({ children }) => {
  const [gameList, setGameList] = useState(() => {
    // Initialize all keys with empty arrays
    const initial = {};
    ALL_SPORTS.forEach(sport => {
      initial[sport] = [];
    });
    return initial;
  });

  const [isLoaded, setIsLoaded] = useState(false);

  // Load all sports data from IndexedDB on mount
  useEffect(() => {
    const loadFromDB = async () => {
      try {
        const saved = {};
        const now = Date.now();
        const maxAge = 15 * 60 * 1000; // 15 minutes

        for (const sport of ALL_SPORTS) {
          const record = await db.gameData.get(sport);
          if (record && (now - record.timestamp) < maxAge) {
            saved[sport] = record.data || [];
          }
        }

        if (Object.keys(saved).length > 0) {
          setGameList(prev => ({ ...prev, ...saved }));
        }
      } catch (err) {
        console.warn("Failed to load game list from IndexedDB", err);
      } finally {
        setIsLoaded(true);
      }
    };

    loadFromDB();
  }, []);

  // Auto-save ALL sports to IndexedDB whenever gameList changes
  useEffect(() => {
    if (!isLoaded) return;

    const saveToDB = async () => {
      try {
        const records = ALL_SPORTS.map(sport => ({
          key: sport,
          data: gameList[sport] || [],
          timestamp: Date.now(),
        }));

        await db.gameData.bulkPut(records);
      } catch (err) {
        console.warn("Failed to save game list to IndexedDB", err);
      }
    };

    saveToDB();
  }, [gameList, isLoaded]);

  // Auto-clear stale data (older than 15 mins)
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const cutoff = Date.now() - 15 * 60 * 1000;
        const stale = await db.gameData
          .where("timestamp")
          .below(cutoff)
          .keys();

        if (stale.length > 0) {
          await db.gameData.bulkDelete(stale);
          console.log(`Cleared ${stale.length} stale sport records`);
        }
      } catch (err) {
        console.warn("Failed to clean up IndexedDB", err);
      }
    }, 10 * 60 * 1000); // Every 10 minutes

    return () => clearInterval(interval);
  }, []);

  return (
    <GameListUseContext.Provider value={{ gameList, setGameList }}>
      {children}
    </GameListUseContext.Provider>
  );
};

// Custom Hook
export const useGameList = () => {
  const context = useContext(GameListUseContext);
  if (!context) {
    throw new Error("useGameList must be used within GameListProvider");
  }
  return context;
};

// Export Provider Component
export default GameListContext;