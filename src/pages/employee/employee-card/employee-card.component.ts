import { Component, Vue } from 'vue-property-decorator';

import { IEmployeeRecord, EmployeeGender } from '@/database/database';

@Component
export default class EmployeeCardComponent extends Vue {
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
        if (typeof this.$route.params.id !== 'undefined' && this.$route.params.id.match(/^\d+$/)) {
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

    // cancel employee edit
    public cancel(): void {
        this.$router.push({name: 'employee-list'});
    }
}
