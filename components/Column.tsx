/** The single 600px reading column every page sits in. */
export function Column({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <main id="main-content" className={`mx-auto w-full max-w-[600px] px-6 sm:px-10 pt-20 sm:pt-16 pb-40 ${className}`}>
      {children}
    </main>
  );
}
