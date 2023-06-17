import React from "react";
import { ComponentStory, ComponentMeta } from '@storybook/react'
import {Todolist} from "./Todolist"
import {action} from "@storybook/addon-actions";
import {TaskPriorities, TaskStatuses} from "../../../api/todolistAPI";


export default {
    title: 'Todolist/Todolist',
    component: Todolist,
    args: {
        removeTaskCb: action("Remove button inside Task clicked"),
        addTaskCb: action("Add button inside Todolist clicked"),
        changeTaskStatus: action("Status changed inside Task"),
        changeTaskTitle: action("Title changed inside Task"),
        removeTodolistCb: action("Remove button inside Todolist clicked"),
        changeTodolistTitleCb: action("Title changed inside Todolist"),
        changeTodolistFilter: action("Filter changed inside Todolist")
    }
} as ComponentMeta<typeof Todolist>;

const Template: ComponentStory<typeof Todolist> = (args) => <Todolist {...args} />

export const TodolistBasicStory = Template.bind({});
TodolistBasicStory.args = {
    todolist: {
        id: "todolistId1",
        title: "Frontend",
        filter: "all",
        entityStatus: "idle",
        addedDate: "",
        order: 0
    }
}