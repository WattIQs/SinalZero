import { Route as rootRoute } from './routes/__root';
import { Route as indexRoute } from './routes/index';

const index = indexRoute.update({ id: '/', path: '/', getParentRoute: () => rootRoute });

export const routeTree = rootRoute._addFileChildren({ index });
