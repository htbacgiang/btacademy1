"use strict";
import Script from "next/script";

const GoogleAnalytics = () => {
  return (
    <>
      <Script async src="https://www.googletagmanager.com/gtag/js?id=G-BWYWQ6Y21C" strategy="afterInteractive" />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag() { dataLayer.push(arguments); }
          gtag('js', new Date());
          gtag('config', 'G-BWYWQ6Y21C');
        `}
      </Script>
    </>
  );
};

export default GoogleAnalytics;
