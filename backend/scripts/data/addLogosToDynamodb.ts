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