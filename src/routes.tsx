import { createRoutesFromElements, Route } from "react-router";
import { RootLayout } from "./routes/layout";
import { HomePage } from "./routes/home";
import { AboutPage } from "./routes/about";
import { DocPage } from "./routes/doc";

export const routes = createRoutesFromElements(
  <Route path="/" element={<RootLayout />}>
    <Route index element={<HomePage />} />
    <Route path="about" element={<AboutPage />} />
    <Route path="doc" element={<DocPage />} />
  </Route>
);
