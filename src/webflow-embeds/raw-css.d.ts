// `?raw` imports let a story display the exact stylesheet text that gets
// pasted into Webflow, straight from the source file — no second copy to
// drift out of sync.
declare module '*.css?raw' {
  const content: string
  export default content
}

declare module '*.html?raw' {
  const content: string
  export default content
}
