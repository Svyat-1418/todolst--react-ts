import { action } from '@storybook/addon-actions'
import { ComponentMeta, ComponentStory } from '@storybook/react'

import { EditableSpan } from './EditableSpan'

export default {
	title: 'Todolist/EditableSpan',
	component: EditableSpan,
} as ComponentMeta<typeof EditableSpan>

const Template: ComponentStory<typeof EditableSpan> = (args) => <EditableSpan {...args} />

export const AddItemFormBasicStory = Template.bind({})
AddItemFormBasicStory.args = {
	title: 'Some Title',
	changeTitle: action('Value inside form wants to change'),
}
