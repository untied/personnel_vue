export enum EmployeeGender {
    MALE, FEMALE
}

export interface ITaskRecord {
    id           : number;
    priority     : number;
    name         : string;
    description? : string;
}

export interface IEmployeeRecord {
    id        : number;
    firstName : string;
    lastName  : string;
    gender?   : EmployeeGender;
    position  : string;
    email     : string;
    salary?   : number;
}

export interface IEmployeeTaskRecord {
    employeeId  : number;
    taskId      : number;
    isCompleted : boolean;
}

export interface IEmployeeTaskCount {
    total     : number;
    completed : number;
}


export class DataBase {
    // get a list of all tasks
    public static getTasks(): ITaskRecord[] {
        return DataBase.TABLE_TASKS.map((t: ITaskRecord): ITaskRecord => t);
    }

    // find a task by the specified id
    public static findTask(id: number): ITaskRecord | undefined {
        return DataBase.TABLE_TASKS.find((t: ITaskRecord): boolean => t.id === id);
    }

    // create a new task with the specified parameters
    public static createTask(
        priority     : number,
        name         : string,
        description? : string
    ): number {
        let id: number;
        for (id = 1; id < Number.MAX_SAFE_INTEGER; id++) {
            if (DataBase.TABLE_TASKS.findIndex((task: ITaskRecord): boolean => task.id === id) === -1) {
                break;
            }
        }
        if (id < Number.MAX_SAFE_INTEGER) {
            DataBase.TABLE_TASKS.push({
                id,
                priority,
                name,
                description
            });
        } else {
            id = -1;
        }
        return id;
    }

    // modify the task's data by the specified id
    public static modifyTask(
        id           : number,
        priority     : number,
        name         : string,
        description? : string
    ): boolean {
        const task: ITaskRecord | undefined = DataBase.TABLE_TASKS.find((t: ITaskRecord): boolean => t.id === id);
        if (task !== undefined) {
            task.priority    = priority;
            task.name        = name;
            task.description = description;
            return true;
        } else {
            return false;
        }
    }

    // remove a task by the specified id
    public static deleteTask(id: number): boolean {
        let index: number = DataBase.TABLE_TASKS.findIndex((t: ITaskRecord): boolean => t.id === id);
        if (index >= 0) {
            DataBase.TABLE_TASKS.splice(index, 1);
            while ((index = DataBase.TABLE_EMPLOYEE_TASKS.findIndex((et: IEmployeeTaskRecord): boolean => et.taskId === id)) !== -1) {
                DataBase.TABLE_EMPLOYEE_TASKS.splice(index, 1);
            }
            return true;
        } else {
            return false;
        }
    }

    // get a list of all employees
    public static getEmployees(): IEmployeeRecord[] {
        return DataBase.TABLE_EMPLOYEES.map((e: IEmployeeRecord): IEmployeeRecord => e);
    }

    // find an employee by the specified id
    public static findEmployee(id: number): IEmployeeRecord | undefined {
        return DataBase.TABLE_EMPLOYEES.find((e: IEmployeeRecord): boolean => e.id === id);
    }

    // create a new employee with the specified parameters
    public static createEmployee(
        firstName : string,
        lastName  : string,
        gender    : EmployeeGender | undefined,
        position  : string,
        email     : string,
        salary    : number
    ): number {
        let id: number;
        for (id = 1; id < Number.MAX_SAFE_INTEGER; id++) {
            if (DataBase.TABLE_EMPLOYEES.findIndex((empl: IEmployeeRecord): boolean => empl.id === id) === -1) {
                break;
            }
        }
        if (id < Number.MAX_SAFE_INTEGER) {
            DataBase.TABLE_EMPLOYEES.push({
                id,
                firstName,
                lastName,
                gender,
                position,
                email,
                salary
            });
        } else {
            id = -1;
        }
        return id;
    }

    // modify the employee's data by the specified id
    public static modifyEmployee(
        id        : number,
        firstName : string,
        lastName  : string,
        gender    : EmployeeGender | undefined,
        position  : string,
        email     : string,
        salary    : number
    ): boolean {
        const empl: IEmployeeRecord | undefined = DataBase.TABLE_EMPLOYEES.find((e: IEmployeeRecord): boolean => e.id === id);
        if (empl !== undefined) {
            empl.firstName = firstName;
            empl.lastName  = lastName;
            empl.gender    = gender;
            empl.position  = position;
            empl.email     = email;
            empl.salary    = salary;
            return true;
        } else {
            return false;
        }
    }

