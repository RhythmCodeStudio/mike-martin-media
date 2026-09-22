"use client";
// import from react
import { useEffect, useState } from "react";
//import from next
import { usePathname } from "next/navigation";
// import components
import ClientVideoFrame from "./clientVideoFrame";
// import data
import { workSampleData } from "../lib/work-samples";
// console.log("workSampleData in WorkGallery:", workSampleData);
// import icons
import { IoCloseCircleOutline } from "react-icons/io5";

export default function WorkGallery({
  selectedCategories,
  excludedCategory,
  numberOfVideos,
  clearSelectedCategories,
  featured,
  // isCaseStudy,
}) {
  const pathname = usePathname();
  const [shuffledVideos, setShuffledVideos] = useState([]);

  const randomizeArray = (array) => {
    return [...array].sort(() => Math.random() - 0.5);
  };

  const caseStudyVideos = workSampleData.filter((sample) =>
    sample.category.includes("Case Study"),
  );

  // filter out caseStudyVideos
  const filteredWorkSampleData = workSampleData.filter(
    (sample) => !caseStudyVideos.includes(sample),
  );

  useEffect(() => {
    // Re-randomize in the client whenever selectedCategories or featured changes
    const shuffled = randomizeArray(filteredWorkSampleData);
    setShuffledVideos(shuffled);
  }, [selectedCategories, featured]);

  const filteredVideos = shuffledVideos.filter((video) => {
    // If featured is set (e.g., "featured-drone"), ensure that video.featured matches
    const isFeaturedMatch = featured ? video.featured === featured : true;

    if (selectedCategories.includes("All")) {
      return isFeaturedMatch;
    }
    const matchesAllSelectedCategories = selectedCategories.every((cat) =>
      video.category.includes(cat),
    );
    const isNotExclusivelyExcluded = !video.category.every((cat) =>
      excludedCategory.includes(cat),
    );

    return (
      isFeaturedMatch &&
      matchesAllSelectedCategories &&
      isNotExclusivelyExcluded
    );
  });

  // console.log("Filtered Videos:", filteredVideos);

  const [isPageLoaded, setIsPageLoaded] = useState(false);

  useEffect(() => {
    if (document.readyState === "complete") {
      setIsPageLoaded(true);
    } else {
      const handleLoad = () => setIsPageLoaded(true);
      window.addEventListener("load", handleLoad);
      return () => window.removeEventListener("load", handleLoad);
    }
  }, []);

  if (!isPageLoaded) {
    return null;
  }

  return (
    <div className="flex justify-center w-full bg-black">
      {filteredVideos.length === 0 ? (
        <div className="text-white text-sm md:text-xl flex flex-col items-center">
          <p>There are no results matching your selections.</p>
          <button className="mt-4" onClick={clearSelectedCategories}>
            <IoCloseCircleOutline size={24} />
          </button>
          <span>clear filters</span>
        </div>
      ) : (
        <div
          className={`w-full h-full grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 ${
            pathname === "/capabilities/live-streaming" ||
            pathname === "/capabilities/animation-motion-graphics" ||
            filteredVideos.length <= 2
              ? "lg:grid-cols-2"
              : "lg:grid-cols-3"
          }`}>
          {filteredVideos.slice(0, numberOfVideos).map((video, index) => (
            <div key={index} className="text-white w-full h-auto">
              {/* {video.category.includes("Photography") ? (
                <PhotoGallery
                  src={video.image_src}
                  client={video.client}
                  title={video.title}
                  alt={video.title}
                  category={video.category}
                  image_src={video.image_src}
                  width={1920}
                  height={1080}
                />
              ) : ( */}
              <ClientVideoFrame
                src={video.src}
                client={video.client}
                title={video.title}
                category={video.category}
                image_src={video.image_src}
                slug={video.slug}
              />
              {/* )} */}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
