import {DynamoDBClient, PutItemCommand} from '@aws-sdk/client-dynamodb';

type Logo = {
  id: number;
  name: string;
  difficulty: 'easy' | 'medium' | 'hard';
  imageKey : string;
  enabled : boolean;
  league: string;
  country: string;
  division: number;
}

const client  = new DynamoDBClient({ region: 'eu-central-1' });

//Edit the list of logos that you would like to add
//TODO remove id
const logos: Logo[] = [
  { id: 1, name: 'Real Madrid', difficulty: 'easy', imageKey: 'realmadrid.png', enabled: true, league: 'La Liga', country: 'Spain', division: 1 },
  { id: 2, name: 'Barcelona', difficulty: 'easy', imageKey: 'barcelona.png', enabled: true, league: 'La Liga', country: 'Spain', division: 1 },
];

const putLogoData = async (logo: Logo) => {
  const params = {
    TableName: 'Logos',
    Item: {
      id: { N: logo.id.toString() },
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
  for (const logo of logos) {
    await putLogoData(logo);
  }
};

run();