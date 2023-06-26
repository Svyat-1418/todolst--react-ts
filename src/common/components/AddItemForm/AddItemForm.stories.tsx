import { action } from '@storybook/addon-actions'
import { ComponentMeta, ComponentStory } from '@storybook/react'

import { AddItemForm } from './AddItemForm'

export default {
	title: 'Todolist/AddItemForm',
	component: AddItemForm,
	argTypes: {
		addItem: {
			description: 'Button inside form clicked & value wants to set',
		},
	},
} as ComponentMeta<typeof AddItemForm>

const Template: ComponentStory<typeof AddItemForm> = (args) => <AddItemForm {...args} />

export const AddItemFormBasicStory = Template.bind({})
AddItemFormBasicStory.args = {
	addItem: action('Button inside form clicked & value wants to set'),
}
