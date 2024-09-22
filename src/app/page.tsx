import { Suspense } from "react";
import HomeDashboard from "./HomeDashboard";

const HomePage = () => {
  return (
    <Suspense>
      <HomeDashboard />
    </Suspense>
  );
};

export default HomePage;
