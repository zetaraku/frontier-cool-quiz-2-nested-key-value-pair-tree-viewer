import { pathSymbol, valueSymbol } from '@/symbol';

export type KVPair = { key: string, value: string };

export type TreeObject = {
  [key: symbol]: string;
  [key: string]: TreeObject;
}

export type ForceFoldingType = "fold" | "unfold" | null;

export function kvPairsToTreeObject(kvPairs: KVPair[]): TreeObject {
  const result: TreeObject = Object.create(null);

  // insert each kv-pair
  for (const kvPair of kvPairs) {
    // skip kv-pair with empty key
    if (kvPair.key === '') continue;

    let currentNode = result;
    let currentPath = '';

    // make nested objects along the key path
    for (const subKey of kvPair.key.split('.')) {
      currentPath += `.${subKey}`;

      // make new TreeObject if necessary
      if (currentNode[subKey] === undefined) {
        const newNode: TreeObject = Object.create(null);

        // set the node path
        newNode[pathSymbol] = currentPath.slice(1);

        currentNode[subKey] = newNode;
      }

      currentNode = currentNode[subKey];
    }

    // set the node value
    currentNode[valueSymbol] = kvPair.value;
  }

  return result;
}

export function jsonToKvPairs(jsonText: string): KVPair[] {
  const loadedObject = JSON.parse(jsonText);

  const stack = [
    { path: '', obj: loadedObject },
  ];

  const result = [];

  while (stack.length > 0) {
    const { path, obj } = stack.pop()!;

    for (const [key, value] of Object.entries(obj)) {
      if (typeof value === 'object' && value !== null) {
        stack.push({ path: `${path}.${key}`, obj: value });
      } else {
        result.push({
          key: `${path}.${key}`.slice(1),
          value: String(value),
        });
      }
    }
  }

  return result;
}
