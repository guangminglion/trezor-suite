import React, { useEffect } from 'react';
import { Button } from '@trezor/components';
import { OnboardingButton } from '@onboarding-components';
import { Translation } from '@suite-components';
import { getFwUpdateVersion, getFwVersion } from '@suite-utils/device';
import { useDevice, useFirmware, useActions } from '@suite-hooks';
import {
    ReconnectInNormalStep,
    ReconnectDevicePrompt,
    InstallButton,
    FirmwareOffer,
    OnboardingStepBox,
} from '@firmware-components';
import * as onboardingActions from '@onboarding-actions/onboardingActions';
import { AcquiredDevice } from '@suite/types/suite';

interface Props {
    cachedDevice: AcquiredDevice;
    setCachedDevice: React.Dispatch<React.SetStateAction<AcquiredDevice>>;
}

const FirmwareInitial = ({ cachedDevice, setCachedDevice }: Props) => {
    const { device: liveDevice } = useDevice();
    const { setStatus, firmwareUpdate, status } = useFirmware();
    const { goToNextStep } = useActions({
        goToNextStep: onboardingActions.goToNextStep,
    });
    useEffect(() => {
        // When user choses to install a new firmware update we will ask him/her to reconnect a device in bootloader mode.
        // This prompt (to reconnect a device in bootloader mode) is shown in modal which is visually layer above the content.
        // In order to preserve the background content (screen with fw update offer) in case
        // when user disconnects the device and reconnect it in bl mode we are caching the device.
        // (Device in BL mode doesn't provide us all the details and we don't want any flickering o reacting in general while user is just following our instructions)
        if (liveDevice?.connected && liveDevice?.mode !== 'bootloader' && liveDevice.features) {
            // if (liveDevice.id !== cachedDevice.id)  {
            //     // store device once and don't refresh it on potentional changes
            // }
            setCachedDevice(liveDevice);
        }
    }, [cachedDevice.id, liveDevice, setCachedDevice]);

    // User is following instructions for disconnecting/reconnecting a device in bootloader mode; We'll use cached version of the device
    const device = status === 'waiting-for-bootloader' ? cachedDevice : liveDevice;
    const expectedModel = device?.features?.major_version || 2;

    let content;

    if (!device?.connected || !device?.features) {
        // TODO: Connect device prompt
        content = {
            heading: <Translation id="TR_CONNECT_YOUR_DEVICE" />,
        };
    } else if (device.firmware === 'none') {
        // No firmware installed
        // Device without firmware is already in bootloader mode even if it doesn't report it
        content = {
            heading: <Translation id="TR_INSTALL_FIRMWARE" />,
            description: <Translation id="TR_FIRMWARE_SUBHEADING" />,
            body: (
                <FirmwareOffer
                    newVersion={getFwUpdateVersion(cachedDevice)}
                    releaseChangelog={cachedDevice.firmwareRelease}
                />
            ),
            innerActions: <InstallButton onClick={firmwareUpdate} />,
        };
    } else if (device.mode === 'bootloader') {
        // needs to be placed after checking that firmware !== none, because such a device reports as it is in bootloader mode
        content = { body: <ReconnectInNormalStep.Body /> };
    } else if (device.firmware === 'required' || device.firmware === 'outdated') {
        // Fw update needed/available
        content = {
            heading: <Translation id="TR_INSTALL_FIRMWARE" />,
            description: (
                <Translation
                    id={
                        device.firmware === 'required'
                            ? 'TR_FIRMWARE_UPDATE_REQUIRED_EXPLAINED'
                            : 'TR_YOU_MAY_EITHER_UPDATE'
                    }
                />
            ),
            body: (
                <FirmwareOffer
                    currentVersion={getFwVersion(device)}
                    newVersion={getFwUpdateVersion(device)}
                    releaseChangelog={device?.firmwareRelease}
                />
            ),
            innerActions: (
                <Button
                    onClick={() => setStatus('waiting-for-bootloader')}
                    data-test="@firmware/get-ready-button"
                >
                    <Translation id="TR_INSTALL" />
                </Button>
            ),
            outerActions:
                device.firmware === 'outdated' ? (
                    // Fw update is not mandatory, show skip button
                    <OnboardingButton.Skip
                        onClick={() => goToNextStep()}
                        data-test="@firmware/skip-button"
                    >
                        <Translation id="TR_SKIP_UPDATE" />
                    </OnboardingButton.Skip>
                ) : undefined,
        };
    }

    // device.firmware === 'valid' in NoNewFirmware

    if (content) {
        return (
            <>
                {/* Modal above a fw update offer. Instructs user to reconnect the device in bootloader */}
                {status === 'waiting-for-bootloader' && (
                    <ReconnectDevicePrompt
                        deviceVersion={expectedModel}
                        requestedMode="bootloader"
                    />
                )}

                <OnboardingStepBox
                    heading={content.heading}
                    description={content.description}
                    innerActions={content.innerActions}
                    outerActions={content.outerActions}
                    confirmOnDevice={
                        status === 'waiting-for-confirmation'
                            ? device?.features?.major_version
                            : undefined
                    }
                >
                    {content.body}
                </OnboardingStepBox>
            </>
        );
    }
    return null;
};

export { FirmwareInitial };
