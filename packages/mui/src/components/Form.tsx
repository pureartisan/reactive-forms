

import React from 'react';

import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

import { ReactiveForm, AbstractControl } from '@reactiveforms/core';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            display: 'flex',
            flexDirection: 'column',
            '& .MuiFormControl-root': {
                margin: theme.spacing(1),
            },
        },
    }),
);

interface StyledFormProps {
    children?: any
}

const StyledForm = (props: StyledFormProps) => {
    const classes = useStyles();
    return (
        <form
            className={classes.root}
            {...props}
        />
    );
};


interface MuiReactiveFormProps {
    form?: AbstractControl<any, any>
    className?: string;
    style?: any;
}


export const MuiReactiveForm = (props: MuiReactiveFormProps): JSX.Element => {
    const classes = useStyles();
    return (
        <ReactiveForm
            {...props}
            className={classes.root}
            component={StyledForm}
        />
    );
};
