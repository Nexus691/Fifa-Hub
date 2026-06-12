import { fetchAllGames } from './dist/services/worldCup26Api.js';
fetchAllGames().then(g => console.log('Games:', g.length)).catch(e => console.error(e));
