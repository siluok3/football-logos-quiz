import {DeleteItemCommand, DynamoDBClient, PutItemCommand, ScanCommand} from '@aws-sdk/client-dynamodb';
import { v4 as uuidv4 } from 'uuid';

export type LogoMetadata = {
  name: string;
  difficulty: 'easy' | 'medium' | 'hard';
  imageKey : string;
  enabled : boolean;
  league: string;
  country: string;
  division: number;
  alternatives?: string[];
}

const client  = new DynamoDBClient({ region: 'eu-central-1' });

const targetEnv = process.env.ENV || 'dev';
const tableName = `${targetEnv}-Logos`;

const logosMetadata: LogoMetadata[] = [
  //La Liga
  { name: 'Real Madrid', difficulty: 'easy', imageKey: 'realmadrid.png', enabled: true, league: 'La Liga', country: 'Spain', division: 1 },
  { name: 'Barcelona', difficulty: 'easy', imageKey: 'barcelona.png', enabled: true, league: 'La Liga', country: 'Spain', division: 1 },
  { name: 'Leganes', difficulty: 'hard', imageKey: 'cdleganes.png', enabled: true, league: 'La Liga', country: 'Spain', division: 1 },
  { name: 'Deportivo Alaves', difficulty: 'hard', imageKey: 'deportivoalaves.png', enabled: true, league: 'La Liga', country: 'Spain', division: 1 },
  { name: 'Getafe', difficulty: 'medium', imageKey: 'getafe.png', enabled: true, league: 'La Liga', country: 'Spain', division: 1 },
  { name: 'Valencia', difficulty: 'easy', imageKey: 'valencia.png', enabled: true, league: 'La Liga', country: 'Spain', division: 1 },
  { name: 'Celta', difficulty: 'medium', imageKey: 'rccelta.png', enabled: true, league: 'La Liga', country: 'Spain', division: 1 },
  { name: 'Real Valladolid', difficulty: 'hard', imageKey: 'realvalladolid.png', enabled: true, league: 'La Liga', country: 'Spain', division: 1 },
  { name: 'Osasuna', difficulty: 'medium', imageKey: 'osasuna.png', enabled: true, league: 'La Liga', country: 'Spain', division: 1 },
  { name: 'Espanyol', difficulty: 'medium', imageKey: 'espanyol.png', enabled: true, league: 'La Liga', country: 'Spain', division: 1 },
  { name: 'Rayo Vallecano', difficulty: 'medium', imageKey: 'rayovallecano.png', enabled: true, league: 'La Liga', country: 'Spain', division: 1 },
  { name: 'Real Betis', difficulty: 'medium', imageKey: 'realbetis.png', enabled: true, league: 'La Liga', country: 'Spain', division: 1 },
  { name: 'Real Sociedad', difficulty: 'medium', imageKey: 'realsociedad.png', enabled: true, league: 'La Liga', country: 'Spain', division: 1 },
  { name: 'Atletico Madrid', difficulty: 'easy', imageKey: 'atleticomadrid.png', enabled: true, league: 'La Liga', country: 'Spain', division: 1 },
  { name: 'Las Palmas', difficulty: 'hard', imageKey: 'udlaspalmas.png', enabled: true, league: 'La Liga', country: 'Spain', division: 1 },
  { name: 'Sevilla', difficulty: 'easy', imageKey: 'sevilla.png', enabled: true, league: 'La Liga', country: 'Spain', division: 1 },
  { name: 'Real Madrid', difficulty: 'easy', imageKey: 'realmadrid.png', enabled: true, league: 'La Liga', country: 'Spain', division: 1 },
  { name: 'Atletic Bilbao', difficulty: 'easy', imageKey: 'atleticbilbao.png', enabled: true, league: 'La Liga', country: 'Spain', division: 1 },
  { name: 'Villareal', difficulty: 'easy', imageKey: 'villareal.png', enabled: true, league: 'La Liga', country: 'Spain', division: 1 },
  { name: 'Mallorca', difficulty: 'medium', imageKey: 'rcdmallorca.png', enabled: true, league: 'La Liga', country: 'Spain', division: 1 },
  { name: 'Girona', difficulty: 'hard', imageKey: 'girona.png', enabled: true, league: 'La Liga', country: 'Spain', division: 1 },
  //Premier League
  { name: 'Bournemouth', difficulty: 'hard', imageKey: 'afcbournemouth.png', enabled: true, league: 'Premier League', country: 'England', division: 1 },
  { name: 'Arsenal', difficulty: 'easy', imageKey: 'arsenal.png', enabled: true, league: 'Premier League', country: 'England', division: 1 },
  { name: 'Aston Vila', difficulty: 'medium', imageKey: 'astonvila.png', enabled: true, league: 'Premier League', country: 'England', division: 1 },
  { name: 'Brentford', difficulty: 'hard', imageKey: 'brentford.png', enabled: true, league: 'Premier League', country: 'England', division: 1 },
  { name: 'Brighton', difficulty: 'medium', imageKey: 'brighton.png', enabled: true, league: 'Premier League', country: 'England', division: 1 },
  { name: 'Chelsea', difficulty: 'easy', imageKey: 'chelsea.png', enabled: true, league: 'Premier League', country: 'England', division: 1 },
  { name: 'Crystal Palace', difficulty: 'hard', imageKey: 'crystalpalace.png', enabled: true, league: 'Premier League', country: 'England', division: 1 },
  { name: 'Everton', difficulty: 'medium', imageKey: 'everton.png', enabled: true, league: 'Premier League', country: 'England', division: 1 },
  { name: 'Fulham', difficulty: 'medium', imageKey: 'fulham.png', enabled: true, league: 'Premier League', country: 'England', division: 1 },
  { name: 'Ipswich', difficulty: 'hard', imageKey: 'ipswich.png', enabled: true, league: 'Premier League', country: 'England', division: 1 },
  { name: 'Leicester', difficulty: 'medium', imageKey: 'leicester.png', enabled: true, league: 'Premier League', country: 'England', division: 1 },
  { name: 'Liverpool', difficulty: 'easy', imageKey: 'liverpool.png', enabled: true, league: 'Premier League', country: 'England', division: 1 },
  { name: 'Manchester City', difficulty: 'easy', imageKey: 'manchestercity.png', enabled: true, league: 'Premier League', country: 'England', division: 1 },
  { name: 'Manchester United', difficulty: 'easy', imageKey: 'manchesterunited.png', enabled: true, league: 'Premier League', country: 'England', division: 1 },
  { name: 'Newcastle', difficulty: 'medium', imageKey: 'newcastle.png', enabled: true, league: 'Premier League', country: 'England', division: 1 },
  { name: 'Nottigham', difficulty: 'hard', imageKey: 'nottighamforest.png', enabled: true, league: 'Premier League', country: 'England', division: 1 },
  { name: 'Southampton', difficulty: 'medium', imageKey: 'southampton.png', enabled: true, league: 'Premier League', country: 'England', division: 1 },
  { name: 'Tottenham', difficulty: 'medium', imageKey: 'tottenham.png', enabled: true, league: 'Premier League', country: 'England', division: 1 },
  { name: 'West Ham', difficulty: 'medium', imageKey: 'westham.png', enabled: true, league: 'Premier League', country: 'England', division: 1 },
  { name: 'Wolves', difficulty: 'medium', imageKey: 'wolves.png', enabled: true, league: 'Premier League', country: 'England', division: 1 },
  //Serie A
  { name: 'Atalanta', difficulty: 'medium', imageKey: 'atalanta.png', enabled: true, league: 'Serie A', country: 'Italy', division: 1 },
  { name: 'Bologna', difficulty: 'medium', imageKey: 'bologna.png', enabled: true, league: 'Serie A', country: 'Italy', division: 1 },
  { name: 'Cagliari', difficulty: 'hard', imageKey: 'cagliari.png', enabled: true, league: 'Serie A', country: 'Italy', division: 1 },
  { name: 'Como', difficulty: 'hard', imageKey: 'como.png', enabled: true, league: 'Serie A', country: 'Italy', division: 1 },
  { name: 'Empoli', difficulty: 'hard', imageKey: 'empoli.png', enabled: true, league: 'Serie A', country: 'Italy', division: 1 },
  { name: 'Fiorentina', difficulty: 'medium', imageKey: 'fiorentina.png', enabled: true, league: 'Serie A', country: 'Italy', division: 1 },
  { name: 'Genoa', difficulty: 'medium', imageKey: 'genoa.png', enabled: true, league: 'Serie A', country: 'Italy', division: 1 },
  { name: 'Hellas Verona', difficulty: 'hard', imageKey: 'hellasverona.png', enabled: true, league: 'Serie A', country: 'Italy', division: 1 },
  { name: 'Inter', difficulty: 'easy', imageKey: 'inter.png', enabled: true, league: 'Serie A', country: 'Italy', division: 1 },
  { name: 'Juventus', difficulty: 'easy', imageKey: 'juventus.png', enabled: true, league: 'Serie A', country: 'Italy', division: 1 },
  { name: 'Lazio', difficulty: 'easy', imageKey: 'lazio.png', enabled: true, league: 'Serie A', country: 'Italy', division: 1 },
  { name: 'Lecce', difficulty: 'medium', imageKey: 'lecce.png', enabled: true, league: 'Serie A', country: 'Italy', division: 1 },
  { name: 'Milan', difficulty: 'easy', imageKey: 'milan.png', enabled: true, league: 'Serie A', country: 'Italy', division: 1 },
  { name: 'Monza', difficulty: 'hard', imageKey: 'monza.png', enabled: true, league: 'Serie A', country: 'Italy', division: 1 },
  { name: 'Napoli', difficulty: 'easy', imageKey: 'napoli.png', enabled: true, league: 'Serie A', country: 'Italy', division: 1 },
  { name: 'Parma', difficulty: 'medium', imageKey: 'parma.png', enabled: true, league: 'Serie A', country: 'Italy', division: 1 },
  { name: 'Roma', difficulty: 'easy', imageKey: 'roma.png', enabled: true, league: 'Serie A', country: 'Italy', division: 1 },
  { name: 'Torino', difficulty: 'medium', imageKey: 'torino.png', enabled: true, league: 'Serie A', country: 'Italy', division: 1 },
  { name: 'Udinese', difficulty: 'medium', imageKey: 'udinese.png', enabled: true, league: 'Serie A', country: 'Italy', division: 1 },
  { name: 'Venezia', difficulty: 'hard', imageKey: 'venezia.png', enabled: true, league: 'Serie A', country: 'Italy', division: 1 },
  //Bundesliga
  { name: 'Augsburg', difficulty: 'hard', imageKey: 'augsburg.png', enabled: true, league: 'Bundesliga', country: 'Germany', division: 1 },
  { name: 'Leverkusen', difficulty: 'easy', imageKey: 'bayerleverkusen.png', enabled: true, league: 'Bundesliga', country: 'Germany', division: 1 },
  { name: 'Dortmund', difficulty: 'easy', imageKey: 'borussiadortmund.png', enabled: true, league: 'Bundesliga', country: 'Germany', division: 1 },
  { name: 'Monchengladbach', difficulty: 'medium', imageKey: 'borussiamonchengladbach.png', enabled: true, league: 'Bundesliga', country: 'Germany', division: 1 },
  { name: 'Eintracht Frankfurt', difficulty: 'medium', imageKey: 'eintrachtfrankfurt.png', enabled: true, league: 'Bundesliga', country: 'Germany', division: 1 },
  { name: 'Bayern', difficulty: 'easy', imageKey: 'fcbayernmunich.png', enabled: true, league: 'Bundesliga', country: 'Germany', division: 1 },
  { name: 'Heidenheim', difficulty: 'hard', imageKey: 'fcheidenheim.png', enabled: true, league: 'Bundesliga', country: 'Germany', division: 1 },
  { name: 'Mainz', difficulty: 'medium', imageKey: 'fsvmainz.png', enabled: true, league: 'Bundesliga', country: 'Germany', division: 1 },
  { name: 'Holstein Kiel', difficulty: 'hard', imageKey: 'holsteinkiel.png', enabled: true, league: 'Bundesliga', country: 'Germany', division: 1 },
  { name: 'Leipzig', difficulty: 'medium', imageKey: 'rbleipzig.png', enabled: true, league: 'Bundesliga', country: 'Germany', division: 1 },
  { name: 'Sankt Pauli', difficulty: 'medium', imageKey: 'sanktpauli.png', enabled: true, league: 'Bundesliga', country: 'Germany', division: 1 },
  { name: 'Freiburg', difficulty: 'hard', imageKey: 'scfreiburg.png', enabled: true, league: 'Bundesliga', country: 'Germany', division: 1 },
  { name: 'Hoffenheim', difficulty: 'hard', imageKey: 'tsghoffenheim.png', enabled: true, league: 'Bundesliga', country: 'Germany', division: 1 },
  { name: 'Union Berlin', difficulty: 'hard', imageKey: 'unionberlin.png', enabled: true, league: 'Bundesliga', country: 'Germany', division: 1 },
  { name: 'Stuttgart', difficulty: 'medium', imageKey: 'vfbstuttgart.png', enabled: true, league: 'Bundesliga', country: 'Germany', division: 1 },
  { name: 'Bochum', difficulty: 'medium', imageKey: 'vflbochum.png', enabled: true, league: 'Bundesliga', country: 'Germany', division: 1 },
  { name: 'Werder', difficulty: 'medium', imageKey: 'werderbremen.png', enabled: true, league: 'Bundesliga', country: 'Germany', division: 1 },
  { name: 'Wolfsburg', difficulty: 'medium', imageKey: 'wolfsburg.png', enabled: true, league: 'Bundesliga', country: 'Germany', division: 1 },
  //Greek Superleague
  { name: 'Aek', difficulty: 'medium', imageKey: 'aek.png', enabled: true, league: 'Superleague', country: 'Greece', division: 1 },
  { name: 'Aris', difficulty: 'medium', imageKey: 'aris.png', enabled: true, league: 'Superleague', country: 'Greece', division: 1 },
  { name: 'Asteras', difficulty: 'hard', imageKey: 'asterastripolis.png', enabled: true, league: 'Superleague', country: 'Greece', division: 1 },
  { name: 'Atromitos', difficulty: 'hard', imageKey: 'atromitos.png', enabled: true, league: 'Superleague', country: 'Greece', division: 1 },
  { name: 'Kallithea', difficulty: 'hard', imageKey: 'kallithea.png', enabled: true, league: 'Superleague', country: 'Greece', division: 1 },
  { name: 'Lamia', difficulty: 'hard', imageKey: 'lamia.png', enabled: true, league: 'Superleague', country: 'Greece', division: 1 },
  { name: 'Levadiakos', difficulty: 'hard', imageKey: 'levadiakos.png', enabled: true, league: 'Superleague', country: 'Greece', division: 1 },
  { name: 'Ofi', difficulty: 'hard', imageKey: 'ofi.png', enabled: true, league: 'Superleague', country: 'Greece', division: 1 },
  { name: 'Olympiakos', difficulty: 'easy', imageKey: 'olympiakos.png', enabled: true, league: 'Superleague', country: 'Greece', division: 1 },
  { name: 'Panathinaikos', difficulty: 'easy', imageKey: 'panathinaikos.png', enabled: true, league: 'Superleague', country: 'Greece', division: 1 },
  { name: 'Panetolikos', difficulty: 'hard', imageKey: 'panetolikos.png', enabled: true, league: 'Superleague', country: 'Greece', division: 1 },
  { name: 'Panserraikos', difficulty: 'hard', imageKey: 'panserraikos.png', enabled: true, league: 'Superleague', country: 'Greece', division: 1 },
  { name: 'Paok', difficulty: 'easy', imageKey: 'paok.png', enabled: true, league: 'Superleague', country: 'Greece', division: 1 },
  { name: 'Volos', difficulty: 'hard', imageKey: 'volos.png', enabled: true, league: 'Superleague', country: 'Greece', division: 1 },
  //Eredivisie
  { name: 'Ajax', difficulty: 'easy', imageKey: 'ajax.png', enabled: true, league: 'Eredivise', country: 'Netherlands', division: 1 },
  { name: 'Alkmaar', difficulty: 'medium', imageKey: 'alkmaar.png', enabled: true, league: 'Eredivise', country: 'Netherlands', division: 1 },
  { name: 'Almere', difficulty: 'hard', imageKey: 'almere.png', enabled: true, league: 'Eredivise', country: 'Netherlands', division: 1, alternatives: ['Almere City'] },
  { name: 'Breda', difficulty: 'hard', imageKey: 'breda.png', enabled: true, league: 'Eredivise', country: 'Netherlands', division: 1 },
  { name: 'Groningen', difficulty: 'hard', imageKey: 'fcgroningen.png', enabled: true, league: 'Eredivise', country: 'Netherlands', division: 1 },
  { name: 'Feyenoord', difficulty: 'easy', imageKey: 'feyenoord.png', enabled: true, league: 'Eredivise', country: 'Netherlands', division: 1, alternatives: ['feyenord'] },
  { name: 'Sittard', difficulty: 'hard', imageKey: 'fortunasittard.png', enabled: true, league: 'Eredivise', country: 'Netherlands', division: 1, alternatives: ['Fortuna Sittard'] },
  { name: 'Go Ahead Eagles', difficulty: 'hard', imageKey: 'goaheadeagles.png', enabled: true, league: 'Eredivise', country: 'Netherlands', division: 1 },
  { name: 'Heerenveen', difficulty: 'medium', imageKey: 'heerenveen.png', enabled: true, league: 'Eredivise', country: 'Netherlands', division: 1 },
  { name: 'Heracles', difficulty: 'hard', imageKey: 'heracles.png', enabled: true, league: 'Eredivise', country: 'Netherlands', division: 1 },
  { name: 'Nijmegen', difficulty: 'medium', imageKey: 'nijmegen.png', enabled: true, league: 'Eredivise', country: 'Netherlands', division: 1 },
  { name: 'Psv', difficulty: 'easy', imageKey: 'psv.png', enabled: true, league: 'Eredivise', country: 'Netherlands', division: 1 },
  { name: 'Sparta Rotterdam', difficulty: 'hard', imageKey: 'spartarotterdam.png', enabled: true, league: 'Eredivise', country: 'Netherlands', division: 1, alternatives: ['Sparta', 'Rotterdam'] },
  { name: 'Twente', difficulty: 'medium', imageKey: 'twente.png', enabled: true, league: 'Eredivise', country: 'Netherlands', division: 1 },
  { name: 'Utrecht', difficulty: 'medium', imageKey: 'utrecht.png', enabled: true, league: 'Eredivise', country: 'Netherlands', division: 1 },
  { name: 'Waalwijk', difficulty: 'hard', imageKey: 'waalwijk.png', enabled: true, league: 'Eredivise', country: 'Netherlands', division: 1 },
  { name: 'Willem', difficulty: 'medium', imageKey: 'willem.png', enabled: true, league: 'Eredivise', country: 'Netherlands', division: 1 },
  { name: 'Zwolle', difficulty: 'hard', imageKey: 'zwolle.png', enabled: true, league: 'Eredivise', country: 'Netherlands', division: 1 },
  //Ligue 1
  { name: 'Angers', difficulty: 'hard', imageKey: 'angers.png', enabled: true, league: 'Ligue 1', country: 'France', division: 1 },
  { name: 'Auxerre', difficulty: 'medium', imageKey: 'auxerre.png', enabled: true, league: 'Ligue 1', country: 'France', division: 1 },
  { name: 'Brest', difficulty: 'medium', imageKey: 'brest.png', enabled: true, league: 'Ligue 1', country: 'France', division: 1 },
  { name: 'Havre', difficulty: 'hard', imageKey: 'havre.png', enabled: true, league: 'Ligue 1', country: 'France', division: 1, alternatives: ['Le Havre', 'HAC'] },
  { name: 'Lille', difficulty: 'medium', imageKey: 'lille.png', enabled: true, league: 'Ligue 1', country: 'France', division: 1, alternatives: ['LOSC'] },
  { name: 'Lyon', difficulty: 'easy', imageKey: 'lyon.png', enabled: true, league: 'Ligue 1', country: 'France', division: 1, alternatives: ['Lyonnais', 'Olympique Lyonnais'] },
  { name: 'Marseille', difficulty: 'easy', imageKey: 'marseille.png', enabled: true, league: 'Ligue 1', country: 'France', division: 1, alternatives: ['Olympique Marseille'] },
  { name: 'Monaco', difficulty: 'easy', imageKey: 'monaco.png', enabled: true, league: 'Ligue 1', country: 'France', division: 1, },
  { name: 'Montpellier', difficulty: 'hard', imageKey: 'montpellier.png', enabled: true, league: 'Ligue 1', country: 'France', division: 1, },
  { name: 'Nantes', difficulty: 'medium', imageKey: 'nantes.png', enabled: true, league: 'Ligue 1', country: 'France', division: 1, },
  { name: 'Nice', difficulty: 'medium', imageKey: 'ogcnice.png', enabled: true, league: 'Ligue 1', country: 'France', division: 1, },
  { name: 'Psg', difficulty: 'easy', imageKey: 'psg.png', enabled: true, league: 'Ligue 1', country: 'France', division: 1, alternatives:['Paris', 'Paris Saint Germain'] },
  { name: 'Lens', difficulty: 'hard', imageKey: 'rclens.png', enabled: true, league: 'Ligue 1', country: 'France', division: 1, },
  { name: 'Rennes', difficulty: 'medium', imageKey: 'rennes.png', enabled: true, league: 'Ligue 1', country: 'France', division: 1, alternatives: ['Rennais'] },
  { name: 'Saint Ettiene', difficulty: 'hard', imageKey: 'saintettiene.png', enabled: true, league: 'Ligue 1', country: 'France', division: 1, alternatives: ['ASSE'] },
  { name: 'Stade Reims', difficulty: 'hard', imageKey: 'stadereims.png', enabled: true, league: 'Ligue 1', country: 'France', division: 1, },
  { name: 'Strasbourg', difficulty: 'hard', imageKey: 'strasbourg.png', enabled: true, league: 'Ligue 1', country: 'France', division: 1, },
  { name: 'Toulouse', difficulty: 'medium', imageKey: 'toulouse.png', enabled: true, league: 'Ligue 1', country: 'France', division: 1, },
];

