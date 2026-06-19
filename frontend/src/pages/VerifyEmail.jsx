import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api"

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700&family=Inter:wght@400;500&display=swap');

  .verify-wrapper {
    min-height: 100vh;
    background: #0d0d0f;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'Inter', sans-serif;
    padding: 24px;
  }

  .verify-card {
    background: #141418;
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 20px;
    padding: 40px 32px 36px;
    width: 100%;
    max-width: 380px;
    text-align: center;
    position: relative;
    overflow: hidden;
    animation: fadeUp 0.5s ease both;
  }

  .verify-card::before {
    content: '';
    position: absolute;
    top: -60px;
    left: 50%;
    transform: translateX(-50%);
    width: 260px;
    height: 160px;
    background: radial-gradient(ellipse, rgba(120, 60, 220, 0.25) 0%, transparent 70%);
    pointer-events: none;
  }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .icon-wrap {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 72px;
    height: 72px;
    border-radius: 18px;
    background: linear-gradient(145deg, #1e1a2e, #261d3d);
    border: 1px solid rgba(130, 80, 230, 0.3);
    margin-bottom: 24px;
    position: relative;
    box-shadow: 0 0 30px rgba(100, 50, 200, 0.2);
  }

  .icon-wrap svg {
    width: 34px;
    height: 34px;
    color: #a87dff;
  }

  .status-dot {
    position: absolute;
    top: 6px;
    right: 6px;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: #22c55e;
    border: 2px solid #141418;
  }

  .status-dot.loading {
    background: #f59e0b;
    animation: pulse 1.2s ease infinite;
  }

  .status-dot.error {
    background: #ef4444;
  }

  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.4; }
  }

  .verify-title {
    font-family: 'Sora', sans-serif;
    font-size: 22px;
    font-weight: 700;
    color: #ffffff;
    margin: 0 0 14px;
    letter-spacing: -0.3px;
  }

  .verify-message {
    font-size: 14px;
    color: #9a94a8;
    margin: 0;
    line-height: 1.6;
    min-height: 44px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 8px;
  }

  .verify-message.success {
    color: #a3e4a3;
  }

  .verify-message.error {
    color: #f87171;
  }

  .redirect-note {
    margin-top: 20px;
    font-size: 12px;
    color: #55515f;
  }

  .redirect-note span {
    color: #8b5cf6;
  }

  .divider {
    height: 1px;
    background: rgba(255,255,255,0.06);
    margin: 24px 0;
  }

  .back-link {
    font-size: 13px;
    color: #55515f;
    text-decoration: none;
    cursor: pointer;
    transition: color 0.2s;
    background: none;
    border: none;
    padding: 0;
  }

  .back-link:hover {
    color: #9d8ec7;
  }

  .spinner {
    display: inline-block;
    width: 18px;
    height: 18px;
    border: 2px solid rgba(168, 125, 255, 0.2);
    border-top-color: #a87dff;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
    margin-right: 8px;
    vertical-align: middle;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

const VerifyEmail = () => {
    const { token } = useParams();
    const navigate = useNavigate();

    const [message, setMessage] = useState("Verifying email...");
    const [status, setStatus] = useState("loading"); // loading | success | error

    useEffect(() => {
        const verifyUserEmail = async () => {
            try {
                const response = await api.get(
                    `/auth/verify-email/${token}`
                );
                setMessage(response.data.message);
                setStatus("success");
                setTimeout(() => { navigate("/login"); }, 3000);
            } catch (error) {
                setMessage(error.response?.data?.message || "Verification failed");
                setStatus("error");
            }
        };

        verifyUserEmail();
    }, [token, navigate]);

    const dotClass = `status-dot ${status === "loading" ? "loading" : status === "error" ? "error" : ""}`;
    const msgClass = `verify-message ${status === "success" ? "success" : status === "error" ? "error" : ""}`;

    return (
        <>
            <style>{styles}</style>
            <div className="verify-wrapper">
                <div className="verify-card">
                    <div className="icon-wrap">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="2" y="4" width="20" height="16" rx="3"/>
                            <path d="M2 7l10 7 10-7"/>
                        </svg>
                        <span className={dotClass} />
                    </div>

                    <h1 className="verify-title">Email Verification</h1>

                    <p className={msgClass}>
                        {status === "loading" && <span className="spinner" />}
                        {message}
                    </p>

                    {status === "success" && (
                        <p className="redirect-note">
                            Redirecting to <span>sign in</span> shortly…
                        </p>
                    )}

                    <div className="divider" />

                    <button className="back-link" onClick={() => navigate("/login")}>
                        ← Back to register
                    </button>
                </div>
            </div>
        </>
    );
};

export default VerifyEmail;