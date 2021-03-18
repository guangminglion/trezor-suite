// TODO: sushi does not want to have both the production and the develop keys in the code in one build

// const JWS_DEVELOP_PUBLIC_KEY = '';

const JWS_DEVELOP_PUBLIC_KEY = `-----BEGIN PUBLIC KEY-----
MFYwEAYHKoZIzj0CAQYFK4EEAAoDQgAE77bZRAszhhlCqJDokcvjlXOPPPRnAOh+
ZkxZDuo75OAmRZFUJtb3jZQrLRhMa/YwOjUHgSa350GIi5L5oJ59+A==
-----END PUBLIC KEY-----`;

// TODO: PRD + DEV public key
export const JWS_PUBLIC_KEY =
    process.env.NODE_ENV === 'production' ? JWS_DEVELOP_PUBLIC_KEY : JWS_DEVELOP_PUBLIC_KEY;
