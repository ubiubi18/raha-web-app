import { IntlMessage } from "../../components/IntlMessage";
import * as React from "react";

interface OwnProps {
  memberBalance: string;
}

type Props = OwnProps;

export const Balance: React.StatelessComponent<Props> = props => {
  return (
    <section>
      <h2>
        <IntlMessage
          id="wallet.balance.message"
          values={{ balance: props.memberBalance }}
        />
      </h2>
    </section>
  );
};
