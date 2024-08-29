export const transformDynamoDBItem = (item: Record<string, any>) => {
  return Object.fromEntries(
    Object.entries(item).map(([key, value]) => [key, value[Object.keys(value)[0]]])
  );
};