    // remove an employee by the specified id
    public static deleteEmployee(id: number): boolean {
        let index: number = DataBase.TABLE_EMPLOYEES.findIndex((e: IEmployeeRecord): boolean => e.id === id);
        if (index >= 0) {
            DataBase.TABLE_EMPLOYEES.splice(index, 1);
            while ((index = DataBase.TABLE_EMPLOYEE_TASKS.findIndex((et: IEmployeeTaskRecord): boolean => et.employeeId === id)) !== -1) {
                DataBase.TABLE_EMPLOYEE_TASKS.splice(index, 1);
            }
            return true;
        } else {
            return false;
        }
    }

    // check the task assignment for the specified employee
    public static employeeTaskExists(employeeId: number, taskId: number): boolean {
        return DataBase.TABLE_EMPLOYEE_TASKS
            .findIndex((et: IEmployeeTaskRecord): boolean => (et.employeeId === employeeId && et.taskId === taskId)) !== -1;
    }

    // assign specified tasks for employee
    public static assignEmployeeTasks(employeeId: number, taskIds: number[]): void {
        // 1st step: remove unassigned tasks for this employee
        DataBase.TABLE_EMPLOYEE_TASKS = DataBase.TABLE_EMPLOYEE_TASKS.reduce(
            (list: IEmployeeTaskRecord[], et: IEmployeeTaskRecord): IEmployeeTaskRecord[] => {
                if (et.employeeId !== employeeId || taskIds.includes(et.taskId)) {
                    list.push(et);
                }
                return list;
            },
            []
        );
        // 2nd step: assign tasks for this employee
        taskIds.forEach((taskId: number): void => {
            if (DataBase.TABLE_EMPLOYEE_TASKS.findIndex(
                (et: IEmployeeTaskRecord): boolean => et.employeeId === employeeId && et.taskId === taskId) === -1) {
                DataBase.TABLE_EMPLOYEE_TASKS.push({
                    employeeId,
                    taskId,
                    isCompleted: false
                });
            }
        });
    }

    // count tasks for the specified employee
    public static countEmployeeTasks(employeeId: number): IEmployeeTaskCount {
        return DataBase.TABLE_EMPLOYEE_TASKS.reduce((count: IEmployeeTaskCount, et: IEmployeeTaskRecord): IEmployeeTaskCount => {
            if (et.employeeId === employeeId) {
                count.total += 1;
                if (et.isCompleted) {
                    count.completed += 1;
                }
            }
            return count;
        }, {
            total     : 0,
            completed : 0
        } as IEmployeeTaskCount);
    }

    // get the list of employee tasks
    public static getEmployeeTasks(employeeId: number): IEmployeeTaskRecord[] {
        return DataBase.TABLE_EMPLOYEE_TASKS.filter((et: IEmployeeTaskRecord): boolean => et.employeeId === employeeId);
    }

    // set the state of employee tasks' completeness
    public static setEmployeeTasksCompleteness(
        employeeId  : number,
        completed   : number[],
        incompleted : number[]
    ): void {
        DataBase.TABLE_EMPLOYEE_TASKS.forEach((et: IEmployeeTaskRecord): void => {
            if (et.employeeId === employeeId) {
                if (completed.includes(et.taskId)) {
                    et.isCompleted = true;
                } else if (incompleted.includes(et.taskId)) {
                    et.isCompleted = false;
                }
            }
        });
    }

