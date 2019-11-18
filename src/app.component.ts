import { Component, Vue } from 'vue-property-decorator';

import PageHeaderComponent from '@/layout/page-header/page-header.vue';
import PageFooterComponent from '@/layout/page-footer/page-footer.vue';

@Component({
    components: {
        'page-header': PageHeaderComponent,
        'page-footer': PageFooterComponent
    }
})
export default class AppComponent extends Vue {
    // currently nothing
}
