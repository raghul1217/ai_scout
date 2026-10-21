import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/db/prisma";
import { GraduationCap, Lock, Clock } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Manage Learning Vault | Admin | AI Scout",
};

export default async function AdminLearnPage() {
  let resources: any[] = [];
  try {
    resources = await prisma.learningResource.findMany({
      include: { category: true },
      orderBy: { createdAt: "desc" },
    });
  } catch (error) {
    console.warn("DB not ready in admin learn page:", error);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white">Applied Learning Vault</h1>
          <p className="text-xs text-[#A7B2CC] mt-1">
            Tutorials, architectural blueprints, and prompt engineering modules.
          </p>
        </div>
      </div>

      <div className="bg-[#0D1730] border border-[#24314F] rounded-2xl p-6">
        {resources.length === 0 ? (
          <p className="text-xs text-[#6B7FA3]">No learning resources found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#24314F] text-[#6B7FA3] uppercase tracking-wider">
                  <th className="pb-3">Title</th>
                  <th className="pb-3">Difficulty</th>
                  <th className="pb-3">Format</th>
                  <th className="pb-3">Access</th>
                  <th className="pb-3">Hours</th>
                  <th className="pb-3">Link</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#24314F]/50 text-[#A7B2CC]">
                {resources.map((res) => (
                  <tr key={res.id}>
                    <td className="py-3 font-semibold text-white max-w-xs truncate">
                      {res.title}
                    </td>
                    <td className="py-3">{res.difficulty}</td>
                    <td className="py-3">{res.format}</td>
                    <td className="py-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          res.accessLevel === "PREMIUM"
                            ? "bg-[#7C3AED]/20 text-[#9F67FF]"
                            : "bg-[#10B981]/20 text-[#10B981]"
                        }`}
                      >
                        {res.accessLevel}
                      </span>
                    </td>
                    <td className="py-3">~{res.estimatedHours}h</td>
                    <td className="py-3">
                      <Link
                        href={`/learn/${res.slug}`}
                        target="_blank"
                        className="text-[#60A5FA] hover:underline"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
