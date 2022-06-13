import React from "react";
import { ComponentStory, ComponentMeta } from '@storybook/react'
import {ErrorSnackbar} from "./ErrorSnackbar";
import {ReduxStoreProviderDecorator} from "../../stories/decorators/ReduxStoreProviderDecorator";


export default {
    title: 'Todolist/ErrorSnackbar',
    component: ErrorSnackbar,
    decorators: [ReduxStoreProviderDecorator]
} as ComponentMeta<typeof ErrorSnackbar>;

const Template: ComponentStory<typeof ErrorSnackbar> = () => <ErrorSnackbar />

export const ErrorSnackbarBasicStory = Template.bind({});
ErrorSnackbarBasicStory.args = {}