import Vue from 'vue';

import {
    ITaskRecord,
    IEmployeeRecord,
    EmployeeGender,
    IEmployeeTaskCount,
    IEmployeeTaskRecord,
    DataBase
} from '@/database/database';

export class ApiService {
    // API instance
    private static api: ApiService = new ApiService();

    // getter returns API instance
    public static get $api(): ApiService {
        return ApiService.api;
    }

    // get a list of all tasks
    public getTasks(): Promise<ITaskRecord[]> {
        return new Promise<any>((resolve: (value?: ITaskRecord[]) => void, reject: (reason?: any) => void): void => {
            resolve(DataBase.getTasks());
        });
    }

    // find a task by the specified id
    public findTask(id: number): Promise<ITaskRecord | undefined> {
        return new Promise<any>((resolve: (value?: ITaskRecord | undefined) => void, reject: (reason?: any) => void): void => {
            resolve(DataBase.findTask(id));
        });
    }

    // create a new task with the specified parameters
    public createTask(
        priority     : number,
        name         : string,
        description? : string
    ): Promise<number> {
        return new Promise<number>((resolve: (value?: number) => void, reject: (reason?: any) => void): void => {
            resolve(DataBase.createTask(priority, name, description));
        });
    }

    // modify the task's data by the specified id
    public modifyTask(
        id           : number,
        priority     : number,
        name         : string,
        description? : string
    ): Promise<boolean> {
        return new Promise<boolean>((resolve: (value?: boolean) => void, reject: (reason?: any) => void): void => {
            resolve(DataBase.modifyTask(id, priority, name, description));
        });
    }

    // remove a task by the specified id
    public deleteTask(id: number): Promise<boolean> {
        return new Promise<boolean>((resolve: (value?: boolean) => void, reject: (reason?: any) => void): void => {
            resolve(DataBase.deleteTask(id));
        });
    }

    // get a list of all employees
    public getEmployees(): Promise<IEmployeeRecord[]> {
        return new Promise<any>((resolve: (value?: IEmployeeRecord[]) => void, reject: (reason?: any) => void): void => {
            resolve(DataBase.getEmployees());
        });
    }

    // find an employee by the specified id
    public findEmployee(id: number): Promise<IEmployeeRecord | undefined> {
        return new Promise<any>((resolve: (value?: IEmployeeRecord | undefined) => void, reject: (reason?: any) => void): void => {
            resolve(DataBase.findEmployee(id));
        });
    }

    // create a new employee with the specified parameters
    public createEmployee(
        firstName : string,
        lastName  : string,
        gender    : EmployeeGender | undefined,
        position  : string,
        email     : string,
        salary    : number
    ): Promise<number> {
        return new Promise<number>((resolve: (value?: number) => void, reject: (reason?: any) => void): void => {
            resolve(DataBase.createEmployee(firstName, lastName, gender, position, email, salary));
        });
    }

    // modify the employee's data by the specified id
    public modifyEmployee(
        id        : number,
        firstName : string,
        lastName  : string,
        gender    : EmployeeGender | undefined,
        position  : string,
        email     : string,
        salary    : number
    ): Promise<boolean> {
        return new Promise<boolean>((resolve: (value?: boolean) => void, reject: (reason?: any) => void): void => {
            resolve(DataBase.modifyEmployee(id, firstName, lastName, gender, position, email, salary));
        });
    }

    // remove an employee by the specified id
    public deleteEmployee(id: number): Promise<boolean> {
        return new Promise<boolean>((resolve: (value?: boolean) => void, reject: (reason?: any) => void): void => {
            resolve(DataBase.deleteEmployee(id));
        });
    }

    // check the task assignment for the specified employee
    public employeeTaskExists(employeeId: number, taskId: number): Promise<boolean> {
        return new Promise<boolean>((resolve: (value?: boolean) => void, reject: (reason?: any) => void): void => {
            resolve(DataBase.employeeTaskExists(employeeId, taskId));
        });
    }

    // assign specified tasks for employee
    public assignEmployeeTasks(employeeId: number, taskIds: number[]): Promise<void> {
        return new Promise<void>((resolve: (value?: void) => void, reject: (reason?: any) => void): void => {
            resolve(DataBase.assignEmployeeTasks(employeeId, taskIds));
        });
    }

    // count tasks for the specified employee
    public countEmployeeTasks(employeeId: number): Promise<IEmployeeTaskCount> {
        return new Promise<IEmployeeTaskCount>((resolve: (value?: IEmployeeTaskCount) => void, reject: (reason?: any) => void): void => {
            resolve(DataBase.countEmployeeTasks(employeeId));
        });
    }

    // get the list of employee tasks
    public getEmployeeTasks(employeeId: number): Promise<IEmployeeTaskRecord[]> {
        return new Promise<IEmployeeTaskRecord[]>(
            (resolve: (value?: IEmployeeTaskRecord[]) => void, reject: (reason?: any) => void): void => {
                resolve(DataBase.getEmployeeTasks(employeeId));
            }
        );
    }

    // set the state of employee tasks' completeness
    public setEmployeeTasksCompleteness(
        employeeId  : number,
        completed   : number[],
        incompleted : number[]
    ): Promise<void> {
        return new Promise<void>((resolve: (value?: void) => void, reject: (reason?: any) => void): void => {
            resolve(DataBase.setEmployeeTasksCompleteness(employeeId, completed, incompleted));
        });
    }
}

// plugin declaration
export function ApiServicePlugin(vue: typeof Vue, options?: any): void {
    vue.prototype.$api = ApiService.$api;
}
