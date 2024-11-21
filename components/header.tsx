import { Button } from "@/components/ui/button"
import { MoonIcon, SunIcon } from "@radix-ui/react-icons"

export function Header() {
  return (
    <header className="w-full max-w-4xl flex justify-between items-center">
      <h1 className="text-4xl font-bold text-gray-800">Jenny AI</h1>
      <nav className="flex items-center space-x-4">
        <Button variant="ghost" size="icon">
          <SunIcon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <MoonIcon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
        <Button variant="ghost">Settings</Button>
      </nav>
    </header>
  )
}

