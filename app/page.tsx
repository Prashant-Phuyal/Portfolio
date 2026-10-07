import Nav from "../components/Nav";
import Hero from "../components/Hero";
import About from "../components/About";
import WorkIndex from "../components/WorkIndex";
import AskSite from "../components/AskSite";
import Contact from "../components/Contact";
import { ScrollProgress } from "../components/Motion";
import { findPhoto } from "../lib/photo";

export default function Home() {
  /* Resolved on the server, so a missing photo never renders as a broken image. */
  const photo = findPhoto();

  return (
    <>
      <ScrollProgress />
      <Nav />
      <main id="main">
        <Hero photo={photo} />
        <WorkIndex />
        <AskSite />
        <About />
        <Contact />
      </main>
    </>
  );
}
