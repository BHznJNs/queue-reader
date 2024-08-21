import { defineComponent, h, ref } from 'vue'
import type { Snackbar } from 'mdui'

export let showMsg: (newMsg: string) => void

export default defineComponent({
    setup() {
        const msg = ref('')
        const snackbar = ref<Snackbar>()
        showMsg = function(newMsg: string) {
            msg.value = newMsg
            snackbar.value &&
                (snackbar.value.open = true)
        }
        return { snackbar, msg }
    },
    render() {
        return h(
            'mdui-snackbar',
            {
                ref: "snackbar",
                'auto-close-delay': '3000'
            },
            this.msg
        )
    }
})
