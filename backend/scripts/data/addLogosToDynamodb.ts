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
}

const client  = new DynamoDBClient({ region: 'eu-central-1' });

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
];

const deleteAllItems = async () => {
  try {
    const scanParams = {
      TableName: 'Logos',
    };
    const scanCommand = new ScanCommand(scanParams);
    const result = await client.send(scanCommand);

    for (const item of result.Items || []) {
      const deleteParams = {
        TableName: 'Logos',
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
    TableName: 'Logos',
    Item: {
      id: { S: uuidv4() },
      name: { S: logo.name },
      difficulty: { S: logo.difficulty },
      imageKey: { S: logo.imageKey },
      enabled: { BOOL: logo.enabled },
      league: { S: logo.league },
      country: { S: logo.country },
      division: { N: logo.division.toString() },
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
  await deleteAllItems();

  for (const logo of logosMetadata) {
    await putLogoData(logo);
  }
};

run();