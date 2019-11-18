import { Component, Vue } from 'vue-property-decorator';

import { ITaskRecord } from '@/database/database';

@Component
export default class TaskEditComponent extends Vue {
    public task: ITaskRecord = { // initial empty task
        id          : 0,
        priority    : 1,
        name        : '',
        description : ''
    };

    // 'created' hook
    public created(): void {
        if (typeof this.$route.params.id !== 'undefined' && this.$route.params.id.match(/^\d+$/)) { // modify existing task
            const id: number = parseInt(this.$route.params.id, 10);
            this.$api.findTask(id)
                .then((task: ITaskRecord | undefined): void => {
                    if (task !== undefined) {
                        this.task = { ...task };
                    } else {
                        throw new Error();
                    }
                })
                .catch((err: any): void => {
                    console.error('Unable to load the specified task!');
                });
        }
    }

    // form validation rules
    public get taskRules(): any {
        return {
            name: [
                { required: true, message: 'Please specify task name correctly!', trigger: 'blur' }
            ],
            priority: [
                { required: true, validator: this.validatePriority, trigger: 'blur' },
            ],
        };
    }

    // submit task edit
    public submit(): void {
        const taskEditForm: any = this.$refs['task-edit'];
        if (taskEditForm) {
            taskEditForm.validate((isValid: boolean) => {
                if (isValid) {
                    const priority: number = parseInt(this.task.priority as any, 10);
                    const prm: Promise<any> = this.task.id === 0 ?
                        this.$api.createTask(priority, this.task.name, this.task.description) :
                        this.$api.modifyTask(this.task.id, priority, this.task.name, this.task.description);
                    prm.then((result: any): void => {
                        this.$router.push({name: 'task-list'});
                    }).catch((err: any): void => {
                        console.error('Unable to save the specified task!');
                    });
                }
            });
        }
    }

    // cancel task edit
    public cancel(): void {
        this.$router.push({name: 'task-list'});
    }

    // form validator for priority
    private validatePriority(rule: any, value: any, callback: any): void {
        if (!value || !value.toString().match(/^\d+$/) || parseInt(value, 10) < 1) {
            callback(new Error('Please specify task priority correctly!'));
        } else {
            callback();
        }
    }
}
