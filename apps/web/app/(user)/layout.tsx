import { ReactNode } from "react";

const UserLayout = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <header className="h-20 w-full border-b border-b-gray-500"></header>
      <main className="flex-1">{children}</main>
      <footer className="h-40 w-full border-t border-t-blue-300"></footer>
    </>
  );
};

export default UserLayout;
