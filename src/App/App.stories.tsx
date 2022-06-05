import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import App  from './App';
import {ReduxStoreProviderDecorator} from "../stories/decorators/ReduxStoreProviderDecorator";

export default {
    title: 'Todolist/App',
    component: App,
    decorators: [ReduxStoreProviderDecorator]
} as ComponentMeta<typeof App>;

const Template: ComponentStory<typeof App> = (args) => <App {...args} />;

export const AppBaseStory = Template.bind({});
AppBaseStory.args = {demo: true}
