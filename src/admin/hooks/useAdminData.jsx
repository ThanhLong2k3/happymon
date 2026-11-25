import { useCallback, useEffect, useState } from "react";
import { Input } from "antd";
import * as dashboardApi from "../features/dashboard/api.js";
import * as postsApi from "../features/posts/api.js";
import * as productsApi from "../features/products/api.js";
import * as programsApi from "../features/programs/api.js";
import * as submissionsApi from "../features/submissions/api.js";
import * as teachersApi from "../features/teachers/api.js";
import * as testimonialsApi from "../features/testimonials/api.js";
import * as promotionsApi from "../features/promotions/api.js";
import { searchItems } from "../shared/adminUtils.js";

export default function useAdminData({
  activeMenu,
  setActiveMenu,
  token,
  adminFetch,
}) {
  const [stats, setStats] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [posts, setPosts] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [products, setProducts] = useState([]);
  const [promotions, setPromotions] = useState([]);
  const [searchTerms, setSearchTerms] = useState({});
  const [submissionStatusFilter, setSubmissionStatusFilter] = useState("all");
  const [submissionTypeFilter, setSubmissionTypeFilter] = useState("all");

  const fetchData = useCallback(async () => {
    if (!token) return;

    try {
      if (activeMenu === "dashboard") {
        const [statsResponse, submissionsResponse] = await Promise.all([
          dashboardApi.getStats(adminFetch, token),
          submissionsApi.listSubmissions(adminFetch, token),
        ]);
        if (statsResponse.ok) setStats(await statsResponse.json());
        if (submissionsResponse.ok) {
          setSubmissions(await submissionsResponse.json());
        }
        return;
      }

      const loaders = {
        submissions: submissionsApi.listSubmissions,
        contacts: submissionsApi.listSubmissions,
        teachers: teachersApi.listTeachers,
        programs: programsApi.listPrograms,
        posts: postsApi.listPosts,
        testimonials: testimonialsApi.listTestimonials,
        products: productsApi.listProducts,
        promotions: promotionsApi.listPromotions,
      };
      const setters = {
        submissions: setSubmissions,
        contacts: setSubmissions,
        teachers: setTeachers,
        programs: setPrograms,
        posts: setPosts,
        testimonials: setTestimonials,
        products: setProducts,
        promotions: setPromotions,
      };
      const load = loaders[activeMenu];
      if (!load) return;

      const response = await load(adminFetch, token);
      if (response.ok) setters[activeMenu](await response.json());
    } catch (error) {
      if (!error.sessionExpired) console.error("Fetch data error:", error);
    }
  }, [activeMenu, adminFetch, token]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const renderSearch = (key, placeholder) => (
    <Input.Search
      allowClear
      placeholder={placeholder}
      value={searchTerms[key] || ""}
      onChange={(event) =>
        setSearchTerms((previous) => ({
          ...previous,
          [key]: event.target.value,
        }))
      }
      style={{ maxWidth: 360, marginBottom: 16 }}
    />
  );

  const filteredSubmissions = searchItems(
    submissions.filter(
      (submission) =>
        (submissionStatusFilter === "all" ||
          submission.status === submissionStatusFilter) &&
        (submissionTypeFilter === "all" ||
          submission.submissionType === submissionTypeFilter)
    ),
    searchTerms.submissions,
    [
      "id",
      "name",
      "phone",
      "email",
      "parentAddress",
      "childName",
      "message",
      "status",
      "notes",
    ]
  );

  const filteredContacts = searchItems(
    submissions.filter((submission) => submission.submissionType === "contact"),
    searchTerms.contacts,
    ["id", "name", "phone", "email", "message", "status", "notes"]
  );

  const viewProps = {
    activeMenu,
    stats,
    submissions,
    setActiveMenu,
    renderSearch,
    submissionTypeFilter,
    setSubmissionTypeFilter,
    submissionStatusFilter,
    setSubmissionStatusFilter,
    filteredSubmissions,
    filteredContacts,
    filteredTeachers: searchItems(teachers, searchTerms.teachers, [
      "name",
      "slug",
      "roleTitle",
      "className",
    ]),
    filteredPrograms: searchItems(programs, searchTerms.programs, [
      "title",
      "slug",
      "category",
      "ageGroup",
      "shortDescription",
      "description",
    ]),
    filteredPosts: searchItems(posts, searchTerms.posts, [
      "title",
      "slug",
      "category",
      "excerpt",
      "body",
    ]),
    filteredTestimonials: searchItems(
      testimonials,
      searchTerms.testimonials,
      ["parentName", "childName", "relationship", "content", "slug"]
    ),
    filteredProducts: searchItems(products, searchTerms.products, [
      "name",
      "slug",
      "category",
      "sizes",
      "description",
    ]),
    filteredPromotions: searchItems(promotions, searchTerms.promotions, [
      "title",
      "tier1",
      "tier2",
      "tier3",
      "tier4",
      "tier5",
    ]),
  };

  return {
    stats,
    submissions,
    setSubmissions,
    teachers,
    setTeachers,
    programs,
    setPrograms,
    posts,
    setPosts,
    testimonials,
    setTestimonials,
    products,
    setProducts,
    promotions,
    setPromotions,
    fetchData,
    viewProps,
  };
}
