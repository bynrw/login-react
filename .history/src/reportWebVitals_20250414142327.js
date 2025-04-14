/**
 * Misst und berichtet über die Web-Vitals-Metriken der Anwendung
 * @param {Function} onPerfEntry - Callback-Funktion für Performance-Einträge
 */
const reportWebVitals = (onPerfEntry) => {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
      getCLS(onPerfEntry)  // Cumulative Layout Shift
      getFID(onPerfEntry)  // First Input Delay
      getFCP(onPerfEntry)  // First Contentful Paint
      getLCP(onPerfEntry)  // Largest Contentful Paint
      getTTFB(onPerfEntry) // Time To First Byte
    })
  }
}

export default reportWebVitals
