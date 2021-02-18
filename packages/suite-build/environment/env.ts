const { NODE_ENV } = process.env;

const ALLOWED = ['development', 'production'] as const;
const DEFAULT = ALLOWED[0]; // development

const env = NODE_ENV as typeof ALLOWED[number];

export default NODE_ENV !== undefined && ALLOWED.includes(env) ? env : DEFAULT;
