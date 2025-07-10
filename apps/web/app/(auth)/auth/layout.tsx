import { ReactNode } from "react";

const AuthLayout = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <header className="h-20 border-b border-b-gray-900"></header>
      <main className="flex-1 flex items-center justify-center w-full h-full">
        {children}
      </main>
      <footer className="h-40 border-t border-t-blue-500"></footer>
    </>
  );
};

export default AuthLayout;
