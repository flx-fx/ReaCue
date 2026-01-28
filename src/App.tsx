import {ThemeProvider} from "./components/theme-provider";
import MainConfig from "./components/main-config";
import {Toaster} from "@/components/ui/sonner.tsx";
import {useTheme} from "@/components/theme-provider"
import {Analytics} from "@vercel/analytics/react";

export function App() {
    const {theme} = useTheme()

    return <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
        <div className="flex justify-center sm:items-center items-start min-h-screen w-full gap-6">
            <MainConfig/>
        </div>
        <Toaster position="bottom-right" theme={theme}/>
        <Analytics />
    </ThemeProvider>;
}

export default App;