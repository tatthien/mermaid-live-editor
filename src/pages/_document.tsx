import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  const title = 'Use Diagram | Visualize your ideas with PlantUML'
  const description =
    'UseDiagram.com turns your ideas into diagrams with a beautiful UI. Try usediagram.com today!'
  return (
    <Html lang='en'>
      <Head>
        <meta name='description' content={description} />
        <link rel='icon' href='/favicon.ico' />
        <meta property='og:description' content={description} />
        <meta
          name='keywords'
          content='use diagram, diagram generator, diagram tool, sequence diagram, flowchart, UML, BPMN, software development, visualization tool'
        />
        <meta property='og:image' content='/banner.jpg' />
        <meta property='og:title' content={title} />
        <meta property='og:image:width' content='1200' />
        <meta property='og:image:height' content='670' />
        <meta name='twitter:card' content='summary_large_image' />
        <meta name='twitter:creator' content='hey_thien' />
        <meta name='twitter:image' content='/banner.jpg' />
        <meta name='twitter:image:src' content='/banner.jpg' />
        <meta name='twitter:title' content={title} />
        <meta name='twitter:description' content={description} />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
