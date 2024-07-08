
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';



export default function useTast() {



    const success = (msg) => {
        setTimeout(() => {
            toast(msg, {
                "theme": "dark",
                "type": "success",
                "autoClose": 1500,
                "dangerouslyHTMLString": true
            })
        }, 1600);

    }

    const error = (msg) => {
        setTimeout(() => {
            toast(msg, {
                "theme": "dark",
                "type": "error",
                "autoClose": 1500,
                "dangerouslyHTMLString": true
            })
        }, 1600);
    }
    const warning = (msg) => {
        setTimeout(() => {
            toast(msg, {
                "theme": "dark",
                "type": "warning",
                "autoClose": 1500,
                "dangerouslyHTMLString": true
            })
        }, 1600);
    }


    return { success, error, warning }
}