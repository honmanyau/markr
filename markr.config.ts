import path from 'path';

export const SERVER_PORT = 4567;
export const TEST_SERVER_PORT = 7654;
export const UPLOAD_LIMIT = '256mb';
export const PRODUCTION_DB = path.join(process.cwd(), '/database/markr.sqlite');
