import { Component, Vue, Watch } from 'vue-property-decorator';

@Component({
    components: {
    }
})
export default class PageHeaderCompontnt extends Vue {
    // currently nothing
    public activeIndex: string = '';

    @Watch('$route')
    public beforeRouteUpdate(): void {
        this.detectIndex();
    }

    // 'before mount' hook
    public beforeMount(): void {
        this.activeIndex = this.detectIndex();
    }

    // navigate to menu section
    public navigateTo(name: string): void {
        if (this.$route.name !== name) {
            this.$router.push({name});
        }
    }

    // detect current active menu item
    private detectIndex(): string {
        const routeName: string = this.$route.name ? this.$route.name : '';
        let index: string;
        if (routeName.indexOf('employee-') === 0) {
            index = '1';
        } else if (routeName.indexOf('task-') === 0) {
            index = '2';
        } else {
            index = '';
        }
        return index;
    }
}
