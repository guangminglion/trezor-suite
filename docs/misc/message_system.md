# Message System

Message system was implemented to allow sending emergency messages to Trezor Suite app to a user with specific stack.

[Example messages](https://www.notion.so/1d622e7079c14f64a03fa17f50bce14f?v=b8649de184c3437abb983990c5513e5f)

[Issue on Github](https://github.com/trezor/trezor-suite/issues/2752)

## Types of in-app messages

There are four ways of how a message can be shown to a user.

- banner
   - looks like a cookie bar above the page
- modal
   - *TODO: missing implementation*
- context 
   - messages on specific places in app - high level (e.g. settings page)
   - *TODO: missing implementation*
- super-context 
   - messages on specific places in the app - low level (e.g. category in settings page)
   - *TODO: missing implementation*

## Implementation

### Config

The system of messages is based on a configuration file in which messages with specific conditions ​are declared. If specific conditions are satisfied, the message is shown to a user.

Current configuration file is located in `packages/suite-data/src/message-system/config`. Its name is `config.vX.json` where `X` express current version messaging system.

The config is fetched at the launch of the application and then every six hours. It remembers the previously fetched config to inform the user even if he is offline. For this reason, the latest available config is bundled with the application in the release.
### Schema

The configuration structure is specified in JSON file using JSON schema. The file can be found in `packages/suite-data/src/message-system/schema` folder. Its name is `config.schema.vX.json`.

We use JSON schema for 2 reasons:
- generating TypeScript types
- validating configuration file

### Types

Types are generated from JSON-schema during the build process or can be generated manually by `yarn workspace @trezor/suite-data msg-system-types`.
A `messageSystem.ts` file is created in `packages/suite/src/types/suite`. 

- This file should never be changed manually.
- This file is committed into the repository. 

### Signing

To ensure the authenticity of a configuration file, JSON Web Signatures are used. The configuration file is signed by a private key using ES256 and before it is used on client-side, it is verified by its corresponding public key.

### CI job

#### Validation

- Validation of configuration file is performed in CI job in `prebuild` phase. It is used to detect possible semantic errors. 
- It can be run locally by `yarn workspace @trezor/suite-data msg-system-validate-config` script in suite-data.

#### Signing

- Signing of the configuration file is performed in CI job in `build` phase. *TODO: move to prebuild*
- The result is uploaded to `https://data.trezor.io/config/$environment/config.vX.json`
- It can be run manually by `yarn workspace @trezor/suite-data msg-system-sign-config --local $PRIVATE KEY` script in suite-data.`$PRIVATE_KEY` should be in base64 format. The resulting JWS is stored in `packages/suite-data/src/message-system/config` in `jws` file.

### Versioning

If changes made to the message system are incompatible with the previous version, the version number should be bumped in `messageSystemConstants.ts` in `suite` package as well as in suite-data package in `message-system/constants`. Config and schema files should be named accordingly to it.

### Config Structure

Structure of config, types and optionality of specific keys can be found in the schema or in generated types. Example config is commented below.

```javascript
{
    // Version of message system implementation. Bump if new version is not backward compatible.
    "version": 1, 
    // Datetime in ISO8601 when was config created.
    "timestamp": "2021-03-03T03:48:16+00:00",
    // Version of config. New config is accepted only if sequence number is higher.
    "sequence": 1, 
    "actions": [
        {
            /*
            - User's stack has to match one of the condition the object to show this message.
            - The bitwise operation is AND.
            */
            "conditions": [ 
                /* 
                - The bitwise operation is AND.
                - All keys are optional (duration, os, environment, browser, settings, transport, 
                  devices, architecture (To be implemented))
                - If a value is specified then all its subkeys have to be specified 
                */
                {
                    /* 
                    - Datetime in ISO8601 from / to which date this message is valid.
                    - If duration category is used, then both times have to be set.
                    */
                    "duration": {
                        "from": "2021-03-01T12:10:00.000Z",
                        "to": "2022-01-31T12:10:00.000Z"
                    },
                    /* 
                    For os, environment, browser and transport.
                    - Values can be array, string or null.
                    - Semver npm library is used for working with versions https://www.npmjs.com/package/semver.
                    - "*" = all versions; "!" = not for this type of browser/os/...
                    - Options: gte, lt, ranges, tildes, carets,... are supported, see semver lib for more info.
                    */
                    "os": {
                        "macos": [
                            "10.14",
                            "10.18",
                            "11"
                        ],
                        "linux": "<20.04",
                        "windows": "!",
                        "android": "*",
                        "ios": "13"
                    },
                    "environment": {
                        "desktop": "<21.5",
                        "mobile": "!",
                        "web": "<22"
                    },
                    "browser": {
                        "firefox": [
                            "82",
                            "83"
                        ],
                        "chrome": "*",
                        "chromium": "!"
                    },
                    "transport": {
                        "bridge": [
                            "2.0.30",
                            "2.0.27"
                        ],
                        "webusbplugin": "*"
                    },
                    /*
                    - If key is not available (undefined), then it can be whatever.
                    - Currently supported keys are "tor" and coin symbols from "enabledNetworks".
                    - The bitwise operation is OR.
                    */
                    "settings": [
                        { 
                            "tor": true,
                            "btc": true
                        },
                        {
                            "tor": false,
                            "ltc": true
                        }
                    ],
                    // Empty device array is targeting users without a connected device.
                    "devices": [ 
                        {
                            // Possible values: "1" or "T"
                            "model": "1", 
                            "firmware": "1.9.4",
                            "vendor": "trezor.io"
                        }
                    ]
                }
            ],
            "message": {
                // Used for remembering dismissed messages.
                "id": "0f3ec64d-c3e4-4787-8106-162f3ac14c34",
                /*
                - Existing banners have defined priorities. 
                - The range is 1 to 10.
                */
                "priority": 10,
                // When user closes the message, it will never show again.
                "dismissible": true,
                /* 
                Variants:
                - info (blue)
                - warning (orange)
                - critical (red)
                */
                "variant": "warning",
                // Options: banner, modal, context, super-context
                "category": "banner",
                /*
                - Message shown to a user. 
                - Current implementation uses only "en-GB".
                */
                "content": {
                    "en-GB": "New Trezor firmware is available!",
                    "de-DE": "Neue Trezor Firmware ist verfügbar!"
                },
                // Call to action. Used only for banner and context.
                "cta": {
                    /*
                    Options: "internal-link" or "external-link"
                    - internal-link is route name, see routes.ts file
                    - external-link is url address
                    */
                    "action": "internal-link",
                    // Route name or url address according to action.
                    "href": "firmware-index",
                    /*
                    - Label of call to action button shown to a user. 
                    - Current implementation uses only "en-GB".
                    */
                    "label": {
                        "en-GB": "Update now",
                        "de-DE": "Jetzt aktualisieren"
                    }
                },
                // Used only for modals. (To be implemented)
                "modal": {
                    "title": {
                        "en-GB": "Update now",
                        "de-DE": "Jetzt aktualisieren"
                    },
                    "image": "https://example.com/example.png"
                },
                // Used only for context and super-context. (To be implemented)
                "context": {
					"domain": [
                    "coins.*.receive",
                    "coins.btc"
                  ]
		}
            }
        }
    ]
}
```