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
      if (response.data?.code === 415)
        return rejectWithValue(response.data.message);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "بيانات الدخول غير صحيحة",
      );
    }
  },
);

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
          "حدث خطأ",
      );
    }
  },
);

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


export const loginTeacher = createAsyncThunk(
  "auth/loginTeacher",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await api.post("/teacher/login", {
        email: userData.email,
        password: userData.password,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "بيانات الدخول غير صحيحة",
      );
    }
  },
);

export const registerTeacher = createAsyncThunk(
  "auth/registerTeacher",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await api.post("/teacher/register", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.errors ||
          error.response?.data?.message ||
          "حدث خطأ",
      );
    }
  },
);

export const verifyTeacherOtp = createAsyncThunk(
  "auth/verifyTeacherOtp",
  async ({ email, token }, { rejectWithValue }) => {
    try {
      if (!email) return rejectWithValue("البريد الإلكتروني غير موجود");
      if (!token) return rejectWithValue("كود التحقق غير موجود");

      const form = new FormData();
      form.append("email", email);
      form.append("token", token);

      const response = await api.post("/teacher/verify-otp", form, {
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

export const resendTeacherOtp = createAsyncThunk(
  "auth/resendTeacherOtp",
  async (email, { rejectWithValue }) => {
    try {
      if (!email) return rejectWithValue("البريد الإلكتروني غير موجود");

      const form = new FormData();
      form.append("email", email);

      const response = await api.post("/teacher/resend-otp", form, {
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

export const teacherForgotPassword = createAsyncThunk(
  "auth/teacherForgotPassword",
  async (email, { rejectWithValue }) => {
    try {
      const form = new FormData();
      form.append("email", email);

      const response = await api.post("/teacher/forgot/password", form, {
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

export const teacherForgotVerifyOtp = createAsyncThunk(
  "auth/teacherForgotVerifyOtp",
  async ({ email, token }, { rejectWithValue }) => {
    try {
      const form = new FormData();
      form.append("email", email);
      form.append("token", token);
      const response = await api.post("/teacher/forgot/verify-otp", form, {
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

export const teacherForgotResendOtp = createAsyncThunk(
  "auth/teacherForgotResendOtp",
  async (email, { rejectWithValue }) => {
    try {
      const form = new FormData();
      form.append("email", email);
      const response = await api.post("/teacher/forgot/resend-otp", form, {
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

export const teacherResetPassword = createAsyncThunk(
  "auth/teacherResetPassword",
  async ({ email, password, password_confirmation }, { rejectWithValue }) => {
    try {
      const form = new FormData();
      form.append("email", email);
      form.append("password", password);
      form.append("password_confirmation", password_confirmation);
      const response = await api.post("/teacher/forgot/reset-password", form, {
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

const getTeacherApprovalStatus = (teacher) => {
  if (!teacher) return "approved"; 
  const raw = teacher.status ?? teacher.approval_status ?? teacher.is_approved;

  if (raw === undefined || raw === null) return "approved";
  if (raw === true || raw === 1 || raw === "1") return "approved";
  if (raw === false || raw === 0 || raw === "0") return "pending";

  return String(raw).toLowerCase();
};

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: JSON.parse(localStorage.getItem("user")) || null,
    token: localStorage.getItem("token") || null,
    role: localStorage.getItem("role") || null, 
    isAuthenticated: !!localStorage.getItem("token"),
    loading: false,
    error: null,

    registerSuccess: false,
    otpVerified: false,
    otpResent: false,
    otpLoading: false,
    forgotOtpSent: false,
    forgotOtpVerified: false,
    forgotOtpResent: false,
    passwordReset: false,

    teacherRegisterSuccess: false,
    teacherOtpVerified: false,
    teacherOtpResent: false,
    teacherForgotOtpSent: false,
    teacherForgotOtpVerified: false,
    teacherForgotOtpResent: false,
    teacherPasswordReset: false,
    teacherApprovalStatus: null,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.role = null;
      state.isAuthenticated = false;
      state.teacherApprovalStatus = null;
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("role");
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    clearRegisterSuccess: (state) => {
      state.registerSuccess = false;
      state.teacherRegisterSuccess = false;
    },
    clearOtpState: (state) => {
      state.otpVerified = false;
      state.otpResent = false;
      state.teacherOtpVerified = false;
      state.teacherOtpResent = false;
      state.error = null;
    },
    clearForgotState: (state) => {
      state.forgotOtpSent = false;
      state.forgotOtpVerified = false;
      state.forgotOtpResent = false;
      state.passwordReset = false;
      state.teacherForgotOtpSent = false;
      state.teacherForgotOtpVerified = false;
      state.teacherForgotOtpResent = false;
      state.teacherPasswordReset = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.data.user;
        state.token = action.payload.data.token;
        state.role = "student";
        localStorage.setItem("token", state.token);
        localStorage.setItem("user", JSON.stringify(state.user));
        localStorage.setItem("role", "student");
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

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
          state.role = "student";
          localStorage.setItem("token", token);
          localStorage.setItem("user", JSON.stringify(state.user));
          localStorage.setItem("role", "student");
        }
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.registerSuccess = false;
        state.error = action.payload;
      })

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
          state.role = "student";
          localStorage.setItem("token", userToken);
          localStorage.setItem("user", JSON.stringify(userData));
          localStorage.setItem("role", "student");
        }
      })
      .addCase(verifyOtp.rejected, (state, action) => {
        state.otpLoading = false;
        state.otpVerified = false;
        state.error = action.payload;
      })

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
      })

      .addCase(loginTeacher.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginTeacher.fulfilled, (state, action) => {
        state.loading = false;
        const teacher = action.payload.data?.teacher;
        const token = action.payload.data?.token;
        const approval = getTeacherApprovalStatus(teacher);
        state.teacherApprovalStatus = approval;

        if (approval !== "approved") {
          state.isAuthenticated = false;
          state.error =
            approval === "rejected"
              ? "تم رفض طلب انضمامك كمعلم. تواصل مع الإدارة لمزيد من التفاصيل."
              : "حسابك قيد المراجعة من الإدارة، سيتم تفعيله بعد الموافقة عليه.";
          return;
        }

        state.isAuthenticated = true;
        state.user = teacher;
        state.token = token;
        state.role = "teacher";
        localStorage.setItem("token", state.token);
        localStorage.setItem("user", JSON.stringify(state.user));
        localStorage.setItem("role", "teacher");
      })
      .addCase(loginTeacher.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(registerTeacher.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.teacherRegisterSuccess = false;
      })
      .addCase(registerTeacher.fulfilled, (state) => {
        state.loading = false;
        state.teacherRegisterSuccess = true;
      })
      .addCase(registerTeacher.rejected, (state, action) => {
        state.loading = false;
        state.teacherRegisterSuccess = false;
        state.error = action.payload;
      })

      .addCase(verifyTeacherOtp.pending, (state) => {
        state.otpLoading = true;
        state.error = null;
        state.teacherOtpVerified = false;
      })
      .addCase(verifyTeacherOtp.fulfilled, (state) => {
        state.otpLoading = false;
        state.teacherOtpVerified = true;
      })
      .addCase(verifyTeacherOtp.rejected, (state, action) => {
        state.otpLoading = false;
        state.teacherOtpVerified = false;
        state.error = action.payload;
      })

      .addCase(resendTeacherOtp.pending, (state) => {
        state.otpLoading = true;
        state.error = null;
        state.teacherOtpResent = false;
      })
      .addCase(resendTeacherOtp.fulfilled, (state) => {
        state.otpLoading = false;
        state.teacherOtpResent = true;
      })
      .addCase(resendTeacherOtp.rejected, (state, action) => {
        state.otpLoading = false;
        state.teacherOtpResent = false;
        state.error = action.payload;
      })

      .addCase(teacherForgotPassword.pending, (state) => {
        state.otpLoading = true;
        state.error = null;
        state.teacherForgotOtpSent = false;
      })
      .addCase(teacherForgotPassword.fulfilled, (state) => {
        state.otpLoading = false;
        state.teacherForgotOtpSent = true;
      })
      .addCase(teacherForgotPassword.rejected, (state, action) => {
        state.otpLoading = false;
        state.error = action.payload;
      })

      .addCase(teacherForgotVerifyOtp.pending, (state) => {
        state.otpLoading = true;
        state.error = null;
        state.teacherForgotOtpVerified = false;
      })
      .addCase(teacherForgotVerifyOtp.fulfilled, (state) => {
        state.otpLoading = false;
        state.teacherForgotOtpVerified = true;
      })
      .addCase(teacherForgotVerifyOtp.rejected, (state, action) => {
        state.otpLoading = false;
        state.teacherForgotOtpVerified = false;
        state.error = action.payload;
      })

      .addCase(teacherForgotResendOtp.pending, (state) => {
        state.otpLoading = true;
        state.error = null;
        state.teacherForgotOtpResent = false;
      })
      .addCase(teacherForgotResendOtp.fulfilled, (state) => {
        state.otpLoading = false;
        state.teacherForgotOtpResent = true;
      })
      .addCase(teacherForgotResendOtp.rejected, (state, action) => {
        state.otpLoading = false;
        state.error = action.payload;
      })

      .addCase(teacherResetPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.teacherPasswordReset = false;
      })
      .addCase(teacherResetPassword.fulfilled, (state) => {
        state.loading = false;
        state.teacherPasswordReset = true;
      })
      .addCase(teacherResetPassword.rejected, (state, action) => {
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
} = authSlice.actions;

export default authSlice.reducer;
