import React from 'react';
import Reaptcha from 'reaptcha';

interface CFormProps {
  onVerify(response: string): void
}

export class CForm extends React.Component<CFormProps> {
  captcha: any;
  constructor(props: CFormProps) {
    super(props);
    this.captcha = null;
    this.onVerify = this.onVerify.bind(this)
  }

  public onVerify(response: string) {
    this.props.onVerify(response);
  };

  public render() {
    const Fragment = React.Fragment;
    return (
      <Fragment>
        <Reaptcha
          ref={(e: any) => (this.captcha = e)}
          sitekey="6LdnAmcUAAAAAEL-4JBW9pEMfAoWR4-r4vbIsgOa"
          onVerify={this.onVerify}
        />
      </Fragment>
    );
  }
}
