import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import AppWithRedux  from '../AppWithRedux';
import {ReduxStoreProviderDecorator} from "./decorators/ReduxStoreProviderDecorator";

export default {
    title: 'Todolist/AppWithRedux Stories',
    component: AppWithRedux,
    decorators: [ReduxStoreProviderDecorator]
} as ComponentMeta<typeof AppWithRedux>;

const Template: ComponentStory<typeof AppWithRedux> = (args) => <AppWithRedux  />;

export const AppWithReduxBasic = Template.bind({});

