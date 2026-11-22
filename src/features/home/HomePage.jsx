import HomeBannerCarousel from "./components/HomeBannerCarousel.jsx";
import EducationValuesSection from "./sections/EducationValuesSection.jsx";
import SchoolIntroductionSection from "./sections/SchoolIntroductionSection.jsx";
import TeachersSection from "./sections/TeachersSection.jsx";
import TestimonialsSection from "./sections/TestimonialsSection.jsx";
import EventsSection from "./sections/EventsSection.jsx";
import EventCountdown from "./components/EventCountdown.jsx";
import EnrollmentBanner from "./sections/EnrollmentBanner.jsx";
import PostsSection from "./sections/PostsSection.jsx";

export default function HomePage({
  teachers = [],
  testimonials = [],
  events = [],
  posts = [],
}) {
  return (
    <>
      <HomeBannerCarousel />
      <EducationValuesSection />
      <SchoolIntroductionSection />
      <TeachersSection teachers={teachers} />
      <TestimonialsSection testimonials={testimonials} />
      <EventsSection events={events} />
      <EventCountdown />
      <EnrollmentBanner />
      <PostsSection posts={posts} />
    </>
  );
}
