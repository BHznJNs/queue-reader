import { defineComponent, h, ref } from 'vue'
import type { Dialog } from 'mdui'

type ConfirmCallback = () => void

export let requestConfirm: (newTagName: string, confirmCallback: ConfirmCallback) => void

export default defineComponent({
    setup() {
        const dialog = ref<Dialog>()
        const tagName = ref('')
        const callback = ref<ConfirmCallback>()

        function open() {
            dialog.value &&
                (dialog.value.open = true)
        }
        function close() {
            dialog.value &&
                (dialog.value.open = false)
        }
        function confirm() {
            callback.value!()
            close()
        }

        requestConfirm = function (newTagName: string, confirmCallback: ConfirmCallback) {
            tagName.value = newTagName
            callback.value = confirmCallback
            open()
        }

        return {
            dialog, tagName, callback,
            close, confirm,
        }
    },
    render() {
        return h(
            'mdui-dialog',
            { ref: 'dialog' },
            [
                h('span', { slot: 'headline' }, 'Confirm Tag Deletion'),
                h('p', `Are you sure you want to delete the tag "${this.tagName}"?\nThis action cannot be undone.`),
                h('mdui-button', {
                    slot: 'action',
                    variant: 'text',
                    onClick: this.close,
                }, "Cancel"),
                h('mdui-button', {
                    slot: 'action',
                    onClick: this.confirm,
                }, "Confirm"),
            ]
        )
    }
})
