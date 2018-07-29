
import * as React from 'react';
import * as Reaptcha from 'reaptcha';

export class CForm extends React.Component<any, any> {
  captcha: any;
  constructor(props: any) {
    super(props);
    this.captcha = null;
    this.state = {
      captchaReady: false
    };
  }

  onLoad = () => {
    this.setState({
      captchaReady: true
    });
  };

  onVerify = () => {
    console.log("Hello, I am verified");
  };

  render() {
    const Fragment = React.Fragment;
    return (
      <Fragment>
        <Reaptcha
          ref={(e: any) => (this.captcha = e)}
          sitekey="6LdnAmcUAAAAAEL-4JBW9pEMfAoWR4-r4vbIsgOa"
          onLoad={this.onLoad}
          onVerify={this.onVerify}
        />
        Render reCAPTCHA
      </Fragment>
    );
  }
}
