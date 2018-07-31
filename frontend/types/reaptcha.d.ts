declare module 'reaptcha' {
    import * as React from 'react';

    export interface ReaptchaProps {
      id?: string
      className?: string
      sitekey: string
      theme?: 'light' | 'dark'
      size?: 'compact' | 'normal' | 'invisible'
      badge?: 'bottomright' | 'bottomleft' | 'inline'
      tabindex?: number
      explicit?: boolean
      onLoad?(): any
      onRender?(): any
      onVerify(response: string): void
      onExpire?(): any
      onError?(): any
      inject?: boolean
      isolated?: boolean
      hl?: string
    }

    export default class Reaptcha extends React.Component<ReaptchaProps, any> {
        constructor(props: ReaptchaProps): void;
        render(): JSX.Element;
    }

}

