import { getGuideBySlug } from "@/lib/actions";
import { GuideClient } from "./GuideClient";
import { LocalGuideClient } from "./LocalGuideClient";

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const guide = await getGuideBySlug(resolvedParams.slug);

  if (!guide) {
    return <LocalGuideClient slug={resolvedParams.slug} />;
  }

  return <GuideClient guide={guide} />;
}

