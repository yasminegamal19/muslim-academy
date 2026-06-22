import { useState, useRef, useEffect } from "react";
import styles from "./Otp.module.css";
import { Shield, Clock, RefreshCw } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  forgotVerifyOtp,
  forgotResendOtp,
  clearForgotState,
  clearError,
} from "../../../store/slices/authSlice";
import { toast } from "react-toastify";

const RESEND_SECONDS = 60;

export default function VerifyPasswordOtp() {
  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email || "";

  const dispatch = useDispatch();
  const { t } = useTranslation();

  const { otpLoading, forgotOtpVerified, forgotOtpResent, error } = useSelector(
    (s) => s.auth,
  );

  const [otp, setOtp] = useState(["", "", "", "", ""]);
  const inputsRef = useRef([]);
  const [seconds, setSeconds] = useState(RESEND_SECONDS);
  const [canResend, setCanResend] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const timerRef = useRef(null);

  const startTimer = () => {
    setSeconds(RESEND_SECONDS);
    setCanResend(false);
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  useEffect(() => {
    if (!email) {
      navigate("/forgot-password");
      return;
    }
    startTimer();
    return () => clearInterval(timerRef.current);
  }, [email, navigate]);

  useEffect(() => {
    if (!forgotOtpVerified) return;
    dispatch(clearForgotState());
    navigate("/reset-password", { state: { email } });
  }, [forgotOtpVerified, dispatch, navigate, email]);

  useEffect(() => {
    if (!forgotOtpResent) return;
    dispatch(clearForgotState());
    startTimer();
    toast.success(t("otpRe.resentSuccess") || "تم إعادة إرسال الكود!", {
      autoClose: 2000,
      position: "top-center",
    });
  }, [forgotOtpResent, dispatch, t]);

  useEffect(() => {
    if (!error) return;
    setSubmitted(false);
    toast.error(
      `${typeof error === "string" ? error : t("otpRe.invalidCode") || "كود التحقق غير صحيح"}`,
      { position: "top-center" },
    );
    dispatch(clearError());
  }, [error, dispatch, t]);

  const handleChange = (value, index) => {
    if (!/^[0-9]?$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 4) inputsRef.current[index + 1]?.focus();
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0)
      inputsRef.current[index - 1]?.focus();
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 5);
    if (!pasted) return;
    const newOtp = [...otp];
    pasted.split("").forEach((ch, i) => {
      newOtp[i] = ch;
    });
    setOtp(newOtp);
    inputsRef.current[Math.min(pasted.length - 1, 4)]?.focus();
  };

  const handleSubmit = () => {
    const token = otp.join("");
    if (token.length < 5 || submitted) return;
    setSubmitted(true);
    dispatch(forgotVerifyOtp({ email, token }));
  };

  const handleResend = () => {
    if (!canResend || otpLoading) return;
    setOtp(["", "", "", "", ""]);
    setSubmitted(false);
    inputsRef.current[0]?.focus();
    dispatch(forgotResendOtp(email));
  };

  const formatTime = (s) => {
    const m = Math.floor(s / 60)
      .toString()
      .padStart(2, "0");
    const sec = (s % 60).toString().padStart(2, "0");
    return `${m}:${sec}`;
  };

  const otpComplete = otp.every((d) => d !== "");

  return (
    <div className={styles.otp}>
      <div className={styles.container}>
        <div className={styles.card}>
          <div className={styles.iconBox}>
            <Shield size={34} />
          </div>

          <h2 className={styles.title}>
            {t("otpRe.title") || "التحقق من الهوية"}
          </h2>

          <p className={styles.desc}>
            {t("otpRe.desc") || "أدخل كود التحقق المرسل إلى بريدك:"}
            <br />
            {email && (
              <span className={styles.emailHighlight} dir="ltr">
                {" "}
                {email}
              </span>
            )}
          </p>

          <div className={styles.otpBox} onPaste={handlePaste}>
            {otp.map((digit, i) => (
              <input
                key={i}
                ref={(el) => (inputsRef.current[i] = el)}
                value={digit}
                maxLength="1"
                inputMode="numeric"
                onChange={(e) => handleChange(e.target.value, i)}
                onKeyDown={(e) => handleKeyDown(e, i)}
                className={`${styles.otpInput} ${digit ? styles.otpFilled : ""}`}
              />
            ))}
          </div>

          <div className={styles.timer}>
            <Clock size={15} />
            <span>
              {canResend
                ? t("otpRe.timerExpired") || "انتهى الوقت"
                : `${t("otpRe.timer") || "الوقت المتبقي"} ${formatTime(seconds)}`}
            </span>
          </div>

          <button
            className={styles.button}
            onClick={handleSubmit}
            disabled={!otpComplete || otpLoading || submitted}
          >
            {otpLoading
              ? t("otpRe.loading") || " جاري التحقق..."
              : t("otpRe.button") || "تحقق"}
          </button>

          <p className={styles.resend}>
            {t("otpRe.resendText") || "لم تستلم الكود؟"}{" "}
            <button
              className={`${styles.resendBtn} ${canResend && !otpLoading ? styles.resendActive : styles.resendDisabled}`}
              onClick={handleResend}
              disabled={!canResend || otpLoading}
              type="button"
            >
              <RefreshCw size={13} />
              {t("otpRe.resend") || "إعادة الإرسال"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
