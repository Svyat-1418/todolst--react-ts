import React from "react";
import { ComponentStory, ComponentMeta } from '@storybook/react'
import {Task} from "../Task"
import {action} from "@storybook/addon-actions";
import {TaskPriorities, TaskStatuses} from "../api/todolistAPI";

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

export const TaskWithNewStatusStory = Template.bind({});
TaskWithNewStatusStory.args = {
    task: {id: "1", title: "HTML&CSS", status: TaskStatuses.Completed,
        todoListId: "todolistId1", deadline: "", description: "",
        startDate: "", order: 0, addedDate: "", priority: TaskPriorities.Middle}
}

export const TaskWithCompletedStatusStory = Template.bind({});
TaskWithCompletedStatusStory.args = {
    task: {id: "3", title: "NestJS", status: TaskStatuses.New,
        todoListId: "todolistId1", deadline: "", description: "",
        startDate: "", order: 0, addedDate: "", priority: TaskPriorities.Middle}
}