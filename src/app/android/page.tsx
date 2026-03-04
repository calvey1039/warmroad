import Link from "next/link";

export default function AndroidPage() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-12 text-center">
      <Link href="/" className="text-sm text-orange-600 hover:text-orange-700 mb-8 inline-block">&larr; Back to WarmRoad</Link>
      <div className="text-6xl mb-6">{"\uD83D\uDCF1"}</div>
      <h1 className="text-3xl font-bold text-zinc-900 mb-4">WarmRoad for Android</h1>
      <p className="text-zinc-600 leading-relaxed mb-6">
        Take WarmRoad on the go! Our Android app gives you the same great experience with offline support and push notifications for weather changes.
      </p>
      <p className="text-zinc-500 text-sm">Coming soon to the Google Play Store.</p>
    </div>
  );
}
