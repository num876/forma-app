export type League = {
  id: number;
  name: string;
  country: string;
  logoUrl?: string;
};

export type Club = {
  id: number;
  name: string;
  leagueId: number;
  logoUrl?: string;
};

export type Player = {
  id: number;
  name: string;
  clubId: number;
  position: "GK" | "DEF" | "MID" | "ATT";
  nationality: string;
};

export const LEAGUES: League[] = [
  { id: 39, name: "Premier League", country: "England" },
  { id: 140, name: "La Liga", country: "Spain" },
  { id: 78, name: "Bundesliga", country: "Germany" },
  { id: 135, name: "Serie A", country: "Italy" },
  { id: 61, name: "Ligue 1", country: "France" },
];

export const CLUBS: Club[] = [
  // Premier League (39)
  { id: 42, name: "Arsenal", leagueId: 39 },
  { id: 33, name: "Chelsea", leagueId: 39 },
  { id: 40, name: "Liverpool", leagueId: 39 },
  { id: 47, name: "Man City", leagueId: 39 },
  { id: 39, name: "Tottenham", leagueId: 39 }, // Note: 39 is Spurs ID
  // La Liga (140)
  { id: 529, name: "Barcelona", leagueId: 140 },
  { id: 541, name: "Real Madrid", leagueId: 140 },
  { id: 530, name: "Atletico Madrid", leagueId: 140 },
  { id: 536, name: "Sevilla", leagueId: 140 },
  { id: 533, name: "Villarreal", leagueId: 140 },
  // Bundesliga (78)
  { id: 157, name: "Bayern Munich", leagueId: 78 },
  { id: 165, name: "Dortmund", leagueId: 78 },
  { id: 168, name: "Leverkusen", leagueId: 78 },
  { id: 173, name: "Leipzig", leagueId: 78 },
  { id: 169, name: "Frankfurt", leagueId: 78 },
  // Serie A (135)
  { id: 505, name: "Inter Milan", leagueId: 135 },
  { id: 489, name: "AC Milan", leagueId: 135 },
  { id: 496, name: "Juventus", leagueId: 135 },
  { id: 492, name: "Napoli", leagueId: 135 },
  { id: 497, name: "Roma", leagueId: 135 },
  // Ligue 1 (61)
  { id: 85, name: "PSG", leagueId: 61 },
  { id: 91, name: "Monaco", leagueId: 61 },
  { id: 71, name: "Marseille", leagueId: 61 },
  { id: 79, name: "Lille", leagueId: 61 },
  { id: 80, name: "Lyon", leagueId: 61 },
];

