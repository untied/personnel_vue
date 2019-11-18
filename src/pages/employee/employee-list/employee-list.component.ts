import { Component, Vue } from 'vue-property-decorator';

import {
    EmployeeGender,
    IEmployeeRecord,
    IEmployeeTaskCount,
    IEmployeeTaskRecord,
    ITaskRecord
} from '@/database/database';

interface IEmployeeRecordWithTasks extends IEmployeeRecord {
    taskCount: IEmployeeTaskCount;
}

interface IEmployeeTaskRecordExt extends IEmployeeTaskRecord {
    task?: ITaskRecord;
}


@Component
export default class EmployeeListComponent extends Vue {
    public employees     : IEmployeeRecordWithTasks[] = [];
    public employeeTasks : IEmployeeTaskRecordExt[]   = [];

    public taskProgressVisible: boolean = false;

    private employeeId: number = 0;

    // mounted hook
    public mounted(): void {
        this.loadEmployees();
    }

    // return employee gender in text representation
    public getGender(gender?: EmployeeGender): string {
        return gender === undefined ? '' : (gender === EmployeeGender.MALE ? 'male' : 'female');
    }

    // create new employee
    public createEmployee(): void {
        this.$router.push({name: 'employee-create'});
    }

    // modify the selected employee
    public modifyEmployee(id: number): void {
        this.$router.push({
            name   : 'employee-modify',
            params : {
                id: id.toString()
            }
        });
    }

    // view a contract of selected employee
    public viewEmployeeContract(id: number): void {
        this.$router.push({
            name   : 'employee-card',
            params : {
                id: id.toString()
            }
        });
    }

    // delete the selected employee
    public deleteEmployee(id: number): void {
        if (window.confirm('Are you sure you want to delete the selected employee?')) {
            this.$api.deleteEmployee(id)
                .then((result: boolean): void => {
                    if (result) {
                        const index: number = this.employees.findIndex((e: IEmployeeRecord): boolean => e.id === id);
                        if (index !== -1) {
                            this.employees.splice(index, 1);
                        }
                    } else {
                        throw new Error();
                    }
                })
                .catch((err: any): void => {
                    console.error('Unable to delete the selected employee!');
                });
        }
    }

    // assign tasks for the selected employee
    public assignTasksForEmployee(id: number): void {
        this.$router.push({
            name   : 'employee-task',
            params : {
                id: id.toString()
            }
        });
    }

    // open task progress dialogue
    public openTaskProgressForEmployee(employeeId: number): void {
        this.employeeId = employeeId;
        this.loadEmployeeTasks(employeeId, () => {
            this.taskProgressVisible = true;
        });
    }

    // toggle task completeness
    public toggleTaskCompleteness(employeeId: number, taskId: number): void {
        const employeeTask: IEmployeeTaskRecord | undefined =
            this.employeeTasks.find((et: IEmployeeTaskRecord): boolean => et.employeeId === employeeId && et.taskId === taskId);
        if (employeeTask !== undefined) {
            employeeTask.isCompleted = !employeeTask.isCompleted;
        }
    }

    // set employee task completeness
    public setTaskCompleteness(): void {
        const completness: number[][] = this.employeeTasks.reduce((list: number[][], et: IEmployeeTaskRecord): number[][] => {
            if (et.isCompleted) {
                list[0].push(et.taskId);
            } else {
                list[1].push(et.taskId);
            }
            return list;
        }, [[], []]);
        this.$api.setEmployeeTasksCompleteness(this.employeeId, completness[0], completness[1])
            .then((): void => {
                const employee: IEmployeeRecordWithTasks | undefined =
                    this.employees.find((empl: IEmployeeRecordWithTasks): boolean => empl.id === this.employeeId);
                if (employee !== undefined) {
                    employee.taskCount.completed = completness[0].length;
                }
                this.taskProgressVisible = false;
            })
            .catch((err: any): void => {
                console.error('Unable to set employee task completness!');
            });
    }

    // load the list of employees from the database
    private loadEmployees(): void {
        this.$api.getEmployees()
            .then(async (result: IEmployeeRecord[]) => {
                this.employees = [];
                for (let i = 0; i < result.length; i++) {
                    this.employees.push({
                        ...result[i],
                        taskCount: await this.$api.countEmployeeTasks(result[i].id)
                    });
                }
                this.employees.sort((e1: IEmployeeRecord, e2: IEmployeeRecord): number => {
                    return e1.lastName < e2.lastName ? -1 : (e1.lastName > e2.lastName ? 1 : 0);
                });
            })
            .catch((err: any): void => {
                console.error('Unable to get the list of employees!');
            });
    }

    // load a list of tasks have been assigned to the specified employee
    private loadEmployeeTasks(employeeId: number, callback?: () => void): void {
        this.$api.getEmployeeTasks(employeeId)
            .then(async (result: IEmployeeTaskRecord[]) => {
                this.employeeTasks = [];
                for (let i = 0; i < result.length; i++) {
                    this.employeeTasks.push({
                        ...result[i],
                        task: await this.$api.findTask(result[i].taskId)
                    });
                }
                this.employeeTasks.sort((et1: IEmployeeTaskRecordExt, et2: IEmployeeTaskRecordExt): number => {
                    if (et1.task !== undefined && et2.task !== undefined) {
                        return et1.task.priority < et2.task.priority ? -1 : (et1.task.priority > et2.task.priority ? 1 : 0);
                    } else {
                        return 0;
                    }
                });
                if (typeof callback === 'function') {
                    callback();
                }
            })
            .catch((err: any): void => {
                console.error('Unable to get the list of employee tasks!');
            });
    }
}
