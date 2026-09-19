// src/directives/vAutofocus.ts
import type { Directive } from 'vue'

const vAutofocus: Directive<HTMLElement> = {
  mounted(el) {
    setTimeout(() => {
      el.focus()
    }, 0)
  },
}

export default vAutofocus