    // tasks table
    private static TABLE_TASKS: ITaskRecord[] = [
        {
            id          : 1,
            priority    : 1,
            name        : 'Sign NDA',
            description : 'A new employee should sign the NDA first of all'
        },
        {
            id          : 2,
            priority    : 2,
            name        : 'Create Email account',
            description : 'A new employee should be provided with personal corporate mailbox'
        },
        {
            id          : 3,
            priority    : 3,
            name        : 'Create GitLab account',
            description : 'A new employee should be provided with access to GitLab account'
        },
        {
            id          : 4,
            priority    : 3,
            name        : 'Create Jira account',
            description : 'A new employee should be provided with access to Jira task manager'
        },
        {
            id          : 5,
            priority    : 4,
            name        : 'Provide Slack access',
            description : 'A new employee should be able to connect to corporate Slack channels'
        },
        {
            id          : 6,
            priority    : 5,
            name        : 'Send all neccessary contacts',
            description : 'A new employee should be provided with all necessary Email or Skype contacts'
        },
        {
            id          : 7,
            priority    : 5,
            name        : 'Send all documentation files',
            description : 'A new employee should be provided with all necessary documentation'
        }
    ];

    // employees table
    private static TABLE_EMPLOYEES: IEmployeeRecord[] = [
        {
            id        : 1,
            firstName : 'Peter',
            lastName  : 'Jones',
            gender    : EmployeeGender.MALE,
            position  : 'SQL Programmer',
            email     : 'peter.jones@example.com',
            salary    : 3000
        },
        {
            id        : 2,
            firstName : 'Zuzanna',
            lastName  : 'Tartakowski',
            gender    : EmployeeGender.FEMALE,
            position  : 'Product Manager',
            email     : 'zuzanna.tartakowski@example.com',
            salary    : 5000
        },
        {
            id        : 3,
            firstName : 'Fatih',
            lastName  : 'Mindashvurti',
            gender    : EmployeeGender.MALE,
            position  : 'PHP Team Leader',
            email     : 'fatih.mindashvurti@example.com',
            salary    : 4000
        },
        {
            id        : 4,
            firstName : 'Alisha',
            lastName  : 'Yeng',
            gender    : EmployeeGender.FEMALE,
            position  : 'PHP Junior Developer',
            email     : 'alisha.yeng@example.com',
            salary    : 2000
        }
    ];

    // employees to task table
    private static TABLE_EMPLOYEE_TASKS: IEmployeeTaskRecord[] = [
        // Peter Jones - SQL Programmer
        {
            employeeId  : 1,
            taskId      : 1,
            isCompleted : true
        },
        {
            employeeId  : 1,
            taskId      : 2,
            isCompleted : true
        },
        {
            employeeId  : 1,
            taskId      : 4,
            isCompleted : true
        },
        {
            employeeId  : 1,
            taskId      : 5,
            isCompleted : false
        },
        {
            employeeId  : 1,
            taskId      : 6,
            isCompleted : false
        },
        {
            employeeId  : 1,
            taskId      : 7,
            isCompleted : false
        },

        // Zuzanna Tartakowski - Product Manager
        {
            employeeId  : 2,
            taskId      : 1,
            isCompleted : true
        },
        {
            employeeId  : 2,
            taskId      : 2,
            isCompleted : true
        },
        {
            employeeId  : 2,
            taskId      : 5,
            isCompleted : false
        },
        {
            employeeId  : 2,
            taskId      : 6,
            isCompleted : false
        },

        // Fatih Mindashvurti - PHP Team Leader
        {
            employeeId  : 3,
            taskId      : 1,
            isCompleted : true
        },
        {
            employeeId  : 3,
            taskId      : 2,
            isCompleted : true
        },
        {
            employeeId  : 3,
            taskId      : 3,
            isCompleted : false
        },
        {
            employeeId  : 3,
            taskId      : 4,
            isCompleted : true
        },
        {
            employeeId  : 3,
            taskId      : 5,
            isCompleted : true
        },
        {
            employeeId  : 3,
            taskId      : 6,
            isCompleted : false
        },
        {
            employeeId  : 3,
            taskId      : 7,
            isCompleted : false
        },

        // Alisha Yeng - PHP Junior Developer
        {
            employeeId  : 4,
            taskId      : 1,
            isCompleted : true
        },
        {
            employeeId  : 4,
            taskId      : 2,
            isCompleted : false
        },
        {
            employeeId  : 4,
            taskId      : 3,
            isCompleted : false
        },
        {
            employeeId  : 4,
            taskId      : 4,
            isCompleted : false
        },
        {
            employeeId  : 4,
            taskId      : 5,
            isCompleted : false
        }
    ];
}
