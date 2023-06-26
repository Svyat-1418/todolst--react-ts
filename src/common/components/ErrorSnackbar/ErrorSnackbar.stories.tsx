import { ComponentMeta, ComponentStory } from '@storybook/react'

import { ReduxStoreProviderDecorator } from '../../../stories/decorators/ReduxStoreProviderDecorator'

import { ErrorSnackbar } from './ErrorSnackbar'

export default {
	title: 'Todolist/ErrorSnackbar',
	component: ErrorSnackbar,
	decorators: [ReduxStoreProviderDecorator],
} as ComponentMeta<typeof ErrorSnackbar>

const Template: ComponentStory<typeof ErrorSnackbar> = () => <ErrorSnackbar />

export const ErrorSnackbarBasicStory = Template.bind({})
ErrorSnackbarBasicStory.args = {}
