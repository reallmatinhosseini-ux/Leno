import { StoreProvider } from "@/lib/store";
import Motion from "@/components/Motion";
import { Announcement, BagDrawer, Footer, Header, MobileMenu, QuickView, SearchOverlay, TabBar, Toast } from "@/components/Chrome";
import Welcome from "@/components/Welcome";
import Cursor from "@/components/Cursor";
import PageTransition from "@/components/PageTransition";
import { SignUp } from "@/components/Home";

/* The storefront frame: header, footer, overlays, motion. The admin does not use it. */
export default function StoreShell({ children }: { children: React.ReactNode }) {
  return (
    <StoreProvider>
      <a className="sr skip" href="#view">Skip to content</a>
      <Announcement />
      <Header />
      <main id="view">{children}</main>
      <SignUp />
      <Footer />
      <MobileMenu />
      <SearchOverlay />
      <BagDrawer />
      <QuickView />
      <TabBar />
      <Welcome />
      <Toast />
      <Motion />
      <Cursor />
      <PageTransition />
    </StoreProvider>
  );
}
