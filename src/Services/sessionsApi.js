const BASE_URL =
  process.env.REACT_APP_API_URL || "https://dashboard.muslim-academy.net";

const getAuthHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
});

const handleResponse = async (res) => {
  const json = await res.json();
  if (!res.ok || json.code !== 200) {
    throw new Error(json.message || "حدث خطأ ما");
  }
  return json;
};

export const fetchUpcomingSessions = async (page = 1) => {
  const res = await fetch(
    `${BASE_URL}/api/teacher/sessions/upcoming?page=${page}`,
    { headers: getAuthHeaders() },
  );
  return handleResponse(res);
};

export const fetchScheduledSessions = async (page = 1) => {
  const res = await fetch(
    `${BASE_URL}/api/teacher/sessions/scheduled?page=${page}`,
    { headers: getAuthHeaders() },
  );
  return handleResponse(res);
};

export const fetchEndedSessions = async (page = 1) => {
  const res = await fetch(`${BASE_URL}/api/teacher/sessions/ended?page=${page}`, {
    headers: getAuthHeaders(),
  });
  return handleResponse(res);
};

export const fetchCancelledSessions = async (page = 1) => {
  const res = await fetch(
    `${BASE_URL}/api/teacher/sessions/cancelled?page=${page}`,
    { headers: getAuthHeaders() },
  );
  return handleResponse(res);
};

export const fetchSession = async (slug) => {
  const res = await fetch(`${BASE_URL}/api/teacher/sessions/${slug}`, {
    headers: getAuthHeaders(),
  });
  return handleResponse(res);
};

export const startSession = async (slug) => {
  const res = await fetch(`${BASE_URL}/api/teacher/sessions/${slug}/start`, {
    method: "POST",
    headers: getAuthHeaders(),
  });
  return handleResponse(res);
};

export const endSession = async (slug) => {
  const res = await fetch(`${BASE_URL}/api/teacher/sessions/${slug}/end`, {
    method: "POST",
    headers: getAuthHeaders(),
  });
  return handleResponse(res);
};
