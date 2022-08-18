import React, { ReactElement } from 'react';

type WinProps = {
    children: ReactElement;
};

export default function Win({}: WinProps): React.ReactElement {
    return <div>Win</div>;
}
