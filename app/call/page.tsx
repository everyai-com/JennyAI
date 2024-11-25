import { CallInterface } from "@/app/components/CallInterface";

export default function CallPage() {
  return (
    <div className="flex min-h-[600px] w-full flex-col items-center justify-center gap-6">
      <div className="rounded-lg border bg-card p-8 shadow-sm">
        <h2 className="mb-6 text-2xl font-semibold tracking-tight">
          Voice Call
        </h2>
        <CallInterface />
      </div>
    </div>
  );
}
