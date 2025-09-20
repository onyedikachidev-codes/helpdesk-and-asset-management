import { createClient } from "@/lib/supabase/server";
import { HardDrive } from "lucide-react";
import { updateUserProfile } from "./actions";
import Link from "next/link";
import { redirect } from "next/navigation";
import { notFound } from "next/navigation"; // 1. Import notFound
import AvatarUpload from "@/components/AvatarUpload"; // 2. Import the new component

export default async function ProfilePage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const [profileRes, assetsRes] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", user.id).single(),
    supabase
      .from("assets")
      .select("asset_name, asset_tag")
      .eq("assigned_to", user.id),
  ]);

  const { data: profile } = profileRes;
  const { data: assets } = assetsRes;

  // 3. Add a check in case the profile hasn't been created yet
  if (!profile) {
    notFound();
  }

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-8">My Profile</h1>

      <form action={updateUserProfile}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Profile Card & Notifications */}
          <div className="space-y-8">
            <div className="bg-white p-6 rounded-lg shadow-md border">
              <div className="flex flex-col items-center text-center">
                {/* 4. Replaced the static User icon with the interactive AvatarUpload component */}
                <AvatarUpload profile={profile} />
                <h2 className="text-2xl font-bold mt-4">
                  {profile?.full_name ?? "Employee"}
                </h2>
                <p className="text-gray-600">
                  {profile?.job_title ?? "Job Title"}
                </p>
                <p className="text-sm text-gray-500">
                  {profile?.department ?? "Department"}
                </p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md border">
              <h3 className="text-lg font-semibold mb-4">
                Notification Preferences
              </h3>
              <label
                htmlFor="notifications"
                className="flex items-center justify-between cursor-pointer"
              >
                <span className="text-gray-700">Email Notifications</span>
                <div className="relative">
                  <input
                    id="notifications"
                    name="receive_notifications"
                    type="checkbox"
                    className="sr-only peer"
                    defaultChecked={profile?.receive_notifications ?? true}
                  />
                  <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-800"></div>
                </div>
              </label>
            </div>
          </div>

          {/* Right Column: Details & Assets */}
          <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md border space-y-6">
            <div>
              <h3 className="text-lg font-semibold border-b pb-2 mb-4">
                Contact Information
              </h3>
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={user.email ?? ""}
                    disabled
                    className="mt-1 block w-full bg-gray-100 border-gray-300 shadow-sm p-2 sm:text-sm cursor-not-allowed"
                  />
                </div>
                <div>
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Office Phone
                  </label>
                  <input
                    type="text"
                    id="phone"
                    name="phone_number"
                    defaultValue={profile?.phone_number ?? ""}
                    className="mt-1 block w-full border-gray-300 shadow-sm p-2 focus:border-purple-500 focus:ring-purple-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label
                    htmlFor="location"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Home Address
                  </label>
                  <input
                    type="text"
                    id="location"
                    name="office_location"
                    defaultValue={profile?.office_location ?? ""}
                    className="mt-1 block w-full border-gray-300 shadow-sm p-2 focus:border-purple-500 focus:ring-purple-500 sm:text-sm"
                  />
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold border-b pb-2 mb-4">
                Assigned Assets
              </h3>
              {assets && assets.length > 0 ? (
                <ul className="space-y-3">
                  {assets.map((asset) => (
                    <li
                      key={asset.asset_tag}
                      className="flex items-center text-sm text-gray-700"
                    >
                      <HardDrive className="w-4 h-4 mr-2 text-gray-500" />
                      <span>
                        {asset.asset_name} ({asset.asset_tag})
                      </span>
                    </li>
                  ))}
                  <li className="pt-2">
                    <Link
                      href="/dashboard/assets"
                      className="text-sm text-purple-800 hover:underline"
                    >
                      View all my assets...
                    </Link>
                  </li>
                </ul>
              ) : (
                <p className="text-sm text-gray-500">
                  No assets currently assigned.
                </p>
              )}
            </div>

            <div className="text-right border-t pt-6">
              <button
                type="submit"
                className="bg-purple-800 text-white font-bold py-2 px-6 rounded hover:bg-purple-900 transition-colors"
              >
                Update Profile
              </button>
            </div>
          </div>
        </div>
      </form>
    </main>
  );
}
