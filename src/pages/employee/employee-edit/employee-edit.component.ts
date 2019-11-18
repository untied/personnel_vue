import { Component, Vue } from 'vue-property-decorator';

import { IEmployeeRecord, EmployeeGender } from '@/database/database';

@Component
export default class EmployeeEditComponent extends Vue {
    public readonly EmployeeGender: typeof EmployeeGender = EmployeeGender;

    public empl: IEmployeeRecord = { // initial empty employee
        id        : 0,
        firstName : '',
        lastName  : '',
        position  : '',
        email     : ''
    };

    // 'created' hook
    public created(): void {
        if (typeof this.$route.params.id !== 'undefined' && this.$route.params.id.match(/^\d+$/)) { // modify existing employee
            const id: number = parseInt(this.$route.params.id, 10);
            this.$api.findEmployee(id)
                .then((empl: IEmployeeRecord | undefined): void => {
                    if (empl !== undefined) {
                        this.empl = { ...empl };
                    } else {
                        throw new Error();
                    }
                })
                .catch((err: any): void => {
                    console.error('Unable to load the specified employee!');
                });
        }
    }

    // form validation rules
    public get employeeRules(): any {
        return {
            firstName: [
                { required: true, message: 'Please specify first name correctly!', trigger: 'blur' }
            ],
            lastName: [
                { required: true, message: 'Please specify last name correctly!', trigger: 'blur' }
            ],
            email: [
                { required: true, validator: this.validateEmail, trigger: 'blur' }
            ],
            position: [
                { required: true, message: 'Please specify employee position correctly!', trigger: 'blur' }
            ],
            salary: [
                { required: true, validator: this.validateSalary, trigger: 'blur' },
            ],
        };
    }

    // submit employee edit
    public submit(): void {
        const employeeEditForm: any = this.$refs['employee-edit'];
        if (employeeEditForm) {
            employeeEditForm.validate((isValid: boolean) => {
                if (isValid) {
                    const salary: number = parseInt(this.empl.salary as any, 10);
                    const prm: Promise<any> = this.empl.id === 0 ?
                        this.$api.createEmployee(
                            this.empl.firstName,
                            this.empl.lastName,
                            this.empl.gender,
                            this.empl.position,
                            this.empl.email,
                            salary
                        ) :
                        this.$api.modifyEmployee(
                            this.empl.id,
                            this.empl.firstName,
                            this.empl.lastName,
                            this.empl.gender,
                            this.empl.position,
                            this.empl.email,
                            salary
                        );
                    prm.then((result: any): void => {
                        this.$router.push({name: 'employee-list'});
                    }).catch((err: any): void => {
                        console.error('Unable to save the specified employee!');
                    });
                }
            });
        }
    }

    // cancel employee edit
    public cancel(): void {
        this.$router.push({name: 'employee-list'});
    }

    // form validator for email
    private validateEmail(rule: any, value: any, callback: any): void {
        if (value && value.match(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)) {
          callback();
        } else {
          callback(new Error('Please specify email correctly!'));
        }
    }

    // form validator for salary
    private validateSalary(rule: any, value: any, callback: any): void {
        if (!value || !value.toString().match(/^\d+$/) || parseInt(value, 10) < 1) {
            callback(new Error('Please specify salary correctly!'));
        } else {
            callback();
        }
    }
}
