import { onUnmounted, watch, type MaybeRefOrGetter, toValue } from 'vue'

const supportedThemes = new Set(['default', 'riso', 'newsprint'])

export function useTheme(theme: MaybeRefOrGetter<string | undefined>) {
  watch(
    () => toValue(theme),
    (slug) => {
      document.documentElement.dataset.theme = slug && supportedThemes.has(slug) ? slug : 'default'
    },
    { immediate: true },
  )

  onUnmounted(() => {
    document.documentElement.dataset.theme = 'default'
  })
}
