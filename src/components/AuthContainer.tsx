import Image from "next/image";

export default function AuthContainer({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen">
      <section className="min-h-screen flex">
        <div className="hidden lg:flex w-1/2 bg-purple-800 items-center justify-center p-8">
          <Image
            src="/images/mac.png"
            alt="Mac Image"
            height={450}
            width={450}
          />
        </div>

        <div className="w-full lg:w-1/2 bg-white flex items-center justify-center p-8">
          <div className="max-w-md w-full text-center">{children}</div>
        </div>
      </section>
    </main>
  );
}
