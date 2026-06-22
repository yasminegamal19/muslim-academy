import { useState, useRef, useEffect } from "react";
import styles from "./Otp.module.css";
import { Shield, Clock, RefreshCw } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  verifyTeacherOtp,
  resendTeacherOtp,
  clearOtpState,
  clearError,
} from "../../../../store/slices/authSlice";
import { toast } from "react-toastify";

const RESEND_SECONDS = 60;
const OTP_LENGTH = 5;

export default function TeacherVerifyOtp() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const email = location.state?.email || "";

  const { otpLoading, teacherOtpVerified, teacherOtpResent, error } =
    useSelector((s) => s.auth);

  const [otp, setOtp] = useState(Array(OTP_LENGTH).fill(""));
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
      toast.error("حدث خطأ، من فضلك حاول مرة أخرى");
      navigate("/teacher/register");
      return;
    }
    startTimer();
    return () => clearInterval(timerRef.current);
  }, [email, navigate]);

  useEffect(() => {
    if (!teacherOtpVerified) return;
    dispatch(clearOtpState());
    navigate("/teacher/pending-approval");
  }, [teacherOtpVerified, dispatch, navigate]);

  useEffect(() => {
    if (!teacherOtpResent) return;
    dispatch(clearOtpState());
    startTimer();
    setOtp(Array(OTP_LENGTH).fill(""));
    setSubmitted(false);
    inputsRef.current[0]?.focus();
    toast.success("تم إعادة إرسال الكود بنجاح", {
      autoClose: 2000,
      position: "top-center",
    });
  }, [teacherOtpResent, dispatch]);

  useEffect(() => {
    if (!error) return;
    setSubmitted(false);
    toast.error(typeof error === "string" ? error : "كود التحقق غير صحيح", {
      position: "top-center",
    });
    dispatch(clearError());
  }, [error, dispatch]);

  const handleChange = (value, index) => {
    if (!/^[0-9]?$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < OTP_LENGTH - 1) inputsRef.current[index + 1]?.focus();
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
      .slice(0, OTP_LENGTH);
    if (!pasted) return;
    const newOtp = Array(OTP_LENGTH).fill("");
    pasted.split("").forEach((ch, i) => {
      newOtp[i] = ch;
    });
    setOtp(newOtp);
    inputsRef.current[Math.min(pasted.length, OTP_LENGTH - 1)]?.focus();
  };

  const handleSubmit = () => {
    const token = otp.join("");
    if (token.length < OTP_LENGTH || submitted || otpLoading) return;
    if (canResend) {
      toast.error("انتهى الوقت، يرجى إعادة إرسال الكود");
      return;
    }
    setSubmitted(true);
    dispatch(verifyTeacherOtp({ email, token }));
  };

  const handleResend = () => {
    if (!canResend || otpLoading) return;
    if (!email) {
      toast.error("البريد الإلكتروني غير موجود، من فضلك ارجع وحاول مرة أخرى");
      return;
    }
    dispatch(resendTeacherOtp(email));
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
          <h2 className={styles.title}>تفعيل حساب المعلم</h2>
          <p className={styles.desc}>
            تم إرسال كود التحقق إلى البريد الإلكتروني
            {email && <span className={styles.emailHighlight}> {email}</span>}
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
                ? "انتهى الوقت"
                : `الوقت المتبقي ${formatTime(seconds)}`}
            </span>
          </div>

          <button
            type="button"
            className={styles.button}
            onClick={handleSubmit}
            disabled={!otpComplete || otpLoading || submitted || canResend}
          >
            {otpLoading ? "جاري التحقق..." : "تحقق"}
          </button>

          <p className={styles.resend}>
            لم تستلم الكود؟{" "}
            <button
              className={`${styles.resendBtn} ${
                canResend ? styles.resendActive : styles.resendDisabled
              }`}
              onClick={handleResend}
              disabled={otpLoading}
              type="button"
            >
              <RefreshCw size={13} className={otpLoading ? styles.spin : ""} />
              إعادة الإرسال
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
