export const defaultProps = {
  children: 'children',
  label: 'name',
  value: 'id',
  isLeaf: 'leaf'
};

export function handleTree(data: any[]): any[] {
  if (!Array.isArray(data)) {
    console.warn('data must be an array');
    return [];
  }
  const config = {
    id: 'id',
    parentId: 'parentId',
    childrenList: 'children'
  };

  const childrenListMap: { [key: string]: any[] } = {};
  const nodeIds: { [key: string]: any } = {};
  const tree: any[] = [];

  for (const d of data) {
    const parentId = d[config.parentId];
    if (!childrenListMap[parentId]) {
      childrenListMap[parentId] = [];
    }
    nodeIds[d[config.id]] = d;
    childrenListMap[parentId].push(d);
  }

  for (const d of data) {
    const parentId = d[config.parentId];
    if (!nodeIds[parentId]) {
      tree.push(d);
    }
  }

  for (const t of tree) {
    adaptToChildrenList(t);
  }

  function adaptToChildrenList(o: any) {
    if (childrenListMap[o[config.id]] !== undefined) {
      o[config.childrenList] = childrenListMap[o[config.id]];
    }
    if (o[config.childrenList]) {
      for (const c of o[config.childrenList]) {
        adaptToChildrenList(c);
      }
    }
  }
  return tree;
}
