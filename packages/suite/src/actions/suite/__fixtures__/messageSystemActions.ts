export const messageId1 = '22e6444d-a586-4593-bc8d-5d013f193eba';
export const messageId2 = '469c65a8-8632-11eb-8dcd-0242ac130003';
export const messageId3 = '506b1322-8632-11eb-8dcd-0242ac130003';

/*
JWS below is signed config with only mandatory fields:
{
    "version": 1,
    "timestamp": "2021-03-03T03:48:16+00:00",
    "sequence": 1,
    "actions": []
}

It is signed by random secp256k1 private key. It's corresponding public key is for mocking reasons 
available in messageSystemActions.test.ts file as jest.mock does not allow to reference any out-of-scope variables.
*/

export const validJws =
    'eyJhbGciOiJFUzI1NiJ9.ewogICAidmVyc2lvbiI6IDEsCiAgICJ0aW1lc3RhbXAiOiAiMjAyMS0wMy0wM1QwMzo0ODoxNiswMDowMCIsCiAgICJzZXF1ZW5jZSI6IDEsCiAgICJhY3Rpb25zIjogW10KfQo.1Ml33ky3ZmdWa2FEsF-CFAzP_oZzi5EWToEB-Xp0dA2_ZHYQX5PIlQXsp2-ugp07kSvNKvSKnGWytOPi5Yb-Ng';

// jws with modified signature
export const unauthenticJws =
    'eyJhbGciOiJFUzI1NiJ9.ewogICAidmVyc2lvbiI6IDEsCiAgICJ0aW1lc3RhbXAiOiAiMjAyMS0wMy0wM1QwMzo0ODoxNiswMDowMCIsCiAgICJzZXF1ZW5jZSI6IDEsCiAgICJhY3Rpb25zIjogW10KfQo.kol1cky3ZmdWa2FEsF-CFAzP_oZzi5EWToEB-Xp0dA2_ZHYQX5PIlQXsp2-ugp07kSvNKvSKnGWytOPi5Yb-Ng';

// jws with modified header and payload
export const corruptedJws =
    'JhbGciOiJFUzI1NiJ9.ewogICAidm.1Ml33ky3ZmdWa2FEsF-CFAzP_oZzi5EWToEB-Xp0dA2_ZHYQX5PIlQXsp2-ugp07kSvNKvSKnGWytOPi5Yb-Ng';
