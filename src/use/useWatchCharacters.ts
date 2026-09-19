import { watch, type Ref } from 'vue'

export function useWatchCharacters(valueToWatch: Ref<string>, totalCharacters: number = 100) {
  watch(valueToWatch, (newValue) => {
    const noteLength = newValue.length
    if (noteLength === totalCharacters) {
      alert(`Congrats! you've reach the goal of ${totalCharacters} characters.`)
    }
  })
}
