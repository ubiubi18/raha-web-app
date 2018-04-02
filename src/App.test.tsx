import * as React from "react";
import { renderIntoDocument } from 'react-dom/test-utils';
import { IntlProvider } from "react-intl";

import App from "./App";
import messages from './data/locales/en';
import { mountWithIntl } from './helpers/intl-enzyme-test-helper';

it("renders without crashing", () => {
  renderIntoDocument(
    <IntlProvider locale="en" messages={messages}>
      <App />
    </IntlProvider>
  );
});
