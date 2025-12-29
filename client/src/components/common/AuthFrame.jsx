import Image from "next/image";
import blackLogo from "../../../public/Black logo (1).png";
import { useRouter } from "next/router";

export default function AuthFrame({ children, showBack = true }) {
  const router = useRouter();
  return (
    <div className="no-scroll-page">
      <div className="card">
        {/* Header */}
        <div className="card-header">
          <div className="header-left">
            <div className="navbar-logo">
              <Image src={blackLogo} alt="Study Pilot Logo" height={25} />
            </div>

           {showBack && (
  <button
    className="back-btn"
    onClick={() => router.back()}
  >
    ←
  </button>
)}

          </div>
        </div>

        {/* Page-specific content */}
        <div className="card-content">
          {children}
        </div>
      </div>
    </div>
  );
}
