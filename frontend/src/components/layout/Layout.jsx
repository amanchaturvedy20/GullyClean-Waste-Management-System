import React from 'react';
import Header from './Header';
import Footer from './Footer';
import { Outlet } from 'react-router-dom';

const Layout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50/50 font-sans selection:bg-emerald-500/30">
      <Header />
      {/* Added pt-20 to push content below the new fixed Header */}
      <main className="flex-grow w-full pt-20">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;