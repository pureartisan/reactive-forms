import React, { forwardRef } from 'react';

export const StaticComponent = forwardRef((props: any, ref: any) => {
    return (
        <div {...props} ref={ref} />
    );
});

StaticComponent.displayName = 'StaticComponent';