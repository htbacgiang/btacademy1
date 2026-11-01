import { FC, ReactNode } from 'react';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import Footer from '../common/Footer';
import ModernNavbar from '../header/ModernNavbar';
import NavbarV2 from '../header/NavbarV2';
import MessengerButton from '../button/MessengerButton';

const GoogleAnalytics = dynamic(() => import('../common/GoogleAnalytics'), { ssr: false });

interface Props {
  title?: string;
  desc?: string;
  thumbnail?: string;
  children: ReactNode;
  navbarVersion?: 'v1' | 'v2';
}

const DefaultLayout: FC<Props> = ({ title, desc, thumbnail, children, navbarVersion = 'v2' }): JSX.Element => {
  return (
    <>
      <div className="min-h-screen bg-white transition">
        {navbarVersion === 'v1' ? <ModernNavbar /> : <NavbarV2 />}
        <GoogleAnalytics />
        <div className="mx-auto max-w-full">{children}</div>
        <MessengerButton />
        <Footer />
      </div>
    </>
  );
};

export default DefaultLayout;