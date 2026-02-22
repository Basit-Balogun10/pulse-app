import { httpRouter } from 'convex/server';
import { auth } from './auth';

const http = httpRouter();

// Mount Convex Auth HTTP routes (token exchange, session management)
auth.addHttpRoutes(http);

export default http;
