import React from 'react';
import { useOnboarding } from '@suite-hooks';
import DataAnalytics from './DataAnalytics';
import SecurityCheck from './SecurityCheck';

interface Props {
    initialized: boolean;
}

const PreOnboardingSetup = ({ initialized }: Props) => {
    // TODO typed substeps
    const { activeSubStep } = useOnboarding();

    if (activeSubStep === 'security-check') {
        // 2nd substep
        return <SecurityCheck initialized={initialized} />;
    }

    // 1st substep
    return <DataAnalytics />;
};

export default PreOnboardingSetup;
