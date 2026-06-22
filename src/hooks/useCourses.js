
import { useState, useEffect } from "react";

const BASE_URL = "https://muslim-academy.betamoneta.com/api";

function detectType(categoryName = "") {
  const lower = categoryName.toLowerCase();
  if (
    lower.includes("child") ||
    lower.includes("kid") ||
    lower.includes("أطفال") ||
    lower.includes("ناشئ")
  ) {
    return "kids";
  }
  return "adults";
}

function mapCourse(apiCourse) {
  return {
    id: apiCourse.id,
    slug: apiCourse.slug, 
    title: apiCourse.name,
    name: apiCourse.name, 
    subtitle: apiCourse.description,
    description: apiCourse.description,
    image: apiCourse.image,
    category: apiCourse.category?.name || apiCourse.subject?.name || "",
    categorySlug: apiCourse.category?.slug || "",
    subject: apiCourse.subject?.name || "",
    subjectSlug: apiCourse.subject?.slug || "",
    rating: apiCourse.average_rating ?? 0,
    students: apiCourse.total_reviews ?? 0,
    badge: null,
    instructor: "",
    instructorImage: "",
    duration: "",
    level: "",
    type: detectType(apiCourse.category?.name || ""),
    whatYouLearn: apiCourse.what_you_learn || [],
    features: apiCourse.features || [],
    curriculum: apiCourse.curriculum || [],
    reviews: apiCourse.reviews || [],
  };
}

export function useCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchCats() {
      try {
        const res = await fetch(`${BASE_URL}/categories`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        setCategories(json.data || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchCats();
  }, []);

  return { categories, loading, error };
}

export function useCourses({ categorySlug, subjectSlug, page = 1 } = {}) {
  const [data, setData] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchCourses() {
      setLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams();
        if (categorySlug) params.set("filter_by[category]", categorySlug);
        if (subjectSlug) params.set("filter_by[subject]", subjectSlug);
        if (page > 1) params.set("page", page);

        const url = `${BASE_URL}/courses${params.toString() ? "?" + params.toString() : ""}`;
        const res = await fetch(url, { signal: controller.signal });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const json = await res.json();
        const courses = (json.data || []).map(mapCourse);
        setData(courses);
        setPagination(json.pagination || null);
      } catch (err) {
        if (err.name !== "AbortError") setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchCourses();
    return () => controller.abort();
  }, [categorySlug, subjectSlug, page]);

  return { data, pagination, loading, error };
}

export function useCoursesGrouped() {
  const { data: all, loading, error } = useCourses();

  const kids = all.filter((c) => c.type === "kids");
  const adults = all.filter((c) => c.type === "adults");

  return { kids, adults, loading, error };
}

export function useCourseDetail(slug) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!slug) return;
    const controller = new AbortController();

    async function fetchDetail() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${BASE_URL}/courses/${slug}`, {
          signal: controller.signal,
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        const raw = json.data ?? json;
        setData(mapCourse(raw));
      } catch (err) {
        if (err.name !== "AbortError") setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchDetail();
    return () => controller.abort();
  }, [slug]);

  return { data, loading, error };
}
