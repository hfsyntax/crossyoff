"use cache"

import Login from "@/components/Login"

export const metadata = {
  title: "Login",
  description: "Login page for CrossyOf.",
}

export default async function Page() {
  return (
    <div className="relative left-0 mt-[100px] flex w-full flex-[1] transform-none select-none flex-col overflow-hidden font-sans xl:left-1/2 xl:w-[1200px] xl:-translate-x-1/2">
      <Login />
    </div>
  )
}
