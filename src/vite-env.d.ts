/// <reference types="vite/client" />
/// <reference types="vite-plugin-svgr/client" />

declare module '*.svg?react' {
  import React from 'react';
  const SVGComponent: React.FC<React.SVGProps<SVGSVGElement>>;
  export default SVGComponent;
}

declare module 'react-mailchimp-subscribe' {
  import React from 'react';
  interface MailchimpSubscribeProps {
    url: string;
    render?: (props: {
      subscribe: (data: Record<string, string>) => void;
      status: 'sending' | 'success' | 'error' | null;
      message: string | Error | null;
    }) => React.ReactNode;
  }
  const MailchimpSubscribe: React.FC<MailchimpSubscribeProps>;
  export default MailchimpSubscribe;
}
