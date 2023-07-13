import {toast} from 'vue3-toastify'

const toastMessage = (message, type) => {
    toast(message, {
        autoClose: 1000,
        type: type,
    });
}

export default toastMessage;