import React, { useState } from 'react';
import styled from 'styled-components';
import { Button } from '@trezor/components';
import { Translation, WebusbButton, Image } from '@suite-components';
import { Wrapper, Text } from '@onboarding-components';
import { OnboardingStepBox } from '@suite/components/firmware';

const ButtonWrapper = styled.div`
    display: flex;
    width: 100%;
    justify-content: center;
    margin-top: 20px;
`;

interface Props {
    showWebUsb: boolean;
}

const Reconnect = ({ showWebUsb }: Props) => {
    return (
        <OnboardingStepBox
            disableConfirmWrapper
            data-test="@onboarding/unexpected-state/reconnect"
            heading={<Translation id="TR_RECONNECT_HEADER" />}
            description={
                <>
                    <Text>
                        <Translation id="TR_RECONNECT_TEXT" />
                    </Text>
                    <Text>
                        <Translation id="TR_RECONNECT_TROUBLESHOOT_CONNECTION" />
                    </Text>
                    <Text>
                        <Translation id="TR_RECONNECT_TROUBLESHOOT_CABLE" />
                    </Text>
                    <Text>
                        <Translation id="TR_RECONNECT_TROUBLESHOOT_BRIDGE" />
                    </Text>
                </>
            }
            innerActions={
                showWebUsb ? (
                    <ButtonWrapper>
                        <WebusbButton ready>
                            <Button icon="PLUS">
                                <Translation id="TR_CHECK_FOR_DEVICES" />
                            </Button>
                        </WebusbButton>
                    </ButtonWrapper>
                ) : undefined
            }
        />
    );
};
export default Reconnect;
