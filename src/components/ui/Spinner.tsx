"use client";

export default function LoadingSpinner() {
  return (
    // FIX: Add a full-screen, fixed-position wrapper to center the spinner by default.
    // This container acts as an overlay for full-page loading states.
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
      <style>{`
        /* The spinner's own styles remain unchanged, controlling only its internal appearance. */
        .spinner {
          width: 60px;
          height: 60px;
          position: relative;
        }
        
        .spinner::before,
        .spinner::after {
          content: "";
          width: 12px;
          height: 40px;
          background-color: #5b21b6; /* purple-800 */
          border-radius: 6px;
          position: absolute;
          animation: bounce-outer 1.2s infinite ease-in-out;
        }

        .spinner::before {
          left: 0;
          animation-delay: 0s;
        }
        
        .spinner::after {
          right: 0;
          animation-delay: 0.4s;
        }

        .spinner > div {
          width: 12px;
          height: 40px;
          background-color: #FFFFFF; /* White */
          border-radius: 6px;
          position: absolute;
          left: 50%;
          transform: translateX(-50%);
          animation: bounce-middle 1.2s infinite ease-in-out;
          animation-delay: 0.2s;
        }
        
        @keyframes bounce-outer {
          0%, 80%, 100% {
            transform: scaleY(0.4);
          }
          40% {
            transform: scaleY(1);
          }
        }
        
        @keyframes bounce-middle {
          0%, 80%, 100% {
            transform: translateX(-50%) scaleY(0.4);
          }
          40% {
            transform: translateX(-50%) scaleY(1);
          }
        }
      `}</style>

      <div className="spinner">
        <div />
      </div>
    </div>
  );
}
