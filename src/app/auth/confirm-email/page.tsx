// app/(auth)/confirm-email/page.tsx

export default function ConfirmEmailPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md rounded-lg bg-white p-8 text-center shadow-md">
        {/* The Icon */}
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-purple-100">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8 text-purple-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
        </div>

        {/* The Heading */}
        <h1 className="text-2xl font-bold text-gray-900">Confirm Your Email</h1>

        {/* The Message */}
        <p className="mt-2 text-gray-600">
          We&apos;ve sent a verification link to your email address. Please
          click the link to complete your registration.
        </p>

        <p className="mt-4 text-sm text-gray-500">
          Didn&apos;t see it? Be sure to check your spam folder.
        </p>
      </div>
    </div>
  );
}