const deleteAllItems = async () => {
  try {
    const scanParams = {
      TableName: tableName,
    };
    const scanCommand = new ScanCommand(scanParams);
    const result = await client.send(scanCommand);

    for (const item of result.Items || []) {
      const deleteParams = {
        TableName: tableName,
        Key: {
          id: item.id,
        },
      };
      await client.send(new DeleteItemCommand(deleteParams));
      console.log(`Deleted item with id ${item.id.S}`);
    }

    console.log('All existing items deleted.');
  } catch (error) {
    console.error('Error deleting items:', error);
  }
};

const putLogoData = async (logo: LogoMetadata) => {
  const params = {
    TableName: tableName,
    Item: {
      id: { S: uuidv4() },
      name: { S: logo.name },
      difficulty: { S: logo.difficulty },
      imageKey: { S: logo.imageKey },
      enabled: { BOOL: logo.enabled },
      league: { S: logo.league },
      country: { S: logo.country },
      division: { N: logo.division.toString() },
      //TODO add a field with alternative team names
    }
  };

  try {
    await client.send(new PutItemCommand(params));
    console.log(`Successfully added ${logo.name}`)
  } catch (error) {
    console.error(`Error adding logo ${logo.name}:`, error);
  }
}

const run = async () => {
  //Comment out next line if you just want to add new teams without deleting the existing ones
  await deleteAllItems();

  for (const logo of logosMetadata) {
    await putLogoData(logo);
  }
};

run();