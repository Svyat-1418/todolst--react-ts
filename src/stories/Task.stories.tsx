import React from "react";
import { ComponentStory, ComponentMeta } from '@storybook/react'
import {Task} from "../Task"
import {action} from "@storybook/addon-actions";

export default {
    title: 'Todolist/Task',
    component: Task,
    args: {
        removeTask: action("Remove button inside Task clicked"),
        changeTaskStatus: action("Status changed inside Task"),
        changeTaskTitle: action("Title changed inside Task")
    }
} as ComponentMeta<typeof Task>;

const Template: ComponentStory<typeof Task> = (args) => <Task {...args} />

export const TaskIsDoneStory = Template.bind({});
TaskIsDoneStory.args = {
    todolistId: "todolistId1",
    task: {id: "1", title: "HTML&CSS", isDone: true}
}

export const TaskIsNotDoneStory = Template.bind({});
TaskIsNotDoneStory.args = {
    todolistId: "todolistId2",
    task: {id: "3", title: "NestJS", isDone: false}
}