export function useFeedUrl() {
  const { locale } = useI18n();
  return computed(() => (locale.value === "en" ? "/rss.xml" : "/ko/rss.xml"));
}
