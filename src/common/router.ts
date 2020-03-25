import Vue from 'vue';
import VueRouter from 'vue-router';

import EmployeeListComponent from '@/pages/employee/employee-list/employee-list.vue';
import EmployeeEditComponent from '@/pages/employee/employee-edit/employee-edit.vue';
import EmployeeTaskComponent from '@/pages/employee/employee-task/employee-task.vue';

import TaskListComponent from '@/pages/task/task-list/task-list.vue';
import TaskEditComponent from '@/pages/task/task-edit/task-edit.vue';

Vue.use(VueRouter);

const routes: any = [
    {
        path      : '/',
        redirect  : {
            name  : 'employee-list'
        }
    },
    {
        path      : '/employees',
        name      : 'employee-list',
        component : EmployeeListComponent
    },
    {
        path      : '/employee/create',
        name      : 'employee-create',
        component : EmployeeEditComponent
    },
    {
        path      : '/employee/modify/:id',
        name      : 'employee-modify',
        component : EmployeeEditComponent
    },
    {
        path      : '/employee/tasks/:id',
        name      : 'employee-task',
        component : EmployeeTaskComponent
    },
    {
        path      : '/tasks',
        name      : 'task-list',
        component : TaskListComponent
    },
    {
        path      : '/task/create',
        name      : 'task-create',
        component : TaskEditComponent
    },
    {
        path      : '/task/modify/:id',
        name      : 'task-modify',
        component : TaskEditComponent
    }
];

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
});

export default router;