export const PLAYERS: Player[] = [
  // Arsenal (42)
  { id: 1, name: "Bukayo Saka", clubId: 42, position: "ATT", nationality: "England" },
  { id: 2, name: "Martin Ødegaard", clubId: 42, position: "MID", nationality: "Norway" },
  { id: 3, name: "Declan Rice", clubId: 42, position: "MID", nationality: "England" },
  { id: 4, name: "William Saliba", clubId: 42, position: "DEF", nationality: "France" },
  { id: 5, name: "Gabriel Martinelli", clubId: 42, position: "ATT", nationality: "Brazil" },
  
  // Chelsea (33)
  { id: 6, name: "Cole Palmer", clubId: 33, position: "MID", nationality: "England" },
  { id: 7, name: "Enzo Fernández", clubId: 33, position: "MID", nationality: "Argentina" },
  { id: 8, name: "Reece James", clubId: 33, position: "DEF", nationality: "England" },
  { id: 9, name: "Nicolas Jackson", clubId: 33, position: "ATT", nationality: "Senegal" },
  { id: 10, name: "Moisés Caicedo", clubId: 33, position: "MID", nationality: "Ecuador" },

  // Liverpool (40)
  { id: 11, name: "Mohamed Salah", clubId: 40, position: "ATT", nationality: "Egypt" },
  { id: 12, name: "Virgil van Dijk", clubId: 40, position: "DEF", nationality: "Netherlands" },
  { id: 13, name: "Trent Alexander-Arnold", clubId: 40, position: "DEF", nationality: "England" },
  { id: 14, name: "Alexis Mac Allister", clubId: 40, position: "MID", nationality: "Argentina" },
  { id: 15, name: "Darwin Núñez", clubId: 40, position: "ATT", nationality: "Uruguay" },

  // Man City (47)
  { id: 16, name: "Kevin De Bruyne", clubId: 47, position: "MID", nationality: "Belgium" },
  { id: 17, name: "Erling Haaland", clubId: 47, position: "ATT", nationality: "Norway" },
  { id: 18, name: "Phil Foden", clubId: 47, position: "MID", nationality: "England" },
  { id: 19, name: "Rodri", clubId: 47, position: "MID", nationality: "Spain" },
  { id: 20, name: "Rúben Dias", clubId: 47, position: "DEF", nationality: "Portugal" },

  // Tottenham (39)
  { id: 21, name: "Son Heung-min", clubId: 39, position: "ATT", nationality: "South Korea" },
  { id: 22, name: "James Maddison", clubId: 39, position: "MID", nationality: "England" },
  { id: 23, name: "Cristian Romero", clubId: 39, position: "DEF", nationality: "Argentina" },
  { id: 24, name: "Dejan Kulusevski", clubId: 39, position: "ATT", nationality: "Sweden" },
  { id: 25, name: "Pedro Porro", clubId: 39, position: "DEF", nationality: "Spain" },

  // Real Madrid (541)
  { id: 26, name: "Vinícius Júnior", clubId: 541, position: "ATT", nationality: "Brazil" },
  { id: 27, name: "Jude Bellingham", clubId: 541, position: "MID", nationality: "England" },
  { id: 28, name: "Rodrygo", clubId: 541, position: "ATT", nationality: "Brazil" },
  { id: 29, name: "Federico Valverde", clubId: 541, position: "MID", nationality: "Uruguay" },
  { id: 30, name: "Antonio Rüdiger", clubId: 541, position: "DEF", nationality: "Germany" },

  // Barcelona (529)
  { id: 31, name: "Robert Lewandowski", clubId: 529, position: "ATT", nationality: "Poland" },
  { id: 32, name: "Pedri", clubId: 529, position: "MID", nationality: "Spain" },
  { id: 33, name: "Lamine Yamal", clubId: 529, position: "ATT", nationality: "Spain" },
  { id: 34, name: "Ronald Araújo", clubId: 529, position: "DEF", nationality: "Uruguay" },
  { id: 35, name: "Frenkie de Jong", clubId: 529, position: "MID", nationality: "Netherlands" },

  // Atletico Madrid (530)
  { id: 36, name: "Antoine Griezmann", clubId: 530, position: "ATT", nationality: "France" },
  { id: 37, name: "Koke", clubId: 530, position: "MID", nationality: "Spain" },
  { id: 38, name: "Jan Oblak", clubId: 530, position: "GK", nationality: "Slovenia" },
  { id: 39, name: "Marcos Llorente", clubId: 530, position: "MID", nationality: "Spain" },
  { id: 40, name: "Julián Alvarez", clubId: 530, position: "ATT", nationality: "Argentina" },

  // Sevilla (536)
  { id: 41, name: "Loïc Badé", clubId: 536, position: "DEF", nationality: "France" },
  { id: 42, name: "Jesús Navas", clubId: 536, position: "DEF", nationality: "Spain" },
  { id: 43, name: "Isaac Romero", clubId: 536, position: "ATT", nationality: "Spain" },
  { id: 44, name: "Dodi Lukebakio", clubId: 536, position: "ATT", nationality: "Belgium" },
  { id: 45, name: "Nemanja Gudelj", clubId: 536, position: "MID", nationality: "Serbia" },

  // Villarreal (533)
  { id: 46, name: "Gerard Moreno", clubId: 533, position: "ATT", nationality: "Spain" },
  { id: 47, name: "Dani Parejo", clubId: 533, position: "MID", nationality: "Spain" },
  { id: 48, name: "Álex Baena", clubId: 533, position: "MID", nationality: "Spain" },
  { id: 49, name: "Juan Foyth", clubId: 533, position: "DEF", nationality: "Argentina" },
  { id: 50, name: "Diego Conde", clubId: 533, position: "GK", nationality: "Spain" },

  // Bayern Munich (157)
  { id: 51, name: "Harry Kane", clubId: 157, position: "ATT", nationality: "England" },
  { id: 52, name: "Jamal Musiala", clubId: 157, position: "MID", nationality: "Germany" },
  { id: 53, name: "Leroy Sané", clubId: 157, position: "ATT", nationality: "Germany" },
  { id: 54, name: "Joshua Kimmich", clubId: 157, position: "MID", nationality: "Germany" },
  { id: 55, name: "Alphonso Davies", clubId: 157, position: "DEF", nationality: "Canada" },

  // Dortmund (165)
  { id: 56, name: "Karim Adeyemi", clubId: 165, position: "ATT", nationality: "Germany" },
  { id: 57, name: "Julian Brandt", clubId: 165, position: "MID", nationality: "Germany" },
  { id: 58, name: "Serhou Guirassy", clubId: 165, position: "ATT", nationality: "Guinea" },
  { id: 59, name: "Nico Schlotterbeck", clubId: 165, position: "DEF", nationality: "Germany" },
  { id: 60, name: "Gregor Kobel", clubId: 165, position: "GK", nationality: "Switzerland" },

  // Leverkusen (168)
  { id: 61, name: "Florian Wirtz", clubId: 168, position: "MID", nationality: "Germany" },
  { id: 62, name: "Alejandro Grimaldo", clubId: 168, position: "DEF", nationality: "Spain" },
  { id: 63, name: "Jeremie Frimpong", clubId: 168, position: "DEF", nationality: "Netherlands" },
  { id: 64, name: "Victor Boniface", clubId: 168, position: "ATT", nationality: "Nigeria" },
  { id: 65, name: "Granit Xhaka", clubId: 168, position: "MID", nationality: "Switzerland" },

  // Leipzig (173)
  { id: 66, name: "Xavi Simons", clubId: 173, position: "MID", nationality: "Netherlands" },
  { id: 67, name: "Loïs Openda", clubId: 173, position: "ATT", nationality: "Belgium" },
  { id: 68, name: "Benjamin Šeško", clubId: 173, position: "ATT", nationality: "Slovenia" },
  { id: 69, name: "Willi Orbán", clubId: 173, position: "DEF", nationality: "Hungary" },
  { id: 70, name: "David Raum", clubId: 173, position: "DEF", nationality: "Germany" },

  // Frankfurt (169)
  { id: 71, name: "Kevin Trapp", clubId: 169, position: "GK", nationality: "Germany" },
  { id: 72, name: "Mario Götze", clubId: 169, position: "MID", nationality: "Germany" },
  { id: 73, name: "Omar Marmoush", clubId: 169, position: "ATT", nationality: "Egypt" },
  { id: 74, name: "Hugo Larsson", clubId: 169, position: "MID", nationality: "Sweden" },
  { id: 75, name: "Robin Koch", clubId: 169, position: "DEF", nationality: "Germany" },

  // Inter Milan (505)
  { id: 76, name: "Lautaro Martínez", clubId: 505, position: "ATT", nationality: "Argentina" },
  { id: 77, name: "Nicolò Barella", clubId: 505, position: "MID", nationality: "Italy" },
  { id: 78, name: "Hakan Çalhanoğlu", clubId: 505, position: "MID", nationality: "Turkey" },
  { id: 79, name: "Federico Dimarco", clubId: 505, position: "DEF", nationality: "Italy" },
  { id: 80, name: "Marcus Thuram", clubId: 505, position: "ATT", nationality: "France" },

  // AC Milan (489)
  { id: 81, name: "Rafael Leão", clubId: 489, position: "ATT", nationality: "Portugal" },
  { id: 82, name: "Theo Hernández", clubId: 489, position: "DEF", nationality: "France" },
  { id: 83, name: "Christian Pulisic", clubId: 489, position: "ATT", nationality: "USA" },
  { id: 84, name: "Álvaro Morata", clubId: 489, position: "ATT", nationality: "Spain" },
  { id: 85, name: "Mike Maignan", clubId: 489, position: "GK", nationality: "France" },

  // Juventus (496)
  { id: 86, name: "Dušan Vlahović", clubId: 496, position: "ATT", nationality: "Serbia" },
  { id: 87, name: "Kenan Yıldız", clubId: 496, position: "ATT", nationality: "Turkey" },
  { id: 88, name: "Teun Koopmeiners", clubId: 496, position: "MID", nationality: "Netherlands" },
  { id: 89, name: "Gleison Bremer", clubId: 496, position: "DEF", nationality: "Brazil" },
  { id: 90, name: "Michele Di Gregorio", clubId: 496, position: "GK", nationality: "Italy" },

  // Napoli (492)
  { id: 91, name: "Romelu Lukaku", clubId: 492, position: "ATT", nationality: "Belgium" },
  { id: 92, name: "Khvicha Kvaratskhelia", clubId: 492, position: "ATT", nationality: "Georgia" },
  { id: 93, name: "Giovanni Di Lorenzo", clubId: 492, position: "DEF", nationality: "Italy" },
  { id: 94, name: "Stanislav Lobotka", clubId: 492, position: "MID", nationality: "Slovakia" },
  { id: 95, name: "Matteo Politano", clubId: 492, position: "ATT", nationality: "Italy" },

  // Roma (497)
  { id: 96, name: "Paulo Dybala", clubId: 497, position: "ATT", nationality: "Argentina" },
  { id: 97, name: "Lorenzo Pellegrini", clubId: 497, position: "MID", nationality: "Italy" },
  { id: 98, name: "Artem Dovbyk", clubId: 497, position: "ATT", nationality: "Ukraine" },
  { id: 99, name: "Gianluca Mancini", clubId: 497, position: "DEF", nationality: "Italy" },
  { id: 100, name: "Stephan El Shaarawy", clubId: 497, position: "ATT", nationality: "Italy" },

  // PSG (85)
  { id: 101, name: "Bradley Barcola", clubId: 85, position: "ATT", nationality: "France" },
  { id: 102, name: "Ousmane Dembélé", clubId: 85, position: "ATT", nationality: "France" },
  { id: 103, name: "Vitinha", clubId: 85, position: "MID", nationality: "Portugal" },
  { id: 104, name: "Marquinhos", clubId: 85, position: "DEF", nationality: "Brazil" },
  { id: 105, name: "Warren Zaïre-Emery", clubId: 85, position: "MID", nationality: "France" },

  // Monaco (91)
  { id: 106, name: "Breel Embolo", clubId: 91, position: "ATT", nationality: "Switzerland" },
  { id: 107, name: "Aleksandr Golovin", clubId: 91, position: "MID", nationality: "Russia" },
  { id: 108, name: "Youssouf Fofana", clubId: 91, position: "MID", nationality: "France" },
  { id: 109, name: "Takumi Minamino", clubId: 91, position: "MID", nationality: "Japan" },
  { id: 110, name: "Denis Zakaria", clubId: 91, position: "MID", nationality: "Switzerland" },

  // Marseille (71)
  { id: 111, name: "Mason Greenwood", clubId: 71, position: "ATT", nationality: "England" },
  { id: 112, name: "Jordan Veretout", clubId: 71, position: "MID", nationality: "France" },
  { id: 113, name: "Michael Murillo", clubId: 71, position: "DEF", nationality: "Panama" },
  { id: 114, name: "Chancel Mbemba", clubId: 71, position: "DEF", nationality: "DR Congo" },
  { id: 115, name: "Amine Harit", clubId: 71, position: "MID", nationality: "Morocco" },

  // Lille (79)
  { id: 116, name: "Jonathan David", clubId: 79, position: "ATT", nationality: "Canada" },
  { id: 117, name: "Bafodé Diakité", clubId: 79, position: "DEF", nationality: "France" },
  { id: 118, name: "Angel Gomes", clubId: 79, position: "MID", nationality: "England" },
  { id: 119, name: "Edon Zhegrova", clubId: 79, position: "ATT", nationality: "Kosovo" },
  { id: 120, name: "Lucas Chevalier", clubId: 79, position: "GK", nationality: "France" },

  // Lyon (80)
  { id: 121, name: "Alexandre Lacazette", clubId: 80, position: "ATT", nationality: "France" },
  { id: 122, name: "Corentin Tolisso", clubId: 80, position: "MID", nationality: "France" },
  { id: 123, name: "Rayan Cherki", clubId: 80, position: "MID", nationality: "France" },
  { id: 124, name: "Maxence Caqueret", clubId: 80, position: "MID", nationality: "France" },
  { id: 125, name: "Anthony Lopes", clubId: 80, position: "GK", nationality: "Portugal" },
];

export const getClubsByLeague = (leagueId: number) => CLUBS.filter(c => c.leagueId === leagueId);
export const getPlayersByClub = (clubId: number) => PLAYERS.filter(p => p.clubId === clubId);
export const getPlayerById = (id: number) => PLAYERS.find(p => p.id === id);
export const getClubById = (id: number) => CLUBS.find(c => c.id === id);
export const getLeagueById = (id: number) => LEAGUES.find(l => l.id === id);

export const getClubLogoUrl = (id: number) => `https://media.api-sports.io/football/teams/${id}.png`;
export const getLeagueLogoUrl = (id: number) => `https://media.api-sports.io/football/leagues/${id}.png`;
