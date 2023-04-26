// pages/_document.tsx
import React from 'react';
import Document, { Html, DocumentContext, NextScript } from 'next/document';
import { ServerStyleSheet } from 'styled-components';

export default class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const sheet = new ServerStyleSheet();
    const originalRenderPage = ctx.renderPage;
    try {
      ctx.renderPage = () =>
        originalRenderPage({
          enhanceApp: (App) => (props) => sheet.collectStyles(<App {...props} />),
        });
      const initialProps = await Document.getInitialProps(ctx);

      return {
        ...initialProps,
        styles: [
          <React.Fragment key="styles">
            <Html lang="de">
              <body>
                {initialProps.styles}
                {sheet.getStyleElement()}
                <NextScript />
              </body>
            </Html>
          </React.Fragment>,
        ],
      };
    } finally {
      sheet.seal();
    }
  }
}
