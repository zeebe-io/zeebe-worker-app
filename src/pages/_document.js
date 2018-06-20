import Document, { Head, Main, NextScript } from 'next/document';
import JssProvider from 'react-jss/lib/JssProvider';
import { Fragment } from 'react';
import flush from 'styled-jsx/server';

import getPageContext from 'utils/getPageContext';
import { ServerStyleSheet } from 'styled-components';

class _Document extends Document {
  render() {
    const { pageContext } = this.props;
    return (
      <html lang="en" dir="ltr">
        <Head>
          <title>Zeebe Worker App</title>

          <meta charSet="utf-8" />

          <link
            rel="apple-touch-icon"
            sizes="152x152"
            href="/static/favicons/apple-touch-icon.png"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="32x32"
            href="/static/favicons/favicon-32x32.png"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="16x16"
            href="/static/favicons/favicon-16x16.png"
          />
          <link rel="manifest" href="/static/favicons/site.webmanifest" />
          <link rel="mask-icon" href="/static/favicons/safari-pinned-tab.svg" color="#5bbad5" />
          <link rel="shortcut icon" href="/static/favicons/favicon.ico" />
          <meta name="msapplication-TileColor" content="#da532c" />
          <meta name="msapplication-config" content="/static/favicons/browserconfig.xml" />
          <meta name="theme-color" content={pageContext.theme.palette.primary.main} />

          <meta
            name="viewport"
            content="user-scalable=0, initial-scale=1, minimum-scale=1, width=device-width, height=device-height"
          />

          <link rel="stylesheet" type="text/css" href="https://use.typekit.net/ltz3fea.css" />
          <link rel="stylesheet" href="/_next/static/style.css" />
        </Head>
        <body>
          {this.props.styleTags}
          <Main />
          <NextScript />
        </body>
      </html>
    );
  }
}

_Document.getInitialProps = (ctx) => {
  const pageContext = getPageContext();
  const sheet = new ServerStyleSheet();
  const page = ctx.renderPage(Component => props => (
    <JssProvider
      registry={pageContext.sheetsRegistry}
      generateClassName={pageContext.generateClassName}
    >
      <Component pageContext={pageContext} {...props} />
    </JssProvider>
  ));
  const styleTags = sheet.getStyleElement();

  return {
    ...page,
    styleTags,
    pageContext,
    styles: (
      <Fragment>
        <style
          id="jss-server-side"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: pageContext.sheetsRegistry.toString() }}
        />
        {flush() || null}
      </Fragment>
    ),
  };
};

export default _Document;
