import express from "express";

export function createDashboardRouter({ database, adminAuthMiddleware }) {
  const router = express.Router();

  // 4. Thống kê tổng quan Dashboard (Stats)
  router.get("/", adminAuthMiddleware, async (_request, response, next) => {
    try {
      const [[{ totalTeachers }]] = await database.query("SELECT COUNT(*) AS totalTeachers FROM teachers");
      const [[{ totalPrograms }]] = await database.query("SELECT COUNT(*) AS totalPrograms FROM programs");
      const [[{ totalTestimonials }]] = await database.query("SELECT COUNT(*) AS totalTestimonials FROM testimonials");
      const [[{ totalEvents }]] = await database.query("SELECT COUNT(*) AS totalEvents FROM events");
      const [[{ totalPosts }]] = await database.query("SELECT COUNT(*) AS totalPosts FROM posts");
      const [[{ totalSubmissions }]] = await database.query("SELECT COUNT(*) AS totalSubmissions FROM contact_submissions");
      const [[{ newSubmissions }]] = await database.query("SELECT COUNT(*) AS newSubmissions FROM contact_submissions WHERE status = 'new'");
  
      response.json({
        totalTeachers,
        totalPrograms,
        totalTestimonials,
        totalEvents,
        totalPosts,
        totalSubmissions,
        newSubmissions,
      });
    } catch (error) {
      next(error);
    }
  });

  return router;
}
