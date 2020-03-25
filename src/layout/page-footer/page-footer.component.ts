import { Component, Vue } from 'vue-property-decorator';

@Component
export default class PageFooterCompontnt extends Vue {
    public navigateToGitHub(): void {
        document.location.href = 'https://github.com/untied';
    }
}
