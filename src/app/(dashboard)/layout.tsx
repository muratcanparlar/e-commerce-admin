import AppSidebar from "@/components/AppSidebar";
import Navbar from "@/components/Navbar";
import { ThemeProvider } from "@/components/providers/ThemeProvider";

import { SidebarProvider } from "@/components/ui/sidebar";
import { cookies } from "next/headers";
import { getUserFromToken } from "@/lib/auth";
import QueryProvider from "@/components/providers/QueryProvider";
import { ToastContainer } from "react-toastify";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true";

  const user = await getUserFromToken();

  if (!user) {
    return <div>Unauthorized</div>;
  }

  return (
    <QueryProvider>
      <div className="flex">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <SidebarProvider defaultOpen={defaultOpen}>
            <AppSidebar />
            <main className="w-full">
              <Navbar />
              <div className="px-4">{children}</div>
            </main>
          </SidebarProvider>
        </ThemeProvider>
      </div>
      <ToastContainer position="bottom-right" />
    </QueryProvider>
  );
}
