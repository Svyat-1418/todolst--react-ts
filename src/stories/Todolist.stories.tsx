import React from "react";
import { ComponentStory, ComponentMeta } from '@storybook/react'
import {Todolist} from "../Todolist"
import {action} from "@storybook/addon-actions";
import {TaskPriorities, TaskStatuses} from "../api/todolistAPI";


export default {
    title: 'Todolist/Todolist',
    component: Todolist,
    args: {
        removeTask: action("Remove button inside Task clicked"),
        addTask: action("Add button inside Todolist clicked"),
        changeTaskStatus: action("Status changed inside Task"),
        changeTaskTitle: action("Title changed inside Task"),
        removeTodolist: action("Remove button inside Todolist clicked"),
        changeTodolistTitle: action("Title changed inside Todolist"),
        changeTodolistFilter: action("Filter changed inside Todolist")
    }
} as ComponentMeta<typeof Todolist>;

const Template: ComponentStory<typeof Todolist> = (args) => <Todolist {...args} />

export const TodolistBasicStory = Template.bind({});
TodolistBasicStory.args = {
    id: "todolistId1",
    title: "Frontend",
    filter: "all",
    tasks: [
        {id: "1", title: "HTML&CSS", status: TaskStatuses.Completed,
            todoListId: "todolistId1", deadline: "", description: "",
            startDate: "", order: 0, addedDate: "", priority: TaskPriorities.Middle},
        {id: "2", title: "JS", status: TaskStatuses.New,
            todoListId: "todolistId1", deadline: "", description: "",
            startDate: "", order: 0, addedDate: "", priority: TaskPriorities.Middle},
        {id: "3", title: "ReactJS", status: TaskStatuses.New,
            todoListId: "todolistId1", deadline: "", description: "",
            startDate: "", order: 0, addedDate: "", priority: TaskPriorities.Middle}
    ],


}