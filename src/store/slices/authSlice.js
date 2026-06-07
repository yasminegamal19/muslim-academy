import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import i18n from "../../i18n/i18n";

const BASE_URL = "https://muslim-academy.betamoneta.com/api";

export const api = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use(
  (config) => {
    const currentLanguage = i18n.language || "en";
    config.headers["Accept-Language"] = currentLanguage;

    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await api.post("/login", {
        email: userData.email,
        password: userData.password,
      });
      if (response.data?.code === 415) {
        return rejectWithValue(response.data.message);
      }
      return response.data;
    } catch (error) {
      const validationError = error.response?.data?.data?.email?.[0];
      const generalMessage = error.response?.data?.message;
      return rejectWithValue(
        validationError || generalMessage || "بيانات الدخول غير صحيحة",
      );
    }
  },
);

// ── Register ──
export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await api.post("/register", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.errors ||
          error.response?.data?.message ||
          "حدث خطأ أثناء إنشاء الحساب",
      );
    }
  },
);

// ── Verify OTP ──
export const verifyOtp = createAsyncThunk(
  "auth/verifyOtp",
  async ({ email, token }, { rejectWithValue }) => {
    try {
      if (!email) return rejectWithValue("البريد الإلكتروني غير موجود");
      if (!token) return rejectWithValue("كود التحقق غير موجود");

      const form = new FormData();
      form.append("email", email);
      form.append("token", token);

      const response = await api.post("/verify-otp", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "كود التحقق غير صحيح",
      );
    }
  },
);

// ── Resend OTP ──
export const resendOtp = createAsyncThunk(
  "auth/resendOtp",
  async (email, { rejectWithValue }) => {
    try {
      if (!email) return rejectWithValue("البريد الإلكتروني غير موجود");

      const form = new FormData();
      form.append("email", email);

      const response = await api.post("/resend-otp", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "فشل إعادة الإرسال",
      );
    }
  },
);

// ── Forgot Password ──
export const forgotPassword = createAsyncThunk(
  "auth/forgotPassword",
  async (email, { rejectWithValue }) => {
    try {
      const form = new FormData();
      form.append("email", email);

      const response = await api.post("/forgot/password", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "البريد الإلكتروني غير مسجل",
      );
    }
  },
);

// ── Forgot Verify OTP ──
export const forgotVerifyOtp = createAsyncThunk(
  "auth/forgotVerifyOtp",
  async ({ email, token }, { rejectWithValue }) => {
    try {
      const form = new FormData();
      form.append("email", email);
      form.append("token", token);
      const response = await api.post("/forgot/verify-otp", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "كود التحقق غير صحيح",
      );
    }
  },
);

// ── Forgot Resend OTP ──
export const forgotResendOtp = createAsyncThunk(
  "auth/forgotResendOtp",
  async (email, { rejectWithValue }) => {
    try {
      const form = new FormData();
      form.append("email", email);
      const response = await api.post("/forgot/resend-otp", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "فشل إعادة الإرسال",
      );
    }
  },
);

