import local from './local';
import production from './production';

export default (process.env.NODE_ENV === 'production' ? production : local);
