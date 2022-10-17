import React from 'react';
import { Application } from '../../domain/application';

type WindowInnerProps = {
    // HOLD
    app: Application;
};

export default function WindowInner({}: WindowInnerProps): React.ReactElement {
    return <div>WindowInner</div>;
}