// ── Reset Password ──
export const resetPassword = createAsyncThunk(
  "auth/resetPassword",
  async ({ email, password, password_confirmation }, { rejectWithValue }) => {
    try {
      const form = new FormData();
      form.append("email", email);
      form.append("password", password);
      form.append("password_confirmation", password_confirmation);
      const response = await api.post("/forgot/reset-password", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "فشل تغيير كلمة المرور",
      );
    }
  },
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: JSON.parse(localStorage.getItem("user")) || null,
    token: localStorage.getItem("token") || null,
    isAuthenticated: !!localStorage.getItem("token"),
    loading: false,
    googleLoading: false,
    error: null,
    registerSuccess: false,
    otpVerified: false,
    otpResent: false,
    otpLoading: false,
    forgotOtpSent: false,
    forgotOtpVerified: false,
    forgotOtpResent: false,
    passwordReset: false,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      state.error = null;
    },
    updateUserProfile: (state, action) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
        localStorage.setItem("user", JSON.stringify(state.user));
      }
    },
    clearError: (state) => {
      state.error = null;
    },
    clearRegisterSuccess: (state) => {
      state.registerSuccess = false;
    },
    clearOtpState: (state) => {
      state.otpVerified = false;
      state.otpResent = false;
      state.error = null;
    },
    clearForgotState: (state) => {
      state.forgotOtpSent = false;
      state.forgotOtpVerified = false;
      state.forgotOtpResent = false;
      state.passwordReset = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // ── Login ──
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.data.user;
        state.token = action.payload.data.token;
        if (state.token) localStorage.setItem("token", state.token);
        localStorage.setItem("user", JSON.stringify(state.user));
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ── Register ──
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.registerSuccess = false;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.registerSuccess = true;
        const token = action.payload.data?.token;
        if (token) {
          state.token = token;
          state.isAuthenticated = true;
          state.user = action.payload.data.user || action.payload.data;
          localStorage.setItem("token", token);
          localStorage.setItem("user", JSON.stringify(state.user));
        }
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.registerSuccess = false;
        state.error = action.payload;
      })

      // ── Verify OTP ──
      .addCase(verifyOtp.pending, (state) => {
        state.otpLoading = true;
        state.error = null;
        state.otpVerified = false;
      })
      .addCase(verifyOtp.fulfilled, (state, action) => {
        state.otpLoading = false;
        state.otpVerified = true;
        const userData = action.payload.data?.user;
        const userToken = action.payload.data?.token;
        if (userToken) {
          state.isAuthenticated = true;
          state.user = userData;
          state.token = userToken;
          localStorage.setItem("token", userToken);
          localStorage.setItem("user", JSON.stringify(userData));
        }
      })
      .addCase(verifyOtp.rejected, (state, action) => {
        state.otpLoading = false;
        state.otpVerified = false;
        state.error = action.payload;
      })

      // ── Resend OTP ──
      .addCase(resendOtp.pending, (state) => {
        state.otpLoading = true;
        state.error = null;
        state.otpResent = false;
      })
      .addCase(resendOtp.fulfilled, (state) => {
        state.otpLoading = false;
        state.otpResent = true;
      })
      .addCase(resendOtp.rejected, (state, action) => {
        state.otpLoading = false;
        state.otpResent = false;
        state.error = action.payload;
      })

      // ── Forgot Password ──
      .addCase(forgotPassword.pending, (state) => {
        state.otpLoading = true;
        state.error = null;
        state.forgotOtpSent = false;
      })
      .addCase(forgotPassword.fulfilled, (state) => {
        state.otpLoading = false;
        state.forgotOtpSent = true;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.otpLoading = false;
        state.error = action.payload;
      })

      // ── Forgot Verify OTP ──
      .addCase(forgotVerifyOtp.pending, (state) => {
        state.otpLoading = true;
        state.error = null;
        state.forgotOtpVerified = false;
      })
      .addCase(forgotVerifyOtp.fulfilled, (state) => {
        state.otpLoading = false;
        state.forgotOtpVerified = true;
      })
      .addCase(forgotVerifyOtp.rejected, (state, action) => {
        state.otpLoading = false;
        state.forgotOtpVerified = false;
        state.error = action.payload;
      })

      // ── Forgot Resend OTP ──
      .addCase(forgotResendOtp.pending, (state) => {
        state.otpLoading = true;
        state.error = null;
        state.forgotOtpResent = false;
      })
      .addCase(forgotResendOtp.fulfilled, (state) => {
        state.otpLoading = false;
        state.forgotOtpResent = true;
      })
      .addCase(forgotResendOtp.rejected, (state, action) => {
        state.otpLoading = false;
        state.error = action.payload;
      })

      // ── Reset Password ──
      .addCase(resetPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.passwordReset = false;
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.loading = false;
        state.passwordReset = true;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  logout,
  clearError,
  clearRegisterSuccess,
  clearOtpState,
  clearForgotState,
  updateUserProfile,
} = authSlice.actions;

export default authSlice.reducer;
