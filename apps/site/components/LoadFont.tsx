export function LoadFont(props: { cssFile?: string; woff2File?: string }) {
  return (
    <>
      {props.cssFile && (
        <link crossOrigin="anonymous" href={props.cssFile} rel="stylesheet" />
      )}
      {props.woff2File && (
        <link
          crossOrigin="anonymous"
          rel="preload"
          href={props.woff2File}
          as="font"
          type="font/woff2"
        />
      )}
    </>
  )
}

export const LoadSilkscreen = () => (
  <LoadFont woff2File="/fonts/slkscr.woff2" cssFile="/fonts/silkscreen.css" />
)

export const LoadInter400 = () => (
  <LoadFont
    woff2File="/fonts/subset-Inter-Regular.woff2"
    cssFile="/fonts/inter-400.css"
  />
)

export const LoadInter700 = () => (
  <LoadFont
    woff2File="/fonts/subset-Inter-ExtraBold.woff2"
    cssFile="/fonts/inter-700.css"
  />
)

export const LoadInter900 = () => (
  <LoadFont woff2File="/fonts/subset-Inter-Black.woff2" cssFile="/fonts/inter-900.css" />
)

export const LoadGlusp = () => (
  <LoadFont woff2File="/fonts/glusp.woff2" cssFile="/fonts/glusp.css" />
)

export const LoadMunro = () => (
  <LoadFont woff2File="/fonts/munro.woff2" cssFile="/fonts/munro.css" />
)
