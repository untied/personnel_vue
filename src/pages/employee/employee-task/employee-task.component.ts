import { Component, Vue } from 'vue-property-decorator';

import { IEmployeeRecord, ITaskRecord } from '@/database/database';

interface ITaskAssignRecord extends ITaskRecord {
    isAssigned: boolean;
}

@Component
export default class EmployeeTaskComponent extends Vue {
    // employee identifier
    public employeeId: number = 0;

    // employee full name
    public employeeFullName: string = '';

    public tasks: ITaskAssignRecord[] = [];

    // mounted hook
    public mounted(): void {
        this.employeeId = parseInt(this.$route.params.id, 10);
        this.loadEmployeeFullName();
        this.loadTasks();
    }

    // submit employee task assignment
    public submit(): void {
        const taskIds: number[] = this.tasks.reduce((list: number[], task: ITaskAssignRecord): number[] => {
            if (task.isAssigned) {
                list.push(task.id);
            }
            return list;
        }, []);
        this.$api.assignEmployeeTasks(this.employeeId, taskIds)
            .then((result: any): void => {
                this.$router.push({name: 'employee-list'});
            }).catch((err: any): void => {
                console.error('Unable to assign the tasks to the specified employee!');
            });
    }

    // cancel employee task assignment
    public cancel(): void {
        this.$router.push({name: 'employee-list'});
    }

    // load employee full name
    private loadEmployeeFullName(): void {
        this.$api.findEmployee(this.employeeId)
            .then((empl: IEmployeeRecord | undefined): void => {
                if (empl !== undefined) {
                    this.employeeFullName = `${empl.lastName}, ${empl.firstName}`;
                } else {
                    throw new Error();
                }
            })
            .catch((err: any): void => {
                console.error('Unable to load the specified employee!');
            });
    }

    // load the list of tasks from the database
    private loadTasks(): void {
        this.$api.getTasks()
            .then(async (result: ITaskRecord[]) => {
                this.tasks = [];
                for (let i = 0; i < result.length; i++) {
                    this.tasks.push({
                        ...result[i],
                        isAssigned: await this.$api.employeeTaskExists(this.employeeId, result[i].id)
                    });
                }
                this.tasks.sort((t1: ITaskRecord, t2: ITaskRecord): number => {
                    return t1.priority < t2.priority ? -1 : (t1.priority > t2.priority ? 1 : 0);
                });
            })
            .catch((err: any): void => {
                console.error('Unable to get the list of tasks!');
            });
    }
}
