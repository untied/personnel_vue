import { Component, Vue } from 'vue-property-decorator';

import { ITaskRecord } from '@/database/database';

@Component
export default class TaskListComponent extends Vue {
    public tasks: ITaskRecord[] = [];

    // mounted hook
    public mounted(): void {
        this.loadTasks();
    }

    // create new task
    public createTask(): void {
        this.$router.push({name: 'task-create'});
    }

    // modify the selected task
    public modifyTask(id: number): void {
        this.$router.push({
            name   : 'task-modify',
            params : {
                id: id.toString()
            }
        });
    }

    // delete the selected task
    public deleteTask(id: number): void {
        this.$confirm('Are you sure you want to delete the selected task?', 'Confirmation required', {
            type              : 'warning',
            confirmButtonText : 'OK',
            cancelButtonText  : 'Cancel'
        }).then(() => {
            this.$api.deleteTask(id)
                .then((result: boolean): void => {
                    if (result) {
                        const index: number = this.tasks.findIndex((t: ITaskRecord): boolean => t.id === id);
                        if (index !== -1) {
                            this.tasks.splice(index, 1);
                        }
                    } else {
                        throw new Error();
                    }
                })
                .catch((err: any): void => {
                    console.error('Unable to delete the selected task!');
                });
        });
    }

    // load the list of tasks from the database
    private loadTasks(): void {
        this.$api.getTasks()
            .then((result: ITaskRecord[]): void => {
                this.tasks = result.sort((t1: ITaskRecord, t2: ITaskRecord): number => {
                    return t1.priority < t2.priority ? -1 : (t1.priority > t2.priority ? 1 : 0);
                });
            })
            .catch((err: any): void => {
                console.error('Unable to get the list of tasks!');
            });
    }
}
