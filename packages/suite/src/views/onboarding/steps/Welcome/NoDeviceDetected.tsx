import React from 'react';
import { useSpring, config, animated } from 'react-spring';
import styled from 'styled-components';
import { CollapsibleBox, Translation, TrezorLink, WebusbButton } from '@suite-components';
import { variables, Button } from '@trezor/components';
import { SUPPORT_URL } from '@suite-constants/urls';
import TrezorConnect from 'trezor-connect';

const Wrapper = styled(animated.div)`
    display: flex;
`;

const WhiteCollapsibleBox = styled(CollapsibleBox)`
    background: ${props => props.theme.BG_WHITE};
    min-width: 480px;

    @media screen and (max-width: ${variables.SCREEN_SIZE.LG}) {
        min-width: 380px;
    }
`;

const ItemLabel = styled.span`
    color: ${props => props.theme.TYPE_DARK_GREY};
    font-size: ${variables.FONT_SIZE.SMALL};
    font-weight: ${variables.FONT_WEIGHT.MEDIUM};
`;

const ItemDescription = styled.span`
    color: ${props => props.theme.TYPE_LIGHT_GREY};
    font-size: ${variables.FONT_SIZE.TINY};
    font-weight: ${variables.FONT_WEIGHT.MEDIUM};
    margin-top: 2px;
`;

const Bullet = styled.span`
    margin-right: 8px;
    color: ${props => props.theme.TYPE_DARK_GREY};
`;

const Items = styled.div`
    display: flex;
    flex-direction: column;
    padding: 20px 30px;
`;

const Item = styled.div`
    display: flex;

    & + & {
        margin-top: 16px;
    }
`;

const ItemContent = styled.div`
    display: flex;
    flex-direction: column;
`;

const ContactSupport = styled.div`
    display: flex;
    justify-content: space-between;
    border-top: 1px solid ${props => props.theme.STROKE_GREY};
    padding: 18px 30px;
    align-items: center;
`;

const FooterText = styled.span`
    color: ${props => props.theme.TYPE_LIGHT_GREY};
    font-size: ${variables.FONT_SIZE.TINY};
    font-weight: ${variables.FONT_WEIGHT.MEDIUM};
`;

const tips = [
    {
        heading: 'Try incognito mode',
        description: 'Just in case',
    },
    {
        heading: 'Try a different USB or port',
        description: 'Connect it directly to computer, no hubs.',
    },
    {
        heading: 'Make sure Trezor Bridge is installed',
        description: 'There should be probably a link to download it',
    },
    {
        heading: 'Try using a different computer, if you can',
        description: 'With Trezor Bridge installed',
    },
];
interface Props {
    offerWebUsb: boolean;
}
const NoDeviceDetected = ({ offerWebUsb }: Props) => {
    const fadeStyles = useSpring({
        config: { ...config.default },
        delay: 1000,
        from: { opacity: 0 },
        to: { opacity: 1 },
    });
    return (
        <Wrapper style={fadeStyles}>
            <WhiteCollapsibleBox
                variant="large"
                heading={
                    offerWebUsb ? (
                        <WebusbButton ready>
                            <Button icon="SEARCH">
                                <Translation id="TR_CHECK_FOR_DEVICES" />
                            </Button>
                        </WebusbButton>
                    ) : undefined
                }
                iconLabel={<Translation id="TR_STILL_DONT_SEE_YOUR_TREZOR" />}
                noContentPadding
            >
                <Items>
                    {tips.map((tip, i) => (
                        // eslint-disable-next-line react/no-array-index-key
                        <Item key={i}>
                            <Bullet>&bull;</Bullet>
                            <ItemContent>
                                <ItemLabel>{tip.heading}</ItemLabel>
                                <ItemDescription>{tip.description}</ItemDescription>
                            </ItemContent>
                        </Item>
                    ))}
                </Items>

                {/* TODO: probably too confusing and we would be better of to just instruct user to refresh the page */}
                {offerWebUsb && (
                    <Button
                        variant="secondary"
                        data-test="@onboarding/try-bridge-button"
                        onClick={() => TrezorConnect.disableWebUSB()}
                    >
                        <Translation id="TR_TRY_BRIDGE" />
                    </Button>
                )}

                <ContactSupport>
                    <FooterText>
                        <Translation id="TR_ONBOARDING_TROUBLESHOOTING_FAILED" />
                    </FooterText>
                    <TrezorLink variant="nostyle" href={SUPPORT_URL}>
                        <Button variant="tertiary">
                            <Translation id="TR_CONTACT_SUPPORT" />
                        </Button>
                    </TrezorLink>
                </ContactSupport>
            </WhiteCollapsibleBox>
        </Wrapper>
    );
};

export default NoDeviceDetected;
