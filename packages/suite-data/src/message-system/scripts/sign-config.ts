import * as fs from 'fs';
import * as jws from 'jws';
import { join } from 'path';

import {
    CONFIG_PATH,
    PROJECT_ROOT,
    // PACKAGE_ROOT,
    // SUITE_CONFIG_FILENAME
} from '../constants';

if (!process.argv[2] || (process.argv[2] !== '--local' && process.argv[2] !== '--ci')) {
    throw Error(`Missing or incorrectly set argument. Allowed values are: "--local" and "--ci".`);
}

if (!process.argv[3]) {
    throw Error(`Missing PRIVATE_KEY argument!`);
}

const isRunLocally = process.argv[2] === '--local';
const privateKey = Buffer.from(process.argv[3], 'base64');

// TODO: for data.trezor.io upload
if (!isRunLocally && !process.argv[3]) {
    throw Error(`Missing required arguments`);
}
const environment = process.argv[3];

/*
// save valid config to the Suite project to be available, in case fetching of remote config cannot be done
const saveValidConfigToSuite = () => {
    const filesPath = join(PACKAGE_ROOT, 'files', 'message-system');
    const suiteConfigPath = join(filesPath, SUITE_CONFIG_FILENAME);

    fs.mkdir(filesPath, { recursive: true }, () => {
        fs.copyFileSync(CONFIG_PATH, suiteConfigPath);
    });
};
*/

// create a jws signature from the config
const getConfigJwsSignature = () => {
    console.log('Creating a JWS signature from the config...');

    const config = fs.readFileSync(CONFIG_PATH, 'utf-8');

    const jwsConfig = jws.sign({
        header: { alg: 'ES256' },
        payload: config,
        secret: privateKey,
    });

    console.log('JWS signature created!');

    return jwsConfig;
};

// --ci, save the jws signature to https://data.trezor.io/...
const uploadConfigJwsSignature = (jwsConfig, environment) => {
    /*
    
    console.log('Uploading JWS signature to https://data.trezor.io/config/...');

    TODO: Commit + push / upload to data.trezor.io/config/$environment/config.json

    console.log('JWS signature uploaded'); 
    */
};

// --local, save the jws signature to ../config/jws file
const saveConfigJwsSignature = jwsConfig => {
    fs.writeFileSync(join(PROJECT_ROOT, 'config', 'jws'), jwsConfig);
    console.log(`JWS signature saved to ${join(PROJECT_ROOT, 'config', 'jws')}!`);
};

// saveValidConfigToSuite();
const jwsConfig = getConfigJwsSignature();

if (!isRunLocally) {
    uploadConfigJwsSignature(jwsConfig, environment);
} else {
    saveConfigJwsSignature(jwsConfig);
}
