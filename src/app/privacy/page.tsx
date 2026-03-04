import Link from "next/link";

export default function PrivacyPage() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      <Link href="/" className="text-sm text-orange-600 hover:text-orange-700 mb-8 inline-block">&larr; Back to WarmRoad</Link>
      <h1 className="text-3xl font-bold text-zinc-900 mb-6">Privacy Policy</h1>
      <div className="prose prose-zinc">
        <p className="text-zinc-600 leading-relaxed mb-4">WarmRoad respects your privacy. This policy explains how we handle your information.</p>
        <h2 className="text-xl font-semibold text-zinc-900 mt-6 mb-3">Location Data</h2>
        <p className="text-zinc-600 leading-relaxed mb-4">We request your location only to calculate driving distances to destinations. Your location is processed in your browser and is not stored on our servers.</p>
        <h2 className="text-xl font-semibold text-zinc-900 mt-6 mb-3">Local Storage</h2>
        <p className="text-zinc-600 leading-relaxed mb-4">We use browser localStorage to save your preferences (favorites, dark mode, preferred booking sites). This data stays on your device.</p>
        <h2 className="text-xl font-semibold text-zinc-900 mt-6 mb-3">Third-Party Services</h2>
        <p className="text-zinc-600 leading-relaxed mb-4">We use Open-Meteo for weather data and geocoding. When you click affiliate links (Hotels.com, Expedia, VRBO, Booking.com), those sites have their own privacy policies.</p>
        <h2 className="text-xl font-semibold text-zinc-900 mt-6 mb-3">Contact</h2>
        <p className="text-zinc-600 leading-relaxed">For questions about this privacy policy, please reach out through our website.</p>
      </div>
    </div>
  );
}
