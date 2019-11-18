import { ApiService } from '@/common/api.service';

// adding types to Vue object
declare module 'vue/types/vue' {
    interface Vue {
        $api: ApiService;
    }
}
